import React from 'react';

interface MarginControlsProps {
  xMargin: number;
  yMargin: number;
  onXMarginChange: (value: number) => void;
  onYMarginChange: (value: number) => void;
}

const MarginControls: React.FC<MarginControlsProps> = ({
  xMargin,
  yMargin,
  onXMarginChange,
  onYMarginChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="block text-sm text-gray-600 mb-1">X Margin</label>
        <input
          type="number"
          value={xMargin}
          onChange={(e) => onXMarginChange(Number(e.target.value))}
          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
          min="0"
          max="1000"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Y Margin</label>
        <input
          type="number"
          value={yMargin}
          onChange={(e) => onYMarginChange(Number(e.target.value))}
          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
          min="0"
          max="1000"
        />
      </div>
    </div>
  );
};

export default MarginControls;