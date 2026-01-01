export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-6">
      <div className="text-2xl font-bold text-white">LB</div>
      <button className="text-white">
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </header>
  );
}

