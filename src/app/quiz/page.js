"use client";

import Image from "next/image";
import React, { useState } from "react";
import QuizModal from "@/components/QuizModal";
import AddQuizModal from "@/components/AddQuizModal";
import ConfirmModal from "@/components/ConfirmModal";
import { Pencil, Trash2, Gem } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Page = () => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('user');
  const [completedQuizzesList, setCompletedQuizzesList] = useState([]);
  const [congratsInfo, setCongratsInfo] = useState(null); // { diamonds: number }
  const [confirmDelete, setConfirmDelete] = useState(null); // quiz id to delete

  React.useEffect(() => {
    const fetchRoleAndMetadata = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCompletedQuizzesList(user.user_metadata?.completed_quizzes || []);
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (data?.role) setUserRole(data.role);
      }
    };
    fetchRoleAndMetadata();
  }, []);

  // Load quizzes from Supabase
  React.useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('quizzes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Supabase fetch error:", error);
          return;
        }

        if (data) {
          const mappedData = data.map(q => ({
            ...q,
            id: q.id,
            duration: q.time,
            diamonds: q.reward,
            isCompleted: q.isCompleted || false,
            progress: q.progress || 0,
            questions: q.question || []
          }));
          setAllQuizzes(mappedData);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleQuizClick = async (quiz) => {
    // We already fetch the full details (question column) in the initial fetch
    setSelectedQuiz(quiz);
  };

  const handleAddQuiz = async (newQuiz) => {
    try {
      const backendQuiz = {
        title: newQuiz.title,
        description: newQuiz.description,
        time: newQuiz.duration,
        reward: newQuiz.diamonds,
        question: newQuiz.questions
      };

      if (editingQuiz) {
        const { data, error } = await supabase
          .from('quizzes')
          .update(backendQuiz)
          .eq('id', editingQuiz.id)
          .select()
          .single();

        if (error) {
          console.error("Error updating quiz:", error);
          alert("Saqlashda xatolik yuz berdi");
          return;
        }

        const mappedQuiz = {
          ...data,
          id: data.id,
          duration: data.time,
          diamonds: data.reward,
          isCompleted: data.isCompleted || false,
          progress: data.progress || 0,
          questions: data.question || []
        };

        setAllQuizzes(prev => prev.map(q => q.id === editingQuiz.id ? mappedQuiz : q));
      } else {
        // Also set initial values for new quiz completion status
        backendQuiz.isCompleted = false;
        backendQuiz.progress = 0;

        const { data, error } = await supabase
          .from('quizzes')
          .insert([backendQuiz])
          .select()
          .single();

        if (error) {
          console.error("Error adding quiz:", error);
          alert("Saqlashda xatolik yuz berdi");
          return;
        }

        const mappedQuiz = {
          ...data,
          id: data.id,
          duration: data.time,
          diamonds: data.reward,
          isCompleted: data.isCompleted || false,
          progress: data.progress || 0,
          questions: data.question || []
        };

        setAllQuizzes(prev => [mappedQuiz, ...prev]);
      }
      setIsAddModalOpen(false);
      setEditingQuiz(null);
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Xatolik yuz berdi");
    }
  };

  const handleDeleteQuiz = async (e, id) => {
    e.stopPropagation();
    setConfirmDelete(id);
  };

  const handleEditClick = (e, quiz) => {
    e.stopPropagation();
    setEditingQuiz(quiz);
    setIsAddModalOpen(true);
  };

  const totalQuizzes = allQuizzes.length;
  const completedCount = allQuizzes.filter(q => q.isCompleted).length;

  const statsData = [
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

  const handleProgressUpdate = async (progress) => {
    if (selectedQuiz) {
      try {
        const { error } = await supabase
          .from('quizzes')
          .update({ progress })
          .eq('id', selectedQuiz.id);

        if (error) console.error("Error updating progress:", error);
        else setAllQuizzes(prev => prev.map(q => q.id === selectedQuiz.id ? { ...q, progress } : q));
      } catch (error) {
        console.error("Error updating progress:", error);
      }
    }
  };

  const handleQuizClose = (results) => {
    if (selectedQuiz && results) {
      if (results.percentage === 100) {
        // Run DB operations in background so modal closes instantly
        (async () => {
          try {
            if (userRole === 'user') {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                const completedQuizzes = user.user_metadata?.completed_quizzes || [];
                const isFirstTime = !completedQuizzes.includes(selectedQuiz.id);

                if (isFirstTime) {
                  const earnedDiamonds = selectedQuiz.diamonds || 10;
                  await supabase.auth.updateUser({
                    data: { completed_quizzes: [...completedQuizzes, selectedQuiz.id] }
                  });
                  setCompletedQuizzesList(prev => [...prev, selectedQuiz.id]);

                  const { data: profile } = await supabase.from('profiles').select('diamonds, tests_taken').eq('id', user.id).single();
                  const currentDiamonds = profile?.diamonds || 0;
                  const currentTestsTaken = profile?.tests_taken || 0;
                  const newDiamonds = currentDiamonds + earnedDiamonds;

                  await supabase.from('profiles').update({
                    diamonds: newDiamonds,
                    tests_taken: currentTestsTaken + 1
                  }).eq('id', user.id);

                  window.dispatchEvent(new Event('diamondsUpdated'));
                  setCongratsInfo({ diamonds: earnedDiamonds });
                }
              }
            }

            const { error } = await supabase
              .from('quizzes')
              .update({ isCompleted: true, progress: 100 })
              .eq('id', selectedQuiz.id);

            if (error) console.error("Error marking completion:", error);
          } catch (error) {
            console.error("Background quiz update error:", error);
          }
        })();

        // Instant UI update
        setAllQuizzes(prev => prev.map(q => q.id === selectedQuiz.id ? { ...q, isCompleted: true, progress: 100 } : q));
      } else {
        const newProgress = results.percentage === 0 ? selectedQuiz.progress : selectedQuiz.progress;
        setAllQuizzes(prev => prev.map(q => q.id === selectedQuiz.id ? { ...q, progress: newProgress } : q));
      }
    }
    setSelectedQuiz(null);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Congratulations Modal */}
      {congratsInfo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col gap-5 items-center text-center animate-in zoom-in duration-200">
            <div className="text-6xl animate-bounce">🎉</div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Tabriklaymiz!</h3>
              <p className="text-gray-500 text-sm">Siz bu testni 100% to&apos;g&apos;ri yechdingiz!</p>
            </div>
            <div className="flex items-center gap-3 bg-indigo-50 px-6 py-4 rounded-2xl">
              <span className="text-3xl">💎</span>
              <div className="text-left">
                <p className="text-xs text-gray-500 font-medium">Sizga qo&apos;shildi</p>
                <p className="text-3xl font-black text-indigo-600">+{congratsInfo.diamonds}</p>
              </div>
            </div>
            <button
              onClick={() => setCongratsInfo(null)}
              className="w-full py-3.5 bg-linear-to-r from-[#8144FE] to-[#5B2CC7] text-white font-black text-lg rounded-2xl hover:opacity-90 transition-all cursor-pointer active:scale-[0.98] shadow-lg shadow-indigo-200"
            >
              Yaxshi! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <ConfirmModal
          title="Testni o'chirmoqchimisiz?"
          message="Bu amalni qaytarib bo'lmaydi."
          confirmText="Ha, o'chirish"
          cancelText="Bekor qilish"
          onConfirm={async () => {
            try {
              const { error } = await supabase.from('quizzes').delete().eq('id', confirmDelete);
              if (!error) setAllQuizzes(prev => prev.filter(q => q.id !== confirmDelete));
            } catch (e) { console.error(e); }
            setConfirmDelete(null);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
      <div>
        <h1 className="text-[26px] sm:text-[30px] lg:text-[34px] font-semibold leading-7 sm:leading-9 lg:leading-11">
          {"Testlar bo'limi"}
        </h1>
        <p className="text-[14px] lg:text-[18px] text-[#8144FE]">
          {"Test yechib bilimingizni oshiring va bonus ballarni qo'lga kiriting"}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full">
        {statsData.map((item) => {
          return (
            <div
              key={item.id}
              className="flex justify-between w-full bg-white p-4 sm:p-6 rounded-2xl shadow-xl transition-all hover:shadow-2xl shadow-gray-200"
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

      {userRole === 'admin' && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#8144FE] text-white px-6 py-3 rounded-2xl shadow-xl transition-all hover:shadow-2xl shadow-gray-200 cursor-pointer active:scale-95 font-bold"
          >
            {`Yangi test qo'shish`}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 w-full">
        {loading && (
          <div className="flex justify-center p-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8144FE]"></div>
          </div>
        )}
        {!loading && allQuizzes.length === 0 && (
          <p className="text-center text-gray-500 py-10 font-medium">Hozircha testlar mavjud emas.</p>
        )}
        {allQuizzes.map((quiz) => {
          return (
            <div
              key={quiz.id}
              onClick={() => handleQuizClick(quiz)}
              className="bg-white flex flex-col cursor-pointer group hover:bg-gray-50 border-2 border-white gap-1.5 sm:gap-2 p-4 sm:p-6 rounded-2xl shadow-xl transition-all hover:shadow-2xl shadow-gray-200 relative overflow-hidden"
            >
              <div className="flex gap-2 items-center justify-between">
                <div className="flex gap-2 items-center">
                  <h1 className="font-semibold text-[18px] lg:text-[22px] leading-5.5">
                    {quiz.title}
                  </h1>
                  {quiz.isCompleted && (
                    <span className="text-[10px] lg:text-[14px] font-normal px-2 py-0.5 h-max bg-green-100 text-green-700 rounded-md border border-green-200">
                      Tugatilgan
                    </span>
                  )}
                </div>

                {userRole === 'admin' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleEditClick(e, quiz)}
                      className="p-2 hover:bg-blue-50 cursor-pointer text-blue-500 rounded-xl transition-all"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteQuiz(e, quiz.id)}
                      className="p-2 hover:bg-red-50 cursor-pointer text-red-500 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
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

              {/* Progress Bar */}
              <div className='w-full flex gap-3 items-center mt-2'>
                <div className='flex-1 bg-gray-100 rounded-full h-1.5 lg:h-2 overflow-hidden'>
                  <div
                    className='h-full bg-linear-to-r from-[#8144FE] to-[#5B2CC7] rounded-full transition-all duration-500'
                    style={{ width: `${quiz.isCompleted ? 100 : (quiz.progress || 0)}%` }}
                  ></div>
                </div>
                <h1 className='w-max text-[12px] lg:text-[14px] font-bold text-[#8144FE]'>
                  {quiz.isCompleted ? 100 : (quiz.progress || 0)}%
                </h1>
              </div>
            </div>
          );
        })}
      </div>

      {selectedQuiz && (
        <QuizModal
          quiz={selectedQuiz}
          onClose={handleQuizClose}
          onProgressUpdate={handleProgressUpdate}
          isAlreadyCompleted={completedQuizzesList.includes(selectedQuiz.id)}
        />
      )}

      {isAddModalOpen && (
        <AddQuizModal
          setIsModalOpen={(val) => {
            setIsAddModalOpen(val);
            if (!val) setEditingQuiz(null);
          }}
          onAddQuiz={handleAddQuiz}
          initialData={editingQuiz}
        />
      )}
    </div>
  );
};

export default Page;