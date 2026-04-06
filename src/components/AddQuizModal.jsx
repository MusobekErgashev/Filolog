'use client'

import { X, Plus, Trash2, Clock, HelpCircle, Save } from 'lucide-react'
import React, { useState } from 'react'

const AddQuizModal = ({ setIsModalOpen, onAddQuiz, initialData }) => {
    const [title, setTitle] = useState(initialData?.title || "")
    const [description, setDescription] = useState(initialData?.description || "")
    const [duration, setDuration] = useState(initialData?.duration || 10)
    const [diamonds, setDiamonds] = useState(initialData?.diamonds || 10)
    const [questions, setQuestions] = useState(initialData?.questions || [
        { question: "", options: ["", "", "", ""], correctAnswer: 0 }
    ])

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }])
    }

    const handleRemoveQuestion = (index) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index))
        }
    }

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions]
        newQuestions[index].question = value
        setQuestions(newQuestions)
    }

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const newQuestions = [...questions]
        newQuestions[questionIndex].options[optionIndex] = value
        setQuestions(newQuestions)
    }

    const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
        const newQuestions = [...questions]
        newQuestions[questionIndex].correctAnswer = optionIndex
        setQuestions(newQuestions)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const newQuiz = {
            title,
            description,
            duration: Number(duration),
            diamonds: Number(diamonds),
            questions
        }
        onAddQuiz(newQuiz)
        setIsModalOpen(false)
    }

    return (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300'>
                <div className='p-6 border-b flex items-center justify-between bg-linear-to-r from-[#8144FE] to-[#5A2DB2] text-white'>
                    <h2 className='text-xl font-bold'>{initialData ? "Testni tahrirlash" : "Yangi test qo'shish"}</h2>
                    <button onClick={() => setIsModalOpen(false)} className='p-2 hover:bg-white/20 rounded-full transition-all cursor-pointer'>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='flex-1 overflow-y-auto p-6 sm:p-8 space-y-8'>
                    {/* Basic Info */}
                    <div className='space-y-4'>
                        <div className='space-y-1'>
                            <label className='text-sm font-bold text-gray-700 ml-1'>Test nomi</label>
                            <input
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className='w-full bg-gray-50 px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-[#8144FE] transition-all'
                                placeholder='Masalan: O&apos;zbek tili grammatikasi'
                            />
                        </div>
                        <div className='space-y-1'>
                            <label className='text-sm font-bold text-gray-700 ml-1'>Tavsif</label>
                            <textarea
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className='w-full bg-gray-50 px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-[#8144FE] transition-all resize-none h-20'
                                placeholder='Test haqida qisqacha ma&apos;lumot...'
                            />
                        </div>
                        <div className='flex flex-col md:flex-row gap-4'>
                            <div className='flex-1 space-y-1'>
                                <label className='text-sm font-bold text-gray-700 ml-1'>Vaqt (daqiqa)</label>
                                <div className='relative'>
                                    <Clock size={18} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
                                    <input
                                        required
                                        type='number'
                                        min='1'
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className={`w-full bg-gray-50 pl-12 pr-4 py-3 rounded-2xl border outline-none transition-all ${Number(duration) > 10 ? 'border-red-500 text-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#8144FE]'}`}
                                    />
                                </div>
                                {Number(duration) > 10 && (
                                    <p className='text-[10px] lg:text-[12px] text-red-500 font-bold mt-1 ml-1 animate-pulse'>
                                        ⚠️ Maksimal vaqt 10 daqiqa!
                                    </p>
                                )}
                            </div>
                            <div className='flex-1 space-y-1'>
                                <label className='text-sm font-bold text-gray-700 ml-1'>Mukofot (Olmos)</label>
                                <div className='flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200'>
                                    {[5, 10, 15, 20].map((val) => (
                                        <button
                                            key={val}
                                            type='button'
                                            onClick={() => setDiamonds(val)}
                                            className={`flex-1 py-2 rounded-xl text-sm font-bold font-mono transition-all cursor-pointer ${diamonds === val ? 'bg-[#8144FE] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Questions */}
                    <div className='space-y-6'>
                        <div className='flex items-center justify-between'>
                            <h3 className='text-lg font-bold text-gray-800'>Savollar</h3>
                            <button
                                type='button'
                                onClick={handleAddQuestion}
                                className='flex items-center gap-2 text-sm font-bold text-[#8144FE] hover:bg-[#8144FE]/10 px-4 py-2 rounded-xl transition-all cursor-pointer'
                            >
                                <Plus size={18} /> Savol qo&apos;shish
                            </button>
                        </div>

                        {questions.map((q, qIndex) => (
                            <div key={qIndex} className='p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4 relative group'>
                                <button
                                    type='button'
                                    onClick={() => handleRemoveQuestion(qIndex)}
                                    className='absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-2'
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div className='space-y-2'>
                                    <label className='text-sm font-bold text-gray-500'>Savol {qIndex + 1}</label>
                                    <input
                                        required
                                        value={q.question}
                                        onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                        className='w-full bg-white px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-[#8144FE] transition-all font-medium'
                                        placeholder='Savolingizni kiriting...'
                                    />
                                </div>

                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                    {q.options.map((option, oIndex) => (
                                        <div key={oIndex} className='flex gap-2 items-center'>
                                            <input
                                                type='radio'
                                                name={`correct-${qIndex}`}
                                                checked={q.correctAnswer === oIndex}
                                                onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                                                className='w-5 h-5 accent-[#8144FE] cursor-pointer'
                                            />
                                            <input
                                                required
                                                value={option}
                                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                className='w-full bg-white px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#8144FE] transition-all text-sm'
                                                placeholder={`Variant ${String.fromCharCode(65 + oIndex)}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type='submit'
                        disabled={Number(duration) > 10}
                        className={`w-full py-2.5 lg:py-4 text-white rounded-2xl font-bold text-md lg:text-lg transition-all shadow-lg cursor-pointer flex items-center justify-center gap-3 active:scale-[0.98] ${Number(duration) > 10 ? 'bg-gray-300 shadow-none cursor-not-allowed opacity-70' : 'bg-[#8144FE] hover:bg-[#6c34e0] shadow-indigo-100'}`}
                    >
                        <Save size={20} /> {initialData ? "O'zgarishlarni saqlash" : "Testni saqlash"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddQuizModal
