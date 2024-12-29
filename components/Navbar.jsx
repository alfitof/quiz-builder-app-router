"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client"; // Impor fungsi untuk membuat klien Supabase
import { logout } from "@/app/logout/action";

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const dropdownRef = useRef(null);

  const supabase = createClient(); // Inisialisasi Supabase client

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
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
    <nav className="bg-white border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-8">
        <a
          href="https://flowbite.com/"
          className="flex items-center space-x-3 "
        >
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            Quiztify
          </span>
        </a>
        <div
          className="flex items-center md:order-2 space-x-3 md:space-x-0"
          ref={dropdownRef}
        >
          <button
            type="button"
            className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300"
            onClick={toggleDropdown}
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-10 h-10 rounded-full"
              src="https://lh3.googleusercontent.com/a/AEdFTp66EFEBuCaV97k3UmCiUIfgQ07VOv7VO-GCdRw3WQ=s96-c"
              alt="user photo"
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
                  {userEmail || "Loading..."} {/* Tampilkan email */}
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
      </div>
    </nav>
  );
};

export default Navbar;
