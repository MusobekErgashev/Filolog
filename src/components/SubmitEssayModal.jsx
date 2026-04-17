'use client'

import React, { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { X, Upload, FileImage, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

/**
 * 1. Rasm yuklash funksiyasi:
 *    Foydalanuvchi tanlagan rasmni Supabase Storage-dagi "submissions" bucket-iga yuklaydi.
 *    Fayl nomi: `Date.now()_originalName` — takrorlanmaydi.
 *
 * 2. Ma'lumotlarni bazaga yozish:
 *    Rasm yuklangach, uning Public URL manzilini olib,
 *    submissions jadvaliga yangi qator (row) qo'shadi.
 */

// ──────────────────────────────────────────────────────────────────
// Rasm yuklash funksiyasi (Supabase Storage → "submissions" bucket)
// ──────────────────────────────────────────────────────────────────
async function uploadImage(file) {
  // Clean file name to avoid issues with special characters
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
  const uniqueName = `${Date.now()}_${cleanFileName}`
  const bucketName = 'photos'
  const filePath = `essays/${uniqueName}`

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type // Explicitly set content type
    })

  if (error) {
    console.error("Storage upload error details:", error);
    throw new Error(`Rasm yuklashda xatolik: ${error.message || 'Noma\'lum xato'}`);
  }

  // Public URL olish
  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath)

  return urlData.publicUrl
}

// ──────────────────────────────────────────────────────────────────
// Ma'lumotlarni bazaga yozish (submissions jadvaliga)
// ──────────────────────────────────────────────────────────────────
async function insertSubmission({ task_id, user_id, user_email, answer_image, user_description }) {
  const { data, error } = await supabase
    .from('submissions')
    .insert([
      {
        task_id,
        user_id,
        user_email,
        answer_image,
        user_description,
        status: 'pending',
      },
    ])
    .select()

  if (error) throw error
  return data
}

// ──────────────────────────────────────────────────────────────────
// React komponenti — Modal
// ──────────────────────────────────────────────────────────────────
const SubmitEssayModal = ({ isOpen, onClose, task }) => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  if (!isOpen || !task) return null

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (ev) => setPreview(ev.target.result)
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)
      const reader = new FileReader()
      reader.onload = (ev) => setPreview(ev.target.result)
      reader.readAsDataURL(droppedFile)
    }
  }

  const resetForm = () => {
    setFile(null)
    setPreview(null)
    setDescription('')
    setSuccess(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  // ── Yuborish ──
  const handleSubmit = async () => {
    if (!file) {
      alert('⚠️ Iltimos, avval rasm tanlang!')
      return
    }

    setLoading(true)

    try {
      // 1. Foydalanuvchi emailini olish
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('⚠️ Iltimos, avval tizimga kiring!')
        setLoading(false)
        return
      }

      // 2. Rasmni yuklash
      const imageUrl = await uploadImage(file)

      // 3. Bazaga yozish
      await insertSubmission({
        task_id: task.id,
        user_id: user.id,
        user_email: user.email,
        answer_image: imageUrl,
        user_description: description || '',
      })

      setSuccess(true)

      // 2 sekunddan keyin modalni yopish
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (err) {
      console.error('Xatolik:', err)
      // 4. Xatoliklarni boshqarish
      if (err.message?.includes('storage')) {
        alert('❌ Rasm yuklashda xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.')
      } else {
        alert(`❌ Xatolik yuz berdi: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ animation: 'modalFadeIn 0.3s ease-out' }}
    >
      {/* Overlay */}
      <div
        className="absolute h-screen inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        style={{ animation: 'modalSlideUp 0.4s ease-out' }}
      >
        {/* Success overlay */}
        {success && (
          <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 rounded-3xl"
            style={{ animation: 'modalFadeIn 0.3s ease-out' }}
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="text-green-500" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Muvaffaqiyatli!</h3>
            <p className="text-slate-500 text-center px-8">
              Sizning esseniz muvaffaqiyatli yuborildi. <br />
              {`Tekshirilgandan so'ng natija bildiriladi.`}
            </p>
          </div>
        )}

        {/* Header gradient */}
        <div className="relative bg-linear-to-r from-[#8144FE] via-[#9B6AFF] to-[#B794FF] px-6 py-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-8 w-16 h-16 bg-white/10 rounded-full translate-y-1/2" />

          <div className="flex items-center justify-between relative z-10">
            <h2 className="text-white text-xl font-bold">Esse topshirish</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Vazifa matni */}
          {task.content && (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Mavzu</p>
              <p className="text-md font-semibold mb-1">{task.title}</p>
              <p className="text-slate-700 text-sm leading-relaxed">{task.content}</p>
            </div>
          )}

          {/* Fayl yuklash zona */}
          <div>
            <label className="text-sm font-semibold text-slate-600 mb-2 block">
              Esse rasmi <span className="text-red-400">*</span>
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-2xl cursor-pointer
                transition-all duration-300 overflow-hidden
                ${dragActive
                  ? 'border-[#8144FE] bg-[#8144FE]/5 scale-[1.02]'
                  : preview
                    ? 'border-green-300 bg-green-50/50'
                    : 'border-slate-200 bg-slate-50 hover:border-[#8144FE]/50 hover:bg-[#8144FE]/5'
                }
              `}
            >
              {preview ? (
                <div className="relative group">
                  <img
                    src={preview}
                    alt="Tanlangan rasm"
                    className="w-full max-h-48 object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                    <p className="text-white font-medium text-sm">Almashtirish uchun bosing</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#8144FE]/10 flex items-center justify-center mb-3">
                    <FileImage className="text-[#8144FE]" size={28} />
                  </div>
                  <p className="text-slate-600 font-medium text-sm">
                    Rasmni bu yerga tashlang yoki <span className="text-[#8144FE] font-semibold">tanlang</span>
                  </p>
                  <p className="text-slate-400 text-xs mt-1">PNG, JPG, WEBP — 10MB gacha</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="essay-file-input"
              />
            </div>

            {file && (
              <div className="flex items-center gap-2 mt-2 px-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-xs text-slate-500 truncate">{file.name}</p>
                <p className="text-xs text-slate-400 ml-auto">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
          </div>

          {/* Izoh textarea */}
          <div>
            <label className="text-sm font-semibold text-slate-600 mb-2 block">
              Izoh <span className="text-slate-400 font-normal">(ixtiyoriy)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Esse haqida qo'shimcha izoh yozing..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl
                text-sm text-slate-700 placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-[#8144FE]/30 focus:border-[#8144FE]
                transition-all resize-none"
              id="essay-description"
            />
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !file}
            className={`
              w-full py-3.5 rounded-2xl font-semibold text-white text-sm
              flex items-center justify-center gap-2.5
              transition-all duration-300 shadow-lg
              ${loading
                ? 'bg-[#8144FE]/60 cursor-wait shadow-[#8144FE]/10'
                : !file
                  ? 'bg-slate-300 cursor-not-allowed shadow-none'
                  : 'bg-linear-to-r from-[#8144FE] to-[#9B6AFF] hover:shadow-xl hover:shadow-[#8144FE]/25 hover:scale-[1.02] active:scale-95 cursor-pointer'
              }
            `}
            id="essay-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Yuklanmoqda...</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span>Yuborish</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

export default SubmitEssayModal
