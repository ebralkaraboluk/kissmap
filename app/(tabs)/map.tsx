import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { supabase } from '@/lib/supabase';
import { Heart, Navigation } from 'lucide-react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { router } from 'expo-router';

// BU DOSYA SADECE MOBİL (ANDROID/IOS) İÇİN ÇALIŞIR
// Web için map.web.tsx dosyası kullanılır.

interface Kiss {
  id: string;
  lat: number;
  lng: number;
  created_at: string;
}

const defaultRegion = {
  latitude: 41.0082,
  longitude: 28.9784,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState(defaultRegion);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [kisses, setKisses] = useState<Kiss[]>([]);
  const [savingKiss, setSavingKiss] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace('/login');
          return;
        }
        await fetchKisses();
        await getLocation();
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchKisses = async () => {
    const { data } = await supabase.from('kisses').select('*').order('created_at', { ascending: false });
    if (data) setKisses(data);
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Konum izni olmadan harita özelliklerini tam kullanamazsınız.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location);
    
    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

  const handleKiss = async () => {
    setSavingKiss(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Kullanıcı bulunamadı");
      
      const targetLat = region.latitude;
      const targetLng = region.longitude;

      const { error } = await supabase.from('kisses').insert({ user_id: user.id, lat: targetLat, lng: targetLng });
      if (error) throw error;
      
      const newKiss: Kiss = { id: Math.random().toString(), lat: targetLat, lng: targetLng, created_at: new Date().toISOString() };
      setKisses(prev => [newKiss, ...prev]);
      
      Alert.alert("Başarılı", "Öpücük bırakıldı! 💋");
    } catch (error: any) {
      Alert.alert("Hata", error.message);
    } finally {
      setSavingKiss(false);
    }
  };

  const handleLocateMe = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        if (newStatus !== 'granted') return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location);
    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

  const totalKisses = kisses.length;
  const lastKissDate = kisses.length > 0 ? new Date(kisses[0].created_at).toLocaleDateString('tr-TR') : '-';

  if (loading) {
      return (
          <ScreenContainer className="items-center justify-center">
              <ActivityIndicator size="large" color="#A72761" />
          </ScreenContainer>
      )
  }

  return (
    <ScreenContainer>
      <View className="flex-1 px-6 pt-2 pb-24">
        <Text className="font-gurajada text-[42px] text-primary-dark text-center mb-4 shrink-0">
          KISSMAP
        </Text>

        <View className="flex-1 w-full bg-white rounded-xl shadow-xl overflow-hidden relative border-4 border-white/30 min-h-0">
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFill}
            initialRegion={defaultRegion}
            onRegionChangeComplete={setRegion}
            showsUserLocation
            showsMyLocationButton={false}
          >
            {kisses.map((kiss) => (
              <Marker 
                key={kiss.id} 
                coordinate={{ latitude: kiss.lat, longitude: kiss.lng }}
              >
                 <View className="items-center justify-center">
                    <Heart size={32} color="#A72761" fill="#A72761" />
                 </View>
              </Marker>
            ))}
          </MapView>

          <View className="absolute top-1/2 left-1/2 -ml-4 -mt-4 pointer-events-none z-50">
            <Heart size={32} color="#A72761" className="opacity-80" />
          </View>

          <TouchableOpacity 
            onPress={handleLocateMe} 
            className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-md z-50 active:opacity-80"
          >
            <Navigation size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>

        <View className="shrink-0 flex items-center mt-4 mb-2">
            <TouchableOpacity
                onPress={handleKiss}
                disabled={savingKiss}
                className="bg-[#A72761] w-full max-w-[200px] py-3 rounded-lg shadow-lg flex-row items-center justify-center gap-2 active:opacity-90"
            >
                {savingKiss ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-xl">ÖPÜŞTÜM</Text>}
            </TouchableOpacity>
        </View>

        <View className="shrink-0 flex-row gap-3 mt-2">
          <View className="flex-1 bg-white rounded-xl p-3 items-center justify-center shadow-sm">
            <Text className="text-[#A72761] font-bold font-urbanist text-xs opacity-80">TOPLAM</Text>
            <Text className="text-[#A72761] font-bold font-urbanist text-xl">{totalKisses}</Text>
          </View>

          <View className="flex-1 bg-white rounded-xl p-3 items-center justify-center shadow-sm">
            <Text className="text-[#A72761] font-bold font-urbanist text-xs opacity-80">SON TARİH</Text>
            <Text className="text-[#A72761] font-bold font-urbanist text-lg">{lastKissDate}</Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
