Add Product Reviews

Why
Customers currently have no way to share their experience with a product, and other shoppers have no social proof to help them decide. Letting verified buyers rate and comment on products builds trust and helps customers choose the right product.

What Changes
Customers can give a product a star rating from 1 to 5 (required).
Customers can add an optional short comment, max 250 characters, together with their rating.
Only customers who have purchased the product (i.e their order has status 'DELIVERED') can review it. Others cannot submit a review.
Products page: each product card shows the average star rating, placed below the price and stock level.
Details page:
A review form is added below the "Add to Cart" button (star rating required, comment optional).
All existing reviews for the product are shown in a list at the bottom of the page.
The reviewer's name is shown anonymized, e.g. first name and city ("Susie, Aarhus").

A customer may leave a review for every order, they have purchased the product in - so a review should be attached to an order, not the product. 

A customer can edit or delete their own review

The average shown: e.g. "4.3 ★ (12 reviews)" is shown using half stars

When a product has no reviews yet, the card shows 5 greyed out stars to symbolize not enabled yet - and a text saying: No reviews in yet

Only logged in customers who have the product in one or more orders with status 'Delivered' should see the review form. Non-buyers dont see anything.

A customer sees one review form. When they have more than one delivered order containing the product, the form has a dropdown to choose the order they want to add, edit or delete the review for; on page load the form shows the latest of those orders. With exactly one such order there is no dropdown: the form is for that order and shows its existing review, if any.

Reviews are listed with newest first.

Product reviews are shown on the product page, when they are submitted. No review or approval from admin necessary.

Capabilities

New Capabilities
product-reviews: submitting, validating and displaying star ratings and comments for products, restricted to verified buyers (their order has status 'DELIVERED').

Modified Capabilities
None (the Products and Details pages are extended, but their existing behavior is unchanged).

Impact
Data model: new review entity (order, product, customer, rating, comment, created date).
Business logic: check that the customer has a completed purchase of the product before allowing a review (order has status DELIVERED).
Products page: product card extended with average rating.
Details page: new review form and review list.
Customer data: first name and city must be available for the anonymized display name.

Open Questions

