import { useState, useRef, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { Location } from '../types';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { searchLocations } = useData();

  useEffect(() => {
    if (query.trim().length > 0) {
      let res = searchLocations(query, language);
      if (excludeId) res = res.filter(r => r.id !== excludeId);
      setResults(res);
      setIsOpen(true);
      setHighlightIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, language, excludeId, searchLocations]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: Location) => {
    onChange(loc);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(results[highlightIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearSelection = () => {
    onChange(null);
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <div className="relative">
        <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        {value ? (
          <div className="flex items-center gap-2 w-full px-3 py-3 pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl">
            <span className="flex-1 text-gray-900 dark:text-white font-medium">
              {language === 'bn' ? value.nameBn : value.nameEn}
            </span>
            <button
              onClick={clearSelection}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X size={14} className="text-gray-500" />
            </button>
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={language === 'bn' ? 'স্থান খুঁজুন...' : 'Search location...'}
            className="w-full px-3 py-3 pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
          {results.map((loc, idx) => (
            <button
              key={loc.id}
              onClick={() => handleSelect(loc)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                idx === highlightIndex ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
              }`}
            >
              <MapPin size={16} className="text-gray-400 shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {language === 'bn' ? loc.nameBn : loc.nameEn}
                </div>
                {language === 'bn' && (
                  <div className="text-xs text-gray-500">{loc.nameEn}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {language === 'bn' ? 'কোনো স্থান পাওয়া যায়নি' : 'No matching location found'}
          </p>
        </div>
      )}
    </div>
  );
}
