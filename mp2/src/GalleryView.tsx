import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Artwork, SortDir, SortKey } from './types/art';
import {browseArtworks, PLACEHOLDER_IMG, searchArtworks, toCard} from './services/aic';
import { useDebouncedValue } from './hooks/useDebouncedValue';

export default function GalleryView() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 400);

  const [dept, setDept] = useState<string>('');
  const [hasImage, setHasImage] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('title');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const [rows, setRows] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

// Fetch when search query changes (debounced)
useEffect(() => {
  let alive = true;
  (async () => {
    setLoading(true);
    setError(null);
    try {
      let allItems: Artwork[] = [];

      // fetch pages 1–3
      for (let page = 1; page <= 3; page++) {
        const resp = debouncedQuery
          ? await searchArtworks(debouncedQuery, page, 40)
          : await browseArtworks(page, 40);

        const items = resp.data.map(toCard);
        allItems = [...allItems, ...items];
      }

      if (!alive) return;
      setRows(allItems);
    } catch {
      if (!alive) return;
      setError('Failed to load artworks. Try again.');
    } finally {
      if (alive) setLoading(false);
    }
  })();
  return () => { alive = false; };
}, [debouncedQuery]);


  // Dynamic departments from current rows
  const departments = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) if (r.department) set.add(r.department);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [rows]);

  // Client search + filters + sort
  const filtered: Artwork[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = [...rows];

    if (q) {
      out = out.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.artist.toLowerCase().includes(q)
      );
    }
    if (dept) out = out.filter(r => r.department === dept);
    if (hasImage) out = out.filter(r => r.hasImage);

    out.sort((a, b) => {
      const va = (sortKey === 'title' ? a.title : a.date).toLowerCase();
      const vb = (sortKey === 'title' ? b.title : b.date).toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return out;
  }, [rows, query, dept, hasImage, sortKey, sortDir]);

  const ids = filtered.map(a => a.id);

  return (
    <section>
      <h2 className="page-title">Gallery</h2>

      <div className="controls">
        <input
          className="input"
          placeholder="Search artworks…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select className="select" value={dept} onChange={e => setDept(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <label className="btn-ghost" style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
          <input type="checkbox" checked={hasImage} onChange={e => setHasImage(e.target.checked)} />
          Has image
        </label>

        <select className="select" value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}>
          <option value="title">Sort: Title</option>
          <option value="date">Sort: Date</option>
        </select>

        <select className="select" value={sortDir} onChange={e => setSortDir(e.target.value as SortDir)}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      {loading && <p className="muted">Loading artworks…</p>}
      {error && <p className="muted" role="alert">{error}</p>}

      {/*<div className="masonry">*/}
      {/*  {filtered.map((a, idx) => (*/}
      {/*    <figure key={a.id} className="masonry-item">*/}
      {/*      <Link*/}
      {/*        to={`/artworks/${a.id}`}*/}
      {/*        state={{ ids, currentIndex: idx }}*/}
      {/*        className="masonry-card"*/}
      {/*        style={{ display:'block', textDecoration:'none', color:'inherit' }}*/}
      {/*      >*/}
      {/*        <img src={a.imageUrl} alt={a.title} />*/}
      {/*        <figcaption className="caption">*/}
      {/*          <strong>{a.title}</strong><br />*/}
      {/*          <span className="card-meta">{a.artist} {a.date ? `— ${a.date}` : ''}</span>*/}
      {/*        </figcaption>*/}
      {/*      </Link>*/}
      {/*    </figure>*/}
      {/*  ))}*/}
      {/*</div>*/}
        <div className="grid grid-4">
        {filtered.map((a, idx) => (
          <Link
            key={a.id}
            to={`/artworks/${a.id}`}
            state={{ ids, currentIndex: idx }}
            className="card"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <img
              src={a.imageUrl}
              alt={a.title}
              className="thumb-img"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (img.src !== PLACEHOLDER_IMG) img.src = PLACEHOLDER_IMG;
              }}
            />
            <div className="card-body">
              <h4 className="card-title">{a.title}</h4>
              {/* <div className="card-meta">
                {a.artist} {a.date ? `— ${a.date}` : ''}
              </div> */}
            </div>
          </Link>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <p className="muted">No results. Try “monet”, “van gogh”, “warhol”…</p>
      )}
    </section>
  );
}
