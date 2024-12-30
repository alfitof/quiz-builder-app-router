"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { History } from "lucide-react";
import { useTranslations } from "next-intl";

const HistoryQuiz = () => {
  const router = useRouter();
  const t = useTranslations("Dashboard");

  return (
    <Card
      className="hover:cursor-pointer hover:opacity-75"
      onClick={() => {
        router.push("#");
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">{t("history")}</CardTitle>
        <History size={28} strokeWidth={2.5} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{t("desc_history")}</p>
      </CardContent>
    </Card>
  );
};

export default HistoryQuiz;
