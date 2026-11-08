import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Calendar, Shield, Droplet, Moon, Heart } from 'lucide-react';
import { FloraLogo } from './FloraLogo';
import { soundEngine } from '../utils/audio';
import { triggerRosePollenBurst } from '../utils/confetti';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: {
    goal: string;
    cycleLength: number;
    periodLength: number;
    lastPeriodDate: string;
  }) => void;
  initialStep?: number;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialStep = 1,
}) => {
  if (!isOpen) return null;

  // 0: Welcome Splash, 1: Goal, 2: Parameters, 3: Habits, 4: Calibration
  const [step, setStep] = useState<number>(initialStep);
  const [goal, setGoal] = useState<string>('Hamilelik & Doğurganlık Planlama');
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodLength, setPeriodLength] = useState<number>(5);
  const [intensity, setIntensity] = useState<string>('Normal (3-4 Ped)');
  const [lastPeriodDay, setLastPeriodDay] = useState<number>(1);
  const [contraception, setContraception] = useState<string>('Doğal Yöntem');
  const [habits, setHabits] = useState<string[]>(['Su Takibi', 'Uyku Koruma & DND']);
  const [calibrationProgress, setCalibrationProgress] = useState<number>(0);

  const goalOptions = [
    {
      id: 'Sadece Döngü & Regl Takibi',
      title: 'Sadece Döngü & Regl Takibi',
      desc: 'Günlük fazlar, regl başlangıç tahminleri ve PMS dalgalanmaları.',
      icon: '🌸',
      iconBg: 'bg-rose-50 text-rose-500',
    },
    {
      id: 'Hamilelik & Doğurganlık Planlama',
      title: 'Hamilelik & Doğurganlık Planlama',
      desc: 'Zirve ovülasyon pencereleri, LH testi ve bazal vücut ısısı eşleşmesi.',
      icon: '💖',
      iconBg: 'bg-gradient-to-tr from-[#b0004a] to-[#d81b60] text-white shadow-sm',
    },
    {
      id: 'Hormonal Denge & PCOS Takibi',
      title: 'Hormonal Denge & PCOS Takibi',
      desc: 'Düzensiz ritim desteği, enerji haritası ve beden farkındalığı.',
      icon: '🌿',
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'Gebelikte Hafta Hafta Gelişim',
      title: 'Gebelikte Hafta Hafta Gelişim',
      desc: 'Trimester adımları, bebeğin büyüme grafiği ve anne sağlığı.',
      icon: '🤰',
      iconBg: 'bg-purple-50 text-purple-600',
    },
  ];

  // Calibration simulation
  useEffect(() => {
    if (step === 4) {
      soundEngine.playCrystalChime();
      let current = 0;
      const interval = setInterval(() => {
        current += 5;
        if (current >= 100) {
          clearInterval(interval);
          setCalibrationProgress(100);
          triggerRosePollenBurst();
          soundEngine.playCrystalChime();
          setTimeout(() => {
            onComplete({
              goal,
              cycleLength,
              periodLength,
              lastPeriodDate: `2025-04-${String(lastPeriodDay).padStart(2, '0')}`,
            });
            onClose();
          }, 1200);
        } else {
          setCalibrationProgress(current);
        }
      }, 60);

      return () => clearInterval(interval);
    }
  }, [step]);

  const toggleHabit = (h: string) => {
    soundEngine.playDropletSound();
    if (habits.includes(h)) {
      setHabits(habits.filter((item) => item !== h));
    } else {
      setHabits([...habits, h]);
    }
  };

  const handleNext = () => {
    soundEngine.playDropletSound();
    if (step === 0) setStep(1);
    else if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep(4);
  };

  const handlePrev = () => {
    soundEngine.playDropletSound();
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#fff8f8] rounded-[2.5rem] shadow-2xl overflow-hidden border border-pink-100 flex flex-col max-h-[95vh] relative text-[#1f1a1c]">
        {/* Quick Step Bar for Instant Review */}
        <div className="px-4 pt-3 pb-1 flex items-center justify-between gap-1 bg-[#fff8f8] border-b border-pink-100/60 z-20">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => { soundEngine.playDropletSound(); setStep(0); }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                step === 0
                  ? 'bg-[#b0004a] text-white shadow-xs'
                  : 'bg-white text-[#805062] hover:text-[#b0004a]'
              }`}
            >
              ✨ Karşılama
            </button>
            <button
              onClick={() => { soundEngine.playDropletSound(); setStep(1); }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                step === 1
                  ? 'bg-[#b0004a] text-white shadow-xs'
                  : 'bg-white text-[#805062] hover:text-[#b0004a]'
              }`}
            >
              1. Hedef
            </button>
            <button
              onClick={() => { soundEngine.playDropletSound(); setStep(2); }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                step === 2
                  ? 'bg-[#b0004a] text-white shadow-xs'
                  : 'bg-white text-[#805062] hover:text-[#b0004a]'
              }`}
            >
              2. Parametre
            </button>
            <button
              onClick={() => { soundEngine.playDropletSound(); setStep(3); }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                step === 3
                  ? 'bg-[#b0004a] text-white shadow-xs'
                  : 'bg-white text-[#805062] hover:text-[#b0004a]'
              }`}
            >
              3. Kişisel
            </button>
            <button
              onClick={() => { soundEngine.playDropletSound(); setStep(4); }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                step === 4
                  ? 'bg-[#b0004a] text-white shadow-xs'
                  : 'bg-pink-100/80 text-[#b0004a] hover:bg-pink-200'
              }`}
            >
              🌸 Kalibrasyon
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-black cursor-pointer shadow-xs shrink-0 ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 0: WELCOME / SPLASH SCREEN (screen__10__26cec8e0.png & code__7__a5681148.html) */}
        {step === 0 && (
          <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center text-center animate-in fade-in duration-300">
            {/* Top Badges */}
            <div className="w-full flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-pink-100/70 text-[#b0004a] text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#d81b60] animate-pulse"></span>
                DÖNGÜ FAZI: DOĞAL DENGE
              </span>
              <span className="px-3 py-1 rounded-full bg-pink-100/60 text-[#805062] text-xs font-bold flex items-center gap-1">
                🌸 Flora OS
              </span>
            </div>

            {/* Accuracy pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white shadow-sm border border-amber-200 text-amber-800 text-xs font-bold mb-3">
              <span className="text-amber-500">✨</span>
              <span>99.4% Doğruluk</span>
            </div>

            {/* Central Sacred Lotus Emblem with Celestial Orbit Ring */}
            <div className="relative w-52 h-52 flex items-center justify-center my-2">
              {/* Pulsing Aura */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-pink-400/25 via-rose-300/20 to-amber-200/30 blur-2xl animate-pulse pointer-events-none" />

              {/* Dashed Celestial Orbit Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-pink-300/60 animate-spin-slow pointer-events-none" />

              {/* Orbiting Planetary Dewdrops */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#d81b60] shadow-[0_0_8px_#d81b60]" />
              <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />

              {/* Inner White Halo Squircle Frame */}
              <div className="w-40 h-40 rounded-full bg-white shadow-[0_12px_32px_rgba(216,27,96,0.18)] flex items-center justify-center p-3 relative">
                {/* Authentic 3D Sacred Lotus Emblem Asset */}
                <img
                  src="/logo.png"
                  alt="Flora Cycle Sacred Lotus Emblem"
                  className="w-28 h-28 object-contain drop-shadow-[0_8px_20px_rgba(216,27,96,0.35)]"
                />
              </div>
            </div>

            {/* Canlı Ritim Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white shadow-xs border border-pink-200 text-[#b0004a] text-[11px] font-bold mt-1 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b0004a] animate-ping" />
              Canlı Ritim
            </div>

            {/* Brand Title & Tag */}
            <span className="px-3 py-1 rounded-full bg-pink-100 text-[#b0004a] text-xs font-extrabold uppercase tracking-widest flex items-center gap-1 mb-1">
              🌸 Botanik Akıllı Sağlık
            </span>
            <div className="flex items-center justify-center gap-2.5 my-1">
              <FloraLogo size="md" />
              <h1 className="text-3xl font-black text-[#1f1a1c] tracking-tight">Flora Cycle</h1>
            </div>
            <p className="text-xs text-[#805062] max-w-xs mt-1.5 leading-relaxed">
              Biyo-ritmik döngü, doğurganlık takvimi ve hormonal esenliğiniz için nazik bir sığınak.
            </p>

            {/* 3 Claymorphic Feature Cards */}
            <div className="w-full space-y-2.5 my-5 text-left">
              <div className="p-3.5 rounded-2xl bg-white border border-pink-100 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#d81b60] flex items-center justify-center font-bold text-lg shadow-xs">
                  📅
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#1f1a1c]">Akıllı Ovülasyon & Faz Takibi</h4>
                    <span className="text-[10px] font-bold text-[#b0004a]">Yapay Zeka</span>
                  </div>
                  <p className="text-[11px] text-[#805062] truncate mt-0.5">
                    Hormonal evrelerinizle senkronize öngörüler ve takvim.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-pink-100 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#d81b60] flex items-center justify-center font-bold text-lg shadow-xs">
                  💧
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#1f1a1c]">Biyo-Denge & Holistik Semptom</h4>
                    <span className="text-[10px] font-bold text-[#b0004a]">Nazik Rapor</span>
                  </div>
                  <p className="text-[11px] text-[#805062] truncate mt-0.5">
                    Ruh hali, uyku ve bedensel duyarlılık günlüğü.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-pink-100 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#d81b60] flex items-center justify-center font-bold text-lg shadow-xs">
                  🛡️
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#1f1a1c]">Uçtan Uca Şifreli Gizlilik</h4>
                    <span className="text-[10px] font-bold text-[#b0004a]">AES-256</span>
                  </div>
                  <p className="text-[11px] text-[#805062] truncate mt-0.5">
                    Sağlık veriniz sadece sizin cihazınızda korunur.
                  </p>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => { soundEngine.playDropletSound(); setStep(1); }}
              className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#b0004a] to-[#d81b60] text-white font-extrabold text-sm shadow-[0_8px_24px_rgba(216,27,96,0.35)] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Döngünü Keşfetmeye Başla</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => { soundEngine.playDropletSound(); setStep(1); }}
              className="text-xs text-[#805062] mt-3 font-semibold"
            >
              Zaten bir hesabın var mı? <span className="text-[#b0004a] underline font-bold">Giriş Yap</span>
            </button>

            <p className="text-[10px] text-[#805062]/80 mt-4 flex items-center gap-1">
              <span>🌸</span> Kadife Botanik Sağlık Güvencesi • Sürüm 3.4.2
            </p>
          </div>
        )}

        {/* STEP 1: GOAL SELECTION (Exact match to screen__2__e1dd1a73.png) */}
        {step === 1 && (
          <div className="p-5 overflow-y-auto flex-1 flex flex-col justify-between animate-in fade-in duration-300">
            <div>
              {/* App Header & Step Counter */}
              <div className="flex items-center justify-between py-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <FloraLogo size="md" />
                  <div className="flex flex-col">
                    <span className="text-base text-[#1f1a1c] font-black tracking-tight leading-tight">
                      Flora Cycle
                    </span>
                    <span className="text-[11px] text-[#805062] font-semibold -mt-0.5">
                      Biyolojik Ritim Alanı
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-[#ffd9e4]/70 text-[#330f1f] text-xs font-bold shadow-xs">
                    Adım <span className="text-[#b0004a] font-black">1</span> / 3
                  </div>
                  <button
                    onClick={() => { soundEngine.playDropletSound(); setStep(2); }}
                    className="text-[#805062] text-xs font-bold px-2 py-1 rounded-full hover:bg-pink-100 transition"
                  >
                    Atla
                  </button>
                </div>
              </div>

              {/* Segmented Progress Tracker */}
              <div className="w-full bg-[#f0e6e8] rounded-full p-1 mb-5 flex items-center space-x-1.5 shadow-inner">
                <div className="h-2 flex-1 rounded-full bg-[#d81b60] shadow-sm flex items-center justify-end pr-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <div className="h-2 flex-1 rounded-full bg-[#eae0e2]"></div>
                <div className="h-2 flex-1 rounded-full bg-[#eae0e2]"></div>
              </div>

              {/* Title Section */}
              <div className="space-y-1 mb-4">
                <div className="inline-flex items-center gap-1.5 text-[#b0004a]">
                  <span className="text-sm">🌷</span>
                  <span className="text-xs uppercase tracking-wider font-extrabold">Kişiselleştirme</span>
                </div>
                <h2 className="text-2xl font-black text-[#1f1a1c] tracking-tight">
                  Senin için ne yapabiliriz?
                </h2>
                <p className="text-xs text-[#805062] leading-relaxed">
                  Flora, kadın biyolojisinin eşsiz döngüsüne saygıyla uyum sağlar. Takip hedefini seçerek başla.
                </p>
              </div>

              {/* 4 Goal Cards (Exact match to screen__2__e1dd1a73.png) */}
              <div className="space-y-3 pt-1">
                {goalOptions.map((item) => {
                  const isSelected = goal === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        soundEngine.playDropletSound();
                        setGoal(item.id);
                      }}
                      className={`p-4 rounded-3xl transition-all cursor-pointer flex items-center gap-3.5 border ${
                        isSelected
                          ? 'bg-gradient-to-r from-pink-50/70 to-rose-50/70 border-pink-300 shadow-[0_8px_20px_rgba(216,27,96,0.12)] scale-[1.01]'
                          : 'bg-white border-transparent shadow-sm hover:border-pink-200'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${item.iconBg}`}>
                        {item.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[#1f1a1c] leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#805062] mt-0.5 leading-snug">
                          {item.desc}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-[#d81b60] flex items-center justify-center text-white shadow-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-200 bg-gray-100/60" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-6">
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#b0004a] to-[#d81b60] text-white font-extrabold text-sm shadow-[0_8px_24px_rgba(216,27,96,0.35)] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Devam Et</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: BIOLOGICAL PARAMETERS & 3D WHEEL PICKERS (code__5__47d97f22.html) */}
        {step === 2 && (
          <div className="p-5 overflow-y-auto flex-1 flex flex-col justify-between animate-in fade-in duration-300">
            <div>
              {/* App Header & Step Counter */}
              <div className="flex items-center justify-between py-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <FloraLogo size="md" />
                  <div className="flex flex-col">
                    <span className="text-base text-[#1f1a1c] font-black tracking-tight leading-tight">
                      Flora Cycle
                    </span>
                    <span className="text-[11px] text-[#805062] font-semibold -mt-0.5">
                      Biyolojik Ritim Alanı
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-[#ffd9e4]/70 text-[#330f1f] text-xs font-bold shadow-xs">
                    Adım <span className="text-[#b0004a] font-black">2</span> / 3
                  </div>
                  <button
                    onClick={() => { soundEngine.playDropletSound(); setStep(3); }}
                    className="text-[#805062] text-xs font-bold px-2 py-1 rounded-full hover:bg-pink-100 transition"
                  >
                    Atla
                  </button>
                </div>
              </div>

              {/* Segmented Progress Tracker */}
              <div className="w-full bg-[#f0e6e8] rounded-full p-1 mb-5 flex items-center space-x-1.5 shadow-inner">
                <div className="h-2 flex-1 rounded-full bg-[#d81b60]"></div>
                <div className="h-2 flex-1 rounded-full bg-[#d81b60] shadow-sm flex items-center justify-end pr-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <div className="h-2 flex-1 rounded-full bg-[#eae0e2]"></div>
              </div>

              {/* Title Section */}
              <div className="space-y-1 mb-4">
                <div className="inline-flex items-center gap-1.5 text-[#b0004a]">
                  <span className="text-sm">🌸</span>
                  <span className="text-xs uppercase tracking-wider font-extrabold">Biyo-Ritim Parametreleri</span>
                </div>
                <h2 className="text-2xl font-black text-[#1f1a1c] tracking-tight">
                  Döngü temellerini belirle
                </h2>
                <p className="text-xs text-[#805062] leading-relaxed">
                  Ortalama değerleri seçin; algoritmamız döngünüzü tam doğrulukla tahmin etsin.
                </p>
              </div>

              {/* 3D Wheel: Döngü Süresi (21 - 42 Gün) */}
              <div className="p-4 rounded-3xl bg-white border border-pink-100 shadow-sm mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#1f1a1c]">Ortalama Döngü Süresi</span>
                  <span className="text-xs font-black text-[#d81b60] bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                    {cycleLength} Gün
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      if (cycleLength > 21) {
                        soundEngine.playDropletSound();
                        setCycleLength(cycleLength - 1);
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-[#b0004a] font-bold shadow-xs cursor-pointer hover:bg-pink-100"
                  >
                    -
                  </button>

                  <div className="flex-1 flex justify-center items-center gap-1.5 py-1">
                    {[-2, -1, 0, 1, 2].map((offset) => {
                      const val = cycleLength + offset;
                      if (val < 21 || val > 42) return null;
                      const isCenter = offset === 0;
                      return (
                        <div
                          key={val}
                          onClick={() => {
                            soundEngine.playDropletSound();
                            setCycleLength(val);
                          }}
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold cursor-pointer transition-all ${
                            isCenter
                              ? 'bg-[#d81b60] text-white text-base shadow-md scale-110'
                              : 'bg-pink-50/50 text-[#805062] text-xs hover:bg-pink-100'
                          }`}
                        >
                          {val}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      if (cycleLength < 42) {
                        soundEngine.playDropletSound();
                        setCycleLength(cycleLength + 1);
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-[#b0004a] font-bold shadow-xs cursor-pointer hover:bg-pink-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 3D Wheel: Kanama Süresi (2 - 10 Gün) */}
              <div className="p-4 rounded-3xl bg-white border border-pink-100 shadow-sm mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#1f1a1c]">Ortalama Kanama Süresi</span>
                  <span className="text-xs font-black text-[#d81b60] bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                    {periodLength} Gün
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      if (periodLength > 2) {
                        soundEngine.playDropletSound();
                        setPeriodLength(periodLength - 1);
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-[#b0004a] font-bold shadow-xs cursor-pointer hover:bg-pink-100"
                  >
                    -
                  </button>

                  <div className="flex-1 flex justify-center items-center gap-1.5 py-1">
                    {[-2, -1, 0, 1, 2].map((offset) => {
                      const val = periodLength + offset;
                      if (val < 2 || val > 10) return null;
                      const isCenter = offset === 0;
                      return (
                        <div
                          key={val}
                          onClick={() => {
                            soundEngine.playDropletSound();
                            setPeriodLength(val);
                          }}
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold cursor-pointer transition-all ${
                            isCenter
                              ? 'bg-[#b0004a] text-white text-base shadow-md scale-110'
                              : 'bg-pink-50/50 text-[#805062] text-xs hover:bg-pink-100'
                          }`}
                        >
                          {val}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      if (periodLength < 10) {
                        soundEngine.playDropletSound();
                        setPeriodLength(periodLength + 1);
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-[#b0004a] font-bold shadow-xs cursor-pointer hover:bg-pink-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Son Regl Tarihi */}
              <div className="p-3.5 bg-white rounded-2xl border border-pink-100 shadow-sm mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#1f1a1c] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#d81b60]" /> Son Regl Başlangıcı
                  </span>
                  <span className="text-xs font-extrabold text-[#d81b60]">
                    {lastPeriodDay} Nisan 2025
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '1 Nisan (Bugün 14. Gün)', day: 1 },
                    { label: '3 Nisan', day: 3 },
                    { label: '7 Nisan', day: 7 },
                  ].map((item) => (
                    <button
                      key={item.day}
                      onClick={() => {
                        soundEngine.playDropletSound();
                        setLastPeriodDay(item.day);
                      }}
                      className={`py-2 px-1 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                        lastPeriodDay === item.day
                          ? 'bg-[#ffd9de] text-[#b0004a] border-[#d81b60]'
                          : 'bg-pink-50/30 text-[#805062] border-pink-100 hover:bg-pink-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contraception */}
              <div className="p-3.5 bg-white rounded-2xl border border-pink-100 shadow-sm">
                <span className="text-xs font-bold text-[#1f1a1c] block mb-2">Korunma Metodu</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {['Doğal Yöntem', 'Doğum Kontrol', 'Spiral (RİA)', 'Bariyer'].map((c) => (
                    <button
                      key={c}
                      onClick={() => { soundEngine.playDropletSound(); setContraception(c); }}
                      className={`py-2 text-[10px] font-bold rounded-xl border transition-all cursor-pointer text-center ${
                        contraception === c
                          ? 'bg-[#b0004a] text-white border-[#b0004a] shadow-xs'
                          : 'bg-pink-50/30 text-[#805062] border-pink-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="pt-6 flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="py-4 px-5 rounded-full bg-white text-[#805062] font-bold text-sm border border-pink-200 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Geri</span>
              </button>
              <button
                onClick={handleNext}
                className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#b0004a] to-[#d81b60] text-white font-extrabold text-sm shadow-[0_8px_24px_rgba(216,27,96,0.35)] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Devam Et</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: HABITS & BIO-PROTECTION */}
        {step === 3 && (
          <div className="p-5 overflow-y-auto flex-1 flex flex-col justify-between animate-in fade-in duration-300">
            <div>
              {/* App Header & Step Counter */}
              <div className="flex items-center justify-between py-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <FloraLogo size="md" />
                  <div className="flex flex-col">
                    <span className="text-base text-[#1f1a1c] font-black tracking-tight leading-tight">
                      Flora Cycle
                    </span>
                    <span className="text-[11px] text-[#805062] font-semibold -mt-0.5">
                      Biyolojik Ritim Alanı
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-[#ffd9e4]/70 text-[#330f1f] text-xs font-bold shadow-xs">
                    Adım <span className="text-[#b0004a] font-black">3</span> / 3
                  </div>
                  <button
                    onClick={() => { soundEngine.playDropletSound(); setStep(4); }}
                    className="text-[#805062] text-xs font-bold px-2 py-1 rounded-full hover:bg-pink-100 transition"
                  >
                    Atla
                  </button>
                </div>
              </div>

              {/* Segmented Progress Tracker */}
              <div className="w-full bg-[#f0e6e8] rounded-full p-1 mb-5 flex items-center space-x-1.5 shadow-inner">
                <div className="h-2 flex-1 rounded-full bg-[#d81b60]"></div>
                <div className="h-2 flex-1 rounded-full bg-[#d81b60]"></div>
                <div className="h-2 flex-1 rounded-full bg-[#d81b60] shadow-sm flex items-center justify-end pr-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
              </div>

              {/* Title Section */}
              <div className="space-y-1 mb-4">
                <div className="inline-flex items-center gap-1.5 text-[#b0004a]">
                  <span className="text-sm">✨</span>
                  <span className="text-xs uppercase tracking-wider font-extrabold">Alışkanlık & Gizlilik</span>
                </div>
                <h2 className="text-2xl font-black text-[#1f1a1c] tracking-tight">
                  Odaklanmak istediğin detaylar
                </h2>
                <p className="text-xs text-[#805062] leading-relaxed">
                  Sizin için en değerli olan biyo-parametreleri ve koruma kalkanlarını aktifleştirin.
                </p>
              </div>

              {/* Habits Cards */}
              <div className="space-y-2.5">
                {[
                  {
                    id: 'Su Takibi',
                    title: 'Akıllı Su Takibi (2.5L)',
                    desc: '00:00 gece otomatik sıfırlama & nazik hidrasyon bildirimleri.',
                    icon: Droplet,
                  },
                  {
                    id: 'Uyku Koruma & DND',
                    title: 'Sessiz Botanik Uyku (23:00 - 07:30)',
                    desc: 'Gece melatonin koruması için tüm bildirimler sessize alınır.',
                    icon: Moon,
                  },
                  {
                    id: 'BBT Sıcaklık',
                    title: 'Bazal Vücut Isısı (BBT) & Ovülasyon',
                    desc: 'Ovülasyon zirvesini teyit eden bifazik sıcaklık analizi.',
                    icon: Heart,
                  },
                  {
                    id: 'Face ID & Gizlilik',
                    title: 'Biyometrik Tıbbi Kasa (AES-256)',
                    desc: 'Tüm sağlık verileriniz sadece bu cihazda şifreli tutulur.',
                    icon: Shield,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isChecked = habits.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleHabit(item.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isChecked
                          ? 'border-[#d81b60] bg-pink-50/50 shadow-xs'
                          : 'border-pink-100 bg-white hover:border-pink-200'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-[#d81b60] text-white shadow-xs' : 'bg-pink-50 text-[#805062]'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#1f1a1c]">{item.title}</h4>
                        <p className="text-[11px] text-[#805062] mt-0.5 leading-snug">{item.desc}</p>
                      </div>

                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        isChecked ? 'bg-[#d81b60] border-[#d81b60] text-white' : 'border-gray-300'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="pt-6 flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="py-4 px-5 rounded-full bg-white text-[#805062] font-bold text-sm border border-pink-200 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Geri</span>
              </button>
              <button
                onClick={handleNext}
                className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#b0004a] to-[#d81b60] text-white font-extrabold text-sm shadow-[0_8px_24px_rgba(216,27,96,0.35)] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Döngümü Kalibre Et</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SACRED LOTUS CALIBRATION TRANSITION SCREEN */}
        {step === 4 && (
          <div className="p-8 overflow-y-auto flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
            {/* Luminous Pulsing Lotus Emblem */}
            <div className="relative w-44 h-44 flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500/30 via-rose-400/25 to-amber-300/30 blur-2xl animate-pulse" />
              <div className="absolute -inset-2 rounded-full border-2 border-dashed border-[#d81b60]/50 animate-spin-slow pointer-events-none" />

              <div className="w-36 h-36 rounded-full bg-white shadow-[0_16px_36px_rgba(216,27,96,0.25)] flex items-center justify-center p-3 relative">
                <img
                  src="/logo.png"
                  alt="Flora Calibration Lotus"
                  className="w-24 h-24 object-contain animate-bounce drop-shadow-[0_8px_16px_rgba(216,27,96,0.3)]"
                />
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-pink-100 text-[#b0004a] text-xs font-extrabold uppercase tracking-wider mb-2">
              🌸 Biyo-Flora Kalibrasyonu
            </span>
            <h3 className="text-2xl font-black text-[#1f1a1c] tracking-tight">
              Biyo-Ritminiz Senkronize Ediliyor
            </h3>
            <p className="text-xs text-[#805062] max-w-xs mt-1 leading-relaxed">
              {goal} hedefiniz ve {cycleLength} günlük döngü ritminiz akıllı sağlık motorumuza işleniyor.
            </p>

            {/* Progress Bar & Percentage */}
            <div className="w-full max-w-xs mt-6 mb-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#805062] mb-1.5">
                <span>Algoritmik Eşleşme</span>
                <span className="text-[#b0004a] font-black">%{calibrationProgress}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-pink-100 overflow-hidden shadow-inner p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#b0004a] via-[#d81b60] to-amber-400 transition-all duration-150"
                  style={{ width: `${calibrationProgress}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-[#805062] mt-3">
              {calibrationProgress < 50
                ? 'Hormonal evreler analiz ediliyor...'
                : calibrationProgress < 85
                ? 'Yumurtlama ve doğurganlık pencereleri oluşturuluyor...'
                : 'Botanik Bahçe hazırlanıyor! ✨'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
