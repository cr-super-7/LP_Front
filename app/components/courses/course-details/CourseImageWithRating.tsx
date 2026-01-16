"use client";

import Image from "next/image";
import { Star } from "lucide-react";

interface CourseImageWithRatingProps {
  thumbnail: string;
  title: string;
  rating: number | null;
}

export default function CourseImageWithRating({
  thumbnail,
  title,
  rating,
}: CourseImageWithRatingProps) {
  return (
    <div className="relative w-full h-96 rounded-2xl overflow-hidden">
      <Image
        src={thumbnail || "/images/courses/course-placeholder.jpg"}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
        unoptimized
      />
      
      {/* Rating Badge on Image */}
      {rating !== null && (
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm">
          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs font-semibold">
            {rating.toFixed(1)}
          </span>
        </div>
      )}
    </div>
  );
}
