"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();

  const handleTypeSelect = (type: "student" | "instructor") => {
    onClose();
    router.push(`/login?role=${type}`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-blue-950 rounded-2xl overflow-hidden shadow-2xl p-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Type Selection Screen */}
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {t("auth.selectType")}
              </h2>
              <p className="text-white/70">
                {t("auth.selectTypeDescription")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Student Option */}
              <motion.button
                onClick={() => handleTypeSelect("student")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-6 rounded-xl bg-white/10 border-2 border-white/20 hover:border-blue-400 transition-all backdrop-blur-sm"
              >
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {t("auth.student")}
                </h3>
                <p className="text-white/70 text-sm">
                  {t("auth.studentDescription")}
                </p>
              </motion.button>

              {/* Instructor Option */}
              <motion.button
                onClick={() => handleTypeSelect("instructor")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-6 rounded-xl bg-white/10 border-2 border-white/20 hover:border-blue-400 transition-all backdrop-blur-sm"
              >
                <div className="text-4xl mb-4">👨‍🏫</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {t("auth.instructor")}
                </h3>
                <p className="text-white/70 text-sm">
                  {t("auth.instructorDescription")}
                </p>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
