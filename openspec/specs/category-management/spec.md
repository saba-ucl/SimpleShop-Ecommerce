# category-management Specification

## Purpose
Defines the category resource exposed by `/api/categories`, used to group products. Includes the uniqueness and deletion rules and documents current validation gaps.

## Requirements

### Requirement: Category data model
The system SHALL represent a category with `id`, a unique non-null `name` and an optional `description` (max 500). A category's product list SHALL NOT be serialized.

#### Scenario: Category response
- **WHEN** a category is returned
- **THEN** it contains `id`, `name` and `description` only

### Requirement: List and get categories
The system SHALL return all categories from `GET /api/categories` and one from `GET /api/categories/{id}`.

#### Scenario: Missing category
- **WHEN** the id does not exist
- **THEN** the response is 400 "Category not found with id: {id}"

### Requirement: Create category
The system SHALL create a category via `POST /api/categories` and return 201. Names MUST be unique, compared case-insensitively.

#### Scenario: Duplicate name
- **WHEN** a category named "books" is posted and "Books" exists
- **THEN** the response is 400 "Category name already exists."

### Requirement: Update category
The system SHALL update name and description via `PUT /api/categories/{id}` and return 200.

#### Scenario: Update succeeds
- **WHEN** a valid body is sent for an existing id
- **THEN** the response is 200 with the updated category

### Requirement: Delete category
The system SHALL delete a category via `DELETE /api/categories/{id}` returning 204, but SHALL refuse while any product references it.

#### Scenario: Category has products
- **WHEN** a category with products is deleted
- **THEN** the response is 400 "Cannot delete a category that still has products."

#### Scenario: Empty category
- **WHEN** a category without products is deleted
- **THEN** the response is 204

### Requirement: Known limitations
The system currently has no Bean Validation on categories and no duplicate-name check on update. These gaps SHALL be treated as current behavior until changed.

#### Scenario: Null name on create
- **WHEN** a category is posted without a name
- **THEN** the database constraint fails and the response is 400 "This record is still used by another record and cannot be deleted." (misleading message)

#### Scenario: Duplicate name on update
- **WHEN** a category is renamed to an existing name
- **THEN** the database unique constraint fails with the same misleading 400 message
