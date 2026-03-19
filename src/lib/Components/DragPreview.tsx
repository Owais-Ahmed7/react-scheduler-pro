import React, { CSSProperties } from 'react';

interface DragPreviewProps {
  style: CSSProperties | null;
  title: string;
}

const DragPreview: React.FC<DragPreviewProps> = ({ style, title }) => {
  if (!style) return null;

  return (
    <div className="bs-drag-preview" style={style}>
      <div
        style={{
          padding: '2px 6px',
          fontSize: '12px',
          color: '#0079ff',
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </div>
    </div>
  );
};

export default DragPreview;
