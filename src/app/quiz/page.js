"use client";

import Image from "next/image";
import React, { useState } from "react";
import { quizzes } from "./quizData";
import QuizModal from "@/components/QuizModal";
import AddQuizModal from "@/components/AddQuizModal";

const Page = () => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [completedQuizzes, setCompletedQuizzes] = useState({});
  const [allQuizzes, setAllQuizzes] = useState(quizzes);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load user quizzes from localStorage
  React.useEffect(() => {
    const savedQuizzes = localStorage.getItem('userQuizzes');
    if (savedQuizzes) {
      setAllQuizzes([...quizzes, ...JSON.parse(savedQuizzes)]);
    }
  }, []);

  const handleAddQuiz = (newQuiz) => {
    const userQuizzes = JSON.parse(localStorage.getItem('userQuizzes') || '[]');
    const updatedUserQuizzes = [...userQuizzes, newQuiz];
    localStorage.setItem('userQuizzes', JSON.stringify(updatedUserQuizzes));
    setAllQuizzes([...quizzes, ...updatedUserQuizzes]);
  };

  const totalQuizzes = allQuizzes.length;
  const completedCount = Object.keys(completedQuizzes).length;

  const data = [
    {
      id: 1,
      title: "Barcha testlar",
      value: totalQuizzes,
      icon: "/assets/allTests.png",
      color: "bg-[#0097F6]",
    },
    {
      id: 2,
      title: "Yechilgan testlar",
      value: completedCount,
      icon: "/assets/completedTests.png",
      color: "bg-[#00AF5F]",
    },
  ];

  const handleQuizClose = () => {
    if (selectedQuiz) {
      setCompletedQuizzes((prev) => ({
        ...prev,
        [selectedQuiz.id]: true,
      }));
    }
    setSelectedQuiz(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[26px] sm:text-[30px] lg:text-[34px] font-semibold leading-7 sm:leading-9 lg:leading-11">
          {"Testlar bo'limi"}
        </h1>
        <p className="text-[14px] lg:text-[18px] text-[#8144FE]">
          {"Test yechib bilimingizni oshiring va bonus ballarni qo'lga kiriting"}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full">
        {data.map((item) => {
          return (
            <div
              key={item.id}
              className="flex justify-between w-full bg-white p-6 rounded-2xl shadow-xl transition-all hover:shadow-2xl shadow-gray-200"
            >
              <div className="flex flex-col justify-between">
                <h2 className="text-[16px] lg:text-[20px] font-medium">
                  {item.title}
                </h2>
                <h1 className="text-[14px] lg:text-[16px]">
                  {item.value} ta
                </h1>
              </div>
              <div className={`${item.color} p-2.5 w-max h-max rounded-2xl`}>
                <Image
                  src={item.icon}
                  alt="icon"
                  width={0}
                  height={0}
                  className="min-w-7 min-h-7 lg:min-w-8 lg:min-h-8"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#8144FE] text-white px-6 py-3 rounded-2xl shadow-xl transition-all hover:shadow-2xl shadow-gray-200 cursor-pointer active:scale-95 font-bold"
        >
          {`Yangi test qo'shish`}
        </button>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {allQuizzes.map((quiz) => {
          const isCompleted = completedQuizzes[quiz.id];

          return (
            <div
              key={quiz.id}
              onClick={() => setSelectedQuiz(quiz)}
              className="bg-white flex flex-col cursor-pointer hover:bg-gray-50 border-2 border-white gap-2 p-6 rounded-2xl shadow-xl transition-all hover:shadow-2xl shadow-gray-200"
            >
              <div className="flex gap-2 items-center">
                <h1 className="font-semibold text-[18px] lg:text-[22px] leading-5.5">
                  {quiz.title}
                </h1>
                {isCompleted && (
                  <span className="text-[10px] lg:text-[14px] font-normal px-2 py-0.5 h-max bg-green-400 rounded">
                    Tugatilgan
                  </span>
                )}
              </div>

              <p className="text-[13px] lg:text-[16px] font-light">
                {quiz.description}
              </p>

              <div className="flex mt-1 lg:mt-1.5 gap-3 items-center">
                <div className="flex items-center gap-1.5 font-light text-[#45556C]">
                  <Image
                    src={"/assets/quiz-question-count.png"}
                    alt=""
                    className="min-w-4 lg:min-w-5"
                    width={0}
                    height={0}
                  />
                  <p className="text-[13px] lg:text-[16px]">
                    {quiz.questions.length} ta savollar
                  </p>
                </div>
                <div className="flex items-center gap-1.5 font-light text-[#45556C]">
                  <Image
                    src={"/assets/quiz-question-time.png"}
                    alt=""
                    className="min-w-4 lg:min-w-5"
                    width={0}
                    height={0}
                  />
                  <p className="text-[13px] lg:text-[16px]">{quiz.duration || 10} daqiqa</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-yellow-50 text-amber-600 rounded-lg border border-amber-100">
                   <span className="text-[12px] lg:text-[14px]">💎</span>
                   <span className="text-[13px] lg:text-[14px] font-bold">{quiz.diamonds || 10}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedQuiz && (
        <QuizModal quiz={selectedQuiz} onClose={handleQuizClose} />
      )}

      {isAddModalOpen && (
        <AddQuizModal 
          setIsModalOpen={setIsAddModalOpen} 
          onAddQuiz={handleAddQuiz} 
        />
      )}
    </div>
  );
};

export default Page;
