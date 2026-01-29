"use client";

import type { PrivateLesson } from "../../../store/interface/privateLessonInterface";
import PrivateLessonDetailsContent from "../shared/PrivateLessonDetailsContent";

interface PrivateLessonStudentDetailsContentProps {
  lesson: PrivateLesson;
}

export default function PrivateLessonStudentDetailsContent({ lesson }: PrivateLessonStudentDetailsContentProps) {
  // Student page uses auto role-based rendering
  return <PrivateLessonDetailsContent lesson={lesson} viewer="auto" />;
}

