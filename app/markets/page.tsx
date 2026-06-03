import { Ticker } from "@/components/ticker";

export default function MarketsPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="border-b border-gray-900 pb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="text-xs text-[#38bdf8] tracking-widest font-mono uppercase block mb-1">
                Global Infrastructure Index
              </span>
              <h1 className="text-3xl font-bold tracking-tight">
                Market Directory Matrix
              </h1>
              <p className="text-gray-400 text-sm mt-2 max-w-2xl">
                Daily static index tracking across 300+ raw materials providers, equipment manufacturers, and global fabrication foundries.
              </p>
            </div>
            
            {/* Snapshot Indicator */}
            <div className="flex items-center gap-2 bg-[#111827] border border-gray-800 rounded-full px-4 py-1.5 self-start md:self-center">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                Daily Closing Rates
              </span>
            </div>
          </div>
        </header>

        {/* The 300+ Company Searchable Grid Component */}
        <section className="w-full">
          <Ticker />
        </section>

      </div>
    </main>
  );
}