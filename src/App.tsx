/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, DayInfo, UserProfile, ToastMessage, SupplementItem } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { TodayTab } from './components/TodayTab';
import { CycleTab } from './components/CycleTab';
import { ReportsTab } from './components/ReportsTab';
import { ProfileTab } from './components/ProfileTab';
import { OnboardingModal } from './components/OnboardingModal';
import { SymptomModal } from './components/SymptomModal';
import { WaterSettingsModal } from './components/WaterSettingsModal';
import { DoctorReportModal } from './components/DoctorReportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('bugun');
  const [selectedDay, setSelectedDay] = useState<number>(14);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showSymptomModal, setShowSymptomModal] = useState<boolean>(false);
  const [showWaterSettingsModal, setShowWaterSettingsModal] = useState<boolean>(false);
  const [showDoctorReportModal, setShowDoctorReportModal] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Supplements state synchronized between Profile and Today views
  const [supplements, setSupplements] = useState<SupplementItem[]>([
    { id: 'folic', name: 'Folik Asit', dose: '400 mcg', time: '09:00', taken: true, reminderEnabled: true },
    { id: 'magnesium', name: 'Magnezyum Bisglisinat', dose: '200 mg', time: '21:30', taken: true, reminderEnabled: true },
    { id: 'omega3', name: 'Omega-3 (DHA & EPA)', dose: '1 Kapsül', time: '13:00', taken: false, reminderEnabled: true },
    { id: 'd3', name: 'D3 Vitamini & K2', dose: '1000 IU', time: '10:00', taken: false, reminderEnabled: false },
    { id: 'tea', name: 'Melisa & Papatya Çayı', dose: '1 Fincan', time: '22:00', taken: false, reminderEnabled: false },
  ]);

  const handleToggleSupplement = (id: string) => {
    setSupplements((prev) =>
      prev.map((s) => (s.id === id ? { ...s, taken: !s.taken } : s))
    );
  };

  const handleAddSupplement = (item: SupplementItem) => {
    setSupplements((prev) => [...prev, item]);
  };

  const handleDeleteSupplement = (id: string) => {
    setSupplements((prev) => prev.filter((s) => s.id !== id));
  };

  // User Profile State
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Zeynep Kaya',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    cycleLength: 28,
    periodLength: 5,
    lastPeriodDate: '2025-04-01',
    goal: 'Hamilelik & Doğurganlık Planlama',
    waterGoalMl: 2500,
    waterCurrentMl: 1750,
    autoResetAtMidnight: true,
    quietHoursStart: '23:00',
    quietHoursEnd: '07:30',
    reminderIntervalMin: 90,
    vibrationActive: true,
    faceIdActive: true,
    anonymousMode: false,
    appleHealthConnected: true,
    ouraConnected: false,
  });

  // Day Data Map
  const [dayDataMap, setDayDataMap] = useState<Record<number, DayInfo>>({
    14: {
      date: '2025-04-14',
      dayNumber: 14,
      dayName: 'Pazartesi',
      cycleDay: 14,
      phase: 'ovulasyon',
      isToday: true,
      bbt: 36.8,
      heartRate: 72,
      libido: 'Yüksek',
      flow: 'Yok',
      symptoms: ['Hafif Kramp', 'Zirve Enerji'],
      mood: 'Canlı & Pozitif',
    },
  });

  // Toast Notification Helper
  const showToast = (title: string, message: string, type: 'success' | 'info' | 'water' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Water Actions
  const handleAddWater = (amount: number) => {
    setProfile((prev) => ({
      ...prev,
      waterCurrentMl: Math.min(prev.waterCurrentMl + amount, 4500),
    }));
  };

  const handleResetWater = () => {
    setProfile((prev) => ({
      ...prev,
      waterCurrentMl: 0,
    }));
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  // Symptom Save
  const handleSaveSymptoms = (updated: Partial<DayInfo>) => {
    setDayDataMap((prev) => {
      const existing = prev[selectedDay] || {
        date: `2025-04-${String(selectedDay).padStart(2, '0')}`,
        dayNumber: selectedDay,
        dayName: 'Nisan',
        cycleDay: selectedDay,
        phase: selectedDay >= 12 && selectedDay <= 16 ? 'ovulasyon' : selectedDay <= 5 ? 'regl' : 'folikuler',
        isToday: selectedDay === 14,
      };
      return {
        ...prev,
        [selectedDay]: { ...existing, ...updated },
      };
    });
    showToast('Belirtiler Kaydedildi', `${selectedDay} Nisan biyo-parametreleri güncellendi.`, 'success');
  };

  // Onboarding Completion
  const handleCompleteOnboarding = (data: {
    goal: string;
    cycleLength: number;
    periodLength: number;
    lastPeriodDate: string;
  }) => {
    setProfile((prev) => ({
      ...prev,
      goal: data.goal,
      cycleLength: data.cycleLength,
      periodLength: data.periodLength,
      lastPeriodDate: data.lastPeriodDate,
    }));
    showToast(
      'Döngü Senkronize Edildi',
      `${data.cycleLength} günlük biyo-ritminiz başarıyla kalibre edildi!`,
      'success'
    );
  };

  const currentDayInfo: DayInfo = dayDataMap[14] || {
    date: '2025-04-14',
    dayNumber: 14,
    dayName: 'Pazartesi',
    cycleDay: 14,
    phase: 'ovulasyon',
    isToday: true,
  };

  // Quick Mood Update from TodayTab or SymptomModal
  const handleUpdateMood = (newMood: string) => {
    setDayDataMap((prev) => {
      const existing = prev[selectedDay] || {
        date: `2025-04-${String(selectedDay).padStart(2, '0')}`,
        dayNumber: selectedDay,
        dayName: 'Nisan',
        cycleDay: selectedDay,
        phase: selectedDay >= 12 && selectedDay <= 16 ? 'ovulasyon' : 'folikuler',
        isToday: selectedDay === 14,
      };
      return {
        ...prev,
        [selectedDay]: { ...existing, mood: newMood },
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#fff8f8] text-[#1f1a1c] relative selection:bg-pink-200">
      {/* Topographic organic background pattern */}
      <div className="fixed inset-0 topographic-pattern pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col px-4">
        {/* App Header */}
        <Header
          currentCycleDay={14}
          currentPhaseName="Ovülasyon Zirvesi"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          waterRemaining={Math.max(0, profile.waterGoalMl - profile.waterCurrentMl)}
        />

        {/* Dynamic Tab Views */}
        <main className="flex-1">
          {activeTab === 'bugun' && (
            <TodayTab
              currentDayInfo={currentDayInfo}
              waterCurrentMl={profile.waterCurrentMl}
              waterGoalMl={profile.waterGoalMl}
              onAddWater={handleAddWater}
              onResetWater={handleResetWater}
              autoResetAtMidnight={profile.autoResetAtMidnight}
              onOpenWaterSettings={() => setShowWaterSettingsModal(true)}
              onOpenSymptomModal={() => {
                setSelectedDay(14);
                setShowSymptomModal(true);
              }}
              onSelectDay={(day) => {
                setSelectedDay(day);
                setActiveTab('dongu');
              }}
              showToast={showToast}
              cycleLength={profile.cycleLength}
              onUpdateMood={handleUpdateMood}
              supplements={supplements}
              onToggleSupplement={handleToggleSupplement}
            />
          )}

          {activeTab === 'dongu' && (
            <CycleTab
              selectedDay={selectedDay}
              onSelectDay={(day) => setSelectedDay(day)}
              onOpenSymptomModal={() => setShowSymptomModal(true)}
              dayDataMap={dayDataMap}
              cycleLength={profile.cycleLength}
            />
          )}

          {activeTab === 'raporlar' && (
            <ReportsTab
              onOpenDoctorReport={() => setShowDoctorReportModal(true)}
            />
          )}

          {activeTab === 'profil' && (
            <ProfileTab
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              showToast={showToast}
              supplements={supplements}
              onAddSupplement={handleAddSupplement}
              onDeleteSupplement={handleDeleteSupplement}
            />
          )}
        </main>

        {/* Bottom Floating Navigation */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Modals & Overlays */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleCompleteOnboarding}
      />

      <SymptomModal
        isOpen={showSymptomModal}
        onClose={() => setShowSymptomModal(false)}
        dayInfo={
          dayDataMap[selectedDay] || {
            date: `2025-04-${String(selectedDay).padStart(2, '0')}`,
            dayNumber: selectedDay,
            dayName: 'Nisan',
            cycleDay: selectedDay,
            phase: selectedDay >= 12 && selectedDay <= 16 ? 'ovulasyon' : 'luteal',
            isToday: selectedDay === 14,
          }
        }
        onSave={handleSaveSymptoms}
      />

      <WaterSettingsModal
        isOpen={showWaterSettingsModal}
        onClose={() => setShowWaterSettingsModal(false)}
        autoResetAtMidnight={profile.autoResetAtMidnight}
        onToggleAutoReset={(val) => {
          handleUpdateProfile({ autoResetAtMidnight: val });
          showToast(
            '00:00 Otomatik Sıfırlama',
            val ? 'Gece sıfırlama aktif edildi.' : 'Gece sıfırlama devre dışı bırakıldı.',
            'water'
          );
        }}
        waterGoalMl={profile.waterGoalMl}
      />

      <DoctorReportModal
        isOpen={showDoctorReportModal}
        onClose={() => setShowDoctorReportModal(false)}
        userName={profile.name}
      />

      {/* Toast Notification Container */}
      <div className="fixed top-20 left-0 right-0 z-50 flex flex-col items-center pointer-events-none px-4 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-pink-100 p-3.5 flex items-start gap-3 animate-in fade-in slide-in-from-top-3 duration-200"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                toast.type === 'water'
                  ? 'bg-blue-100 text-blue-600'
                  : toast.type === 'success'
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-pink-100 text-[#d81b60]'
              }`}
            >
              {toast.type === 'water' ? '💧' : toast.type === 'success' ? '✓' : '🌸'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#1f1a1c]">{toast.title}</p>
              <p className="text-[11px] text-[#5a4044] mt-0.5 leading-snug">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
