import React from 'react';
import { GradeItem } from '../types';
import { Award, CheckCircle, FileText, Download } from 'lucide-react';

interface GradesViewProps {
  studentName: string;
  grades: GradeItem[];
}

export const GradesView: React.FC<GradesViewProps> = ({ studentName, grades }) => {
  const avg =
    grades.length > 0
      ? Math.round(grades.reduce((a, b) => a + b.percentage, 0) / grades.length)
      : 0;

  const handleDownloadTranscript = () => {
    const text = `ACADEMIC TRANSCRIPT - GOOGLE APPS SCRIPT LMS
Student: ${studentName}
Overall Grade Average: ${avg}%
Generated: ${new Date().toLocaleDateString()}

GRADED ASSESSMENTS:
${grades.map(g => `- [${g.itemType.toUpperCase()}] ${g.title}: ${g.score}/${g.maxScore} (${g.percentage}%) - Graded on: ${g.gradedAt}\n  Feedback: ${g.feedback || 'None'}`).join('\n')}
`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Transcript_${studentName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            Academic Performance & Results
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Recorded in real time inside the <code className="text-blue-600 font-mono">Grades</code> Google Sheet database.
          </p>
        </div>

        <button
          onClick={handleDownloadTranscript}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Transcript
        </button>
      </div>

      {/* Overview Stat */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Weighted GPA</span>
          <div className="text-3xl sm:text-4xl font-black font-heading text-slate-900 mt-1">
            {avg}%
          </div>
          <p className="text-xs text-slate-500 mt-1">Based on all completed quizzes and evaluated project assignments.</p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <Award className="w-8 h-8" />
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-heading font-bold text-slate-900 text-sm">
          Assessment Grade Records
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Assessment Title</th>
                <th className="py-3 px-4">Earned / Max</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Date Graded</th>
                <th className="py-3 px-4">Instructor Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.itemType === 'quiz'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {item.itemType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{item.title}</td>
                  <td className="py-3 px-4 text-slate-700 font-semibold">
                    {item.score} / {item.maxScore}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-bold ${
                        item.percentage >= 70 ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {item.percentage}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{item.gradedAt}</td>
                  <td className="py-3 px-4 text-slate-600 italic">
                    {item.feedback || 'No remarks added.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
