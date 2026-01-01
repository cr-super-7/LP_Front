export default function Properties() {
  const properties = [
    {
      id: 1,
      label: "Courses",
      position: "top-left",
      imageBg: "from-brown-200 to-brown-400",
    },
    {
      id: 2,
      label: "Private lessons",
      position: "bottom-center",
      imageBg: "from-blue-200 to-blue-400",
    },
    {
      id: 3,
      label: "Inquiry",
      position: "top-right",
      imageBg: "from-gray-200 to-gray-400",
    },
  ];

  return (
    <section className="px-8 py-16">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-4xl font-bold text-white">Our Properties</h2>
        <p className="text-lg text-white">go to one property to see details.</p>

        {/* Triangular layout for properties */}
        <div className="relative mt-16 h-96 w-full max-w-4xl">
          {/* Top Left - Courses */}
          <div className="absolute left-0 top-0">
            <div className="relative h-48 w-48">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-white"></div>
              <div className="absolute left-2 top-2 h-[calc(100%-16px)] w-[calc(100%-16px)] rounded-full overflow-hidden bg-linear-to-b from-amber-200 to-amber-400">
                <div className="h-full w-full bg-gray-200"></div>
              </div>
              <div className="absolute right-2 top-8 rounded-full bg-blue-400 px-4 py-2">
                <span className="text-sm font-medium text-white">Courses</span>
              </div>
            </div>
          </div>

          {/* Bottom Center - Private lessons */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <div className="relative h-48 w-48">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-white"></div>
              <div className="absolute left-2 top-2 h-[calc(100%-16px)] w-[calc(100%-16px)] rounded-full overflow-hidden bg-linear-to-b from-blue-200 to-blue-400">
                <div className="h-full w-full bg-gray-200"></div>
              </div>
              <div className="absolute right-2 top-8 rounded-full bg-blue-400 px-4 py-2">
                <span className="text-sm font-medium text-white">Private lessons</span>
              </div>
            </div>
          </div>

          {/* Top Right - Inquiry */}
          <div className="absolute right-0 top-0">
            <div className="relative h-48 w-48">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-white"></div>
              <div className="absolute left-2 top-2 h-[calc(100%-16px)] w-[calc(100%-16px)] rounded-full overflow-hidden bg-linear-to-b from-gray-200 to-gray-400">
                <div className="h-full w-full bg-gray-200"></div>
              </div>
              <div className="absolute right-2 top-8 rounded-full bg-blue-400 px-4 py-2">
                <span className="text-sm font-medium text-white">Inquiry</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

