import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { ChevronRight, X, LogOut, Trash2, Shield, CreditCard } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [user, setUser] = useState<{ email: string; username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<'password' | 'privacy' | 'delete' | 'ads' | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace('/login'); return; }
      setUser({ email: session.user.email || '', username: session.user.user_metadata.username || 'Kullanıcı' });
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); router.replace('/login'); };
  
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) { setMessage({ type: 'error', text: 'Şifreler eşleşmiyor.' }); return; }
    setActionLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Şifreniz güncellendi.' });
      setTimeout(() => { setActiveModal(null); setMessage(null); setNewPassword(''); setConfirmPassword(''); }, 1500);
    } catch (error: any) { setMessage({ type: 'error', text: error.message }); } finally { setActionLoading(false); }
  };

  const handleDeleteData = async () => {
    setActionLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Kullanıcı bulunamadı");
      const { error } = await supabase.from('kisses').delete().eq('user_id', user.id);
      if (error) throw error;
      await supabase.auth.signOut(); router.replace('/login');
    } catch (error: any) { setMessage({ type: 'error', text: "Hata oluştu." }); setActionLoading(false); }
  };

  const handleRemoveAds = () => {
    setActionLoading(true);
    // Simulating payment process
    setTimeout(() => {
      setActionLoading(false);
      setMessage({ type: 'success', text: 'Ödeme Başarılı! Reklamlar kaldırıldı.' });
      setTimeout(() => { setActiveModal(null); setMessage(null); }, 2000);
    }, 1500);
  };

  const MenuItem = ({ label, value, onPress, icon, isAction = false, isDestructive = false }: any) => (
    <TouchableOpacity 
        onPress={onPress} 
        disabled={!onPress} 
        className={`w-full bg-white rounded-[10px] h-12 px-4 flex-row justify-between items-center shadow-sm active:opacity-80`}
    >
        <View className="flex-row items-center gap-3">
            <Text className={`font-urbanist font-bold text-sm ${isDestructive ? 'text-red-500 uppercase' : 'text-[#A72761]'}`}>{label}</Text>
        </View>
        {value ? <Text className="text-[#A72761] opacity-60 font-urbanist font-medium text-xs" numberOfLines={1}>{value}</Text> : icon}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <View className="flex-1 px-6 pt-4 pb-24">
        <Text className="font-gurajada text-[42px] text-primary-dark leading-[42px] mb-1 text-center">KISSMAP</Text>
        <Text className="font-urbanist font-bold text-[20px] text-white uppercase tracking-wider mb-6 text-center">{loading ? '...' : user?.username}</Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            <MenuItem label="E-Posta" value={user?.email} />
            <MenuItem label="Şifre" value="********" onPress={() => setActiveModal('password')} />
            <MenuItem label="Dil Seçenekleri" value="Türkçe" />
            <MenuItem label="Gizlilik Politikası" icon={<ChevronRight size={18} color="#A72761" className="opacity-60" />} onPress={() => setActiveModal('privacy')} />
            <MenuItem label="Reklam Şeridini Kaldır" icon={<ChevronRight size={18} color="#A72761" className="opacity-60" />} onPress={() => setActiveModal('ads')} />
            <MenuItem label="TÜM VERİLERİ SİL" icon={<ChevronRight size={18} color="#A72761" className="opacity-60" />} onPress={() => setActiveModal('delete')} isDestructive />
            
            <TouchableOpacity onPress={handleLogout} className="w-full bg-[#A72761] mt-4 rounded-[10px] h-12 px-4 justify-center items-center shadow-sm active:opacity-90">
                <View className="flex-row items-center gap-2">
                    <LogOut size={16} color="white" />
                    <Text className="text-white font-urbanist font-bold text-sm">ÇIKIŞ YAP</Text>
                </View>
            </TouchableOpacity>
        </ScrollView>
      </View>

      <Modal visible={!!activeModal} transparent animationType="fade" onRequestClose={() => setActiveModal(null)}>
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
            <View className="bg-white w-full max-w-sm rounded-2xl p-6 relative">
                <TouchableOpacity onPress={() => setActiveModal(null)} className="absolute right-4 top-4 z-10">
                    <X size={24} color="#9CA3AF" />
                </TouchableOpacity>
                
                {activeModal === 'password' && (
                    <View className="gap-4">
                        <Text className="text-lg font-urbanist font-bold text-primary-dark text-center">Şifre Değiştir</Text>
                        <Input placeholder="Yeni Şifre" secureTextEntry value={newPassword} onChangeText={setNewPassword} className="bg-gray-50 border-gray-200" />
                        <Input placeholder="Tekrar" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} className="bg-gray-50 border-gray-200" />
                        {message && <Text className={`text-xs text-center ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>{message.text}</Text>}
                        <Button onPress={handleChangePassword} isLoading={actionLoading} title="Güncelle" />
                    </View>
                )}

                {activeModal === 'privacy' && (
                    <View className="items-center">
                         <View className="w-10 h-10 bg-primary-pink/20 rounded-full items-center justify-center mb-3">
                            <Shield size={20} color="#A72761" />
                        </View>
                        <Text className="text-lg font-urbanist font-bold text-primary-dark mb-2">Gizlilik</Text>
                        <Text className="text-xs text-gray-600 font-urbanist leading-relaxed text-center">Verileriniz uçtan uca şifrelenerek saklanmaktadır. Konum verileriniz sadece sizin görebileceğiniz şekilde işlenir.</Text>
                        <Button onPress={() => setActiveModal(null)} title="Tamam" className="mt-4" />
                    </View>
                )}

                {activeModal === 'ads' && (
                    <View className="items-center">
                        <View className="w-12 h-12 bg-[#A72761]/10 rounded-full items-center justify-center mb-3">
                            <CreditCard size={24} color="#A72761" />
                        </View>
                        <Text className="text-lg font-urbanist font-bold text-primary-dark mb-2">Reklamları Kaldır</Text>
                        <Text className="text-sm text-gray-600 font-urbanist mb-6 text-center">
                            Kesintisiz bir deneyim için reklamları kaldırın.
                        </Text>
                        <Text className="text-2xl font-bold text-[#A72761] mb-6">1.00 €</Text>
                        
                        {message ? (
                            <Text className="text-green-500 font-bold text-sm mb-4 bg-green-50 py-2 px-4 rounded-lg">{message.text}</Text>
                        ) : (
                            <Button onPress={handleRemoveAds} isLoading={actionLoading} title="Satın Al (1€)" className="bg-[#A72761]" />
                        )}
                    </View>
                )}

                {activeModal === 'delete' && (
                    <View className="items-center">
                        <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mb-3">
                            <Trash2 size={20} color="#EF4444" />
                        </View>
                        <Text className="text-lg font-urbanist font-bold text-red-600 mb-2">Silinecek?</Text>
                        <Text className="text-xs text-gray-600 font-urbanist mb-4 text-center">Bu işlem geri alınamaz ve tüm öpücük verileriniz silinir.</Text>
                        <View className="flex-row gap-3 w-full">
                            <Button onPress={() => setActiveModal(null)} title="İptal" className="flex-1 bg-gray-200" />
                            <Button onPress={handleDeleteData} isLoading={actionLoading} title="Sil" className="flex-1 bg-red-500" />
                        </View>
                    </View>
                )}
            </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
