# TutorTS

TutorTS is an adaptive, AI-powered Socratic tutor built for the Qwen Cloud Hackathon (Track 5: Open Innovation).

Instead of passively reading study notes, users paste their material into TutorTS. The system generates an interactive, open-ended quiz. When answering, the Qwen-Plus model evaluates the response and provides conversational, Socratic feedback to guide the user to mastery.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **AI:** Qwen Cloud (`qwen-plus`)
- **Styling:** Tailwind CSS, Framer Motion (Notion-style minimalist design)

## Running Locally
1. Clone the repository.
2. `npm install`
3. Copy `.env.example` to `.env` and add your Qwen API key.
4. `npm run dev`
5. Open `http://localhost:3000`
