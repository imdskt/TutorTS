# TutorTS Architecture

TutorTS demonstrates advanced prompt engineering and adaptive conversational flows using Qwen Cloud.

## Features
1. **Material Parsing:** The `/api/generate-quiz` route accepts raw study material and prompts the LLM to generate exactly 3 open-ended, thought-provoking questions returned strictly as JSON.
2. **Socratic Evaluation:** The `/api/evaluate-answer` route takes the source material, the question, and the user's specific answer. The prompt instructs the LLM to act as a Socratic tutor—never giving away the correct answer directly if the user is wrong, but rather giving hints and asking follow-up questions.
3. **Adaptive UI:** The Next.js frontend manages the state between the input phase, the quiz loop, and the feedback loop, presenting the AI's responses in a clean, distraction-free environment.
