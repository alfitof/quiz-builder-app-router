"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { useTranslations } from "next-intl";

const CreateQuiz = () => {
  const supabase = createClient();
  const t = useTranslations("Create");
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
  }, [loading, loadingTexts.length]);

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
          <p className="mt-4 text-lg font-semibold">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full mx-auto px-4 pb-10 pt-5 ${loading ? "" : "bg-home"}`}
    >
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
        <div className="w-full min-h-screen flex justify-center items-center py-12">
          <div className="bg-transparent w-full max-w-5xl p-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">
              {t("title")}
            </h1>
            <div className="space-y-8">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t("form1")}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t("form2")}
                </label>
                <input
                  type="number"
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(Number(e.target.value))}
                  min="1"
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t("form3")}
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                >
                  <option value="Multiple Choice">{t("mc")}</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  {t("form4")}
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min="1"
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>

              {questions.map((q, index) => (
                <div key={index} className=" p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {t("question")} {index + 1}
                  </h2>
                  <input
                    type="text"
                    value={q.question}
                    placeholder={`${t("question")} ${index + 1}`}
                    onChange={(e) =>
                      handleQuestionChange(index, "question", e.target.value)
                    }
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
                          placeholder={`${t("answer")} ${idx + 1}`}
                          className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm mt-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
                        placeholder={t("correct")}
                        className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm mt-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      />
                    </>
                  )}
                </div>
              ))}

              <button
                onClick={handleCreateQuiz}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {t("create")}
              </button>
            </div>
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
