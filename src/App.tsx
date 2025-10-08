import { NavLink, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import './index.css';
import ListView from './ListView';
import GalleryView from './GalleryView';
import DetailView from './DetailView';
import aicLogo from './assets/aic-logo.svg';

function App() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'active' : undefined;

  return (
    <>
      {/* NAVBAR */}
      <header className="site-header site-header--beige">
        <div className="header-inner header-inner--edge">
          <Link to="/" className="brand-wrap" aria-label="AIC Home">
            <img src={aicLogo} className="brand-logo brand-logo--lg" alt="AIC logo" />
            <span className="brand">AIC Gallery</span>
          </Link>

          <nav className="nav">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/gallery" className={linkClass}>Gallery</NavLink>
          </nav>
        </div>
      </header>

      {/* ROUTES */}
      <main className="page">
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* HERO */}
                <section className="home-hero home-hero--edge">
                  <div className="home-hero__bg" />
                  <div className="home-hero__copy">
                    <h1 className="home-title">Welcome to Art Institute of Chicago Gallery</h1>
                    <p className="home-sub">
                      Explore highlights from the collection. Use the search and filters to find artists, movements, and mediums—
                      then open any artwork to see details and step through results.
                    </p>
                    <Link to="/gallery" className="btn btn--light">Explore the Collection</Link>
                  </div>
                </section>

                {/* List section */}
                <div id="browse" className="section-edge">
                  <ListView />
                </div>
              </>
            }
          />
          <Route path="/gallery" element={<GalleryView />} />
          <Route path="/artworks/:id" element={<DetailView />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-inner footer-inner--edge">
          <small>Data courtesy of the Art Institute of Chicago API</small>
          <div className="social">
            <a href="https://instagram.com/artinstitutechi" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.youtube.com/user/ArtInstituteChicago" target="_blank" rel="noreferrer">YouTube</a>
            <a href="https://www.facebook.com/artic" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://twitter.com/artinstitutechi" target="_blank" rel="noreferrer">X</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
