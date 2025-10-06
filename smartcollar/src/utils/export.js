// Simple CSV export and Print-to-PDF helpers (frontend-only)

export function exportToCSV(filename, rows) {
  if (!rows || !rows.length) return;
  const keys = Object.keys(rows[0]);
  const escape = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    if (s.includes(',') || s.includes('\n') || s.includes('"')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  const csv = [keys.join(','), ...rows.map((r) => keys.map((k) => escape(r[k])).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printSectionAsPDF(sectionId) {
  // Opens browser print dialog; user can choose Save as PDF
  const el = document.getElementById(sectionId);
  if (!el) {
    window.print();
    return;
  }
  const w = window.open('', 'PRINT', 'height=800,width=1000');
  if (!w) return;
  w.document.write(`<!doctype html><html><head><title>${document.title}</title>`);
  // Basic print styles
  w.document.write('<style>body{font-family:system-ui,Arial,sans-serif;padding:24px;background:#fff;color:#111} table{width:100%;border-collapse:collapse} th,td{border:1px solid #ddd;padding:8px} th{background:#f5f5f5;text-align:left}</style>');
  w.document.write('</head><body>');
  w.document.write(el.outerHTML);
  w.document.write('</body></html>');
  w.document.close();
  w.focus();
  w.print();
  w.close();
}
