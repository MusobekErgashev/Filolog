'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Search, Plus, ChevronDown, ChevronUp, BookOpen, Trash2, Pencil, MoreHorizontal } from 'lucide-react'
import AddGrammarModal from '@/components/AddGrammarModal'
import { supabase } from '@/lib/supabase'

const GrammarPage = () => {
    const [rules, setRules] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [openRuleId, setOpenRuleId] = useState(null)
    const [openMenuId, setOpenMenuId] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingRule, setEditingRule] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [userRole, setUserRole] = useState('user')

    useEffect(() => {
        const fetchRole = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()
                if (data?.role) setUserRole(data.role)
            }
        }
        fetchRole()

        const handleClickOutside = () => setOpenMenuId(null)
        window.addEventListener('click', handleClickOutside)
        return () => window.removeEventListener('click', handleClickOutside)
    }, [])

    const fetchRules = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const { data, error } = await supabase
                .from('grammar')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error("Supabase fetch error:", error)
                setError("Ma'lumotlarni yuklashda xatolik yuz berdi: " + error.message)
                return
            }

            if (data) {
                const mappedData = data.map(rule => ({
                    ...rule,
                    id: rule.id
                }))
                setRules(mappedData)
            }
        } catch (error) {
            console.error('Error fetching rules:', error)
            setError('Serverga ulanib bo\'lmadi. Internet aloqasini tekshiring.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchRules()
    }, [fetchRules])

    const handleAddRule = (newRule) => {
        if (editingRule) {
            setRules(rules.map(r => r.id === editingRule.id ? newRule : r))
        } else {
            setRules([...rules, newRule])
        }
        setEditingRule(null)
    }

    const handleDeleteRule = async (e, id) => {
        e.stopPropagation()
        if (!confirm('Haqiqatan ham bu qoidani o\'chirib tashlamoqchimisiz?')) return
        try {
            const { error } = await supabase.from('grammar').delete().eq('id', id)
            if (error) {
                console.error("Supabase delete error:", error)
                alert("O'chirishda xatolik yuz berdi")
            } else {
                setRules(rules.filter(r => r.id !== id))
            }
            setOpenMenuId(null)
        } catch (error) {
            console.error('Error deleting rule:', error)
        }
    }

    const handleEditClick = (e, rule) => {
        e.stopPropagation()
        setEditingRule(rule)
        setIsModalOpen(true)
        setOpenMenuId(null)
    }

    const toggleRule = (id) => {
        setOpenRuleId(openRuleId === id ? null : id)
    }

    const filteredRules = rules.filter(rule =>
        rule.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className='min-h-screen w-full animate-in fade-in duration-500'>
            <div className='w-full space-y-5'>
                {/* Header Section */}
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-3'>
                    <div>
                        <h1 className="text-[26px] sm:text-[30px] lg:text-[34px] font-semibold leading-7 sm:leading-9 lg:leading-11">Ona tili qoidalari</h1>
                        <p className="text-[14px] lg:text-[18px] text-[#8144FE]">Grammatika va fonetika qoidalarini shu yerdan topishingiz mumkin!</p>
                    </div>
                    {userRole === 'admin' && (
                        <button
                            onClick={() => {
                                setEditingRule(null)
                                setIsModalOpen(true)
                            }}
                            className='flex items-center justify-center gap-2 bg-[#8144FE] hover:bg-[#6c34e0] text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95 cursor-pointer'
                        >
                            <Plus size={20} />
                            Yangi qo&apos;shish
                        </button>
                    )}
                </div>

                {/* Search Bar */}
                <div className='relative group'>
                    <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8144FE] transition-colors' size={20} />
                    <input
                        type='text'
                        placeholder='Qoidani nomi bo&apos;yicha izlang...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full bg-white pl-12 pr-4 py-3 rounded-2xl border border-gray-100 shadow-sm outline-none grammar-search-input transition-all text-gray-700 font-medium'
                    />
                </div>

                {/* Rules List */}
                <div className='space-y-4'>
                    {loading ? (
                        <div className='flex flex-col items-center justify-center py-20 space-y-4'>
                            <div className='w-10 h-10 border-4 border-[#8144FE]/20 border-t-[#8144FE] rounded-full animate-spin'></div>
                            <p className='text-gray-400 font-medium'>Qoidalar yuklanmoqda...</p>
                        </div>
                    ) : error ? (
                        <div className='text-center py-20 bg-red-50 rounded-3xl border border-red-100 p-8'>
                            <div className='inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full text-red-500 mb-4'>
                                <Search size={32} />
                            </div>
                            <h3 className='text-red-900 font-bold text-lg mb-2'>Xatolik yuz berdi</h3>
                            <p className='text-red-600 font-medium max-w-md mx-auto'>{error}</p>
                            <button
                                onClick={fetchRules}
                                className='mt-6 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95'
                            >
                                Qayta urinib ko&apos;rish
                            </button>
                        </div>
                    ) : filteredRules.length > 0 ? (
                        filteredRules.map((rule) => (
                            <div
                                key={rule.id}
                                className={`bg-white rounded-2xl border transition-all duration-300 ${openRuleId === rule.id ? 'border-[#8144FE] shadow-xl shadow-indigo-50/50 ring-1 ring-[#8144FE]/10' : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'}`}
                            >
                                <div
                                    onClick={() => toggleRule(rule.id)}
                                    className='px-4 py-3 md:py-4 md:px-5 flex items-center justify-between cursor-pointer group'
                                >
                                    <div className='flex items-center gap-4 min-w-0 flex-1 mr-2'>
                                        <div className={`p-3 rounded-xl transition-colors shrink-0 ${openRuleId === rule.id ? 'bg-[#8144FE] text-white' : 'bg-gray-50 text-gray-400'}`}>
                                            <BookOpen size={20} />
                                        </div>
                                        <h3 className={`text-lg font-bold leading-5 transition-colors wrap-break-word line-clamp-2 sm:line-clamp-1 ${openRuleId === rule.id ? 'text-[#8144FE]' : 'text-gray-800'}`}>
                                            {rule.title}
                                        </h3>
                                    </div>
                                    <div className='flex items-center gap-1 sm:gap-2'>
                                        {userRole === 'admin' && (
                                            /* Actions Menu */
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setOpenMenuId(openMenuId === rule.id ? null : rule.id)
                                                    }}
                                                    className={`p-2 rounded-lg cursor-pointer transition-all ${openMenuId === rule.id ? 'bg-gray-100 text-[#8144FE]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                                                >
                                                    <MoreHorizontal size={20} />
                                                </button>

                                                {openMenuId === rule.id && (
                                                    <div 
                                                        className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            onClick={(e) => handleEditClick(e, rule)}
                                                            className="w-full flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                        >
                                                            <Pencil size={16} /> Tahrirlash
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDeleteRule(e, rule.id)}
                                                            className="w-full flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                                        >
                                                            <Trash2 size={16} /> O&apos;chirish
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className={`transition-transform duration-300 ml-1 ${openRuleId === rule.id ? 'rotate-180 text-[#8144FE]' : 'text-gray-400'}`}>
                                            <ChevronDown size={20} />
                                        </div>
                                    </div>
                                </div>
                                <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${openRuleId === rule.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className='overflow-hidden'>
                                        <div className='pt-2 pb-4 px-6 border-t border-gray-50 bg-gray-50/20'>
                                            <p className='text-gray-600 leading-relaxed whitespace-pre-wrap wrap-break-word w-full max-w-full text-[15px]'>
                                                {rule.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200'>
                            <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full text-gray-300 mb-4'>
                                <Search size={32} />
                            </div>
                            <p className='text-gray-500 font-medium'>Hech qanday qoida topilmadi</p>
                            <button
                                onClick={() => setSearchTerm('')}
                                className='mt-2 text-[#8144FE] font-bold text-sm hover:underline cursor-pointer'
                            >
                                Izlashni tozalash
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <AddGrammarModal
                    setIsModalOpen={setIsModalOpen}
                    onAddRule={handleAddRule}
                    initialData={editingRule}
                />
            )}
        </div>
    )
}

export default GrammarPage