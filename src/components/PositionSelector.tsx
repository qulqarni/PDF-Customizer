import React from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Position } from '../types';

interface PositionSelectorProps {
  value: Position;
  onChange: (position: Position) => void;
  label: string;
}

const PositionSelector: React.FC<PositionSelectorProps> = ({ value, onChange, label }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">{label}:</span>
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => onChange('left')}
          className={`p-1.5 rounded ${
            value === 'left' ? 'bg-white shadow' : 'hover:bg-gray-200'
          }`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onChange('center')}
          className={`p-1.5 rounded ${
            value === 'center' ? 'bg-white shadow' : 'hover:bg-gray-200'
          }`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={() => onChange('right')}
          className={`p-1.5 rounded ${
            value === 'right' ? 'bg-white shadow' : 'hover:bg-gray-200'
          }`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PositionSelector;