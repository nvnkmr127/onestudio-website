'use client';

import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google?: any;
  }
}

// Bangalore center coordinates and 25km radius
const BANGALORE_LAT = 12.9716;
const BANGALORE_LNG = 77.5946;
const RADIUS_METERS = 25000; // 25km

// Featured Bangalore localities within 25km radius for instant fallback suggestions
const BANGALORE_LOCALITIES = [
  'Indiranagar, Bengaluru',
  'Koramangala, Bengaluru',
  'HSR Layout, Bengaluru',
  'Whitefield, Bengaluru',
  'Electronic City, Bengaluru',
  'Jayanagar, Bengaluru',
  'JP Nagar, Bengaluru',
  'Marathahalli, Bengaluru',
  'Hebbal, Bengaluru',
  'Yelahanka, Bengaluru',
  'Sarjapur Road, Bengaluru',
  'Bellandur, Bengaluru',
  'Banashankari, Bengaluru',
  'Malleshwaram, Bengaluru',
  'Rajajinagar, Bengaluru',
  'BTM Layout, Bengaluru',
  'Thanisandra, Bengaluru',
  'Kengeri, Bengaluru',
  'Devanahalli, Bengaluru',
  'Bannerghatta Road, Bengaluru',
  'Domlur, Bengaluru',
  'MG Road, Bengaluru',
  'Sadashivanagar, Bengaluru',
  'Ulsoor, Bengaluru',
  'KR Puram, Bengaluru',
  'Nagarbhavi, Bengaluru',
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

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    (window as any).gm_authFailure = () => {
      console.warn('Google Maps API authentication blocked or restricted. Falling back to local suggestions.');
      setIsGoogleLoaded(false);
    };

    const initAutocomplete = () => {
      if (!inputRef.current || !window.google?.maps?.places) return;

      try {
        const bangaloreCenter = new window.google.maps.LatLng(BANGALORE_LAT, BANGALORE_LNG);
        const circle = new window.google.maps.Circle({
          center: bangaloreCenter,
          radius: RADIUS_METERS,
        });

        const options = {
          bounds: circle.getBounds(),
          strictBounds: true, // Restrict auto-suggest strictly to 25km radius around Bangalore
          componentRestrictions: { country: 'in' },
          fields: ['formatted_address', 'geometry', 'name', 'place_id'],
        };

        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          options
        );

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          const address = place.formatted_address || place.name || inputRef.current?.value || '';
          setQuery(address);
          if (onChange) onChange(address);
          setShowDropdown(false);
        });

        autocompleteRef.current = autocomplete;
        setIsGoogleLoaded(true);
      } catch (err) {
        console.warn('Google Maps Autocomplete init warning:', err);
      }
    };

    if (window.google?.maps?.places) {
      initAutocomplete();
      return;
    }

    if (apiKey) {
      const scriptId = 'google-maps-places-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initAutocomplete();
        };
        document.head.appendChild(script);
      } else {
        const existingScript = document.getElementById(scriptId);
        existingScript?.addEventListener('load', initAutocomplete);
      }
    }
  }, [onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onChange) onChange(val);

    if (!isGoogleLoaded && val.trim().length > 0) {
      const filtered = BANGALORE_LOCALITIES.filter((loc) =>
        loc.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelectSuggestion = (loc: string) => {
    setQuery(loc);
    if (onChange) onChange(loc);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (!isGoogleLoaded && query.trim().length > 0 && suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
          placeholder="Enter location (e.g. Koramangala)"
          required={required}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 pl-11 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-orange/40 focus:border-primary-orange transition-all"
        />
        <div className="absolute left-3.5 text-primary-orange pointer-events-none flex items-center">
          <svg className="w-5 h-5 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      </div>
      <span className="text-[11px] font-medium text-slate-400 ml-1 mt-1 block">
        📍 Restricted to Bangalore &amp; 25km radius
      </span>

      {!isGoogleLoaded && showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((item, idx) => (
            <li
              key={idx}
              onClick={() => handleSelectSuggestion(item)}
              className="px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-primary-orange cursor-pointer flex items-center gap-2 border-b last:border-b-0 border-gray-100"
            >
              <svg className="w-4 h-4 text-primary-orange shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
