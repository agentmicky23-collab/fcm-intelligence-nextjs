// A small reader for old-style Excel files (.xls, BIFF8), enough for the plain tables Branch Hub exports:
// shared strings, numbers, RK numbers, labels and cached formula results from the first worksheet.
// Written in-house so we don't ship a large, vulnerable spreadsheet library to read people's financial files.
// Runs in the browser; nothing leaves the device.

import CFB from "cfb";

export type Cell = string | number | null;

class Segments {
  private i = 0;
  private p = 0;
  constructor(private segs: Uint8Array[]) {}
  /** True when the current segment is used up (without moving on to the next). */
  exhausted() {
    return this.i < this.segs.length && this.p >= this.segs[this.i].length;
  }
  next() {
    this.i++;
    this.p = 0;
  }
  private seg() {
    while (this.i < this.segs.length && this.p >= this.segs[this.i].length) {
      this.i++;
      this.p = 0;
    }
    return this.segs[this.i];
  }
  done() {
    return !this.seg();
  }
  remainingInSegment() {
    const s = this.seg();
    return s ? s.length - this.p : 0;
  }
  u8() {
    const s = this.seg();
    if (!s) throw new Error("xls: unexpected end");
    return s[this.p++];
  }
  u16() {
    return this.u8() | (this.u8() << 8);
  }
  u32() {
    return (this.u16() | (this.u16() << 16)) >>> 0;
  }
  skip(n: number) {
    while (n > 0) {
      const s = this.seg();
      if (!s) return;
      const k = Math.min(n, s.length - this.p);
      this.p += k;
      n -= k;
    }
  }
  /** Characters of a string that may continue into the next CONTINUE record (which restarts with a flags byte). */
  chars(count: number, high: boolean) {
    let out = "";
    while (count > 0) {
      if (this.exhausted()) {
        this.next();
        if (this.done()) throw new Error("xls: string runs past the end");
        high = (this.u8() & 1) === 1;
      }
      const avail = Math.floor(this.remainingInSegment() / (high ? 2 : 1));
      const k = Math.max(1, Math.min(count, avail));
      for (let j = 0; j < k; j++) out += String.fromCharCode(high ? this.u16() : this.u8());
      count -= k;
    }
    return out;
  }
}

function sst(segs: Uint8Array[]) {
  const r = new Segments(segs);
  r.u32();
  const unique = r.u32();
  const out: string[] = [];
  for (let n = 0; n < unique && !r.done(); n++) {
    const cch = r.u16();
    const flags = r.u8();
    const runs = flags & 0x08 ? r.u16() : 0;
    const ext = flags & 0x04 ? r.u32() : 0;
    out.push(r.chars(cch, (flags & 1) === 1));
    r.skip(runs * 4 + ext);
  }
  return out;
}

function shortString(d: Uint8Array, at: number) {
  const cch = d[at] | (d[at + 1] << 8);
  const high = (d[at + 2] & 1) === 1;
  let s = "";
  for (let j = 0; j < cch; j++) s += String.fromCharCode(high ? d[at + 3 + j * 2] | (d[at + 4 + j * 2] << 8) : d[at + 3 + j]);
  return s;
}

function rk(v: number) {
  const div = v & 1;
  let n: number;
  if (v & 2) n = v >> 2;
  else {
    const b = new DataView(new ArrayBuffer(8));
    b.setUint32(4, v & 0xfffffffc, true);
    n = b.getFloat64(0, true);
  }
  return div ? n / 100 : n;
}

/** The first worksheet as rows of cells. Throws if the file isn't an .xls workbook. */
export function readXls(bytes: Uint8Array): Cell[][] {
  const cfb = CFB.read(bytes, { type: "array" });
  const entry = CFB.find(cfb, "Workbook") ?? CFB.find(cfb, "Book");
  if (!entry?.content) throw new Error("xls: no workbook stream");
  const buf = entry.content instanceof Uint8Array ? entry.content : Uint8Array.from(entry.content as ArrayLike<number>);
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);

  const rows: Cell[][] = [];
  const put = (r: number, c: number, v: Cell) => {
    (rows[r] ??= [])[c] = v;
  };
  let strings: string[] = [];
  let sstSegs: Uint8Array[] | null = null;
  let inSheet = false;
  let sheetsSeen = 0;
  let pendingFormula: [number, number] | null = null;

  for (let p = 0; p + 4 <= buf.length; ) {
    const type = view.getUint16(p, true);
    const len = view.getUint16(p + 2, true);
    const d = buf.subarray(p + 4, p + 4 + len);
    const dv = new DataView(d.buffer, d.byteOffset, d.byteLength);
    p += 4 + len;

    if (sstSegs && type !== 0x003c) {
      strings = sst(sstSegs);
      sstSegs = null;
    }
    switch (type) {
      case 0x0809: // BOF
        inSheet = dv.getUint16(2, true) === 0x0010 && sheetsSeen === 0;
        if (dv.getUint16(2, true) === 0x0010) sheetsSeen++;
        break;
      case 0x000a: // EOF
        if (inSheet) return rows.map((r) => Array.from(r ?? [], (c) => c ?? null));
        break;
      case 0x00fc: // SST
        sstSegs = [d];
        break;
      case 0x003c: // CONTINUE
        if (sstSegs) sstSegs.push(d);
        break;
      default:
        if (!inSheet) break;
        if (type === 0x00fd) put(dv.getUint16(0, true), dv.getUint16(2, true), strings[dv.getUint32(6, true)] ?? "");
        else if (type === 0x0203) put(dv.getUint16(0, true), dv.getUint16(2, true), dv.getFloat64(6, true));
        else if (type === 0x027e) put(dv.getUint16(0, true), dv.getUint16(2, true), rk(dv.getUint32(6, true)));
        else if (type === 0x00bd) {
          const row = dv.getUint16(0, true);
          const first = dv.getUint16(2, true);
          const count = (len - 6) / 6;
          for (let k = 0; k < count; k++) put(row, first + k, rk(dv.getUint32(4 + k * 6 + 2, true)));
        } else if (type === 0x0204) put(dv.getUint16(0, true), dv.getUint16(2, true), shortString(d, 6));
        else if (type === 0x0006) {
          const row = dv.getUint16(0, true);
          const col = dv.getUint16(2, true);
          if (dv.getUint16(12, true) === 0xffff) {
            const kind = d[6];
            if (kind === 0) pendingFormula = [row, col];
            else if (kind === 1) put(row, col, d[8] ? "TRUE" : "FALSE");
          } else put(row, col, dv.getFloat64(6, true));
        } else if (type === 0x0207 && pendingFormula) {
          put(pendingFormula[0], pendingFormula[1], shortString(d, 0));
          pendingFormula = null;
        }
    }
  }
  return rows.map((r) => Array.from(r ?? [], (c) => c ?? null));
}

/** A CSV file as rows of strings (quotes, commas and newlines inside quotes handled). */
export function readCsv(text: string): Cell[][] {
  const rows: Cell[][] = [];
  let row: Cell[] = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c !== ""));
}

// ── .xlsx (a zip of XML files) ──────────────────────────────────────────────────────────────────

async function inflate(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([data as BlobPart]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** The files inside a zip, by name (only the ones we ask for are decompressed). */
async function unzip(bytes: Uint8Array, want: (name: string) => boolean): Promise<Map<string, string>> {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let end = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) if (dv.getUint32(i, true) === 0x06054b50) { end = i; break; }
  if (end < 0) throw new Error("xlsx: not a zip");
  const count = dv.getUint16(end + 10, true);
  let p = dv.getUint32(end + 16, true);
  const out = new Map<string, string>();
  const dec = new TextDecoder("utf-8");
  for (let n = 0; n < count; n++) {
    if (dv.getUint32(p, true) !== 0x02014b50) break;
    const method = dv.getUint16(p + 10, true);
    const size = dv.getUint32(p + 20, true);
    const nameLen = dv.getUint16(p + 28, true);
    const extraLen = dv.getUint16(p + 30, true);
    const commentLen = dv.getUint16(p + 32, true);
    const local = dv.getUint32(p + 42, true);
    const name = dec.decode(bytes.subarray(p + 46, p + 46 + nameLen));
    p += 46 + nameLen + extraLen + commentLen;
    if (!want(name)) continue;
    const start = local + 30 + dv.getUint16(local + 26, true) + dv.getUint16(local + 28, true);
    const raw = bytes.subarray(start, start + size);
    out.set(name, dec.decode(method === 0 ? raw : await inflate(raw)));
  }
  return out;
}

const xmlText = (s: string) => s.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");

/** The first worksheet of an .xlsx as rows of cells. Runs in the browser; nothing leaves the device. */
export async function readXlsx(bytes: Uint8Array): Promise<Cell[][]> {
  const files = await unzip(bytes, (n) => n === "xl/sharedStrings.xml" || /^xl\/worksheets\/sheet1\.xml$/.test(n));
  const sheet = files.get("xl/worksheets/sheet1.xml");
  if (!sheet) throw new Error("xlsx: no worksheet");
  const shared = [...(files.get("xl/sharedStrings.xml") ?? "").matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => xmlText(m[1]));
  const rows: Cell[][] = [];
  for (const rm of sheet.matchAll(/<row[^>]*?(?:\/>|>([\s\S]*?)<\/row>)/g)) {
    const row: Cell[] = [];
    for (const cm of (rm[1] ?? "").matchAll(/<c ([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const ref = cm[1].match(/r="([A-Z]+)\d+"/)?.[1] ?? "";
      const col = [...ref].reduce((a, ch) => a * 26 + ch.charCodeAt(0) - 64, 0) - 1;
      const type = cm[1].match(/t="([^"]+)"/)?.[1];
      const body = cm[2] ?? "";
      const v = body.match(/<v>([\s\S]*?)<\/v>/)?.[1];
      let val: Cell = null;
      if (type === "inlineStr") val = xmlText(body.match(/<is>([\s\S]*?)<\/is>/)?.[1] ?? "");
      else if (type === "s" && v !== undefined) val = shared[Number(v)] ?? "";
      else if (type === "str" && v !== undefined) val = xmlText(v);
      else if (v !== undefined) val = Number.isFinite(Number(v)) ? Number(v) : xmlText(v);
      if (col >= 0) row[col] = val;
    }
    rows.push(Array.from(row, (c) => c ?? null));
  }
  return rows;
}
