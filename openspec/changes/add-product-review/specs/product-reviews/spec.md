# Spec Delta

## Purpose

Lets customers who have received a product rate it from 1 to 5 stars with an optional comment, and shows the ratings to all shoppers as social proof on the products page and the product details page.

## ADDED Requirements

### Requirement: Review data model
The system SHALL represent a review with `id`, the reviewed `order` and `product`, the reviewing customer, `rating` (integer 1-5), optional `comment` (up to 250 characters) and a created timestamp. A review SHALL belong to exactly one order and one product on that order.

#### Scenario: Review response
- **WHEN** a review is returned
- **THEN** it contains `id`, `rating`, `comment`, the created date and the anonymized reviewer name
- **AND** it contains no email, password or full customer name

### Requirement: Rating and comment validation
The system SHALL require `rating` to be a whole number from 1 to 5 and SHALL accept `comment` as absent, empty or at most 250 characters. Violations SHALL be rejected with HTTP 400 and the standard error shape.

#### Scenario: Missing rating
- **WHEN** a client submits a review without a `rating`
- **THEN** the response status is 400
- **AND** the message starts with "rating: "

#### Scenario: Rating out of range
- **WHEN** a client submits a review with `rating` 0 or 6
- **THEN** the response status is 400

#### Scenario: Comment too long
- **WHEN** a client submits a review with a 251-character comment
- **THEN** the response status is 400
- **AND** the message starts with "comment: "

#### Scenario: Rating only
- **WHEN** a client submits a valid rating with no comment
- **THEN** the review is created

### Requirement: Only delivered purchases can be reviewed
The system SHALL accept a review only if the given order belongs to the submitting customer, has status `DELIVERED` and contains the given product. Otherwise it SHALL respond with HTTP 400 and a descriptive message.

#### Scenario: Delivered order
- **WHEN** a customer submits a valid review for a product on their own `DELIVERED` order
- **THEN** the response is 201 with the created review

#### Scenario: Order not delivered
- **WHEN** a customer submits a review for a product on an order with status `PENDING`, `CONFIRMED`, `SHIPPED` or `CANCELLED`
- **THEN** the response status is 400
- **AND** no review is stored

#### Scenario: Someone else's order
- **WHEN** a customer submits a review referencing an order that belongs to another customer
- **THEN** the response status is 400

#### Scenario: Product not on the order
- **WHEN** a customer submits a review for a product that is not on the referenced order
- **THEN** the response status is 400

### Requirement: One review per order and product
The system SHALL allow at most one review per order and product. A customer with several delivered orders containing the same product MAY review the product once for each such order.

#### Scenario: Duplicate for the same order
- **WHEN** a customer submits a second review for the same product on the same order
- **THEN** the response status is 400
- **AND** the existing review is unchanged

#### Scenario: Same product on another order
- **WHEN** a customer reviews a product on a second delivered order that also contains it
- **THEN** the review is created in addition to the first

### Requirement: Edit own review
The system SHALL let a customer change the `rating` and `comment` of their own review, with the same validation as creation. The order, product and created date SHALL NOT change.

#### Scenario: Edit rating and comment
- **WHEN** the owning customer updates a review with a new valid rating and comment
- **THEN** the response is 200 with the updated review

#### Scenario: Edit someone else's review
- **WHEN** a customer attempts to update a review that belongs to another customer
- **THEN** the response status is 400
- **AND** the review is unchanged

### Requirement: Delete own review
The system SHALL let a customer delete their own review. After deletion the customer MAY submit a new review for the same order and product.

#### Scenario: Delete own review
- **WHEN** the owning customer deletes a review
- **THEN** the response is successful and the review no longer appears in the product's list or average

#### Scenario: Delete someone else's review
- **WHEN** a customer attempts to delete a review that belongs to another customer
- **THEN** the response status is 400
- **AND** the review remains

### Requirement: Customer identity is not authenticated
The system SHALL identify the acting customer from the customer id sent by the client, consistent with the absence of backend authentication. Ownership and delivered-purchase checks are therefore enforced against that id, but a client that sends another customer's id MAY act as that customer.

#### Scenario: Unauthenticated client
- **WHEN** a client sends a valid review for a customer id and order without any credentials
- **THEN** the request is evaluated only on the ownership, status and product rules above

### Requirement: Product review list
The system SHALL return all reviews of a product, newest first, with no approval or moderation step. Each review SHALL appear immediately after it is submitted.

#### Scenario: Newest first
- **WHEN** a product has reviews created at different times
- **THEN** the list is ordered by created date, newest first

#### Scenario: No reviews
- **WHEN** a product has no reviews
- **THEN** the list is empty

### Requirement: Anonymized reviewer name
The system SHALL display each reviewer as their first name followed by the city of the reviewed order, in the form "Susie, Aarhus". The first name SHALL be the first word of the customer's name.

#### Scenario: Name and city
- **WHEN** customer "Susie Balle" reviews a product on an order shipped to Aarhus
- **THEN** the reviewer is shown as "Susie, Aarhus"

### Requirement: Average rating per product
The system SHALL provide, for each product, the average rating and the number of reviews, so that the products page and the details page can show them. The average SHALL be calculated over all current reviews of the product.

#### Scenario: Average and count
- **WHEN** a product has reviews rated 5, 4 and 4
- **THEN** its average is 4.3 (rounded to one decimal) and its count is 3

#### Scenario: Edit and delete update the average
- **WHEN** a review is edited or deleted
- **THEN** the product's average and count reflect the change

### Requirement: Rating display on product card
The products page SHALL show each product's average rating on its card, below the price and stock level, as filled, half-filled and empty stars rounded to the nearest half star, followed by text such as "4.3 ★ (12 reviews)".

#### Scenario: Product with reviews
- **WHEN** a product with average 4.3 and 12 reviews is shown
- **THEN** the card shows 4 full stars and 1 half star
- **AND** the text "4.3 ★ (12 reviews)"

#### Scenario: Product without reviews
- **WHEN** a product has no reviews
- **THEN** the card shows five greyed-out stars and the text "No reviews in yet"

### Requirement: Review list on details page
The product details page SHALL show all reviews of the product in a list at the bottom of the page, newest first, each with stars, comment (if any), date and anonymized reviewer name.

#### Scenario: Reviews displayed
- **WHEN** a visitor, logged in or not, opens the details page of a product with reviews
- **THEN** all its reviews are listed at the bottom, newest first

### Requirement: Review form visibility
The details page SHALL show the review form below the "Add to Cart" button only to a logged-in customer who has at least one `DELIVERED` order containing the product. All other visitors SHALL see no form and no explanatory message.

#### Scenario: Eligible customer
- **WHEN** a logged-in customer with a delivered order containing the product opens its details page
- **THEN** the review form is shown below "Add to Cart"

#### Scenario: Not logged in
- **WHEN** a visitor who is not logged in opens the details page
- **THEN** no review form and no message about reviewing is shown

#### Scenario: No delivered purchase
- **WHEN** a logged-in customer whose orders with the product are all not `DELIVERED`, or who never ordered it, opens the page
- **THEN** no review form and no message about reviewing is shown

### Requirement: Order selection in review form
The review form SHALL show a single form with a dropdown listing the customer's delivered orders containing the product. Choosing an order SHALL load that order's existing review for editing or deleting, or an empty form if none exists. A star rating SHALL be required and the comment optional, limited to 250 characters.

#### Scenario: Several delivered orders
- **WHEN** a customer has three delivered orders containing the product
- **THEN** one form is shown with a dropdown of those three orders

#### Scenario: Order already reviewed
- **WHEN** the customer selects an order that already has a review
- **THEN** the form is filled with that review's rating and comment
- **AND** the customer can save changes or delete the review

#### Scenario: Submit without rating
- **WHEN** the customer submits the form without choosing a star rating
- **THEN** the form is not submitted and a message tells the customer a rating is required

#### Scenario: Published immediately
- **WHEN** the customer submits a valid review
- **THEN** it appears in the review list and the average updates without admin approval
