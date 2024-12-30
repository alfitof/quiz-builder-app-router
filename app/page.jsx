import Image from "next/image";
import bannerImage from "../assets/Frame 49.png";
import Navbar from "@/components/Navbar";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("Home");
  return (
    <div className="bg-home">
      <Navbar />
      <div
        className="grid grid-cols-1 px-10 place-items-center gap-0 lg:grid-cols-2 lg:gap-10 mt-8 lg:-mt-5"
        id="home"
      >
        <div className="mb-16 text-center lg:mb-0 lg:text-left lg:pl-20">
          <h1 className="font-bold" id="banner">
            {t("title")} <span style={{ color: "#f47516" }}>Quiztify</span>
          </h1>
          <p className="my-6 text-gray-600 text-md leading-8">{t("desc")}</p>
        </div>

        <div className=" -mt-20 lg:mt-0">
          <Image src={bannerImage} layout="instrinsic" alt="" />
        </div>
      </div>
    </div>
  );
}
