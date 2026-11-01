import { Link } from 'react-router-dom';
import {
  Package, ShoppingBag, ArrowRight,
  Store, Shield, Flame, Apple, Drumstick, Beef, Egg
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import heroMarketImg from '../assets/hero-market.jpg';

const FARM_CATEGORIES = [
  { name: 'Fresh Vegetables & Peppers', desc: 'Navrongo tomatoes, kpakpo shito, garden eggs & okra', icon: Store },
  { name: 'Tubers & Roots', desc: 'Techiman pona yam, cassava for fufu, cocoyam & sweet potatoes', icon: Package },
  { name: 'Plantains & Bananas', desc: 'Green apem for fufu/ampesi, ripe apantu & cooking bananas', icon: ShoppingBag },
  { name: 'Leafy Greens & Fresh Herbs', desc: 'Fresh kontomire, gboma, spring onions & local cabbage', icon: Shield },
  { name: 'Fresh Fruits & Citrus', desc: 'Sugarloaf pineapples, sweet oranges, watermelons & pawpaw', icon: Apple },
  { name: 'Poultry & Farm-Dressed Birds', desc: 'Fresh dressed broiler chicken, guinea fowls & roosters', icon: Drumstick },
  { name: 'Butchery & Fresh Meat', desc: 'Tender goat meat cuts, beef for soup & fresh pork cuts', icon: Beef },
  { name: 'Eggs & Fresh Farm Dairy', desc: 'Crates of farm eggs, 300-egg master cartons & fresh cow milk', icon: Egg },
  { name: 'Cooking Oils & Essentials', desc: 'Artisanal zomi palm oil, fresh palm nuts & soup groundnuts', icon: Flame },
  { name: 'Local Grains & Legumes', desc: 'Ghana brown/white rice, white cowpeas & dried yellow maize', icon: Package },
];

function HeroImageCard() {
  return (
    <div className="relative group rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-white/20 bg-slate-900/50">
      {/* Main Image with aspect ratio and smooth hover zoom */}
      <img
        src={heroMarketImg}
        alt="Ghanaian wholesale fresh farm produce and market harvests"
        className="w-full h-[360px] sm:h-[420px] lg:h-[460px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        loading="eager"
      />

      {/* Directional Vignette Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

      {/* Floating Top Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className="badge bg-slate-900/80 backdrop-blur-md text-amber-300 border border-white/20 px-3 py-1.5 text-xs font-semibold shadow-md">
          🌾 Fresh From Farm & Market Hubs
        </span>
      </div>

      {/* Floating Bottom Card */}
      <div className="absolute bottom-4 left-4 right-4 z-10 backdrop-blur-md bg-slate-900/85 border border-white/15 rounded-2xl p-3.5 sm:p-4 text-white shadow-xl">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Direct Food Vendor Supply
            </span>
          </div>
          <span className="text-[11px] text-white/60">Ghana Agriculture</span>
        </div>
        <p className="font-semibold text-sm sm:text-base text-white mt-1">
          Vegetables, Tubers, Poultry, Meat, Eggs & Milk
        </p>
        <p className="text-xs text-white/70 mt-0.5">
          Direct harvest & farm-gate pricing for chop bars, restaurants & caterers
        </p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#0a3d20] to-slate-950 text-white py-12 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-950/40">
        {/* Ambient Decorative Glows */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Connecting Food Vendors to Fresh Farm Produce & Animal Protein
            </h1>

            <p className="text-base sm:text-lg text-white/85 max-w-xl leading-relaxed">
              Direct sourcing for Ghanaian chop bars, restaurants, street food kitchens, and caterers. Order farm-fresh vegetables, tubers, plantains, grains, tropical fruits, poultry, butchery cuts, eggs, and farm milk directly from local producers.
            </p>

            {/* Hero Image for Mobile & Tablet (displayed above buttons) */}
            <div className="w-full lg:hidden">
              <HeroImageCard />
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {user ? (
                <Link to="/dashboard" className="btn bg-white text-brand hover:bg-slate-100 btn-lg font-bold shadow-xl">
                  Go to Dashboard <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link to="/products" className="btn bg-white text-brand hover:bg-slate-100 btn-lg font-bold shadow-xl">
                    Browse Farm Produce <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/register" className="btn bg-brand-dark hover:bg-brand text-white border border-white/20 btn-lg font-semibold">
                    Register as Food Vendor / Farmer
                  </Link>
                </>
              )}
              <Link to="/suppliers" className="btn-ghost text-white/90 hover:text-white hover:bg-white/10 btn-lg">
                View Farmers & Hubs
              </Link>
            </div>

            {/* Trust highlights */}
            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/70">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Direct from Techiman, Ada, Agbogbloshie & Suhum
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Farm-Gate Prices & Transparent Crate/Sack Weights
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Early-Morning Kitchen Delivery or Market Pickup
              </span>
            </div>
          </div>

          {/* Right Column: Hero Image Showcase for Desktop */}
          <div className="hidden lg:block lg:col-span-5 relative w-full">
            <HeroImageCard />
          </div>
        </div>
      </section>


      {/* Sourcing Workflow Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="section-title text-2xl">How WholesaleLink Works for Food Vendors</h2>
          <p className="text-slate-500 text-sm mt-1">
            Say goodbye to 4:00 AM market struggles and unpredictable middleman price gouging.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-brand flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Browse Harvests & Compare</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Compare current batch prices, crate sizes, sack weights, and stock levels from farmers and aggregators across Ghana.
            </p>
          </div>

          <div className="card p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-brand flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">Order In Farm Quantities</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Order by crates of tomatoes, bunches of plantain, 100-tuber yam batches, or 50kg sacks. Single-wholesaler orders ensure clear accountability.
            </p>
          </div>

          <div className="card p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-brand flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">Kitchen Delivery & 1-Click Reorders</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Choose early-morning delivery to your chop bar or pickup at the market depot. Repeat recurring produce orders with a single tap.
            </p>
          </div>
        </div>
      </section>

      {/* Browse Fresh Produce Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title text-2xl">Browse by Farm Produce Category</h2>
            <p className="text-slate-500 text-sm mt-0.5">Explore fresh crops and ingredients currently available</p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-brand hover:underline flex items-center gap-1">
            View all produce <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FARM_CATEGORIES.map(({ name, desc, icon: Icon }) => (
            <Link
              key={name}
              to={`/products?category=${encodeURIComponent(name)}`}
              className="card p-5 hover:shadow-md transition-all border border-surface-border hover:border-brand/40 flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-primary-50 text-brand flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900 text-base leading-snug">{name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-normal">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
