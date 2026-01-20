"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  RotateCcw,
  CheckCircle2,
  Circle,
  Pen,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppDispatch } from "../../store/hooks";
import { getCourseProgress, updateLessonProgress } from "../../store/api/progressApi";
import type { Course } from "../../store/interface/courseInterface";
import type { Lesson } from "../../store/interface/lessonInterface";
import type { CourseProgressLesson } from "../../store/interface/progressInterface";
import LessonReviews from "./course-details/LessonReviews";
import toast from "react-hot-toast";

interface CourseWatchContentProps {
  course: Course;
  lessons: Lesson[];
  selectedLesson: Lesson | null;
  onLessonSelect: (lessonId: string) => void;
}

export default function CourseWatchContent({
  course,
  lessons,
  selectedLesson,
  onLessonSelect,
}: CourseWatchContentProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const dispatch = useAppDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const totalWatchTimeRef = useRef(0);
  const lastUpdateTimeRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Progress state from API
  const [overallProgress, setOverallProgress] = useState(0);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
  const [totalLessonsCount, setTotalLessonsCount] = useState(0);
  const [lessonsProgress, setLessonsProgress] = useState<CourseProgressLesson[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  
  // Animation state
  const animatedProgressRef = useRef(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const courseData = course as any;
  const courseTitle = language === "ar" ? course.title.ar : course.title.en;
  const instructorName =
    courseData.Teacher?.user?.name ||
    courseData.Teacher?.name ||
    (language === "ar" ? "المدرب" : "Instructor");

  // Fetch course progress from API
  const fetchCourseProgress = useCallback(async () => {
    try {
      setIsLoadingProgress(true);
      const progressData = await getCourseProgress(course._id, dispatch);
      
      setOverallProgress(progressData.overallProgress || 0);
      setCompletedLessonsCount(progressData.completedLessons || 0);
      setTotalLessonsCount(progressData.totalLessons || lessons.length);
      setLessonsProgress(progressData.lessons || []);
    } catch (error) {
      console.error("Failed to fetch course progress:", error);
      // Set default values on error
      setOverallProgress(0);
      setCompletedLessonsCount(0);
      setTotalLessonsCount(lessons.length);
    } finally {
      setIsLoadingProgress(false);
    }
  }, [course._id, dispatch, lessons.length]);

  // Load progress on mount
  useEffect(() => {
    fetchCourseProgress();
  }, [fetchCourseProgress]);

  // Animate progress circle when progress changes
  useEffect(() => {
    const targetProgress = overallProgress;
    const startProgress = animatedProgressRef.current;
    
    // Skip animation if no change
    if (startProgress === targetProgress) return;
    
    const animationDuration = 1000; // 1 second animation
    const startTime = Date.now();
    let animationFrame: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentProgress = Math.round(startProgress + (targetProgress - startProgress) * easeOut);
      
      animatedProgressRef.current = currentProgress;
      setDisplayProgress(currentProgress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [overallProgress]);

  // Check if a lesson is completed
  const isLessonCompleted = useCallback((lessonId: string) => {
    const lessonProgress = lessonsProgress.find(
      (lp) => lp.lesson._id === lessonId
    );
    return lessonProgress?.progress?.completed || false;
  }, [lessonsProgress]);

  // Update progress to API
  const updateProgress = useCallback(async (progress: number, watchTime: number) => {
    if (!selectedLesson) return;
    
    try {
      await updateLessonProgress(
        selectedLesson._id,
        { progress: Math.round(progress), watchTime: Math.round(watchTime) },
        dispatch
      );
      
      // If lesson completed (100%), refresh progress
      if (progress >= 100) {
        toast.success(
          language === "ar" 
            ? "تم إكمال الدرس بنجاح!" 
            : "Lesson completed successfully!"
        );
        await fetchCourseProgress();
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  }, [selectedLesson, dispatch, language, fetchCourseProgress]);

  // Handle video time update - update progress every 30 seconds
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current && selectedLesson) {
      const currentVideoTime = videoRef.current.currentTime;
      const videoDuration = videoRef.current.duration;
      
      setCurrentTime(currentVideoTime);
      
      // Calculate watch time increment
      const now = Date.now();
      if (lastUpdateTimeRef.current > 0) {
        const elapsed = (now - lastUpdateTimeRef.current) / 1000;
        if (elapsed > 0 && elapsed < 2) { // Only count if less than 2 seconds (avoid pauses)
          totalWatchTimeRef.current += elapsed;
        }
      }
      lastUpdateTimeRef.current = now;
    }
  }, [selectedLesson]);

  // Start progress update interval when playing
  useEffect(() => {
    if (isPlaying && selectedLesson && duration > 0) {
      // Update progress every 30 seconds
      progressUpdateIntervalRef.current = setInterval(() => {
        if (videoRef.current) {
          const progress = (videoRef.current.currentTime / duration) * 100;
          updateProgress(progress, totalWatchTimeRef.current);
        }
      }, 30000); // 30 seconds
    }

    return () => {
      if (progressUpdateIntervalRef.current) {
        clearInterval(progressUpdateIntervalRef.current);
        progressUpdateIntervalRef.current = null;
      }
    };
  }, [isPlaying, selectedLesson, duration, updateProgress]);

  // Mark lesson as completed when video ends
  const handleVideoEnded = useCallback(async () => {
    if (selectedLesson) {
      // Update progress to 100%
      await updateProgress(100, totalWatchTimeRef.current);
    }
  }, [selectedLesson, updateProgress]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const sortedLessons = [...lessons].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  // Reset video state when lesson changes
  const selectedLessonId = selectedLesson?._id;
  useEffect(() => {
    if (selectedLessonId) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      // Reset watch time tracking
      totalWatchTimeRef.current = 0;
      lastUpdateTimeRef.current = 0;
      
      // Clear any existing interval
      if (progressUpdateIntervalRef.current) {
        clearInterval(progressUpdateIntervalRef.current);
        progressUpdateIntervalRef.current = null;
      }
    }
  }, [selectedLessonId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressUpdateIntervalRef.current) {
        clearInterval(progressUpdateIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header - Course Title and Instructor */}
      <div className="bg-[#3B5BDB] rounded-t-2xl px-6 py-4">
        <h1 className="text-white text-xl font-bold">{courseTitle}</h1>
        <p className="text-blue-200 text-sm">{instructorName}</p>
      </div>

      {/* Video Player Section - Full Width */}
      <div className="w-full">
        {selectedLesson ? (
          <div className="relative bg-black">
              {/* Video Element */}
              <video
                ref={videoRef}
                src={selectedLesson.videoUrl}
                className="w-full aspect-video object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleVideoEnded}
              />

            {/* Custom Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 to-transparent p-4">
              {/* Progress Bar */}
              <div className="relative mb-3">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  style={{
                    background: `linear-gradient(to right, #3B5BDB ${(currentTime / (duration || 1)) * 100}%, #4B5563 ${(currentTime / (duration || 1)) * 100}%)`,
                  }}
                />
                {/* Yellow Progress Indicator */}
                <div
                  className="absolute top-0 h-1 bg-yellow-400 rounded-l-lg pointer-events-none"
                  style={{ width: `${(currentTime / (duration || 1)) * 50}%` }}
                />
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 fill-current" />
                    )}
                  </button>

                  {/* Skip Backward */}
                  <button
                    onClick={skipBackward}
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>

                  {/* Volume */}
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </button>

                  {/* Time */}
                  <span className="text-white text-sm">
                    {formatTime(currentTime)}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Duration */}
                  <span className="text-white text-sm">
                    {formatTime(duration)}
                  </span>

                  {/* Settings */}
                  <button className="text-white hover:text-blue-400 transition-colors">
                    <Settings className="h-5 w-5" />
                  </button>

                  {/* PiP / Minimize */}
                  <button className="text-white hover:text-blue-400 transition-colors">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="15" height="12" rx="2" />
                      <rect x="17" y="2" width="5" height="5" rx="1" />
                    </svg>
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={handleFullscreen}
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    <Maximize className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-black aspect-video flex items-center justify-center">
            <p className="text-gray-400">
              {language === "ar" ? "اختر درساً للمشاهدة" : "Select a lesson to watch"}
            </p>
          </div>
        )}
      </div>

      {/* Progress Circle and Lessons List - Below Video */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Progress Circle Section */}
        <div className={`lg:w-1/3 rounded-2xl p-8 flex flex-col items-center justify-center ${
          theme === "dark" 
            ? "bg-[#1a1f36] border border-gray-700" 
            : "bg-white border border-gray-200 shadow-sm"
        }`}>
          {/* Large Progress Circle */}
          <div className="relative w-52 h-52 md:w-64 md:h-64">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke={theme === "dark" ? "#1e3a5f" : "#e2e8f0"}
                strokeWidth="14"
              />
              {/* Progress Circle with Animation */}
              <motion.circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="#3B5BDB"
                strokeWidth="14"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 534" }}
                animate={{ 
                  strokeDasharray: `${(displayProgress / 100) * 534} 534` 
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            {/* Percentage Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                className={`text-5xl md:text-6xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                key={displayProgress}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {displayProgress}%
              </motion.span>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="mt-4 text-center">
            {isLoadingProgress ? (
              <div className="h-5 w-32 mx-auto bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            ) : (
              <>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  {language === "ar" 
                    ? `${completedLessonsCount} من ${totalLessonsCount} دروس مكتملة`
                    : `${completedLessonsCount} of ${totalLessonsCount} lessons completed`
                  }
                </p>
                {overallProgress === 100 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-green-500 font-medium">
                      {language === "ar" ? "تم إكمال الكورس!" : "Course Completed!"}
                    </span>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Lessons List */}
        <div className={`lg:w-2/3 rounded-2xl overflow-hidden ${
          theme === "dark" 
            ? "bg-[#1a1f36] border border-gray-700" 
            : "bg-white border border-gray-200 shadow-sm"
        }`}>
          <div className="max-h-[400px] overflow-y-auto">
            {sortedLessons.map((lesson, index) => {
              const lessonTitle = language === "ar" ? lesson.title.ar : lesson.title.en;
              const isSelected = selectedLesson?._id === lesson._id;
              const isCompleted = isLessonCompleted(lesson._id);
              const lessonDuration = lesson.duration ? formatDuration(lesson.duration) : "";

              return (
                <button
                  key={lesson._id}
                  onClick={() => onLessonSelect(lesson._id)}
                  className={`w-full text-left p-4 border-b transition-all ${
                    isSelected
                      ? "bg-[#3B5BDB] text-white"
                      : theme === "dark"
                      ? "bg-[#1a1f36] hover:bg-[#252b45] border-gray-700"
                      : "bg-white hover:bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Checkbox/Status Icon */}
                    <div className="shrink-0">
                      {isCompleted ? (
                        <CheckCircle2
                          className={`h-5 w-5 ${
                            isSelected ? "text-white" : "text-green-500"
                          }`}
                        />
                      ) : isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#3B5BDB]" />
                        </div>
                      ) : (
                        <Circle
                          className={`h-5 w-5 ${
                            theme === "dark" ? "text-gray-500" : "text-gray-300"
                          }`}
                        />
                      )}
                    </div>

                    {/* Lesson Icon */}
                    <div
                      className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? "bg-white/20"
                          : theme === "dark"
                          ? "bg-blue-900/50"
                          : "bg-blue-50"
                      }`}
                    >
                      <Play
                        className={`h-4 w-4 ${
                          isSelected
                            ? "text-white"
                            : theme === "dark"
                            ? "text-blue-400"
                            : "text-blue-600"
                        }`}
                      />
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          isSelected
                            ? "text-white"
                            : theme === "dark"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")} - {lessonTitle}
                      </p>
                      {lessonDuration && (
                        <p
                          className={`text-xs mt-0.5 ${
                            isSelected
                              ? "text-blue-100"
                              : theme === "dark"
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          ({lessonDuration})
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      
      {/* Lesson Reviews Section */}
      {selectedLesson && (
        <div className="mt-6">
          <LessonReviews lessonId={selectedLesson._id} />
        </div>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && selectedLesson && (
          <ReviewModal
            lessonId={selectedLesson._id}
            courseId={course._id}
            onClose={() => setShowReviewModal(false)}
            language={language}
            theme={theme}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Review Modal Component
interface ReviewModalProps {
  lessonId: string;
  courseId: string;
  onClose: () => void;
  language: string;
  theme: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ReviewModal({ lessonId, courseId, onClose, language, theme }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    // TODO: Implement review submission API call
    // await submitReview({ lessonId, courseId, rating, comment });
    
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`w-full max-w-md rounded-2xl p-6 ${
          theme === "dark" ? "bg-[#1a1f36]" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className={`text-xl font-bold mb-4 text-center ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {language === "ar" ? "أضف تقييمك" : "Add Your Review"}
        </h3>

        {/* Star Rating */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <svg
                className={`h-8 w-8 ${
                  star <= (hoverRating || rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : theme === "dark"
                    ? "text-gray-600"
                    : "text-gray-300"
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          ))}
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={language === "ar" ? "اكتب تعليقك هنا..." : "Write your comment here..."}
          className={`w-full p-3 rounded-lg border resize-none h-32 ${
            theme === "dark"
              ? "bg-[#252b45] border-gray-700 text-white placeholder-gray-500"
              : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
          }`}
        />

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              theme === "dark"
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {language === "ar" ? "إلغاء" : "Cancel"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="flex-1 py-3 bg-[#3B5BDB] text-white rounded-lg font-medium hover:bg-[#2f4fc7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? language === "ar"
                ? "جاري الإرسال..."
                : "Submitting..."
              : language === "ar"
              ? "إرسال"
              : "Submit"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
