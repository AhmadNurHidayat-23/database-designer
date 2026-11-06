import { describe, it, expect } from 'vitest';
import { sql, parse, type Design } from './schema';
const design = (): Design => ({ version: 1, name: 'Uji', tables: [{ id: 't', name: 'users', x: 0, y: 0, columns: [{ id: 'c', name: 'id', type: 'BIGINT', primary: true, nullable: false, reference: '' }] }, { id: 'p', name: 'posts', x: 300, y: 0, columns: [{ id: 'f', name: 'user_id', type: 'BIGINT', primary: false, nullable: true, reference: 'c' }] }] });
describe('SQL sesuai desain', () => {
  it('menolak primary key TEXT yang tidak valid di MySQL', () => { const d = design(); d.tables[0].columns[0].type = 'TEXT'; expect(() => sql(d)).toThrow(); });
  it('membuat tabel dahulu, lalu foreign key', () => { const out = sql(design()); expect(out).toContain('REFERENCES \u0060users\u0060 (\u0060id\u0060)'); expect(out.indexOf('ALTER TABLE')).toBeGreaterThan(out.lastIndexOf('CREATE TABLE')); });
  it('menolak nama berbahaya', () => { const d = design(); d.tables[0].name = 'users; DROP'; expect(() => sql(d)).toThrow(); });
  it('menolak tipe foreign key berbeda', () => { const d = design(); d.tables[1].columns[0].type = 'TEXT'; expect(() => sql(d)).toThrow(); });
  it('roundtrip JSON mempertahankan posisi', () => { expect(parse(JSON.stringify(design()))).toEqual(design()); });
  it('menolak duplikat dan relasi yatim', () => { const d = design(); d.tables[1].name = 'users'; expect(() => sql(d)).toThrow(); d.tables[1].name = 'posts'; d.tables[1].columns[0].reference = 'missing'; expect(() => sql(d)).toThrow(); });
});
