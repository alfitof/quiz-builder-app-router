import Image from "next/image";
import bannerImage from "../assets/Frame 49.png";
import Navbar from "@/components/Navbar";

export default async function Home() {
  return (
    <div className="bg-home">
      <Navbar />
      <div
        className="grid grid-cols-1 px-10 place-items-center gap-0 lg:grid-cols-2 lg:gap-10 mt-8 lg:-mt-5"
        id="home"
      >
        <div className="mb-16 text-center lg:mb-0 lg:text-left lg:pl-20">
          <h1 className="font-bold" id="banner">
            Empower Your Learning with{" "}
            <span style={{ color: "#f47516" }}>Quiztify</span>
          </h1>
          <p className="my-6 text-gray-600 text-md leading-8">
            Create, manage, and take quizzes effortlessly with Quiztify! Whether
            you are a teacher, student, or just someone who loves to challenge
            their knowledge, Quiztify provides an intuitive and engaging
            platform to make learning fun and effective.
          </p>
        </div>

        <div className=" -mt-20 lg:mt-0">
          <Image src={bannerImage} layout="instrinsic" alt="" />
        </div>
      </div>
    </div>
  );
}
