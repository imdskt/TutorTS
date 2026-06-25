"use client";

import { useState } from 'react';
import { BookOpen, Send, Loader2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: string;
  text: string;
}

interface Feedback {
  isCorrect: boolean;
  feedback: string;
}

export default function Home() {
  const [material, setMaterial] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const handleGenerateQuiz = async () => {
    if (!material.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ material })
      });
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
        setCurrentQuestionIndex(0);
        setFeedback(null);
        setCurrentAnswer('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEvaluate = async () => {
    if (!currentAnswer.trim()) return;
    setIsEvaluating(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          material, 
          question: questions[currentQuestionIndex].text, 
          answer: currentAnswer 
        })
      });
      const data = await res.json();
      setFeedback(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer('');
      setFeedback(null);
    }
  };

  const reset = () => {
    setQuestions([]);
    setMaterial('');
    setCurrentAnswer('');
    setFeedback(null);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 font-serif">
      {/* Header */}
      <div className="mb-12 flex items-center space-x-3">
        <div className="bg-neutral-100 p-2 rounded-lg">
          <BookOpen className="w-6 h-6 text-neutral-700" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">TutorTS</h1>
      </div>

      <AnimatePresence mode="wait">
        {questions.length === 0 ? (
          /* Input Phase */
          <motion.div 
            key="input-phase"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-medium tracking-tight text-neutral-900">What are we learning today?</h2>
            <p className="text-neutral-500 text-lg leading-relaxed font-sans">
              Paste your study notes, an article, or a textbook excerpt below. I'll generate a personalized, Socratic quiz to test your deep understanding.
            </p>
            
            <div className="relative font-sans">
              <textarea
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="Paste your material here..."
                className="w-full h-64 bg-transparent border-2 border-neutral-200 rounded-2xl p-6 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-0 transition-colors resize-none leading-relaxed text-lg"
              />
            </div>

            <button
              onClick={handleGenerateQuiz}
              disabled={isGenerating || !material.trim()}
              className="group flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-4 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed font-sans text-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Reading material...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Start Learning Session</span>
                </>
              )}
            </button>
          </motion.div>
        ) : (
          /* Quiz Phase */
          <motion.div 
            key="quiz-phase"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="flex items-center justify-between font-sans text-sm font-medium text-neutral-500 uppercase tracking-widest">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <button onClick={reset} className="hover:text-neutral-900 transition-colors">Start Over</button>
            </div>

            <h2 className="text-3xl font-medium tracking-tight text-neutral-900 leading-snug">
              {questions[currentQuestionIndex].text}
            </h2>

            <div className="space-y-4 font-sans">
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here..."
                disabled={feedback?.isCorrect}
                className="w-full h-40 bg-neutral-50 border-2 border-neutral-200 rounded-2xl p-6 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors resize-none leading-relaxed text-lg disabled:opacity-70 disabled:bg-neutral-100"
              />
              
              {!feedback?.isCorrect && (
                <div className="flex justify-end">
                  <button
                    onClick={handleEvaluate}
                    disabled={isEvaluating || !currentAnswer.trim()}
                    className="flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    {isEvaluating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> <span>Submit Answer</span></>}
                  </button>
                </div>
              )}
            </div>

            {/* Feedback Section */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-2xl border-2 font-sans text-lg leading-relaxed ${
                    feedback.isCorrect 
                      ? 'bg-green-50 border-green-200 text-green-900' 
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {feedback.isCorrect ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : <Sparkles className="w-6 h-6 text-amber-600" />}
                    </div>
                    <div>
                      <p>{feedback.feedback}</p>
                      
                      {feedback.isCorrect && currentQuestionIndex < questions.length - 1 && (
                        <button
                          onClick={handleNextQuestion}
                          className="mt-6 flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                        >
                          <span>Next Question</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                      
                      {feedback.isCorrect && currentQuestionIndex === questions.length - 1 && (
                        <div className="mt-6 font-semibold text-green-700">
                          🎉 You've mastered this material! You can click "Start Over" to study something else.
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
