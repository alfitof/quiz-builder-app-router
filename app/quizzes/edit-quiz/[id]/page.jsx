"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const EditQuiz = () => {
  const supabase = createClient();
  const router = useRouter();
  const { id } = useParams();
  const t = useTranslations("Edit");
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
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

      if (error) {
        alert("Failed to load quiz data.");
        router.push("/quizzes");
      } else {
        setTitle(data.title);
        setQuestions(data.questions || []);
      }
    };

    fetchQuiz();
  }, [id, supabase, router]);

  const handleQuestionChange = (index, field, value, subIndex = null) => {
    const updatedQuestions = [...questions];
    if (field === "answers" && subIndex !== null) {
      updatedQuestions[index].answers[subIndex] = value;
    } else {
      updatedQuestions[index][field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleSaveQuiz = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("quizzes")
      .update({ title, questions })
      .eq("id", id);

    if (error) {
      alert("Failed to save the quiz. Please try again.");
    } else {
      alert("Quiz updated successfully!");
      router.push("/quizzes");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#f47516] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold">{t("loading")}</p>
        </div>
      </div>
    );
  }
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
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">{t("title")}</h1>
      <div className="space-y-4">
        <div>
          <label className="block font-semibold">{t("form1")}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        {questions.map((q, index) => (
          <div key={index} className="space-y-2">
            <label className="block font-semibold">
              {t("question")} {index + 1}
            </label>
            <input
              type="text"
              value={q.question}
              onChange={(e) =>
                handleQuestionChange(index, "question", e.target.value)
              }
              className="w-full px-4 py-2 border rounded"
            />
            {q.answers.map((answer, idx) => (
              <input
                key={idx}
                type="text"
                value={answer}
                onChange={(e) =>
                  handleQuestionChange(index, "answers", e.target.value, idx)
                }
                placeholder={`${t("question")} ${idx + 1}`}
                className="w-full px-4 py-2 border rounded mt-2"
              />
            ))}

            <input
              type="text"
              value={q.correctAnswer}
              onChange={(e) =>
                handleQuestionChange(index, "correctAnswer", e.target.value)
              }
              placeholder={t("correct")}
              className="w-full px-4 py-2 border rounded mt-2"
            />
          </div>
        ))}
        <button
          onClick={handleSaveQuiz}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {t("save")}
        </button>
      </div>
    </div>
  );
};

export default EditQuiz;
