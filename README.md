# URL Shortener

A full-stack URL shortening service built with Node.js, Express, and MongoDB. Users can sign up, log in, generate short links for long URLs, and track click analytics for each link.

## Features

- **User authentication** — signup/login with JWT-based sessions stored in cookies
- **URL shortening** — generate a unique short ID for any long URL using `shortid`
- **Redirects** — visiting a short URL redirects to the original long URL
- **Click analytics** — track total visits and timestamp history for each shortened URL
- **Per-user dashboard** — logged-in users only see the URLs they created
- **Server-rendered views** — EJS templates for home, login, and signup pages

## Tech Stack

- **Backend:** Node.js, Express 5
- **Database:** MongoDB with Mongoose
- **Templating:** EJS
- **Auth:** JSON Web Tokens (`jsonwebtoken`), cookies via `cookie-parser`
- **Short ID generation:** `shortid`
- **Dev tooling:** `nodemon`

## Project Structure

```
URL-SHORTENER/
├── connect.js              # MongoDB connection setup
├── index.js                # App entry point, route mounting, redirect handler
├── controllers/
│   ├── auth.js              # Signup / login logic
│   └── url.js                # URL creation and analytics logic
├── middleware/
│   └── auth.js              # Route protection (restrictToLoggedinUserOnly, checkAuth)
├── models/
│   ├── url.js                # URL schema (shortId, redirectURL, visitHistory, createdBy)
│   └── user.js                # User schema (name, email, password)
├── routes/
│   ├── auth.js                # /user routes (signup, login)
│   ├── url.js                  # /url routes (create, analytics)
│   └── staticRouter.js    # / routes (home, login, signup pages)
├── service/
│   └── auth.js                # JWT sign/verify helpers
└── views/
    ├── home.ejs
    ├── login.ejs
    └── signup.ejs
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- A MongoDB instance (local or Atlas)

### Installation

1. Clone the repo
   ```bash
   git clone https://github.com/param-sangha/URL-SHORTENER.git
   cd URL-SHORTENER
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory
   ```env
   MONGO_URL=your_mongodb_connection_string
   ```

4. Run the server
   ```bash
   npm run dev     # with nodemon (auto-restart)
   # or
   npm start       # plain node
   ```

5. The app will be running at `http://localhost:8001`

## API Routes

| Method | Route                     | Description                          | Auth required |
|--------|---------------------------|---------------------------------------|----------------|
| GET    | `/`                        | Home page — lists user's URLs        | Yes            |
| GET    | `/login`                  | Login page                            | No             |
| GET    | `/signup`                 | Signup page                           | No             |
| POST   | `/user`                    | Create a new user                    | No             |
| POST   | `/user/login`             | Authenticate and set session cookie  | No             |
| POST   | `/url`                      | Generate a short URL                 | Yes            |
| GET    | `/url/analytics/:shortId` | Get click analytics for a short URL  | Yes            |
| GET    | `/:shortId`                | Redirect to the original long URL   | No             |

## How It Works

1. A logged-in user submits a long URL via the home page.
2. The server generates a unique `shortId` using `shortid` and stores `{ shortId, redirectURL, createdBy }` in MongoDB.
3. When anyone visits `/:shortId`, the app looks up the matching document, logs the visit timestamp to `visitHistory`, and redirects to the original URL.
4. Users can check `/url/analytics/:shortId` to see total clicks and visit history for a link they created.

## Known Limitations / Future Improvements

- Passwords are currently stored and compared in plain text — should be hashed with `bcrypt` before saving.
- JWT secret is hardcoded in `service/auth.js` — should be moved to an environment variable.
- No input validation/sanitization on URLs or auth fields yet.
- No rate limiting on short link creation or redirects.
- Analytics endpoint returns raw JSON — could be rendered as a dashboard page.

## License

ISC
