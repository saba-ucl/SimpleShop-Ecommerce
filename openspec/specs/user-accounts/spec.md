# user-accounts Specification

## Purpose
Defines user registration, login, listing and the client-side session for SimpleShop. Authentication is a simple credential check without tokens; "session" is the user object kept in browser localStorage.

## Requirements

### Requirement: User data model
The system SHALL represent a user with `id`, `name`, unique `email`, `password` (write-only) and `role` (`USER` or `ADMIN`).

#### Scenario: User response
- **WHEN** a user is returned
- **THEN** it contains `id, name, email, role` and no password

### Requirement: Register
The system SHALL create an account via `POST /api/users/register` returning 201 with the user. `name` MUST be non-blank, `email` MUST be a non-blank valid email, and `password` MUST be non-blank (no minimum length on the backend). The email SHALL be stored lowercased and the role SHALL always be `USER`.

#### Scenario: Successful registration
- **WHEN** valid details are posted
- **THEN** the response is 201 with role `USER`

#### Scenario: Duplicate email
- **WHEN** the email matches an existing one, ignoring case
- **THEN** the response is 400 "Email is already registered."

#### Scenario: Role cannot be chosen
- **WHEN** the client attempts to supply role ADMIN
- **THEN** the created user still has role `USER`

### Requirement: Login
The system SHALL authenticate via `POST /api/users/login` with `email` and `password`, matching email case-insensitively, and return 200 with the user. No token SHALL be issued.

#### Scenario: Valid credentials
- **WHEN** email and password match
- **THEN** the response is 200 with the user

#### Scenario: Invalid credentials
- **WHEN** the email is unknown or the password is wrong
- **THEN** the response is 400 "Invalid email or password."

### Requirement: List users
The system SHALL return all users from `GET /api/users`.

#### Scenario: Unauthenticated listing
- **WHEN** any client calls the endpoint
- **THEN** the response is 200 with all users

### Requirement: Client-side session
The frontend SHALL keep the logged-in user in localStorage under `simpleshopUser`, and logout SHALL clear it while keeping the cart.

#### Scenario: Logout
- **WHEN** the user clicks Logout
- **THEN** `simpleshopUser` is removed and the app navigates to `/`
- **AND** the saved cart remains

### Requirement: Registration and login flow in the UI
After registering, the frontend SHALL NOT log the user in; it SHALL show "Registration successful. You can now log in." and redirect to `/login` after about 900 ms. After login it SHALL go to the originally requested location if present, otherwise `/admin` for ADMIN and `/` for others. The register form requires a password of at least 4 characters.

#### Scenario: Admin login
- **WHEN** an ADMIN logs in with no saved destination
- **THEN** the app navigates to `/admin`

### Requirement: Unsupported account operations
The system SHALL NOT provide password reset, profile edit or user deletion.

#### Scenario: Missing endpoints
- **WHEN** a client calls `PUT` or `DELETE` on `/api/users/{id}`
- **THEN** the request is rejected by the framework (no such route)
