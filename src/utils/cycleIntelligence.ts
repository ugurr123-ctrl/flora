import { ConceptionInfo, MoodAdvice, CyclePhase } from '../types';

/**
 * Accurately calculates conception probability based on cycle day and cycle length.
 * Ovulation is typically 14 days before the next period (Luteal phase is stable ~14 days).
 */
export function calculateConceptionProbability(
  cycleDay: number,
  cycleLength: number = 28
): ConceptionInfo {
  const ovulationDay = Math.max(10, cycleLength - 14);
  const diff = cycleDay - ovulationDay;
  const daysToPeak = ovulationDay - cycleDay;

  // Ovulation Day (Peak)
  if (diff === 0) {
    return {
      percentage: 88,
      label: '%88 Çok Yüksek (Zirve)',
      status: 'Zirve',
      tagColor: 'bg-rose-100 text-[#b0004a] border-rose-300',
      explanation: 'Bugün ovülasyon günü! Olgun folikül çatlayarak yumurta salındı. Gebe kalma şansının biyolojik olarak dorukta olduğu 24 saatlik penceredesiniz.',
      daysToPeak: 0,
    };
  }

  // 1 day before ovulation (Optimal)
  if (diff === -1) {
    return {
      percentage: 82,
      label: '%82 Çok Yüksek',
      status: 'Çok Yüksek',
      tagColor: 'bg-pink-100 text-[#b0004a] border-pink-300',
      explanation: 'Yumurtlamadan 24 saat önce. Sperm canlılığı ve LH piki sebebiyle gebe kalma ihtimali en yüksek seviyededir.',
      daysToPeak: 1,
    };
  }

  // 2 days before ovulation
  if (diff === -2) {
    return {
      percentage: 70,
      label: '%70 Yüksek',
      status: 'Yüksek',
      tagColor: 'bg-pink-100 text-[#b0004a] border-pink-200',
      explanation: 'Doğurgan pencere doruğa yaklaşıyor. Östrojen zirvesi rahim ortamını optimize ediyor.',
      daysToPeak: 2,
    };
  }

  // 3-4 days before ovulation
  if (diff === -3 || diff === -4) {
    return {
      percentage: diff === -3 ? 55 : 38,
      label: diff === -3 ? '%55 Yüksek' : '%38 Orta-Yüksek',
      status: 'Yüksek',
      tagColor: 'bg-pink-50 text-[#b0004a] border-pink-200',
      explanation: 'Doğurganlık penceresi açıldı. Spermler kadın üreme kanalında 3-5 gün canlı kalabilir.',
      daysToPeak: -diff,
    };
  }

  // 5 days before ovulation
  if (diff === -5) {
    return {
      percentage: 22,
      label: '%22 Orta',
      status: 'Orta',
      tagColor: 'bg-amber-50 text-amber-800 border-amber-200',
      explanation: 'Doğurgan pencerenin başlangıç sınırı. Foliküler fazın sonuna yaklaşılıyor.',
      daysToPeak: 5,
    };
  }

  // 1 day after ovulation
  if (diff === 1) {
    return {
      percentage: 35,
      label: '%35 Orta (Hızlı Düşüş)',
      status: 'Orta',
      tagColor: 'bg-amber-50 text-amber-800 border-amber-200',
      explanation: 'Yumurta salındıktan sonra 12-24 saat yaşayabilir; luteal faz başlangıcında pencere kapanmak üzeredir.',
      daysToPeak: -1,
    };
  }

  // Follicular phase (before fertile window)
  if (cycleDay > 5 && diff < -5) {
    return {
      percentage: 12,
      label: '%12 Düşük',
      status: 'Düşük',
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      explanation: 'Foliküler faz: Östrojen yükseliyor, yeni foliküller olgunlaşıyor. Henüz ovülasyona birkaç gün var.',
      daysToPeak: Math.max(1, -diff),
    };
  }

  // Menstrual phase (days 1-5)
  if (cycleDay <= 5) {
    return {
      percentage: 2,
      label: '<%3 Çok Düşük',
      status: 'Çok Düşük',
      tagColor: 'bg-gray-100 text-gray-700 border-gray-200',
      explanation: 'Regl kanaması dönemi. Rahim içi astar yenilenmektedir; gebe kalma olasılığı istatistiki olarak asgaridir.',
      daysToPeak: ovulationDay - cycleDay,
    };
  }

  // Luteal phase & PMS (diff > 1)
  return {
    percentage: 3,
    label: '<%5 Çok Düşük',
    status: 'Çok Düşük',
    tagColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    explanation: 'Luteal faz / PMS: Progesteron hakimiyetinde döllenme penceresi kapanmıştır; beden dinlenme evresindedir.',
    daysToPeak: (cycleLength - cycleDay) + ovulationDay,
  };
}

/**
 * Returns customized comforting self-care, pre-anger mitigation, and PMS soothing advice
 * based on the logged mood, PMS proximity, and current cycle day.
 */
export function getMoodComfortAdvice(
  mood: string = 'Mutlu',
  cycleDay: number = 14,
  cycleLength: number = 28
): MoodAdvice {
  const isPmsPhase = cycleDay >= cycleLength - 5;
  const moodLower = mood.toLowerCase();

  // 1. ÖFKELİ / SİNİRLİ veya PMS DÖNEMİNDEKİ HASSASİYET (ÖFKE ÖNCESİ RAHATLATMA)
  if (moodLower.includes('sinirli') || moodLower.includes('öfke') || (isPmsPhase && (moodLower.includes('hassas') || moodLower.includes('yorgun')))) {
    return {
      title: '🕊️ Öfke & Gerginlik Öncesi Şefkatli Sığınak',
      subtitle: isPmsPhase
        ? 'PMS evresinde progesteron dalgalanması tahammülü azaltabilir. Bu senin suçun değil, bedenin sakinlik istiyor.'
        : 'Yükselen nabız ve gerginlik hissini yatıştırmak için birkaç dakikalık botanik bir mola ver.',
      tag: 'Öfke Öncesi Rahatlama',
      colorTheme: 'from-rose-500/10 via-amber-50/50 to-pink-50/80 border-rose-200 text-rose-950',
      soothingTechnique: '4-7-8 Yatıştırıcı Nefes: 4 sn burnundan derin nefes al, 7 sn tut, 8 sn boyunca fısıltıyla bırak. Kortizol seviyen 90 saniyede dengelenir.',
      herbalDrink: 'Melisa, Papatya & Çarkıfelek (Passiflora) çayı. Yanına 1 çay kaşığı bal ekleyerek GABA reseptörlerini sakinleştir.',
      nutritionTip: '200 mg Magnezyum Bisglisinat + 1 avuç kabak çekirdeği. Sinir sistemi gerginliğini ve kas kasılmalarını çözer.',
      affirmation: '"Şu an hissettiğim öfkeyi ve gerginliği yargılamıyorum. Derin bir nefes alıyor ve sakinleşmeyi seçiyorum."',
      isHighAlert: true,
    };
  }

  // 2. HASSAS / DUYGUSAL MOD
  if (moodLower.includes('hassas') || moodLower.includes('üzgün')) {
    return {
      title: '🌸 Şefkatli Ruh Hali & Öz-Bakım Kalkanı',
      subtitle: 'Duygusal algıların bugün çok açık ve derin. Kendine ekstra nazik davranma vakti.',
      tag: 'Duygusal Esenlik',
      colorTheme: 'from-purple-500/10 via-pink-50/50 to-white border-purple-200 text-purple-950',
      soothingTechnique: 'Gözlerini kapatıp ellerini kalbinin ve karnının üzerine koy. Bedeninin sıcaklığını hissederek 5 yavaş diyafram nefesi al.',
      herbalDrink: 'Gül goncası & Lavanta çayı. Ruhsal yorgunluğu ve kalp çarpıntısını hafifletir.',
      nutritionTip: 'Kompleks karbonhidratlar (yulaf, fırınlanmış tatlı patates) serotonin sentezini doğal olarak destekler.',
      affirmation: '"Duygularım değerli. Bedenimin ritmine teslim oluyor ve kendimi olduğum gibi kabul ediyorum."',
      isHighAlert: false,
    };
  }

  // 3. YORGUN / TÜKENMİŞ MOD
  if (moodLower.includes('yorgun') || moodLower.includes('tüken')) {
    return {
      title: '🌙 Adrenal Dinlenme & Sessiz Yenilenme',
      subtitle: 'Bedenin enerji rezervlerini korumak istiyor. Bugün ağır görevleri ertelemek bir zayıflık değil, biyolojik bilgeliktir.',
      tag: 'Yenilenme Molası',
      colorTheme: 'from-indigo-500/10 via-pink-50/40 to-white border-indigo-200 text-indigo-950',
      soothingTechnique: 'Ayakları duvara yaslama (Viparita Karani) pozunda 8 dakika uzan. Bacaklardaki venöz dolaşımı ve beyne giden kan akışını rahatlatır.',
      herbalDrink: 'Ihlamur veya Zencefil-Limon çayı. Beden ısısını dengeler ve bağışıklık rezervlerini besler.',
      nutritionTip: 'Elektrolitli ılık su ve birkaç ceviz içi. Adrenal yorgunluğu hızlıca hafifletir.',
      affirmation: '"Dinlenmek benim hakkım. Bedenimin dur çağrısını sevgiyle dinliyorum."',
      isHighAlert: false,
    };
  }

  // 4. CANLI / ENERJİK / MUTLU (Foliküler & Ovülasyon Zirvesi)
  return {
    title: '✨ Zirve Biyo-Vitalite & Yaratıcı Güç',
    subtitle: 'Östrojen ve mutluluk hormonların tepe noktasında! Yüksek motivasyonunu yeni projelere ve sevdiklerine aktar.',
    tag: 'Zirve Enerji',
    colorTheme: 'from-amber-400/15 via-rose-50/50 to-emerald-50/30 border-amber-200 text-amber-950',
    soothingTechnique: 'Dinamik 15 dakikalık yürüyüş veya dans. Artan enerjiyi endorfin patlamasına dönüştür.',
    herbalDrink: 'Matcha veya Taze Nane & Limonlu canlı su. Hücresel odaklanmayı berraklaştırır.',
    nutritionTip: 'Renkli sebzeler, taze somon ve avokado. Yumurta sağlığını ve mitokondriyal enerjiyi besler.',
    affirmation: '"Canlıyım, dengeliyim ve biyolojik ritmimle kusursuz bir uyum içindeyim."',
    isHighAlert: false,
  };
}

/**
 * Returns scientific insights, diet, exercise and reminder prompts for the Follicular Phase.
 */
export function getFollicularPhaseGuidance(cycleDay: number) {
  return {
    phaseName: 'Foliküler Faz (Yenilenme & Östrojen Yükselişi)',
    dayRange: '6 - 11. Günler',
    overview: 'Regl kanamasının bitişiyle hipofiz bezi FSH (Folikül Uyarıcı Hormon) salgılar. Yumurtalıklarda yeni bir folikül olgunlaşırken östrojen her gün artarak zihinsel berraklık, yüksek enerji ve pürüzsüz bir cilt sağlar.',
    reminders: [
      {
        title: '🌱 Zihinsel Odak & Yeni Başlangıçlar',
        desc: 'Beyindeki östrojen reseptörleri aktifleşti. Yeni beceriler öğrenmek, toplantılar planlamak ve cesur adımlar atmak için en verimli evredesiniz.',
        icon: '💡',
      },
      {
        title: '🥗 Foliküler Beslenme & Güç',
        desc: 'Östrojen metabolizmasını dengelemek için brokoli filizi, fermente kefir/lahana turşusu ve kabak çekirdeği tüketin.',
        icon: '🥑',
      },
      {
        title: '🏃‍♀️ Dinamik Egzersiz & Güç Antrenmanı',
        desc: 'Kas yenilenme hızı artıyor. Kademeli ağırlık çalışmaları, tempolu koşu ve dinamik pilates için haftanın en iyi günleri.',
        icon: '⚡',
      },
      {
        title: '🌸 Cilt Işıltısı & Kolajen Üretimi',
        desc: 'Östrojen ciltteki hyalüronik asit üretimini uyarır. Cildiniz doğal olarak neme doyar ve parlar.',
        icon: '✨',
      },
    ],
  };
}
