import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'node:fs';

const W = 595.28, H = 841.89; // A4
const M = 50;                 // margin

const INK = rgb(0.1, 0.12, 0.15);
const MUTED = rgb(0.42, 0.45, 0.5);
const BLUE = rgb(0.15, 0.35, 0.75);
const LINE = rgb(0.75, 0.78, 0.82);
const LIGHT = rgb(0.94, 0.95, 0.97);

function hex(c) { return c; }

async function main() {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const page = pdf.addPage([W, H]);
  let y = H - M;

  const text = (s, { x = M, size = 10, f = font, color = INK, moveY = true, gap = 6 }) => {
    page.drawText(s, { x, y, size, font: f, color });
    if (moveY) y -= (size + gap);
  };
  const hline = (gap = 10) => {
    page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.7, color: LINE });
    y -= gap;
  };
  const sectionTitle = (s) => {
    y -= 6;
    text(s, { f: bold, size: 13, color: BLUE, moveY: false });
    y -= 18;
    hline(8);
  };
  const wrap = (s, size, maxW) => {
    const words = s.split(' ');
    const lines = [];
    let cur = '';
    for (const w of words) {
      const test = cur ? cur + ' ' + w : w;
      if (font.widthOfTextAtSize(test, size) <= maxW) cur = test;
      else { if (cur) lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);
    return lines;
  };
  const para = (s, size = 10) => {
    for (const l of wrap(s, size, W - 2 * M)) {
      text(l, { size });
    }
    y -= 4;
  };
  const bullets = (items, indent = 14, size = 10) => {
    for (const it of items) {
      page.drawText('•', { x: M + 2, y, size, font, color: INK });
      const lines = wrap(it, size, W - 2 * M - indent - 2);
      lines.forEach((l, i) => {
        text(l, { x: M + indent, size, moveY: false });
        y -= size + 3;
      });
    }
    y -= 4;
  };

  // ---------- Cover / Title ----------
  page.drawRectangle({ x: 0, y: H - 110, width: W, height: 110, color: BLUE });
  page.drawText('PDF Customizer — Project Report', { x: M, y: H - 60, size: 22, font: bold, color: rgb(1, 1, 1) });
  page.drawText('Structure, Flow, Database, and Use Case Diagram', { x: M, y: H - 82, size: 11, font, color: rgb(0.85, 0.9, 1) });
  page.drawText('Generated: 2026-11-15', { x: M, y: H - 100, size: 9, font, color: rgb(0.75, 0.85, 1) });
  y = H - 135;

  // ---------- 1. Overview ----------
  sectionTitle('1. Project Overview');
  para('PDF Customizer is a web application that lets users upload a PDF and decorate its pages before downloading the result. For each page (or a selected batch of pages) the user can add a thin border, sequential page numbers, and a custom footer text. The styling is applied entirely in the browser, so no PDF content is ever uploaded to a server.');
  para('Built with React + TypeScript + Vite, Tailwind CSS for styling, pdf-lib + pdf.js for PDF manipulation and rendering, and Supabase for accounts and user profiles.');

  // ---------- 2. Tech Stack ----------
  sectionTitle('2. Technology Stack');
  bullets([
    'Frontend: React 18 + TypeScript, built with Vite; styled with Tailwind CSS; icons via lucide-react.',
    'PDF engine: pdf-lib (writes borders, page numbers, footers into the PDF), pdfjs-dist / react-pdf (renders page previews on screen), react-dropzone (drag-and-drop upload).',
    'Backend: Supabase — email/password authentication and a "profiles" table for user details.',
    'No server-side PDF processing: all PDF work happens in the browser.',
  ]);

  // ---------- 3. Project Structure ----------
  sectionTitle('3. Project Structure (src/)');
  bullets([
    'App.tsx — main screen: upload area, page viewer, settings panel, and processing.',
    'pages/LoginPage.tsx, pages/SignupPage.tsx — sign-in and account creation screens.',
    'components/AuthGate.tsx — blocks the app until the user is signed in.',
    'components/PDFDropzone.tsx — drag-and-drop upload area for the PDF file.',
    'components/PDFViewer.tsx / PDFPreview.tsx — renders each PDF page with selection overlay.',
    'components/BatchConfigForm.tsx, PageConfigForm.tsx, PageSettings.tsx, MarginControls.tsx, PositionSelector.tsx — styling controls (border, numbers, footer, margins, position).',
    'components/ErrorMessage.tsx — shows errors to the user.',
    'utils/pdfProcessor.ts — the PDF engine: draws borders, page numbers, footers; produces the download file.',
    'services/pdfService.ts — an alternate/older PDF helper module.',
    'context/AuthContext.tsx — sign in/up/out state shared across the app.',
    'lib/supabaseClient.ts — connection to the Supabase backend.',
    'types/index.ts — shared data types (PageConfig, ProcessingError).',
  ]);

  // ---------- 4. Application Flow ----------
  sectionTitle('4. Application Flow');
  const steps = [
    ['1. Sign in / Sign up', 'User signs in with email & password. New users create an account; a profile record is stored in the database. AuthGate blocks the app until signed in.'],
    ['2. Upload PDF', 'User drags or picks a PDF. The app reads the page count and creates one configuration entry per page.'],
    ['3. Preview & select pages', 'Pages render as thumbnails. The user clicks pages to select them; selected pages get the applied style.'],
    ['4. Configure styling', 'The settings panel lets the user toggle a border (with margin), page numbers (position, size, bold, sequential numbering), and footer text (position, size, bold). Changes apply to all selected pages at once.'],
    ['5. Process & download', 'On "Process PDF", the app rewrites the PDF with the chosen styling and triggers a browser download of the modified file.'],
    ['6. Error handling', 'Invalid files, empty PDFs, or processing failures show a dismissible error message; the original file is untouched.'],
  ];
  for (const [t, d] of steps) {
    text(t, { f: bold, size: 10.5, moveY: false });
    y -= 14;
    para(d, 9.5);
  }

  // ---------- 5. Database ----------
  sectionTitle('5. Database Structure (Supabase)');
  para('Authentication is handled by Supabase\'s built-in auth system (auth.users, managed automatically). One custom table exists:');
  bullets([
    'profiles',
    '   id (uuid, primary key) — same ID as the auth user; linked to auth.users with cascade delete',
    '   email (text, required)',
    '   full_name (text, optional)',
    '   created_at / updated_at (timestamps)',
    '',
    'Security: Row Level Security is enabled. Each signed-in user can only read and modify their own profile row. No PDF files or styling settings are stored in the database — documents stay on the user\'s device.',
  ]);

  // ---------- 6. Actors & Use Cases ----------
  sectionTitle('6. Actors and Use Cases');
  bullets([
    'Actor: User (authenticated person) — the only human actor.',
    'Actor: Supabase Auth (external system) — verifies credentials and manages sessions.',
    'Use cases: Sign Up, Sign In, Sign Out, Upload PDF, Select Pages, Configure Page Styling (border, page numbers, footer — with "extends" variants: Set Border, Set Page Numbers, Set Footer), Process & Download PDF, View Error Message.',
  ]);

  // ---------- 7. Use Case Diagram (drawn) ----------
  pdf.addPage([W, H]);
  const p2 = pdf.getPages()[1];
  let dy = H - M;

  p2.drawText('7. Use Case Diagram', { x: M, y: dy, size: 13, font: bold, color: BLUE });
  dy -= 24;

  const cx = W / 2;
  const sysX = 170, sysW = 260, sysTop = dy, sysH = 560;
  const sysBottom = sysTop - sysH;

  // system boundary
  p2.drawRectangle({ x: sysX, y: sysBottom, width: sysW, height: sysH, borderColor: INK, borderWidth: 1.2, color: rgb(0.98, 0.98, 1) });
  p2.drawText('PDF Customizer System', { x: sysX + sysW / 2 - 62, y: sysTop - 20, size: 11, font: bold, color: INK });

  const ellipse = (cx2, cy2, rx, ry, label, size = 8.5) => {
    p2.drawEllipse({ x: cx2, y: cy2, xScale: rx, yScale: ry, borderColor: BLUE, borderWidth: 1.1, color: rgb(1, 1, 1) });
    const words = label.split(' ');
    const lines = [];
    let cur = '';
    for (const wd of words) {
      const t = cur ? cur + ' ' + wd : wd;
      if (bold.widthOfTextAtSize(t, size) <= rx * 1.55) cur = t;
      else { lines.push(cur); cur = wd; }
    }
    lines.push(cur);
    let ly = cy2 + ((lines.length - 1) * (size + 2)) / 2 - size + 2;
    for (const l of lines) {
      const wpx = bold.widthOfTextAtSize(l, size);
      p2.drawText(l, { x: cx2 - wpx / 2, y: ly, size, font: bold, color: INK });
      ly -= size + 2;
    }
  };

  // actor (stick figure) left
  const ax = 80, ay = sysTop - 120;
  p2.drawCircle({ x: ax, y: ay + 34, size: 8, borderColor: INK, borderWidth: 1.2 });
  p2.drawLine({ start: { x: ax, y: ay + 26 }, end: { x: ax, y: ay + 4 }, thickness: 1.2, color: INK });
  p2.drawLine({ start: { x: ax - 10, y: ay + 18 }, end: { x: ax + 10, y: ay + 18 }, thickness: 1.2, color: INK });
  p2.drawLine({ start: { x: ax, y: ay + 4 }, end: { x: ax - 9, y: ay - 12 }, thickness: 1.2, color: INK });
  p2.drawLine({ start: { x: ax, y: ay + 4 }, end: { x: ax + 9, y: ay - 12 }, thickness: 1.2, color: INK });
  p2.drawText('User', { x: ax - 13, y: ay - 26, size: 10, font: bold, color: INK });

  // use cases (two columns inside boundary)
  const colA = sysX + 72, colB = sysX + sysW - 72;
  const uc = {};
  const rowY = (i, n) => sysTop - 55 - i * ((sysH - 90) / (n - 1));
  const labels = ['Sign Up', 'Sign In', 'Sign Out', 'Upload PDF', 'Select Pages', 'Configure Styling', 'Set Border', 'Set Page Numbers', 'Set Footer', 'Process & Download'];
  labels.forEach((l, i) => {
    const col = i % 2 === 0 ? colA : colB;
    const row = Math.floor(i / 2);
    uc[l] = { x: col, y: rowY(row, 5) };
    ellipse(col, uc[l].y, 62, 19, l);
  });

  // actor connections
  const conn = (l) => {
    const t = uc[l];
    const sx = ax + 14, sy = ay + 20;
    const ex = t.x - 62, ey = t.y;
    p2.drawLine({ start: { x: sx, y: sy }, end: { x: ex, y: ey }, thickness: 0.9, color: INK });
  };
  ['Sign Up', 'Sign In', 'Upload PDF', 'Select Pages', 'Configure Styling', 'Process & Download'].forEach(conn);

  // extends dashed arrows: Set Border/Numbers/Footer --> Configure Styling
  const dashed = (from, to) => {
    const a = uc[from], b = uc[to];
    const dx = b.x - a.x, dyy = b.y - a.y;
    const len = Math.hypot(dx, dyy);
    const sx = a.x + (dx / len) * 60, sy2 = a.y + (dyy / len) * 16;
    const ex = b.x - (dx / len) * 60, ey2 = b.y - (dyy / len) * 16;
    p2.drawLine({ start: { x: sx, y: sy2 }, end: { x: ex, y: ey2 }, thickness: 0.8, color: MUTED, dashArray: [4, 3] });
  };
  dashed('Set Border', 'Configure Styling');
  dashed('Set Page Numbers', 'Configure Styling');
  dashed('Set Footer', 'Configure Styling');
  p2.drawText('<<extends>>', { x: sysX + sysW - 108, y: uc['Set Border'].y + 8, size: 7, font, color: MUTED });

  // Supabase Auth actor right
  const bx = W - 62, by = sysTop - 300;
  p2.drawRectangle({ x: bx - 24, y: by + 8, width: 48, height: 26, borderColor: INK, borderWidth: 1.1, color: rgb(1, 1, 1) });
  p2.drawText('Supabase', { x: bx - 21, y: by + 24, size: 7.5, font: bold, color: INK });
  p2.drawText('Auth', { x: bx - 12, y: by + 14, size: 7.5, font: bold, color: INK });
  p2.drawLine({ start: { x: bx - 24, y: by + 20 }, end: { x: uc['Sign In'].x + 62, y: uc['Sign In'].y }, thickness: 0.9, color: INK });
  p2.drawLine({ start: { x: bx - 24, y: by + 14 }, end: { x: uc['Sign Up'].x + 62, y: uc['Sign Up'].y + 4 }, thickness: 0.9, color: INK });

  // legend
  p2.drawLine({ start: { x: M, y: 70 }, end: { x: M + 26, y: 70 }, thickness: 0.8, color: MUTED, dashArray: [4, 3] });
  p2.drawText('<<extends>> relationship', { x: M + 32, y: 67, size: 8, font, color: MUTED });
  p2.drawLine({ start: { x: M, y: 54 }, end: { x: M + 26, y: 54 }, thickness: 0.9, color: INK });
  p2.drawText('association', { x: M + 32, y: 51, size: 8, font, color: MUTED });
  p2.drawText('All PDF processing happens client-side; only account/profile data is stored in the database.', { x: M, y: 32, size: 8, font, color: MUTED });

  const bytes = await pdf.save();
  fs.writeFileSync('PDF-Customizer-Report.pdf', bytes);
  console.log('Written PDF-Customizer-Report.pdf,', bytes.length, 'bytes');
}

main().catch((e) => { console.error(e); process.exit(1); });
