import jsPDF from 'jspdf';
import type { SubjectRevision } from '../data/revisionContent';

export function generateRevisionPDF(subject: SubjectRevision, extraNotes?: string) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 44;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  function ensureSpace(lineHeight: number) {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  }

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30, 27, 75);
  doc.text(`${subject.title} — Quick Revision`, margin, y);
  y += 20;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 113, 108);
  doc.text('GATE CSE 2027 Prep Tracker', margin, y);
  y += 6;
  doc.setDrawColor(200, 195, 230);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  for (const section of subject.sections) {
    ensureSpace(24);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(88, 28, 135);
    doc.text(section.heading, margin, y);
    y += 15;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(31, 29, 44);

    for (const bullet of section.bullets) {
      const lines: string[] = doc.splitTextToSize(`•  ${bullet}`, maxWidth - 8);
      ensureSpace(lines.length * 13 + 4);
      doc.text(lines, margin + 6, y);
      y += lines.length * 13 + 4;
    }
    y += 6;
  }

  if (extraNotes && extraNotes.trim()) {
    ensureSpace(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(190, 80, 20);
    doc.text('My Additional Notes', margin, y);
    y += 15;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(31, 29, 44);
    const lines: string[] = doc.splitTextToSize(extraNotes, maxWidth);
    for (const line of lines) {
      ensureSpace(13);
      doc.text(line, margin, y);
      y += 13;
    }
  }

  doc.save(`${subject.key}-quick-revision.pdf`);
}

export function generateAllSubjectsPDF(subjects: SubjectRevision[], notesMap: Record<string, string>) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 44;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;
  let first = true;

  function ensureSpace(lineHeight: number) {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  }

  for (const subject of subjects) {
    if (!first) {
      doc.addPage();
      y = margin;
    }
    first = false;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(30, 27, 75);
    doc.text(`${subject.title} — Quick Revision`, margin, y);
    y += 24;

    for (const section of subject.sections) {
      ensureSpace(24);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(88, 28, 135);
      doc.text(section.heading, margin, y);
      y += 15;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(31, 29, 44);
      for (const bullet of section.bullets) {
        const lines: string[] = doc.splitTextToSize(`•  ${bullet}`, maxWidth - 8);
        ensureSpace(lines.length * 13 + 4);
        doc.text(lines, margin + 6, y);
        y += lines.length * 13 + 4;
      }
      y += 6;
    }

    const notes = notesMap[subject.key];
    if (notes && notes.trim()) {
      ensureSpace(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(190, 80, 20);
      doc.text('My Additional Notes', margin, y);
      y += 15;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(31, 29, 44);
      const lines: string[] = doc.splitTextToSize(notes, maxWidth);
      for (const line of lines) {
        ensureSpace(13);
        doc.text(line, margin, y);
        y += 13;
      }
    }
  }

  doc.save('gate-2027-all-subjects-revision.pdf');
}
