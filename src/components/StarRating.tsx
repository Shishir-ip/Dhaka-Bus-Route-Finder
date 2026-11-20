import { Star } from 'lucide-react';

interface DisplayProps {
  rating: number;
  size?: number;
  showValue?: boolean;
}

/** Read-only star display. */
export function StarDisplay({ rating, size = 14, showValue = false }: DisplayProps) {
  const value = Number.isFinite(rating) ? rating : 0;
  if (value <= 0) return null;
  return (
    <span className="inline-flex items-center gap-1" title={`${value.toFixed(1)} / 5`}>
      <span className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={i <= Math.round(value) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}
          />
        ))}
      </span>
      {showValue && <span className="text-xs text-gray-500 dark:text-gray-400">{value.toFixed(1)}</span>}
    </span>
  );
}

interface PickerProps {
  value: number;
  onChange: (value: number) => void;
}

/** Interactive 5-star picker for the admin bus form. Click the current star again to clear. */
export function StarPicker({ value, onChange }: PickerProps) {
  const current = Number.isFinite(value) ? value : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
            onClick={() => onChange(current === i ? 0 : i)}
            className="p-0.5 hover:scale-110 transition-transform"
          >
            <Star
              size={24}
              className={i <= current ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600 hover:text-amber-300'}
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400">{current > 0 ? `${current} / 5` : 'Not rated'}</span>
    </div>
  );
}