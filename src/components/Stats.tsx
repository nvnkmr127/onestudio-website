export default function Stats() {
  const projectsCompleted = "240"
  const yearsOfExperience = "15"

  return (
    <>
      <div className="bg-white border-y border-gray-100 py-8 overflow-hidden flex whitespace-nowrap">
        <div className="flex items-center space-x-12 animate-marquee text-sm font-bold text-slate-600 uppercase tracking-wider">
          <div className="flex items-center space-x-12">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-orange"></span>Timely Delivery</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-orange"></span>Premium Material Quality</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-orange"></span>Transparent Pricing</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-orange"></span>3D Visualization Available</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-orange"></span>Bespoke Interior Designs</div>
          </div>
          <div className="flex items-center space-x-12">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-orange"></span>Timely Delivery</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-orange"></span>Premium Material Quality</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-orange"></span>Transparent Pricing</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-orange"></span>3D Visualization Available</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-orange"></span>Bespoke Interior Designs</div>
          </div>
        </div>
      </div>
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="bg-gray-100 rounded-3xl p-10 relative overflow-hidden">
              <div className="flex items-center gap-4 mb-8">
                <div className="text-6xl font-extrabold text-dark-charcoal">{projectsCompleted}+</div>
                <div className="h-10 w-1 bg-primary-orange"></div>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Projects, Clients Served</p>
              </div>
              <img
                alt="Interior Design Plan"
                className="rounded-2xl shadow-2xl"
                src="/images/bangalore_modern_interior.png"
              />
              <div className="absolute -bottom-10 -right-10 w-48">
                <img
                  alt="Interior Design Label"
                  className="rounded-full animate-spin-slow"
                  src="/images/bangalore_modern_interior.png"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-[2px] bg-primary-orange"></div>
              <span className="text-primary-orange font-bold uppercase tracking-widest text-xs">About One Studio</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-dark-charcoal mb-6 leading-tight">
              Crafting Hyderabad's Premier Luxury Interiors
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed text-lg">
              At One Studio, we bring your vision to life with precision and passion. We specialize in bespoke modular kitchens, living spaces, and turnkey commercial interiors delivered on schedule.
            </p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary-orange">check_circle</span>
                <span className="text-dark-charcoal font-bold">100% Custom 3D VR &amp; Space Planning</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary-orange">check_circle</span>
                <span className="text-dark-charcoal font-bold">10-Year Warranty on Modular &amp; Woodwork</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary-orange">check_circle</span>
                <span className="text-dark-charcoal font-bold">In-House Team of Expert Interior Designers</span>
              </li>
            </ul>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="bg-dark-charcoal p-8 rounded-3xl text-white relative group overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute inset-0 bg-primary-orange opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="text-5xl font-black mb-2 text-primary-orange">{yearsOfExperience}+</div>
                <p className="text-sm font-medium text-gray-300 uppercase tracking-widest">Years of Trust</p>
                <div className="absolute top-6 right-6">
                  <span className="material-symbols-outlined text-4xl text-gray-600 group-hover:text-primary-orange transition-colors">military_tech</span>
                </div>
              </div>
              <div className="flex flex-col justify-center bg-orange-50 p-8 rounded-3xl border border-orange-100 relative group transition-all duration-300 hover:shadow-md">
                <span className="text-6xl text-primary-orange/20 absolute top-2 right-4">"</span>
                <p className="text-dark-charcoal italic font-medium leading-relaxed relative z-10 text-sm">
                  "Our commitment to excellence drives every space we transform across Hyderabad."
                </p>
                <p className="text-primary-orange font-bold text-[10px] uppercase mt-4 tracking-widest">— Founder, One Studio</p>
              </div>
            </div>
            <a className="bg-primary-orange text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 w-fit transition-all duration-300 hover:bg-orange-600 hover:shadow-lg hover:-translate-y-1" href="#">
              DISCOVER MORE <span className="bg-black/20 rounded-full p-1 text-xs">→</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
