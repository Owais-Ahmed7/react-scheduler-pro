import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface ToggleMultiDayEventsProps {
  multiDayPlaceHFactor: number;
  show: boolean;
  setShowMultiDEvents: Dispatch<SetStateAction<boolean>>;
}

const ToggleMultiDayEvents: React.FC<ToggleMultiDayEventsProps> = ({
  multiDayPlaceHFactor,
  show,
  setShowMultiDEvents,
}) => {
  const [hValue, setHValue] = useState(0);

  useEffect(() => {
    setHValue(multiDayPlaceHFactor);
  }, [multiDayPlaceHFactor]);

  return (
    <div>
      {hValue > 2 && !show && (
        <button
          onClick={() => setShowMultiDEvents(!show)}
          className="btn btn-sm btn-light"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-chevron-down"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </button>
      )}
      {hValue > 2 && show && (
        <button
          onClick={() => setShowMultiDEvents(!show)}
          className="btn btn-sm btn-light"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-chevron-up"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ToggleMultiDayEvents;
