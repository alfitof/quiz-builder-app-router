"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const PlayQuiz = ({ params }) => {
  const { id } = params;
  const supabase = createClient();
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      setAuthLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }
      setAuthLoading(false);
    };

    fetchSession();
  }, [supabase, router]);

  useEffect(() => {
    const fetchQuiz = async () => {
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        return;
      }

      setQuiz(data);

      if (data.success_rate !== null) {
        setAlreadyPlayed(true);
        setScore(data.success_rate);
      }

      setLoading(false);
      setTimeLeft(data.duration * 60);
      setTimerStarted(true);
    };

    if (id) fetchQuiz();
  }, [id, supabase, router]);

  useEffect(() => {
    if (timerStarted && timeLeft > 0) {
      const timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      setIntervalId(timerInterval);

      return () => clearInterval(timerInterval);
    } else if (timeLeft <= 0) {
      handleSubmit();
    }
  }, [timerStarted, timeLeft]);

  const handleAnswerChange = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answer,
    });
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    const totalQuestions = quiz.total_questions;
    let correctCount = 0;

    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const successRate = parseFloat(
      ((correctCount / totalQuestions) * 100).toFixed(2)
    );
    setScore(successRate);

    const timeTaken = quiz.duration * 60 - timeLeft;

    try {
      const { error } = await supabase
        .from("quizzes")
        .update({
          success_rate: successRate,
          time_taken: timeTaken,
        })
        .eq("id", id);

      setAlreadyPlayed(true);
      setScore(successRate);
      setQuiz((prevQuiz) => ({
        ...prevQuiz,
        time_taken: timeTaken,
      }));

      clearInterval(intervalId);
    } catch (err) {
      console.error("Unexpected error updating success rate:", err);
    }
  };

  const handleTryAgain = () => {
    setAnswers({});
    setScore(null);
    setCurrentQuestionIndex(0);
    setAlreadyPlayed(false);
    setTimeLeft(quiz.duration * 60);
    setTimerStarted(true);

    if (intervalId) {
      clearInterval(intervalId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#f47516] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <div>Quiz not found or has no questions.</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>Invalid question.</div>;
  }

  const formatTimeTaken = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    let result = "";
    if (hours > 0) result += `${hours} hour${hours > 1 ? "s" : ""} `;
    if (minutes > 0 || hours > 0)
      result += `${minutes} minute${minutes > 1 ? "s" : ""} `;
    if (secs > 0) result += `${secs} second${secs > 1 ? "s" : ""}`;

    return result.trim() || "0 seconds";
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#f47516] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-6 py-10 flex justify-center items-center bg-home  min-h-screen">
      {alreadyPlayed && score !== null ? (
        <div className="glassmorphism rounded-lg shadow-lg p-16 text-center">
          <h2 className="text-2xl font-bold mb-6">Quiz Complete!</h2>
          <p className="text-lg text-gray-600 mb-2">Great job</p>
          <div className="text-5xl font-bold mb-6 text-orange-500">
            Time Taken: {formatTimeTaken(quiz.time_taken)}
          </div>
          <p className="text-gray-600 mb-8">
            You got Your Score: {score.toFixed(2)} out of {quiz.total_questions}{" "}
            questions
          </p>

          <button
            onClick={() => router.push("/quizzes")}
            className="bg-orange-600 text-white mr-3 px-6 py-3 rounded-lg hover:bg-orange-700 
   transition-colors duration-200"
          >
            Back to Quizzes
          </button>
          <button
            onClick={handleTryAgain}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 
   transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="glassmorphism w-[90%] rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
            <span className="text-lg font-medium text-gray-500">
              Time Left:{" "}
              <span className="text-orange-500 font-semibold">
                {formatTime(timeLeft)}
              </span>
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800">
              Question {currentQuestionIndex + 1} of {quiz.total_questions}
            </h2>
            <p className="text-gray-700 mt-2">{currentQuestion.question}</p>
          </div>

          {quiz.type === "Multiple Choice" && (
            <div className="space-y-4">
              {currentQuestion.answers.map((answer, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerChange(answer)}
                  className={`block w-full text-left px-6 py-3 border rounded-lg transition-all duration-200 shadow-sm ${
                    answers[currentQuestionIndex] === answer
                      ? "bg-orange-600 text-white border-orange-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {answer}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              className={`px-6 py-2 rounded-lg shadow-md transition-all ${
                currentQuestionIndex === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-500 text-white hover:bg-gray-600"
              }`}
            >
              Previous
            </button>

            {currentQuestionIndex < quiz.total_questions - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 shadow-md transition-all"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-md transition-all"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayQuiz;
