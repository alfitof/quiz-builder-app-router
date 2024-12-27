"use client";
import { useState } from "react";
import { createClient } from "../../utils/supabase/server";

export default function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", answers: ["", ""], correctAnswer: "" },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", answers: ["", ""], correctAnswer: "" },
    ]);
  };

  const handleSaveQuiz = async () => {
    const supabase = await createClient();
    const { user } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to create a quiz.");
      return;
    }

    // Prepare the quiz data
    const quizData = {
      title: quizTitle,
      user_id: user.id,
      questions: JSON.stringify(questions), // Store questions as JSON
    };

    const { error } = await supabase.from("quizzes").insert([quizData]);

    if (error) {
      alert("Error saving quiz: " + error.message);
    } else {
      alert("Quiz saved successfully!");
      window.location.href = "/dashboard"; // Redirect to dashboard after saving
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Create a New Quiz</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quiz Title
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
            placeholder="Enter quiz title"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          />
        </div>

        {/* Add Questions */}
        {questions.map((question, index) => (
          <div key={index} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Question {index + 1}
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md mt-2"
                placeholder="Enter question"
                value={question.question}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].question = e.target.value;
                  setQuestions(newQuestions);
                }}
              />
            </div>

            {/* Answers */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Answers
              </label>
              {question.answers.map((answer, answerIndex) => (
                <input
                  key={answerIndex}
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md mt-2"
                  placeholder={`Answer ${answerIndex + 1}`}
                  value={answer}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].answers[answerIndex] = e.target.value;
                    setQuestions(newQuestions);
                  }}
                />
              ))}
              <button
                className="mt-2 text-blue-600"
                onClick={() => {
                  const newQuestions = [...questions];
                  newQuestions[index].answers.push("");
                  setQuestions(newQuestions);
                }}
              >
                Add Answer
              </button>
            </div>

            {/* Correct Answer */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Correct Answer
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md mt-2"
                value={question.correctAnswer}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].correctAnswer = e.target.value;
                  setQuestions(newQuestions);
                }}
              >
                {question.answers.map((answer, answerIndex) => (
                  <option key={answerIndex} value={answer}>
                    {answer}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <button
          className="mt-4 w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
          onClick={handleAddQuestion}
        >
          Add Question
        </button>

        <button
          className="mt-4 w-full py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-500"
          onClick={handleSaveQuiz}
        >
          Save Quiz
        </button>
      </div>
    </div>
  );
}
