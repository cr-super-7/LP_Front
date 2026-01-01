export default function EducationalPlatform() {
  return (
    <section className="px-8 py-16">
      <div className="flex flex-col items-center gap-4">
        {/* Heading with star and dashed line */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-4xl font-bold text-white">Educational LB Platform</h2>
          <div className="flex items-center gap-2">
            <span className="text-white text-2xl">★</span>
            <div className="h-px w-32 border-t-2 border-dashed border-white"></div>
          </div>
        </div>

        {/* Description paragraphs */}
        <div className="mt-8 max-w-4xl space-y-6 text-center">
          <p className="text-lg leading-relaxed text-white">
            LB Company is a comprehensive educational platform offering private lessons
            and specialized courses for all academic levels - primary, middle school, high
            school, and university. Our mission is to provide every learner with a smooth,
            engaging, and effective learning experience tailored to every age group and
            academic need.
          </p>
          <p className="text-lg leading-relaxed text-white">
            The platform brings together a wide selection of top teachers, subject
            experts, and university professors, ensuring high-quality lessons and
            professional guidance for all students.
          </p>
        </div>
      </div>
    </section>
  );
}

