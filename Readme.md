🚀 DSA Mentor – AI Powered Chat Application

An AI-powered DSA learning platform that allows users to ask data structures & algorithms questions, receive AI-generated explanations, and maintain personalized chat history with secure authentication.

✨ Features

🔐 JWT Authentication (Signup / Login)

🤖 AI-powered DSA Instructor (Gemini API via backend)

💬 Real-time chat interface with typing animation

🕒 Chat history per user (stored in MongoDB)

📱 Responsive UI (Desktop + Mobile sidebar)

🧠 Protected routes (Unauthorized users redirected)

🗂 Clean MVC backend architecture

🛠 Tech Stack
Frontend

HTML, CSS (Custom Dark Theme)

Vanilla JavaScript

Responsive Layout

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Gemini AI API

📂 Project Structure
frontend/
 ├── auth.css
 ├── auth.js
 ├── DSAChatBoat.css
 ├── DSAChatBoat.js
 ├── login.html
 ├── signup.html
 └── index.html


backend/
 ├── models/
 │   ├── User.js
 │   └── Chat.js
 ├── routes/
 │   ├── auth.js
 │   └── chat.js
 ├── middleware/
 │   └── authMiddleware.js
 ├── server.js
 └── package.json
🔐 Authentication Flow

User signs up / logs in

JWT token stored in localStorage

Token sent in Authorization header

Protected APIs validate token via middleware

Logout clears token and redirects to login

🤖 AI Chat Flow

User sends DSA question

Backend forwards query to Gemini API

AI response returned and streamed in UI

Chat stored in MongoDB

History loaded on next login

⚙️ Environment Variables

Create a .env file in backend root:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
SYSTEM_PROMPT=You are a strict DSA instructor
▶️ Run Locally
Backend
cd backend
npm install
npm start
Frontend

Open login.html using Live Server or browser.