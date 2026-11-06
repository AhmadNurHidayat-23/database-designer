import { useRef } from 'react';
import type { Table } from './schema';
export default function Diagram({ tables, selected, select, move }: { tables: Table[]; selected: string; select: (id: string) => void; move: (id: string, x: number, y: number) => void }) {
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const width = Math.max(1000, ...tables.map(t => t.x + 300));
  const height = Math.max(530, ...tables.map(t => t.y + 70 + t.columns.length * 28));
  return <div className="diagram-scroll"><svg id="erd" xmlns="http://www.w3.org/2000/svg" width={width} height={height} role="img" aria-label="Diagram relasi tabel" onPointerMove={e => {
    if (drag.current) { const box = e.currentTarget.getBoundingClientRect(); move(drag.current.id, Math.max(0, Math.min(10000, e.clientX - box.left - drag.current.dx)), Math.max(0, Math.min(10000, e.clientY - box.top - drag.current.dy))); }
  }} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
    <rect width="100%" height="100%" fill="#f1f3ed" />
    {tables.flatMap(t => t.columns.map((c, i) => { const other = tables.find(o => o.columns.some(x => x.id === c.reference)); if (!other) return null; const j = other.columns.findIndex(x => x.id === c.reference); return <path key={c.id} d={'M' + (t.x + 260) + ' ' + (t.y + 56 + i * 28) + ' C' + (t.x + 320) + ' ' + (t.y + 56 + i * 28) + ',' + (other.x - 60) + ' ' + (other.y + 56 + j * 28) + ',' + other.x + ' ' + (other.y + 56 + j * 28)} stroke="#c5482a" fill="none" strokeWidth="2" />; }))}
    {tables.map(t => <g key={t.id} transform={'translate(' + t.x + ',' + t.y + ')'} onPointerDown={e => { select(t.id); const box = e.currentTarget.ownerSVGElement!.getBoundingClientRect(); drag.current = { id: t.id, dx: e.clientX - box.left - t.x, dy: e.clientY - box.top - t.y }; e.currentTarget.ownerSVGElement!.setPointerCapture(e.pointerId); }}>
      <rect width="260" height={48 + t.columns.length * 28} rx="4" fill="white" stroke={selected === t.id ? '#c5482a' : '#b6bfb2'} strokeWidth="2" />
      <rect width="260" height="38" fill="#202a22" rx="3" /><text x="14" y="25" fill="white" fontSize="14" fontFamily="monospace">{t.name}</text>
      {t.columns.map((c, i) => <g key={c.id}><text x="12" y={61 + i * 28} fontSize="12" fill="#1e211f" fontFamily="monospace">{c.primary ? '◆ ' : c.reference ? '↗ ' : '  '}{c.name.slice(0, 19)}</text><text x="248" y={61 + i * 28} textAnchor="end" fontSize="10" fill="#647060" fontFamily="monospace">{c.type}</text></g>)}
    </g>)}
  </svg></div>;
}
