
# Groq AI Chatbot

A simple AI chatbot that generates responses to user prompts using the Groq API. Built with React, Tailwind CSS, Node.js, and Express.

## Features

- Generate AI-powered responses from user prompts
- Clean and responsive user interface
- Fast inference using the Groq API
- REST API built with Express.js
- Environment-based configuration for API credentials
- Separate frontend and backend architecture

## Tech Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express.js
- Groq SDK

**AI**
- Groq API
- Configurable Groq-supported language model

## Project Structure

```text
groq-ai-chatbot/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── .gitignore
├── LICENSE
└── README.md
```

*Adjust the structure to match your actual project files.*

## Prerequisites

- [Node.js](https://nodejs.org/) and npm
- A Groq API key from the [Groq Console](https://console.groq.com/keys)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/tejasabhale/groq-ai-chatbot.git
cd groq-ai-chatbot
```

### 2. Configure the Backend

Navigate to the backend directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=3000
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
CORS_ORIGIN=http://localhost:5173
```

Replace `your_groq_api_key` with your own Groq API key.

Keep your API key private. Never commit your actual `.env` file to GitHub.

Start the backend:

```bash
npm run dev
```

Make sure your `package.json` defines a `dev` script. For example, if you use `nodemon`:

```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js"
  }
}
```

Change `src/index.js` to your actual server entry file if necessary.

### 3. Configure the Frontend

Open a new terminal from the project root:

```bash
cd client
npm install
npm run dev
```

Open the URL shown in your terminal. The default Vite development URL is:

```text
http://localhost:5173
```

Ensure the frontend sends requests to your backend at `http://localhost:3000/api`.

## API Documentation

### Generate an AI Response

**Endpoint**

```http
POST /api/generate
Content-Type: application/json
```

**Request Body**

```json
{
  "prompt": "Explain artificial intelligence in simple terms."
}
```

**Example Response**

```json
{
  "success": true,
  "answer": "Artificial intelligence enables computers to perform tasks that typically require human intelligence."
}
```

The answer above is illustrative. Actual responses depend on the prompt and the configured model.

## Environment Variables

### Backend

| Variable | Description |
|---|---|
| `PORT` | Port on which the backend runs |
| `GROQ_API_KEY` | API key used to authenticate with Groq |
| `GROQ_MODEL` | Model identifier supported by Groq |
| `CORS_ORIGIN` | Allowed frontend origin |

### Environment File Example

Create `server/.env.example` without real credentials:

```env
PORT=3000
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=your_groq_model
CORS_ORIGIN=http://localhost:5173
```

Copy this file to `server/.env` and configure the values for your environment.

## How It Works

1. The user enters a prompt in the React frontend.
2. Axios sends a POST request to the Express backend.
3. The backend validates the prompt and forwards it to the Groq API.
4. The configured language model generates a response.
5. The backend returns the response to the frontend.
6. The frontend displays the generated answer.

## Security

- Keep your Groq API key on the backend.
- Never expose API credentials in frontend code.
- Never commit `.env` files containing secrets.
- Validate user input on the backend.
- Consider rate limiting to prevent API abuse.

Recommended `.gitignore` entries:

```gitignore
node_modules/
.env
.env.*
!.env.example
dist/
```

## Future Improvements

- Conversation history
- Streaming AI responses
- Markdown rendering and code highlighting
- Support for additional models available through Groq
- Prompt history
- Rate limiting and request validation

## Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and test them.
4. Commit your changes.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Groq](https://groq.com/) for AI inference
- [React](https://react.dev/) for the frontend library
- [Express](https://expressjs.com/) for the backend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
