# Tasks

## 1. Backend: data model

- [ ] 1.1 Add the `Review` entity (order, product, rating, comment max 250, createdAt) with a unique constraint on `(order_id, product_id)`, and a `ReviewRepository` with `findByProductIdOrderByCreatedAtDesc`, `existsByOrderIdAndProductId` and a grouped query for average and count per product. Verify the backend starts on :8181 and the `reviews` table exists (H2 console, or no startup error plus the Spring context-load test passing).

## 2. Backend: service and API

- [ ] 2.1 Add request DTOs (`ReviewRequest` with `userId`, `orderId`, `productId`, `rating` `@NotNull @Min(1) @Max(5)`, `comment` `@Size(max = 250)`; `ReviewUpdateRequest` with `userId`, `rating`, `comment`) and `ReviewResponse` (`id`, `productId`, `orderId`, `rating`, `comment`, `createdAt`, `reviewerName`). Verify with curl that a missing rating returns 400 with a message starting "rating: ", rating 0 and 6 return 400, and a 251-character comment returns 400 with a message starting "comment: ".
- [ ] 2.2 Implement `ReviewService.create` with the rules in this order: order exists and belongs to `userId`, status is `DELIVERED`, product is on the order (any number of lines counts as one), no review exists yet for `(order, product)`. Throw `IllegalArgumentException` with a specific message for each. Verify with curl: a review on a `DELIVERED` order of the right user returns 201; `PENDING`/`SHIPPED`/`CANCELLED` orders, another user's order, a product not on the order, and a second review for the same order and product each return 400 and store nothing. Use `PUT /api/orders/{id}/status` to prepare orders in each status.
- [ ] 2.3 Implement `update` (changes only rating and comment; owner check against `order.user.id`) and `delete` (owner check, userId from the query string). Verify with curl: the owner's PUT returns 200 and the review changes; another user's PUT and DELETE return 400 and leave the review unchanged; the owner's DELETE succeeds and a new review for the same order and product can then be created.
- [ ] 2.4 Build `reviewerName` (first word of the trimmed user name, `", "`, the order's city) and the list and summary queries. Verify with curl: a review by user "Susie Balle" on an order shipped to Aarhus shows "Susie, Aarhus"; the response contains no email or full name; the list is newest first; the summary shows average rounded to one decimal and the count (for example ratings 5, 4, 4 give 4.3 and 3), updates after an edit or delete, and omits products with no reviews.
- [ ] 2.5 Add `ReviewController` with `GET /api/reviews?productId=`, `POST /api/reviews` (201), `PUT /api/reviews/{id}`, `DELETE /api/reviews/{id}?userId=` and `GET /api/reviews/summary`. Verify with curl that each route works, that an unknown review, order or product id returns 400 with the standard `{"message": ...}` body, and that the existing product and order endpoints still return the same responses as before.

## 3. Frontend: shared pieces

- [ ] 3.1 Add `getReviews`, `getReviewSummary`, `createReview`, `updateReview` and `deleteReview` to `frontend/src/services/api.js`. Verify in the browser network tab that each call hits the matching endpoint with the right method and parameters.
- [ ] 3.2 Add a read-only `StarRating` component that renders full, half and empty stars rounded to the nearest half star, plus a greyed-out variant. Verify visually with values 0, 3.2, 4.3 and 5: 4.3 shows 4 full stars and 1 half star, and the no-reviews variant shows five grey stars.

## 4. Frontend: products page

- [ ] 4.1 Load the rating summary once in `Products` and `Home` and pass each product's entry to `ProductCard`. Show the stars below the price and stock row with text like "4.3 ★ (12 reviews)", or five greyed-out stars and "No reviews in yet" when the product has none. Verify on `/` and `/products` that a reviewed product shows its average, count and stars, an unreviewed one shows the grey state, and the page still renders its cards if the summary request fails (stop the summary endpoint, or block it in dev tools).

## 5. Frontend: details page

- [ ] 5.1 Add `ReviewList` at the bottom of `ProductDetails`: stars, comment (if any), date and reviewer name, newest first, visible to logged-out visitors too. Verify with two reviews created at different times that the newer one is listed first, and that a product without reviews shows an empty list without errors.
- [ ] 5.2 Add `ReviewForm` below the "Add to Cart" button. It reads `simpleshopUser`, loads the user's orders, and keeps `DELIVERED` orders containing the product. If there are none, or nobody is logged in, render nothing and no message. Verify as a logged-out visitor, a customer with only non-delivered orders, a customer who never ordered the product, and a customer with a delivered order: only the last sees the form.
- [ ] 5.3 Add the order dropdown (only one form even with several delivered orders), pre-fill from the existing review matched by `orderId`, show Save and Delete for an existing review and Submit otherwise, and require a star rating in the browser with a comment limit of 250 characters. Verify end to end: submit without a rating shows a message and sends nothing; submit with a rating adds the review to the list and updates the average without a reload; selecting another order switches to an empty form or that order's review; edit and delete work and update the list and the average.

## 6. Integration check

- [ ] 6.1 Walk through the spec's scenarios against the running app (backend :8181, frontend :3000), including a customer with two delivered orders containing the same product (two reviews allowed, a second one for the same order refused), then a restart to confirm the app starts clean with the in-memory database. Verify with `openspec validate add-product-review --strict` passing and all requirement scenarios in `specs/product-reviews/spec.md` behaving as written.

## Workflow follow-up

- Archive the change after the manual checks above pass.
