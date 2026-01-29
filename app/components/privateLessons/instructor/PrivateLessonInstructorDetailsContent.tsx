"use client";

import type { PrivateLesson } from "../../../store/interface/privateLessonInterface";
import PrivateLessonDetailsContent from "../shared/PrivateLessonDetailsContent";

interface PrivateLessonInstructorDetailsContentProps {
  lesson: PrivateLesson;
}

export default function PrivateLessonInstructorDetailsContent({ lesson }: PrivateLessonInstructorDetailsContentProps) {
  return <PrivateLessonDetailsContent lesson={lesson} viewer="instructor" />;
}

