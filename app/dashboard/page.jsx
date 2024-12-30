"use client";
import { createClient } from "../../utils/supabase/client";
import HistoryQuiz from "@/components/dashboard/HistoryQuiz";
import HotTopicQuiz from "@/components/dashboard/HotTopicQuiz";
import PlayQuiz from "@/components/dashboard/PlayQuiz";
import RecentActivity from "@/components/dashboard/RecentActivity";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const supabase = createClient();
  const router = useRouter();
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
    <div className="w-full bg-home">
      <Navbar />
      <main className="px-8 pb-8 pt-2 mx-auto max-w-7xl">
        <div className="flex items-center">
          <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        <div className="grid gap-4 mt-4 md:grid-cols-2">
          <PlayQuiz />
          <HistoryQuiz />
        </div>
        <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
          <HotTopicQuiz />
          <RecentActivity />
        </div>
      </main>
    </div>
  );
}
