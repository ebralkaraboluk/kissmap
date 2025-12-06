import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ChevronRight, X, LogOut, Trash2, Shield, CreditCard } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { BottomNav } from '../components/ui/BottomNav';
import { MobileContainer } from '../components/layout/MobileContainer';

export default function ProfilePage() {
  const navigate = useNavigate();
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
      if (!session) { navigate('/login'); return; }
      setUser({ email: session.user.email || '', username: session.user.user_metadata.username || 'Kullanıcı' });
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await supabase.auth.signOut(); navigate('/login');
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

  const MenuItem = ({ label, value, onClick, icon, isAction = false, isDestructive = false }: any) => (
    <button onClick={onClick} disabled={!onClick} className={`w-full bg-white rounded-[10px] h-12 px-4 flex justify-between items-center shadow-sm ${onClick ? 'active:scale-[0.99] transition-transform' : ''}`}>
        <div className="flex items-center gap-3">
            <span className={`font-urbanist font-bold text-sm ${isDestructive ? 'text-red-500 uppercase' : 'text-[#A72761]'}`}>{label}</span>
        </div>
        {value ? <span className="text-[#A72761]/60 font-urbanist font-medium text-xs truncate max-w-[150px]">{value}</span> : icon}
    </button>
  );

  return (
    <MobileContainer>
      <div className="flex flex-col h-full px-6 pt-4">
        <h1 className="font-gurajada text-[42px] text-primary-dark leading-none mb-1 drop-shadow-sm text-center shrink-0">KISSMAP</h1>
        <h2 className="font-urbanist font-bold text-[20px] text-white uppercase tracking-wider mb-6 drop-shadow-sm text-center shrink-0">{loading ? '...' : user?.username}</h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0 pb-4 space-y-3">
            <MenuItem label="E-Posta" value={user?.email} />
            <MenuItem label="Şifre" value="********" onClick={() => setActiveModal('password')} />
            <MenuItem label="Dil Seçenekleri" value="Türkçe" />
            <MenuItem label="Gizlilik Politikası" icon={<ChevronRight size={18} className="text-[#A72761]/60" />} onClick={() => setActiveModal('privacy')} />
            <MenuItem label="Reklam Şeridini Kaldır" icon={<ChevronRight size={18} className="text-[#A72761]/60" />} onClick={() => setActiveModal('ads')} />
            <MenuItem label="TÜM VERİLERİ SİL" icon={<ChevronRight size={18} className="text-[#A72761]/60" />} onClick={() => setActiveModal('delete')} isDestructive />
            
            <button onClick={handleLogout} className="w-full bg-[#A72761] mt-4 rounded-[10px] h-12 px-4 flex justify-center items-center shadow-sm active:scale-[0.99] transition-transform">
                <span className="text-white font-urbanist font-bold text-sm flex items-center gap-2"><LogOut size={16} /> ÇIKIŞ YAP</span>
            </button>
        </div>
      </div>
      <BottomNav />

      <AnimatePresence>
        {activeModal && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center px-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-sm rounded-2xl p-6 relative z-10 shadow-xl">
                    <button onClick={() => setActiveModal(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
                    
                    {activeModal === 'password' && (
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <h3 className="text-lg font-urbanist font-bold text-primary-dark text-center">Şifre Değiştir</h3>
                            <Input type="password" placeholder="Yeni Şifre" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="bg-gray-50 border-gray-200 py-3" />
                            <Input type="password" placeholder="Tekrar" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="bg-gray-50 border-gray-200 py-3" />
                            {message && <p className={`text-xs text-center ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>{message.text}</p>}
                            <Button type="submit" isLoading={actionLoading} className="py-3">Güncelle</Button>
                        </form>
                    )}

                    {activeModal === 'privacy' && (
                        <div className="text-center">
                             <div className="w-10 h-10 bg-primary-pink/20 rounded-full flex items-center justify-center mx-auto mb-3"><Shield className="text-primary-dark w-5 h-5" /></div>
                            <h3 className="text-lg font-urbanist font-bold text-primary-dark mb-2">Gizlilik</h3>
                            <p className="text-xs text-gray-600 font-urbanist leading-relaxed">Verileriniz uçtan uca şifrelenerek saklanmaktadır. Konum verileriniz sadece sizin görebileceğiniz şekilde işlenir.</p>
                            <Button onClick={() => setActiveModal(null)} className="mt-4 py-3">Tamam</Button>
                        </div>
                    )}

                    {activeModal === 'ads' && (
                        <div className="text-center">
                            <div className="w-12 h-12 bg-[#A72761]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CreditCard className="text-[#A72761] w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-urbanist font-bold text-primary-dark mb-2">Reklamları Kaldır</h3>
                            <p className="text-sm text-gray-600 font-urbanist mb-6 px-2">
                                Kesintisiz bir deneyim için reklamları kaldırın.<br/>
                                <span className="block mt-2 text-2xl font-bold text-[#A72761]">1.00 €</span>
                            </p>
                            {message ? (
                                <p className="text-green-500 font-bold text-sm mb-4 bg-green-50 py-2 rounded-lg">{message.text}</p>
                            ) : (
                                <Button onClick={handleRemoveAds} isLoading={actionLoading} className="py-3 bg-[#A72761] hover:bg-[#8a1f4f]">
                                    Satın Al (1€)
                                </Button>
                            )}
                        </div>
                    )}

                    {activeModal === 'delete' && (
                        <div className="text-center">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"><Trash2 className="text-red-500 w-5 h-5" /></div>
                            <h3 className="text-lg font-urbanist font-bold text-red-600 mb-2">Silinecek?</h3>
                            <p className="text-xs text-gray-600 font-urbanist mb-4">Bu işlem geri alınamaz ve tüm öpücük verileriniz silinir.</p>
                            <div className="flex gap-3"><Button onClick={() => setActiveModal(null)} className="bg-gray-200 text-gray-700 py-3 hover:bg-gray-300">İptal</Button><Button onClick={handleDeleteData} isLoading={actionLoading} className="bg-red-500 hover:bg-red-600 py-3">Sil</Button></div>
                        </div>
                    )}
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </MobileContainer>
  );
}
