import React, { useState, useEffect } from 'react';
import { useSchoolData } from '../context/SchoolDataContext';

export interface SchoolLogoProps {
  className?: string;
  alt?: string;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  className = 'w-full h-full object-contain',
  alt = 'Logo SMP N 1 Tambak'
}) => {
  const { faviconConfig } = useSchoolData();
  const [hasError, setHasError] = useState(false);

  const rawUrl = faviconConfig?.faviconUrl || '';
  const updatedAt = faviconConfig?.faviconUpdatedAt;

  // Reset error state if faviconUrl or updatedAt changes
  useEffect(() => {
    setHasError(false);
  }, [rawUrl, updatedAt]);

  const defaultLogo = '/logo-sekolah.png?v=2';

  let logoSrc = defaultLogo;
  if (!hasError && rawUrl && rawUrl.trim()) {
    const trimmed = rawUrl.trim();
    if (trimmed.startsWith('data:image/')) {
      logoSrc = trimmed;
    } else {
      const sep = trimmed.includes('?') ? '&' : '?';
      logoSrc = `${trimmed}${sep}v=${updatedAt || Date.now()}`;
    }
  }

  return (
    <img
      src={logoSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => {
        if (!hasError) {
          setHasError(true);
        }
      }}
      className={className}
    />
  );
};
