import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, PieChart, User } from 'lucide-react';
import { clsx } from 'clsx';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[30px] shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-[9999] pb-safe">
      <div className="flex justify-around items-center h-20 px-6">
        <button 
            onClick={() => navigate('/map')}
            className={clsx(
              "flex flex-col items-center transition-transform active:scale-95 p-2",
              isActive('/map') ? "text-[#A72761]" : "text-[#A72761]/50 hover:text-[#A72761]"
            )}
        >
          <Home size={28} strokeWidth={isActive('/map') ? 2.5 : 2} />
        </button>
        
        <button 
            onClick={() => navigate('/calendar')}
            className={clsx(
              "flex flex-col items-center transition-transform active:scale-95 p-2",
              isActive('/calendar') ? "text-[#A72761]" : "text-[#A72761]/50 hover:text-[#A72761]"
            )}
        >
          <Calendar size={28} strokeWidth={isActive('/calendar') ? 2.5 : 2} />
        </button>
        
        <button 
            onClick={() => navigate('/stats')}
            className={clsx(
              "flex flex-col items-center transition-transform active:scale-95 p-2",
              isActive('/stats') ? "text-[#A72761]" : "text-[#A72761]/50 hover:text-[#A72761]"
            )}
        >
          <PieChart size={28} strokeWidth={isActive('/stats') ? 2.5 : 2} />
        </button>
        
        <button 
            onClick={() => navigate('/profile')}
            className={clsx(
              "flex flex-col items-center transition-transform active:scale-95 p-2",
              isActive('/profile') ? "text-[#A72761]" : "text-[#A72761]/50 hover:text-[#A72761]"
            )}
        >
          <User size={28} strokeWidth={isActive('/profile') ? 2.5 : 2} />
        </button>
      </div>
    </div>
  );
};
