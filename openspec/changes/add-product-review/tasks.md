# Tasks

Each group is one thin end-to-end slice (database, data access, service, API and UI where affected) that leaves the app working. Verification uses curl or the running webshop (backend :8181, frontend :3000); the only automated test is the Spring context-load test. To get a `DELIVERED` order for testing, set one with `PUT /api/orders/{id}/status`.

## 1. Customer can give a star rating on the Details page (walking skeleton)

- [x] 1.1 Add the `Review` entity (order, product, rating, comment, createdAt) and `ReviewRepository`, and verify the backend starts and the Spring context-load test passes.
- [x] 1.2 Add `ReviewRequest` (`userId`, `orderId`, `productId`, `rating` `@NotNull @Min(1) @Max(5)`) and `ReviewResponse`, a `ReviewService.create` that stores the review for an existing order and product, and `POST /api/reviews` returning 201. Verify with curl that a valid request returns 201 and that a missing rating, 0 and 6 return 400 with a message starting "rating: ".
- [x] 1.3 Add `createReview` to `api.js` and a basic `ReviewForm` below "Add to Cart" on `ProductDetails`: shown only to a logged-in customer (from `simpleshopUser`) who has a `DELIVERED` order containing the product, using their first such order, with clickable 1-5 stars and a Submit button that requires a rating. Verify end to end in the browser: a logged-out visitor and a customer without a delivered order see nothing; an eligible customer picks 4 stars, submits, sees a confirmation, and the review is stored (check with curl or the H2 console).

## 2. Visitors can read the reviews on the Details page

- [x] 2.1 Add `GET /api/reviews?productId=` (newest first) and the anonymized `reviewerName` (first word of the user's name, then ", " and the order's city) to `ReviewResponse`. Verify with curl that a review by "Susie Balle" on an order shipped to Aarhus appears as "Susie, Aarhus", that no email or full name is in the response, and that two reviews come back newest first.
- [x] 2.2 Add `getReviews`, the read-only `StarRating` component and a `ReviewList` at the bottom of `ProductDetails` (stars, comment if any, date, reviewer name). Verify end to end in the browser: a logged-out visitor sees the reviews newest first; a product with no reviews shows an empty list without errors; a review submitted through the form from slice 1 appears in the list without a page reload.

## 3. Customer can review a product only once per order

- [x] 3.1 Add the unique constraint on `(order_id, product_id)` to `Review` and an `existsByOrderIdAndProductId` check in `ReviewService.create` that returns a clear 400 message (so the generic "still used by another record" message is never shown for a duplicate). Several order lines with the same product count as one. Verify with curl: a second review for the same order and product returns 400 with the clear message and the first review is unchanged (check with `GET /api/reviews?productId=`); the same product on a second order (set to `DELIVERED`) still returns 201.
- [ ] 3.2 Make sure `ReviewForm` shows the backend's message when a duplicate is refused, without adding a second review to the list. Verify end to end in the browser: as a customer who already reviewed the product on their order, pick stars and submit again; the message is shown, the review list still has one review for that order, and nothing else on the page breaks. (The order dropdown and edit/delete come in later slices; until then the form targets the customer's first delivered order.)

## 4. Shoppers can see the average rating on the product cards

- [ ] 4.1 Add `GET /api/reviews/summary` (one grouped query, average rounded to one decimal and count, products without reviews omitted). Verify with curl that ratings 5, 4, 4 give average 4.3 and count 3, and that an unreviewed product is absent. Use three different orders for the three reviews, since one review per order and product is now enforced.
- [ ] 4.2 Add `getReviewSummary`, the greyed-out `StarRating` variant and the rating line on `ProductCard` below price and stock ("4.3 ★ (12 reviews)" with half-star rounding, or five grey stars and "No reviews in yet"), loading the summary once in `Products` and `Home`. Verify end to end in the browser on `/` and `/products`: a reviewed product shows 4 full stars, 1 half star and "4.3 ★ (3 reviews)" for ratings 5, 4, 4; an unreviewed one shows the grey state; a new review changes the average on reload; cards still render if the summary request fails.

## 5. Customer can add an optional comment of up to 250 characters

- [ ] 5.1 Add `comment` (`@Size(max = 250)`, optional) to the request, the service and the response. Verify with curl that no comment and an empty comment return 201, a 250-character comment returns 201, and a 251-character comment returns 400 with a message starting "comment: ". Use a fresh order for each request that should succeed.
- [ ] 5.2 Add the comment textarea (limit 250, with a character counter) to `ReviewForm` and show the comment in `ReviewList`. Verify end to end in the browser: submit a rating with a comment and see it in the list; submit a rating without a comment and see the review without a comment line; the textarea does not accept more than 250 characters.

## 6. Only customers who received the product can review it

- [ ] 6.1 Enforce in `ReviewService.create`, in this order and with a specific 400 message each: the order belongs to `userId`, its status is `DELIVERED`, the product is on the order (several lines of the same product count as one), and then the existing duplicate check. Verify with curl, using `PUT /api/orders/{id}/status` to prepare orders: a `DELIVERED` own order returns 201; `PENDING`, `CONFIRMED`, `SHIPPED` and `CANCELLED` orders, another customer's order, and a product not on the order each return 400 and store nothing.
- [ ] 6.2 Check the end-to-end behavior in the running webshop: a customer whose only order with the product is `SHIPPED` sees no form and no message; after the admin sets it to `DELIVERED` and the page reloads, the form appears; submitting works. Verify the same steps with a logged-out visitor, who still sees no form.

## 7. Customer can choose which delivered order to review

- [ ] 7.1 Add the order dropdown to `ReviewForm`: one form with a dropdown of the customer's delivered orders containing the product, defaulting to the first, with the existing review for the selected order (matched by `orderId`) loaded into the form. For now an already-reviewed order shows the review read-only and no Submit button. Verify end to end in the browser with a customer who has two delivered orders containing the product: one form with two choices; reviewing the first order and then switching to the second gives an empty form that accepts a second review; switching back shows the first review.

## 8. Customer can edit their own review

- [ ] 8.1 Add `ReviewUpdateRequest` (`userId`, `rating`, `comment`), `ReviewService.update` (owner check against the order's user; only rating and comment change) and `PUT /api/reviews/{id}`. Verify with curl: the owner's update returns 200 and the list and summary reflect it; another user's update returns 400 and leaves the review unchanged; an invalid rating or a 251-character comment returns 400.
- [ ] 8.2 Add `updateReview` to `api.js` and make `ReviewForm` editable for an already-reviewed order with a Save button. Verify end to end in the browser: change 4 stars to 2 and edit the comment, save, and see the list and the product card average change without a reload.

## 9. Customer can delete their own review

- [ ] 9.1 Add `ReviewService.delete` (owner check) and `DELETE /api/reviews/{id}?userId=`. Verify with curl: the owner's delete succeeds and the review leaves the list and the summary; another user's delete returns 400 and the review remains; a new review for the same order and product can then be created.
- [ ] 9.2 Add `deleteReview` to `api.js` and a Delete button on `ReviewForm` for an already-reviewed order. Verify end to end in the browser: delete a review, see it disappear from the list, see the card average update (or return to "No reviews in yet" when it was the only one), and see an empty form for that order that accepts a new review.

## 10. Whole feature works together

- [ ] 10.1 Run through every scenario in `specs/product-reviews/spec.md` against the running app, restart the backend to confirm it starts clean with the in-memory database, and confirm the existing product, order and admin pages still work. Verify `openspec validate add-product-review --strict` passes.

## Workflow follow-up

- Archive the change after the checks above pass.
