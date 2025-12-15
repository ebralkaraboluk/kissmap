import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { router } from 'expo-router';

interface StatItem { label: string; count: number; }

export default function StatsScreen() {
  const [topMonths, setTopMonths] = useState<StatItem[]>([]);
  const [topPlaces, setTopPlaces] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace('/login'); return; }
      const { data: kisses } = await supabase.from('kisses').select('*').eq('user_id', session.user.id);
      if (kisses && kisses.length > 0) {
        processMonths(kisses);
        await processPlaces(kisses);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

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
    
    // In React Native, reverse geocoding is best done via native modules (expo-location) or API
    // Using Nominatim API here as in original code for consistency
    for (const place of topCoords) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${place.lat}&lon=${place.lng}&zoom=18&addressdetails=1`, { headers: { 'User-Agent': 'KissmapMobile/1.0' } });
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
    <ScreenContainer>
      <View className="px-6 pt-4 pb-24 flex-1">
        <Text className="font-gurajada text-[42px] text-primary-dark leading-[42px] mb-6 text-center">
          KISSMAP
        </Text>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            {loading ? (
                <View className="flex-1 items-center justify-center py-20">
                    <ActivityIndicator size="large" color="white" />
                    <Text className="text-white font-urbanist mt-4 text-sm">Analiz Ediliyor...</Text>
                </View>
            ) : (
                <View className="gap-6">
                    {/* Section 1 */}
                    <View>
                        <Text className="text-white font-urbanist font-bold text-xs mb-2 uppercase tracking-wide pl-1">
                            EN ÇOK ÖPÜŞTÜĞÜNÜZ YERLER
                        </Text>
                        <View className="gap-2">
                            {topPlaces.length > 0 ? topPlaces.map((item, index) => (
                                <View key={index} className="bg-white rounded-[10px] py-3 px-4 flex-row justify-between items-center shadow-sm">
                                    <Text className="text-[#A72761] font-urbanist font-bold text-xs flex-1 mr-2" numberOfLines={1}>{item.label}</Text>
                                    <Text className="text-[#A72761] font-urbanist font-bold text-base">{item.count}</Text>
                                </View>
                            )) : (
                                <View className="bg-white/50 rounded-[10px] py-3 px-4 items-center">
                                    <Text className="text-[#A72761] font-urbanist font-medium text-xs">Henüz veri yok</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Section 2 */}
                    <View>
                        <Text className="text-white font-urbanist font-bold text-xs mb-2 uppercase tracking-wide pl-1">
                            EN ÇOK ÖPÜŞTÜĞÜNÜZ AYLAR
                        </Text>
                        <View className="gap-2">
                            {topMonths.length > 0 ? topMonths.map((item, index) => (
                                <View key={index} className="bg-white rounded-[10px] py-3 px-4 flex-row justify-between items-center shadow-sm">
                                    <Text className="text-[#A72761] font-urbanist font-bold text-sm">{item.label}</Text>
                                    <Text className="text-[#A72761] font-urbanist font-bold text-base">{item.count}</Text>
                                </View>
                            )) : (
                                <View className="bg-white/50 rounded-[10px] py-3 px-4 items-center">
                                    <Text className="text-[#A72761] font-urbanist font-medium text-xs">Henüz veri yok</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
