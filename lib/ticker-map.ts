/**
 * lib/ticker-map.ts
 *
 * Maps company names (as they appear in lib/tiers.ts) to their primary
 * exchange ticker symbols. Only publicly traded companies are included.
 * Private companies, subsidiaries, and unlisted firms are intentionally omitted.
 *
 * Exchange suffixes follow Yahoo Finance convention:
 *   .T  = Tokyo Stock Exchange
 *   .KS = Korea Stock Exchange
 *   .TW = Taiwan Stock Exchange
 *   .HK = Hong Kong Stock Exchange
 *   .DE = XETRA (Germany)
 *   .AS = Amsterdam (Netherlands)
 *   .PA = Paris
 *   .L  = London
 *   .OL = Oslo
 *   .AX = ASX (Australia)
 *   .ST = Stockholm
 *   No suffix = US (NYSE / NASDAQ)
 */

export interface TickerEntry {
  symbol: string
  /** Friendly exchange label shown in the UI */
  exchange: string
}

export const TICKER_MAP: Record<string, TickerEntry> = {
  // ── TIER 1: Fabless Designers ──────────────────────────────────────────────
  "Nvidia":                    { symbol: "NVDA",      exchange: "NASDAQ" },
  "AMD":                       { symbol: "AMD",       exchange: "NASDAQ" },
  "Apple":                     { symbol: "AAPL",      exchange: "NASDAQ" },
  "Qualcomm":                  { symbol: "QCOM",      exchange: "NASDAQ" },
  "Broadcom":                  { symbol: "AVGO",      exchange: "NASDAQ" },
  "MediaTek":                  { symbol: "2454.TW",   exchange: "TWSE" },
  "Marvell Technology":        { symbol: "MRVL",      exchange: "NASDAQ" },
  "Amazon Web Services":       { symbol: "AMZN",      exchange: "NASDAQ" },
  "Google":                    { symbol: "GOOGL",     exchange: "NASDAQ" },
  "Microsoft":                 { symbol: "MSFT",      exchange: "NASDAQ" },
  "Meta Platforms":            { symbol: "META",      exchange: "NASDAQ" },
  "Tesla":                     { symbol: "TSLA",      exchange: "NASDAQ" },
  "Cisco Systems":             { symbol: "CSCO",      exchange: "NASDAQ" },
  "IBM":                       { symbol: "IBM",       exchange: "NYSE" },
  "Realtek Semiconductor":     { symbol: "2379.TW",   exchange: "TWSE" },
  "Novatek Microelectronics":  { symbol: "3034.TW",   exchange: "TWSE" },
  "Cirrus Logic":              { symbol: "CRUS",      exchange: "NASDAQ" },
  "Skyworks Solutions":        { symbol: "SWKS",      exchange: "NASDAQ" },
  "Qorvo":                     { symbol: "QRVO",      exchange: "NASDAQ" },
  "Monolithic Power Systems":  { symbol: "MPWR",      exchange: "NASDAQ" },
  "Ambarella":                 { symbol: "AMBA",      exchange: "NASDAQ" },
  "Lattice Semiconductor":     { symbol: "LSCC",      exchange: "NASDAQ" },
  "Synaptics":                 { symbol: "SYNA",      exchange: "NASDAQ" },
  "Wolfspeed":                 { symbol: "WOLF",      exchange: "NYSE" },
  "Nordic Semiconductor":      { symbol: "NOD.OL",    exchange: "Oslo" },
  "Macom Technology Solutions":{ symbol: "MTSI",      exchange: "NASDAQ" },
  "Semtech":                   { symbol: "SMTC",      exchange: "NASDAQ" },
  "MaxLinear":                 { symbol: "MXL",       exchange: "NASDAQ" },
  "Allegro MicroSystems":      { symbol: "ALGM",      exchange: "NASDAQ" },
  "Rambus":                    { symbol: "RMBS",      exchange: "NASDAQ" },
  "Silicon Laboratories":      { symbol: "SLAB",      exchange: "NASDAQ" },
  "Himax Technologies":        { symbol: "HIMX",      exchange: "NASDAQ" },
  "Hailo":                     { symbol: "HALO",      exchange: "NASDAQ" },
  "BrainChip":                 { symbol: "BRN.AX",    exchange: "ASX" },

  // ── TIER 2: Foundries, IDMs & OSATs ───────────────────────────────────────
  "TSMC":                      { symbol: "TSM",       exchange: "NYSE" },
  "Samsung Foundry":           { symbol: "005930.KS", exchange: "KRX" },
  "Intel Foundry":             { symbol: "INTC",      exchange: "NASDAQ" },
  "SK Hynix":                  { symbol: "000660.KS", exchange: "KRX" },
  "Micron Technology":         { symbol: "MU",        exchange: "NASDAQ" },
  "GlobalFoundries":           { symbol: "GFS",       exchange: "NASDAQ" },
  "UMC":                       { symbol: "UMC",       exchange: "NYSE" },
  "SMIC":                      { symbol: "0981.HK",   exchange: "HKEX" },
  "Texas Instruments":         { symbol: "TXN",       exchange: "NASDAQ" },
  "STMicroelectronics":        { symbol: "STM",       exchange: "NYSE" },
  "Infineon Technologies":     { symbol: "IFX.DE",    exchange: "XETRA" },
  "NXP Semiconductors":        { symbol: "NXPI",      exchange: "NASDAQ" },
  "Analog Devices":            { symbol: "ADI",       exchange: "NASDAQ" },
  "Renesas Electronics":       { symbol: "6723.T",    exchange: "TSE" },
  "Microchip Technology":      { symbol: "MCHP",      exchange: "NASDAQ" },
  "onsemi":                    { symbol: "ON",        exchange: "NASDAQ" },
  "Sony Semiconductor Solutions": { symbol: "6758.T", exchange: "TSE" },
  "Kioxia":                    { symbol: "285A.T",    exchange: "TSE" },
  "Tower Semiconductor":       { symbol: "TSEM",      exchange: "NASDAQ" },
  "ASE Group":                 { symbol: "ASX",       exchange: "NYSE" },
  "Amkor Technology":          { symbol: "AMKR",      exchange: "NASDAQ" },
  "Hua Hong Semiconductor":    { symbol: "1347.HK",   exchange: "HKEX" },
  "Win Semiconductors":        { symbol: "3105.TW",   exchange: "TWSE" },
  "DB Hitek":                  { symbol: "000990.KS", exchange: "KRX" },
  "ChipMOS Technologies":      { symbol: "IMOS",      exchange: "NASDAQ" },
  "Rohm Semiconductor":        { symbol: "6963.T",    exchange: "TSE" },
  "SkyWater Technology":       { symbol: "SKYT",      exchange: "NASDAQ" },
  "X-Fab":                     { symbol: "XFAB.DE",   exchange: "XETRA" },
  "Powertech Technology":      { symbol: "6239.TW",   exchange: "TWSE" },

  // ── TIER 3: SME Integrators ───────────────────────────────────────────────
  "ASML":                      { symbol: "ASML",      exchange: "NASDAQ" },
  "Applied Materials":         { symbol: "AMAT",      exchange: "NASDAQ" },
  "Lam Research":              { symbol: "LRCX",      exchange: "NASDAQ" },
  "Tokyo Electron":            { symbol: "8035.T",    exchange: "TSE" },
  "KLA Corporation":           { symbol: "KLAC",      exchange: "NASDAQ" },
  "Nikon Corporation":         { symbol: "7731.T",    exchange: "TSE" },
  "Canon Inc.":                { symbol: "CAJ",       exchange: "NYSE" },
  "Screen Holdings":           { symbol: "7735.T",    exchange: "TSE" },
  "ASM International":         { symbol: "ASMIY",     exchange: "OTC" },
  "Hitachi High-Tech":         { symbol: "8036.T",    exchange: "TSE" },
  "Advantest":                 { symbol: "ATE",       exchange: "NYSE" },
  "Teradyne":                  { symbol: "TER",       exchange: "NASDAQ" },
  "Kokusai Electric":          { symbol: "6525.T",    exchange: "TSE" },
  "Onto Innovation":           { symbol: "ONTO",      exchange: "NYSE" },
  "Veeco Instruments":         { symbol: "VECO",      exchange: "NASDAQ" },
  "BE Semiconductor Industries": { symbol: "BESI.AS", exchange: "AEX" },
  "Kulicke & Soffa":           { symbol: "KLIC",      exchange: "NASDAQ" },
  "Suss MicroTec":             { symbol: "SMHN.DE",   exchange: "XETRA" },
  "Disco Corporation":         { symbol: "6146.T",    exchange: "TSE" },
  "Tokyo Seimitsu":            { symbol: "7729.T",    exchange: "TSE" },
  "ACM Research":              { symbol: "ACMR",      exchange: "NASDAQ" },
  "Park Systems":              { symbol: "140860.KS", exchange: "KRX" },
  "FormFactor":                { symbol: "FORM",      exchange: "NASDAQ" },
  "Cohu":                      { symbol: "COHU",      exchange: "NASDAQ" },
  "Camtek":                    { symbol: "CAMT",      exchange: "NASDAQ" },
  "Nordson Corporation":       { symbol: "NDSN",      exchange: "NASDAQ" },
  "IPG Photonics":             { symbol: "IPGP",      exchange: "NASDAQ" },
  "Axcelis Technologies":      { symbol: "ACLS",      exchange: "NASDAQ" },
  "Nova Measuring Instruments":{ symbol: "NVMI",      exchange: "NASDAQ" },
  "Hanmi Semiconductor":       { symbol: "042700.KS", exchange: "KRX" },

  // ── TIER 4: Subsystems & Modules ──────────────────────────────────────────
  "MKS Instruments":           { symbol: "MKSI",      exchange: "NASDAQ" },
  "Advanced Energy":           { symbol: "AEIS",      exchange: "NASDAQ" },
  "Entegris":                  { symbol: "ENTG",      exchange: "NASDAQ" },
  "Coherent":                  { symbol: "COHR",      exchange: "NYSE" },
  "Jenoptik":                  { symbol: "JEN.DE",    exchange: "XETRA" },
  "Ultra Clean Holdings":      { symbol: "UCTT",      exchange: "NASDAQ" },
  "Ichor Systems":             { symbol: "ICHR",      exchange: "NASDAQ" },
  "Parker Hannifin":           { symbol: "PH",        exchange: "NYSE" },
  "Yaskawa Electric":          { symbol: "6506.T",    exchange: "TSE" },
  "Fanuc":                     { symbol: "6954.T",    exchange: "TSE" },
  "NSK Ltd.":                  { symbol: "6471.T",    exchange: "TSE" },
  "NTN Corporation":           { symbol: "6472.T",    exchange: "TSE" },
  "SKF Group":                 { symbol: "SKF-B.ST",  exchange: "OMX" },
  "Daihen Corporation":        { symbol: "6622.T",    exchange: "TSE" },
  "XP Power":                  { symbol: "XPP.L",     exchange: "LSE" },
  "Inficon":                   { symbol: "IFCN.SW",   exchange: "SIX" },
  "Edwards Vacuum":            { symbol: "ATLKY",     exchange: "OTC" },
  "Pfeiffer Vacuum":           { symbol: "PFV.DE",    exchange: "XETRA" },
  "Ebara Corporation":         { symbol: "6361.T",    exchange: "TSE" },
  "Comet Group":               { symbol: "COTN.SW",   exchange: "SIX" },
  "Moog Inc.":                 { symbol: "MOG-A",     exchange: "NYSE" },
  "Horiba":                    { symbol: "6856.T",    exchange: "TSE" },

  // ── TIER 5: Precision Components ──────────────────────────────────────────
  "Corning Inc.":              { symbol: "GLW",       exchange: "NYSE" },
  "Hoya Corporation":          { symbol: "7741.T",    exchange: "TSE" },
  "Frencken Group":            { symbol: "E28.SI",    exchange: "SGX" },
  "Renishaw":                  { symbol: "RSW.L",     exchange: "LSE" },
  "Kyocera Corporation":       { symbol: "KYO",       exchange: "NYSE" },
  "AGC Inc.":                  { symbol: "5201.T",    exchange: "TSE" },
  "Edmund Optics":             { symbol: "EDMO",      exchange: "OTC" },
  "Materion":                  { symbol: "MTRN",      exchange: "NYSE" },
  "Mitutoyo":                  { symbol: "7751.T",    exchange: "TSE" },
  "Maxon Motor":               { symbol: "MAXN",      exchange: "OTC" },
  "Samtec":                    { symbol: "SMTK",      exchange: "OTC" },
  "TDK-Lambda":                { symbol: "6762.T",    exchange: "TSE" },
  "Hirose Electric":           { symbol: "6806.T",    exchange: "TSE" },
  "Heraeus Conamic":           { symbol: "HERA.DE",   exchange: "XETRA" },

  // ── TIER 6: Process Materials ──────────────────────────────────────────────
  "Shin-Etsu Chemical":        { symbol: "SHECY",     exchange: "OTC" },
  "Sumco Corporation":         { symbol: "SUOPY",     exchange: "OTC" },
  "Siltronic AG":              { symbol: "WAF.DE",    exchange: "XETRA" },
  "SK Siltron":                { symbol: "361670.KS", exchange: "KRX" },
  "JSR Corporation":           { symbol: "4185.T",    exchange: "TSE" },
  "Tokyo Ohka Kogyo":          { symbol: "4186.T",    exchange: "TSE" },
  "DuPont Electronic Solutions": { symbol: "DD",      exchange: "NYSE" },
  "Merck KGaA":                { symbol: "MRK.DE",    exchange: "XETRA" },
  "Linde plc":                 { symbol: "LIN",       exchange: "NYSE" },
  "Air Liquide":               { symbol: "AI.PA",     exchange: "Euronext" },
  "Resonac":                   { symbol: "4004.T",    exchange: "TSE" },
  "BASF Electronic Materials": { symbol: "BAS.DE",    exchange: "XETRA" },
  "Umicore":                   { symbol: "UMI.BR",    exchange: "Euronext" },
  "Ibiden Co. Ltd.":           { symbol: "4062.T",    exchange: "TSE" },
  "Unimicron Technology":      { symbol: "3037.TW",   exchange: "TWSE" },
  "AT&S":                      { symbol: "ATS.VI",    exchange: "Vienna" },
  "Air Products and Chemicals":{ symbol: "APD",       exchange: "NYSE" },
  "Solvay":                    { symbol: "SOLVY",     exchange: "OTC" },
  "Arkema":                    { symbol: "AKE.PA",    exchange: "Euronext" },
  "Nitto Denko":               { symbol: "6988.T",    exchange: "TSE" },
  "Sekisui Chemical":          { symbol: "4204.T",    exchange: "TSE" },
  "Dexerials Corporation":     { symbol: "4980.T",    exchange: "TSE" },
  "Henkel Electronic Materials":{ symbol: "HENKY",    exchange: "OTC" },
  "Tanaka Precious Metals":    { symbol: "TNCKY",     exchange: "OTC" },
  "Adeka Corporation":         { symbol: "4401.T",    exchange: "TSE" },
  "Fujifilm Electronic Materials": { symbol: "FUJIY", exchange: "OTC" },
  "Sumitomo Chemical":         { symbol: "SOMMY",     exchange: "OTC" },

  // ── TIER 7: Extraction & Refining ─────────────────────────────────────────
  "Wacker Chemie":             { symbol: "WCH.DE",    exchange: "XETRA" },
  "OCI Company":               { symbol: "010060.KS", exchange: "KRX" },
  "Tokuyama Corporation":      { symbol: "4043.T",    exchange: "TSE" },
  "REC Silicon":               { symbol: "RECSI.OL",  exchange: "Oslo" },
  "Lynas Rare Earths":         { symbol: "LYC.AX",    exchange: "ASX" },
  "MP Materials":              { symbol: "MP",        exchange: "NYSE" },
  "Iluka Resources":           { symbol: "ILU.AX",    exchange: "ASX" },
  "Tronox":                    { symbol: "TROX",      exchange: "NYSE" },
  "Rio Tinto":                 { symbol: "RIO",       exchange: "NYSE" },
  "BHP Group":                 { symbol: "BHP",       exchange: "NYSE" },
  "Freeport-McMoRan":          { symbol: "FCX",       exchange: "NYSE" },
  "Antofagasta plc":           { symbol: "ANTO.L",    exchange: "LSE" },
  "Southern Copper Corporation":{ symbol: "SCCO",     exchange: "NYSE" },
  "Glencore":                  { symbol: "GLEN.L",    exchange: "LSE" },
  "Anglo American":            { symbol: "AAL.L",     exchange: "LSE" },
  "Vale S.A.":                 { symbol: "VALE",      exchange: "NYSE" },
  "Alcoa Corporation":         { symbol: "AA",        exchange: "NYSE" },
  "Norsk Hydro":               { symbol: "NHY.OL",    exchange: "Oslo" },
  "Sumitomo Metal Mining":     { symbol: "SMMYY",     exchange: "OTC" },
  "Mitsubishi Materials":      { symbol: "MIMTF",     exchange: "OTC" },
  "Albemarle Corporation":     { symbol: "ALB",       exchange: "NYSE" },
  "SQM":                       { symbol: "SQM",       exchange: "NYSE" },
  "Dow Chemical":              { symbol: "DOW",       exchange: "NYSE" },
  "ExxonMobil Chemical":       { symbol: "XOM",       exchange: "NYSE" },
  "Shell Chemical":            { symbol: "SHEL",      exchange: "NYSE" },
  "Chemours":                  { symbol: "CC",        exchange: "NYSE" },
  "Asahi Kasei":               { symbol: "AHKSY",     exchange: "OTC" },
  "Tosoh Corporation":         { symbol: "TOSHF",     exchange: "OTC" },
  "Mitsui Chemicals":          { symbol: "MITSY",     exchange: "OTC" },
  "Tokai Carbon":              { symbol: "5301.T",    exchange: "TSE" },
}

/** Returns the ticker entry for a company name, or null if not publicly traded. */
export function getTicker(companyName: string): TickerEntry | null {
  return TICKER_MAP[companyName] ?? null
}