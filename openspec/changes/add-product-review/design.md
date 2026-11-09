# Design

## Context

See proposal.md for motivation and specs/product-reviews/spec.md for the requirements.

Constraints from the current code:
- `User` has only a single `name` and no city. `city` exists only on `Order` (the shipping city per order), so the anonymized reviewer name has to be derived: first word of `User.name` + the reviewed order's `city`.
- `Order` has a `user` and `OrderItem`s with a `product`, and `OrderStatus` includes `DELIVERED`. The status flow is not enforced, so "delivered" is whatever an admin set.
- The backend has no authentication. Existing endpoints take the customer id from the client (for example `GET /api/orders/user/{userId}`), and the frontend keeps the logged-in user in localStorage (`simpleshopUser`).
- Business-rule failures throw `IllegalArgumentException`, which becomes HTTP 400 with `{"message": ...}`. Bean Validation failures become 400 with `"<field>: <message>"`. A `DataIntegrityViolationException` is always reported as "This record is still used by another record and cannot be deleted.", which would be a misleading message for a duplicate review.
- The H2 database is in memory and re-seeded on every start, so no data migration is needed.

## Goals / Non-Goals

**Goals:**
- Add reviews without changing the response shape or behavior of any existing endpoint, so `product-catalog` and `storefront-ui` need no spec deltas.
- Keep the layering the project already uses: entity, repository, service, controller, DTO.

**Non-Goals:**
- Authentication. Introducing real auth would change the "No backend authentication" quirk and needs its own change.
- Seeding sample reviews. The `sample-data` spec stays unchanged; reviews are created through the UI or curl.
- Pagination, moderation, helpful votes, review images.

## Decisions

### D1: Review belongs to an order and a product, not directly to a customer
`Review` has `@ManyToOne Order`, `@ManyToOne Product`, `rating`, `comment` (length 250) and `createdAt`, with a unique constraint on `(order_id, product_id)`. The customer is `review.order.user`, so no separate `user_id` column is stored.
- Because every order has exactly one customer, `(order_id, product_id)` also guarantees one review per customer, product and order.
- Several order lines with the same product in one order count as a single line for reviews: the review is keyed on the order and the product, never on the order line, so such an order still allows only one review for that product.
- Why: the proposal ties a review to an order. Deriving the customer from the order avoids two sources of truth that could disagree.
- Alternative: store `user_id` as well. Rejected as redundant. Ownership checks become `review.getOrder().getUser().getId()`.

### D2: Dedicated `ReviewController` under `/api/reviews`
| Purpose | Endpoint | Notes |
|---|---|---|
| List a product's reviews | `GET /api/reviews?productId={id}` | newest first |
| Create | `POST /api/reviews` | body `{userId, orderId, productId, rating, comment}`; 201 |
| Edit | `PUT /api/reviews/{id}` | body `{userId, rating, comment}`; 200 |
| Delete | `DELETE /api/reviews/{id}?userId={id}` | no body, because some clients drop bodies on DELETE |
| Rating summary | `GET /api/reviews/summary` | `{ "<productId>": {"average": 4.3, "count": 12} }` |

- Everything lives on one controller, so existing controllers are untouched. This also avoids a route clash between `/api/products/ratings` and `/api/products/{id}`.
- `userId` comes from the request, which is the "Customer identity is not authenticated" requirement in the spec. This follows the same trust model as the order endpoints.
- A missing review, order or product is reported as 400, per the existing not-found convention.

### D3: Average rating comes from a separate summary endpoint, not from the product response
`GET /api/reviews/summary` runs a single grouped query (`product id, avg(rating), count`) and returns a map keyed by product id. The products page calls it once next to `getProducts`, and the details page reads the same endpoint.
- Why: adding `averageRating` and `reviewCount` to `Product` would change the product response and force a `product-catalog` delta. One extra request for the whole page is cheap, and it avoids N+1 calls per card.
- Alternative: transient fields on `Product`. Rejected because it changes the existing contract. Alternative: one rating call per card. Rejected as N+1.
- The backend returns the average rounded to one decimal. The frontend rounds to the nearest half star for the star display. Products with no reviews are absent from the map, and the frontend treats absence as "no reviews".

### D4: Validation split between DTOs and the service
- Request DTOs carry Bean Validation: `rating` `@NotNull @Min(1) @Max(5)`, `comment` `@Size(max = 250)`. This produces the `rating: ...` and `comment: ...` messages the spec requires through the existing handler.
- The service checks the business rules in this order, throwing `IllegalArgumentException` with a specific message each time: order exists and belongs to `userId`, order status is `DELIVERED`, the product is on the order, no review exists yet for `(order, product)`.
- The duplicate check uses `existsByOrderIdAndProductId` before saving. This gives a clear message, because the database unique constraint would otherwise surface through the integrity handler as the unrelated "still used" message. The constraint remains as a backstop.
- Edit and delete compare `userId` with the owner and throw if they differ. Edit changes only `rating` and `comment`.

### D5: Response DTO with anonymized name
`ReviewResponse`: `id`, `productId`, `orderId`, `rating`, `comment`, `createdAt`, `reviewerName`. The `Review` entity is never serialized, so the customer's email and full name cannot leak. `orderId` is included so the form can find the signed-in customer's existing review for the selected order. `reviewerName` is built in the service: first word of the trimmed `User.name`, then `", "` and `order.city`.

### D6: Frontend
- `api.js`: `getReviews`, `getReviewSummary`, `createReview`, `updateReview`, `deleteReview`.
- New components: `StarRating` (read-only full, half and empty stars from a value; greyed variant for no reviews), `ReviewList`, `ReviewForm`.
- `ProductCard` gets a rating line below the price/stock row. `Products` and `Home` (wherever `ProductCard` is used) load the summary once and pass each product's entry down.
- `ProductDetails` renders `ReviewForm` below the "Add to Cart" button and `ReviewList` at the bottom.
- `ReviewForm` visibility is decided on the client. It reads the logged-in user from localStorage, calls `getOrdersByUser`, and keeps orders with status `DELIVERED` that contain the product. If none, it renders nothing. The orders come from `/api/orders/user/{id}` newest first, and the form is bound to the first one, which is the latest order. The dropdown is rendered only when there is more than one such order; it lists them in that same order and loads the latest on page load. With exactly one order there is no dropdown and the form is for that order. For the selected order the form pre-fills from the product's reviews matched by `orderId`, and shows Save and Delete when a review exists, otherwise Submit. A required rating is checked in the browser before submitting.
- The backend still enforces eligibility independently, because the frontend check is only a UI convenience.

## Vertical slices

The work is split into thin end-to-end slices, each one leaving the app working and verifiable in the running webshop. The slice list and the individual tasks are in tasks.md; this is which layers each slice touches.

| # | Slice (user-visible outcome) | Layers touched |
|---|---|---|
| 1 | Customer can give a star rating on the Details page (walking skeleton) | database (`Review`), service, API (`POST`), UI (form) |
| 2 | Visitors can read the reviews | service and API (`GET` list, reviewer name), UI (`StarRating`, `ReviewList`) |
| 3 | A product can be reviewed only once per order | database (unique constraint), service, UI (shows the refusal) |
| 4 | Shoppers see the average rating on product cards | data access and API (summary), UI (card, `StarRating` variant) |
| 5 | Customer can add an optional comment | API validation and service, UI (textarea, list) |
| 6 | Only customers who received the product can review it | service rules; UI gate already exists, verified end to end |
| 7 | Customer can choose which delivered order to review (only when there is more than one) | UI only; the backend already accepts a review per order |
| 8 | Customer can edit their own review | service and API (`PUT`), UI (Save) |
| 9 | Customer can delete their own review | service and API (`DELETE`), UI (Delete) |
| 10 | Whole feature works together | integration check only |

## Risks / Trade-offs

- [Spoofable identity] Any client can post, edit or delete as any `userId` → accepted, consistent with the baseline "No backend authentication" requirement and written into the spec as an explicit requirement. Fixing it belongs to a future auth change.
- [Status changes after review] The order status flow is not enforced, so an admin could move an order away from `DELIVERED` after a review exists → the review stays, and eligibility is checked only at submit, edit and delete time (and by the frontend for form visibility). Accepted.
- [Misleading integrity error] A duplicate that races past the pre-check would be reported through the generic "still used" message → very unlikely in a single-user demo, and the pre-check covers normal use.
- [Deleting products] The foreign keys from reviews to products and orders block deleting a reviewed product, with the existing integrity message. This adds no new restriction, because a product on an order was already undeletable and every review requires such an order.
- [Extra request on product pages] The summary call is one more round trip → acceptable for a local demo and avoids changing the product contract. If it fails, the cards can show the "no reviews" state without blocking the page.
- [Stale average] The average is computed on read, so it is always current. There is no caching and no denormalized column to keep in sync.
- [Manual verification only] The only automated test is the Spring context-load test, so verification relies on curl and manual UI checks (see tasks).
