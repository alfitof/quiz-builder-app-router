"use client";

import React, { useState, useEffect } from "react";
import { Clock, CopyCheck } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

const RecentQuiz = () => {
  const [recentQuizzes, setRecentQuizzes] = useState([]);

  const supabase = createClient();

  useEffect(() => {
    const fetchRecentQuizzes = async () => {
      const { data, error } = await supabase
        .from("quizzes")
        .select("id, title, type, success_rate, created_at")
        .not("success_rate", "is", null)
        .order("created_at", { ascending: false });

      if (error) {
        return;
      }

      setRecentQuizzes(data);
    };

    fetchRecentQuizzes();
  }, []);

  return (
    <div className="space-y-8">
      {recentQuizzes.map((quiz) => (
        <div key={quiz.id} className="flex items-center justify-between">
          <div className="flex items-center">
            <CopyCheck className="mr-3" />

            <div className="ml-4 space-y-1">
              <Link
                className="text-base font-medium leading-none underline"
                href={`/quizzes/play-quiz/${quiz.id}`}
              >
                {quiz.title}
              </Link>
              <p className="flex items-center px-2 py-1 text-xs text-white rounded-lg w-fit bg-slate-800">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(quiz.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">{quiz.type}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentQuiz;
