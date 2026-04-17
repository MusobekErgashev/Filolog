'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { X, Star, MessageSquare, Loader2, CheckCircle2, User, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'

// Admin submission-ni tekshirib, ball va javob beradi
const AdminReviewModal = ({ isOpen, onClose, submission, task, onReviewed }) => {
  const [score, setScore] = useState(submission?.score ?? 0)
  const [feedback, setFeedback] = useState(submission?.feedback ?? '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Lightbox state
  const [showLightbox, setShowLightbox] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  if (!isOpen || !submission) return null

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1))
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const maxDiamonds = task?.diamonds || 10
      const earnedDiamonds = Math.round((score / 24) * maxDiamonds)

      const { error } = await supabase
        .from('submissions')
        .update({
          score,
          feedback,
          status: 'approved',
        })
        .eq('id', submission.id)

      if (error) throw error

      if (submission.user_id && earnedDiamonds > 0) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('diamonds')
          .eq('id', submission.user_id)
          .single()

        if (profile) {
          await supabase
            .from('profiles')
            .update({ diamonds: (profile.diamonds || 0) + earnedDiamonds })
            .eq('id', submission.user_id)
        }
      }

      setSuccess(true)
      onReviewed?.()
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 1500)
    } catch (err) {
      alert(`❌ Xatolik: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const scoreColor =
    score >= 20 ? 'text-green-600' :
      score >= 12 ? 'text-amber-600' :
        'text-red-500'

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute h-screen inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          style={{ animation: 'slideUp 0.35s ease-out' }}>

          {success && (
            <div className="absolute inset-0 z-10 bg-white/95 flex flex-col items-center justify-center gap-3 rounded-3xl"
              style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="text-green-500" size={40} />
              </div>
              <p className="text-lg font-bold text-slate-800">Baholandi!</p>
            </div>
          )}

          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#8144FE] via-[#9B6AFF] to-[#B794FF] px-6 py-5">
            <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h2 className="text-white text-lg font-bold">Esseni baholash</h2>
                <div className="flex items-center gap-2 mt-1">
                  <User size={18} className="text-white/70" />
                  <p className="text-white/80 flex flex-col text-sm font-medium">
                    <span className='text-[14px] font-semibold'>{submission.profiles?.first_name} {submission.profiles?.last_name}</span>
                    <span className="text-white/50 text-xs">({submission.user_email})</span>
                  </p>
                </div>
              </div>
              <button onClick={onClose}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Rasm */}
            {submission.answer_image && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Yuklangan esse</p>
                <div
                  onClick={() => setShowLightbox(true)}
                  className="relative group cursor-zoom-in"
                >
                  <img
                    src={submission.answer_image}
                    alt="Esse rasmi"
                    className="w-full max-h-40 object-contain rounded-2xl border border-slate-100 bg-slate-50 group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                    <span className="bg-white/90 px-3 py-1.5 rounded-full text-xs font-bold text-[#8144FE] flex items-center gap-1.5 shadow-sm">
                      <ZoomIn size={14} /> Kattalashtirish
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* O'quvchi izohi */}
            {submission.user_description && (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">O'quvchi izohi</p>
                <p className="text-slate-700 text-sm">{submission.user_description}</p>
              </div>
            )}

            {/* Ball berish */}
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Star size={15} className="text-[#8144FE]" />
                  Ball berish
                </span>
                <span className={`text-2xl font-black ${scoreColor}`}>{score} <span className="text-sm font-medium text-slate-400">/ 24</span></span>
              </label>
              <div className="px-1">
                <input
                  type="range"
                  min={0}
                  max={24}
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #8144FE ${(score / 24) * 100}%, #e2e8f0 ${(score / 24) * 100}%)`
                  }}
                  id="review-score-range"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                  <span>0</span>
                  <span>8</span>
                  <span>16</span>
                  <span>24</span>
                </div>
              </div>

              {/* Ball bo'limlari */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[
                  { label: 'Past', range: '0–8', color: 'bg-red-50 text-red-500 border-red-100' },
                  { label: "O'rta", range: '9–16', color: 'bg-amber-50 text-amber-600 border-amber-100' },
                  { label: 'Yuqori', range: '17–24', color: 'bg-green-50 text-green-600 border-green-100' },
                ].map((b) => (
                  <div key={b.label} className={`border rounded-xl px-3 py-2 text-center ${b.color}`}>
                    <p className="text-xs font-bold">{b.label}</p>
                    <p className="text-[11px] opacity-70">{b.range}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Matnli javob */}
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5 block">
                <MessageSquare size={14} className="text-[#8144FE]" />
                O'quvchiga javob <span className="text-slate-400 font-normal">(ixtiyoriy)</span>
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="O'quvchiga fikr-mulohaza yozing..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl
                  text-sm text-slate-700 placeholder:text-slate-400
                  focus:outline-none focus:ring-2 focus:ring-[#8144FE]/30 focus:border-[#8144FE]
                  transition-all resize-none"
                id="review-feedback"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl font-semibold text-slate-600 text-sm border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`flex-2 flex-[2] py-3 rounded-2xl font-semibold text-white text-sm
                  flex items-center justify-center gap-2 transition-all duration-300 shadow-lg cursor-pointer
                  ${loading
                    ? 'bg-[#8144FE]/60 cursor-wait'
                    : 'bg-gradient-to-r from-[#8144FE] to-[#9B6AFF] hover:shadow-xl hover:shadow-[#8144FE]/25 hover:scale-[1.02] active:scale-95'
                  }`}
                id="review-submit-btn"
              >
                {loading ? <><Loader2 className="animate-spin" size={16} /> Saqlanmoqda...</> : <><Star size={16} /> Baholash</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Preview */}
      {showLightbox && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/95 animate-in fade-in duration-300">
          {/* Controls */}
          <div className="absolute top-6 right-6 flex items-center gap-4 z-10">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10">
              <button onClick={handleZoomOut} className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer disabled:opacity-30" disabled={zoom <= 1}>
                <ZoomOut size={20} />
              </button>
              <span className="text-white text-sm font-bold w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={handleZoomIn} className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer disabled:opacity-30" disabled={zoom >= 4}>
                <ZoomIn size={20} />
              </button>
              <div className="w-px h-4 bg-white/20 mx-1" />
              <button onClick={handleRotate} className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
                <RotateCw size={20} />
              </button>
            </div>
            <button
              onClick={() => { setShowLightbox(false); setZoom(1); setRotation(0); }}
              className="p-3 bg-white text-black rounded-full hover:bg-white/90 hover:scale-110 active:scale-90 transition-all cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Image Container */}
          <div className="w-full h-full flex items-center justify-center overflow-auto p-10 custom-scrollbar">
            <img
              src={submission.answer_image}
              alt="Zoomed Review"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                maxHeight: '90vh',
                maxWidth: '90vw'
              }}
              className="object-contain shadow-2xl"
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  )
}

export default AdminReviewModal
