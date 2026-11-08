import React, { useState } from 'react';
import { Bell, X, Check, Settings, Volume2, Shield } from 'lucide-react';
import { FloraLogo } from './FloraLogo';
import { TabType } from '../types';
import { soundEngine } from '../utils/audio';

interface HeaderProps {
  currentCycleDay: number;
  currentPhaseName: string;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  waterRemaining: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentCycleDay,
  currentPhaseName,
  setActiveTab,
  waterRemaining,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  // Incoming Notifications List
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: '🕊️ Adet & Öfke Öncesi Rahatlatıcı Fısıltı',
      time: 'Şimdi',
      desc: 'Progesteron düşüşü öfke ve hassasiyeti tetikleyebilir. Bedenini suçlama; 4-7-8 nefesi alıp bir fincan melisa çayı hazırla.',
      read: false,
      type: 'pms_calm',
    },
    {
      id: '2',
      title: '🌱 Foliküler Faz & Canlılık Uyarısı',
      time: '15 dk önce',
      desc: 'Östrojen seviyen yükseliyor! Zihinsel berraklık, üretkenlik ve dinamik egzersiz için haftanın en verimli evresindesin.',
      read: false,
      type: 'follicular',
    },
    {
      id: '3',
      title: '✨ Gebe Kalma İhtimali Zirvede',
      time: '45 dk önce',
      desc: 'Bugün döngünün 14. günü. Ovülasyon gerçekleşti; gebe kalma şansı %88 ile doruk noktasında.',
      read: false,
      type: 'ovulation',
    },
    {
      id: '4',
      title: 'Akıllı Hidrasyon Hatırlatıcısı',
      time: '1 saat önce',
      desc: `Günlük 2.5 L hedefinize ulaşmak için ${waterRemaining} ml daha canlı su tüketebilirsiniz.`,
      read: true,
      type: 'water',
    },
    {
      id: '5',
      title: 'Günlük Takviye Zamanı',
      time: '09:00 Sabah',
      desc: 'Folik Asit & D3 Vitamini takviyenizi almayı unutmayın.',
      read: true,
      type: 'supplement',
    },
  ]);

  const markAllAsRead = () => {
    soundEngine.playDropletSound();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#fff8f8]/95 backdrop-blur-md border-b border-[#f6ebed] transition-all">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* Left: Authentic 3D Lotus Logo & Clean Title (No "Gün 14" badge) */}
        <div className="flex items-center gap-2.5">
          <FloraLogo size="md" />
          <div className="flex flex-col select-none">
            <h1 className="font-black text-base tracking-tight text-[#1f1a1c] leading-tight">
              Flora <span className="text-[#d81b60]">Cycle</span>
            </h1>
            <span className="text-[11px] font-semibold text-[#805062] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {currentPhaseName}
            </span>
          </div>
        </div>

        {/* Right: Actions (Notification Bell & Settings Icon - Profile avatar & Onboarding removed) */}
        <div className="flex items-center gap-2">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                soundEngine.playDropletSound();
                setShowNotifications(!showNotifications);
              }}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#805062] hover:text-[#b0004a] hover:bg-pink-50 active:scale-95 transition-all relative cursor-pointer border border-pink-100 shadow-xs"
              aria-label="Bildirimler"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#d81b60] text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Settings Icon Button (Replaces profile picture button) */}
          <button
            onClick={() => {
              soundEngine.playDropletSound();
              setActiveTab('profil');
            }}
            title="Ayarlar & Bildirim Tercihleri"
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#805062] hover:text-[#b0004a] hover:bg-pink-50 active:rotate-45 transition-all cursor-pointer border border-pink-100 shadow-xs"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* FULL RESPONSIVE NOTIFICATIONS PANEL */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-3 pt-16 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 via-rose-50/50 to-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FloraLogo size="sm" />
                <div>
                  <h3 className="font-black text-sm text-[#1f1a1c]">Gelen Bildirimler</h3>
                  <p className="text-[10px] text-[#805062] font-semibold">Flora Biyolojik Uyarı Merkezi</p>
                </div>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-black cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="p-3.5 overflow-y-auto space-y-2.5 flex-1">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-[#805062]">Son Güncellemeler ({unreadCount} Okunmamış)</span>
                {unreadCount > 0 ? (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-bold text-[#d81b60] hover:underline cursor-pointer"
                  >
                    Tümünü Okundu Say
                  </button>
                ) : (
                  <span className="text-[10px] text-gray-400">Hepsi okundu ✓</span>
                )}
              </div>

              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl transition-all border ${
                    item.read
                      ? 'bg-[#fff8f8] border-pink-50'
                      : 'bg-gradient-to-r from-pink-50/90 to-rose-50/70 border-pink-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-white shadow-xs flex items-center justify-center shrink-0 mt-0.5 text-base">
                      {item.type === 'pms_calm' ? '🕊️' : item.type === 'follicular' ? '🌱' : item.type === 'ovulation' ? '🌸' : item.type === 'water' ? '💧' : '💊'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#1f1a1c] truncate">{item.title}</p>
                        <span className="text-[10px] text-gray-400 shrink-0">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-[#5a4044] mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-pink-100 bg-[#fff8f8] flex items-center justify-between">
              <button
                onClick={() => {
                  setShowNotifications(false);
                  setActiveTab('profil');
                }}
                className="text-[11px] font-bold text-[#b0004a] hover:underline cursor-pointer"
              >
                ⚙ Bildirim Tercihlerini Düzenle
              </button>
              <button
                onClick={() => setShowNotifications(false)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#b0004a] hover:bg-[#d81b60] rounded-full shadow-xs cursor-pointer transition-all"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
