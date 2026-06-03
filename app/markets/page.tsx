import { Ticker } from "@/components/ticker";

export default function MarketPage() {
  return (
    <main className="min-h-screen p-6 bg-[#0B0F19] text-white">
      {/* Page Header */}
      <header className="mb-8 max-w-5xl mx-auto">
        <span className="text-xs text-[#38bdf8] tracking-widest font-mono uppercase">
          Live Infrastructure
        </span>
        <h1 className="text-3xl font-bold mt-1">Global Market Tracker</h1>
        <p className="text-gray-400 text-sm mt-2">
          Real-time semiconductor supply chain equity quotes and index tracking.
        </p>
      </header>

      {/* Ticker Component Wrapper */}
      <section className="max-w-5xl mx-auto bg-[#111827] rounded-xl border border-gray-800 p-4">
        <Ticker />
      </section>
    </main>
  );
}