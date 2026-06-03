export function SiteHeader() {
  return (
    <header>
      <div className="wrap">
        <nav>
          <a href="/" className="logo" aria-label="Beamed Silicon — home">
            <div className="logo-icon">
              <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="5.5" y="5.5" width="7" height="7" rx="1" stroke="#f5b731" strokeWidth="1.2" />
                <line x1="9" y1="0" x2="9" y2="4.5" stroke="#f5b731" strokeWidth="1" />
                <line x1="9" y1="13.5" x2="9" y2="18" stroke="#f5b731" strokeWidth="1" />
                <line x1="0" y1="9" x2="4.5" y2="9" stroke="#f5b731" strokeWidth="1" />
                <line x1="13.5" y1="9" x2="18" y2="9" stroke="#f5b731" strokeWidth="1" />
                <line x1="2" y1="2" x2="5" y2="5" stroke="#f5b731" strokeWidth="0.8" opacity="0.45" />
                <line x1="13" y1="5" x2="16" y2="2" stroke="#f5b731" strokeWidth="0.8" opacity="0.45" />
                <line x1="5" y1="13" x2="2" y2="16" stroke="#f5b731" strokeWidth="0.8" opacity="0.45" />
                <line x1="13" y1="13" x2="16" y2="16" stroke="#f5b731" strokeWidth="0.8" opacity="0.45" />
              </svg>
            </div>
            <span className="logo-name">
              <span className="logo-beamed">beamed</span><span className="logo-silicon">silicon</span>
            </span>
          </a>
          <ul className="nav-links">
            <li><a href="#">News</a></li>
            <li><a href="#sc-map">Supply Chain</a></li>
            <li><a href="#">Companies</a></li>
            <li><a href="/markets">Markets</a></li>
            <li><a href="#">Policy</a></li>
          </ul>
          <a href="#contact" className="btn-sub">CONTACT</a>
        </nav>
      </div>
    </header>
  )
}