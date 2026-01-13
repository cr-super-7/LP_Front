"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Megaphone, Plus, CheckCircle, Clock, Edit, Trash2, Eye, Filter, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getMyAdvertisements, deleteAdvertisement } from "../../store/api/advertisementApi";
import type { Advertisement } from "../../store/interface/advertisementInterface";
import ConfirmDeleteModal from "../myCoursesTeacher/lessons/ConfirmDeleteModal";
import toast from "react-hot-toast";
import { useMemo } from "react";

export default function MyAdvertisementsContent() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { advertisements, isLoading } = useAppSelector((state) => state.advertisement);
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending">("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [advertisementToDelete, setAdvertisementToDelete] = useState<string | null>(null);

  // Load advertisements on mount
  useEffect(() => {
    const loadAdvertisements = async () => {
      try {
        await getMyAdvertisements(dispatch);
      } catch (error) {
        console.error("Failed to load advertisements:", error);
      }
    };
    loadAdvertisements();
  }, [dispatch]);

  const handleCreateNew = () => {
    router.push("/advertisements/create");
  };

  // Filter advertisements based on selected filter
  const filteredAdvertisements = useMemo(() => {
    if (filterStatus === "all") {
      return advertisements;
    } else if (filterStatus === "approved") {
      return advertisements.filter((ad) => ad.isApproved === true);
    } else if (filterStatus === "pending") {
      return advertisements.filter((ad) => ad.isApproved === false);
    }
    return advertisements;
  }, [advertisements, filterStatus]);

  // Handle delete advertisement confirmation
  const handleDeleteClick = (advertisementId: string) => {
    setAdvertisementToDelete(advertisementId);
    setIsDeleteModalOpen(true);
  };

  // Handle delete advertisement
  const handleDeleteConfirm = async () => {
    if (!advertisementToDelete) return;

    try {
      await deleteAdvertisement(advertisementToDelete, dispatch);
      await getMyAdvertisements(dispatch); // Reload advertisements after deletion
      toast.success(
        language === "ar" ? "تم حذف الإعلان بنجاح" : "Advertisement deleted successfully"
      );
      setIsDeleteModalOpen(false);
      setAdvertisementToDelete(null);
    } catch (error) {
      console.error("Failed to delete advertisement:", error);
    }
  };

  const getAdvertisementTypeLabel = (type: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      privateLessons: { ar: "الدروس الخصوصية", en: "Private Lessons" },
      courses: { ar: "الكورسات", en: "Courses" },
      researches: { ar: "الأبحاث", en: "Researches" },
      all: { ar: "الكل", en: "All" },
    };
    return labels[type] || { ar: type, en: type };
  };

  return (
    <div className="space-y-8 p-6">
      {/* Top Banner - Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-800/30">
        {/* Background Image with Blur */}
        <div className="absolute inset-0">
          <Image
            src="/myCourse.jpg"
            alt="Background"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

        {/* Dark Blue Overlay */}
        <div
          className={`absolute inset-0 ${
            theme === "dark" ? "bg-gray-700/80" : "bg-gray-300/80"
          }`}
        ></div>

        {/* Content */}
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Megaphone className="h-6 w-6 text-yellow-400" strokeWidth={2.5} fill="currentColor" />
                <h1
                  className={`text-3xl md:text-4xl font-bold ${
                    theme === "dark" ? "text-white" : "text-blue-950"
                  }`}
                >
                  {language === "ar"
                    ? "إعلاناتي"
                    : "My Advertisements"}
                </h1>
              </div>
              <p
                className={`text-lg max-w-2xl ${
                  theme === "dark" ? "text-white/90" : "text-blue-950/90"
                }`}
              >
                {language === "ar"
                  ? "إدارة إعلاناتك وعرض حالة الموافقة عليها."
                  : "Manage your advertisements and view their approval status."}
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap shadow-lg flex items-center gap-2 ${
                theme === "dark"
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              <Plus className="h-5 w-5" />
              {language === "ar" ? "إنشاء إعلان جديد" : "Create New Advertisement"}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter
              className={`h-5 w-5 ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                theme === "dark" ? "text-blue-200" : "text-gray-700"
              }`}
            >
              {language === "ar" ? "فلترة حسب الحالة" : "Filter by Status"}
            </span>
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as "all" | "approved" | "pending")
              }
              className={`appearance-none px-4 py-2 pr-10 rounded-lg border transition-colors ${
                theme === "dark"
                  ? "bg-blue-800/30 border-blue-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
            >
              <option value="all">
                {language === "ar" ? "جميع الإعلانات" : "All Advertisements"}
              </option>
              <option value="approved">
                {language === "ar" ? "مقبولة" : "Approved"}
              </option>
              <option value="pending">
                {language === "ar" ? "قيد المراجعة" : "Pending"}
              </option>
            </select>
            <ChevronDown
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none ${
                theme === "dark" ? "text-blue-300" : "text-gray-500"
              }`}
            />
          </div>
        </div>
        <div
          className={`text-sm ${
            theme === "dark" ? "text-blue-200" : "text-gray-600"
          }`}
        >
          {filteredAdvertisements.length}{" "}
          {language === "ar" ? "إعلان" : "advertisement"}
          {filteredAdvertisements.length !== 1 ? (language === "ar" ? "ات" : "s") : ""}
        </div>
      </div>

      {/* Advertisements Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${
              theme === "dark" ? "bg-blue-800/50" : "bg-blue-100"
            }`}
          >
            <Megaphone
              className={`h-6 w-6 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`}
            />
          </div>
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-blue-950"
            }`}
          >
            {language === "ar" ? "إعلاناتي" : "My Advertisements"}
          </h2>
        </div>

        {/* Advertisements Grid */}
        {isLoading ? (
          <div
            className={`text-center py-8 ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </div>
        ) : filteredAdvertisements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdvertisements.map((advertisement) => (
              <AdvertisementCard
                key={advertisement._id}
                advertisement={advertisement}
                theme={theme}
                language={language}
                getAdvertisementTypeLabel={getAdvertisementTypeLabel}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div
            className={`text-center py-12 ${
              theme === "dark" ? "text-blue-200" : "text-gray-600"
            }`}
          >
            <p className="text-lg">
              {language === "ar"
                ? "لا توجد إعلانات بعد. ابدأ بإنشاء إعلان جديد!"
                : "No advertisements yet. Start by creating a new advertisement!"}
            </p>
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAdvertisementToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={language === "ar" ? "تأكيد حذف الإعلان" : "Confirm Delete Advertisement"}
        message={
          language === "ar"
            ? "هل أنت متأكد من حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء."
            : "Are you sure you want to delete this advertisement? This action cannot be undone."
        }
      />
    </div>
  );
}

interface AdvertisementCardProps {
  advertisement: Advertisement;
  theme: string;
  language: string;
  getAdvertisementTypeLabel: (type: string) => { ar: string; en: string };
  onDelete: (id: string) => void;
}

function AdvertisementCard({
  advertisement,
  theme,
  language,
  getAdvertisementTypeLabel,
  onDelete,
}: AdvertisementCardProps) {
  const description = language === "ar" ? advertisement.description.ar : advertisement.description.en;
  const typeLabel = getAdvertisementTypeLabel(advertisement.advertisementType);
  const typeText = language === "ar" ? typeLabel.ar : typeLabel.en;

  const statusLabel = advertisement.isApproved
    ? language === "ar"
      ? "مقبول"
      : "Approved"
    : language === "ar"
    ? "قيد المراجعة"
    : "Under Review";

  const statusColorClass = advertisement.isApproved
    ? "bg-green-500/80 text-white"
    : "bg-yellow-500/80 text-white";

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
        theme === "dark"
          ? "bg-blue-900/50 backdrop-blur-sm border border-blue-800/50"
          : "bg-white border border-gray-200"
      }`}
    >
      {/* Advertisement Image */}
      <div className="relative w-full h-48">
        <Image
          src={advertisement.image}
          alt={description}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold ${statusColorClass}`}>
          {statusLabel}
        </div>
        {/* Type Badge */}
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-semibold ${
            theme === "dark" ? "bg-blue-800/80 text-white" : "bg-blue-100 text-blue-700"
          }`}
        >
          {typeText}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Description */}
        <p
          className={`text-sm mb-4 line-clamp-3 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {description}
        </p>

        {/* Created Date */}
        <div className="flex items-center gap-2 mb-4">
          <Clock className={`h-4 w-4 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
          <span className={`text-xs ${theme === "dark" ? "text-blue-200" : "text-gray-600"}`}>
            {new Date(advertisement.createdAt).toLocaleDateString(
              language === "ar" ? "ar-SA" : "en-US"
            )}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-blue-800/30">
          <button
            onClick={() => onDelete(advertisement._id)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              theme === "dark"
                ? "bg-red-600/80 hover:bg-red-700 text-white"
                : "bg-red-50 hover:bg-red-100 text-red-600"
            }`}
          >
            <Trash2 className="h-4 w-4 inline mr-1" />
            {language === "ar" ? "حذف" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
