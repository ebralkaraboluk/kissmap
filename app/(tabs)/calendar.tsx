import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { router } from 'expo-router';

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [kissDates, setKissDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKisses = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace('/login'); return; }
      const { data } = await supabase.from('kisses').select('created_at').eq('user_id', session.user.id);
      if (data) {
        const dates = data.map(k => new Date(k.created_at).toISOString().split('T')[0]);
        setKissDates(dates);
      }
      setLoading(false);
    };
    fetchKisses();
  }, []);

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
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} className="px-6 pt-4">
        <View className="items-center">
            <Text className="font-gurajada text-[42px] text-primary-dark leading-[42px] mb-4 text-center">
            KISSMAP
            </Text>

            {/* Calendar Card */}
            <View className="w-full bg-white rounded-[20px] p-4 shadow-lg mb-6">
                {/* Header */}
                <View className="flex-row justify-center items-center gap-3 mb-4 relative">
                    <TouchableOpacity onPress={() => changeMonth(-1)} className="absolute left-0 p-2">
                        <ChevronLeft size={28} color="#A72761" className="opacity-50" />
                    </TouchableOpacity>
                    <View className="bg-[#A72761] px-4 py-1.5 rounded-[10px] min-w-[100px] items-center">
                        <Text className="text-white font-urbanist font-bold text-lg lowercase">{monthNames[currentDate.getMonth()]}</Text>
                    </View>
                    <View className="bg-[#A72761] px-4 py-1.5 rounded-[10px]">
                        <Text className="text-white font-urbanist font-bold text-lg">{currentDate.getFullYear()}</Text>
                    </View>
                    <TouchableOpacity onPress={() => changeMonth(1)} className="absolute right-0 p-2">
                        <ChevronRight size={28} color="#A72761" className="opacity-50" />
                    </TouchableOpacity>
                </View>

                {/* Days Header */}
                <View className="flex-row mb-2 justify-between">
                    {['p', 's', 'ç', 'p', 'c', 'c', 'p'].map((day, i) => (
                        <View key={i} className="w-[13%] items-center">
                            <Text className="text-[#FFD3E7] font-urbanist font-bold text-base">{day}</Text>
                        </View>
                    ))}
                </View>

                {/* Days Grid */}
                <View className="flex-row flex-wrap justify-start">
                    {Array.from({ length: startingDay }).map((_, i) => (
                        <View key={`empty-${i}`} className="w-[14.28%] aspect-square" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const hasKiss = kissDates.includes(dateString);
                        return (
                            <View key={day} className="w-[14.28%] aspect-square items-center justify-center">
                                {hasKiss ? (
                                    <View className="relative items-center justify-center w-full h-full">
                                        <Heart size={32} color="#A72761" fill="#A72761" />
                                        <Text className="absolute text-white font-urbanist font-bold text-[10px] pt-0.5">{day}</Text>
                                    </View>
                                ) : (
                                    <Text className="text-[#FFD3E7] font-urbanist font-bold text-base">{day}</Text>
                                )}
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* Info Text */}
            <View className="w-full gap-4 items-center">
                <Text className="text-white font-urbanist font-bold text-base text-center px-4 leading-tight opacity-90">
                    Öpüştüğünüz günleri takvim sayesinde görebilirsiniz
                </Text>

                <View className="w-full bg-white rounded-[15px] py-3 px-6 shadow-lg items-center justify-center">
                    <Text className="text-[#A72761] font-urbanist font-bold text-base uppercase tracking-wide">
                        BU AY {monthlyKissCount} KEZ ÖPÜŞTÜNÜZ!
                    </Text>
                </View>
            </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
