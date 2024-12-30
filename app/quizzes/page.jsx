"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Clock,
  Trophy,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react";

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
      setAuthLoading(false);

      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("user_id", session.user.id);
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
    <div className="min-h-screen bg-home">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {quizzes.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Start Your Quiz Journey
              </h2>
              <p className="text-gray-600 mb-8">
                Create your first quiz and begin testing knowledge in an
                engaging way.
              </p>
              <button
                onClick={() => router.push("/quizzes/quiz-build")}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Quiz
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Your Quiz Collection
                </h1>
                <p className="text-gray-600">
                  Manage and play your created quizzes
                </p>
              </div>
              <button
                onClick={() => router.push("/quizzes/quiz-build")}
                className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Quiz
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-48 bg-gradient-to-br from-orange-400 to-orange-600">
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => toggleDropdown(quiz.id)}
                        className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-white" />
                      </button>
                      {dropdownOpen === quiz.id && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl z-10 w-48 py-2 border border-gray-100"
                        >
                          <button
                            className="w-full px-4 py-2 text-left hover:bg-orange-50 flex items-center text-gray-700"
                            onClick={() => handleModify(quiz.id)}
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Modify Quiz
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center text-red-600"
                            onClick={() => handleRemove(quiz.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove Quiz
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-xl font-bold text-white mb-1 line-clamp-2">
                        {quiz.title}
                      </h2>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600">
                        <BookOpen className="w-5 h-5 mr-2" />
                        <span>{quiz.total_questions} Questions</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-2" />
                        <span>{quiz.duration} minutes</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Trophy className="w-5 h-5 mr-2" />
                        <span>
                          {quiz.success_rate === null
                            ? "No attempts yet"
                            : quiz.success_rate === 0
                            ? "0% Success rate"
                            : `${quiz.success_rate}% Success rate`}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        router.push(`/quizzes/play-quiz/${quiz.id}`)
                      }
                      className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium"
                    >
                      Play Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Remove Quiz?
            </h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. Are you sure you want to remove this
              quiz?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelRemove}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizList;
