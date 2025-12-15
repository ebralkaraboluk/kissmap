import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { supabase } from '@/lib/supabase';
import { Heart, Navigation, Loader2 } from 'lucide-react';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { router } from 'expo-router';

// --- Custom Icons for Leaflet ---
const heartIcon = L.divIcon({
  className: 'custom-heart-icon',
  html: `
    <div style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#A72761" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width: 32px; height: 32px; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3));">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 28],
});

const userIcon = L.divIcon({
  className: 'custom-user-icon',
  html: `
    <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 100%; height: 100%; background-color: #3B82F6; border-radius: 50%; opacity: 0.5; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: relative; width: 12px; height: 12px; background-color: #2563EB; border: 2px solid white; border-radius: 50%;"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Helper component to handle map movement
function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

// Helper to capture center for "Kiss" action
function MapCenterTracker({ onCenterChange }: { onCenterChange: (lat: number, lng: number) => void }) {
  const map = useMap();
  const onMove = () => {
    const center = map.getCenter();
    onCenterChange(center.lat, center.lng);
  };
  
  useEffect(() => {
    map.on('move', onMove);
    return () => { map.off('move', onMove); };
  }, [map]);
  return null;
}

interface Kiss {
  id: string;
  lat: number;
  lng: number;
  created_at: string;
}

export default function MapScreenWeb() {
  const [center, setCenter] = useState<[number, number]>([41.0082, 28.9784]); // Default Istanbul
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [kisses, setKisses] = useState<Kiss[]>([]);
  const [savingKiss, setSavingKiss] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentMapCenter, setCurrentMapCenter] = useState<{lat: number, lng: number}>({ lat: 41.0082, lng: 28.9784 });

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace('/login');
          return;
        }
        await fetchKisses();
        // Web'de konumu otomatik almayı dene
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                setUserLocation(newPos);
                setCenter(newPos);
                setCurrentMapCenter({ lat: newPos[0], lng: newPos[1] });
            },
            (err) => console.log("Konum alınamadı:", err),
            { enableHighAccuracy: true }
        );
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

  const handleKiss = async () => {
    setSavingKiss(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Kullanıcı bulunamadı");
      
      const targetLat = currentMapCenter.lat;
      const targetLng = currentMapCenter.lng;

      const { error } = await supabase.from('kisses').insert({ user_id: user.id, lat: targetLat, lng: targetLng });
      if (error) throw error;
      
      const newKiss: Kiss = { id: Math.random().toString(), lat: targetLat, lng: targetLng, created_at: new Date().toISOString() };
      setKisses(prev => [newKiss, ...prev]);
      
      window.alert("Başarılı: Öpücük bırakıldı! 💋");
    } catch (error: any) {
      window.alert("Hata: " + error.message);
    } finally {
      setSavingKiss(false);
    }
  };

  const handleLocateMe = () => {
    if (userLocation) {
        setCenter(userLocation);
    } else {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                setUserLocation(newPos);
                setCenter(newPos);
            },
            () => window.alert("Konum izni verilmedi.")
        );
    }
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
          {/* Leaflet Map Container */}
          <div style={{ width: '100%', height: '100%', zIndex: 0 }}>
              <MapContainer 
                center={center} 
                zoom={13} 
                style={{ width: '100%', height: '100%' }} 
                zoomControl={false}
              >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController center={center} />
                <MapCenterTracker onCenterChange={(lat, lng) => setCurrentMapCenter({ lat, lng })} />
                
                {userLocation && <Marker position={userLocation} icon={userIcon} />}
                {kisses.map((kiss) => (
                    <Marker key={kiss.id} position={[kiss.lat, kiss.lng]} icon={heartIcon} />
                ))}
              </MapContainer>
          </div>

          {/* Crosshair */}
          <View className="absolute top-1/2 left-1/2 -ml-4 -mt-4 pointer-events-none z-50">
            <Heart size={32} color="#A72761" className="opacity-80" />
          </View>

          {/* Locate Me Button */}
          <TouchableOpacity 
            onPress={handleLocateMe} 
            className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-md z-50 active:opacity-80"
          >
            <Navigation size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* Action Button */}
        <View className="shrink-0 flex items-center mt-4 mb-2">
            <TouchableOpacity
                onPress={handleKiss}
                disabled={savingKiss}
                className="bg-[#A72761] w-full max-w-[200px] py-3 rounded-lg shadow-lg flex-row items-center justify-center gap-2 active:opacity-90"
            >
                {savingKiss ? <Loader2 className="animate-spin text-white" /> : <Text className="text-white font-bold text-xl">ÖPÜŞTÜM</Text>}
            </TouchableOpacity>
        </View>

        {/* Stats */}
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
