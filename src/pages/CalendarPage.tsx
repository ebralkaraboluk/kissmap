import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { BottomNav } from '../components/ui/BottomNav';
import { MobileContainer } from '../components/layout/MobileContainer';

export default function CalendarPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [kissDates, setKissDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKisses = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }
      const { data } = await supabase.from('kisses').select('created_at').eq('user_id', session.user.id);
      if (data) {
        const dates = data.map(k => new Date(k.created_at).toISOString().split('T')[0]);
        setKissDates(dates);
      }
      setLoading(false);
    };
    fetchKisses();
  }, [navigate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); 
    const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    return { daysInMonth, startingDay };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const monthlyKissCount = kissDates.filter(date => date.startsWith(currentMonthKey)).length;

  return (
    <MobileContainer>
      <div className="flex flex-col h-full px-6 pt-4 pb-2 items-center">
        <h1 className="font-gurajada text-[42px] text-primary-dark leading-none mb-4 drop-shadow-sm shrink-0">
          KISSMAP
        </h1>

        {/* Calendar Card - Flexible but constrained */}
        <div className="w-full bg-white rounded-[20px] p-4 shadow-lg relative flex flex-col shrink-0">
            {/* Header */}
            <div className="flex justify-center items-center gap-3 mb-4 relative">
                <button onClick={() => changeMonth(-1)} className="absolute left-0 p-2 text-primary-dark/50 hover:text-primary-dark active:scale-90">
                    <ChevronLeft size={28} />
                </button>
                <div className="bg-[#A72761] text-white px-4 py-1.5 rounded-[10px] font-urbanist font-bold text-lg lowercase min-w-[100px] text-center">
                    {monthNames[currentDate.getMonth()]}
                </div>
                <div className="bg-[#A72761] text-white px-4 py-1.5 rounded-[10px] font-urbanist font-bold text-lg">
                    {currentDate.getFullYear()}
                </div>
                <button onClick={() => changeMonth(1)} className="absolute right-0 p-2 text-primary-dark/50 hover:text-primary-dark active:scale-90">
                    <ChevronRight size={28} />
                </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-2">
                {['p', 's', 'ç', 'p', 'c', 'c', 'p'].map((day, i) => (
                    <div key={i} className="text-center text-[#FFD3E7] font-urbanist font-bold text-base">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-2 auto-rows-fr">
                {Array.from({ length: startingDay }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const hasKiss = kissDates.includes(dateString);
                    return (
                        <div key={day} className="flex justify-center items-center aspect-square relative">
                            {hasKiss ? (
                                <div className="relative flex items-center justify-center w-full h-full">
                                    <Heart className="w-full h-full max-w-[32px] max-h-[32px] text-[#A72761] fill-[#A72761]" />
                                    <span className="absolute text-white font-urbanist font-bold text-[10px] pt-0.5">{day}</span>
                                </div>
                            ) : (
                                <span className="text-[#FFD3E7] font-urbanist font-bold text-base">{day}</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Info Text */}
        <div className="flex-1 flex flex-col justify-center items-center gap-4 min-h-0">
             <p className="text-white font-urbanist font-bold text-base text-center px-4 leading-tight opacity-90">
                Öpüştüğünüz günleri takvim sayesinde görebilirsiniz
            </p>

            <div className="w-full bg-white rounded-[15px] py-3 px-6 shadow-lg flex items-center justify-center shrink-0">
                <p className="text-[#A72761] font-urbanist font-bold text-base uppercase tracking-wide">
                    BU AY {monthlyKissCount} KEZ ÖPÜŞTÜNÜZ!
                </p>
            </div>
        </div>
      </div>
      <BottomNav />
    </MobileContainer>
  );
}
