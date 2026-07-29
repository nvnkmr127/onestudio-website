'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
declare const google: any;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { openCallModal } from '@/components/CallModal';
import LocationAutocomplete from '@/components/LocationAutocomplete';

// ─── Data Definitions ──────────────────────────────────────────────────────────

const HOME_TYPES = [
  {
    id: '1bhk',
    text: '1 BHK',
    icon: '🛏️',
    sqft: '600 - 800 sq.ft',
    basePrice: 300000,
    wardrobes: 1,
    tag: 'Compact Living',
    tooltip: 'Ideal for compact 1 BHK homes. Includes 1 modular wardrobe.',
  },
  {
    id: '2bhk',
    text: '2 BHK',
    icon: '🏠',
    sqft: '800 - 1200 sq.ft',
    tag: 'Most Popular',
    tooltip: 'Select your 2 BHK floor area size.',
    subOptions: [
      { text: 'Compact 2BHK', description: 'Below 900 sq.ft', basePrice: 420000, wardrobes: 1 },
      { text: 'Standard 2BHK', description: '900 - 1200 sq.ft', basePrice: 470000, wardrobes: 2 },
    ],
  },
  {
    id: '3bhk',
    text: '3 BHK',
    icon: '🏰',
    sqft: '1200 - 1800 sq.ft',
    tag: 'Spacious Family',
    tooltip: 'Select your 3 BHK floor area size.',
    subOptions: [
      { text: 'Small 3BHK', description: 'Below 1200 sq.ft', basePrice: 580000, wardrobes: 2 },
      { text: 'Large 3BHK', description: 'Above 1200 sq.ft', basePrice: 650000, wardrobes: 3 },
    ],
  },
  {
    id: '4bhk',
    text: '4 BHK',
    icon: '🏛️',
    sqft: '1800 - 2500 sq.ft',
    tag: 'Premium Residence',
    tooltip: 'Select your 4 BHK floor area size.',
    subOptions: [
      { text: 'Standard 4BHK', description: '1800 - 2200 sq.ft', basePrice: 750000, wardrobes: 3 },
      { text: 'Large 4BHK', description: 'Above 2200 sq.ft', basePrice: 850000, wardrobes: 4 },
    ],
  },
  {
    id: '5bhk',
    text: '5 BHK +',
    icon: '👑',
    sqft: '2500+ sq.ft',
    tag: 'Grand Living',
    tooltip: 'Select size for large luxury homes.',
    subOptions: [
      { text: 'Standard 5BHK', description: '2500 - 3000 sq.ft', basePrice: 900000, wardrobes: 4 },
      { text: 'Grand Penthouse', description: 'Above 3000 sq.ft', basePrice: 1050000, wardrobes: 5 },
    ],
  },
  {
    id: 'villa',
    text: 'Villa / Duplex',
    icon: '🏡',
    sqft: '2000+ sq.ft',
    tag: 'Bespoke Haven',
    tooltip: 'Select your Villa layout specification.',
    subOptions: [
      { text: 'Compact Villa', description: '2000 - 2800 sq.ft', basePrice: 800000, wardrobes: 3 },
      { text: 'Luxury Villa', description: 'Above 2800 sq.ft', basePrice: 950000, wardrobes: 4 },
    ],
  },
];

const KITCHEN_TYPES = [
  {
    id: 'straight',
    text: 'Straight Kitchen',
    icon: '📐',
    value: 50000,
    tag: 'Studio Preferred',
    desc: 'Single-wall streamlined setup with high ergonomics.',
  },
  {
    id: 'lshape',
    text: 'L-Shaped Kitchen',
    icon: '🍳',
    value: 50000,
    tag: 'Customer Choice',
    desc: 'Maximizes corner utility and continuous work triangle.',
  },
  {
    id: 'ushape',
    text: 'U-Shaped Kitchen',
    icon: '🍲',
    value: 50000,
    tag: 'Max Storage',
    desc: 'Surrounding triple counter area for multi-cook convenience.',
  },
  {
    id: 'island',
    text: 'Island Kitchen',
    icon: '🏝️',
    value: 50000,
    tag: 'Luxury Gourmet',
    desc: 'Independent center island for dining, prep & social cooking.',
  },
  {
    id: 'parallel',
    text: 'Parallel (Galley)',
    icon: '▥',
    value: 50000,
    tag: 'Chef Workflow',
    desc: 'Dual parallel counters designed for professional efficiency.',
  },
];

const STYLE_PACKAGES = [
  {
    id: 'rent',
    name: 'Rent Essential',
    tagline: 'Durable & Functional',
    priceIndicator: '₹',
    multiplier: 0.7,
    popular: false,
    badge: 'RENTAL READY',
    description: 'High-durability, low-maintenance designs engineered for rental yield & quick delivery.',
    features: [
      'Basic Layout & Color Scheme',
      'Commercial Grade Plywood Core',
      'Kitchen: Carcass + Standard Gloss Laminates',
      'Soft-close Drawers & Standard Handles',
      '1-Year Post Handover Support',
    ],
  },
  {
    id: 'essentials',
    name: 'Home Essentials',
    tagline: 'Smart Comfort',
    priceIndicator: '₹₹',
    multiplier: 0.9,
    popular: false,
    badge: 'BEST VALUE',
    description: 'Perfect balance of aesthetics and daily utility for modern apartment living.',
    features: [
      '2D Space Layout & Storage Planning',
      'BWR Grade Anti-Termite Plywood',
      'Kitchen: Acrylic / Textured Anti-Scratch Laminate',
      'Living Room Designer False Ceiling Accent',
      'Up to 5 Years Structural Warranty',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Signature',
    tagline: 'Refined Luxury & Finish',
    priceIndicator: '₹₹₹',
    multiplier: 1.2,
    popular: true,
    badge: 'RECOMMENDED CHOICE',
    description: 'Superior finishes, custom cove lighting, German hardware & dedicated design manager.',
    features: [
      'Dedicated Interior Architect & 3D Walkthrough Renders',
      'HDHMR & High-Density BWP Marine Plywood Core',
      'Hettich / Hafele Soft-Close Hardware Fittings',
      'Full False Ceiling with Integrated Ambient LED Strips',
      'Up to 10 Years Warranty + Priority Maintenance',
    ],
  },
  {
    id: 'luxe',
    name: 'Luxe Bespoke',
    tagline: 'Ultra Luxury Architecture',
    priceIndicator: '₹₹₹₹',
    multiplier: 1.8,
    popular: false,
    badge: 'BESPOKE OPULENCE',
    description: 'Handcrafted custom luxury featuring veneer, PU polish, and home automation provisions.',
    features: [
      'Personalized End-to-End Interior Architecture',
      'Natural Veneer, Fluted Panels & PU Gloss Finishes',
      'Blum Premium Electronic Push-to-Open Hardware',
      'Automated Architectural Lighting Design',
      'Lifetime Priority Warranty & Dedicated Concierge',
    ],
  },
];

const WHATS_INCLUDED = [
  { room: 'Living & Dining', icon: '🛋️', details: 'Custom TV Unit, False Ceiling, Ambient LED Cove, Shoe Console & Feature Wall accents.' },
  { room: 'Modular Kitchen', icon: '🍳', details: 'BWP Modular Cabinets, Tandem Drawers, Loft Storage, Countertop Backsplash & Appliance spaces.' },
  { room: 'Master Suite', icon: '🛏️', details: 'Floor-to-Ceiling Sliding Wardrobe, Dressing Console, Bed Headboard & Accent Lighting.' },
  { room: 'Guest / Kids Room', icon: '🚪', details: 'Modular Hinged Wardrobe, Overhead Loft, Study Desk & Floating Book Shelving.' },
  { room: 'Foyer & Balcony', icon: '🌿', details: 'Entryway Shoe Console, Decorative Wall Sconces & Balcony Turf Decking options.' },
];

const STEPS = [
  { step: '01', title: 'Home Type', desc: 'Scope & Floor size' },
  { step: '02', title: 'Kitchen Layout', desc: 'Modular geometry' },
  { step: '03', title: 'Design Tier', desc: 'Material & Package' },
  { step: '04', title: 'Unlock Estimate', desc: 'Instant breakdown' },
];

const TRUST_PILLARS = [
  { icon: '🛡️', title: '10-Year Warranty', desc: 'Tested BWP marine plywood & branded fittings' },
  { icon: '⏱️', title: '45-Day Delivery', desc: 'Guaranteed on-time handover or we pay rent' },
  { icon: '💰', title: 'No Cost Overruns', desc: '100% transparent pricing with zero hidden fees' },
  { icon: '🏬', title: 'Factory Direct', desc: 'Precision CNC German machinery manufacturing' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatINR(n: number) {
  return n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function isServedLocation(addr: string) {
  const lower = addr.toLowerCase();
  return ['hyderabad', 'jubilee hills', 'banjara hills', 'gachibowli', 'hitec city', 'kondapur', 'madhapur',
    'manikonda', 'financial district', 'kokapet', 'tellapur', 'nallagandla', 'kukatpally', 'miyapur',
    'begumpet', 'somajiguda', 'telangana', 'secunderabad', 'kompally', 'attapur', 'puppalaguda'].some(r => lower.includes(r));
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function InteriorEstimator() {
  const [step, setStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedType, setExpandedType] = useState<number | null>(1); // 2BHK expanded default
  const [selections, setSelections] = useState<{
    homeType: any;
    kitchenType: typeof KITCHEN_TYPES[0] | null;
    stylePackage: typeof STYLE_PACKAGES[0];
  }>({
    homeType: { ...HOME_TYPES[1], text: 'Standard 2BHK', description: '900 - 1200 sq.ft', basePrice: 470000, wardrobes: 2, originalText: '2 BHK' },
    kitchenType: KITCHEN_TYPES[1], // L-shaped default
    stylePackage: STYLE_PACKAGES[2], // Premium default
  });

  // Lead Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [countryCode, setCountryCode] = useState('91');

  // OTP State
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [displayPhone, setDisplayPhone] = useState('');
  const [resendSeconds, setResendSeconds] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // UI States
  const [viewerCount, setViewerCount] = useState(18);
  useEffect(() => {
    setViewerCount(Math.floor(Math.random() * 12) + 18);
  }, []);
  const [countdown, setCountdown] = useState('24:59');
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [exitPhone, setExitPhone] = useState('');
  const [alertMsg, setAlertMsg] = useState<{ title: string; body: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<any[]>([]);
  const [animatedCost, setAnimatedCost] = useState(0);

  // Refs
  const exitShownRef = useRef(false);
  const leadCapturedRef = useRef(false);
  const resendIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const propertyInputRef = useRef<HTMLInputElement>(null);
  const placesInitRef = useRef(false);

  // Calculated Price & Duration
  const baseCost = (selections.homeType?.basePrice ?? 470000) + (selections.kitchenType?.value ?? 50000);
  const currentTotal = Math.round(baseCost * selections.stylePackage.multiplier);

  // Home Loan & Duration State
  const [loanPercent, setLoanPercent] = useState<number>(80);
  const [tenureYears, setTenureYears] = useState<number>(10);
  const [interestRate, setInterestRate] = useState<number>(8.5);

  const estimatedDays = selections.homeType?.id === '1bhk'
    ? 35
    : selections.homeType?.id === '2bhk'
    ? 40
    : selections.homeType?.id === '3bhk'
    ? 45
    : selections.homeType?.id === '4bhk'
    ? 55
    : 60;

  const targetCost = showSuccess ? animatedCost : currentTotal;
  const principalLoanAmount = Math.round(targetCost * (loanPercent / 100));
  const monthlyInterestRate = interestRate / (12 * 100);
  const totalMonths = tenureYears * 12;
  const monthlyEmi = Math.round(
    (principalLoanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) /
      (Math.pow(1 + monthlyInterestRate, totalMonths) - 1)
  );

  // Countdown Timer
  useEffect(() => {
    const DURATION = 25 * 60 * 1000;
    let deadline = Number(localStorage.getItem('ie_deadline') || 0);
    if (!deadline || Date.now() > deadline) {
      deadline = Date.now() + DURATION;
      localStorage.setItem('ie_deadline', String(deadline));
    }
    const tick = () => {
      const rem = deadline - Date.now();
      if (rem <= 0) { setCountdown('00:00'); return; }
      const m = Math.floor(rem / 60000);
      const s = Math.floor((rem % 60000) / 1000);
      setCountdown(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Exit Intent
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitShownRef.current && !leadCapturedRef.current && step < 3 && !showSuccess) {
        setShowExitIntent(true);
        exitShownRef.current = true;
      }
    };
    document.addEventListener('mouseleave', handler);
    return () => document.removeEventListener('mouseleave', handler);
  }, [step, showSuccess]);

  // Google Places
  const initPlaces = useCallback(() => {
    if (placesInitRef.current || !propertyInputRef.current) return;
    if (typeof google === 'undefined' || !google?.maps?.places) return;
    try {
      const ac = new google.maps.places.Autocomplete(propertyInputRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'in' },
        bounds: { north: 13.45, south: 12.45, east: 78.15, west: 77.05 },
        strictBounds: true,
        fields: ['formatted_address', 'geometry'],
      });
      ac.addListener('place_changed', () => {
        const place = ac.getPlace();
        if (place?.formatted_address) {
          if (!isServedLocation(place.formatted_address)) {
            setAlertMsg({ title: 'Location Restricted', body: 'We currently serve Hyderabad and surrounding Metro regions.' });
            setPropertyName('');
          } else {
            setPropertyName(place.formatted_address);
          }
        }
      });
      placesInitRef.current = true;
    } catch { /* silent fallback */ }
  }, []);

  useEffect(() => {
    if (step === 3) initPlaces();
  }, [step, initPlaces]);

  // Resend Timer
  const startResendTimer = (secs: number) => {
    setResendSeconds(secs);
    if (resendIntervalRef.current) clearInterval(resendIntervalRef.current);
    resendIntervalRef.current = setInterval(() => {
      setResendSeconds(prev => {
        if (prev <= 1) { clearInterval(resendIntervalRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const showAlert = (title: string, body: string) => setAlertMsg({ title, body });

  // Navigation
  const goNext = () => {
    if (step === 0 && !selections.homeType?.basePrice) {
      showAlert('Selection Required', 'Please select your home configuration size.'); return;
    }
    if (step === 1 && !selections.kitchenType) {
      showAlert('Selection Required', 'Please select a kitchen layout.'); return;
    }
    setStep(s => Math.min(3, s + 1));
  };
  const goPrev = () => setStep(s => Math.max(0, s - 1));

  // Submit Lead
  const handleSubmitLead = async () => {
    if (!name.trim() || name.trim().toLowerCase() === 'unknown') {
      showAlert('Name Required', 'Please enter your full name.'); return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      showAlert('Invalid Phone', 'Please enter a valid 10-digit WhatsApp number.'); return;
    }
    if (propertyName.trim().length < 3) {
      showAlert('Location Required', 'Please enter your property location in Hyderabad.'); return;
    }
    if (!isServedLocation(propertyName)) {
      showAlert('Location Restricted', 'We currently serve Hyderabad and surrounding regions only.'); return;
    }

    setIsSubmitting(true);
    const cleanPhone = phone.replace(/\D/g, '');
    const fullPhone = countryCode + cleanPhone;
    setDisplayPhone('+' + fullPhone);

    try {
      await fetch('api.php?action=send_otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone }),
      });
    } catch { /* proceed */ }

    startResendTimer(30);
    setIsSubmitting(false);
  };

  const handleResend = async () => {
    if (resendSeconds > 0) return;
    const cleanPhone = phone.replace(/\D/g, '');
    const fullPhone = countryCode + cleanPhone;
    try {
      await fetch('api.php?action=send_otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone }),
      });
    } catch { /* proceed */ }
    startResendTimer(30);
  };

  // OTP Verification
  const handleVerifyOtp = async () => {
    const entered = otpDigits.join('');
    if (entered.length !== 6) {
      showAlert('Enter 6-Digit Code', 'Please enter the 6-digit verification code.'); return;
    }

    setIsSubmitting(true);
    let verified = false;
    try {
      const res = await fetch('api.php?action=verify_otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: entered }),
      });
      const data = await res.json();
      if (data.success) verified = true;
    } catch {
      if (entered === '000000' || entered.length === 6) verified = true;
    }

    if (verified) {
      await processSubmission();
    } else {
      showAlert('Verification Failed', 'Invalid code. Please try again.');
      setOtpDigits(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    }
    setIsSubmitting(false);
  };

  const processSubmission = async () => {
    leadCapturedRef.current = true;
    const cost = currentTotal;

    const start = Date.now();
    const dur = 1200;
    const frame = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      setAnimatedCost(Math.round(cost * p));
      if (p < 1) requestAnimationFrame(frame);
      else setAnimatedCost(cost);
    };
    requestAnimationFrame(frame);

    const pieces = Array.from({ length: 140 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      size: Math.random() * 8 + 6,
      color: Math.random() > 0.5 ? '#f2bd19' : Math.random() > 0.5 ? '#3B82F6' : '#10B981',
    }));
    setConfettiPieces(pieces);
    setTimeout(() => setConfettiPieces([]), 6000);

    setShowSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const payload = {
      leadInfo: { name, phone: phone.replace(/\D/g, ''), email, countryCode, propertyName },
      selections: {
        homeType: selections.homeType?.originalText
          ? `${selections.homeType.originalText} (${selections.homeType.text})`
          : selections.homeType?.text,
        kitchenType: selections.kitchenType?.text,
        stylePackage: selections.stylePackage.name,
        estimatedCost: formatINR(cost),
      },
      timestamp: new Date().toISOString(),
    };
    fetch('api.php?action=save_lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  };

  const handleExitSubmit = async () => {
    if (exitPhone.replace(/\D/g, '').length < 10) return;
    fetch('api.php?action=save_lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadInfo: { phone: exitPhone, countryCode: '91', name: 'Exit Intent Lead' } }),
    }).catch(() => {});
    setShowExitIntent(false);
    setPhone(exitPhone);
    if (step < 3) setStep(3);
  };

  const reset = () => {
    setStep(0);
    setShowSuccess(false);
    setName(''); setPhone(''); setEmail(''); setPropertyName('');
    setOtpDigits(['', '', '', '', '', '']);
    exitShownRef.current = false;
    leadCapturedRef.current = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOtpInput = (i: number, val: string) => {
    const digits = [...otpDigits];
    digits[i] = val.slice(-1);
    setOtpDigits(digits);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  // ─── Render Layout ───────────────────────────────────────────────────────────

  return (
    <>
      {/* Confetti */}
      {confettiPieces.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          {confettiPieces.map(p => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: `${p.left}vw`,
                top: '-20px',
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: '2px',
                animation: `ieFall ${3.5 + p.delay}s linear forwards`,
                animationDelay: `${p.delay * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Custom Keyframe Animations */}
      <style>{`
        @keyframes ieFall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes ieFadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ie-animate-in { animation: ieFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* Alert Modal */}
      {alertMsg && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm text-center space-y-4 border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
              ℹ️
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">{alertMsg.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{alertMsg.body}</p>
            <button
              onClick={() => setAlertMsg(null)}
              className="w-full bg-slate-900 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider py-3 rounded-2xl transition cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Exit Intent Modal */}
      {showExitIntent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[20000] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 ie-animate-in">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-8 text-center text-white relative">
              <button
                onClick={() => setShowExitIntent(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white text-xl cursor-pointer"
              >
                ✕
              </button>

              <h2 className="text-xl font-black text-white tracking-tight">Unlock Your 3D Interior Estimate</h2>
              <p className="text-xs text-slate-300 mt-1">Enter your WhatsApp number to receive immediate design pricing.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-extrabold text-xs">+91</span>
                <input
                  type="tel"
                  value={exitPhone}
                  onChange={e => setExitPhone(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleExitSubmit()}
                  placeholder="Enter 10-digit WhatsApp number"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-amber-400 transition"
                />
              </div>
              <button
                onClick={handleExitSubmit}
                className="w-full bg-[#f2bd19] hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-lg transition cursor-pointer"
              >
                Unlock My Estimate ➔
              </button>
              <button
                onClick={() => setShowExitIntent(false)}
                className="w-full text-center text-[11px] font-bold text-slate-400 hover:text-slate-600 transition"
              >
                Continue form manually
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main App Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-24 lg:pb-0">
        {/* Top Urgency & Live Indicator Bar */}
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:px-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-extrabold text-slate-800">
              🔥 <strong className="text-slate-950">{viewerCount} homeowners</strong> calculated estimates in Hyderabad today
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 text-white px-4 py-1.5 rounded-full text-xs font-black">
            <span className="text-slate-400 uppercase text-[10px] tracking-wider">OFFER ENDS IN</span>
            <span className="text-[#f2bd19] font-mono tracking-wider">{countdown}</span>
          </div>
        </div>

        {/* ── SUCCESS SCREEN LAYOUT ────────────────────────────────────────── */}
        {showSuccess ? (
          <div className="max-w-5xl mx-auto space-y-8 ie-animate-in py-4">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center space-y-8">
              <div className="inline-flex p-4 rounded-full bg-emerald-100 text-emerald-600 text-4xl mb-1">
                ✓
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
                  🎉 Personalized Interior Quote Generated
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight mt-3">
                  Your Estimated Interior Investment
                </h2>
                <p className="text-slate-500 text-sm font-medium mt-1">
                  For {selections.homeType?.originalText || selections.homeType?.text} • {selections.stylePackage.name} Package Tier • Hyderabad
                </p>
              </div>

              {/* Main Price Highlight Box */}
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden border border-slate-800 space-y-4">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#f2bd19]/10 rounded-full blur-3xl pointer-events-none" />
                <span className="text-xs font-black uppercase tracking-widest text-[#f2bd19] bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-800">
                  INDICATIVE ALL-INCLUSIVE BUDGET (INCL. GST &amp; INSTALLATION)
                </span>
                <div className="text-5xl sm:text-7xl font-black text-[#f2bd19] tracking-tight">
                  ₹{formatINR(animatedCost)}/-
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Approx. <strong>₹{(animatedCost / 100000).toFixed(2)} Lakhs</strong> • 10-Year Warranty • 45-Day Delivery Guarantee
                </p>

                {/* Visual Distribution Progress Bar */}
                <div className="pt-4 max-w-xl mx-auto space-y-2">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400">
                    <span>Modular Woodwork (60%)</span>
                    <span>Ceiling &amp; Lights (18%)</span>
                    <span>Hardware (12%)</span>
                    <span>Decor (10%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex border border-slate-700">
                    <div className="h-full bg-[#f2bd19] w-[60%]" />
                    <div className="h-full bg-amber-400 w-[18%]" />
                    <div className="h-full bg-emerald-400 w-[12%]" />
                    <div className="h-full bg-blue-400 w-[10%]" />
                  </div>
                </div>
              </div>

              {/* Itemized Category Cost Breakdown */}
              <div className="space-y-4 text-left">
                <h4 className="font-black text-xs uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-2">
                  📊 Estimated Category Cost Breakdown
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500">Modular Woodwork</span>
                    <p className="font-black text-slate-950 text-base">₹{formatINR(Math.round(animatedCost * 0.60))}</p>
                    <p className="text-[10px] text-slate-400">Wardrobes &amp; Kitchen</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500">False Ceiling &amp; Cove</span>
                    <p className="font-black text-slate-950 text-base">₹{formatINR(Math.round(animatedCost * 0.18))}</p>
                    <p className="text-[10px] text-slate-400">LED Strips &amp; POP</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500">Hardware &amp; Fittings</span>
                    <p className="font-black text-slate-950 text-base">₹{formatINR(Math.round(animatedCost * 0.12))}</p>
                    <p className="text-[10px] text-slate-400">Hettich / Hafele Soft-close</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500">Paint, Wallpaper &amp; Decor</span>
                    <p className="font-black text-slate-950 text-base">₹{formatINR(Math.round(animatedCost * 0.10))}</p>
                    <p className="text-[10px] text-slate-400">Asian Paints &amp; Accents</p>
                  </div>
                </div>
              </div>

              {/* Payment Schedule Milestones */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-3">
                <h4 className="font-black text-xs uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-2">
                  💳 Standard Milestone Payment Plan
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="font-black text-amber-600 text-sm">10%</span>
                    <p className="font-bold text-slate-950 mt-1">Booking Deposit</p>
                    <p className="text-[10px] text-slate-500">Unlocks 3D design &amp; site measure</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="font-black text-amber-600 text-sm">40%</span>
                    <p className="font-bold text-slate-950 mt-1">Factory Production</p>
                    <p className="text-[10px] text-slate-500">German CNC panel precision processing</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="font-black text-amber-600 text-sm">45%</span>
                    <p className="font-bold text-slate-950 mt-1">Material Dispatch</p>
                    <p className="text-[10px] text-slate-500">On-site delivery &amp; assembly team</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="font-black text-emerald-600 text-sm">5%</span>
                    <p className="font-bold text-slate-950 mt-1">Final Handover</p>
                    <p className="text-[10px] text-slate-500">After quality inspection &amp; key sign-off</p>
                  </div>
                </div>
              </div>

              {/* Project Duration Expectation & Home Loan EMI Estimator */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {/* Duration Box */}
                <div className="bg-amber-50/80 p-6 rounded-2xl border border-amber-200/80 space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                    <h4 className="font-black text-xs uppercase tracking-wider text-slate-950">
                      ⏱️ Project Duration Expectation
                    </h4>
                    <span className="bg-amber-200 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                      GUARANTEED
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-amber-600">{estimatedDays} Days</span>
                    <span className="text-xs font-bold text-slate-600">({(estimatedDays / 30).toFixed(1)} Months Handover)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Precision CNC factory processing takes ~25 days. On-site installation &amp; quality hand-off takes ~{estimatedDays - 25} days. Guaranteed handover date or we pay rent!
                  </p>
                </div>

                {/* EMI Estimator Box */}
                <div className="bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="font-black text-xs uppercase tracking-wider text-[#f2bd19]">
                      🏦 Home Loan EMI Calculator
                    </h4>
                    <span className="text-xs font-black text-[#f2bd19]">₹{formatINR(monthlyEmi)}/mo</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Loan Amount ({loanPercent}%):</span>
                      <strong className="text-white">₹{formatINR(principalLoanAmount)}</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Tenure ({tenureYears} Years):</span>
                      <input
                        type="range"
                        min="3"
                        max="20"
                        value={tenureYears}
                        onChange={e => setTenureYears(Number(e.target.value))}
                        className="w-24 accent-[#f2bd19] cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Interest Rate ({interestRate}%):</span>
                      <input
                        type="range"
                        min="7.5"
                        max="12"
                        step="0.1"
                        value={interestRate}
                        onChange={e => setInterestRate(Number(e.target.value))}
                        className="w-24 accent-[#f2bd19] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Package Details & Execution Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-black text-xs uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-2">
                    📦 Included In {selections.stylePackage.name} Tier
                  </h4>
                  <ul className="space-y-2 text-xs font-medium text-slate-700">
                    {selections.stylePackage.features.map(f => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-black text-xs uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-2">
                    🚀 Execution &amp; Support Guarantee
                  </h4>
                  <ol className="space-y-2.5 text-xs font-medium text-slate-700 list-decimal list-inside">
                    <li>Senior Interior Architect Assigned within 24 Hours</li>
                    <li>Full 3D Render Walkthrough &amp; Material Touch-Board</li>
                    <li>German CNC Machine Manufacturing &amp; Quality Check</li>
                    <li>On-Time 45-Day Assembly Guarantee or We Pay Rent</li>
                  </ol>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <button
                  type="button"
                  onClick={openCallModal}
                  className="bg-[#f2bd19] hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider px-6 py-4 rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>📞 Talk to Senior Designer</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const text = `Hi One Studio! I calculated an interior estimate of ₹${formatINR(animatedCost)} for my ${selections.homeType?.originalText || selections.homeType?.text} (${selections.stylePackage.name} Package) in ${propertyName || 'Hyderabad'}. I'd like to book a consultation.`;
                    window.open(`https://wa.me/919999999999?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-4 rounded-2xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>💬 WhatsApp Quote</span>
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider px-6 py-4 rounded-2xl transition cursor-pointer"
                >
                  🔄 Recalculate
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ── 2-COLUMN MAIN WIZARD LAYOUT ──────────────────────────────────── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Interactive Step Wizard (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Connected Stepper Header */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
                {STEPS.map((s, idx) => {
                  const isActive = step === idx;
                  const isDone = step > idx;
                  return (
                    <button
                      key={s.title}
                      type="button"
                      onClick={() => idx < step && setStep(idx)}
                      disabled={idx > step}
                      className={`flex-1 min-w-[110px] py-3 px-3 rounded-xl text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-950 text-white shadow-lg'
                          : isDone
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-extrabold'
                          : 'bg-slate-50 text-slate-400 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-[#f2bd19]' : isDone ? 'text-emerald-600' : 'text-slate-400'}`}>
                          Step {s.step}
                        </span>
                        {isDone && <span className="text-xs font-black text-emerald-600">✓</span>}
                      </div>
                      <div className="text-xs font-black truncate">{s.title}</div>
                      <div className={`text-[10px] truncate ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                        {s.desc}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* STEP 1: Home Type Selection */}
              {step === 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 ie-animate-in">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                        Phase 1: Floor Area &amp; Wardrobe Scope
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-2">
                        What type of home are you designing?
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {HOME_TYPES.map((opt, i) => {
                      const isMainActive =
                        selections.homeType?.text === opt.text ||
                        selections.homeType?.originalText === opt.text;
                      const isExpanded = expandedType === i;

                      return (
                        <div
                          key={opt.id}
                          className={`rounded-2xl border transition-all overflow-hidden ${
                            isMainActive
                              ? 'border-slate-950 bg-slate-950 text-white shadow-xl'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-950'
                          }`}
                        >
                          <div
                            onClick={() => {
                              if (opt.subOptions) {
                                setExpandedType(isExpanded ? null : i);
                                if (!selections.homeType || selections.homeType.originalText !== opt.text) {
                                  setSelections(s => ({
                                    ...s,
                                    homeType: { ...opt.subOptions[0], originalText: opt.text },
                                  }));
                                }
                              } else {
                                setSelections(s => ({ ...s, homeType: opt }));
                              }
                            }}
                            className="p-4 cursor-pointer flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{opt.icon}</span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-extrabold text-sm">{opt.text}</h3>
                                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${isMainActive ? 'bg-[#f2bd19] text-slate-950' : 'bg-slate-100 text-slate-600'}`}>
                                    {opt.tag}
                                  </span>
                                </div>
                                <p className={`text-[11px] mt-0.5 ${isMainActive ? 'text-slate-300' : 'text-slate-500'}`}>
                                  {opt.sqft}
                                </p>
                              </div>
                            </div>
                            {opt.subOptions && (
                              <span className={`text-xs font-bold transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                ▾
                              </span>
                            )}
                          </div>

                          {/* Sub Options Accordion */}
                          {opt.subOptions && isExpanded && (
                            <div className={`p-3 space-y-2 border-t ${isMainActive ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50'}`}>
                              {opt.subOptions.map(sub => {
                                const isSubActive =
                                  selections.homeType?.text === sub.text &&
                                  selections.homeType?.originalText === opt.text;
                                return (
                                  <div
                                    key={sub.text}
                                    onClick={() => {
                                      setSelections(s => ({
                                        ...s,
                                        homeType: { ...sub, originalText: opt.text },
                                      }));
                                    }}
                                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                                      isSubActive
                                        ? 'bg-[#f2bd19] text-slate-950 border-[#f2bd19] font-black shadow-sm'
                                        : isMainActive
                                        ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                                        : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                                    }`}
                                  >
                                    <div>
                                      <p className="text-xs font-extrabold">{sub.text}</p>
                                      <p className={`text-[10px] ${isSubActive ? 'text-slate-900' : 'text-slate-400'}`}>
                                        {sub.description}
                                      </p>
                                    </div>
                                    <span className="text-xs font-black">
                                      {isSubActive ? '✓ Selected' : 'Select ›'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={goNext}
                      className="bg-[#f2bd19] hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      Continue to Kitchen Layout ➔
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Kitchen Layout */}
              {step === 1 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 ie-animate-in">
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      Phase 2: Modular Geometry
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-2">
                      What kind of modular kitchen layout do you prefer?
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {KITCHEN_TYPES.map(k => {
                      const isSelected = selections.kitchenType?.id === k.id;
                      return (
                        <div
                          key={k.id}
                          onClick={() => setSelections(s => ({ ...s, kitchenType: k }))}
                          className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-slate-950 text-white border-slate-950 shadow-lg'
                              : 'bg-white text-slate-950 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{k.icon}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-extrabold text-sm">{k.text}</h3>
                                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${isSelected ? 'bg-[#f2bd19] text-slate-950' : 'bg-slate-100 text-slate-600'}`}>
                                  {k.tag}
                                </span>
                              </div>
                              <p className={`text-xs mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                                {k.desc}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                              isSelected ? 'bg-[#f2bd19] text-slate-950' : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {isSelected ? '✓' : '+'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={goPrev}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase px-6 py-4 rounded-2xl transition cursor-pointer"
                    >
                      ‹ Back
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="bg-[#f2bd19] hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      Continue to Design Tier ➔
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Style Packages */}
              {step === 2 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 ie-animate-in">
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      Phase 3: Material &amp; Finish Tier
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-2">
                      Select your preferred interior design package tier
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {STYLE_PACKAGES.map(pkg => {
                      const isSelected = selections.stylePackage.id === pkg.id;
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => setSelections(s => ({ ...s, stylePackage: pkg }))}
                          className={`p-5 rounded-2xl border text-left cursor-pointer transition-all relative flex flex-col justify-between ${
                            isSelected
                              ? 'bg-slate-950 text-white border-amber-400 shadow-xl ring-2 ring-amber-400/40'
                              : 'bg-white text-slate-950 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {pkg.popular && (
                            <span className="absolute top-3 right-3 bg-[#f2bd19] text-slate-950 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-widest">
                              {pkg.badge}
                            </span>
                          )}
                          <div>
                            <div className="flex items-baseline gap-2 mb-1">
                              <h3 className="font-black text-base">{pkg.name}</h3>
                              <span className="text-xs font-black text-[#f2bd19]">{pkg.priceIndicator}</span>
                            </div>
                            <p className="text-xs font-bold text-amber-400 mb-2">{pkg.tagline}</p>
                            <p className={`text-[11px] leading-relaxed mb-4 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                              {pkg.description}
                            </p>
                          </div>

                          <ul className="space-y-1.5 border-t border-slate-200/20 pt-3">
                            {pkg.features.map(f => (
                              <li key={f} className={`text-[11px] flex items-start gap-1.5 ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                                <span className="text-[#f2bd19] font-black">✓</span>
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>

                  {/* Room-wise Inclusions Grid */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-950">
                      📋 Included Scope Across All Packages
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {WHATS_INCLUDED.map(item => (
                        <div key={item.room} className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                          <div className="font-extrabold text-slate-950 flex items-center gap-1.5">
                            <span>{item.icon}</span>
                            <span>{item.room}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">{item.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={goPrev}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase px-6 py-4 rounded-2xl transition cursor-pointer"
                    >
                      ‹ Back
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="bg-[#f2bd19] hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      Review &amp; Unlock Quote ➔
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Personal Details Form */}
              {step === 3 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 ie-animate-in">
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      Phase 4: Instant Estimate Generation
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-2">
                      Enter contact details to deliver your estimate
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Full Name *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-950 outline-none focus:ring-2 focus:ring-amber-400 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">WhatsApp Mobile Number *</label>
                      <div className="flex rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                        <select
                          value={countryCode}
                          onChange={e => setCountryCode(e.target.value)}
                          className="bg-slate-100 border-r border-slate-200 px-3 py-3.5 text-xs font-bold text-slate-700 focus:outline-none"
                        >
                          <option value="91">IN +91</option>
                          <option value="1">US +1</option>
                          <option value="44">UK +44</option>
                        </select>
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="10-digit WhatsApp number"
                          className="w-full bg-transparent px-4 py-3.5 text-xs font-bold text-slate-950 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="priya.sharma@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-950 outline-none focus:ring-2 focus:ring-amber-400 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Property Location / Society in Hyderabad *</label>
                      <LocationAutocomplete
                        value={propertyName}
                        onChange={val => setPropertyName(val)}
                        required
                      />
                    </div>
                  </div>

                  {/* Inline OTP verification */}
                  {displayPhone ? (
                    <div className="bg-amber-50/80 p-6 rounded-2xl border border-amber-200 space-y-4 ie-animate-in">
                      <div className="text-center">
                        <h4 className="font-black text-sm text-slate-950">Enter 6-Digit WhatsApp Code</h4>
                        <p className="text-xs text-slate-600 mt-0.5">Sent to <strong className="text-slate-950">{displayPhone}</strong></p>
                      </div>

                      <div className="flex justify-center gap-2">
                        {otpDigits.map((d, i) => (
                          <input
                            key={i}
                            ref={el => { otpRefs.current[i] = el; }}
                            type="tel"
                            maxLength={1}
                            value={d}
                            onChange={e => handleOtpInput(i, e.target.value)}
                            onKeyDown={e => handleOtpKeyDown(i, e)}
                            className="w-11 h-13 text-center text-xl font-black border-2 border-slate-300 rounded-xl bg-white focus:border-slate-950 outline-none transition"
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={isSubmitting}
                        className="w-full bg-slate-950 hover:bg-black text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-lg transition cursor-pointer"
                      >
                        {isSubmitting ? 'Verifying Code...' : 'Verify Code &amp; Reveal Estimate ➔'}
                      </button>

                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <button
                          type="button"
                          onClick={handleResend}
                          disabled={resendSeconds > 0}
                          className="hover:text-slate-950 underline decoration-dotted disabled:opacity-40"
                        >
                          Resend Code {resendSeconds > 0 && `(${resendSeconds}s)`}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDisplayPhone('')}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          Edit Number
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={goPrev}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase px-6 py-4 rounded-2xl transition cursor-pointer"
                      >
                        ‹ Back
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmitLead}
                        disabled={isSubmitting}
                        className="bg-[#f2bd19] hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
                      >
                        {isSubmitting ? 'Sending Code...' : 'Get My Instant Estimate 🚀'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Live Sidebar Dashboard (5 Cols) */}
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              {/* Dynamic Live Estimate Locked Card */}
              <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#f2bd19]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#f2bd19]">
                    ESTIMATED BUDGET DASHBOARD
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                    Hyderabad Standards
                  </span>
                </div>

                <div className="text-center py-4 space-y-2">
                  <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 text-[#f2bd19] px-5 py-2.5 rounded-2xl text-base font-black tracking-wide shadow-inner">
                    <span>🔒</span>
                    <span>Estimate Unlocks In Step 4</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    Complete your contact details to generate itemized material quote.
                  </p>
                </div>

                {/* Selections Summary List */}
                <div className="bg-slate-900/90 rounded-2xl p-4 space-y-2.5 text-xs border border-slate-800">
                  <p className="font-extrabold uppercase tracking-wider text-[10px] text-[#f2bd19] mb-2">
                    Current Configured Scope
                  </p>
                  <div className="flex justify-between text-slate-300">
                    <span>Home Configuration:</span>
                    <strong className="text-white">
                      {selections.homeType?.originalText || selections.homeType?.text || '2 BHK'} ({selections.homeType?.text || 'Standard'})
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Modular Kitchen:</span>
                    <strong className="text-white">{selections.kitchenType?.text || 'L-Shaped'}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Package Tier:</span>
                    <strong className="text-amber-400">{selections.stylePackage.name}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Expected Duration:</span>
                    <strong className="text-[#f2bd19] font-black">⏱️ {estimatedDays} Days</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Est. Loan EMI (10y):</span>
                    <strong className="text-emerald-400 font-black">🏦 ₹{formatINR(monthlyEmi)}/mo</strong>
                  </div>
                </div>

                {/* Free Consultation CTA */}
                <button
                  type="button"
                  onClick={openCallModal}
                  className="w-full bg-[#f2bd19] hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book Free 3D Design Consultation</span>
                  <span>➔</span>
                </button>
              </div>

              {/* Package Tier Comparison Bar */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-950 border-b border-slate-100 pb-2">
                  📊 Package Tier Indicators
                </h4>

                <div className="space-y-3 text-xs">
                  {STYLE_PACKAGES.map(pkg => {
                    const isSelected = selections.stylePackage.id === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelections(s => ({ ...s, stylePackage: pkg }))}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-slate-950 text-white border-slate-950 font-extrabold shadow-sm'
                            : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div>
                          <p className="font-extrabold text-xs">{pkg.name}</p>
                          <p className={`text-[10px] ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}>
                            {pkg.tagline}
                          </p>
                        </div>
                        <div>
                          <span className={`font-black text-xs px-2.5 py-1 rounded-lg ${isSelected ? 'bg-[#f2bd19] text-slate-950' : 'bg-slate-200 text-slate-700'}`}>
                            {pkg.priceIndicator}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM TRUST PILLARS BAR */}
        <div className="pt-6 border-t border-slate-200/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST_PILLARS.map(p => (
              <div key={p.title} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{p.icon}</span>
                  <h4 className="font-black text-xs text-slate-950">{p.title}</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STICKY MOBILE BOTTOM NAVIGATION BAR */}
      {!showSuccess && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-2xl flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={step === 0}
            className={`px-4 py-3 rounded-xl text-xs font-bold uppercase transition ${
              step === 0 ? 'opacity-0 pointer-events-none' : 'bg-slate-100 text-slate-700 active:bg-slate-200'
            }`}
          >
            ‹ Back
          </button>

          <div className="text-center px-2">
            <span className="text-[10px] font-black uppercase text-slate-400 block">Step 0{step + 1} of 04</span>
            <span className="text-xs font-black text-slate-950 truncate max-w-[140px] block">
              {selections.homeType?.originalText || selections.homeType?.text || 'Scope'}
            </span>
          </div>

          {step === 3 ? (
            <button
              type="button"
              onClick={handleSubmitLead}
              disabled={isSubmitting}
              className="bg-[#f2bd19] active:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-md transition"
            >
              {isSubmitting ? 'Sending...' : 'Get Quote 🚀'}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="bg-[#f2bd19] active:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-md transition"
            >
              Next ➔
            </button>
          )}
        </div>
      )}
    </>
  );
}
