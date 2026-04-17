'use client'

import React from 'react'
import { AlertTriangle } from 'lucide-react'

/**
 * A reusable confirmation dialog.
 * Props:
 *  - title: main heading text
 *  - message: body text (optional)
 *  - confirmText: text for the confirm button  (default: "Ha")
 *  - cancelText:  text for the cancel button   (default: "Yo'q")
 *  - onConfirm: callback fired on confirm
 *  - onCancel:  callback fired on cancel / close
 *  - variant: "danger" | "info"  (default: "danger")
 */
const ConfirmModal = ({
    title,
    message,
    confirmText = "Ha",
    cancelText = "Yo'q",
    onConfirm,
    onCancel,
    variant = "danger",
}) => {
    const isDanger = variant === "danger"

    return (
        <div className="fixed h-screen inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 flex flex-col gap-5 animate-in zoom-in duration-200">
                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center ${isDanger ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                    <AlertTriangle size={28} />
                </div>

                <div className="text-center">
                    <h3 className="text-lg font-black text-gray-900 mb-1">{title}</h3>
                    {message && <p className="text-gray-500 text-sm">{message}</p>}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all cursor-pointer"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-3 rounded-2xl text-white font-bold transition-all cursor-pointer active:scale-[0.98] ${isDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-[#8144FE] hover:bg-[#6c34e0]'}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal
