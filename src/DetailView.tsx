import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import type { Artwork } from './types/art';
import { fetchArtwork, toCard } from './services/aic';

type NavState = { ids: number[]; currentIndex: number } | null;

export default function DetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as NavState) || null;

  const curId = Number(id);
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    async function run() {
      setLoading(true);
      setErr(null);
      try {
        const raw = await fetchArtwork(curId);
        if (!alive) return;
        setArtwork(raw ? toCard(raw) : null);
      } catch (e) {
        if (!alive) return;
        setErr('Failed to load artwork.');
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => { alive = false; };
  }, [curId]);

  const ids = state?.ids ?? [];
  const currentIndex = state?.currentIndex ?? -1;
  const prevId = currentIndex > 0 ? ids[currentIndex - 1] : null;
  const nextId = currentIndex >= 0 && currentIndex < ids.length - 1 ? ids[currentIndex + 1] : null;

  const goto = (toId: number | null) => {
    if (!toId) return;
    const nextIndex = ids.findIndex(x => x === toId);
    navigate(`/artworks/${toId}`, { state: { ids, currentIndex: nextIndex } });
  };

  if (loading) return <p className="muted">Loading…</p>;
  if (err || !artwork) return (
    <section>
      <p className="muted">{err ?? 'Artwork not found.'}</p>
      <Link to="/gallery" className="btn-ghost" style={{ textDecoration:'none' }}>Back to gallery</Link>
    </section>
  );

  return (
    <section>
      <div className="detail">
        <div className="detail-image">
          <img src={artwork.imageUrl} alt={artwork.title} />
        </div>

        <aside className="detail-panel">
          <h2 className="detail-title">{artwork.title}</h2>
          <div className="muted">{artwork.artist} {artwork.date ? `— ${artwork.date}` : ''}</div>

          <dl className="detail-dl">
            <dt>Department</dt><dd>{artwork.department || '—'}</dd>
            <dt>Medium</dt><dd>{artwork.medium || '—'}</dd>
          </dl>

          <div className="detail-nav">
            <button className="btn-ghost" disabled={!prevId} onClick={() => goto(prevId)}>← Prev</button>
            <button className="btn" disabled={!nextId} onClick={() => goto(nextId)}>Next →</button>
            <Link to="/gallery" className="btn-ghost" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center' }}>
              Back
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
