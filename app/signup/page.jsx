"use client";

import { useRouter } from "next/navigation";
import { signup } from "./actions";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("Auth");

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
    <div class="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div class="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div class="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div class="w-full bg-contain bg-center bg-no-repeat bg-login"></div>
        </div>
        <div class="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            <a href="/" className="flex items-center justify-center space-x-3">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8"
                alt="Flowbite Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap">
                Quiztify
              </span>
            </a>
          </div>
          <div class="mt-12 flex flex-col items-center">
            <h1 class="text-2xl xl:text-3xl font-extrabold">{t("up")}</h1>
            <div class="w-full flex-1">
              <div class="mb-12 mt-6 border-b text-center">
                <div class="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  {t("up_email")}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div class="mx-auto max-w-xs">
                  <input
                    class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="john.doe@example.com"
                  />
                  <input
                    class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="********"
                  />

                  {errorMessage && (
                    <p className="mt-5 mb-2 text-red-500 text-sm">
                      {errorMessage}
                    </p>
                  )}
                  <button
                    type="submit"
                    class="mt-5 tracking-wide font-semibold bg-[#f47516] text-gray-100 w-full py-4 rounded-lg hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 transition-all duration-300 ease-in-out flex items-center justify-center"
                  >
                    <svg
                      class="w-6 h-6 -ml-2"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                    <span class="ml-3">{t("up")}</span>
                  </button>
                  <p className="mt-6 text-xs text-gray-600 text-center">
                    {t("have_acc")}{" "}
                    <Link href="login" className="text-blue-500 underline">
                      {t("in")}
                    </Link>
                  </p>
                  <p class="mt-4 text-xs text-gray-600 text-center">
                    <a href="#" class="border-b border-gray-500 border-dotted">
                      {t("terms")}
                    </a>
                    <br className="my-2" />
                    <a href="#" class="border-b border-gray-500 border-dotted">
                      {t("policy")}
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm p-6 space-y-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-center text-[#f47516]">
              {t("title_modal")}
            </h2>
            <p className="text-center text-gray-700">{t("desc_modal")}</p>
            <button
              onClick={handleModalClose}
              className="w-full py-2 text-white bg-[#f47516] rounded-md hover:bg-orange-600 focus:ring-4 focus:ring-orange-300"
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
