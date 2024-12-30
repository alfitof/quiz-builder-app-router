"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { logout } from "@/app/logout/action";
import Link from "next/link";

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setLanguageDropdownOpen] = useState(false); // State untuk dropdown bahasa
  const [userEmail, setUserEmail] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("EN"); // Default bahasa
  const dropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);

  const supabase = createClient();

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleLanguageDropdown = () => {
    setLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const closeDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
    if (
      languageDropdownRef.current &&
      !languageDropdownRef.current.contains(event.target)
    ) {
      setLanguageDropdownOpen(false);
    }
  };

  const changeLanguage = (lang) => {
    setSelectedLanguage(lang);
    setLanguageDropdownOpen(false);
  };

  useEffect(() => {
    const fetchUserEmail = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUserEmail(session.user.email); // Ambil email dari sesi
      }
    };

    fetchUserEmail();

    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, [supabase]);

  return (
    <nav className="bg-transparent">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-8">
        <a href="/" className="flex items-center space-x-3">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            Quiztify
          </span>
        </a>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0">
          <div ref={languageDropdownRef} className="relative mr-5">
            <button
              onClick={toggleLanguageDropdown}
              className="flex items-center px-5 py-2 font-medium text-gray-800 glassmorphism rounded-lg"
            >
              {selectedLanguage === "EN" ? "🇺🇸" : "🇸🇦"}
              <span className="ml-2">{selectedLanguage}</span>
            </button>
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 z-50 bg-white rounded-lg shadow-lg">
                <button
                  onClick={() => changeLanguage("EN")}
                  className="block w-full px-5 py-3 text-left text-gray-800 hover:bg-gray-100"
                >
                  🇺🇸 English
                </button>
                <button
                  onClick={() => changeLanguage("AR")}
                  className="block w-full px-5 py-3 text-left text-gray-800 hover:bg-gray-100"
                >
                  🇸🇦 Arabic
                </button>
              </div>
            )}
          </div>
          {userEmail ? (
            <div ref={dropdownRef}>
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300"
                onClick={toggleDropdown}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://lh3.googleusercontent.com/a/AEdFTp66EFEBuCaV97k3UmCiUIfgQ07VOv7VO-GCdRw3WQ=s96-c"
                  alt=""
                />
              </button>

              {isDropdownOpen && (
                <div
                  className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg absolute top-16 right-8"
                  id="user-dropdown"
                >
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900">
                      Alfito Febriansyah
                    </span>
                    <span className="block text-sm text-gray-500 truncate">
                      {userEmail || "Loading..."}
                    </span>
                  </div>
                  <ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <form action={logout}>
                        <button
                          type="submit"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Sign Out
                        </button>
                      </form>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 font-semibold text-white bg-[#f47516] rounded-lg hover:bg-orange-600 focus:ring-4 focus:ring-orange-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
