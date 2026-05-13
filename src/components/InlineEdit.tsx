import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Check, X } from 'lucide-react';

interface InlineEditProps {
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'number';
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const InlineEdit: React.FC<InlineEditProps> = ({
  value,
  onChange,
  type = 'text',
  placeholder = '',
  className = '',
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    if (!disabled) {
      setIsEditing(true);
      setEditValue(value);
    }
  };

  const handleSave = () => {
    if (type === 'number') {
      const numValue = parseFloat(editValue as string);
      if (!isNaN(numValue)) {
        onChange(numValue);
      }
    } else {
      onChange(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`input-field flex-1 text-sm ${className}`}
          placeholder={placeholder}
        />
        <button
          onClick={handleSave}
          className="p-1 hover:bg-green-500/20 rounded text-green-400 transition-colors"
        >
          <Check size={16} />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={handleStartEdit}
      className={`${className} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-white/5 px-2 py-1 rounded transition-colors'}`}
    >
      {value || <span className="text-gray-500">{placeholder}</span>}
      {!disabled && (
        <Edit2 size={14} className="inline ml-2 text-gray-400" />
      )}
    </div>
  );
};

export default InlineEdit;
