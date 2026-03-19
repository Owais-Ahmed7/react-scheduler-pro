import React, { useEffect, useState } from 'react';

interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive';
}

const LiveRegion: React.FC<LiveRegionProps> = ({ message, politeness = 'polite' }) => {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    // Clear and re-set to trigger announcement
    setAnnouncement('');
    const timer = setTimeout(() => setAnnouncement(message), 100);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {announcement}
    </div>
  );
};

export default LiveRegion;
