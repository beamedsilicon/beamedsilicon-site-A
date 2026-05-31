const TOPICS = [
  "Logic Nodes",
  "HBM & Memory",
  "Advanced Packaging",
  "EUV Lithography",
  "Export Controls",
  "CHIPS Act",
  "China Fabs",
  "TSMC",
  "ASML",
  "Nvidia",
  "Samsung Foundry",
  "Intel Foundry",
  "Rare Earth Minerals",
  "Photoresists",
  "Wafer Economics",
  "AI Accelerators",
  "Silicon Carbide",
  "CoWoS / SoIC",
  "Reshoring",
  "RISC-V",
  "Polysilicon",
  "Vacuum Systems",
]

export function Topics() {
  return (
    <section className="topics">
      <div className="wrap">
        <div className="topics-l">EXPLORE BY TOPIC</div>
        <div className="chip-list">
          {TOPICS.map((topic) => (
            <span className="chip" key={topic}>
              {topic}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
