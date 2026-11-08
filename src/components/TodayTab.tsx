import React, { useState, useRef, useEffect } from 'react';
import {
  Droplet,
  Plus,
  RotateCcw,
  Sparkles,
  Thermometer,
  Moon,
  Zap,
  Clock,
  CheckCircle2,
  Heart,
  ChevronRight,
  ChevronLeft,
  Check,
  CalendarDays,
  Bell,
  Trash2,
  X,
  Volume2,
  Wind,
  ShieldAlert,
  Smile,
  Leaf,
  Coffee,
  Play,
  Square
} from 'lucide-react';
import { DayInfo, SupplementItem } from '../types';
import { soundEngine } from '../utils/audio';
import { triggerRosePollenBurst } from '../utils/confetti';
import { calculateConceptionProbability, getMoodComfortAdvice, getFollicularPhaseGuidance } from '../utils/cycleIntelligence';

interface TodayTabProps {
  currentDayInfo: DayInfo;
  waterCurrentMl: number;
  waterGoalMl: number;
  onAddWater: (amount: number) => void;
  onResetWater: () => void;
  autoResetAtMidnight: boolean;
  onOpenWaterSettings: () => void;
  onOpenSymptomModal: () => void;
  onSelectDay: (day: number) => void;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'water') => void;
  cycleLength?: number;
  onUpdateMood?: (mood: string) => void;
  supplements: SupplementItem[];
  onToggleSupplement: (id: string) => void;
}

export const TodayTab: React.FC<TodayTabProps> = ({
  currentDayInfo,
  waterCurrentMl,
  waterGoalMl,
  onAddWater,
  onResetWater,
  autoResetAtMidnight,
  onOpenWaterSettings,
  onOpenSymptomModal,
  onSelectDay,
  showToast,
  cycleLength = 28,
  onUpdateMood,
  supplements,
  onToggleSupplement,
}) => {
  // Favorite state
  const [isFavorite, setIsFavorite] = useState(false);
  const [showRecapBanner, setShowRecapBanner] = useState(true);

  // Active Mood State
  const activeMood = currentDayInfo.mood || 'Canlı & Pozitif';

  // Breathing Exercise State (4-7-8 calming technique)
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Nefes Al (4s)' | 'Tut (7s)' | 'Yavaşça Ver (8s)'>('Nefes Al (4s)');
  const [breathTimer, setBreathTimer] = useState(4);

  // Long press reset state
  const [pressProgress, setPressProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const [isPoofing, setIsPoofing] = useState(false);
  const pressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic Date calculation
  const now = new Date();
  const todayFormatted = now.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
  });
  const todayWeekday = now.toLocaleDateString('tr-TR', {
    weekday: 'long',
  });
  const currentMonthYear = now.toLocaleDateString('tr-TR', {
    month: 'long',
    year: 'numeric',
  });

  // Dynamic conception probability calculation
  const conceptionInfo = calculateConceptionProbability(currentDayInfo.cycleDay, cycleLength);

  // Dynamic Mood & PMS Pre-anger comfort advice
  const moodAdvice = getMoodComfortAdvice(activeMood, currentDayInfo.cycleDay, cycleLength);

  // Follicular phase guidance
  const follicularGuidance = getFollicularPhaseGuidance(currentDayInfo.cycleDay);
  const isFollicularPhase = currentDayInfo.cycleDay >= 6 && currentDayInfo.cycleDay <= 12;

  // Breathing cycle timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            // Transition phase
            if (breathPhase.startsWith('Nefes Al')) {
              setBreathPhase('Tut (7s)');
              return 7;
            } else if (breathPhase.startsWith('Tut')) {
              setBreathPhase('Yavaşça Ver (8s)');
              return 8;
            } else {
              setBreathPhase('Nefes Al (4s)');
              soundEngine.playCrystalChime();
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathPhase('Nefes Al (4s)');
      setBreathTimer(4);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathingActive, breathPhase]);

  const handleToggleDailySupplement = (id: string) => {
    soundEngine.playDropletSound();
    triggerRosePollenBurst();
    onToggleSupplement(id);
  };

  const handleSelectQuickMood = (newMood: string) => {
    soundEngine.playDropletSound();
    if (onUpdateMood) {
      onUpdateMood(newMood);
    }
    triggerRosePollenBurst();
    showToast('Ruh Hali Güncellendi', `Bugünkü ruh hali "${newMood}" olarak ayarlandı. Rahatlatıcı öneriler güncellendi.`, 'success');
  };

  // Mini calendar strip days
  const miniDays = [
    { dayNumber: 12, name: 'Çar', cycleDay: 12, isCurrent: false, phase: 'Yumurtlama Öncesi' },
    { dayNumber: 13, name: 'Per', cycleDay: 13, isCurrent: false, phase: 'Yüksek Doğurganlık' },
    { dayNumber: 14, name: 'Cum', cycleDay: 14, isCurrent: true, phase: 'Ovülasyon Zirvesi' },
    { dayNumber: 15, name: 'Cmt', cycleDay: 15, isCurrent: false, phase: 'Yumurtlama Sonrası' },
    { dayNumber: 16, name: 'Paz', cycleDay: 16, isCurrent: false, phase: 'Luteal Başlangıç' },
  ];

  // Long press handlers for 1.2s tactile water reset
  const startLongPress = () => {
    setIsPressing(true);
    setPressProgress(0);
    const startTime = Date.now();
    const duration = 1200;

    pressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setPressProgress(progress);

      if (progress >= 100) {
        clearInterval(pressIntervalRef.current!);
        setIsPressing(false);
        setIsPoofing(true);
        triggerRosePollenBurst();
        soundEngine.playResetPoofSound();
        onResetWater();
        showToast('Su Tüketimi Sıfırlandı', 'Sayaç 0.00 L olarak güncellendi.', 'water');
        setTimeout(() => {
          setIsPoofing(false);
          setPressProgress(0);
        }, 600);
      }
    }, 20);
  };

  const cancelLongPress = () => {
    if (pressIntervalRef.current) clearInterval(pressIntervalRef.current);
    setIsPressing(false);
    setPressProgress(0);
  };

  const handleQuickAddWater = () => {
    soundEngine.playDropletSound();
    onAddWater(250);
    const newTotal = (Math.min(waterCurrentMl + 250, 4500) / 1000).toFixed(2);
    showToast('+250 ml Eklendi', `Bugünkü toplam: ${newTotal} L`, 'water');
  };

  const waterPercent = Math.min(100, Math.round((waterCurrentMl / waterGoalMl) * 100));

  return (
    <div className="space-y-4 pb-28 pt-2 select-none text-[#1f1a1c]">
      {/* GREETING & PHASE BADGES */}
      <section className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#805062] uppercase tracking-wider block">
              Bugün • {todayFormatted} • {todayWeekday}
            </span>
            <h2 className="text-2xl font-black text-[#1f1a1c] tracking-tight">
              Merhaba Zeynep ✨
            </h2>
          </div>
          <button
            onClick={() => {
              soundEngine.playDropletSound();
              setIsFavorite(!isFavorite);
              showToast(
                isFavorite ? 'Favorilerden Çıkarıldı' : 'Günün Özeti Favorilere Eklendi',
                'Günün biyo-verileri kaydedildi.',
                'info'
              );
            }}
            className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-[#b0004a] active:scale-90 transition-transform cursor-pointer border border-pink-100"
            aria-label="Favori"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#b0004a] text-[#b0004a]' : 'text-[#b0004a]'}`} />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-white text-[#b0004a] text-xs font-bold shadow-xs flex items-center gap-1.5 border border-pink-100">
            <span className="w-2 h-2 rounded-full bg-[#d81b60] animate-ping" />
            Yumurtlama Dönemi (Gün {currentDayInfo.cycleDay})
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-xs flex items-center gap-1 border ${conceptionInfo.tagColor}`}>
            <Zap className="w-3.5 h-3.5 fill-current" />
            Gebe Kalma İhtimali: {conceptionInfo.label}
          </span>
        </div>
      </section>

      {/* RUH HALİ & ÖFKE ÖNCESİ ŞEFKATLİ RAHATLAMA ALANI */}
      <div className={`p-5 rounded-3xl bg-gradient-to-br ${moodAdvice.colorTheme} border shadow-[0_8px_24px_rgba(216,27,96,0.08)] space-y-3.5 transition-all`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-lg shadow-xs ${
              moodAdvice.isHighAlert ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-[#b0004a]'
            }`}>
              {moodAdvice.isHighAlert ? '🕊️' : '🌸'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-sm text-[#1f1a1c]">{moodAdvice.title}</h4>
                <span className={`text-[9.5px] font-black px-2 py-0.2 rounded-full ${
                  moodAdvice.isHighAlert ? 'bg-rose-100 text-rose-800' : 'bg-pink-100 text-[#b0004a]'
                }`}>
                  {moodAdvice.tag}
                </span>
              </div>
              <p className="text-[11px] text-[#805062] font-medium leading-snug mt-0.5">
                {moodAdvice.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Mood Switcher Buttons */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10.5px] font-bold text-[#805062] block">
            Bugünkü Ruh Halinizi Seçin (Öneriler Otomatik Uyarlanır):
          </span>
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { id: 'Canlı & Pozitif', icon: '🥰', label: 'Canlı' },
              { id: 'Sakin', icon: '🕊️', label: 'Sakin' },
              { id: 'Hassas', icon: '🥺', label: 'Hassas' },
              { id: 'Yorgun', icon: '😴', label: 'Yorgun' },
              { id: 'Sinirli', icon: '🌩️', label: 'Öfkeli/Sinirli' },
            ].map((m) => {
              const isCurrent = activeMood.includes(m.label) || activeMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleSelectQuickMood(m.id)}
                  className={`py-2 px-1 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                    isCurrent
                      ? 'bg-gradient-to-b from-[#b0004a] to-[#d81b60] text-white border-transparent shadow-sm scale-105 font-black'
                      : 'bg-white text-[#5a4044] border-pink-100 hover:bg-pink-50 text-[11px]'
                  }`}
                >
                  <span className="text-base">{m.icon}</span>
                  <span className="text-[10px] font-bold truncate w-full">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-7-8 Breathing Calming Mechanism */}
        <div className="p-3.5 rounded-2xl bg-white/90 border border-pink-100/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-[#d81b60]" />
              <span className="text-xs font-bold text-[#1f1a1c]">
                4-7-8 Öfke & Gerginlik Yatıştırıcı Nefes
              </span>
            </div>

            <button
              onClick={() => {
                soundEngine.playDropletSound();
                setIsBreathingActive(!isBreathingActive);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs ${
                isBreathingActive
                  ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                  : 'bg-gradient-to-r from-[#b0004a] to-[#d81b60] text-white hover:brightness-105'
              }`}
            >
              {isBreathingActive ? (
                <>
                  <Square className="w-3 h-3 fill-current" />
                  <span>Durdur</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Nefes Başlat</span>
                </>
              )}
            </button>
          </div>

          {isBreathingActive ? (
            <div className="py-3 flex flex-col items-center justify-center text-center space-y-2 animate-in fade-in">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full bg-pink-300/40 blur-md transition-all duration-1000 ${
                  breathPhase.startsWith('Nefes Al') ? 'scale-125 bg-rose-400/50' : breathPhase.startsWith('Tut') ? 'scale-110 bg-amber-400/50' : 'scale-90 bg-indigo-300/40'
                }`} />
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#b0004a] to-rose-400 text-white flex flex-col items-center justify-center shadow-md relative z-10">
                  <span className="text-xl font-black">{breathTimer}</span>
                  <span className="text-[9px] font-bold uppercase">sn</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-black text-[#b0004a]">{breathPhase}</p>
                <p className="text-[10px] text-[#805062] mt-0.5">
                  Burundan al, göğüste tut, dudaklarını büzerek yavaşça üfle
                </p>
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-[#5a4044] leading-relaxed">
              {moodAdvice.soothingTechnique}
            </p>
          )}
        </div>

        {/* Botanik Çay & Magnezyum Tavsiyesi */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-white/90 border border-pink-100/80 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#b0004a] flex items-center gap-1 mb-0.5">
                <Coffee className="w-3 h-3" /> Botanik Çay Molası
              </span>
              <p className="text-[11px] font-semibold text-[#1f1a1c] leading-tight">
                {moodAdvice.herbalDrink}
              </p>
            </div>
            <span className="text-[9.5px] text-[#805062] mt-1.5 block">Kortizol düşürücü 🌿</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/90 border border-pink-100/80 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-700 flex items-center gap-1 mb-0.5">
                <Zap className="w-3 h-3" /> Biyolojik Denge
              </span>
              <p className="text-[11px] font-semibold text-[#1f1a1c] leading-tight">
                {moodAdvice.nutritionTip}
              </p>
            </div>
            <span className="text-[9.5px] text-[#805062] mt-1.5 block">Serotonin desteği 🧠</span>
          </div>
        </div>

        {/* Günlük Şefkat Olumlaması */}
        <div className="p-2.5 rounded-2xl bg-white/80 border border-pink-100 flex items-center gap-2">
          <span className="text-sm">🕊️</span>
          <p className="text-[11px] italic font-semibold text-[#805062] leading-snug">
            {moodAdvice.affirmation}
          </p>
        </div>
      </div>

      {/* FOLİKÜLER FAZ HATIRLATMASI & REHBERİ (Östrojen yükselişi) */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-50/60 via-teal-50/40 to-pink-50/50 border border-emerald-200/70 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base shadow-xs">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-emerald-950">Foliküler Faz & Enerji Uyarısı</h4>
                <span className="text-[9px] font-extrabold bg-emerald-200/70 text-emerald-900 px-2 py-0.2 rounded-full">
                  Östrojen Artışı
                </span>
              </div>
              <p className="text-[10px] text-emerald-800 font-medium">
                Regl sonrası yumurta folikülünün olgunlaşma ve canlılık evresi
              </p>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1 shadow-xs">
            <span>🌱</span>
            <span>Ayarlarda Takipte</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {follicularGuidance.reminders.slice(0, 2).map((item, idx) => (
            <div key={idx} className="p-2.5 rounded-2xl bg-white/90 border border-emerald-100 shadow-xs space-y-0.5">
              <span className="text-[10.5px] font-extrabold text-emerald-900 flex items-center gap-1">
                <span>{item.icon}</span> {item.title}
              </span>
              <p className="text-[10px] text-[#5a4044] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* HERO 14TH DAY CARD WITH BREATHING CYCLE RING & ACCURATE CONCEPTION RATE */}
      <section className="relative w-full rounded-3xl bg-white p-6 shadow-[0_16px_36px_rgba(216,27,96,0.1)] border border-pink-100/70 flex flex-col items-center text-center overflow-hidden">
        <div className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-[#ffd9de] text-[#b0004a] text-xs font-bold mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#d81b60]" />
          <span>Yumurtlama Günü • {currentDayInfo.cycleDay}. Gün</span>
        </div>

        {/* Meditative Breathing Cycle Ring with Orbiting Particles */}
        <div
          onClick={onOpenSymptomModal}
          className="relative w-48 h-48 flex items-center justify-center my-1 cursor-pointer active:scale-95 transition-transform select-none group"
        >
          {/* Luminous Pulsing Outer Aura */}
          <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-rose-500/25 via-fuchsia-400/25 to-amber-300/20 blur-2xl animate-pulse pointer-events-none opacity-90" />
          <div className="absolute -inset-1 rounded-full border border-pink-200/60 pointer-events-none" />

          {/* Clockwise Orbit Ring with Glowing Particles */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-visible animate-spin-slow">
            <span className="absolute -top-3 left-6 text-amber-400 text-sm filter drop-shadow-[0_0_8px_#facc15]">🌸</span>
            <span className="absolute top-3 right-0 text-emerald-400 text-xs filter drop-shadow-[0_0_8px_#10b981]">🌿</span>
            <span className="absolute top-12 -right-3 text-pink-500 text-xs filter drop-shadow-[0_0_8px_#ec4899]">✨</span>
            <span className="absolute bottom-3 right-1 text-cyan-400 text-xs filter drop-shadow-[0_0_8px_#22d3ee]">🌼</span>
            <span className="absolute -bottom-3 right-10 text-purple-400 text-xs filter drop-shadow-[0_0_8px_#c084fc]">🌺</span>
            <span className="absolute -bottom-3 left-9 text-rose-400 text-xs filter drop-shadow-[0_0_8px_#fb7185]">🍃</span>
            <span className="absolute bottom-5 -left-2 text-amber-400 text-xs filter drop-shadow-[0_0_8px_#facc15]">✨</span>
            <span className="absolute top-5 left-0 text-emerald-400 text-xs filter drop-shadow-[0_0_8px_#10b981]">🌿</span>
          </div>

          {/* Circular Frame with SVG Progress */}
          <div className="relative w-44 h-44 rounded-full bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center p-3 shadow-[0_12px_32px_rgba(216,27,96,0.18),inset_0_2px_4px_rgba(255,255,255,0.9)]">
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 120 120">
              <circle cx="60" cy="60" fill="none" opacity="0.55" r="50" stroke="#ffd9de" strokeLinecap="round" strokeWidth="7" />
              <circle
                className="drop-shadow-[0_2px_8px_rgba(216,27,96,0.45)]"
                cx="60"
                cy="60"
                fill="none"
                r="50"
                stroke="url(#progressGlowGradient)"
                strokeDasharray="314"
                strokeDashoffset="157"
                strokeLinecap="round"
                strokeWidth="8"
              />
              <defs>
                <linearGradient id="progressGlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="50%" stopColor="#d81b60" />
                  <stop offset="100%" stopColor="#b0004a" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="10" fill="#ffffff" r="4.5" stroke="#b0004a" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 6px #d81b60)' }} />
            </svg>

            {/* Inner Hub */}
            <div className="w-32 h-32 rounded-full bg-white flex flex-col items-center justify-center shadow-[inset_0_3px_8px_rgba(176,0,74,0.06),0_4px_14px_rgba(128,80,98,0.08)] border border-pink-100 relative overflow-hidden select-none">
              <span className="text-[10px] font-black text-[#805062] uppercase tracking-widest flex items-center gap-1 mb-0.5">
                <span>🌸</span> DÖNGÜNÜN
              </span>
              <div className="flex items-baseline justify-center gap-0.5 leading-none my-0.5">
                <span className="text-4xl font-black text-[#b0004a] tracking-tight">{currentDayInfo.cycleDay}</span>
                <span className="text-lg font-black text-[#d81b60]">.</span>
              </div>
              <span className="text-[11px] font-bold text-[#1f1a1c] leading-tight">Gün</span>
              <div className="mt-1 px-2.5 py-0.5 rounded-full bg-pink-100/70 text-[#b0004a] border border-pink-200 shadow-xs flex items-center gap-1">
                <span className="text-[10px]">🌸</span>
                <span className="text-[9.5px] font-black tracking-tight">{conceptionInfo.status} Doğurganlık</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scientific Conception Rate & Next Period Strip */}
        <div className="grid grid-cols-2 gap-2.5 w-full mt-4">
          <div className="p-3 rounded-2xl bg-pink-50/60 border border-pink-100 flex flex-col items-center text-center">
            <span className="text-[11px] font-semibold text-[#805062]">Gelecek Adet</span>
            <span className="text-base font-black text-[#1f1a1c] mt-0.5">
              {Math.max(1, cycleLength - currentDayInfo.cycleDay)} Gün
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#ffd9e4]/70 border border-pink-200/70 flex flex-col items-center text-center">
            <span className="text-[11px] font-semibold text-[#805062]">Gebe Kalma İhtimali</span>
            <span className="text-base font-black text-[#b0004a] mt-0.5">
              {conceptionInfo.label}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-[#805062] mt-3 leading-relaxed text-center px-2">
          {conceptionInfo.explanation}
        </p>

        {/* Button to Record Symptoms */}
        <button
          onClick={onOpenSymptomModal}
          className="w-full mt-4 py-3.5 px-4 rounded-full bg-gradient-to-r from-[#b0004a] to-[#d81b60] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_8px_20px_rgba(216,27,96,0.3)] active:scale-98 transition-transform cursor-pointer"
        >
          <span>🌸 Belirti & Günlük Not Kaydet +</span>
        </button>
      </section>

      {/* 5-DAY MINI CALENDAR STRIP */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-pink-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#1f1a1c] flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-[#d81b60]" />
            {currentMonthYear}
          </span>
          <button
            onClick={() => onSelectDay(14)}
            className="text-xs font-bold text-[#b0004a] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            Tüm Takvim <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-1.5">
          {miniDays.map((d) => (
            <button
              key={d.dayNumber}
              onClick={() => onSelectDay(d.dayNumber)}
              className={`flex-1 py-3 px-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                d.isCurrent
                  ? 'bg-gradient-to-b from-[#b0004a] to-[#d81b60] text-white shadow-md scale-105 font-bold ring-2 ring-white'
                  : 'bg-pink-50/50 hover:bg-pink-100 text-[#805062] border border-pink-100'
              }`}
            >
              <span className="text-[10px] uppercase font-bold opacity-80">{d.name}</span>
              <span className="text-base font-black mt-0.5">{d.dayNumber}</span>
              <div className="flex items-center gap-1 mt-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    d.isCurrent ? 'bg-white animate-ping' : 'bg-[#d81b60]'
                  }`}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* BIOMETRICS BENTO: BBT, UYKU */}
      <div className="grid grid-cols-2 gap-3">
        {/* Bazal Isı (BBT) */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-pink-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#805062]">Bazal Isı (BBT)</span>
            <div className="w-7 h-7 rounded-full bg-rose-100 text-[#b0004a] flex items-center justify-center">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#1f1a1c]">36.8</span>
              <span className="text-xs font-bold text-gray-500">°C</span>
            </div>
            <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">
              +0.3°C dünden • Zirve LH
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-pink-100 flex items-center justify-between text-[10px] text-gray-400">
            <span>Dün: 36.5°C</span>
            <span className="text-emerald-700 font-bold">Doğrulandı ✓</span>
          </div>
        </div>

        {/* Uyku Süresi */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-pink-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#805062]">Uyku Süresi</span>
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Moon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#1f1a1c]">7s 40dk</span>
            </div>
            <p className="text-[11px] font-semibold text-indigo-600 mt-0.5">
              %88 Kaliteli Derin Uyku
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-pink-100 flex items-center justify-between text-[10px] text-gray-400">
            <span>23:00 - 07:30</span>
            <span className="text-indigo-700 font-bold">Melatonin ✓</span>
          </div>
        </div>
      </div>

      {/* SU TÜKETİMİ */}
      <div
        className={`bg-white rounded-3xl p-5 shadow-sm border border-pink-100 space-y-4 transition-all duration-150 ${
          isPressing ? 'scale-[0.98]' : ''
        } ${isPoofing ? 'scale-105' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0 shadow-xs">
              <Droplet className="w-5 h-5 fill-cyan-500 text-cyan-500" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[#1f1a1c]">Su Tüketimi</h4>
              <p className="text-[11px] text-[#805062]">
                Hedef: {(waterGoalMl / 1000).toFixed(2)} L • Kalan: {Math.max(0, (waterGoalMl - waterCurrentMl) / 1000).toFixed(2)} L
              </p>
            </div>
          </div>

          <button
            onClick={onOpenWaterSettings}
            className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border transition-all cursor-pointer shadow-xs ${
              autoResetAtMidnight
                ? 'bg-cyan-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100'
                : 'bg-gray-100 text-gray-500 border-gray-200'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>00:00 {autoResetAtMidnight ? 'Otomatik' : 'Pasif'}</span>
          </button>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#1f1a1c]">
              {(waterCurrentMl / 1000).toFixed(2)}{' '}
              <span className="text-xs font-semibold text-[#805062]">
                / {(waterGoalMl / 1000).toFixed(2)} L
              </span>
            </span>
            <span className="text-xs font-black text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
              %{waterPercent}
            </span>
          </div>

          <div className="w-full h-3.5 bg-pink-50 rounded-full overflow-hidden p-0.5 border border-pink-100 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-[#d81b60] rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, waterPercent)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          <button
            onClick={handleQuickAddWater}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:brightness-105 active:scale-98 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+250 ml Ekle</span>
          </button>

          <div className="relative">
            <button
              onMouseDown={startLongPress}
              onMouseUp={cancelLongPress}
              onMouseLeave={cancelLongPress}
              onTouchStart={startLongPress}
              onTouchEnd={cancelLongPress}
              title="Sıfırlamak için 1.2 saniye basılı tutun"
              className="relative w-12 h-12 rounded-2xl bg-pink-50 hover:bg-pink-100 active:scale-95 text-[#805062] flex items-center justify-center transition-all cursor-pointer select-none border border-pink-200 shadow-xs"
            >
              {isPressing && (
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="#d81b60"
                    strokeWidth="3.5"
                    fill="transparent"
                    strokeDasharray="100"
                    strokeDashoffset={`${100 - pressProgress}`}
                  />
                </svg>
              )}
              <RotateCcw className={`w-5 h-5 ${isPressing ? 'text-[#d81b60] scale-110' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* GÜNLÜK TAKVİYELER */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-pink-100 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-50 text-[#d81b60] flex items-center justify-center shadow-xs">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[#1f1a1c]">
                Bugün Alınacak Günlük Takviyeler
              </h4>
              <p className="text-[11px] text-[#805062]">
                {supplements.filter((s) => s.taken).length} / {supplements.length} alındı
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold text-[#b0004a] bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100">
            ✓ Günlük Takip
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {supplements.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleDailySupplement(item.id)}
              className={`p-3 rounded-2xl border flex items-center justify-between gap-2 transition-all cursor-pointer select-none active:scale-98 ${
                item.taken
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 shadow-xs'
                  : 'bg-white border-pink-100 text-[#1f1a1c] hover:border-pink-200 hover:bg-pink-50/40'
              }`}
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0 text-left">
                <CheckCircle2
                  className={`w-5 h-5 shrink-0 ${
                    item.taken ? 'text-emerald-600 fill-emerald-100' : 'text-gray-300'
                  }`}
                />
                <div className="truncate">
                  <p className={`text-xs font-bold truncate leading-tight ${item.taken ? 'line-through text-emerald-800/80 font-semibold' : ''}`}>
                    {item.name}
                  </p>
                  <p className="text-[10px] text-[#805062] font-medium mt-0.5">
                    {item.dose} • Saat: {item.time}
                  </p>
                </div>
              </div>

              {item.reminderEnabled && (
                <span
                  title={`Hatırlatıcı: ${item.time}`}
                  className="p-1 rounded-full bg-pink-50 text-[#b0004a] text-[10px] shrink-0"
                >
                  <Bell className="w-3 h-3" />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
