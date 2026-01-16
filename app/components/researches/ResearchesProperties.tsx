"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch } from "../../store/hooks";
import { getAdvertisements } from "../../store/api/advertisementApi";
import type { Advertisement } from "../../store/interface/advertisementInterface";

export default function ResearchesProperties() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isRTL = language === "ar";

  useEffect(() => {
    const loadAdvertisements = async () => {
      try {
        setIsLoading(true);
        // Get both researches and all type advertisements
        const [researchesAds, allAds] = await Promise.all([
          getAdvertisements("researches", dispatch),
          getAdvertisements("all", dispatch),
        ]);
        // Combine and remove duplicates
        const combinedAds = [...researchesAds, ...allAds];
        const uniqueAds = combinedAds.filter(
          (ad, index, self) => index === self.findIndex((a) => a._id === ad._id)
        );
        setAds(uniqueAds);
      } catch (error) {
        console.error("Failed to load research advertisements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdvertisements();
  }, [dispatch]);

  // Auto-slide effect - move one ad at a time, loop من آخر إعلان إلى الأول
  useEffect(() => {
    if (ads.length <= 3) return; // Don't auto-slide if 3 or fewer ads
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        // Move one ad at a time, stop when we can't show 3 more ads
        const maxIndex = Math.max(0, ads.length - 3);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    },
  };

  const getDescription = (ad: Advertisement) =>
    language === "ar" ? ad.description.ar : ad.description.en;

  // ترتيب الإعلانات حسب اتجاه اللغة (للـ RTL نعرضها بالعكس)
  const displayedAds = isRTL ? [...ads].reverse() : ads;
  const slidePercent = 100 / 3;
  const direction = isRTL ? 1 : -1; // RTL يتحرك لليمين، LTR لليسار

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2
          className={`text-xl md:text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-blue-950"
          }`}
        >
          {language === "ar" ? "إعلانات الأبحاث" : "Research Advertisements"}
        </h2>
      </div>

      {isLoading && ads.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.span
              className={`inline-flex h-3 w-3 rounded-full ${
                theme === "dark" ? "bg-blue-400" : "bg-blue-500"
              }`}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            />
            <p
              className={`text-sm ${
                theme === "dark" ? "text-blue-200" : "text-gray-600"
              }`}
            >
              {language === "ar"
                ? "جاري تحميل الإعلانات..."
                : "Loading advertisements..."}
            </p>
          </motion.div>
        </div>
      ) : ads.length === 0 ? (
        <motion.div
          className="flex items-center justify-center h-40"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className={`relative rounded-2xl px-6 py-4 md:px-8 md:py-5 shadow-lg flex items-center gap-4 ${
              theme === "dark"
                ? "bg-blue-900/60 border border-blue-700/60"
                : "bg-white border border-blue-100"
            }`}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                theme === "dark" ? "bg-blue-800" : "bg-blue-100"
              }`}
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <span className="text-xl">📢</span>
            </motion.div>
            <div>
              <p
                className={`text-sm md:text-base font-semibold ${
                  theme === "dark" ? "text-white" : "text-blue-950"
                }`}
              >
                {language === "ar"
                  ? "لا توجد إعلانات أبحاث حالياً"
                  : "No research advertisements right now"}
              </p>
              <p
                className={`text-xs md:text-sm mt-1 ${
                  theme === "dark" ? "text-blue-200" : "text-gray-600"
                }`}
              >
                {language === "ar"
                  ? "تابعنا، سيتم إضافة إعلانات جديدة للأبحاث قريباً."
                  : "Stay tuned, new research promotions will be added soon."}
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="relative max-w-7xl mx-auto overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div
            className={`flex gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
            animate={{ x: `${currentIndex * slidePercent * direction}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {displayedAds.map((ad) => (
              <div
                key={ad._id}
                className="shrink-0 w-full md:w-[calc(33.333%-0.67rem)] lg:w-[calc(33.333%-0.67rem)]"
              >
                <div className="relative h-44 md:h-52 lg:h-60 rounded-2xl overflow-hidden group shadow-lg shadow-black/10">
                  <Image
                    src={ad.image}
                    alt={getDescription(ad)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <p className="text-sm md:text-base text-white p-4 line-clamp-4">
                      {getDescription(ad)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Dots indicators */}
          {ads.length > 3 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: Math.max(1, ads.length - 2) }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "w-6 bg-blue-500"
                      : "w-2.5 bg-blue-500/40"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}
