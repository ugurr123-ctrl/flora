import React, { useState } from 'react';
import { X, Check, Smile, Heart, Flame, Sparkles, Activity } from 'lucide-react';
import { DayInfo } from '../types';
import { FloraLogo } from './FloraLogo';
import { soundEngine } from '../utils/audio';

interface SymptomModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayInfo: DayInfo;
  onSave: (updated: Partial<DayInfo>) => void;
}

export const SymptomModal: React.FC<SymptomModalProps> = ({
  isOpen,
  onClose,
  dayInfo,
  onSave,
}) => {
  if (!isOpen) return null;

  const [flow, setFlow] = useState<DayInfo['flow']>(dayInfo.flow || 'Yok');
  const [mood, setMood] = useState(dayInfo.mood || 'Mutlu');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(dayInfo.symptoms || []);
  const [libido, setLibido] = useState<DayInfo['libido']>(dayInfo.libido || 'Yüksek');
  const [energyLevel, setEnergyLevel] = useState<'Düşük' | 'Dengeli' | 'Zirve'>(
    dayInfo.mood?.includes('Canlı') || dayInfo.mood?.includes('Enerjik') ? 'Zirve' : 'Dengeli'
  );

  const symptomsList = [
    'Hafif Kramp',
    'Göğüs Hassasiyeti',
    'Karında Şişkinlik',
    'Baş Ağrısı',
    'Ciltte Parlama / Akne',
    'Bel Ağrısı',
    'Aşerme (Tatlı)',
    'Uykusuzluk',
  ];

  const moodList = [
    { label: 'Mutlu', icon: '🌸' },
    { label: 'Enerjik', icon: '⚡' },
    { label: 'Sakin', icon: '🕊️' },
    { label: 'Hassas', icon: '🥺' },
    { label: 'Yorgun', icon: '😴' },
    { label: 'Sinirli', icon: '🌩️' },
  ];

  const toggleSymptom = (sym: string) => {
    soundEngine.playDropletSound();
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleSave = () => {
    soundEngine.playCrystalChime();
    onSave({
      flow,
      mood: energyLevel === 'Zirve' ? `${mood} (Zirve Enerji)` : mood,
      symptoms: selectedSymptoms,
      libido,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-pink-100">
        {/* Header */}
        <div className="p-4 px-5 border-b border-[#f6ebed] flex items-center justify-between bg-gradient-to-r from-pink-50/50 to-rose-50/30">
          <div className="flex items-center gap-2.5">
            <FloraLogo size="sm" />
            <div>
              <h3 className="font-extrabold text-base text-[#1f1a1c] flex items-center gap-1.5">
                Günlük Belirti & Ruh Hali
              </h3>
              <p className="text-xs text-[#805062] font-medium">
                {dayInfo.date} • Döngü {dayInfo.cycleDay}. Gün
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-black shadow-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Flow Level */}
          <div>
            <label className="text-xs font-bold text-[#1f1a1c] mb-2 block">Kanama Yoğunluğu</label>
            <div className="grid grid-cols-4 gap-2">
              {(['Yok', 'Hafif', 'Normal', 'Yoğun'] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setFlow(item)}
                  className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    flow === item
                      ? 'bg-[#d81b60] text-white border-[#d81b60] shadow-sm scale-102'
                      : 'bg-[#fff8f8] text-[#5a4044] border-[#f0e6e8] hover:bg-[#ffd9de]/30'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#1f1a1c]">Ruh Hali</label>
              <span className="text-[10px] text-[#b0004a] font-bold">Öneriler buna göre ayarlanır</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {moodList.map((m) => (
                <button
                  key={m.label}
                  onClick={() => {
                    soundEngine.playDropletSound();
                    setMood(m.label);
                  }}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    mood === m.label
                      ? 'bg-[#ffd9de] text-[#b0004a] border-[#d81b60] font-bold'
                      : 'bg-white text-[#5a4044] border-gray-100 hover:bg-pink-50/40'
                  }`}
                >
                  <span className="text-base">{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {mood === 'Sinirli' && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center gap-2 animate-in fade-in">
                <span>🕊️</span>
                <span className="text-[11px] leading-snug">
                  Öfke ve gerginlik için 4-7-8 yatıştırıcı nefes ve melisa çayı molası ana ekrana eklendi.
                </span>
              </div>
            )}
            {mood === 'Hassas' && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center gap-2 animate-in fade-in">
                <span>🌸</span>
                <span className="text-[11px] leading-snug">
                  Duygusal esenlik ve şefkatli öz-bakım alanı hazırlandı.
                </span>
              </div>
            )}
          </div>

          {/* Physical Symptoms */}
          <div>
            <label className="text-xs font-bold text-[#1f1a1c] mb-2 block">Fiziksel Belirtiler</label>
            <div className="flex flex-wrap gap-1.5">
              {symptomsList.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    onClick={() => toggleSymptom(sym)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-[#b0004a] text-white shadow-xs font-semibold'
                        : 'bg-[#f6ebed] text-[#805062] hover:bg-[#ffd9de]/60'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Enerji & Vitalite Seviyesi (replaces cervical mucus) */}
          <div>
            <label className="text-xs font-bold text-[#1f1a1c] mb-2 flex items-center justify-between">
              <span>Enerji & Biyo-Vitalite Seviyesi</span>
              <span className="text-[#b0004a] font-black">{energyLevel}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Düşük', 'Dengeli', 'Zirve'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setEnergyLevel(lvl)}
                  className={`py-2 px-1 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    energyLevel === lvl
                      ? 'bg-gradient-to-r from-amber-400 to-[#d81b60] text-white border-transparent shadow-sm'
                      : 'bg-white text-gray-700 border-gray-100 hover:bg-amber-50/30'
                  }`}
                >
                  {lvl === 'Düşük' ? '🌙 Dinlenme' : lvl === 'Dengeli' ? '🌱 Dengeli' : '⚡ %85 Zirve'}
                </button>
              ))}
            </div>
          </div>

          {/* Libido */}
          <div>
            <label className="text-xs font-bold text-[#1f1a1c] mb-2 block">Cinsel İstek (Libido)</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Düşük', 'Normal', 'Yüksek'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLibido(l)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    libido === l
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent'
                      : 'bg-white text-gray-700 border-gray-100 hover:bg-rose-50/30'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#f6ebed] bg-gray-50 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#b0004a] to-[#d81b60] text-white text-xs font-bold shadow-md hover:brightness-105 active:scale-98 transition-all cursor-pointer"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};
