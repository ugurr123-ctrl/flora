import React, { useState } from 'react';

interface FloraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  className?: string;
  variant?: 'squircle' | 'circle' | 'minimal';
}

export const FloraLogo: React.FC<FloraLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
  variant = 'squircle',
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* 3D Sacred Lotus Emblem with Golden Pearl */}
      <div className={`relative flex items-center justify-center shrink-0 ${sizeMap[size]}`}>
        {!imageFailed ? (
          <img
            src="/logo.png"
            alt="Flora Cycle Lotus"
            className={`w-full h-full object-cover shadow-sm ${
              variant === 'circle' ? 'rounded-full' : 'rounded-2xl'
            }`}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-[#b0004a] via-[#d81b60] to-[#ffb300] flex items-center justify-center text-white shadow-sm">
            <span className="text-base">🌸</span>
          </div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col select-none">
          <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-[#b0004a] via-[#d81b60] to-[#ad1457] bg-clip-text text-transparent">
            Flora Cycle
          </span>
          <span className="text-[10px] font-semibold text-[#805062] tracking-wider uppercase">
            Biyolojik Ritim Alanı
          </span>
        </div>
      )}
    </div>
  );
};
