"use client";

import React, { useState } from "react";

const QuizModal = ({ quiz, onClose, onProgressUpdate, isAlreadyCompleted }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(quiz.questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState((quiz.duration || 10) * 60);

  const calculateProgress = (answers) => {
    const answeredCount = answers.filter(a => a !== null).length;
    return Math.round((answeredCount / quiz.questions.length) * 100);
  };

  React.useEffect(() => {
    if (showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResults]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const question = quiz.questions[currentQuestion];

  const handleSelectOption = (optionIndex) => {
    if (showResults) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);

    if (onProgressUpdate) {
      onProgressUpdate(calculateProgress(newAnswers));
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = () => {
    setShowResults(true);
  };

  const correctCount = selectedAnswers.reduce((count, answer, index) => {
    return answer === quiz.questions[index].correctAnswer ? count + 1 : count;
  }, 0);

  const incorrectCount = quiz.questions.length - correctCount;
  const percentage = Math.round((correctCount / quiz.questions.length) * 100);

  const isLastQuestion = currentQuestion === quiz.questions.length - 1;

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center gap-6 animate-[fadeIn_0.3s_ease-out]">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#8144FE] to-[#5B2CC7] flex items-center justify-center">
            <span className="text-3xl text-white font-bold">{percentage}%</span>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-800">
            Natijalar
          </h2>

          <p className="text-gray-500 text-center text-sm">{quiz.title}</p>

          <div className="flex gap-6 w-full justify-center">
            <div className="flex flex-col items-center gap-1 bg-green-50 px-6 py-4 rounded-2xl">
              <span className="text-3xl font-bold text-green-600">
                {correctCount}
              </span>
              <span className="text-sm text-green-600 font-medium">
                To&apos;g&apos;ri ✅
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 bg-red-50 px-6 py-4 rounded-2xl">
              <span className="text-3xl font-bold text-red-500">
                {incorrectCount}
              </span>
              <span className="text-sm text-red-500 font-medium">
                Xato ❌
              </span>
            </div>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${percentage}%`,
                background:
                  percentage >= 80
                    ? "linear-gradient(90deg, #00AF5F, #00D474)"
                    : percentage >= 50
                      ? "linear-gradient(90deg, #F59E0B, #FBBF24)"
                      : "linear-gradient(90deg, #EF4444, #F87171)",
              }}
            ></div>
          </div>

          <p className="text-sm text-gray-500">
            {percentage >= 80
              ? "Ajoyib natija! 🎉"
              : percentage >= 50
                ? "Yaxshi harakat! 💪"
                : "Ko'proq mashq qiling! 📚"}
          </p>

          <button
            onClick={() => onClose({ correctCount, incorrectCount, percentage })}
            className="w-full py-3 bg-linear-to-r from-[#8144FE] to-[#5B2CC7] text-white font-semibold rounded-xl hover:opacity-90 transition-all cursor-pointer active:scale-[0.98]"
          >
            Yopish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 flex flex-col gap-5 animate-[fadeIn_0.3s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate pr-4">
            {quiz.title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 cursor-pointer text-xl"
          >
            ✕
          </button>
        </div>

        {/* Progress & Timer */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#8144FE] to-[#5B2CC7] rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
              }}
            ></div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold ${timeLeft < 60 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-indigo-50 text-[#8144FE]'}`}>
              <span className="text-[12px]">⏱️</span> {formatTime(timeLeft)}
            </div>
            <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
              {currentQuestion + 1}/{quiz.questions.length}
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-50 rounded-2xl p-5">
          <p className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion] === index;
            const optionLetter = String.fromCharCode(65 + index);

            return (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                className={`flex items-center gap-3 w-full p-4 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer
                  ${isSelected
                    ? "border-[#8144FE] bg-[#8144FE]/5 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
              >
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all
                    ${isSelected
                      ? "bg-[#8144FE] text-white"
                      : "bg-gray-100 text-gray-500"
                    }`}
                >
                  {optionLetter}
                </span>
                <span
                  className={`text-sm sm:text-base font-medium ${isSelected ? "text-[#8144FE]" : "text-gray-700"
                    }`}
                >
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          {currentQuestion > 0 && (
            <button
              onClick={handlePrev}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer active:scale-[0.98]"
            >
              Oldingi
            </button>
          )}

          {isLastQuestion ? (
            isAlreadyCompleted ? (
              <button
                disabled
                className="flex-1 py-3 font-semibold rounded-xl transition-all cursor-not-allowed bg-green-100 text-green-600 border border-green-200"
              >
                Siz bu testni yechib bo&apos;lgansiz ✅
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={selectedAnswers.includes(null)}
                className={`flex-1 py-3 font-semibold rounded-xl transition-all cursor-pointer active:scale-[0.98]
                  ${selectedAnswers.includes(null)
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-[#8144FE] to-[#5B2CC7] text-white hover:opacity-90"
                  }`}
              >
                Tugatish
              </button>
            )
          ) : (
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === null}
              className={`flex-1 py-3 font-semibold rounded-xl transition-all cursor-pointer active:scale-[0.98]
                ${selectedAnswers[currentQuestion] === null
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-linear-to-r from-[#8144FE] to-[#5B2CC7] text-white hover:opacity-90"
                }`}
            >
              Keyingi
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
