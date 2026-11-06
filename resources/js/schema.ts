export const types = ['BIGINT', 'INT', 'VARCHAR(255)', 'TEXT', 'BOOLEAN', 'DATE', 'DATETIME', 'DECIMAL(10,2)'] as const;
export interface Column { id: string; name: string; type: string; primary: boolean; nullable: boolean; reference: string }
export interface Table { id: string; name: string; x: number; y: number; columns: Column[] }
export interface Design { version: 1; name: string; tables: Table[] }
export const empty = (): Design => ({ version: 1, name: 'Desain baru', tables: [] });
export const column = (): Column => ({ id: crypto.randomUUID(), name: 'kolom_baru', type: 'BIGINT', primary: false, nullable: true, reference: '' });
const identifier = /^[A-Za-z_][A-Za-z0-9_]{0,63}$/;
export function validate(d: Design) {
  if (!d || d.version !== 1 || typeof d.name !== 'string' || !Array.isArray(d.tables) || d.tables.length > 100) throw new Error('Format desain tidak valid (maksimal 100 tabel).');
  const names = new Set<string>(); const ids = new Set<string>();
  for (const t of d.tables) {
    if (!identifier.test(t.name) || names.has(t.name.toLowerCase())) throw new Error('Nama tabel harus unik dan berupa identifier SQL: ' + t.name);
    if (typeof t.id !== 'string' || ids.has(t.id) || !Number.isFinite(t.x) || !Number.isFinite(t.y) || t.x < 0 || t.y < 0 || t.x > 10000 || t.y > 10000) throw new Error('ID atau posisi tabel tidak valid.');
    ids.add(t.id); names.add(t.name.toLowerCase());
    if (!Array.isArray(t.columns) || !t.columns.length || t.columns.length > 100 || t.columns.filter(c => c.primary).length > 1) throw new Error('Tabel memerlukan 1–100 kolom dan maksimal satu primary key.');
    const cols = new Set<string>();
    for (const c of t.columns) {
      if (!identifier.test(c.name) || cols.has(c.name.toLowerCase()) || !types.includes(c.type as typeof types[number]) || typeof c.primary !== 'boolean' || typeof c.nullable !== 'boolean' || typeof c.reference !== 'string' || typeof c.id !== 'string' || ids.has(c.id)) throw new Error('Kolom tidak valid atau duplikat di ' + t.name);
      cols.add(c.name.toLowerCase()); ids.add(c.id);
      if (c.primary && c.type === 'TEXT') throw new Error('Primary key MySQL tidak dapat memakai tipe TEXT tanpa panjang indeks. Pilih VARCHAR atau tipe lain.');
    }
  }
  for (const t of d.tables) for (const c of t.columns) if (c.reference) {
    const target = d.tables.flatMap(t => t.columns).find(x => x.id === c.reference);
    if (!target?.primary || target.type !== c.type || c.id === c.reference || ['TEXT'].includes(c.type)) throw new Error('Foreign key harus merujuk primary key lain dengan tipe yang sama.');
  }
  return d;
}
const q = (s: string) => '`' + s + '`';
export function sql(d: Design) {
  validate(d);
  const statements = d.tables.map(t => 'CREATE TABLE ' + q(t.name) + ' (\n' + t.columns.map(c => '  ' + q(c.name) + ' ' + c.type + (c.nullable && !c.primary ? ' NULL' : ' NOT NULL') + (c.primary ? ' PRIMARY KEY' : '')).join(',\n') + '\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;');
  for (const t of d.tables) for (const c of t.columns) if (c.reference) {
    const target = d.tables.find(x => x.columns.some(y => y.id === c.reference))!;
    const col = target.columns.find(x => x.id === c.reference)!;
    statements.push('ALTER TABLE ' + q(t.name) + ' ADD FOREIGN KEY (' + q(c.name) + ') REFERENCES ' + q(target.name) + ' (' + q(col.name) + ');');
  }
  return statements.join('\n\n');
}
export function parse(text: string) { return validate(JSON.parse(text)); }
