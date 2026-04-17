'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  CheckCheck, List, Clock, Send, Loader2, FileText,
  Plus, Eye, Star, MessageSquare, User, ImageOff, X, Edit2, Trash2
} from 'lucide-react'
import SubmitEssayModal from './SubmitEssayModal'
import AddTaskModal from './AddTaskModal'
import AdminReviewModal from './AdminReviewModal'
import ConfirmModal from './ConfirmModal'

const TaskPage = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [tasks, setTasks] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [allSubmissions, setAllSubmissions] = useState([]) // admin uchun
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  // Modallar
  const [selectedTask, setSelectedTask] = useState(null)
  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewData, setViewData] = useState(null)
  const [editingTask, setEditingTask] = useState(null) // tahrirlash uchun
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)

  // ── Ma'lumotlarni yuklash ─────────────────────────────────────
  const fetchData = async () => {
    setLoading(true)
    try {
      // Tasks
      const { data: tasksData, error: tasksErr } = await supabase
        .from('tasks')
        .select('*')
        .order('id', { ascending: false })
      if (tasksErr) throw tasksErr
      setTasks(tasksData || [])

      // Foydalanuvchi
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserEmail(user.email)

      // Rol tekshirish
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, first_name, last_name')
        .eq('id', user.id)
        .single()

      const adminFlag = profile?.role === 'admin'
      setIsAdmin(adminFlag)

      if (adminFlag) {
        // Admin: barcha submissionlarni oladi (profiles bilan qo'lda birlashtiramiz)
        const { data: allSubs } = await supabase
          .from('submissions')
          .select('*')
          .order('id', { ascending: false })

        const { data: allProfiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')

        if (allSubs && allProfiles) {
          const profilesMap = allProfiles.reduce((acc, curr) => {
            acc[curr.id] = curr
            return acc
          }, {})
          allSubs.forEach(sub => {
            sub.profiles = profilesMap[sub.user_id] || {}
          })
        }

        setAllSubmissions(allSubs || [])
      } else {
        // Student: faqat o'zinikini
        const { data: mySubs } = await supabase
          .from('submissions')
          .select('*')
          .eq('user_email', user.email)
        setSubmissions(mySubs || [])
      }
    } catch (err) {
      console.error('Xatolik:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  // ── Helpers ─────────────────────────────────────────────────
  const getMySubmission = (taskId) =>
    submissions.find((s) => s.task_id === taskId)

  const getSubmissionsForTask = (taskId) =>
    allSubmissions.filter((s) => s.task_id === taskId)

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved': return {
        label: 'Baholandi', bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200',
        icon: <CheckCheck size={13} />,
      }
      case 'rejected': return {
        label: 'Rad etildi', bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-200',
        icon: <CheckCheck size={13} />,
      }
      default: return {
        label: 'Tekshirilmoqda', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200',
        icon: <Clock size={13} />,
      }
    }
  }

  // Student uchun filtrlangan ro'yxat
  const filteredTasks = tasks.filter((task) => {
    if (activeTab === 'all') return true
    const sub = getMySubmission(task.id)
    return sub && sub.status === 'approved'
  })

  // Modal handlers
  const handleOpenSubmit = (task) => { setSelectedTask(task); setSubmitModalOpen(true) }
  const handleCloseSubmit = () => {
    setSubmitModalOpen(false); setSelectedTask(null)
    fetchData()
  }
  const handleOpenReview = (sub, task) => { setSelectedSubmission(sub); setSelectedTask(task); setReviewModalOpen(true) }
  const handleCloseReview = () => {
    setReviewModalOpen(false); setSelectedSubmission(null)
    fetchData()
  }
  const handleOpenView = (task, submission) => { setViewData({ task, submission }); setViewModalOpen(true) }

  // Admin amallari
  const handleEditTask = (task) => {
    setEditingTask(task)
    setAddTaskModalOpen(true)
  }

  const handleDeleteTask = (taskId) => {
    setTaskToDelete(taskId)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!taskToDelete) return
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskToDelete)
      if (error) throw error
      fetchData()
      setDeleteModalOpen(false)
      setTaskToDelete(null)
    } catch (err) {
      alert(`❌ O'chirishda xatolik: ${err.message}`)
    }
  }

  return (
    <>
      <div className="space-y-6">

        {/* ── Tab + Admin tugma ────────────────────── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex bg-white shadow-sm shadow-slate-200/60 rounded-xl w-max p-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold
                transition-all duration-300 cursor-pointer
                ${activeTab === 'all'
                  ? 'bg-linear-to-r from-[#8144FE] to-[#9B6AFF] text-white shadow-lg shadow-[#8144FE]/25'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              <List size={18} /><span>Barchasi</span>
            </button>
            <button
              onClick={() => setActiveTab('checked')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold
                transition-all duration-300 cursor-pointer
                ${activeTab === 'checked'
                  ? 'bg-linear-to-r from-[#8144FE] to-[#9B6AFF] text-white shadow-lg shadow-[#8144FE]/25'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              <CheckCheck size={18} /><span>Tekshirilgan</span>
            </button>
          </div>

          {/* Admin: Esse qo'shish tugmasi */}
          {isAdmin && (
            <button
              onClick={() => setAddTaskModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                bg-linear-to-r from-[#8144FE] to-[#9B6AFF]
                text-white text-sm font-semibold shadow-lg shadow-[#8144FE]/20
                hover:shadow-xl hover:shadow-[#8144FE]/30 hover:scale-105
                active:scale-95 transition-all duration-300 cursor-pointer"
              id="admin-add-task-btn"
            >
              <Plus size={18} />
              <span>Esse qo&apos;shish</span>
            </button>
          )}
        </div>

        {/* ── Loading ──────────────────────────────── */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-[#8144FE]/20 border-t-[#8144FE] animate-spin" />
              <p className="text-slate-400 text-sm font-medium">Yuklanmoqda...</p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            {/* ═══════════════════════════════════════
                ADMIN ko'rinishi — barcha submissionlar
                ═══════════════════════════════════════ */}
            {isAdmin ? (
              <div className="space-y-6">
                {tasks.filter(task => {
                  if (activeTab === 'all') return true;
                  return getSubmissionsForTask(task.id).some(s => s.status === 'approved');
                }).map((task, ti) => {
                  let subs = getSubmissionsForTask(task.id)
                  if (activeTab === 'checked') subs = subs.filter(s => s.status === 'approved')

                  return (
                    <div key={task.id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/60 overflow-hidden"
                      style={{ animation: `taskFadeIn 0.4s ease-out ${ti * 0.07}s both` }}
                    >
                      {/* Task header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 sm:py-5 border-b border-slate-50 gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#8144FE]/10 to-[#B794FF]/10
                            flex items-center justify-center border border-[#8144FE]/10 shrink-0">
                            <FileText className="text-[#8144FE]" size={22} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-black text-slate-800 text-[15px] sm:text-lg leading-tight mb-1">{task.title}</h3>
                            {task.content && <p className="text-slate-400 text-xs line-clamp-1 italic">{task.content}</p>}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-50">
                          {/* Admin Edit/Delete */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEditTask(task); }}
                              className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-[#8144FE] hover:bg-[#8144FE]/10 rounded-xl transition-all cursor-pointer border border-slate-200/50"
                              title="Tahrirlash"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                              className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer border border-slate-200/50"
                              title="O&apos;chirish"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl text-amber-600 text-xs font-black flex items-center gap-1.5 shadow-sm shadow-amber-200/20">
                              💎 {task.diamonds}
                            </div>
                            <div className="px-3 py-1.5 bg-slate-100 rounded-xl text-slate-500 text-xs font-bold border border-slate-200/50">
                              {subs.length} javob
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Submissions */}
                      {subs.length === 0 ? (
                        <div className="flex items-center justify-center gap-2 py-6 text-slate-400 text-sm">
                          <ImageOff size={16} />
                          <span>Hali javob yo&apos;q</span>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-50">
                          {subs.map((sub) => {
                            const sc = getStatusConfig(sub.status)
                            const fullName = [sub.profiles?.first_name, sub.profiles?.last_name].filter(Boolean).join(' ')
                            return (
                              <div key={sub.id}
                                className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 py-4 sm:px-6 sm:py-4 hover:bg-slate-50/50 transition-colors">

                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                  {/* Avatar */}
                                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#8144FE]/20 to-[#B794FF]/20
                                    flex items-center justify-center shrink-0 border border-[#8144FE]/10 shadow-sm">
                                    <User size={18} className="text-[#8144FE]" />
                                  </div>

                                  {/* Ism va email */}
                                  <div className="min-w-0">
                                    <p className="text-[14px] font-black text-slate-800 truncate leading-none mb-1">
                                      {fullName || sub.user_email}
                                    </p>
                                    <div className="flex items-center gap-2">
                                      {fullName && (
                                        <p className="text-[11px] text-slate-400 truncate max-w-[120px] sm:max-w-none">{sub.user_email}</p>
                                      )}
                                      {sub.user_description && (
                                        <>
                                          <div className="w-1 h-1 rounded-full bg-slate-200 hidden sm:block" />
                                          <p className="text-[11px] text-slate-500 italic truncate hidden sm:block">
                                            &quot;{sub.user_description}&quot;
                                          </p>
                                        </>
                                      )}
                                    </div>
                                    {sub.user_description && (
                                      <p className="text-[11px] text-slate-500 italic mt-1 line-clamp-1 sm:hidden">
                                        &quot;{sub.user_description}&quot;
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                                  {/* Ball (agar baholangan bo'lsa) */}
                                  {sub.status === 'approved' && sub.score !== null && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-100 rounded-xl text-green-600 text-[11px] font-black shadow-sm shadow-green-200/20">
                                      <Star size={13} strokeWidth={3} />
                                      {sub.score}/24
                                    </div>
                                  )}

                                  {/* Status Icon */}
                                  <div className={`p-2 rounded-xl border flex items-center justify-center shadow-sm ${sc.bg} ${sc.text} ${sc.border}`}>
                                    {sc.icon}
                                  </div>

                                  {/* Baholash tugmasi */}
                                  <button
                                    onClick={() => handleOpenReview(sub, task)}
                                    className="flex items-center justify-center gap-2 px-6 py-2.5 sm:px-4 sm:py-2 rounded-xl
                                      bg-linear-to-r from-[#8144FE] to-[#9B6AFF]
                                      text-white text-xs font-black shadow-md shadow-[#8144FE]/20
                                      hover:shadow-lg hover:translate-y-[-1px] active:translate-y-[1px]
                                      transition-all duration-200 cursor-pointer flex-1 sm:flex-none"
                                  >
                                    <Eye size={14} />
                                    <span>Ko&apos;rish</span>
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}

                {tasks.length === 0 && (
                  <EmptyState message="Hali esse vazifalari qo'shilmagan" sub="&quot;Esse qo'shish&quot; tugmasini bosing" />
                )}
              </div>
            ) : (
              /* ═══════════════════════════════════════
                 STUDENT ko'rinishi — o'z tasklari
                 ═══════════════════════════════════════ */
              <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                  <EmptyState
                    message={activeTab === 'checked' ? "Tekshirilgan esselar yo'q" : "Hozircha vazifalar yo'q"}
                    sub={activeTab === 'checked' ? "Esse topshirgach bu yerda ko'rinadi" : "Admin tez orada vazifa qo'shadi"}
                  />
                ) : (
                  filteredTasks.map((task, index) => {
                    const submission = getMySubmission(task.id)
                    const statusConfig = submission ? getStatusConfig(submission.status) : null

                    return (
                      <div
                        key={task.id}
                        onClick={() => handleOpenView(task, submission)}
                        className="group bg-white rounded-2xl shadow-sm shadow-slate-200/60 border border-slate-100/80
                          hover:shadow-lg hover:shadow-slate-200/80 hover:border-slate-200
                          transition-all duration-300 overflow-hidden cursor-pointer"
                        style={{ animation: `taskFadeIn 0.4s ease-out ${index * 0.08}s both` }}
                      >
                        <div className="p-5 sm:p-6">
                          <div className="flex items-start justify-between gap-4">
                            {/* Chap */}
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex items-center gap-3">
                                <div className="min-w-10 h-10 rounded-xl bg-linear-to-br from-[#8144FE]/10 to-[#B794FF]/10
                                  flex items-center justify-center border border-[#8144FE]/10 shrink-0">
                                  <FileText className="text-[#8144FE]" size={20} />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800 truncate">{task.title}</h2>
                              </div>
                              {task.content && (
                                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 pl-[52px]">{task.content}</p>
                              )}

                              {/* Tekshirilgan tab: ball va javob ko'rinadi */}
                              {activeTab === 'checked' && submission?.status === 'approved' && (
                                <div className="pl-[52px] space-y-2 mt-2">
                                  {submission.score !== null && submission.score !== undefined && (
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#8144FE]/10 to-[#B794FF]/10
                                        border border-[#8144FE]/20 rounded-xl">
                                        <Star size={14} className="text-[#8144FE]" />
                                        <span className="text-sm font-bold text-[#8144FE]">{submission.score}</span>
                                        <span className="text-xs text-slate-400">/ 24 ball</span>
                                      </div>

                                      {/* Ball progress */}
                                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                          className="h-full rounded-full bg-gradient-to-r from-[#8144FE] to-[#9B6AFF] transition-all duration-700"
                                          style={{ width: `${(submission.score / 24) * 100}%` }}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {submission.feedback && (
                                    <div className="flex items-start gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                                      <MessageSquare size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                      <p className="text-sm text-slate-600 italic">&quot;{submission.feedback}&quot;</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* O'ng */}
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-yellow-50
                                text-amber-600 rounded-xl border border-amber-100/80">
                                <span className="text-sm">💎</span>
                                <span className="text-sm font-bold">{task.diamonds || 0}</span>
                              </div>

                              {submission ? (
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold
                                  ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                                  {statusConfig.icon}
                                  <span className="hidden sm:inline">{statusConfig.label}</span>
                                </div>
                              ) : (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleOpenSubmit(task) }}
                                  className="flex items-center gap-2 px-4 py-2 rounded-xl
                                    bg-gradient-to-r from-[#8144FE] to-[#9B6AFF]
                                    text-white text-sm font-semibold shadow-md shadow-[#8144FE]/20
                                    hover:shadow-lg hover:shadow-[#8144FE]/30 hover:scale-105
                                    active:scale-95 transition-all duration-300 cursor-pointer"
                                >
                                  <Send size={16} />
                                  <span className="hidden sm:inline">Topshirish</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Pastki gradient chiziq */}
                        <div className={`h-1 w-full transition-all duration-500 ${submission?.status === 'approved'
                          ? 'bg-linear-to-r from-green-400 to-emerald-500'
                          : submission?.status === 'rejected'
                            ? 'bg-linear-to-r from-red-400 to-rose-500'
                            : submission
                              ? 'bg-linear-to-r from-amber-400 to-yellow-500'
                              : 'bg-linear-to-r from-slate-100 to-slate-200 group-hover:from-[#8144FE]/30 group-hover:to-[#9B6AFF]/30'
                          }`} />
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modallar ─────────────────────────────── */}
      <SubmitEssayModal isOpen={submitModalOpen} onClose={handleCloseSubmit} task={selectedTask} />
      <AddTaskModal
        isOpen={addTaskModalOpen}
        onClose={() => {
          setAddTaskModalOpen(false)
          setEditingTask(null)
        }}
        onAdded={fetchData}
        editData={editingTask}
      />
      <AdminReviewModal isOpen={reviewModalOpen} onClose={handleCloseReview} submission={selectedSubmission} task={selectedTask} onReviewed={fetchData} />
      <ViewTaskModal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} data={viewData} />

      {deleteModalOpen && (
        <ConfirmModal
          title="Vazifani o'chirish"
          message="Haqiqatan ham ushbu vazifani o'chirib tashlamoqchimisiz? Buning natijasida barcha topshirilgan javoblar ham o'chib ketadi!"
          confirmText="O'chirish"
          cancelText="Bekor qilish"
          onConfirm={confirmDelete}
          onCancel={() => {
            setDeleteModalOpen(false)
            setTaskToDelete(null)
          }}
          variant="danger"
        />
      )}

      <style>{`
        @keyframes taskFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}

// Bo'sh holat komponenti
const EmptyState = ({ message, sub }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center">
      <FileText className="text-slate-300" size={40} />
    </div>
    <div className="text-center">
      <h3 className="text-lg font-bold text-slate-700">{message}</h3>
      <p className="text-slate-400 text-sm mt-1">{sub}</p>
    </div>
  </div>
)

// O'quvchi uchun batafsil ko'rish modali
const ViewTaskModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;
  const { task, submission } = data;
  return (
    <div className="fixed h-screen inset-0 z-50 overflow-y-auto bg-slate-50/50 backdrop-blur-md" style={{ animation: 'modalFadeIn 0.3s ease-out' }}>
      <div className="min-h-screen flex items-start justify-center">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/5 z-0" onClick={onClose} />

        {/* Page Content */}
        <div className="relative w-full max-w-2xl bg-white min-h-screen shadow-2xl overflow-hidden z-10 p-6 flex flex-col" style={{ animation: 'modalSlideUp 0.4s ease-out' }}>
          <div className="flex justify-between items-center mb-8 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#8144FE]/10 to-[#B794FF]/10 flex items-center justify-center border border-[#8144FE]/10">
                <FileText className="text-[#8144FE]" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Vazifa <span className="text-[#8144FE]">mazmuni</span></h2>
              </div>
            </div>
            <button onClick={onClose} className="p-2.5 text-slate-400 hover:bg-slate-100 bg-slate-50 hover:text-slate-600 rounded-xl transition-all cursor-pointer"><X size={24} /></button>
          </div>

          <div className="flex-1 space-y-8">
            <div className="bg-slate-50 p-6 rounded-[32px] space-y-3 border border-slate-100">
              <h2 className="text-xl font-black text-slate-800 leading-tight">{task.title}</h2>
              <p className="text-md text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">{task.content}</p>
            </div>

            {submission && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest pl-1">Sizning javobingiz</h3>
                <div className="grid grid-cols-2 gap-4">
                  {(() => {
                    const img = submission.answer_image;
                    let images = [];
                    if (Array.isArray(img)) images = img;
                    else if (typeof img === 'string' && img) {
                      if (img.startsWith('{') && img.endsWith('}')) images = img.slice(1, -1).split(',').map(s => s.trim().replace(/^"(.*)"$/, '$1'));
                      else if (img.startsWith('[') && img.endsWith(']')) { try { images = JSON.parse(img) } catch(e) { images = [img] } }
                      else images = [img];
                    }
                    
                    return images.length > 0 ? images.map((src, idx) => (
                      <a key={idx} href={src} target="_blank" rel="noopener noreferrer" className="block w-full aspect-square border-2 border-slate-100 rounded-[24px] overflow-hidden hover:opacity-90 hover:scale-[1.02] transition-all bg-slate-50 p-1">
                        <img src={src} alt={`Sizning rasm ${idx + 1}`} className="w-full h-full object-cover rounded-[20px]" />
                      </a>
                    )) : (
                      <div className="col-span-2 flex flex-col items-center justify-center py-10 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 text-slate-300">
                        <ImageOff size={40} />
                        <p className="text-sm mt-3 font-bold">Rasm yuklanmagan</p>
                      </div>
                    );
                  })()}
                </div>

                {submission.status === 'approved' && submission.score !== null && (
                  <div className="bg-linear-to-r from-emerald-50 to-teal-50 p-6 rounded-[32px] border border-emerald-100 shadow-sm shadow-emerald-500/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                        <Star size={20} fill="currentColor" />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Natija</p>
                         <p className="text-lg font-black text-emerald-900">Baholandi: {submission.score}/24 ball</p>
                      </div>
                    </div>
                    {submission.feedback && (
                      <div className="bg-white/60 p-4 rounded-2xl border border-emerald-100/50">
                        <p className="text-sm text-emerald-800 font-medium italic leading-relaxed">&quot; {submission.feedback} &quot;</p>
                      </div>
                    )}
                  </div>
                )}

                {submission.status === 'pending' && (
                  <div className="bg-amber-50 p-5 rounded-[32px] border border-amber-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 shrink-0">
                       <Clock size={24} className="animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-amber-800 leading-tight">Javobingiz tekshirilmoqda</p>
                      <p className="text-xs font-medium text-amber-600 mt-0.5">Tez orada adminlarimiz tomonidan baholanadi.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-8 pb-10 shrink-0">
            <button onClick={onClose} className="w-full py-2 bg-linear-to-r from-[#8144FE] to-[#9B6AFF] hover:shadow-2xl hover:shadow-[#8144FE]/30 hover:scale-[1.02] active:scale-95 text-white rounded-lg font-black text-lg transition-all cursor-pointer shadow-xl">
              Yopish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskPage