/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
"use client";

import { createPortal } from "react-dom";

export default function OverlayModal({
  isOpen,
  onClose,
  children,
  widthClass = "w-full max-w-2xl",
  contentClassName = "",
}) {
  if (!isOpen) return null;

  return createPortal(
    <div
      aria-labelledby="modal-title"
      aria-modal="true"
      className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4"
      role="dialog"
      style={{ zIndex: 2147483647 }}
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose?.();
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{ backdropFilter: "blur(4px)" }}
      />

      {/* Modal */}
      <div
        className={`relative w-full ${widthClass} max-h-[90vh] rounded-2xl shadow-2xl transform transition-all duration-300 ease-out bg-white ${contentClassName}`}
        style={{
          zIndex: 2147483648,
          animation: "modalSlideIn 0.3s ease-out",
        }}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

// Add CSS animation styles
const styles = `
  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");

  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
