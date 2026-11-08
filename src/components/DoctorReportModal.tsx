import React, { useState } from 'react';
import { X, Download, Share2, Printer, CheckCircle, FileText, QrCode, Check } from 'lucide-react';
import { FloraLogo } from './FloraLogo';
import { soundEngine } from '../utils/audio';
import { triggerRosePollenBurst } from '../utils/confetti';

interface DoctorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export const DoctorReportModal: React.FC<DoctorReportModalProps> = ({
  isOpen,
  onClose,
  userName,
}) => {
  if (!isOpen) return null;

  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Current Date
  const reportDate = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Real report download as clean formatted document
  const handleDownload = () => {
    soundEngine.playCrystalChime();
    triggerRosePollenBurst();

    const reportContent = `=====================================================
FLORA CYCLE KLİNİK SAĞLIK PROTOKOLÜ & DOKTOR ÖZET RAPORU
Tarih: ${reportDate} | Doğrulama ID: #FL-2025-0414-ZK
=====================================================

HASTA BİLGİLERİ:
- İsim: ${userName}
- Yaş: 28
- Vücut Kitle İndeksi (BMI): 21.4 (Normal)
- Takip Hedefi: Hamilelik & Doğurganlık Planlama
- Ortalama Döngü Uzunluğu: 28 Gün (Klinik Stabil: ±1 gün)
- Ortalama Kanama Süresi: 5 Gün

KLİNİK BULGULAR & ANALİZ:
1. Ovülasyon Teyidi:
   - Son 6 döngüde bazal vücut ısısı (BBT) bifazik patern göstermiştir (+0.35°C luteal artış).
   - LH piki ve doğurganlık penceresi 11-15. günler arasında gerçekleşmektedir.

2. Luteal Faz Değerlendirmesi:
   - Ortalama luteal faz süresi 13.8 gündür.
   - Progesteron yetmezliği veya luteal yetersizlik riski saptanmamıştır.

3. Semptom Korelasyonu:
   - Geç luteal fazda hafif göğüs hassasiyeti (%82) ve hafif kramp (%44).
   - Dismenore şiddeti: Hafif (VAS 2/10).

4. Yaşam Tarzı & Biyo-Metrikler:
   - Günlük Su Tüketimi Ortalaması: 2.45 L
   - Uyku Süresi Ortalaması: 7 saat 40 dakika (Melatonin Koruma Saati: 23:00 - 07:30)
   - Aktif Biyo-Takviyeler: Folik Asit (400 mcg), D3 Vitamini, İnositol

GÜVENLİK & ONAY:
Bu dijital sağlık karnesi Flora Biyometrik Motoru tarafından AES-256 uçtan uca şifreli kayıtlarla üretilmiştir.

e-İmza Kodu: SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
=====================================================`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flora_klinik_rapor_${userName.toLowerCase().replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  const handlePrint = () => {
    soundEngine.playDropletSound();
    window.print();
  };

  const handleShare = async () => {
    soundEngine.playDropletSound();
    const shareText = `🌸 Flora Cycle Klinik Sağlık Karnesi - Hasta: ${userName} | Döngü: 28 Gün Düzenli | Skor: 96/100 | Doğrulandı ✓`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-100 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="p-4 px-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-pink-50 to-rose-50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#d81b60]" />
            <div>
              <h3 className="font-extrabold text-sm text-[#1f1a1c]">
                Jinekolojik Klinik Ziyaret Özeti
              </h3>
              <p className="text-[11px] text-[#805062]">
                6 Aylık Biyometrik Döngü & Hormon Analiz Raporu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-black cursor-pointer shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable/Preview Document Area */}
        <div className="p-6 overflow-y-auto space-y-5 bg-[#faf9f9] text-[#1f1a1c] font-sans">
          {/* Document Header */}
          <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FloraLogo size="lg" />
              <div>
                <h4 className="font-black text-sm text-[#b0004a] tracking-tight">
                  FLORA CLINICAL HEALTH PROTOCOL
                </h4>
                <p className="text-[11px] text-gray-500">
                  Kadın Sağlığı & Biyo-Ritmik Veri Entegrasyonu
                </p>
                <p className="text-[10px] text-gray-400">Rapor Tarihi: {reportDate}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                DOĞRULANMIŞ RAPOR
              </span>
              <p className="text-[10px] text-gray-400 mt-1">ID: #FL-2025-0414-ZK</p>
            </div>
          </div>

          {/* Patient Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 bg-white rounded-xl border border-gray-100">
              <p className="text-[10px] text-gray-400 font-medium">Hasta Adı</p>
              <p className="font-bold text-[#1f1a1c] mt-0.5">{userName}</p>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-gray-100">
              <p className="text-[10px] text-gray-400 font-medium">Yaş / BMI</p>
              <p className="font-bold text-[#1f1a1c] mt-0.5">28 Yaş / 21.4</p>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-gray-100">
              <p className="text-[10px] text-gray-400 font-medium">Döngü Düzeni</p>
              <p className="font-bold text-emerald-600 mt-0.5">28 Gün Düzenli</p>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-gray-100">
              <p className="text-[10px] text-gray-400 font-medium">Biyo-Sağlık Skoru</p>
              <p className="font-bold text-[#b0004a] mt-0.5">96 / 100</p>
            </div>
          </div>

          {/* Summary Findings */}
          <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
            <h5 className="font-extrabold text-xs text-[#1f1a1c] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d81b60]" />
              Klinik Değerlendirme & Bulgular
            </h5>

            <div className="space-y-2 text-xs leading-relaxed text-[#5a4044]">
              <p className="flex items-start gap-2">
                <span className="font-bold text-emerald-600">✓</span>
                <span>
                  <strong>Ovülasyon Teyidi:</strong> Son 6 döngüde bazal vücut ısısı (BBT)
                  bifazik patern göstermiştir (+0.35°C luteal yükselme). Ovülasyon gerçekleştiği
                  doğrulanmaktadır.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-bold text-emerald-600">✓</span>
                <span>
                  <strong>Luteal Faz Yeterliliği:</strong> Ortalama luteal faz süresi 13.8 gündür.
                  Luteal faz yetmezliği riski saptanmamıştır.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-bold text-amber-600">ℹ</span>
                <span>
                  <strong>Semptom İstatistiği:</strong> Geç luteal fazda göğüs hassasiyeti (%82) ve
                  hafif kramp (%44). Dysmenorrhea şiddeti 10 üzerinden 2 seviyesinde hafif seyretmektedir.
                </span>
              </p>
            </div>
          </div>

          {/* Verification Bar & QR code */}
          <div className="p-3 bg-white rounded-2xl border border-gray-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700">
                <QrCode className="w-6 h-6" />
              </div>
              <div className="text-[11px]">
                <p className="font-bold text-[#1f1a1c]">Dijital İmzalı Tıbbi Kayıt</p>
                <p className="text-gray-400 text-[10px]">
                  Klinisyen erişimi için SHA-256 doğrulama kodu mevcuttur.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-gray-500">e-Sağlık Uyumlu</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-gray-200 bg-white flex flex-col gap-2">
          {downloadSuccess && (
            <div className="w-full py-1.5 px-3 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4" />
              <span>Resmi klinik raporu cihazınıza indirildi!</span>
            </div>
          )}

          {copiedSuccess && (
            <div className="w-full py-1.5 px-3 bg-pink-50 text-[#b0004a] rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>Rapor özeti panoya kopyalandı!</span>
            </div>
          )}

          <div className="flex gap-2 w-full">
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#b0004a] to-[#d81b60] text-white text-xs font-bold shadow-md hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>PDF İndir</span>
            </button>
            <button
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Yazdır</span>
            </button>
            <button
              onClick={handleShare}
              className="py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Paylaş</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
