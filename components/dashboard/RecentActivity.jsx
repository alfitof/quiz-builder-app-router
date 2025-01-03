"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import RecentQuiz from "../RecentQuiz";
import { useTranslations } from "next-intl";

const RecentActivity = () => {
  const [totalQuizzesPlayed, setTotalQuizzesPlayed] = useState(0);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("Dashboard");
  const supabase = createClient();

  useEffect(() => {
    const fetchTotalQuizzes = async () => {
      const { data, error } = await supabase
        .from("quizzes")
        .select("id", { count: "exact" })
        .not("success_rate", "is", null);

      if (error) {
        return;
      }

      setTotalQuizzesPlayed(data.length);
      setLoading(false);
    };

    fetchTotalQuizzes();
  }, [supabase]);

  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <Link href="/history">{t("recent")}</Link>
        </CardTitle>
        <CardDescription>
          {loading ? t("loading") : t("desc_recent", { totalQuizzesPlayed })}
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-scroll">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p>{t("loading")}</p>
          </div>
        ) : totalQuizzesPlayed === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-muted-foreground">{t("no_quiz")}</p>
          </div>
        ) : (
          <RecentQuiz />
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
