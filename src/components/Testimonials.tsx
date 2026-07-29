'use client';

import React from 'react';

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-slate-50 overflow-hidden" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 mb-14 text-center space-y-3">
        <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30 text-xs font-black uppercase tracking-widest">
          ⚡ REAL FEEDBACK FROM HYDERABAD HOMEOWNERS
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          What Our Clients Say
        </h2>
        <p className="text-slate-600 text-sm md:text-base font-medium max-w-xl mx-auto">
          121+ verified Google reviews • 5.0 star rating • Trusted across Hyderabad for quality interior design.
        </p>
      </div>

      {/* Marquee Carousel with Side Fades */}
      <div className="relative w-full overflow-hidden mb-12">
        <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee-slow hover:[animation-play-state:paused] space-x-6 w-max px-4">

          {[
            {
              name: 'Mohammed Rehan',
              location: 'Villa in Jubilee Hills, Hyderabad',
              img: '/images/indian_professional_man_1.png',
              review: 'I had my home interiors done by One Studio. They provide the best quality and service that every company can\'t provide. Truly the best interior design team in Hyderabad!',
            },
            {
              name: 'Jhansi Sony',
              location: '3BHK Duplex in Gachibowli',
              img: '/images/indian_professional_woman_1.png',
              review: 'I recently got my home interiors designed by One Studio and found this was the best place. They provided the best quality of woodwork with real dedication and 45-day delivery.',
            },
            {
              name: 'Prabavathi Muthukuru',
              location: 'Independent House in Banjara Hills',
              img: '/images/indian_professional_man_2.png',
              review: 'I chose One Studio for my apartment in Banjara Hills Hyderabad. I got the best experience and the modular kitchen execution was top class. Highly recommended!',
            },
            {
              name: 'Nithil Bathli',
              location: 'Villa in Kokapet',
              img: '/images/indian_professional_woman_1.png',
              review: 'I completed my interior project with One Studio. They provide outstanding customer service, transparent material wallets, and supportive interior designers.',
            },
          ].map((c) => (
            <div
              key={c.name}
              className="w-[310px] sm:w-[440px] bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200/80 shadow-md flex flex-col justify-between shrink-0 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div>
                <div className="flex justify-between items-center mb-5">
                  <div className="flex text-amber-400 text-base font-bold">★★★★★</div>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-emerald-200">
                    ✓ Verified Owner
                  </span>
                </div>
                <p className="text-slate-700 text-sm sm:text-base mb-6 italic leading-relaxed">
                  &ldquo;{c.review}&rdquo;
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3.5 border-t border-slate-100 pt-5">
                  <img alt={c.name} className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-sm shrink-0" src={c.img} />
                  <div className="flex-grow min-w-0">
                    <h5 className="text-slate-900 font-extrabold text-sm truncate">{c.name}</h5>
                    <p className="text-slate-500 text-[11px] font-medium truncate">Owner • {c.location}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                  <span>Google Review</span> • <span className="text-amber-500 font-black">5.0 ★</span>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Rating Summary Pill */}
      <div className="max-w-fit mx-auto px-6 py-3.5 bg-white rounded-full shadow-lg border border-slate-200 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-bold text-slate-700">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-900 text-base font-black">5.0 / 5.0</span>
          <div className="flex text-amber-400 text-sm font-bold">★★★★★</div>
        </div>
        <span className="text-slate-300 hidden sm:inline">|</span>
        <span className="text-slate-900 font-extrabold">121 Verified Google Reviews</span>
        <span className="text-slate-300 hidden sm:inline">|</span>
        <span className="text-slate-500 font-medium">One Studio, Hyderabad</span>
      </div>
    </section>
  );
}
