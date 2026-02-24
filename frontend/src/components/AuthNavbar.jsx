import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function AuthNavbar() {
  return (
    <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
      <Link to="/" className="inline-block">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          StudyBuddy
        </h1>
      </Link>
      <ThemeToggle />
    </div>
  );
}
