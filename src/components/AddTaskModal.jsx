'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { X, Plus, Loader2, CheckCircle2, BookOpen, Gem } from 'lucide-react'

const AddTaskModal = ({ isOpen, onClose, onAdded, editData = null }) => {
  const [title, setTitle] = useState(editData?.title || '')
  const [content, setContent] = useState(editData?.content || '')
  const [diamonds, setDiamonds] = useState(editData?.diamonds || 10)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // EditData o'zgarganda (masalan, ikkinchi marta edit bosilganda) state larni yangilash
  React.useEffect(() => {
    if (isOpen) {
      setTitle(editData?.title || '')
      setContent(editData?.content || '')
      setDiamonds(editData?.diamonds || 10)
    }
  }, [isOpen, editData])

  if (!isOpen) return null

  const reset = () => {
    setTitle('')
    setContent('')
    setDiamonds(10)
    setSuccess(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('⚠️ Mavzu sarlavhasini kiriting!')
      return
    }
    setLoading(true)
    try {
      if (editData?.id) {
        // Tahrirlash
        const { error } = await supabase
          .from('tasks')
          .update({ title: title.trim(), content: content.trim(), diamonds })
          .eq('id', editData.id)
        if (error) throw error
      } else {
        // Yangi qo'shish
        const { error } = await supabase
          .from('tasks')
          .insert([{ title: title.trim(), content: content.trim(), diamonds }])
        if (error) throw error
      }

      setSuccess(true)
      onAdded?.()
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err) {
      alert(`❌ Xatolik: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        style={{ animation: 'slideUp 0.35s ease-out' }}>

        {success && (
          <div className="absolute inset-0 z-10 bg-white/95 flex flex-col items-center justify-center gap-3 rounded-3xl"
            style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="text-green-500" size={40} />
            </div>
            <p className="text-lg font-bold text-slate-800">
              {editData?.id ? 'Vazifa yangilandi!' : 'Vazifa qo\'shildi!'}
            </p>
          </div>
        )}

        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#8144FE] via-[#9B6AFF] to-[#B794FF] px-6 py-5">
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                {editData?.id ? <BookOpen className="text-white" size={20} /> : <Plus className="text-white" size={20} />}
              </div>
              <h2 className="text-white text-lg font-bold">
                {editData?.id ? 'Vazifani tahrirlash' : 'Yangi esse vazifasi'}
              </h2>
            </div>
            <button onClick={handleClose}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-white cursor-pointer">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Sarlavha */}
          <div>
            <label className="text-sm font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5 block focus-within:text-[#8144FE] transition-colors">
              <BookOpen size={15} className="text-[#8144FE]" />
              Esse mavzusi <span className="text-red-400">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Ona tilimiz — millat g'ururi"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl
                text-sm text-slate-700 placeholder:text-slate-400
                focus:outline-none focus:ring-4 focus:ring-[#8144FE]/10 focus:border-[#8144FE] transition-all"
              id="add-task-title"
            />
          </div>

          {/* Tavsif */}
          <div>
            <label className="text-sm font-semibold text-slate-600 mb-1.5 block focus-within:text-[#8144FE] transition-colors">
              Qo&apos;shimcha ko&apos;rsatma <span className="text-slate-400 font-normal">(ixtiyoriy)</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="O'quvchilarga yo'riqnoma yozing..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl
                text-sm text-slate-700 placeholder:text-slate-400
                focus:outline-none focus:ring-4 focus:ring-[#8144FE]/10 focus:border-[#8144FE]
                transition-all resize-none"
              id="add-task-content"
            />
          </div>

          {/* Diamond range */}
          <div>
            <label className="text-sm font-semibold text-slate-600 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Gem size={15} className="text-amber-500" />
                Diamond mukofoti
              </span>
              <span className="flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-100 rounded-xl text-amber-600 font-bold text-sm">
                💎 {diamonds}
              </span>
            </label>
            <div className="px-1">
              <input
                type="range"
                min={1}
                max={50}
                value={diamonds}
                onChange={(e) => setDiamonds(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #8144FE ${((diamonds - 1) / 49) * 100}%, #e2e8f0 ${((diamonds - 1) / 49) * 100}%)`
                }}
                id="add-task-diamonds"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                <span>1</span>
                <span>25</span>
                <span>50</span>
              </div>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-white text-sm
              flex items-center justify-center gap-2.5 transition-all duration-300 shadow-lg cursor-pointer
              ${loading
                ? 'bg-[#8144FE]/60 cursor-wait'
                : 'bg-gradient-to-r from-[#8144FE] to-[#9B6AFF] hover:shadow-xl hover:shadow-[#8144FE]/25 hover:scale-[1.02] active:scale-95'
              }`}
            id="add-task-submit"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={18} /> Saqlanmoqda...</>
            ) : (
              <>{editData?.id ? <BookOpen size={18} /> : <Plus size={18} />} {editData?.id ? 'O\'zgarishlarni saqlash' : 'Vazifa qo\'shish'}</>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default AddTaskModal
