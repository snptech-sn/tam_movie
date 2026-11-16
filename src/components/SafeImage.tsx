import { useState } from 'react';
import { Film } from 'lucide-react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function SafeImage({ src, alt, className = '', fallbackTitle }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#19191E] via-[#131317] to-[#0E0E11] text-[#A19E95] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Film className="w-8 h-8 mb-2 text-[#D99B26]/70" strokeWidth={1.5} />
        {fallbackTitle && (
          <span className="text-xs font-medium text-[#D6D2C9] line-clamp-2 max-w-[220px]">
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      loading="lazy"
    />
  );
}
