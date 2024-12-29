"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const CreateQuiz = () => {
  const supabase = createClient();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(1);
  const [type, setType] = useState("Multiple Choice");
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [authLoading, setAuthLoading] = useState(true);

  const loadingTexts = [
    "Creating questions...",
    "Piecing together a world of questions...",
    "Mapping the terrain of your mind...",
    "Building bridges to better understanding...",
    "Weaving threads of wisdom...",
  ];

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
    const emptyQuestions = Array.from({ length: totalQuestions }, () => ({
      question: "",
      answers: type === "Multiple Choice" ? ["", "", "", ""] : [],
      correctAnswer: "",
    }));
    setQuestions(emptyQuestions);
  }, [totalQuestions, type]);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setLoading(false);
            return 100;
          }
          return prev + 10;
        });

        setLoadingTextIndex(
          (prevIndex) => (prevIndex + 1) % loadingTexts.length
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleCreateQuiz = async () => {
    if (!title.trim()) {
      toast.error("Title is required :(", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    if (totalQuestions <= 0) {
      toast.error("Number of Questions must be greater than 0 :(", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    if (duration <= 0) {
      toast.error("Duration must be greater than 0 minutes :(", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        toast.error(`Question ${i + 1} is required :(`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return;
      }

      if (type === "Multiple Choice") {
        for (let j = 0; j < questions[i].answers.length; j++) {
          if (!questions[i].answers[j].trim()) {
            toast.error(
              `Answer ${j + 1} for Question ${i + 1} is required :(`,
              {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              }
            );
            return;
          }
        }
        if (!questions[i].correctAnswer.trim()) {
          toast.error(`Correct Answer for Question ${i + 1} is required :(`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return;
        }
      }
    }
    setLoading(true);

    setTimeout(async () => {
      const { data, error } = await supabase.from("quizzes").insert([
        {
          title,
          total_questions: totalQuestions,
          type,
          duration,
          questions,
          success_rate: null,
        },
      ]);

      if (error) {
        toast.error("Failed to create the quiz :(", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setLoading(false);
        return;
      }

      setProgress(100);
      setTimeout(() => {
        router.push("/quizzes");
      }, 1000);
    }, 5000);
  };

  const handleQuestionChange = (index, key, value, answerIndex = null) => {
    const updatedQuestions = [...questions];

    if (key === "answers" && answerIndex !== null) {
      updatedQuestions[index][key][answerIndex] = value;
    } else {
      updatedQuestions[index] = { ...updatedQuestions[index], [key]: value };
    }

    setQuestions(updatedQuestions);
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
    <div className="max-w-4xl mx-auto px-4 py-10">
      {loading ? (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-[70vw] md:w-[60vw] flex flex-col items-center">
          <Image src={"/loading.gif"} width={400} height={400} alt="loading" />
          <div className="relative w-full h-2 bg-gray-200 rounded-lg overflow-hidden">
            <div
              className="h-full bg-[#f47516]"
              style={{
                width: `${progress}%`,
                transition: "width 0.5s ease-in-out",
              }}
            ></div>
          </div>
          <h1 className="mt-4 text-xl">{loadingTexts[loadingTextIndex]}</h1>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-semibold mb-6">Create a New Quiz</h1>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Number of Questions</label>
              <input
                type="number"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(Number(e.target.value))}
                min="1"
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="Multiple Choice">Multiple Choice</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold">Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min="1"
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            {questions.map((q, index) => (
              <div key={index} className="space-y-2">
                <label className="block font-semibold">
                  Question {index + 1}
                </label>
                <input
                  type="text"
                  value={q.question}
                  placeholder={`Question ${index + 1}`}
                  onChange={(e) =>
                    handleQuestionChange(index, "question", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded"
                />
                {type === "Multiple Choice" && (
                  <>
                    {q.answers.map((answer, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={answer}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "answers",
                            e.target.value,
                            idx
                          )
                        }
                        placeholder={`Answer ${idx + 1}`}
                        className="w-full px-4 py-2 border rounded mt-2"
                      />
                    ))}

                    <input
                      type="text"
                      value={q.correctAnswer}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          "correctAnswer",
                          e.target.value
                        )
                      }
                      placeholder="Correct Answer"
                      className="w-full px-4 py-2 border rounded mt-2"
                    />
                  </>
                )}
              </div>
            ))}
            <button
              onClick={handleCreateQuiz}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              Create Quiz
            </button>
          </div>
        </div>
      )}
      <ToastContainer
        position="bottom-right"
        hideProgressBar={false}
        newestOnTop={false}
        autoClose={3000}
        closeOnClick
        pauseOnFocusLoss
        draggable
        theme="colored"
      />
    </div>
  );
};

export default CreateQuiz;
