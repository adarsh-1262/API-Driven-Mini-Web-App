# Backend - GitHub Repo Finder

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Create a `.env` file in the `backend` folder with the following:
     ```env
     MONGODB_URI=your_mongodb_connection_string
     PORT=5000
     # Optional: For higher GitHub API rate limits
     GITHUB_TOKEN=your_github_token
     ```

3. **Start the backend server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000` by default.

## API Endpoints
- `POST /api/search` — Search GitHub repos by keyword and store in DB
- `GET /api/results` — Get stored repos (supports pagination)

---
