export default function Blogs() {
  const blogs = [
    {
      id: 1,
      title: "Quantum Computing: Almost Here. Almost Useful.",
      snippet:
        "Imagine designing life-saving drugs in weeks, instantly cracking the toughest encryptions and a general artificial intelligence way beyond today's limits. Quantum computing promises...",
      imageBg: "from-yellow-400 to-yellow-600",
    },
    {
      id: 2,
      title: "Blockchain Beyond Bitcoin: The Revolution We Overlooked",
      snippet:
        "We got distracted. Somewhere between the promise of decentralization and the rise of digital gold, we fixated on cryptocurrency. It became the...",
      imageBg: "from-yellow-300 to-yellow-500",
    },
    {
      id: 3,
      title: "Financial Risk in the Age of AI: A Double-Edged Sword",
      snippet:
        "Markets crash, businesses default and new AI accelerators both risk and reward. Deepfakes, identity theft and algorithmic failures cause new vulnerabilities, making...",
      imageBg: "from-blue-300 to-blue-500",
    },
  ];

  return (
    <section className="px-8 py-16">
      <div className="flex flex-col items-center gap-8">
        <h2 className="text-4xl font-bold text-white">Our Blogs</h2>

        {/* Blog cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="flex flex-col overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm"
            >
              {/* Blog image */}
              <div
                className={`h-48 w-full bg-linear-to-br ${blog.imageBg} flex items-center justify-center`}
              >
                <div className="h-32 w-32 rounded-lg bg-white/20"></div>
              </div>

              {/* Blog content */}
              <div className="flex flex-col gap-3 p-6">
                <h3 className="text-xl font-semibold text-white">{blog.title}</h3>
                <p className="text-sm leading-relaxed text-white/80">{blog.snippet}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

