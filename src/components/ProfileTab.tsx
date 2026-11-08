import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Settings,
  ChevronRight,
  Shield,
  Activity,
  Heart,
  Droplet,
  Moon,
  Lock,
  Download,
  HelpCircle,
  LogOut,
  Bell,
  RefreshCw,
  Pill,
  Watch,
  Camera,
  Check,
  X,
  Clock,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  Wind
} from 'lucide-react';
import { UserProfile, SupplementItem } from '../types';
import { FloraLogo } from './FloraLogo';
import { soundEngine } from '../utils/audio';
import { triggerRosePollenBurst } from '../utils/confetti';

interface ProfileTabProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'water') => void;
  supplements: SupplementItem[];
  onAddSupplement: (item: SupplementItem) => void;
  onDeleteSupplement: (id: string) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  onUpdateProfile,
  showToast,
  supplements,
  onAddSupplement,
  onDeleteSupplement,
}) => {
  // Goal state
  const [selectedGoal, setSelectedGoal] = useState<'regl' | 'hamilelik' | 'gebelik'>('hamilelik');

  // Water slider state
  const [sliderLiters, setSliderLiters] = useState<number>(profile.waterGoalMl / 1000 || 2.4);

  // Granular Notification Preferences
  const [notifyPeriod, setNotifyPeriod] = useState<boolean>(true);
  const [notifyFertile, setNotifyFertile] = useState<boolean>(true);
  const [notifyPmsCalm, setNotifyPmsCalm] = useState<boolean>(true);
  const [notifyFollicular, setNotifyFollicular] = useState<boolean>(true);
  const [notifyWater, setNotifyWater] = useState<boolean>(true);
  const [notifySupplement, setNotifySupplement] = useState<boolean>(true);
  const [notifySleep, setNotifySleep] = useState<boolean>(true);

  // Security switches
  const [faceIdEnabled, setFaceIdEnabled] = useState<boolean>(profile.faceIdActive ?? true);
  const [anonymousEnabled, setAnonymousEnabled] = useState<boolean>(profile.anonymousMode ?? false);

  // Device sync
  const [ouraConnected, setOuraConnected] = useState<boolean>(profile.ouraConnected ?? false);

  // Modals state
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);
  const [showSleepModal, setShowSleepModal] = useState<boolean>(false);
  const [showCycleParamModal, setShowCycleParamModal] = useState<boolean>(false);
  const [showAddSupplementModal, setShowAddSupplementModal] = useState<boolean>(false);
  const [showHormoneModal, setShowHormoneModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  // Add Supplement Form State
  const [newSuppName, setNewSuppName] = useState('');
  const [newSuppDose, setNewSuppDose] = useState('1 Tablet');
  const [newSuppTime, setNewSuppTime] = useState('09:00');
  const [newSuppReminder, setNewSuppReminder] = useState(true);

  // Form states for sleep and cycle
  const [bedtime, setBedtime] = useState<string>(profile.quietHoursStart || '23:00');
  const [waketime, setWaketime] = useState<string>(profile.quietHoursEnd || '07:30');
  const [editCycleLen, setEditCycleLen] = useState<number>(profile.cycleLength || 28);
  const [editPeriodLen, setEditPeriodLen] = useState<number>(profile.periodLength || 5);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const defaultAvatar = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80';
  const currentAvatar = profile.avatarUrl || defaultAvatar;

  const presetAvatars = [
    { id: 'p1', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80', label: 'Zeynep Gül' },
    { id: 'p2', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', label: 'Bahar Botanik' },
    { id: 'p3', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', label: 'Lotus Güneş' },
    { id: 'p4', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', label: 'Defne Flora' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          soundEngine.playCrystalChime();
          triggerRosePollenBurst();
          onUpdateProfile({ avatarUrl: reader.result });
          setShowAvatarModal(false);
          showToast('Profil Fotoğrafı Güncellendi 🌸', 'Yeni avatarınız başarıyla yüklendi.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSliderChange = (val: number) => {
    soundEngine.playDropletSound();
    setSliderLiters(val);
    onUpdateProfile({ waterGoalMl: Math.round(val * 1000) });
  };

  const handleToggle = (
    current: boolean,
    setter: (val: boolean) => void,
    title: string,
    successMsg: string
  ) => {
    soundEngine.playDropletSound();
    const next = !current;
    setter(next);
    showToast(title, next ? `${successMsg} aktif edildi.` : `${title} kapatıldı.`, 'info');
  };

  const handleCreateSupplement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuppName.trim()) return;

    soundEngine.playCrystalChime();
    triggerRosePollenBurst();
    const newItem: SupplementItem = {
      id: Date.now().toString(),
      name: newSuppName.trim(),
      dose: newSuppDose || '1 Porsiyon',
      time: newSuppTime || '09:00',
      taken: false,
      reminderEnabled: newSuppReminder,
    };

    onAddSupplement(newItem);
    setShowAddSupplementModal(false);
    setNewSuppName('');
    showToast('Yeni Takviye Eklendi', `${newItem.name} (${newItem.time}) profilinize kaydedildi.`, 'success');
  };

  const handleExportData = () => {
    soundEngine.playCrystalChime();
    triggerRosePollenBurst();

    const exportData = {
      app: 'Flora Cycle Clinical Protocol',
      exportDate: new Date().toISOString(),
      user: {
        name: profile.name,
        cycleLength: profile.cycleLength,
        periodLength: profile.periodLength,
        goal: profile.goal,
        waterGoalMl: profile.waterGoalMl,
        quietHours: `${profile.quietHoursStart} - ${profile.quietHoursEnd}`,
      },
      supplements: supplements,
      metricsSummary: {
        lastCycleDays: [28, 29, 27, 28, 28, 28],
        averageBBT: 36.65,
        regularityRate: '98%',
        pcosRisk: 'Bulgu saptanmadı',
      },
      disclaimer: 'Bu belge Flora Cycle tarafından klinik kullanım amacıyla üretilmiştir.',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `flora_saglik_karnesi_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast(
      'Sağlık Karnesi İndirildi ✓',
      'AES-256 şifreli sağlık veriniz cihazınıza kaydedildi.',
      'success'
    );
  };

  const handleSaveSleep = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playCrystalChime();
    onUpdateProfile({ quietHoursStart: bedtime, quietHoursEnd: waketime });
    setShowSleepModal(false);
    showToast('Uyku Saatleri Güncellendi', `${bedtime} - ${waketime} sessiz uyku saati olarak ayarlandı.`, 'success');
  };

  const handleSaveCycleParams = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playCrystalChime();
    onUpdateProfile({ cycleLength: editCycleLen, periodLength: editPeriodLen });
    setShowCycleParamModal(false);
    showToast('Döngü Parametreleri Güncellendi', `Döngü: ${editCycleLen} gün, Regl: ${editPeriodLen} gün olarak kaydedildi.`, 'success');
  };

  return (
    <div className="space-y-5 pb-28 pt-2 select-none text-[#1f1a1c]">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Top Header Bar (No Apple Health mention) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FloraLogo size="sm" />
          <span className="text-sm font-extrabold text-[#1f1a1c]">
            Profil & Biyo-Ayarlar
          </span>
        </div>

        <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Şifreli Kasa Aktif</span>
        </div>
      </div>

      {/* HERO PROFILE CLAY CARD */}
      <div className="w-full bg-white rounded-3xl p-5 clay-card shadow-[0_12px_32px_rgba(216,27,96,0.08)] border border-white relative overflow-hidden">
        <div className="flex items-center gap-4 mb-4 relative z-10">
          {/* Avatar with Dual-Layer Botanical Halo */}
          <div className="relative shrink-0">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-amber-300 via-pink-400 to-rose-400 blur-sm opacity-60 animate-pulse pointer-events-none" />

            <div
              onClick={() => setShowAvatarModal(true)}
              className="relative w-20 h-20 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-400 via-[#d81b60] to-rose-400 shadow-md cursor-pointer group"
            >
              <img
                src={currentAvatar}
                alt={profile.name}
                className="w-full h-full object-cover rounded-full bg-pink-100 group-hover:opacity-90 transition-opacity"
              />
            </div>

            {/* Pencil Button -> Opens Avatar Modal & File Picker */}
            <button
              onClick={() => {
                soundEngine.playDropletSound();
                setShowAvatarModal(true);
              }}
              title="Profil Fotoğrafını Değiştir"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-tr from-[#b0004a] to-amber-500 flex items-center justify-center shadow-md border-2 border-white text-white cursor-pointer active:scale-90 hover:scale-105 transition-transform"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black text-[#1f1a1c] tracking-tight">
                {profile.name}
              </h2>
              <span className="text-[#b0004a] text-sm font-bold">✔</span>
            </div>
            <p className="text-xs font-semibold text-[#805062] mt-0.5">
              28 Yaş • İstanbul
            </p>

            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-50 to-amber-50 text-[#b0004a] text-xs font-bold border border-pink-200/60 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{profile.goal || 'Doğurganlık & Gebe Modu'}</span>
            </div>
          </div>
        </div>

        {/* 3 Pill Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-pink-100/60 relative z-10">
          <div
            onClick={() => setShowCycleParamModal(true)}
            className="p-3 rounded-2xl bg-gradient-to-b from-white to-pink-50/50 border border-pink-100/80 text-center shadow-xs cursor-pointer hover:border-pink-300 transition-all"
          >
            <span className="text-[11px] font-bold text-[#805062] flex items-center justify-center gap-1">
              <span>🌿</span> Döngü
            </span>
            <span className="block text-xl font-black text-[#b0004a] my-0.5">
              {profile.cycleLength}
            </span>
            <span className="text-[10px] text-[#805062] font-semibold">Gün Ritmi ✎</span>
          </div>

          <div
            onClick={() => setShowCycleParamModal(true)}
            className="p-3 rounded-2xl bg-gradient-to-b from-white to-pink-50/50 border border-pink-100/80 text-center shadow-xs cursor-pointer hover:border-pink-300 transition-all"
          >
            <span className="text-[11px] font-bold text-[#805062] flex items-center justify-center gap-1">
              <span>🌸</span> Regl
            </span>
            <span className="block text-xl font-black text-[#b0004a] my-0.5">
              {profile.periodLength}
            </span>
            <span className="text-[10px] text-[#805062] font-semibold">Gün Akış ✎</span>
          </div>

          <div className="p-3 rounded-2xl bg-gradient-to-b from-white to-pink-50/50 border border-pink-100/80 text-center shadow-xs">
            <span className="text-[11px] font-bold text-[#805062] flex items-center justify-center gap-1">
              <span>✨</span> Luteal
            </span>
            <span className="block text-xl font-black text-amber-600 my-0.5">
              14
            </span>
            <span className="text-[10px] text-[#805062] font-semibold">Altın Faz</span>
          </div>
        </div>
      </div>

      {/* GÜNLÜK TAKVİYE YÖNETİMİ & TAKVİYE EKLEME (PROFİLDE) */}
      <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-50 text-[#d81b60] flex items-center justify-center shadow-xs">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#1f1a1c]">
                Günlük Takviyeler & Öz-Bakım
              </h3>
              <p className="text-[11px] text-[#805062]">
                {supplements.length} aktif takviye listenizde
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playDropletSound();
              setShowAddSupplementModal(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#b0004a] to-[#d81b60] text-white text-xs font-bold flex items-center gap-1 shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Takviye Ekle</span>
          </button>
        </div>

        {/* Supplements list in Profile */}
        <div className="space-y-2">
          {supplements.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-pink-50/30 border border-pink-100 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-white text-[#b0004a] flex items-center justify-center font-bold text-xs shadow-xs">
                  💊
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1f1a1c] truncate">{item.name}</p>
                  <p className="text-[10.5px] text-[#805062]">
                    Doz: {item.dose} • Saat: {item.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {item.reminderEnabled ? 'Hatırlatıcı Aktif' : 'Pasif'}
                </span>
                {supplements.length > 1 && (
                  <button
                    onClick={() => {
                      soundEngine.playDropletSound();
                      onDeleteSupplement(item.id);
                      showToast('Takviye Silindi', `${item.name} listenizden çıkarıldı.`, 'info');
                    }}
                    className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer transition"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AKILLI BİLDİRİM AYARLARI & TERCIHLERI (ALARMLAR BURADAN YÖNETİLİR) */}
      <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#1f1a1c]">
                Akıllı Bildirim & Uyarı Ayarları
              </h3>
              <p className="text-[11px] text-[#805062]">
                Neler hakkında bildirim almak istediğinizi buradan seçin
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {/* Switch 1: Gelecek Regl */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-base">📅</span>
              <div>
                <span className="text-xs font-bold text-[#1f1a1c] block">Gelecek Regl Uyarısı</span>
                <span className="text-[11px] text-[#805062]">2 gün önceden nazik uyarı</span>
              </div>
            </div>

            <button
              onClick={() => handleToggle(notifyPeriod, setNotifyPeriod, 'Regl Bildirimi', 'Gelecek regl bildirimi')}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                notifyPeriod ? 'bg-[#d81b60]' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                  notifyPeriod ? 'left-6' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Switch 2: Doğurganlık Zirve */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-base">✨</span>
              <div>
                <span className="text-xs font-bold text-[#1f1a1c] block">Doğurganlık & Ovülasyon Zirve Bildirimi</span>
                <span className="text-[11px] text-[#805062]">En yüksek şans penceresi uyarısı</span>
              </div>
            </div>

            <button
              onClick={() => handleToggle(notifyFertile, setNotifyFertile, 'Doğurganlık Bildirimi', 'Zirve ovülasyon uyarısı')}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                notifyFertile ? 'bg-[#d81b60]' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                  notifyFertile ? 'left-6' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Switch 3: Adet & PMS Öncesi Şefkat ve Öfke Yatıştırma */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-base">🕊️</span>
              <div>
                <span className="text-xs font-bold text-[#1f1a1c] block">PMS & Öfke Öncesi Rahatlatıcı Bildirim</span>
                <span className="text-[11px] text-[#805062]">Öfke patlamalarından önce 4-7-8 nefes & melisa çayı tavsiyesi</span>
              </div>
            </div>

            <button
              onClick={() => handleToggle(notifyPmsCalm, setNotifyPmsCalm, 'PMS & Öfke Yatıştırıcı Bildirim', 'Rahatlatıcı bildirimler')}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                notifyPmsCalm ? 'bg-[#d81b60]' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                  notifyPmsCalm ? 'left-6' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Switch 4: Foliküler Faz & Motivasyon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-base">🌱</span>
              <div>
                <span className="text-xs font-bold text-[#1f1a1c] block">Foliküler Faz & Canlılık Bildirimi</span>
                <span className="text-[11px] text-[#805062]">Östrojen yükselişi, motivasyon ve spor rehberi</span>
              </div>
            </div>

            <button
              onClick={() => handleToggle(notifyFollicular, setNotifyFollicular, 'Foliküler Faz Bildirimi', 'Canlılık bildirimleri')}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                notifyFollicular ? 'bg-[#d81b60]' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                  notifyFollicular ? 'left-6' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Switch 5: Su Tüketimi */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-base">💧</span>
              <div>
                <span className="text-xs font-bold text-[#1f1a1c] block">Su & Canlı Sıvı Hatırlatıcı</span>
                <span className="text-[11px] text-[#805062]">Düzenli aralıklarla nazikçe fısılda</span>
              </div>
            </div>

            <button
              onClick={() => handleToggle(notifyWater, setNotifyWater, 'Su Hatırlatıcısı', 'Canlı su uyarısı')}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                notifyWater ? 'bg-[#d81b60]' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                  notifyWater ? 'left-6' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Switch 6: Günlük Biyo-Takviye */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-base">💊</span>
              <div>
                <span className="text-xs font-bold text-[#1f1a1c] block">Günlük Biyo-Takviye Alarmı</span>
                <span className="text-[11px] text-[#805062]">Sabah vitamin ve takviye saatinde uyarı</span>
              </div>
            </div>

            <button
              onClick={() => handleToggle(notifySupplement, setNotifySupplement, 'Takviye Bildirimi', 'Biyo-takviye alarmları')}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                notifySupplement ? 'bg-[#d81b60]' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                  notifySupplement ? 'left-6' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Switch 7: Melatonin Uyku Koruması */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-base">🌙</span>
              <div>
                <span className="text-xs font-bold text-[#1f1a1c] block">Sessiz Botanik Uyku Koruması (DND)</span>
                <span className="text-[11px] text-[#805062]">{profile.quietHoursStart || '23:00'} - {profile.quietHoursEnd || '07:30'} arası bildirimleri sessize al</span>
              </div>
            </div>

            <button
              onClick={() => handleToggle(notifySleep, setNotifySleep, 'Uyku Koruması', 'Sessiz uyku saatleri')}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                notifySleep ? 'bg-[#d81b60]' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                  notifySleep ? 'left-6' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ORGANİK BİYO-RİTİM & SIVI */}
      <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#1f1a1c]">
            Organik Biyo-Ritim & Sıvı
          </h3>
          <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 text-[11px] font-bold border border-cyan-200/60 flex items-center gap-1 shadow-xs">
            💧 Optimal Flora
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-b from-pink-50/40 to-rose-50/20 border border-pink-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚰</span>
              <div>
                <span className="text-xs font-bold text-[#1f1a1c] block">Günlük Canlı Su & Hidrasyon</span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-full bg-cyan-100/70 text-cyan-900 font-black text-xs shadow-xs">
              {sliderLiters.toFixed(1)} Litre ({Math.round(sliderLiters / 0.3)} Bardak)
            </div>
          </div>

          <div className="relative pt-2 pb-1">
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.1"
              value={sliderLiters}
              onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
              className="w-full h-3.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#d81b60] shadow-inner"
            />

            <div className="flex items-center justify-between text-[10px] font-bold text-[#805062] mt-1.5 px-1">
              <span>1.0 L (Hafif)</span>
              <span className="text-[#b0004a]">🌸 Doğurganlık için +0.5 L Önerilir</span>
              <span>4.0 L (Yüksek)</span>
            </div>
          </div>
        </div>

        {/* Melatonin Düzenle */}
        <div className="p-3.5 rounded-2xl bg-pink-50/30 border border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-base shadow-xs">
              🌙
            </div>
            <div>
              <span className="text-xs font-bold text-[#1f1a1c] block">
                Melatonin & Gece Koruma Saati
              </span>
              <span className="text-[11px] text-[#805062]">
                {profile.quietHoursStart || '23:00'} - {profile.quietHoursEnd || '07:30'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playDropletSound();
              setShowSleepModal(true);
            }}
            className="px-3 py-1.5 rounded-full bg-white text-xs font-bold text-[#b0004a] border border-pink-200 hover:bg-pink-50 shadow-xs cursor-pointer active:scale-95 transition-transform"
          >
            Düzenle
          </button>
        </div>
      </div>

      {/* TIBBİ GİZLİLİK & KASA */}
      <div className="rounded-3xl bg-gradient-to-br from-[#2a1720] to-[#1f1017] text-white p-5 shadow-xl space-y-4 border border-rose-950/40">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
              <Shield className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold">Tıbbi Gizlilik & Kasa</h3>
              <p className="text-[11px] text-rose-200/70">
                Uçtan uca şifrelenmiş biyolojik DNA & döngü kasası
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-[#b0004a] text-white font-black text-[10px] tracking-wider uppercase shadow-xs">
            AES-256
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-rose-300" />
            <span className="text-xs font-bold">Face ID ile Kilitle</span>
          </div>

          <button
            onClick={() => handleToggle(faceIdEnabled, setFaceIdEnabled, 'Face ID', 'Biyometrik kilit')}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              faceIdEnabled ? 'bg-[#d81b60]' : 'bg-white/20'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                faceIdEnabled ? 'left-6' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        <button
          onClick={handleExportData}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-white/15 to-white/10 hover:from-white/20 hover:to-white/15 border border-white/20 text-xs font-bold flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer text-white"
        >
          <Download className="w-4 h-4 text-amber-300" />
          <span>Tüm Sağlık Verilerini Dışa Aktar (JSON/CSV)</span>
          <span className="text-amber-300">✨</span>
        </button>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => {
            soundEngine.playDropletSound();
            setShowHelpModal(true);
          }}
          className="w-full p-3.5 rounded-2xl bg-white border border-pink-100 flex items-center justify-between text-xs font-bold text-[#1f1a1c] hover:bg-pink-50 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2 text-[#805062]">
            <HelpCircle className="w-4 h-4 text-[#d81b60]" />
            <span>Yardım & Klinik Danışma Rehberi</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#805062]" />
        </button>

        <button
          onClick={() => {
            soundEngine.playDropletSound();
            setShowLogoutModal(true);
          }}
          className="w-full py-3 text-center text-xs font-bold text-[#b0004a] flex items-center justify-center gap-1.5 cursor-pointer hover:underline"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Güvenli Çıkış Yap</span>
        </button>

        <p className="text-[10px] text-center text-[#805062]/80 pt-1">
          🌸 Sürüm 3.4.2 • Kadife Botanik Sağlık Güvencesi
        </p>
      </div>

      {/* MODAL: YENİ TAKVİYE EKLE */}
      {showAddSupplementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-pink-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-pink-50 pb-2.5">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-[#d81b60]" />
                <h3 className="font-extrabold text-sm text-[#1f1a1c]">
                  Yeni Takviye Ekle
                </h3>
              </div>
              <button
                onClick={() => setShowAddSupplementModal(false)}
                className="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplement} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-[#1f1a1c] block mb-1">
                  Takviye Adı
                </label>
                <input
                  type="text"
                  placeholder="örn: B12 Vitamini, Demir, Kolajen, İnositol"
                  value={newSuppName}
                  onChange={(e) => setNewSuppName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-pink-50/40 border border-pink-200 focus:outline-hidden focus:ring-2 focus:ring-[#d81b60]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#1f1a1c] block mb-1">
                    Doz / Miktar
                  </label>
                  <input
                    type="text"
                    placeholder="örn: 1 Tablet, 500 mg"
                    value={newSuppDose}
                    onChange={(e) => setNewSuppDose(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-pink-50/40 border border-pink-200 focus:outline-hidden focus:ring-2 focus:ring-[#d81b60]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1f1a1c] block mb-1">
                    Saat
                  </label>
                  <input
                    type="time"
                    value={newSuppTime}
                    onChange={(e) => setNewSuppTime(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-pink-50/40 border border-pink-200 focus:outline-hidden focus:ring-2 focus:ring-[#d81b60]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-pink-50/50 border border-pink-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#d81b60]" />
                  <span className="text-xs font-bold text-[#1f1a1c]">Günlük Hatırlatıcı Aç</span>
                </div>
                <input
                  type="checkbox"
                  checked={newSuppReminder}
                  onChange={(e) => setNewSuppReminder(e.target.checked)}
                  className="w-4 h-4 accent-[#d81b60] rounded cursor-pointer"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSupplementModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#b0004a] to-[#d81b60] text-white text-xs font-bold shadow-md cursor-pointer hover:brightness-105 active:scale-98"
                >
                  Takviyeyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AVATAR FOTOĞRAFI DEĞİŞTİR */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-pink-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-pink-50 pb-2.5">
              <div className="flex items-center gap-2">
                <FloraLogo size="sm" />
                <h3 className="font-extrabold text-sm text-[#1f1a1c]">
                  Profil Fotoğrafını Güncelle
                </h3>
              </div>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-[#d81b60] to-rose-400 shadow-lg">
                <img
                  src={currentAvatar}
                  alt="Önizleme"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-xs font-bold text-[#1f1a1c] mt-2">{profile.name}</span>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#b0004a] to-[#d81b60] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Cihazdan Fotoğraf Seç & Yükle</span>
            </button>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#805062] block">
                Veya Hazır Avatarlardan Seç:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {presetAvatars.map((av) => (
                  <button
                    key={av.id}
                    onClick={() => {
                      soundEngine.playDropletSound();
                      onUpdateProfile({ avatarUrl: av.url });
                      setShowAvatarModal(false);
                      showToast('Avatar Seçildi', `${av.label} profil fotoğrafınız oldu.`, 'success');
                    }}
                    className="p-1 rounded-2xl border border-pink-100 hover:border-[#d81b60] transition-all cursor-pointer flex flex-col items-center gap-1 group"
                  >
                    <img
                      src={av.url}
                      alt={av.label}
                      className="w-12 h-12 rounded-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="text-[9px] font-semibold text-[#805062] truncate w-full text-center">
                      {av.label.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowAvatarModal(false)}
              className="w-full py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* MODAL: MELATONİN & UYKU SAATİ */}
      {showSleepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-pink-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-pink-50 pb-2.5">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-sm text-[#1f1a1c]">
                  Sessiz Botanik Uyku Saatleri
                </h3>
              </div>
              <button
                onClick={() => setShowSleepModal(false)}
                className="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSleep} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-pink-50/40 border border-pink-100">
                  <label className="text-[11px] font-bold text-[#805062] block mb-1">
                    Yatış Saati
                  </label>
                  <input
                    type="time"
                    value={bedtime}
                    onChange={(e) => setBedtime(e.target.value)}
                    required
                    className="w-full text-sm font-black text-[#1f1a1c] bg-transparent focus:outline-hidden"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-pink-50/40 border border-pink-100">
                  <label className="text-[11px] font-bold text-[#805062] block mb-1">
                    Uyanış Saati
                  </label>
                  <input
                    type="time"
                    value={waketime}
                    onChange={(e) => setWaketime(e.target.value)}
                    required
                    className="w-full text-sm font-black text-[#1f1a1c] bg-transparent focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSleepModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#b0004a] to-[#d81b60] text-white text-xs font-bold shadow-md cursor-pointer hover:brightness-105 active:scale-98"
                >
                  Saatleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DÖNGÜ PARAMETRELERİ */}
      {showCycleParamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-pink-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-pink-50 pb-2.5">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#d81b60]" />
                <h3 className="font-extrabold text-sm text-[#1f1a1c]">
                  Döngü Parametreleri
                </h3>
              </div>
              <button
                onClick={() => setShowCycleParamModal(false)}
                className="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCycleParams} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#1f1a1c]">
                    Döngü Uzunluğu: <span className="text-[#b0004a]">{editCycleLen} Gün</span>
                  </label>
                  <span className="text-[10px] text-[#805062] font-semibold">21 - 45 Gün</span>
                </div>
                <input
                  type="range"
                  min="21"
                  max="45"
                  value={editCycleLen}
                  onChange={(e) => setEditCycleLen(parseInt(e.target.value))}
                  className="w-full accent-[#d81b60]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#1f1a1c]">
                    Regl Kanama Süresi: <span className="text-[#b0004a]">{editPeriodLen} Gün</span>
                  </label>
                  <span className="text-[10px] text-[#805062] font-semibold">2 - 10 Gün</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={editPeriodLen}
                  onChange={(e) => setEditPeriodLen(parseInt(e.target.value))}
                  className="w-full accent-[#d81b60]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCycleParamModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#b0004a] to-[#d81b60] text-white text-xs font-bold shadow-md cursor-pointer hover:brightness-105 active:scale-98"
                >
                  Parametreleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: YARDIM & REHBER */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 border border-pink-100 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-pink-50 pb-2.5">
              <div className="flex items-center gap-2">
                <FloraLogo size="sm" />
                <h3 className="font-extrabold text-sm text-[#1f1a1c]">
                  Yardım & Klinik Danışma Rehberi
                </h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-[#5a4044]">
              <div className="p-3 rounded-2xl bg-pink-50/50 border border-pink-100">
                <h5 className="font-bold text-[#b0004a] mb-1">🌸 Zirve Doğurganlık Nasıl Hesaplanır?</h5>
                <p>
                  Flora algoritması, ovülasyon gününü ve luteal stabiliteyi birleştirerek en yüksek gebe kalma şansına sahip pencereleri (%88 tepe) belirler.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-pink-50/50 border border-pink-100">
                <h5 className="font-bold text-[#b0004a] mb-1">🕊️ Öfke ve PMS Öncesi Yatıştırma Nedir?</h5>
                <p>
                  Progesteron düşüşü öncesinde sistemimiz size 4-7-8 nefesi ve melisa çayı tavsiyeleri göndererek gerginliği biyolojik olarak önlemenize yardımcı olur.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-pink-50/50 border border-pink-100">
                <h5 className="font-bold text-[#b0004a] mb-1">🔒 Verilerim Nerede Saklanıyor?</h5>
                <p>
                  Sağlık verileriniz AES-256 şifrelemeyle sadece cihazınızın yerel depolama kasasında tutulur. Asla sunucuya gönderilmez.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#b0004a] to-[#d81b60] text-white text-xs font-bold cursor-pointer"
            >
              Tamam
            </button>
          </div>
        </div>
      )}

      {/* MODAL: ÇIKIŞ YAP */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-pink-100 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-[#b0004a] flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="text-base font-black text-[#1f1a1c]">Güvenli Çıkış Yapılsın mı?</h3>
            <p className="text-xs text-[#805062] leading-relaxed">
              Oturumunuz kapatılacak ve şifreli biyometrik kasanız kilitlenecektir.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                onClick={() => {
                  soundEngine.playDropletSound();
                  setShowLogoutModal(false);
                  showToast('Güvenli Çıkış Yapıldı', 'Kasa başarıyla kilitlendi.', 'info');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#b0004a] text-white text-xs font-bold shadow-md cursor-pointer hover:bg-[#d81b60]"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
