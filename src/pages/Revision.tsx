import { useState } from 'react';
import { REVISION_CONTENT } from '../data/revisionContent';
import { generateRevisionPDF, generateAllSubjectsPDF } from '../utils/pdfGenerator';
import { useData } from '../context/DataContext';
import { Download, ChevronDown, ChevronUp, FileDown } from 'lucide-react';

export default function Revision() {
  const { state, setRevisionNote } = useData();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  function getNote(key: string) {
    return drafts[key] ?? state.revisionNotes[key] ?? '';
  }

  function saveNote(key: string) {
    setRevisionNote(key, drafts[key] ?? '');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600">Formula Sheets</span>
            <h1 className="bg-gradient-to-r from-amber-600 via-rose-600 to-fuchsia-600 bg-clip-text text-3xl font-bold text-transparent">
              Quick Revision
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              A 2-page high-yield revision sheet per subject — key formulas, concepts, and common traps. Add your own notes and they'll be included in the PDF.
            </p>
          </div>
          <button
            onClick={() => generateAllSubjectsPDF(REVISION_CONTENT, state.revisionNotes)}
            className="flex items-center gap-2 shrink-0 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-200 hover:-translate-y-0.5 transition"
          >
            <FileDown size={16} /> Download All Subjects (one PDF)
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {REVISION_CONTENT.map((subject) => {
            const isOpen = expanded === subject.key;
            return (
              <div
                key={subject.key}
                className="rounded-3xl bg-white/90 backdrop-blur-sm border border-white shadow-lg shadow-slate-200/50 overflow-hidden"
                style={{ borderTop: `4px solid ${subject.color}` }}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-800">{subject.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{subject.sections.length} sections · ~2 pages</div>
                    </div>
                    <span
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0"
                      style={{ backgroundColor: subject.color }}
                    >
                      {subject.title.slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => generateRevisionPDF(subject, state.revisionNotes[subject.key])}
                      className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg text-white font-semibold shadow-sm"
                      style={{ backgroundColor: subject.color }}
                    >
                      <Download size={13} /> Download PDF
                    </button>
                    <button
                      onClick={() => setExpanded(isOpen ? null : subject.key)}
                      className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
                    >
                      {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      {isOpen ? 'Hide preview' : 'Preview & add notes'}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-5 space-y-4">
                    <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                      {subject.sections.map((s) => (
                        <div key={s.heading}>
                          <div className="text-xs font-bold" style={{ color: subject.color }}>{s.heading}</div>
                          <ul className="mt-1 space-y-1">
                            {s.bullets.map((b, i) => (
                              <li key={i} className="text-[12px] text-slate-600 leading-snug pl-3 relative before:content-['•'] before:absolute before:left-0" style={{ color: '#475569' }}>
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-700 mb-1.5">Add your own content for {subject.title}</div>
                      <textarea
                        className="w-full min-h-[80px] rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                        placeholder="Paste extra formulas, tricky questions, or notes from class here — they'll be appended to this subject's PDF."
                        value={getNote(subject.key)}
                        onChange={(e) => setDrafts((d) => ({ ...d, [subject.key]: e.target.value }))}
                      />
                      <button
                        onClick={() => saveNote(subject.key)}
                        className="mt-2 text-xs px-4 py-1.5 rounded-lg bg-slate-800 text-white font-medium"
                      >
                        Save notes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
