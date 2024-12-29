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
        console.error("Error fetching quiz:", error);
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

      if (error) {
        console.error("Error updating success rate:", error);
      } else {
        console.log("Success rate and time taken updated successfully!");
      }

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
    <div className="max-w-3xl mx-auto px-4 py-8">
      {alreadyPlayed && score !== null ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-6">Quiz Complete!</h2>
          <p className="text-lg text-gray-600 mb-2">Great job</p>
          <div className="text-5xl font-bold mb-6 text-blue-600">
            Time Taken: {formatTimeTaken(quiz.time_taken)}
          </div>
          <p className="text-gray-600 mb-8">
            You got Your Score: {score.toFixed(2)} out of {quiz.total_questions}{" "}
            questions
          </p>

          <button
            onClick={() => router.push("/quizzes")}
            className="bg-blue-600 text-white mr-3 px-6 py-3 rounded-lg hover:bg-blue-700 
     transition-colors duration-200"
          >
            Back to Quizzes
          </button>
          <button
            onClick={handleTryAgain}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 
     transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      ) : (
        // <div>
        //   <h2 className="text-lg font-semibold">
        //     Your Score: {score.toFixed(2)}%
        //   </h2>
        //   <p className="mt-2 text-lg">
        //     Time Taken: {formatTimeTaken(quiz.time_taken)}
        //   </p>
        //   <button
        //     onClick={() => router.push("/quizzes")}
        //     className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        //   >
        //     Back to Quizzes
        //   </button>
        //   <button
        //     onClick={handleTryAgain}
        //     className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        //   >
        //     Try Again
        //   </button>
        // </div>
        <div>
          <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
          {/* Timer */}
          <div className="text-xl font-semibold mb-4">
            Time Left: {formatTime(timeLeft)}
          </div>
          <h2 className="text-lg font-semibold mb-4">
            Question {currentQuestionIndex + 1} of {quiz.total_questions}
          </h2>
          <p className="mb-4">{currentQuestion.question}</p>
          {quiz.type === "Multiple Choice" && (
            <div className="space-y-2">
              {currentQuestion.answers.map((answer, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerChange(answer)}
                  className={`block w-full px-4 py-2 text-left border rounded ${
                    answers[currentQuestionIndex] === answer
                      ? "bg-[#f47516] text-white"
                      : "bg-white"
                  }`}
                >
                  {answer}
                </button>
              ))}
            </div>
          )}
          <div className="flex justify-between mt-6">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Previous
            </button>
            {currentQuestionIndex < quiz.total_questions - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
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
