import { useMemo, useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Link } from 'react-router-dom';
import { UserIcon, CalendarIcon, MapPinIcon, BriefcaseIcon, HeartIcon } from '@heroicons/react/24/solid';
import { toPng } from 'html-to-image';

// ─── Layout Constants ────────────────────────────────────────────
const CARD_W = 180;
const CARD_H = 80;
const H_GAP = 50;        // horizontal gap between sibling subtrees
const V_GAP = 90;        // vertical gap between generations
const COUPLE_GAP = 8;    // gap between spouses
const PHOTO_SIZE = 48;
const PADDING = 60;
const MIN_SCALE = 0.15;
const MAX_SCALE = 2.5;

// ─── Build Tree Structure ────────────────────────────────────────
function buildTree(persons, relationships) {
  const personMap = new Map(persons.map(p => [p.id, { ...p, spouseIds: [], childIds: [], parentIds: [] }]));
  const spousePairs = [];

  for (const rel of relationships) {
    const { type, person1_id: p1, person2_id: p2 } = rel;
    if (!personMap.has(p1) || !personMap.has(p2)) continue;
    if (type === 'spouse' || type === 'ex_spouse' || type === 'partner') {
      spousePairs.push([p1, p2]);
      personMap.get(p1).spouseIds.push(p2);
      personMap.get(p2).spouseIds.push(p1);
    } else if (['parent_child', 'step_parent_child', 'adoptive_parent_child', 'guardian'].includes(type)) {
      personMap.get(p1).childIds.push(p2);
      personMap.get(p2).parentIds.push(p1);
    }
  }

  // Deduplicate couples
  const coupleKeys = new Set();
  const couples = [];
  for (const [a, b] of spousePairs) {
    const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
    if (!coupleKeys.has(key)) { coupleKeys.add(key); couples.push([a, b]); }
  }

  // Build family units
  const inCouple = new Set();
  for (const [a, b] of couples) { inCouple.add(a); inCouple.add(b); }

  const familyUnits = [];
  const parentUnitMap = new Map();
  const childAssigned = new Set();

  for (const [a, b] of couples) {
    const aKids = new Set(personMap.get(a)?.childIds || []);
    const bKids = new Set(personMap.get(b)?.childIds || []);
    const shared = [...aKids].filter(k => bKids.has(k));
    const kids = shared.length > 0 ? shared : [...new Set([...aKids, ...bKids])];
    const idx = familyUnits.length;
    familyUnits.push({ parents: [a, b], children: kids });
    parentUnitMap.set(a, idx);
    parentUnitMap.set(b, idx);
    kids.forEach(k => childAssigned.add(k));
  }

  for (const [id, p] of personMap) {
    if (!inCouple.has(id) && p.childIds.length > 0) {
      const kids = p.childIds.filter(k => !childAssigned.has(k));
      if (kids.length > 0) {
        const idx = familyUnits.length;
        familyUnits.push({ parents: [id], children: kids });
        parentUnitMap.set(id, idx);
        kids.forEach(k => childAssigned.add(k));
      }
    }
  }

  // ── Smart generation assignment ──
  // True roots: no parents AND their spouse also has no parents
  // Married-in: no parents BUT spouse has parents → get gen from spouse via BFS
  const generation = new Map();
  const queue = [];
  let head = 0;

  const noParents = [...personMap.keys()].filter(id => personMap.get(id).parentIds.length === 0);
  for (const id of noParents) {
    const hasSpouseWithParents = personMap.get(id).spouseIds.some(
      sid => personMap.get(sid)?.parentIds.length > 0
    );
    if (!hasSpouseWithParents) {
      generation.set(id, 0);
      queue.push(id);
    }
  }

  const bfs = () => {
    while (head < queue.length) {
      const cur = queue[head++];
      const gen = generation.get(cur);
      const p = personMap.get(cur);
      if (!p) continue;
      // Children → gen + 1
      for (const cid of p.childIds) {
        if (!generation.has(cid)) { generation.set(cid, gen + 1); queue.push(cid); }
      }
      // Spouse → same gen
      for (const sid of p.spouseIds) {
        if (!generation.has(sid)) { generation.set(sid, gen); queue.push(sid); }
      }
      // Siblings → same gen
      for (const rel of relationships) {
        if (rel.type === 'sibling' || rel.type === 'half_sibling') {
          const other = rel.person1_id === cur ? rel.person2_id : rel.person2_id === cur ? rel.person1_id : null;
          if (other && !generation.has(other)) { generation.set(other, gen); queue.push(other); }
        }
      }
    }
  };

  bfs();

  // Handle married-in persons not yet reached
  for (const id of noParents) {
    if (!generation.has(id)) {
      for (const sid of personMap.get(id).spouseIds) {
        if (generation.has(sid)) { generation.set(id, generation.get(sid)); queue.push(id); break; }
      }
    }
  }
  bfs();

  // Handle disconnected persons
  for (const [id] of personMap) {
    if (!generation.has(id)) { generation.set(id, 0); }
  }

  return { personMap, couples, familyUnits, generation, parentUnitMap };
}

// ─── Recursive Subtree Layout (prevents overlaps) ────────────────
function layoutTree(persons, relationships) {
  if (!persons.length) return { positions: new Map(), personMap: new Map(), couples: [], familyUnits: [], generation: new Map(), totalWidth: 0, totalHeight: 0 };

  const { personMap, couples, familyUnits, generation, parentUnitMap } = buildTree(persons, relationships);
  const positions = new Map();
  const placed = new Set();
  const unitPlaced = new Set();

  // ── Subtree width caches ──
  const unitWCache = new Map();
  const childWCache = new Map();
  const computing = new Set(); // cycle guard

  function childSubtreeW(cid) {
    if (childWCache.has(cid)) return childWCache.get(cid);
    const ui = parentUnitMap.get(cid);
    if (ui !== undefined) {
      const w = unitSubtreeW(ui);
      childWCache.set(cid, w);
      return w;
    }
    // Leaf node – couple or single
    const p = personMap.get(cid);
    const w = (p && p.spouseIds.length > 0) ? CARD_W * 2 + COUPLE_GAP : CARD_W;
    childWCache.set(cid, w);
    return w;
  }

  function unitSubtreeW(ui) {
    if (unitWCache.has(ui)) return unitWCache.get(ui);
    if (computing.has(ui)) return CARD_W; // cycle fallback
    computing.add(ui);

    const unit = familyUnits[ui];
    const ppw = unit.parents.length * CARD_W + Math.max(0, unit.parents.length - 1) * COUPLE_GAP;
    if (unit.children.length === 0) { computing.delete(ui); unitWCache.set(ui, ppw); return ppw; }

    let tcw = 0;
    for (let i = 0; i < unit.children.length; i++) {
      tcw += childSubtreeW(unit.children[i]);
      if (i < unit.children.length - 1) tcw += H_GAP;
    }
    const w = Math.max(ppw, tcw);
    computing.delete(ui);
    unitWCache.set(ui, w);
    return w;
  }

  // ── Position a family unit recursively ──
  function positionUnit(ui, x, y) {
    if (unitPlaced.has(ui)) return;
    unitPlaced.add(ui);

    const unit = familyUnits[ui];
    const stw = unitSubtreeW(ui);
    const ppw = unit.parents.length * CARD_W + Math.max(0, unit.parents.length - 1) * COUPLE_GAP;

    // Center parents within subtree width
    const px = x + (stw - ppw) / 2;
    for (let i = 0; i < unit.parents.length; i++) {
      positions.set(unit.parents[i], { x: px + i * (CARD_W + COUPLE_GAP), y });
      placed.add(unit.parents[i]);
    }

    if (unit.children.length === 0) return;

    const cy = y + CARD_H + V_GAP;
    let tcw = 0;
    for (let i = 0; i < unit.children.length; i++) {
      tcw += childSubtreeW(unit.children[i]);
      if (i < unit.children.length - 1) tcw += H_GAP;
    }

    let cx = x + (stw - tcw) / 2;
    for (const cid of unit.children) {
      const cw = childWCache.get(cid) || CARD_W;
      const cui = parentUnitMap.get(cid);

      if (cui !== undefined && !unitPlaced.has(cui)) {
        positionUnit(cui, cx, cy);
      } else if (!placed.has(cid)) {
        const p = personMap.get(cid);
        const spouseId = p?.spouseIds.find(sid => !placed.has(sid));
        if (spouseId) {
          const sx = cx + (cw - (CARD_W * 2 + COUPLE_GAP)) / 2;
          positions.set(cid, { x: sx, y: cy });
          positions.set(spouseId, { x: sx + CARD_W + COUPLE_GAP, y: cy });
          placed.add(cid);
          placed.add(spouseId);
        } else {
          positions.set(cid, { x: cx + (cw - CARD_W) / 2, y: cy });
          placed.add(cid);
        }
      }
      cx += cw + H_GAP;
    }
  }

  // Find root units (all parents have no parents in the tree)
  const rootUnits = [];
  for (let i = 0; i < familyUnits.length; i++) {
    const isRoot = familyUnits[i].parents.every(pid => {
      const p = personMap.get(pid);
      return !p || p.parentIds.length === 0;
    });
    if (isRoot) rootUnits.push(i);
  }

  // Pre-compute all widths
  for (let i = 0; i < familyUnits.length; i++) unitSubtreeW(i);

  // Position root units side by side
  let sx = 0;
  for (const ri of rootUnits) {
    positionUnit(ri, sx, 0);
    sx += (unitWCache.get(ri) || CARD_W) + H_GAP * 2;
  }
  // Position any remaining units not reached from roots
  for (let i = 0; i < familyUnits.length; i++) {
    if (!unitPlaced.has(i)) {
      positionUnit(i, sx, 0);
      sx += (unitWCache.get(i) || CARD_W) + H_GAP * 2;
    }
  }
  // Position isolated persons
  for (const [id] of personMap) {
    if (!placed.has(id)) {
      positions.set(id, { x: sx, y: 0 });
      placed.add(id);
      sx += CARD_W + H_GAP;
    }
  }

  // Normalize so min x/y = 0
  let minX = Infinity, minY = Infinity;
  for (const pos of positions.values()) { if (pos.x < minX) minX = pos.x; if (pos.y < minY) minY = pos.y; }
  for (const pos of positions.values()) { pos.x -= minX; pos.y -= minY; }

  // Total dimensions
  let maxX = 0, maxY = 0;
  for (const pos of positions.values()) {
    if (pos.x + CARD_W > maxX) maxX = pos.x + CARD_W;
    if (pos.y + CARD_H > maxY) maxY = pos.y + CARD_H;
  }

  return { positions, personMap, couples, familyUnits, generation, totalWidth: maxX, totalHeight: maxY };
}

// ─── Connector Lines (SVG) ───────────────────────────────────────
const LINE_STYLE = { stroke: '#6b7280', strokeWidth: 2.5, fill: 'none' };
const SPOUSE_LINE_STYLE = { stroke: '#6b7280', strokeWidth: 2.5, fill: 'none' };

function ConnectorLines({ familyUnits, couples, positions }) {
  const lines = [];
  const cb = (id) => { const p = positions.get(id); return p ? { x: p.x + CARD_W / 2, y: p.y + CARD_H } : null; };
  const ct = (id) => { const p = positions.get(id); return p ? { x: p.x + CARD_W / 2, y: p.y } : null; };

  // Couple connectors
  for (const [a, b] of couples) {
    const pa = positions.get(a), pb = positions.get(b);
    if (!pa || !pb) continue;
    const y = Math.min(pa.y, pb.y) + CARD_H / 2;
    const x1 = Math.min(pa.x, pb.x) + CARD_W;
    const x2 = Math.max(pa.x, pb.x);
    if (x2 > x1) lines.push(<line key={`c-${a}-${b}`} x1={x1} y1={y} x2={x2} y2={y} style={SPOUSE_LINE_STYLE} />);
  }

  // Parent → children connectors
  for (const unit of familyUnits) {
    if (unit.children.length === 0) continue;
    let jx, jy;
    if (unit.parents.length === 2) {
      const p1 = positions.get(unit.parents[0]), p2 = positions.get(unit.parents[1]);
      if (!p1 || !p2) continue;
      jx = (Math.min(p1.x, p2.x) + Math.max(p1.x, p2.x) + CARD_W + COUPLE_GAP) / 2;
      jy = Math.min(p1.y, p2.y) + CARD_H;
    } else {
      const p = cb(unit.parents[0]);
      if (!p) continue;
      jx = p.x; jy = p.y;
    }

    const firstChild = ct(unit.children[0]);
    if (!firstChild) continue;
    const midY = jy + (firstChild.y - jy) / 2;
    const uk = unit.parents.join('-');

    lines.push(<line key={`vd-${uk}`} x1={jx} y1={jy} x2={jx} y2={midY} style={LINE_STYLE} />);

    const cc = unit.children.map(cid => { const t = ct(cid); return t ? { id: cid, ...t } : null; }).filter(Boolean);
    if (cc.length > 0) {
      const xs = cc.map(c => c.x);
      lines.push(<line key={`hb-${uk}`} x1={Math.min(...xs, jx)} y1={midY} x2={Math.max(...xs, jx)} y2={midY} style={LINE_STYLE} />);
      for (const c of cc) {
        lines.push(<line key={`vc-${uk}-${c.id}`} x1={c.x} y1={midY} x2={c.x} y2={c.y} style={LINE_STYLE} />);
      }
    }
  }
  return <>{lines}</>;
}

// ─── Person Card ─────────────────────────────────────────────────
function PersonCard({ person, position, treeSlug, onClickCheck }) {
  const [hovered, setHovered] = useState(false);
  const hoverTimer = useRef(null);

  const isMale = person.gender === 'male';
  const isFemale = person.gender === 'female';
  const borderColor = isMale ? '#3b7dd8' : isFemale ? '#d4577a' : '#6b7280';
  const bgColor = isMale ? '#dbeafe' : isFemale ? '#fce7f3' : '#f3f4f6';
  const headerBg = isMale ? '#3b82f6' : isFemale ? '#ec4899' : '#9ca3af';
  const avatarBg = isMale ? '#93c5fd' : isFemale ? '#f9a8d4' : '#d1d5db';

  const birthYear = person.date_of_birth ? new Date(person.date_of_birth).getFullYear() : null;
  const deathYear = person.date_of_death ? new Date(person.date_of_death).getFullYear() : null;
  const yearRange = birthYear
    ? `${birthYear}${deathYear ? ` - ${deathYear}` : person.is_living ? ' -' : ''}`
    : '';

  const birthDate = person.date_of_birth ? new Date(person.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : null;
  const deathDate = person.date_of_death ? new Date(person.date_of_death).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : null;

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => setHovered(true), 400);
  };
  const handleMouseLeave = () => {
    clearTimeout(hoverTimer.current);
    setHovered(false);
  };

  return (
    <div
      style={{ position: 'absolute', left: position.x, top: position.y, width: CARD_W, height: CARD_H }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={`/trees/${treeSlug}/persons/${person.id}`}
        className="family-card-link"
        onClick={onClickCheck}
        style={{ display: 'block', width: CARD_W, height: CARD_H }}
      >
        <div className="family-card" style={{ borderColor, backgroundColor: bgColor, width: CARD_W, height: CARD_H }}>
          <div className="family-card-header" style={{ backgroundColor: headerBg }} />
          <div className="family-card-body">
            <div className="family-card-photo" style={{ backgroundColor: avatarBg, width: PHOTO_SIZE, height: PHOTO_SIZE }}>
              {person.profile_photo ? (
                <img src={`/storage/${person.profile_photo}`} alt={person.first_name} className="family-card-photo-img" />
              ) : (
                <UserIcon style={{ width: 26, height: 26, color: borderColor, opacity: 0.85 }} />
              )}
            </div>
            <div className="family-card-info">
              <div className="family-card-name">{person.first_name} {person.last_name}</div>
              {yearRange && <div className="family-card-years">{yearRange}</div>}
            </div>
          </div>
        </div>
      </Link>

      {/* ─── Hover Tooltip ─── */}
      {hovered && (
        <div className="family-card-tooltip" style={{ borderColor }}>
          {/* Tooltip header */}
          <div className="fct-header" style={{ background: `linear-gradient(135deg, ${headerBg}, ${borderColor})` }}>
            <div className="fct-avatar" style={{ backgroundColor: avatarBg, borderColor: headerBg }}>
              {person.profile_photo ? (
                <img src={`/storage/${person.profile_photo}`} alt="" className="fct-avatar-img" />
              ) : (
                <UserIcon style={{ width: 22, height: 22, color: '#fff' }} />
              )}
            </div>
            <div className="fct-header-info">
              <div className="fct-name">{person.first_name} {person.last_name}</div>
              {person.nickname && <div className="fct-nickname">"{person.nickname}"</div>}
              {person.maiden_name && <div className="fct-maiden">née {person.maiden_name}</div>}
            </div>
            <span className={`fct-status ${person.is_living ? 'fct-living' : 'fct-deceased'}`}>
              {person.is_living ? 'Living' : 'Deceased'}
            </span>
          </div>
          {/* Tooltip body */}
          <div className="fct-body">
            {person.gender && person.gender !== 'unknown' && (
              <div className="fct-row">
                <HeartIcon className="fct-icon" style={{ color: isMale ? '#3b82f6' : '#ec4899' }} />
                <span className="fct-label">Gender</span>
                <span className="fct-value">{person.gender.charAt(0).toUpperCase() + person.gender.slice(1)}</span>
              </div>
            )}
            {birthDate && (
              <div className="fct-row">
                <CalendarIcon className="fct-icon" style={{ color: '#10b981' }} />
                <span className="fct-label">Born</span>
                <span className="fct-value">{birthDate}</span>
              </div>
            )}
            {deathDate && (
              <div className="fct-row">
                <CalendarIcon className="fct-icon" style={{ color: '#6b7280' }} />
                <span className="fct-label">Died</span>
                <span className="fct-value">{deathDate}</span>
              </div>
            )}
            {person.birth_place && (
              <div className="fct-row">
                <MapPinIcon className="fct-icon" style={{ color: '#f59e0b' }} />
                <span className="fct-label">Place</span>
                <span className="fct-value">{person.birth_place}</span>
              </div>
            )}
            {person.occupation && (
              <div className="fct-row">
                <BriefcaseIcon className="fct-icon" style={{ color: '#8b5cf6' }} />
                <span className="fct-label">Occupation</span>
                <span className="fct-value">{person.occupation}</span>
              </div>
            )}
            {person.notes && (
              <div className="fct-notes">{person.notes}</div>
            )}
            {!birthDate && !person.birth_place && !person.occupation && !person.notes && (
              <div className="fct-empty">No additional details</div>
            )}
          </div>
          {/* Click hint */}
          <div className="fct-footer">Click to view full profile →</div>
        </div>
      )}
    </div>
  );
}

// ─── Main Chart Component (with Pan & Zoom) ─────────────────────
const FamilyTreeChart = forwardRef(function FamilyTreeChart({ persons, relationships, treeSlug }, ref) {
  const layout = useMemo(() => layoutTree(persons, relationships), [persons, relationships]);
  const { positions, personMap, couples, familyUnits, generation, totalWidth, totalHeight } = layout;

  // Pan & Zoom state
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });

  // Expose captureImage to parent via ref
  useImperativeHandle(ref, () => ({
    captureImage: async (treeName = 'family-tree') => {
      const el = contentRef.current;
      if (!el) throw new Error('Tree content not available');
      const dataUrl = await toPng(el, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        style: {
          transform: 'none',
          transformOrigin: '0 0',
        },
      });
      const link = document.createElement('a');
      link.download = `${treeName}.png`;
      link.href = dataUrl;
      link.click();
    },
  }), []);

  // Fit tree to viewport on load / data change
  const fitToView = useCallback(() => {
    const el = containerRef.current;
    if (!el || totalWidth === 0) return;
    const cw = el.clientWidth;
    const ch = el.clientHeight;
    const contentW = totalWidth + PADDING * 2;
    const contentH = totalHeight + PADDING * 2;
    const scale = Math.min(cw / contentW, ch / contentH, 1.2) * 0.92;
    const s = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
    const x = (cw - contentW * s) / 2;
    const y = Math.max(10, (ch - contentH * s) / 2);
    setTransform({ x, y, scale: s });
  }, [totalWidth, totalHeight]);

  useEffect(() => { fitToView(); }, [fitToView]);

  // ── Mouse handlers for panning ──
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    hasDragged.current = false;
    lastPos.current = { x: e.clientX, y: e.clientY };
    dragStart.current = { x: e.clientX, y: e.clientY };
    setIsPanning(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    if (Math.abs(e.clientX - dragStart.current.x) > 4 || Math.abs(e.clientY - dragStart.current.y) > 4) {
      hasDragged.current = true;
    }
    lastPos.current = { x: e.clientX, y: e.clientY };
    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    setIsPanning(false);
  }, []);

  // Global mouseup listener — ensures panning stops even if mouse is released outside canvas/window
  useEffect(() => {
    const onGlobalMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        setIsPanning(false);
      }
    };
    window.addEventListener('mouseup', onGlobalMouseUp);
    // Also handle when the window loses focus (e.g. alt-tab while panning)
    window.addEventListener('blur', onGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', onGlobalMouseUp);
      window.removeEventListener('blur', onGlobalMouseUp);
    };
  }, []);

  // ── Wheel zoom ──
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => {
      const ns = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev.scale * factor));
      const r = ns / prev.scale;
      return { scale: ns, x: mx - (mx - prev.x) * r, y: my - (my - prev.y) * r };
    });
  }, []);

  // Attach non-passive wheel listener
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // ── Zoom buttons ──
  const zoomBy = useCallback((factor) => {
    const el = containerRef.current;
    if (!el) return;
    const cx = el.clientWidth / 2, cy = el.clientHeight / 2;
    setTransform(prev => {
      const ns = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev.scale * factor));
      const r = ns / prev.scale;
      return { scale: ns, x: cx - (cx - prev.x) * r, y: cy - (cy - prev.y) * r };
    });
  }, []);

  // ── Full-page mode (hides sidebar/header) ──
  const [isFullPage, setIsFullPage] = useState(false);

  const toggleFullPage = useCallback(() => {
    setIsFullPage(prev => !prev);
    // Re-fit after the DOM updates with new dimensions
    setTimeout(() => fitToView(), 50);
  }, [fitToView]);

  // Escape key to exit full-page mode
  useEffect(() => {
    if (!isFullPage) return;
    const handler = (e) => { if (e.key === 'Escape') { setIsFullPage(false); setTimeout(() => fitToView(), 50); } };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isFullPage, fitToView]);

  // ── Prevent link navigation after drag ──
  const onCardClick = useCallback((e) => {
    if (hasDragged.current) { e.preventDefault(); hasDragged.current = false; }
  }, []);

  if (persons.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-400">
        No family members yet. Add your first member to see the tree.
      </div>
    );
  }

  const contentW = totalWidth + PADDING * 2;
  const contentH = totalHeight + PADDING * 2;

  return (
    <div
      ref={containerRef}
      className={`family-tree-canvas ${isPanning ? 'panning' : ''} ${isFullPage ? 'fullpage' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Close full-page button */}
      {isFullPage && (
        <button
          className="family-tree-close-fullpage"
          onClick={toggleFullPage}
          onMouseDown={e => e.stopPropagation()}
          title="Exit Full Screen (Esc)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      )}

      {/* Zoom Controls */}
      <div className="family-tree-controls" onMouseDown={e => e.stopPropagation()}>
        <button onClick={() => zoomBy(1.25)} title="Zoom In">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <button onClick={() => zoomBy(0.8)} title="Zoom Out">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <div className="family-tree-zoom-level">{Math.round(transform.scale * 100)}%</div>
        <button onClick={fitToView} title="Fit to View">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M3 9h18"/></svg>
        </button>
        <button onClick={toggleFullPage} title={isFullPage ? 'Exit Full Screen' : 'Full Screen'}>
          {isFullPage ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 01-2 2H3M21 8h-3a2 2 0 01-2-2V3M3 16h3a2 2 0 012 2v3M16 21v-3a2 2 0 012-2h3"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8V5a2 2 0 012-2h3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M21 16v3a2 2 0 01-2 2h-3"/></svg>
          )}
        </button>
      </div>

      {/* Transformable content */}
      <div
        ref={contentRef}
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
          position: 'absolute',
          width: contentW,
          height: contentH,
          willChange: 'transform',
        }}
      >
        {/* SVG layer for connectors */}
        <svg
          width={contentW}
          height={contentH}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          <g transform={`translate(${PADDING}, ${PADDING})`}>
            <ConnectorLines familyUnits={familyUnits} couples={couples} positions={positions} />
          </g>
        </svg>

        {/* Cards layer */}
        <div style={{ position: 'absolute', top: PADDING, left: PADDING }}>
          {persons.map((person) => {
            const pos = positions.get(person.id);
            if (!pos) return null;
            return (
              <PersonCard
                key={person.id}
                person={person}
                position={pos}
                treeSlug={treeSlug}
                onClickCheck={onCardClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default FamilyTreeChart;
