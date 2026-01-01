import LanguageSelector from "../home/LanguageSelector";
import ThemeToggle from "../home/ThemeToggle";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-6">
      {/* Logo */}
      <div className="text-3xl font-bold text-white">
        <span className="tracking-tight">LB</span>
      </div>

      {/* Right side - Language selector and Theme toggle */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <LanguageSelector />
      </div>
    </header>
  );
}

