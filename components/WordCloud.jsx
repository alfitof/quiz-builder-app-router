"use client";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React from "react";
import D3WordCloud from "react-d3-cloud";

const fontSizeMapper = (word) =>
  Math.log2(word.value) * (Math.random() * 6 + 4);

const WordCloud = () => {
  const theme = useTheme();
  const router = useRouter();

  const data = [
    { text: "AI", value: 1000 },
    { text: "JavaScript", value: 800 },
    { text: "React", value: 700 },
    { text: "Next.js", value: 650 },
    { text: "Python", value: 600 },
    { text: "Machine Learning", value: 580 },
    { text: "Data Science", value: 550 },
    { text: "Web Development", value: 500 },
    { text: "CSS", value: 480 },
    { text: "HTML", value: 470 },
    { text: "Node.js", value: 460 },
    { text: "Tailwind", value: 450 },
    { text: "TypeScript", value: 440 },
    { text: "Supabase", value: 430 },
    { text: "GraphQL", value: 420 },
    { text: "SQL", value: 400 },
    { text: "API Development", value: 390 },
    { text: "Big Data", value: 380 },
    { text: "Blockchain", value: 370 },
    { text: "Cloud Computing", value: 360 },
    { text: "Java", value: 350 },
    { text: "Docker", value: 340 },
    { text: "Kubernetes", value: 330 },
    { text: "DevOps", value: 320 },
    { text: "Cybersecurity", value: 310 },
    { text: "Figma", value: 300 },
    { text: "UI/UX Design", value: 290 },
    { text: "AWS", value: 280 },
    { text: "Google Cloud", value: 270 },
    { text: "Azure", value: 260 },
    { text: "React Native", value: 250 },
    { text: "Redux", value: 240 },
    { text: "Django", value: 230 },
    { text: "Flask", value: 220 },
    { text: "Ruby on Rails", value: 210 },
    { text: "Spring Boot", value: 200 },
    { text: "Vue.js", value: 190 },
    { text: "Svelte", value: 180 },
    { text: "Angular", value: 170 },
    { text: "Testing", value: 160 },
    { text: "Unit Testing", value: 150 },
    { text: "Integration Testing", value: 140 },
    { text: "Cypress", value: 130 },
    { text: "Jest", value: 120 },
    { text: "Mocha", value: 110 },
    { text: "GraphQL API", value: 100 },
    { text: "REST API", value: 90 },
    { text: "Tailwind UI", value: 80 },
    { text: "ESLint", value: 70 },
    { text: "Prettier", value: 60 },
    { text: "CI/CD", value: 50 },
  ];

  return (
    <>
      <D3WordCloud
        data={data}
        height={550}
        font="Times"
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={theme.theme === "dark" ? "white" : "black"}
      />
    </>
  );
};

export default WordCloud;
