# User Profile Management Project

## Project Overview

This project aims to develop a user profile management for a social networking application. The project allow users to view and edit their personal information.

## Design choices

1. Vitejs as dev tool - chosen because of its speed and simplicity of configuration.

2. Primereact as component library - chosen because of beautiful and smooth ui components. And each component can be imported individually so that I only bundle what I use.

3. Regular css - chosen it is perfect for a small project like this.

4. Decided to structure the project the way how it is now. Rendering a list of users and based on the selection, rendering the profile view. This way, we can use invalidation of tanstack queries feature.

5. Decided to extract and keep the DialogContent component below the UserPofile component. Extraction as a seperation of concerns to keep the UserProfile clean and to serve only two things: proview view and toggling Edit Modal. I kept DialogContent below the UserProfile because we don't have to have a seperate file. DialogContent is only needed there.

6. Formik & Yup - chosen for handling forms. Easy to use and Yup integrates perfectly with Formik.

## Setup & running tests

To run this project, follow these steps:

1. Clone the repository: `https://github.com/OlimovS/md-frontend-challenge`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Access the application in your browser at `http://localhost:5173/`

To run the tests: `npm run test`

## Technologies Used

- React
- React Query
- Mock Server (MSW)
- Jest, React Testing Library
- Typescript
- Formik
- Yup

## Functionality

### React Component Documentation

#### 1. App

The `App` component serves as the main component of the application. It allows users to select a user from a dropdown menu and displays the profile view of the selected user.

#### Component Structure

##### Dropdown Menu:

- Allows users to select a user from the list of available options.

##### UserProfile:

- Displays the profile view of the selected user.
- Renders "Edit" button to open a modal to edit user data

#### 2. UserProfile

#### Component Structure

##### Profile View:

- Displays user profile information such as name, bio, email, and profile picture.
- Provides an "Edit" button to trigger the edit modal.

##### Edit Modal:

- Displays a form for editing user profile information.
- Validates form inputs using Yup schema.
- Handles form submission and updates user data via API. It invalidates queries: USER_EMAILS_QUERY_KEY, USER_QUERY_KEY allowing them to be re-fetched and thereby updating the view with the latest data.

### Endpoints

#### 1. GET /api/users

- **Description:** Retrieves a list of users with their email and ID.
- **Response:** Returns an array of user objects with email and ID.

#### 2. GET /api/user/:id

- **Description:** Retrieves user details by ID.
- **Parameters:**
  - `id` (string): User ID.
- **Response:** Returns the user object with all details including name, email, bio, and profile picture.

#### 3. PATCH /api/update-profile

- **Description:** Updates user profile data.
- **Request Body:**
  - `id` (string): User ID.
  - Additional fields for editing user data (name, email, bio).
- **Response:** Returns the updated user public data.
