"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MenuIcon from "../../assets/menu.svg";
import ModifyIcon from "../../assets/modify.svg";
import RemoveIcon from "../../assets/remove.svg";

const QuizList = () => {
  const supabase = createClient();
  const [quizzes, setQuizzes] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [quizToRemove, setQuizToRemove] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSessionAndQuizzes = async () => {
      setAuthLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }
      setSession(session);
      setAuthLoading(false);

      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("user_id", session.user.id); // Filter kuis berdasarkan user_id
      if (error) console.error(error);
      else setQuizzes(data);
      setLoading(false);
    };

    fetchSessionAndQuizzes();
  }, [supabase, router]);

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => (prev === id ? null : id));
  };

  const handleRemove = async (id) => {
    setQuizToRemove(id);
    setShowModal(true);
  };

  const confirmRemove = async () => {
    if (quizToRemove) {
      const { error } = await supabase
        .from("quizzes")
        .delete()
        .eq("id", quizToRemove);
      if (error) {
        console.error("Error deleting quiz:", error);
        alert("Failed to delete the quiz. Please try again.");
      } else {
        alert("Quiz deleted successfully!");
        setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizToRemove));
      }
    }
    setShowModal(false);
  };

  const cancelRemove = () => {
    setShowModal(false);
  };

  const handleModify = (id) => {
    router.push(`/quizzes/edit-quiz/${id}`);
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

  if (loading) {
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
    <div className="max-w-6xl mx-auto px-4 py-10">
      {quizzes.length === 0 ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Quizzes await! Make one.</h2>
          <p className="text-gray-600 mt-2">
            Click below to begin your journey here.
          </p>
          <button
            onClick={() => router.push("/quizzes/quiz-build")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Quiz
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Available Quizzes</h1>
            <button
              onClick={() => router.push("/quizzes/quiz-build")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Create Quiz
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-4 border rounded shadow hover:shadow-lg transition relative"
              >
                <div className="relative w-full h-32 bg-red-500 rounded-lg mb-4">
                  <div className="absolute top-1 right-2">
                    <button
                      onClick={() => toggleDropdown(quiz.id)}
                      className="p-2 text-white"
                    >
                      <Image src={MenuIcon} height={25} width={25} />
                    </button>
                    {dropdownOpen === quiz.id && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-10 w-[8.5rem]"
                      >
                        <button
                          className="flex items-center px-5 py-3 text-left hover:bg-gray-100 w-full"
                          onClick={() => handleModify(quiz.id)}
                        >
                          <Image
                            src={ModifyIcon}
                            height={20}
                            width={20}
                            className="mr-3"
                          />
                          Modify
                        </button>
                        <button
                          className="flex items-center text-[#ff4444] px-5 py-3 text-left hover:bg-gray-100 w-full"
                          onClick={() => handleRemove(quiz.id)}
                        >
                          <Image
                            src={RemoveIcon}
                            height={20}
                            width={20}
                            className="mr-3"
                          />
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h2 className="text-lg font-semibold mb-2">{quiz.title}</h2>
                <p className="text-gray-600 mb-1">
                  Questions: {quiz.total_questions}
                </p>
                <p className="text-gray-600 mb-1">
                  Duration: {quiz.duration} mins
                </p>
                <p className="text-gray-600 mb-4">
                  Success Rate:{" "}
                  {quiz.success_rate === null
                    ? "N/A"
                    : quiz.success_rate === 0
                    ? "0%"
                    : `${quiz.success_rate}%`}
                </p>

                <div className="flex justify-end">
                  <button
                    onClick={() => router.push(`/quizzes/play-quiz/${quiz.id}`)}
                    className="px-4 py-2 rounded text-white"
                    style={{ backgroundColor: "#f47516" }}
                  >
                    Play
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80">
            <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
            <p className="text-gray-600 mb-6">
              Do you want to remove this quiz?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelRemove}
                className="px-4 py-2 bg-gray-300 rounded text-black hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizList;
