export default function PageHero({
  title,
  subtitle,
  image = "/images/bangalore_hero_building.png"
}: {
  title: string;
  subtitle?: string;
  image?: string;
}) {
  return (
    <section className="relative min-h-[380px] md:min-h-[420px] flex items-center justify-center overflow-hidden pt-24 pb-12">
      <div className="absolute inset-0 z-0">
        <img
          alt="Header Background"
          className="w-full h-full object-cover"
          src={image}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 w-full text-center space-y-4">
        <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-200 text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="w-24 h-1 bg-primary-orange mx-auto rounded-full"></div>
      </div>
    </section>
  );
}
