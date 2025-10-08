// src/ListView.tsx
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Artwork, SortDir, SortKey } from './types/art';
import {
  browseArtworks,
  searchArtworks,
  toCard,
  PLACEHOLDER_IMG,
} from './services/aic';
import { useDebouncedValue } from './hooks/useDebouncedValue';

export default function ListView() {
  // --- Controls ---
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 400);

  const [dept, setDept] = useState<string>('');
  const [hasImageOnly, setHasImageOnly] = useState<boolean>(true); // show only real images by default
  const [sortKey, setSortKey] = useState<SortKey>('title');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // --- Data state ---
  const [rows, setRows] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // // Fetch when search query changes (debounced)
  // useEffect(() => {
  //   let alive = true;
  //   (async () => {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const resp = debouncedQuery
  //         ? await searchArtworks(debouncedQuery, 1, 40)
  //         : await browseArtworks(1, 40);
  //       const items = resp.data.map(toCard);
  //       if (!alive) return;
  //       setRows(items);
  //     } catch {
  //       if (!alive) return;
  //       setError('Failed to load artworks. Try again.');
  //     } finally {
  //       if (alive) setLoading(false);
  //     }
  //   })();
  //   return () => {
  //     alive = false;
  //   };
  // }, [debouncedQuery]);
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


  // Build department options from current payload
  const departments = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) if (r.department) set.add(r.department);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [rows]);

  // Client-side filter + sort
  const filtered: Artwork[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = [...rows];

    // text filter (title or artist)
    if (q) {
      out = out.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.artist.toLowerCase().includes(q),
      );
    }

    // department
    if (dept) out = out.filter((r) => r.department === dept);

    // image toggle (compare to known placeholder URL)
    if (hasImageOnly) {
      out = out.filter((r) => r.imageUrl !== PLACEHOLDER_IMG);
    }

    // sort
    out.sort((a, b) => {
      const va = (sortKey === 'title' ? a.title : a.date).toLowerCase();
      const vb = (sortKey === 'title' ? b.title : b.date).toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return out;
  }, [rows, query, dept, hasImageOnly, sortKey, sortDir]);

  const ids = filtered.map((a) => a.id);

  return (
    <section>
      <h2 className="page-title">Browse the Collection</h2>

      {/* Controls */}
      <div className="controls">
        <input
          className="input"
          placeholder="Search by title or artist…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="select"
          value={dept}
          onChange={(e) => setDept(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <label
          className="btn-ghost"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          title={
            hasImageOnly
              ? 'Showing items with real images'
              : 'Including items without images (placeholder shown)'
          }
        >
          <input
            type="checkbox"
            checked={hasImageOnly}
            onChange={(e) => setHasImageOnly(e.target.checked)}
          />
          Has image
        </label>

        <select
          className="select"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
        >
          <option value="title">Sort: Title</option>
          <option value="date">Sort: Date</option>
        </select>

        <select
          className="select"
          value={sortDir}
          onChange={(e) => setSortDir(e.target.value as SortDir)}
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      {/* Status */}
      {loading && <p className="muted">Loading artworks…</p>}
      {error && (
        <p className="muted" role="alert">
          {error}
        </p>
      )}

      {/* Grid */}
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
