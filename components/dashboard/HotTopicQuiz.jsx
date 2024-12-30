import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import WordCloud from "../WordCloud";
import { useTranslations } from "next-intl";

const HotTopicQuiz = () => {
  const t = useTranslations("Dashboard");
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t("topic")}</CardTitle>
        <CardDescription>{t("desc_topic")}</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <WordCloud />
      </CardContent>
    </Card>
  );
};

export default HotTopicQuiz;
