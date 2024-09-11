
# Walkie-Talkie App

A real-time communication app that allows users to interact using voice or text over the web using WebSockets. This repository contains both the **server** and **client** code.

---

## Project Structure

```
walkie-talkie-app/
├── client/           # Contains the client-side code (Next.js + React)
├── server/           # Contains the server-side code (Express + Socket.io)
├── README.md         # Project documentation
```

## Technologies Used

### Server
- **Node.js**
- **Express.js**
- **Socket.IO**
- **TypeScript**

### Client
- **Next.js**
- **React.js**
- **Styled-components**

---

## Getting Started

To run the application locally, follow the steps below.

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/) (v14 or above)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) as your package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/walkie-talkie-app.git
   cd walkie-talkie-app
   ```

2. **Install dependencies for the server:**
   Navigate to the server directory and install dependencies:
   ```bash
   cd server
   npm install
   ```

3. **Install dependencies for the client:**
   Navigate to the client directory and install dependencies:
   ```bash
   cd ../client
   npm install
   ```

---

## Running the App

### Running the Server

1. **Development Mode (with TypeScript hot-reloading):**
   ```bash
   cd server
   npm run dev
   ```

2. **Production Mode (after building):**
   First, build the TypeScript files:
   ```bash
   npm run build
   ```

   Then start the server:
   ```bash
   npm start
   ```

The server will start on `http://localhost:5000` (you can configure this in your server's `index.ts` file).

### Running the Client

1. **Development Mode:**
   ```bash
   cd client
   npm run dev
   ```

   The client will be available at `http://localhost:3000`.

2. **Production Mode:**
   First, build the Next.js app:
   ```bash
   npm run build
   ```

   Then start the server:
   ```bash
   npm start
   ```

---
