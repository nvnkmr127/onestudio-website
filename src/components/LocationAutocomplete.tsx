'use client';

import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google?: any;
  }
}

// Hyderabad center coordinates and 35km radius
const HYDERABAD_LAT = 17.3850;
const HYDERABAD_LNG = 78.4867;
const RADIUS_METERS = 35000; // 35km

// Featured Hyderabad localities for instant fallback suggestions
const HYDERABAD_LOCALITIES = [
  'Jubilee Hills, Hyderabad',
  'Banjara Hills, Hyderabad',
  'Gachibowli, Hyderabad',
  'Hitec City, Hyderabad',
  'Kondapur, Hyderabad',
  'Madhapur, Hyderabad',
  'Manikonda, Hyderabad',
  'Financial District, Nanakramguda, Hyderabad',
  'Kokapet, Hyderabad',
  'Tellapur, Hyderabad',
  'Nallagandla, Hyderabad',
  'Kukatpally, Hyderabad',
  'Miyapur, Hyderabad',
  'Begumpet, Hyderabad',
  'Somajiguda, Hyderabad',
  'Ameerpet, Hyderabad',
  'Himayatnagar, Hyderabad',
  'SR Nagar, Hyderabad',
  'Attapur, Hyderabad',
  'LB Nagar, Hyderabad',
  'Uppal, Hyderabad',
  'Secunderabad, Telangana',
  'Kompally, Hyderabad',
  'Shaikpet, Hyderabad',
  'Puppalaguda, Hyderabad',
  'Khajaguda, Hyderabad',
];

interface LocationAutocompleteProps {
  value?: string;
  onChange?: (val: string) => void;
  required?: boolean;
}

export default function LocationAutocomplete({
  value: initialValue = '',
  onChange,
  required = true,
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const autocompleteServiceRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const checkGoogle = () => {
      if (window.google?.maps?.places?.AutocompleteService) {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        setIsGoogleLoaded(true);
      }
    };
    checkGoogle();
    const timer = setInterval(checkGoogle, 500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onChange) onChange(val);

    if (!val.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    if (isGoogleLoaded && autocompleteServiceRef.current) {
      const hydCenter = new window.google.maps.LatLng(HYDERABAD_LAT, HYDERABAD_LNG);
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: val,
          location: hydCenter,
          radius: RADIUS_METERS,
          componentRestrictions: { country: 'in' },
        },
        (predictions: any[], status: any) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions.map((p) => p.description));
            setShowDropdown(true);
          } else {
            fallbackFilter(val);
          }
        }
      );
    } else {
      fallbackFilter(val);
    }
  };

  const fallbackFilter = (text: string) => {
    const filtered = HYDERABAD_LOCALITIES.filter((loc) =>
      loc.toLowerCase().includes(text.toLowerCase())
    );
    setSuggestions(filtered);
    setShowDropdown(filtered.length > 0);
  };

  const handleSelect = (loc: string) => {
    setQuery(loc);
    if (onChange) onChange(loc);
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim() && suggestions.length > 0) setShowDropdown(true);
          }}
          placeholder="e.g. Jubilee Hills, Gachibowli, Kokapet"
          required={required}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl py-3 px-4 text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
        />
        <span className="absolute right-3.5 text-slate-400 text-xs font-bold pointer-events-none">
          📍 HYD
        </span>
      </div>

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-1 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto font-sans">
          {suggestions.map((loc, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(loc)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-amber-400 cursor-pointer border-b border-slate-800/60 last:border-none flex items-center gap-2"
            >
              <span>📍</span>
              {loc}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
