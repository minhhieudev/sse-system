"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Trash2 } from "lucide-react";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.",
  confirmText = "Xóa",
  cancelText = "Hủy",
  itemName = "",
  variant = "danger", // danger, warning, info
}) {
  const [isConfirming, setIsConfirming] = useState(false);
  const modalRef = useRef(null);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleConfirm = async () => {
    setIsConfirming(true);

    // Simulate processing time
    setTimeout(() => {
      onConfirm();
      setIsConfirming(false);
      onClose();
    }, 500);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <Trash2 className="h-6 w-6" />,
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          buttonBg: "bg-red-600 hover:bg-red-700",
          buttonFocus: "focus:ring-red-500",
          borderColor: "border-red-200",
          bgGradient: "from-red-50 to-pink-50",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="h-6 w-6" />,
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
          buttonBg: "bg-yellow-600 hover:bg-yellow-700",
          buttonFocus: "focus:ring-yellow-500",
          borderColor: "border-yellow-200",
          bgGradient: "from-yellow-50 to-orange-50",
        };
      case "info":
        return {
          icon: <AlertTriangle className="h-6 w-6" />,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          buttonBg: "bg-blue-600 hover:bg-blue-700",
          buttonFocus: "focus:ring-blue-500",
          borderColor: "border-blue-200",
          bgGradient: "from-blue-50 to-indigo-50",
        };
      default:
        return {
          icon: <AlertTriangle className="h-6 w-6" />,
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          buttonBg: "bg-red-600 hover:bg-red-700",
          buttonFocus: "focus:ring-red-500",
          borderColor: "border-red-200",
          bgGradient: "from-red-50 to-pink-50",
        };
    }
  };

  const styles = getVariantStyles();

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          style={{ zIndex: 2147483647 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          {/* Backdrop */}
          <motion.div
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative w-full max-w-md overflow-hidden bg-white rounded-xl shadow-xl border border-slate-200"
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            style={{ zIndex: 2147483648 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              duration: 0.2,
            }}
          >
            {/* Compact Notice Design */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${styles.iconBg}`}
                >
                  <div className={styles.iconColor}>{styles.icon}</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-900">
                    {title}
                  </h3>
                  {itemName && (
                    <p className="text-sm text-slate-600 mt-0.5">{itemName}</p>
                  )}
                </div>
                <button
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-sm text-slate-600 mb-4 ml-13">{message}</p>

              {/* Inline Buttons */}
              <div className="flex items-center justify-end gap-2">
                <button
                  className="px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg focus:outline-none disabled:opacity-50 transition-colors"
                  disabled={isConfirming}
                  onClick={onClose}
                >
                  {cancelText}
                </button>
                <button
                  className={`px-4 py-1.5 text-sm font-semibold text-white ${styles.buttonBg} rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5`}
                  disabled={isConfirming}
                  onClick={handleConfirm}
                >
                  {isConfirming ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{confirmText}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
