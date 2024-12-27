// app/dashboard/page.js
import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  // If no user is found or there's an error, redirect to login page
  if (error || !data?.user) {
    redirect("/login");
  }

  // Fetch quizzes created by the user
  const { data: quizzes, error: quizzesError } = await supabase
    .from("quizzes")
    .select()
    .eq("user_id", data.user.id);

  // Log any error that occurs while fetching quizzes
  if (quizzesError) {
    console.error("Error fetching quizzes:", quizzesError);
    return (
      <div className="text-center text-red-500">
        <p>Unable to fetch quizzes. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">
          Welcome, {data.user.email}
        </h2>

        {/* Button to create a new quiz */}
        <div className="text-center">
          <a href="/create-quiz">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500">
              Create New Quiz
            </button>
          </a>
        </div>

        {/* List of Quizzes */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">Your Quizzes</h3>
          {quizzes && quizzes.length > 0 ? (
            <ul>
              {quizzes.map((quiz) => (
                <li key={quiz.id} className="border-b py-2">
                  <div className="flex justify-between items-center">
                    <span>{quiz.title}</span>
                    <div className="space-x-2">
                      {/* Edit and Delete Buttons */}
                      <a
                        href={`/edit-quiz/${quiz.id}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </a>
                      <button
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(quiz.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">
              You haven't created any quizzes yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Logic to delete a quiz
async function handleDelete(quizId) {
  const { error } = await supabase.from("quizzes").delete().eq("id", quizId);
  if (error) {
    alert("Failed to delete quiz.");
  } else {
    window.location.reload(); // Reload to reflect the changes
  }
}
