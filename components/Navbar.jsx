"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { logout } from "@/app/logout/action";
import Link from "next/link";
import { House } from "lucide-react";
import Image from "next/image";
import Icon from "../assets/Icon.png";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  // const dropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const t = useTranslations("Navbar");

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleLanguageDropdown = () => {
    setLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const closeDropdown = (event) => {
    if (
      languageDropdownRef.current &&
      !languageDropdownRef.current.contains(event.target)
    ) {
      setLanguageDropdownOpen(false);
    }
  };

  useEffect(() => {
    const fetchUserEmail = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUserEmail(session.user.email);
      }
    };

    fetchUserEmail();

    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, [supabase]);

  useEffect(() => {
    const savedLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("locale="))
      ?.split("=")[1];
    setSelectedLanguage(savedLocale || "en");
  }, []);

  const changeLanguage = (locale) => {
    document.cookie = `locale=${locale}; path=/`;
    setSelectedLanguage(locale);
    setLanguageDropdownOpen(false);
    router.refresh();
  };

  return (
    <nav className="bg-transparent">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-8">
        <a href="/" className="flex items-center space-x-3">
          <Image src={Icon} className="h-10 w-10" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            Quiztify
          </span>
        </a>
        <div className="flex items-center md:order-2 ">
          <div ref={languageDropdownRef} className="relative mr-5">
            <button
              onClick={toggleLanguageDropdown}
              className="flex items-center px-5 py-2 font-medium text-gray-800 glassmorphism rounded-lg"
            >
              {selectedLanguage === "en" ? "🇺🇸" : "🇸🇦"}
              <span className="ml-2 hidden md:flex uppercase">
                {selectedLanguage}
              </span>
            </button>
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 z-50 bg-white rounded-lg shadow-lg">
                <button
                  onClick={() => changeLanguage("en")}
                  className="block w-full px-5 py-3 text-left text-gray-800 hover:bg-gray-100"
                >
                  🇺🇸 English
                </button>
                <button
                  onClick={() => changeLanguage("ar")}
                  className="block w-full px-5 py-3 text-left text-gray-800 hover:bg-gray-100"
                >
                  🇸🇦 Arabic
                </button>
              </div>
            )}
          </div>
          {userEmail ? (
            <div className="flex flex-row">
              {pathname === "/" && (
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center mr-5 px-5 py-2 font-medium text-gray-800 glassmorphism rounded-lg "
                >
                  <House className="md:mr-2" />
                  <p className="hidden lg:flex">{t("dashboard")}</p>
                </button>
              )}
              <div>
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
              </div>

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
                          {t("logout")}
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
