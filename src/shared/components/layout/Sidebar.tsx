/**
 * Sidebar component with responsive hamburger and Font Awesome icons.
 * @module shared/components/layout/Sidebar
 */
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@shared/utils/cn';
import { useAuth } from '@shared/context/AuthContext';
import { ROUTES } from '@shared/constants/routes';
import { Spinner } from '@/components/ui/spinner';

const navPublic = [
  { label: 'Home', href: ROUTES.HOME, icon: 'fa-solid fa-house' },
  { label: 'Categories', href: ROUTES.CATEGORIES, icon: 'fa-solid fa-layer-group' },
  { label: 'Events', href: ROUTES.EVENT, icon: 'fa-solid fa-calendar' },
];

const navAuth = [
  { label: 'Favorites', href: ROUTES.FAVORITES, icon: 'fa-solid fa-heart' },
  { label: 'Profile', href: ROUTES.PROFILE, icon: 'fa-solid fa-user' },
];

const navAdmin = [
  { label: 'Create Category', href: ROUTES.ADMIN_CATEGORY_NEW, icon: 'fa-solid fa-plus' },
  { label: 'Create Event', href: ROUTES.ADMIN_EVENT_NEW, icon: 'fa-regular fa-calendar-plus' },
];

/**
 * Sidebar with mobile hamburger.
 * @returns {React.ReactElement} Element.
 */
export function Sidebar(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  function isActive(href: string): boolean {
    return location.pathname === href;
  }

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-black px-4 text-white md:hidden">
        <span className="flex items-center gap-2 font-semibold"><i className="fa-solid fa-cubes" /> SuperApp</span>
        <button onClick={() => setOpen(!open)} className="rounded-md border border-white/20 p-2 cursor-pointer">
          <i className={cn(open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars')} />
        </button>
      </header>
      <aside className={cn('fixed inset-y-0 left-0 z-30 w-64 border-r bg-black p-4 text-white transition-transform md:translate-x-0 overflow-y-auto flex flex-col justify-between', open ? 'translate-x-0' : '-translate-x-full md:translate-x-0')}>
        <div>
          <div className="mb-6 hidden items-center gap-2 font-bold md:flex"><i className="fa-solid fa-cubes" /> SuperApp</div>
          <nav className="space-y-6 pb-20">
            <div className="space-y-1">
              {navPublic.map((item) => (
                <Link key={item.href} to={item.href} onClick={() => setOpen(false)} className={cn('flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-white/10', isActive(item.href) && 'bg-white text-black font-medium')}>
                  <i className={item.icon} /> {item.label}
                </Link>
              ))}
            </div>
            {isAuthenticated && (
              <div className="space-y-1">
                <p className="px-3 text-xs font-semibold text-white/60">USER</p>
                {navAuth.map((item) => (
                  <Link key={item.href} to={item.href} onClick={() => setOpen(false)} className={cn('flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-white/10', isActive(item.href) && 'bg-white text-black')}>
                    <i className={item.icon} /> {item.label}
                  </Link>
                ))}
              </div>
            )}
            {user?.role === 'admin' && (
              <div className="space-y-1">
                <p className="px-3 text-xs font-semibold text-white/60">ADMIN</p>
                {navAdmin.map((item) => (
                  <Link key={item.href} to={item.href} onClick={() => setOpen(false)} className={cn('flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-white/10', isActive(item.href) && 'bg-white text-black')}>
                    <i className={item.icon} /> {item.label}
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>
        <div className="sticky bottom-4 pt-4 bg-black">
          {isAuthenticated ? (
            <button 
              onClick={handleLogout} 
              disabled={loggingOut}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-black hover:bg-white/90 cursor-pointer disabled:opacity-50"
            >
              {loggingOut ? <Spinner /> : <i className="fa-solid fa-right-from-bracket" />}
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          ) : (
            <button 
              onClick={() => { setOpen(false); navigate(ROUTES.LOGIN); }} 
              className="flex w-full items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-black hover:bg-white/90 cursor-pointer"
            >
              <i className="fa-solid fa-right-to-bracket" /> Login
            </button>
          )}
        </div>
      </aside>
      {open && <button onClick={() => setOpen(false)} className="fixed inset-0 z-20 bg-black/20 md:hidden" aria-label="Close sidebar" />}
    </>
  );
}