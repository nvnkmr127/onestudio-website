'use client';

import React, { useState } from 'react';
import { openCallModal } from '@/components/CallModal';

interface PackageSpec {
  id: string;
  name: string;
  rate: number;
  badge?: string;
  recommendedFor: string;
  floorHeight: string;
  externalWalls: string;
  internalWalls: string;
  flooringWallet: string;
  bathroomTileWallet: string;
  kitchenGraniteWallet: string;
  bathroomFittingsWallet: string;
  mainDoorWallet: string;
  internalDoorWallet: string;
  bathroomWpcDoorWallet: string;
  windowWallet: string;
  sump: string;
  oht: string;
  elevationWallet: string;
  staircaseRailing: string;
  evProvision: string;
  smartHome: string;
  steelBrand: string;
  cementBrand: string;
  sanitaryBrand: string;
  electricalBrand: string;
  paintBrand: string;
}

const packages: PackageSpec[] = [
  {
    id: 'essential',
    name: 'ESSENTIAL',
    rate: 1849,
    recommendedFor: 'Rental homes, investment properties and budget duplexes',
    floorHeight: `10'0"`,
    externalWalls: `6" solid block`,
    internalWalls: `4" solid block`,
    flooringWallet: '₹60/sq.ft.',
    bathroomTileWallet: '₹50/sq.ft.',
    kitchenGraniteWallet: '₹160/sq.ft. (Sink: ₹6,000)',
    bathroomFittingsWallet: '₹30,000 / bathroom',
    mainDoorWallet: '₹30,000',
    internalDoorWallet: '₹12,000 / door',
    bathroomWpcDoorWallet: '₹10,000 / door',
    windowWallet: 'Up to ₹450/sq.ft.',
    sump: '6 KL masonry',
    oht: '1.5 KL',
    elevationWallet: '₹1.50 lakh wallet',
    staircaseRailing: 'MS railing',
    evProvision: 'Optional',
    smartHome: 'Standard electrical points',
    steelBrand: 'Sunvik / Kamdhenu / Indus (Fe550D)',
    cementBrand: 'Dalmia / Bharathi / Zuari',
    sanitaryBrand: 'Cera / Hindware or equivalent',
    electricalBrand: 'Finolex wiring + Anchor Roma switches',
    paintBrand: 'Asian Paints Tractor Emulsion internally, Ace externally',
  },
  {
    id: 'prime',
    name: 'PRIME',
    rate: 2049,
    badge: 'MOST POPULAR',
    recommendedFor: 'Family home - easiest choice for most owner-occupied Bengaluru homes',
    floorHeight: `10'6"`,
    externalWalls: `8" hydraulic-pressed solid block`,
    internalWalls: `4" solid block`,
    flooringWallet: '₹100/sq.ft.',
    bathroomTileWallet: '₹75/sq.ft.',
    kitchenGraniteWallet: '₹200/sq.ft. (Sink: ₹10,000)',
    bathroomFittingsWallet: '₹45,000 / bathroom',
    mainDoorWallet: '₹50,000 Teak wood',
    internalDoorWallet: '₹15,000 / door',
    bathroomWpcDoorWallet: '₹12,000 / door',
    windowWallet: '₹550/sq.ft. UPVC with mesh',
    sump: '8 KL RCC',
    oht: '2 KL / 4-layer',
    elevationWallet: '₹2.50 lakh wallet',
    staircaseRailing: 'SS 304 internal railing',
    evProvision: 'Included (EV + UPS + AC provisions)',
    smartHome: 'Basic provision + Pooja electrical',
    steelBrand: 'JSW NeoSteel / Jindal Panther / Indus (Fe550D)',
    cementBrand: 'Birla Super / UltraTech / ACC',
    sanitaryBrand: 'Parryware / Jaquar Essco or equivalent',
    electricalBrand: 'Havells / Finolex FRLS + Legrand Allzy / Anchor Roma Plus',
    paintBrand: 'Asian Paints Tractor Shyne internally, Apex externally',
  },
  {
    id: 'signature',
    name: 'SIGNATURE',
    rate: 2349,
    recommendedFor: 'Premium duplexes and long-term personal residences',
    floorHeight: `10'6"`,
    externalWalls: `8" solid block`,
    internalWalls: `4" solid block`,
    flooringWallet: '₹150/sq.ft.',
    bathroomTileWallet: '₹110/sq.ft.',
    kitchenGraniteWallet: '₹250/sq.ft. Granite/Quartz (Sink: ₹15,000)',
    bathroomFittingsWallet: '₹70,000 / bathroom',
    mainDoorWallet: '₹80,000 Teak wood',
    internalDoorWallet: '₹20,000 / door',
    bathroomWpcDoorWallet: '₹15,000 / door',
    windowWallet: '₹650/sq.ft. Premium UPVC',
    sump: '10 KL RCC',
    oht: '2 KL / 4-layer',
    elevationWallet: '₹4.00 lakh wallet',
    staircaseRailing: 'SS 304 + toughened glass',
    evProvision: 'Included (EV + Solar + CCTV + Video doorbell)',
    smartHome: 'Selected provisions + Rainwater harvesting',
    steelBrand: 'JSW NeoSteel / Jindal Panther / Vizag (Fe550D)',
    cementBrand: 'UltraTech / ACC / Birla Super / Ramco',
    sanitaryBrand: 'Jaquar / Kohler entry series or equivalent',
    electricalBrand: 'Havells / Finolex / Polycab FRLS + Legrand Myrius / Schneider',
    paintBrand: 'Asian Paints Apcolite Premium / Royale; Apex Ultima exterior',
  },
  {
    id: 'elite',
    name: 'ELITE',
    rate: 2699,
    recommendedFor: 'Luxury villas and architect-designed custom homes',
    floorHeight: `Up to 11'0"`,
    externalWalls: `8" high-density solid block`,
    internalWalls: `4" solid block`,
    flooringWallet: '₹220/sq.ft. Marble / Flooring',
    bathroomTileWallet: '₹175/sq.ft.',
    kitchenGraniteWallet: '₹350/sq.ft. Granite/Quartz (Sink: ₹25,000)',
    bathroomFittingsWallet: '₹1,00,000 / bathroom',
    mainDoorWallet: '₹1,25,000 Premium Teak',
    internalDoorWallet: '₹30,000 / door',
    bathroomWpcDoorWallet: '₹20,000 / door',
    windowWallet: '₹800/sq.ft. Premium UPVC / Aluminium',
    sump: '12 KL RCC',
    oht: '3 KL / 4-layer',
    elevationWallet: '₹7.00 lakh wallet',
    staircaseRailing: 'Premium toughened glass + SS 304',
    evProvision: 'Included (Smart-home + EV + CCTV + Data)',
    smartHome: 'Automation-ready + Solar & Lift provision',
    steelBrand: 'JSW NeoSteel / Jindal Panther (Fe550D)',
    cementBrand: 'UltraTech / ACC / Birla Super or approved premium',
    sanitaryBrand: 'Kohler / Grohe / Jaquar premium fixtures',
    electricalBrand: 'Polycab / Havells FRLSH + Schneider Opale / Legrand premium',
    paintBrand: 'Asian Paints Royale Luxury + Apex Ultima Protek',
  },
];

export default function CostEstimator() {
  // Stepper State (1: Plot & Floor, 2: Add-ons & Amenities, 3: Package & Specifications)
  const [step, setStep] = useState<number>(1);

  // Step 1 Inputs
  const [plotLength, setPlotLength] = useState<number>(30);
  const [plotWidth, setPlotWidth] = useState<number>(40);
  const [floorsCount, setFloorsCount] = useState<number>(2); // 2 = Ground + 1
  const [foundationType, setFoundationType] = useState<'Normal' | 'Deep Pile' | 'Raft'>('Normal');
  const [balconyArea, setBalconyArea] = useState<number>(150); // Covered balcony (70% BUA factor)
  const [parkingArea, setParkingArea] = useState<number>(200); // Covered parking portico (70% BUA factor)

  // Step 2 Add-ons
  const [sumpLiters, setSumpLiters] = useState<number>(8000);
  const [hasCompoundWall, setHasCompoundWall] = useState<boolean>(true);
  const [hasSolar, setHasSolar] = useState<boolean>(false);
  const [hasRainwater, setHasRainwater] = useState<boolean>(true);
  const [hasCCTV, setHasCCTV] = useState<boolean>(true);
  const [hasEVCharging, setHasEVCharging] = useState<boolean>(true);
  const [hasLift, setHasLift] = useState<boolean>(false);

  // Step 3 Package Selection (PDF Rates)
  const [selectedPkgId, setSelectedPkgId] = useState<string>('prime');
  const [interiorFitout, setInteriorFitout] = useState<'None' | 'Basic' | 'Premium' | 'Luxury'>('None');
  const [includeGovtFees, setIncludeGovtFees] = useState<boolean>(true);

  // Home Loan EMI State
  const [showEmiCalc, setShowEmiCalc] = useState<boolean>(true);
  const [loanPercent, setLoanPercent] = useState<number>(80);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);

  // Calculated Area logic per PDF Page 8 Charging Factors:
  const groundPlotArea = plotLength * plotWidth;
  const livingFloorArea = Math.max(100, groundPlotArea - parkingArea);
  
  // Total Covered Area Breakdown:
  const totalLivingBUA = livingFloorArea * floorsCount;
  const balconyBUA = Math.round(balconyArea * 0.7);
  const parkingBUA = Math.round(parkingArea * 0.7);

  // Total BUA
  const totalBUA = totalLivingBUA + balconyBUA + parkingBUA;

  // Selected Package Rate
  const currentPkg = packages.find((p) => p.id === selectedPkgId) || packages[1];
  const baseStructureCost = Math.round(totalBUA * currentPkg.rate);

  // Add-on Costs
  const foundationCost = foundationType === 'Deep Pile' ? 180000 : foundationType === 'Raft' ? 250000 : 0;
  const sumpCost = Math.round((sumpLiters / 1000) * 14000);
  const compoundWallCost = hasCompoundWall ? 145000 : 0;
  const solarCost = hasSolar ? 220000 : 0;
  const rainwaterCost = hasRainwater ? 40000 : 0;
  const cctvCost = hasCCTV ? 35000 : 0;
  const evCost = hasEVCharging ? 15000 : 0;
  const liftCost = hasLift ? 650000 : 0;

  // Total Add-ons Sum
  const totalAddonsCost =
    foundationCost +
    sumpCost +
    compoundWallCost +
    solarCost +
    rainwaterCost +
    cctvCost +
    evCost +
    liftCost;

  // Interior Fitout Rate per sqft
  const interiorRate =
    interiorFitout === 'Basic' ? 450 : interiorFitout === 'Premium' ? 750 : interiorFitout === 'Luxury' ? 1200 : 0;
  const interiorCost = totalBUA * interiorRate;
  const govtFeesCost = includeGovtFees ? 165000 : 0;

  // Total Estimated Budget (Updates Live with every add-on / package change)
  const totalEstimatedCost = baseStructureCost + totalAddonsCost + interiorCost + govtFeesCost;

  const averageRatePerSqft = Math.round(totalEstimatedCost / totalBUA);
  const estimatedLacs = (totalEstimatedCost / 100000).toFixed(2);
  const estimatedCrores = (totalEstimatedCost / 10000000).toFixed(2);

  // Estimated Construction Months
  const estimatedMonths = Math.max(6, Math.ceil(floorsCount * 2.2 + (totalBUA > 3000 ? 2 : 0)));

  // Material Quantity Estimator Math
  const cementBags = Math.round(totalBUA * 0.45);
  const steelKg = Math.round(totalBUA * 4.6);
  const sandCft = Math.round(totalBUA * 3.2);
  const bricksCount = Math.round(totalBUA * 11);

  // Home Loan EMI Math Calculation:
  const principalLoanAmount = Math.round(totalEstimatedCost * (loanPercent / 100));
  const monthlyInterestRate = interestRate / (12 * 100);
  const totalMonths = tenureYears * 12;
  const monthlyEmi = Math.round(
    (principalLoanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) /
      (Math.pow(1 + monthlyInterestRate, totalMonths) - 1)
  );

  // Cost Comparison Across Packages (Base + Add-ons)
  const essentialTotalCost = Math.round(totalBUA * 1849) + totalAddonsCost + interiorCost + govtFeesCost;
  const primeTotalCost = Math.round(totalBUA * 2049) + totalAddonsCost + interiorCost + govtFeesCost;
  const signatureTotalCost = Math.round(totalBUA * 2349) + totalAddonsCost + interiorCost + govtFeesCost;
  const eliteTotalCost = Math.round(totalBUA * 2699) + totalAddonsCost + interiorCost + govtFeesCost;

  return (
    <section className="py-12 bg-[#F4F7FB] text-slate-800 font-sans" id="calculator">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-primary-orange text-xs font-black uppercase tracking-widest">
            ⚡ Official One Studio Interior Cost Estimator
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Calculate Interior Design &amp; Woodwork Cost
          </h2>
          <p className="text-slate-600 text-sm md:text-base font-medium">
            Based on official One Studio package specifications &amp; area pricing for Bengaluru.
          </p>

          {/* Stepper Tabs */}
          <div className="flex justify-center gap-2 pt-4">
            {[
              { num: 1, label: '1. Plot & Floor Setup' },
              { num: 2, label: '2. Add-ons & Amenities' },
              { num: 3, label: '3. Package Specs & Quote' },
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num)}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  step === s.num
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Wizard Steps (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* STEP 1: Plot Dimensions, Floor Count & Area Breakdown */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                {/* 1. Plot Area Presets */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-900">
                      1. Plot Area Presets &amp; Custom Dimensions
                    </label>
                    <span className="text-xs font-bold text-slate-400">
                      Common: 30x40 (1200) or 40x60 (2400)
                    </span>
                  </div>

                  {/* Preset Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { size: 1200, label: '30x40 (1,200 sqft)', l: 30, w: 40 },
                      { size: 1500, label: '30x50 (1,500 sqft)', l: 30, w: 50 },
                      { size: 2400, label: '40x60 (2,400 sqft)', l: 40, w: 60 },
                      { size: 4000, label: '50x80 (4,000 sqft)', l: 50, w: 80 },
                    ].map((p) => (
                      <button
                        key={p.size}
                        type="button"
                        onClick={() => {
                          setPlotLength(p.l);
                          setPlotWidth(p.w);
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                          plotLength === p.l && plotWidth === p.w
                            ? 'bg-primary-orange text-white border-primary-orange shadow-md'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* Dimension Sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Plot Length:</span>
                        <span className="text-primary-orange font-black">{plotLength} ft</span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={100}
                        value={plotLength}
                        onChange={(e) => setPlotLength(Number(e.target.value))}
                        className="w-full accent-primary-orange cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Plot Width:</span>
                        <span className="text-primary-orange font-black">{plotWidth} ft</span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={100}
                        value={plotWidth}
                        onChange={(e) => setPlotWidth(Number(e.target.value))}
                        className="w-full accent-primary-orange cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Number of Floors & Foundation Type */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="text-primary-orange font-bold text-lg">🏢</span>
                    <h3 className="text-base font-extrabold text-slate-900">2. Floors &amp; Foundation Type</h3>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">Total Floors</label>
                    <div className="flex items-center gap-3">
                      {[
                        { num: 1, label: 'Ground' },
                        { num: 2, label: 'G + 1' },
                        { num: 3, label: 'G + 2' },
                        { num: 4, label: 'G + 3' },
                        { num: 5, label: 'G + 4' },
                      ].map((f) => (
                        <button
                          key={f.num}
                          type="button"
                          onClick={() => setFloorsCount(f.num)}
                          className={`flex-1 py-3 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                            floorsCount === f.num
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">Foundation Type</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['Normal', 'Deep Pile', 'Raft'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFoundationType(type)}
                          className={`py-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                            foundationType === type
                              ? 'bg-primary-orange text-white border-primary-orange shadow-md'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. BUA Charging Factors (Page 8 of PDF) */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-extrabold text-slate-900">3. Built-up Area Allocation (PDF Basis)</h3>
                    <span className="text-[11px] font-bold text-primary-orange bg-orange-50 px-2.5 py-1 rounded-full">
                      Page 8 Rules
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                        Covered Balcony / Utility (70% BUA)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={1000}
                          value={balconyArea}
                          onChange={(e) => setBalconyArea(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                        />
                        <span className="text-xs text-slate-400">sq.ft</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                        Covered Parking Portico (70% BUA)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={1000}
                          value={parkingArea}
                          onChange={(e) => setParkingArea(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                        />
                        <span className="text-xs text-slate-400">sq.ft</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-primary-orange hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    Next Step <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Add-on Features & Special Provisions */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">⚡ Add-on Features &amp; Sump Capacity</h3>
                      <p className="text-xs text-slate-500">
                        Select optional add-ons to see live price updates on the right.
                      </p>
                    </div>
                  </div>

                  {/* Sump Tank Liters */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                      Underground Sump Tank Capacity
                    </label>
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setSumpLiters(Math.max(6000, sumpLiters - 2000))}
                        className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-extrabold text-xs cursor-pointer shadow-sm"
                      >
                        -2K Liters
                      </button>
                      <span className="text-2xl font-black text-slate-900 flex-1 text-center">
                        {sumpLiters.toLocaleString()} Liters
                      </span>
                      <button
                        type="button"
                        onClick={() => setSumpLiters(sumpLiters + 2000)}
                        className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-extrabold text-xs cursor-pointer shadow-sm"
                      >
                        +2K Liters
                      </button>
                    </div>
                  </div>

                  {/* Feature Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        title: 'Compound Wall',
                        priceText: '+₹1.45 Lakh',
                        icon: '🏰',
                        active: hasCompoundWall,
                        toggle: () => setHasCompoundWall(!hasCompoundWall),
                      },
                      {
                        title: 'Solar & Hybrid System',
                        priceText: '+₹2.20 Lakh',
                        icon: '☀️',
                        active: hasSolar,
                        toggle: () => setHasSolar(!hasSolar),
                      },
                      {
                        title: 'Rainwater Harvesting',
                        priceText: '+₹40,000',
                        icon: '🌧️',
                        active: hasRainwater,
                        toggle: () => setHasRainwater(!hasRainwater),
                      },
                      {
                        title: 'CCTV & Security',
                        priceText: '+₹35,000',
                        icon: '📹',
                        active: hasCCTV,
                        toggle: () => setHasCCTV(!hasCCTV),
                      },
                      {
                        title: 'EV Charging Point',
                        priceText: '+₹15,000',
                        icon: '⚡',
                        active: hasEVCharging,
                        toggle: () => setHasEVCharging(!hasEVCharging),
                      },
                      {
                        title: 'Lift / Elevator',
                        priceText: '+₹6.50 Lakh',
                        icon: '🛗',
                        active: hasLift,
                        toggle: () => setHasLift(!hasLift),
                      },
                    ].map((item) => (
                      <button
                        key={item.title}
                        type="button"
                        onClick={item.toggle}
                        className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          item.active
                            ? 'bg-orange-50/80 border-primary-orange text-slate-900 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <p className="font-extrabold text-xs">{item.title}</p>
                            <p className="text-[10px] font-bold text-primary-orange">
                              {item.active ? `${item.priceText} (ADDED)` : item.priceText}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                            item.active ? 'bg-primary-orange text-white' : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {item.active ? '✓' : '+'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="bg-white border border-slate-300 text-slate-700 font-bold text-xs uppercase px-6 py-4 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    ‹ Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-primary-orange hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    Next Step <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: One Studio Package Selector & Material Specifications */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">👑 One Studio Interior Tiers &amp; Specs</h3>
                      <p className="text-xs text-slate-500">
                        Indicative client-facing rates inclusive of GST per PDF specification document.
                      </p>
                    </div>
                  </div>

                  {/* 4 Package Cards */}
                  <div className="space-y-3">
                    {packages.map((pkg) => {
                      const isSelected = selectedPkgId === pkg.id;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setSelectedPkgId(pkg.id)}
                          className={`w-full p-4 rounded-2xl border text-left transition-all relative cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 text-white border-primary-orange shadow-lg'
                              : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {pkg.badge && (
                            <span className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                              {pkg.badge}
                            </span>
                          )}
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-black text-sm">{pkg.name}</span>
                            <span className="text-primary-orange font-black text-base">₹{pkg.rate.toLocaleString()} / sq.ft.</span>
                          </div>
                          <p className={`text-[11px] font-normal leading-snug ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                            {pkg.recommendedFor}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Interior Fitout & Govt Fees */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        🛋️ Modular Interior Fit-out
                      </label>
                      <select
                        value={interiorFitout}
                        onChange={(e) => setInteriorFitout(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-primary-orange"
                      >
                        <option value="None">Excluded (Civil Only)</option>
                        <option value="Basic">Basic Modular (₹450/sqft)</option>
                        <option value="Premium">Premium Modular (₹750/sqft)</option>
                        <option value="Luxury">Luxury Custom (₹1200/sqft)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        📜 BBMP / BESCOM Sanction Fees
                      </label>
                      <button
                        type="button"
                        onClick={() => setIncludeGovtFees(!includeGovtFees)}
                        className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center justify-between ${
                          includeGovtFees
                            ? 'bg-amber-100/80 border-amber-300 text-amber-950'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <span>Government &amp; Deposit Charges</span>
                        <span className="font-black">{includeGovtFees ? 'INCLUDED' : 'EXCLUDED'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-white border border-slate-300 text-slate-700 font-bold text-xs uppercase px-6 py-4 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    ‹ Back
                  </button>
                  <button
                    type="button"
                    onClick={openCallModal}
                    className="bg-primary-orange hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    Download PDF Estimate 📄
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Dynamic Estimation Dashboard Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            {/* Main Total Price Card */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-200/90 shadow-xl space-y-6 text-slate-900">
              <div className="text-center border-b border-slate-100 pb-5">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  ESTIMATED TOTAL BUDGET
                </span>
                <h3 className="text-3xl md:text-5xl font-black text-primary-orange mt-1 tracking-tight">
                  ₹{totalEstimatedCost.toLocaleString()}/-
                </h3>
                <p className="text-[10px] text-slate-400 font-medium uppercase mt-1">
                  (Approx. ₹{estimatedLacs} Lacs / ₹{estimatedCrores} Cr incl. GST)
                </p>
              </div>

              {/* Sub-metrics */}
              <div className="grid grid-cols-2 gap-3 text-center bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Avg. Rate</p>
                  <p className="font-extrabold text-slate-900">₹{averageRatePerSqft}/sqft</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Total BUA</p>
                  <p className="font-extrabold text-slate-900">{totalBUA.toLocaleString()} sqft</p>
                </div>
              </div>

              {/* Itemized Cost Breakdown List */}
              <div className="space-y-2 text-xs border-b border-slate-100 pb-4">
                <p className="font-extrabold uppercase text-[10px] text-slate-400 tracking-wider mb-2">
                  Detailed Cost Breakdown ({currentPkg.name})
                </p>
                <div className="flex justify-between text-slate-600">
                  <span>Base Structure ({currentPkg.name}):</span>
                  <span className="font-bold text-slate-900">₹{baseStructureCost.toLocaleString()}</span>
                </div>
                {sumpCost > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Underground Sump ({sumpLiters}L):</span>
                    <span className="font-bold text-slate-900">₹{sumpCost.toLocaleString()}</span>
                  </div>
                )}
                {compoundWallCost > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Compound Wall:</span>
                    <span className="font-bold text-slate-900">₹{compoundWallCost.toLocaleString()}</span>
                  </div>
                )}
                {solarCost > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Solar &amp; Hybrid:</span>
                    <span className="font-bold text-slate-900">₹{solarCost.toLocaleString()}</span>
                  </div>
                )}
                {rainwaterCost > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Rainwater Harvesting:</span>
                    <span className="font-bold text-slate-900">₹{rainwaterCost.toLocaleString()}</span>
                  </div>
                )}
                {cctvCost > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>CCTV &amp; Security:</span>
                    <span className="font-bold text-slate-900">₹{cctvCost.toLocaleString()}</span>
                  </div>
                )}
                {evCost > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>EV Charging Point:</span>
                    <span className="font-bold text-slate-900">₹{evCost.toLocaleString()}</span>
                  </div>
                )}
                {liftCost > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Lift / Elevator:</span>
                    <span className="font-bold text-slate-900">₹{liftCost.toLocaleString()}</span>
                  </div>
                )}
                {interiorCost > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Interior Fit-out:</span>
                    <span className="font-bold text-slate-900">₹{interiorCost.toLocaleString()}</span>
                  </div>
                )}
                {govtFeesCost > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Govt &amp; Deposit Charges:</span>
                    <span className="font-bold text-slate-900">₹{govtFeesCost.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Primary Consultation CTA */}
              <button
                type="button"
                onClick={openCallModal}
                className="w-full bg-primary-orange hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Get Free Consultation <span>›</span>
              </button>
            </div>

            {/* Home Loan EMI Calculator Card (Matching User Screenshot & Brand Colors) */}
            <div className="bg-amber-50/90 border border-amber-200/90 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏷️</span>
                  <h4 className="font-black text-xs md:text-sm text-amber-950">Home Loan EMI Calculator</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEmiCalc(!showEmiCalc)}
                  className="bg-primary-orange hover:bg-orange-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  {showEmiCalc ? 'Hide' : 'Show'}
                </button>
              </div>

              {showEmiCalc && (
                <div className="space-y-4 animate-fade-in">
                  {/* Select Dropdowns Grid */}
                  <div className="grid grid-cols-3 gap-2 text-left">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-amber-800 mb-1">LOAN %</label>
                      <select
                        value={loanPercent}
                        onChange={(e) => setLoanPercent(Number(e.target.value))}
                        className="w-full bg-white border border-amber-300 rounded-xl px-2 py-2 text-xs font-extrabold text-amber-950 focus:outline-none focus:border-primary-orange"
                      >
                        <option value={50}>50%</option>
                        <option value={60}>60%</option>
                        <option value={70}>70%</option>
                        <option value={80}>80%</option>
                        <option value={90}>90%</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase text-amber-800 mb-1">TENURE</label>
                      <select
                        value={tenureYears}
                        onChange={(e) => setTenureYears(Number(e.target.value))}
                        className="w-full bg-white border border-amber-300 rounded-xl px-2 py-2 text-xs font-extrabold text-amber-950 focus:outline-none focus:border-primary-orange"
                      >
                        <option value={5}>5 Years</option>
                        <option value={10}>10 Years</option>
                        <option value={15}>15 Years</option>
                        <option value={20}>20 Years</option>
                        <option value={25}>25 Years</option>
                        <option value={30}>30 Years</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase text-amber-800 mb-1">INTEREST %</label>
                      <select
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full bg-white border border-amber-300 rounded-xl px-2 py-2 text-xs font-extrabold text-amber-950 focus:outline-none focus:border-primary-orange"
                      >
                        <option value={7.5}>7.5%</option>
                        <option value={8.0}>8.0%</option>
                        <option value={8.5}>8.5%</option>
                        <option value={9.0}>9.0%</option>
                        <option value={9.5}>9.5%</option>
                        <option value={10.0}>10.0%</option>
                      </select>
                    </div>
                  </div>

                  {/* EMI Output Box */}
                  <div className="bg-amber-100/70 border border-amber-200 p-4 rounded-2xl text-center space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-800">MONTHLY EMI</p>
                    <h5 className="text-3xl font-black text-amber-900">
                      ₹{monthlyEmi.toLocaleString()}
                    </h5>
                    <p className="text-[11px] font-bold text-amber-800">
                      Loan Amount: ₹{principalLoanAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Est Timeline Box */}
            <div className="bg-orange-50/90 border border-orange-200 rounded-2xl p-4 flex items-center justify-between text-slate-900">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏱️</span>
                <div>
                  <p className="text-[10px] uppercase font-bold text-primary-orange">Est. Timeline</p>
                  <p className="font-black text-lg text-slate-900">{estimatedMonths} months</p>
                </div>
              </div>
              <button
                type="button"
                onClick={openCallModal}
                className="bg-primary-orange hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Share / Email
              </button>
            </div>

            {/* Industry Standard Estimator 8-Card Grid (Matching Reference Image) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md space-y-4">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">
                INDUSTRY STANDARD ESTIMATOR
              </h4>
              <div className="grid grid-cols-2 gap-3 text-center">
                {/* 1. Cement */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100/80">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Cement</p>
                  <p className="font-black text-sm text-slate-900 mt-1">
                    {cementBags} <span className="text-xs font-bold text-primary-orange">BAGS</span>
                  </p>
                </div>

                {/* 2. Steel */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100/80">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Steel</p>
                  <p className="font-black text-sm text-slate-900 mt-1">
                    {steelKg} <span className="text-xs font-bold text-primary-orange">KG</span>
                  </p>
                </div>

                {/* 3. Sand & Aggregate */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100/80">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Sand &amp; Aggregate</p>
                  <p className="font-black text-sm text-slate-900 mt-1">
                    {sandCft} <span className="text-xs font-bold text-primary-orange">CFT</span>
                  </p>
                </div>

                {/* 4. Bricks/Blocks */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100/80">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Bricks/Blocks</p>
                  <p className="font-black text-sm text-slate-900 mt-1">
                    {bricksCount} <span className="text-xs font-bold text-primary-orange">NOS</span>
                  </p>
                </div>

                {/* 5. Painting & POP */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100/80">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Painting &amp; POP</p>
                  <p className="font-black text-sm text-slate-900 mt-1">
                    {Math.round(totalEstimatedCost * 0.08).toLocaleString()}{' '}
                    <span className="text-xs font-bold text-primary-orange">₹</span>
                  </p>
                </div>

                {/* 6. Plumbing & Electrical */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100/80">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Plumbing &amp; Electrical</p>
                  <p className="font-black text-sm text-slate-900 mt-1">
                    {Math.round(totalEstimatedCost * 0.14).toLocaleString()}{' '}
                    <span className="text-xs font-bold text-primary-orange">₹</span>
                  </p>
                </div>

                {/* 7. Flooring & Wood */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100/80">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Flooring &amp; Wood</p>
                  <p className="font-black text-sm text-slate-900 mt-1">
                    {Math.round(totalEstimatedCost * 0.18).toLocaleString()}{' '}
                    <span className="text-xs font-bold text-primary-orange">₹</span>
                  </p>
                </div>

                {/* 8. Doors & Windows */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100/80">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Doors &amp; Windows</p>
                  <p className="font-black text-sm text-slate-900 mt-1">
                    {Math.round(totalEstimatedCost * 0.11).toLocaleString()}{' '}
                    <span className="text-xs font-bold text-primary-orange">₹</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Cost Comparison Across Packages */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md space-y-4 text-xs">
              <h4 className="font-extrabold uppercase tracking-wider text-slate-400 text-[10px] flex items-center gap-1.5">
                <span>📊 COST COMPARISON</span>
              </h4>

              <div className="space-y-3">
                {/* Essential */}
                <div>
                  <div className="flex justify-between font-extrabold mb-1">
                    <span className="text-slate-600">Essential</span>
                    <span className="text-slate-800">₹{essentialTotalCost.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-400 rounded-full transition-all"
                      style={{ width: `${Math.round((essentialTotalCost / eliteTotalCost) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Prime */}
                <div>
                  <div className="flex justify-between font-extrabold mb-1">
                    <span className="text-primary-orange font-black">Prime (Most Popular)</span>
                    <span className="text-primary-orange font-black">₹{primeTotalCost.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-orange rounded-full transition-all"
                      style={{ width: `${Math.round((primeTotalCost / eliteTotalCost) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Signature */}
                <div>
                  <div className="flex justify-between font-extrabold mb-1">
                    <span className="text-slate-600">Signature</span>
                    <span className="text-slate-800">₹{signatureTotalCost.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${Math.round((signatureTotalCost / eliteTotalCost) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Elite */}
                <div>
                  <div className="flex justify-between font-extrabold mb-1">
                    <span className="text-slate-600">Elite</span>
                    <span className="text-slate-800">₹{eliteTotalCost.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900 rounded-full w-full" />
                  </div>
                </div>
              </div>

              {/* Labor vs Material Split */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-700">
                  <span>Labor Split (26%)</span>
                  <span>Material Split (74%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-slate-800 w-[26%]" />
                  <div className="h-full bg-primary-orange w-[74%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
