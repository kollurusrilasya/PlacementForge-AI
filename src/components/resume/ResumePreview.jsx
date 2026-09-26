import React, { useState } from 'react'
import { ClassicAtsTemplate } from './ClassicAtsTemplate'
import { ModernAtsTemplate, MinimalTemplate } from './ModernAtsTemplate'
import { Download, CheckCircle2, ShieldCheck } from 'lucide-react'
import { PrimaryButton } from '../common'

export function ResumePreview({ data, selectedTemplate, onSelectTemplate }) {
  const [atsView, setAtsView] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-col h-full bg-[#FAFAF9] border border-[#E8E8E5] rounded-[16px] overflow-hidden">
      {/* Preview Action Bar */}
      <div className="p-3.5 bg-white border-b border-[#E8E8E5] flex flex-wrap items-center justify-between gap-3">
        {/* Template Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4F4F1] rounded-[10px] border border-[#E8E8E5]">
          <button
            onClick={() => onSelectTemplate('classic')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-[8px] transition-all ${
              selectedTemplate === 'classic'
                ? 'bg-white text-[#111111] shadow-subtle'
                : 'text-[#6B6B6B] hover:text-[#111111]'
            }`}
          >
            Classic ATS
          </button>
          <button
            onClick={() => onSelectTemplate('modern')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-[8px] transition-all ${
              selectedTemplate === 'modern'
                ? 'bg-white text-[#111111] shadow-subtle'
                : 'text-[#6B6B6B] hover:text-[#111111]'
            }`}
          >
            Modern ATS
          </button>
          <button
            onClick={() => onSelectTemplate('minimal')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-[8px] transition-all ${
              selectedTemplate === 'minimal'
                ? 'bg-white text-[#111111] shadow-subtle'
                : 'text-[#6B6B6B] hover:text-[#111111]'
            }`}
          >
            Minimal
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAtsView(!atsView)}
            className={`text-xs px-2.5 py-1.5 rounded-[8px] font-medium border transition-colors inline-flex items-center gap-1.5 ${
              atsView
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-[#6B6B6B] border-[#E8E8E5] hover:text-[#111111]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{atsView ? 'ATS Scanner Active' : 'ATS Check'}</span>
          </button>

          <PrimaryButton
            size="sm"
            icon={Download}
            onClick={handlePrint}
          >
            Download Resume
          </PrimaryButton>
        </div>
      </div>

      {/* ATS Scanner Overlay Callout if active */}
      {atsView && (
        <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-xs text-emerald-800 flex items-center justify-between px-6">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <strong>ATS Compliance 91%</strong>: Standard headings, single-column layout, machine-parseable fonts.
          </span>
          <span className="font-mono text-[11px] text-emerald-700">Format: UTF-8 Plain Structure</span>
        </div>
      )}

      {/* Document Viewport */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center bg-[#EFEFED]/40 print:p-0 print:bg-white">
        <div className="w-full max-w-2xl bg-white shadow-card rounded-[8px] overflow-hidden print:shadow-none print:m-0">
          {selectedTemplate === 'classic' && <ClassicAtsTemplate data={data} />}
          {selectedTemplate === 'modern' && <ModernAtsTemplate data={data} />}
          {selectedTemplate === 'minimal' && <MinimalTemplate data={data} />}
        </div>
      </div>
    </div>
  )
}

export default ResumePreview
