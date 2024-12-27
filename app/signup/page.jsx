"use client";

import { useRouter } from "next/navigation";
import { signup } from "./actions";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.target);
    const result = await signup(formData);
    setIsLoading(false);

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="********"
            />
          </div>
          <p className="my-3 text-red-500 text-sm">{errorMessage}</p>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 mt-4 text-white rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Loading..." : "Sign Up"}{" "}
          </button>
        </form>
        <p className="text-center text-sm">
          Have an account?{" "}
          <Link href="login" className="text-blue-500 underline">
            Login
          </Link>
        </p>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm p-6 space-y-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-center text-blue-600">
              Check Your Email
            </h2>
            <p className="text-center text-gray-700">
              We have sent a confirmation link to your email. Please check your
              inbox and follow the instructions to verify your account.
            </p>
            <button
              onClick={handleModalClose}
              className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
