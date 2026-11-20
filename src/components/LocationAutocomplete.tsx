import { useState, useRef, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import type { Location } from '../types';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  label: string;
  value: Location | null;
  onChange: (location: Location | null) => void;
  excludeId?: string;
}

export default function LocationAutocomplete({ label, value, onChange, excludeId }: Props) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Location[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { language, t } = useLanguage();
  const { searchLocations, getBusesForLocation } = useData();

  useEffect(() => {
    const q = query.trim();
    if (q) {
      let res = searchLocations(q, language);
      if (excludeId) res = res.filter((r) => r.id !== excludeId);
      setResults(res);
      setIsOpen(true);
      setHighlightIndex(res.length > 0 ? 0 : -1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, language, excludeId, searchLocations]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const select = (loc: Location) => {
    onChange(loc);
    setQuery('');
    setIsOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (isOpen && highlightIndex >= 0 && results[highlightIndex]) {
        e.preventDefault();
        select(results[highlightIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const name = (loc: Location) => (language === 'bn' ? loc.nameBn : loc.nameEn);

  return (
    <div className="relative" ref={rootRef}>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
      {value ? (
        <div className="flex items-center gap-2 px-3 py-2.5 border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-lg">
          <MapPin size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white truncate">{name(value)}</span>
          <button
            onClick={() => {
              onChange(null);
              setQuery('');
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
            aria-label="Clear"
            className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded transition-colors"
          >
            <X size={14} className="text-gray-500" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setIsOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={t('search.placeholder')}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      )}

      {isOpen && query.trim() && (
        <div className="absolute z-30 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden fade-in">
          {results.length > 0 ? (
            results.map((loc, idx) => (
              <button
                key={loc.id}
                onClick={() => select(loc)}
                onMouseEnter={() => setHighlightIndex(idx)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
                  idx === highlightIndex ? 'bg-emerald-50 dark:bg-emerald-950/40' : ''
                }`}
              >
                <MapPin size={14} className="text-gray-400 shrink-0" />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm text-gray-900 dark:text-white truncate">{name(loc)}</span>
                  <span className="block text-xs text-gray-400 truncate">
                    {language === 'bn' ? loc.nameEn : loc.nameBn}
                  </span>
                </span>
                <span className="text-xs text-gray-400 shrink-0">
                  {getBusesForLocation(loc.id).length} {language === 'bn' ? 'বাস' : 'buses'}
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
              {language === 'bn' ? 'কোনো স্থান পাওয়া যায়নি' : 'No matching location'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}