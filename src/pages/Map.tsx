import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Heart, Loader2, Navigation } from 'lucide-react';
import { BottomNav } from '../components/ui/BottomNav';
import { MobileContainer } from '../components/layout/MobileContainer';

// Varsayılan Merkez (İstanbul)
const defaultCenter: [number, number] = [41.0082, 28.9784];

// --- Custom Icons ---
const userIcon = L.divIcon({
  className: 'custom-user-icon',
  html: `
    <div class="relative flex items-center justify-center w-8 h-8 -ml-2 -mt-2">
      <div class="absolute w-full h-full bg-blue-500 rounded-full opacity-50 animate-ping"></div>
      <div class="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-md"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const heartIcon = L.divIcon({
  className: 'custom-heart-icon',
  html: `
    <div class="relative group">
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#A72761" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 drop-shadow-md">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 28],
  popupAnchor: [0, -28]
});

interface Kiss {
  id: string;
  lat: number;
  lng: number;
  created_at: string;
}

function MapEvents({ onCenterChange }: { onCenterChange: (center: [number, number]) => void }) {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      onCenterChange([center.lat, center.lng]);
    },
  });
  return null;
}

function MapController({ center, shouldFly }: { center: [number, number], shouldFly: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (shouldFly) {
      map.flyTo(center, 15, { duration: 1.5 });
    }
  }, [center, shouldFly, map]);
  return null;
}

export default function Map() {
  const navigate = useNavigate();
  const [currentMapCenter, setCurrentMapCenter] = useState<[number, number]>(defaultCenter);
  const [targetCenter, setTargetCenter] = useState<[number, number]>(defaultCenter);
  const [shouldFly, setShouldFly] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [kisses, setKisses] = useState<Kiss[]>([]);
  const [savingKiss, setSavingKiss] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      fetchKisses();
    };
    checkUser();
  }, [navigate]);

  const fetchKisses = async () => {
    const { data } = await supabase.from('kisses').select('*').order('created_at', { ascending: false });
    if (data) setKisses(data);
  };

  useEffect(() => {
    if (!navigator.geolocation) return;
    const successHandler = (position: GeolocationPosition) => {
      const pos: [number, number] = [position.coords.latitude, position.coords.longitude];
      setUserLocation(pos);
      if (!userLocation) {
        setTargetCenter(pos);
        setShouldFly(true);
        setTimeout(() => setShouldFly(false), 2000);
      }
    };
    const errorHandler = (error: GeolocationPositionError) => {
      if (error.code === 1) console.warn("Konum izni verilmedi.");
    };
    const watchId = navigator.geolocation.watchPosition(successHandler, errorHandler, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleKiss = async () => {
    const targetLat = currentMapCenter[0];
    const targetLng = currentMapCenter[1];
    setSavingKiss(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Kullanıcı bulunamadı");
      const { error } = await supabase.from('kisses').insert({ user_id: user.id, lat: targetLat, lng: targetLng });
      if (error) throw error;
      const newKiss: Kiss = { id: Math.random().toString(), lat: targetLat, lng: targetLng, created_at: new Date().toISOString() };
      setKisses(prev => [newKiss, ...prev]);
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setSavingKiss(false);
    }
  };

  const totalKisses = kisses.length;
  const lastKissDate = kisses.length > 0 ? new Date(kisses[0].created_at).toLocaleDateString('tr-TR') : '-';

  const handleLocateMe = () => {
    if (userLocation) {
      setTargetCenter(userLocation);
      setShouldFly(true);
      setTimeout(() => setShouldFly(false), 2000);
    } else {
      alert("Konum alınamadı.");
    }
  };

  return (
    <MobileContainer>
      <div className="flex flex-col h-full px-6 pt-2 pb-4">
        {/* Header - Compact */}
        <h1 className="font-gurajada text-[42px] text-primary-dark leading-none text-center mb-4 drop-shadow-sm shrink-0">
          KISSMAP
        </h1>

        {/* Map Area - Flexible Height */}
        <div className="flex-1 w-full bg-white rounded-xl shadow-xl overflow-hidden relative border-4 border-white/30 min-h-0">
          <MapContainer center={defaultCenter} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={false}>
            <TileLayer attribution='' url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <MapController center={targetCenter} shouldFly={shouldFly} />
            <MapEvents onCenterChange={setCurrentMapCenter} />
            {userLocation && <Marker position={userLocation} icon={userIcon} />}
            {kisses.map((kiss) => (<Marker key={kiss.id} position={[kiss.lat, kiss.lng]} icon={heartIcon} />))}
          </MapContainer>

          {/* Crosshair */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[400]">
            <Heart className="w-8 h-8 text-primary-dark/80 animate-pulse drop-shadow-md" />
          </div>

          {/* Locate Me */}
          <button onClick={handleLocateMe} className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-primary-dark active:scale-95 transition-transform z-[400]">
            <Navigation size={20} />
          </button>
        </div>

        {/* Action Button - Fixed Height */}
        <div className="shrink-0 flex justify-center mt-4 mb-2">
            <button
                onClick={handleKiss}
                disabled={savingKiss}
                className="bg-[#A72761] text-white w-full max-w-[200px] py-3 rounded-lg font-bold text-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
                {savingKiss ? <Loader2 className="animate-spin" /> : "ÖPÜŞTÜM"}
            </button>
        </div>

        {/* Stats Cards - Compact Row */}
        <div className="shrink-0 grid grid-cols-2 gap-3 mt-2">
          <div className="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-sm text-center">
            <span className="text-[#A72761] font-bold font-urbanist text-xs opacity-80">TOPLAM</span>
            <span className="text-[#A72761] font-bold font-urbanist text-xl leading-tight">{totalKisses}</span>
          </div>

          <div className="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-sm text-center">
            <span className="text-[#A72761] font-bold font-urbanist text-xs opacity-80">SON TARİH</span>
            <span className="text-[#A72761] font-bold font-urbanist text-lg leading-tight">{lastKissDate}</span>
          </div>
        </div>
      </div>

      <BottomNav />
    </MobileContainer>
  );
}
