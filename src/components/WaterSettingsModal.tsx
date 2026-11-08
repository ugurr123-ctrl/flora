import React from 'react';
import { X, Clock, Droplet, ShieldCheck, Moon } from 'lucide-react';
import { FloraLogo } from './FloraLogo';
import { soundEngine } from '../utils/audio';

interface WaterSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoResetAtMidnight: boolean;
  onToggleAutoReset: (val: boolean) => void;
  waterGoalMl: number;
}

export const WaterSettingsModal: React.FC<WaterSettingsModalProps> = ({
  isOpen,
  onClose,
  autoResetAtMidnight,
  onToggleAutoReset,
  waterGoalMl,
}) => {
  if (!isOpen) return null;

  const handleToggle = () => {
    soundEngine.playDropletSound();
    onToggleAutoReset(!autoResetAtMidnight);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-100 flex flex-col">
        {/* Header */}
        <div className="p-4 px-5 border-b border-[#f6ebed] flex items-center justify-between bg-gradient-to-r from-blue-50 to-pink-50">
          <div className="flex items-center gap-2.5">
            <FloraLogo size="sm" />
            <div>
              <h3 className="font-extrabold text-sm text-[#1f1a1c]">00:00 Gece Sıfırlama</h3>
              <p className="text-[11px] text-[#805062]">Flora Akıllı Hidrasyon</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer shadow-xs"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-gray-700">
          {/* Main 3D Toggle */}
          <div className="p-3.5 rounded-2xl bg-[#fcf1f3] border border-[#ffd9de] flex items-center justify-between">
            <div>
              <p className="font-extrabold text-xs text-[#1f1a1c]">Gece Otomatik Sıfırla</p>
              <p className="text-[11px] text-[#805062] mt-0.5">
                Her gece 00:00'da su sayacı sıfırlanır ve geçmişe arşivlenir.
              </p>
            </div>

            {/* 3D Tactile Switch */}
            <div
              onClick={handleToggle}
              className={`w-12 h-7 rounded-full p-0.5 cursor-pointer transition-colors duration-200 flex items-center shrink-0 ${
                autoResetAtMidnight ? 'toggle-track-active' : 'toggle-track-inactive'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform duration-200 ${
                  autoResetAtMidnight ? 'toggle-thumb-active' : 'toggle-thumb-inactive'
                }`}
              />
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#1f1a1c]">Doğru Biyo-Ritm İstatistikleri</p>
                <p className="text-[11px] text-[#805062]">
                  Dün içilen su miktarını otomatik olarak 6 aylık sağlık kartınıza kaydeder.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Moon className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#1f1a1c]">Uyku Koruması ile Uyumlu</p>
                <p className="text-[11px] text-[#805062]">
                  22:30 - 08:30 sessiz saatlerinde bildirim göndermez, uykunuzu bölmeden sessizce sıfırlanır.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Droplet className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#1f1a1c]">Mevcut Hedef: {waterGoalMl} ml</p>
                <p className="text-[11px] text-[#805062]">
                  Günlük hedefinizi Profil sekmesindeki 3D Organik Sıvı Kaydırıcısından dilediğiniz zaman değiştirebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#b0004a] to-[#d81b60] text-white text-xs font-bold shadow-sm hover:brightness-105 active:scale-98 transition-all cursor-pointer"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
