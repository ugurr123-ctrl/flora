import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar as CalendarIcon,
  PlusCircle,
  Thermometer,
  Heart,
  Droplet,
  Flame,
  CheckCircle2,
  Activity,
  ArrowRight,
  Moon,
  Wind,
  Coffee
} from 'lucide-react';
import { DayInfo, CyclePhase } from '../types';
import { FloraLogo } from './FloraLogo';
import { soundEngine } from '../utils/audio';
import { triggerRosePollenBurst } from '../utils/confetti';
import { calculateConceptionProbability, getFollicularPhaseGuidance } from '../utils/cycleIntelligence';

interface CycleTabProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  onOpenSymptomModal: () => void;
  dayDataMap: Record<number, DayInfo>;
  cycleLength?: number;
}

export const CycleTab: React.FC<CycleTabProps> = ({
  selectedDay,
  onSelectDay,
  onOpenSymptomModal,
  dayDataMap,
  cycleLength = 28,
}) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(1);

  // April 2025 calendar days: 1 April was Tuesday (offset 1 in Mon-start week)
  const aprilDays = Array.from({ length: 30 }, (_, i) => i + 1);

  const getPhaseForAprilDay = (day: number): { phase: CyclePhase; label: string } => {
    if (day >= 1 && day <= 5) return { phase: 'regl', label: 'Regl Kanaması' };
    if (day >= 6 && day <= 11) return { phase: 'folikuler', label: 'Foliküler Faz (Östrojen Artışı)' };
    if (day >= 12 && day <= 15) {
      if (day === 14) return { phase: 'ovulasyon', label: 'Zirve Ovülasyon (En Yüksek)' };
      return { phase: 'ovulasyon', label: 'Doğurgan Pencere' };
    }
    if (day >= 16 && day <= 23) return { phase: 'luteal', label: 'Luteal Faz (Progesteron)' };
    if (day >= 24 && day <= 28) return { phase: 'pms', label: 'PMS & Adet Öncesi Dönem' };
    return { phase: 'regl', label: 'Gelecek Regl Başlangıcı' };
  };

  const handleDayClick = (day: number, e: React.MouseEvent) => {
    soundEngine.playDropletSound();
    onSelectDay(day);
    if (day === 14) {
      triggerRosePollenBurst(e.clientX, e.clientY);
    }
  };

  // Scientific conception probability for the selected day
  const selectedConception = calculateConceptionProbability(selectedDay, cycleLength);

  const currentSelectedInfo = dayDataMap[selectedDay] || {
    date: `2025-04-${String(selectedDay).padStart(2, '0')}`,
    dayNumber: selectedDay,
    dayName: 'Nisan',
    cycleDay: selectedDay,
    phase: getPhaseForAprilDay(selectedDay).phase,
    isToday: selectedDay === 14,
    bbt: selectedDay >= 14 ? 36.8 : 36.4,
    heartRate: selectedDay === 14 ? 72 : 68,
    libido: selectedDay === 14 ? 'Yüksek' : 'Normal',
    flow: selectedDay <= 5 ? 'Normal' : 'Yok',
    symptoms: selectedDay === 14 ? ['Hafif Kramp', 'Yüksek Enerji'] : [],
    mood: selectedDay === 14 ? 'Canlı & Pozitif' : 'Sakin',
  };

  const selectedPhaseMeta = getPhaseForAprilDay(selectedDay);

  return (
    <div className="space-y-4 pb-28 pt-2 select-none text-[#1f1a1c]">
      {/* Sub-Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FloraLogo size="md" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#805062] uppercase tracking-wider block">
                Flora Cycle
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-pink-100 text-[#b0004a] font-bold">
                Biyo-Takvim
              </span>
            </div>
            <h2 className="text-xl font-black text-[#1f1a1c] tracking-tight">
              Nisan & Mayıs 2025
            </h2>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playDropletSound();
            onSelectDay(14);
          }}
          className="px-3.5 py-1.5 rounded-full bg-pink-100 text-[#b0004a] text-xs font-black hover:bg-pink-200 transition-all shadow-xs cursor-pointer"
        >
          Bugün
        </button>
      </div>

      {/* Legend Pills */}
      <div className="p-2.5 rounded-2xl bg-white border border-pink-100 shadow-xs flex items-center justify-between text-[11px] font-bold text-[#805062] overflow-x-auto no-scrollbar gap-2">
        <span className="flex items-center gap-1 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d81b60]" /> Regl (1-5 Nis) 🌺
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Foliküler (6-11 Nis) 🌱
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-300" /> Doğurgan (12-15 Nis) ✨
        </span>
        <span className="flex items-center gap-1 shrink-0 text-amber-700 font-extrabold">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> PMS (24-28 Nis) 🕊️
        </span>
      </div>

      {/* CLAY CALENDAR GRID */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-pink-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#1f1a1c] flex items-center gap-1">
            <CalendarIcon className="w-4 h-4 text-[#d81b60]" />
            Nisan 2025
          </span>
          <span className="text-xs font-black text-[#b0004a] bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
            Zirve: 14 Nisan (%88 Şans)
          </span>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center py-1 border-y border-pink-50">
          {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map((dw) => (
            <span key={dw} className="text-xs font-bold text-[#805062]">
              {dw}
            </span>
          ))}
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 gap-1.5 py-1">
          {/* April 1 is Tuesday -> 1 empty cell */}
          <div className="h-10" />

          {aprilDays.map((day) => {
            const isSelected = selectedDay === day;
            const isToday = day === 14;
            const { phase } = getPhaseForAprilDay(day);

            let bgClass = 'bg-[#fff8f8] text-[#1f1a1c]';
            let dotColor = '';

            if (phase === 'regl') {
              bgClass = 'bg-rose-100/70 text-rose-900 border border-rose-200/50';
              dotColor = 'bg-[#d81b60]';
            } else if (phase === 'folikuler') {
              bgClass = 'bg-emerald-50/50 text-[#1f1a1c] border border-emerald-100/60';
              dotColor = 'bg-emerald-400';
            } else if (phase === 'ovulasyon') {
              if (day === 14) {
                bgClass = 'bg-gradient-to-tr from-[#b0004a] to-[#d81b60] text-white shadow-[0_4px_14px_rgba(216,27,96,0.38)] scale-108 font-black ring-2 ring-white z-10';
                dotColor = 'bg-white animate-ping';
              } else {
                bgClass = 'bg-[#ffd9de] text-[#b0004a] font-bold border border-pink-200';
                dotColor = 'bg-[#d81b60]';
              }
            } else if (phase === 'luteal') {
              bgClass = 'bg-pink-50/40 text-[#805062]';
              dotColor = 'bg-pink-300';
            } else if (phase === 'pms') {
              bgClass = 'bg-amber-50 text-amber-900 border border-amber-200/50';
              dotColor = 'bg-amber-400';
            }

            return (
              <button
                key={day}
                onClick={(e) => handleDayClick(day, e)}
                className={`h-11 rounded-2xl flex flex-col items-center justify-center relative transition-all cursor-pointer ${bgClass} ${
                  isSelected && day !== 14
                    ? 'ring-2 ring-[#b0004a] scale-106 font-black bg-white shadow-sm'
                    : ''
                }`}
              >
                <span className={`text-xs ${isSelected ? 'font-black' : 'font-bold'}`}>
                  {day}
                </span>
                {dotColor && <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${dotColor}`} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED DAY DETAIL CARD WITH ACCURATE GEBE KALMA İHTİMALİ */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-pink-100 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-[#1f1a1c]">
                {selectedDay} Nisan
              </span>
              {selectedDay === 14 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                  Bugün
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-[#b0004a] mt-0.5">
              Döngü Günü {selectedDay} • 🌿 {selectedPhaseMeta.label}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[#805062] block font-semibold">Gebe Kalma İhtimali</span>
            <span className="text-sm font-black text-[#b0004a]">{selectedConception.label}</span>
          </div>
        </div>

        {/* Phase-specific biological guidance */}
        {selectedDay >= 24 ? (
          /* PMS & Pre-anger soothing banner */
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200/70 space-y-1">
            <span className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
              <span>🕊️</span> Adet Öncesi Şefkat & Öfke Yatıştırma
            </span>
            <p className="text-[11px] text-[#5a4044] leading-relaxed">
              Progesteron düşüşü nedeniyle gerginlik veya öfke hissi olağandır. 4-7-8 nefes egzersizi yapın, melisa çayı için ve kendinize dinlenme alanı açın.
            </p>
          </div>
        ) : selectedDay >= 6 && selectedDay <= 11 ? (
          /* Follicular phase guidance */
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/70 space-y-1">
            <span className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
              <span>🌱</span> Foliküler Faz: Östrojen Yükseliyor
            </span>
            <p className="text-[11px] text-[#5a4044] leading-relaxed">
              Yumurta folikülü gelişirken enerji, zihinsel odak ve motivasyon artar. Yeni projelere başlamak ve dinamik sporlar için en verimli evre.
            </p>
          </div>
        ) : (
          /* Conception explanation */
          <div className="p-3 rounded-2xl bg-pink-50/60 border border-pink-100 text-[11px] text-[#5a4044] leading-relaxed">
            {selectedConception.explanation}
          </div>
        )}

        {/* 3 Biometrics Mini Chips */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-2xl bg-pink-50/40 border border-pink-100 flex flex-col">
            <span className="text-[10px] font-bold text-[#805062] flex items-center gap-1">
              <Moon className="w-3 h-3 text-indigo-500" /> Uyku
            </span>
            <span className="text-xs font-black text-[#1f1a1c] mt-0.5 truncate">
              7s 40dk
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-pink-50/40 border border-pink-100 flex flex-col">
            <span className="text-[10px] font-bold text-[#805062] flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-rose-500" /> BBT
            </span>
            <span className="text-xs font-black text-[#1f1a1c] mt-0.5">
              {currentSelectedInfo.bbt || 36.8}°C
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-pink-50/40 border border-pink-100 flex flex-col">
            <span className="text-[10px] font-bold text-[#805062] flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" /> Enerji
            </span>
            <span className="text-xs font-black text-[#1f1a1c] mt-0.5">
              {selectedDay >= 12 && selectedDay <= 15 ? 'Zirve (%85)' : selectedDay >= 6 && selectedDay <= 11 ? 'Yükselişte (%75)' : 'Dengeli (%65)'}
            </span>
          </div>
        </div>

        {/* Button to add symptom for this day */}
        <button
          onClick={onOpenSymptomModal}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#b0004a] to-[#d81b60] text-white text-xs font-bold shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Bu Güne Belirti veya Not Ekle ✨</span>
        </button>
      </div>

      {/* SMART CYCLE FORECAST ENGINE */}
      <div className="rounded-3xl bg-gradient-to-br from-[#4a152e] to-[#2d0b1a] text-white p-5 shadow-xl space-y-3.5 border border-rose-950/40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center text-rose-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white">
              Akıllı Döngü Tahmin Motoru
            </h4>
            <p className="text-[11px] text-rose-200/70">
              Flora AI algoritmalarıyla hesaplanan evreler
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {/* Gelecek Regl */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-rose-100">Gelecek Regl</p>
              <p className="text-[11px] text-rose-300">29 Nisan Salı • 15 Gün Kaldı</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#d81b60] text-white text-[10px] font-black shadow-xs">
              %94 Güven
            </span>
          </div>

          {/* PMS Başlangıcı */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-rose-100">PMS & Öfke Öncesi Yatıştırma</p>
              <p className="text-[11px] text-rose-300">24 Nisan • Şefkatli Bildirimler & Melisa</p>
            </div>
            <span className="text-xs font-bold text-amber-300">Şefkat Modu</span>
          </div>

          {/* Sonraki Ovülasyon */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-rose-100">Sonraki Yumurtlama Zirvesi</p>
              <p className="text-[11px] text-rose-300">12 Mayıs Pazartesi</p>
            </div>
            <span className="text-xs font-bold text-emerald-300">%88 Zirve Şans</span>
          </div>
        </div>
      </div>
    </div>
  );
};
