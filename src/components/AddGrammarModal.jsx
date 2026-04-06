'use client'

import { X, Save, Type, AlignLeft } from 'lucide-react'
import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'

const AddGrammarModal = ({ setIsModalOpen, onAddRule, initialData }) => {
    const [title, setTitle] = useState(initialData?.title || "")
    const [content, setContent] = useState(initialData?.content || "")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (initialData) {
                const { data, error } = await supabase
                    .from('grammar')
                    .update({ title, content })
                    .eq('id', initialData.id)
                    .select()
                    .single()
                
                if (error) {
                    console.error("Supabase update error:", error)
                    alert("Saqlashda xatolik yuz berdi")
                    return
                }
                onAddRule(data)
            } else {
                const { data, error } = await supabase
                    .from('grammar')
                    .insert([{ title, content }])
                    .select()
                    .single()

                if (error) {
                    console.error("Supabase insert error:", error)
                    alert("Saqlashda xatolik yuz berdi")
                    return
                }
                onAddRule(data)
            }
            setIsModalOpen(false)
        } catch (error) {
            console.error('Error saving rule:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300'>
                <div className='p-6 border-b flex items-center justify-between bg-linear-to-r from-[#8144FE] to-[#5A2DB2] text-white'>
                    <h2 className='text-xl font-bold'>{initialData ? "Qoidani tahrirlash" : "Yangi qoida qo&apos;shish"}</h2>
                    <button onClick={() => setIsModalOpen(false)} className='p-2 hover:bg-white/20 rounded-full transition-all cursor-pointer'>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='p-6 sm:p-8 space-y-6'>
                    <div className='space-y-4'>
                        <div className='space-y-1'>
                            <label className='text-sm font-bold text-gray-700 ml-1 flex items-center gap-2'>
                                <Type size={16} className="text-[#8144FE]" /> Qoida nomi
                            </label>
                            <input
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className='w-full bg-gray-50 px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-[#8144FE] transition-all'
                                placeholder='Masalan: Ot so&apos;z turkumi'
                            />
                        </div>
                        <div className='space-y-1'>
                            <label className='text-sm font-bold text-gray-700 ml-1 flex items-center gap-2'>
                                <AlignLeft size={16} className="text-[#8144FE]" /> Qoida matni
                            </label>
                            <textarea
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className='w-full bg-gray-50 px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-[#8144FE] transition-all resize-none h-40'
                                placeholder='Qoida haqida to&apos;liq ma&apos;lumot kiriting...'
                            />
                        </div>
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className={`w-full py-4 text-white rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8144FE] hover:bg-[#6c34e0] shadow-indigo-100'}`}
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <><Save size={20} /> Saqlash</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddGrammarModal