import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import WordCloud from "../WordCloud";

const HotTopicQuiz = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Hot Topics</CardTitle>
        <CardDescription>Hot topics quiz in this week.</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <WordCloud />
      </CardContent>
    </Card>
  );
};

export default HotTopicQuiz;
