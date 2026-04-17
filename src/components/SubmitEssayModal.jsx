'use client'

import React, { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { X, Upload, FileImage, Loader2, CheckCircle2, AlertCircle, Plus } from 'lucide-react'

/**
 * Rasm yuklash va esse topshirishi uchun sahifa ko'rinishidagi modal
 */

async function uploadImage(file) {
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
  const uniqueName = `${Date.now()}_${cleanFileName}`
  const bucketName = 'photos'
  const filePath = `essays/${uniqueName}`

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    })

  if (error) {
    console.error("Storage upload error details:", error);
    throw new Error(`Rasm yuklashda xatolik: ${error.message || 'Noma\'lum xato'}`);
  }

  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath)

  return urlData.publicUrl
}

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

const SubmitEssayModal = ({ isOpen, onClose, task }) => {
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  if (!isOpen || !task) return null

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (selectedFiles.length > 0) {
      if (files.length + selectedFiles.length > 3) {
        alert('⚠️ Maksimal 3 ta rasm yuklash mumkin!')
        return
      }
      
      const newFiles = [...files, ...selectedFiles]
      setFiles(newFiles)
      
      selectedFiles.forEach(file => {
        const reader = new FileReader()
        reader.onload = (ev) => {
          setPreviews(prev => [...prev, ev.target.result])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
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
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
      if (droppedFiles.length > 0) {
        if (files.length + droppedFiles.length > 3) {
          alert('⚠️ Maksimal 3 ta rasm yuklash mumkin!')
          return
        }
        
        const newFiles = [...files, ...droppedFiles]
        setFiles(newFiles)
        
        droppedFiles.forEach(file => {
          const reader = new FileReader()
          reader.onload = (ev) => {
            setPreviews(prev => [...prev, ev.target.result])
          }
          reader.readAsDataURL(file)
        })
      }
    }
  }

  const resetForm = () => {
    setFiles([])
    setPreviews([])
    setDescription('')
    setSuccess(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert('⚠️ Iltimos, kamida bitta rasm yuklang!')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('⚠️ Iltimos, avval tizimga kiring!')
        setLoading(false)
        return
      }

      const uploadPromises = files.map(file => uploadImage(file))
      const imageUrls = await Promise.all(uploadPromises)

      await insertSubmission({
        task_id: task.id,
        user_id: user.id,
        user_email: user.email,
        answer_image: imageUrls,
        user_description: description || '',
      })

      setSuccess(true)
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (err) {
      console.error('Xatolik:', err)
      alert(`❌ Xatolik yuz berdi: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed h-screen inset-0 z-50 overflow-y-auto bg-slate-50/50 backdrop-blur-md"
      style={{ animation: 'modalFadeIn 0.3s ease-out' }}
    >
      <div className="min-h-screen flex items-start justify-center">
        {/* Overlay clicking to close */}
        <div className="fixed inset-0 bg-black/5 z-0" onClick={handleClose} />

        {/* Page Content Container */}
        <div
          className="relative w-full max-w-2xl bg-white min-h-screen shadow-2xl overflow-hidden z-10 flex flex-col"
          style={{ animation: 'modalSlideUp 0.4s ease-out' }}
        >
          {/* Success overlay */}
          {success && (
            <div className="absolute inset-0 z-30 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 px-6"
              style={{ animation: 'modalFadeIn 0.3s ease-out' }}
            >
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="text-green-500" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 text-center">Muvaffaqiyatli!</h3>
              <p className="text-slate-500 text-center text-sm">
                Sizning esseniz muvaffaqiyatli yuborildi. <br />
                {`Tekshirilgandan so'ng natija bildiriladi.`}
              </p>
            </div>
          )}

          {/* Header gradient */}
          <div className="relative bg-linear-to-r from-[#8144FE] via-[#9B6AFF] to-[#B794FF] px-6 py-5 shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center justify-between relative z-10">
              <h2 className="text-white text-xl font-bold">Esse topshirish</h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Main Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Vazifa matni */}
            {task.content && (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mavzu</p>
                <p className="text-lg font-bold text-slate-800 mb-2">{task.title}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{task.content}</p>
              </div>
            )}

            {/* Fayl yuklash zona */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                Esse rasmlari <span className="text-red-400 font-bold">*</span>
                <span className="text-xs font-normal text-slate-400 mt-0.5">(2-3 ta rasm tavsiya etiladi)</span>
              </label>
              
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative border-2 border-dashed rounded-3xl cursor-pointer
                  transition-all duration-300 overflow-hidden
                  ${dragActive
                    ? 'border-[#8144FE] bg-[#8144FE]/5 scale-[1.01]'
                    : previews.length > 0
                      ? 'border-green-300 bg-green-50/20'
                      : 'border-slate-200 bg-slate-50 hover:border-[#8144FE]/50 hover:bg-[#8144FE]/5'
                  }
                `}
              >
                {previews.length > 0 ? (
                  <div className="p-4 grid grid-cols-2 gap-4">
                    {previews.map((src, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-white">
                        <img
                          src={src}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    {previews.length < 3 && (
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl hover:border-[#8144FE]/50 hover:bg-[#8144FE]/5 transition-all aspect-square bg-slate-50/50">
                         <Plus size={24} className="text-slate-400" />
                         <span className="text-xs text-slate-400 font-bold mt-2">Yana qo&apos;shish</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#8144FE]/10 flex items-center justify-center mb-4">
                      <FileImage className="text-[#8144FE]" size={32} />
                    </div>
                    <p className="text-slate-600 font-bold text-center">
                      Rasmlarni bu yerga tashlang yoki <span className="text-[#8144FE]">tanlang</span>
                    </p>
                    <p className="text-slate-400 text-xs mt-2 font-medium">PNG, JPG, WEBP formatlari qo&apos;llab-quvvatlanadi</p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Izoh textarea */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-600">
                Izoh <span className="text-slate-400 font-normal">(ixtiyoriy)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Esseniz haqida qisqacha izoh yozing (masalan, qaysi betdan boshlanishi)..."
                rows={5}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl
                  text-sm text-slate-700 placeholder:text-slate-400
                  focus:outline-none focus:ring-4 focus:ring-[#8144FE]/10 focus:border-[#8144FE]
                  transition-all resize-none shadow-xs"
              />
            </div>

            {/* Submit button wrapper */}
            <div className="pt-4 pb-12">
              <button
                onClick={handleSubmit}
                disabled={loading || files.length === 0}
                className={`
                  w-full py-4.5 rounded-2xl font-bold text-white text-md
                  flex items-center justify-center gap-3
                  transition-all duration-300 shadow-xl
                  ${loading
                    ? 'bg-[#8144FE]/60 cursor-wait'
                    : files.length === 0
                      ? 'bg-slate-300 cursor-not-allowed shadow-none'
                      : 'bg-linear-to-r from-[#8144FE] to-[#9B6AFF] hover:shadow-2xl hover:shadow-[#8144FE]/30 hover:scale-[1.02] active:scale-95 cursor-pointer'
                  }
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>Yuborilmoqda...</span>
                  </>
                ) : (
                  <>
                    <Upload size={24} />
                    <span>EssenI topshirish</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

export default SubmitEssayModal
