import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import { BottomNav } from '../components/ui/BottomNav';
import { MobileContainer } from '../components/layout/MobileContainer';

interface StatItem { label: string; count: number; }

export default function StatsPage() {
  const navigate = useNavigate();
  const [topMonths, setTopMonths] = useState<StatItem[]>([]);
  const [topPlaces, setTopPlaces] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }
      const { data: kisses } = await supabase.from('kisses').select('*').eq('user_id', session.user.id);
      if (kisses && kisses.length > 0) {
        processMonths(kisses);
        await processPlaces(kisses);
      }
      setLoading(false);
    };
    fetchData();
  }, [navigate]);

  const processMonths = (kisses: any[]) => {
    const monthCounts: Record<string, number> = {};
    const monthNames = ["OCAK", "ŞUBAT", "MART", "NİSAN", "MAYIS", "HAZİRAN", "TEMMUZ", "AĞUSTOS", "EYLÜL", "EKİM", "KASIM", "ARALIK"];
    kisses.forEach(kiss => {
      const date = new Date(kiss.created_at);
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthCounts[key] = (monthCounts[key] || 0) + 1;
    });
    setTopMonths(Object.entries(monthCounts).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count).slice(0, 3));
  };

  const processPlaces = async (kisses: any[]) => {
    const placeGroups: Record<string, { count: number, lat: number, lng: number }> = {};
    kisses.forEach(kiss => {
      const key = `${kiss.lat.toFixed(3)},${kiss.lng.toFixed(3)}`;
      if (!placeGroups[key]) placeGroups[key] = { count: 0, lat: kiss.lat, lng: kiss.lng };
      placeGroups[key].count++;
    });
    const topCoords = Object.values(placeGroups).sort((a, b) => b.count - a.count).slice(0, 3);
    const placesWithNames: StatItem[] = [];
    for (const place of topCoords) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${place.lat}&lon=${place.lng}&zoom=18&addressdetails=1`, { headers: { 'Accept-Language': 'tr' } });
        const data = await response.json();
        let locationName = "Bilinmeyen Konum";
        if (data.address) {
            const specific = data.address.park || data.address.mall || data.address.suburb || data.address.neighbourhood || data.address.road || "";
            const district = data.address.town || data.address.district || data.address.county || "";
            const city = data.address.province || data.address.city || "";
            locationName = `${[specific, district].filter(Boolean).join(' ')}/${city}`.toUpperCase();
        }
        placesWithNames.push({ label: locationName, count: place.count });
      } catch (error) {
        placesWithNames.push({ label: `KONUM (${place.lat.toFixed(2)}, ${place.lng.toFixed(2)})`, count: place.count });
      }
      await new Promise(r => setTimeout(r, 200));
    }
    setTopPlaces(placesWithNames);
  };

  return (
    <MobileContainer>
      <div className="flex flex-col h-full px-6 pt-4">
        <h1 className="font-gurajada text-[42px] text-primary-dark leading-none mb-6 drop-shadow-sm text-center shrink-0">
          KISSMAP
        </h1>

        {/* Scrollable List Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0 pb-4">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                    <p className="text-white font-urbanist mt-4 text-sm">Analiz Ediliyor...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Section 1 */}
                    <div>
                        <h2 className="text-white font-urbanist font-bold text-xs mb-2 uppercase tracking-wide pl-1 sticky top-0 bg-primary-pink z-10 py-1">
                            EN ÇOK ÖPÜŞTÜĞÜNÜZ YERLER
                        </h2>
                        <div className="space-y-2">
                            {topPlaces.length > 0 ? topPlaces.map((item, index) => (
                                <div key={index} className="bg-white rounded-[10px] py-3 px-4 flex justify-between items-center shadow-sm">
                                    <span className="text-[#A72761] font-urbanist font-bold text-xs truncate pr-2 flex-1">{item.label}</span>
                                    <span className="text-[#A72761] font-urbanist font-bold text-base">{item.count}</span>
                                </div>
                            )) : (
                                <div className="bg-white/50 rounded-[10px] py-3 px-4 text-center text-[#A72761] font-urbanist font-medium text-xs">Henüz veri yok</div>
                            )}
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div>
                        <h2 className="text-white font-urbanist font-bold text-xs mb-2 uppercase tracking-wide pl-1 sticky top-0 bg-primary-pink z-10 py-1">
                            EN ÇOK ÖPÜŞTÜĞÜNÜZ AYLAR
                        </h2>
                        <div className="space-y-2">
                            {topMonths.length > 0 ? topMonths.map((item, index) => (
                                <div key={index} className="bg-white rounded-[10px] py-3 px-4 flex justify-between items-center shadow-sm">
                                    <span className="text-[#A72761] font-urbanist font-bold text-sm">{item.label}</span>
                                    <span className="text-[#A72761] font-urbanist font-bold text-base">{item.count}</span>
                                </div>
                            )) : (
                                <div className="bg-white/50 rounded-[10px] py-3 px-4 text-center text-[#A72761] font-urbanist font-medium text-xs">Henüz veri yok</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
      <BottomNav />
    </MobileContainer>
  );
}
