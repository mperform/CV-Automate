'use client'

import { useState } from 'react'
import { Download, RotateCcw, Eye, FileText } from 'lucide-react'

interface GeneratedResumeProps {
  texContent: string
  pdfBuffer: ArrayBuffer
  onReset: () => void
}

export default function GeneratedResume({ texContent, pdfBuffer, onReset }: GeneratedResumeProps) {
  const [showTexPreview, setShowTexPreview] = useState(false)

  const downloadTex = () => {
    const blob = new Blob([texContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume.tex'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadPdf = () => {
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const viewPdf = () => {
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Resume Generated Successfully!</h2>
        <button
          onClick={onReset}
          className="btn-secondary flex items-center"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Generate Another
        </button>
      </div>

      {/* Download Buttons */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">LaTeX File</h3>
          <p className="text-sm text-gray-600 mb-3">
            Download the LaTeX source file for further customization
          </p>
          <button
            onClick={downloadTex}
            className="btn-primary flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            Download .tex
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">PDF File</h3>
          <p className="text-sm text-gray-600 mb-3">
            Download the compiled PDF resume ready for applications
          </p>
          <div className="flex gap-2">
            <button
              onClick={viewPdf}
              className="btn-secondary flex items-center flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </button>
            <button
              onClick={downloadPdf}
              className="btn-primary flex items-center flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download .pdf
            </button>
          </div>
        </div>
      </div>

      {/* LaTeX Preview */}
      <div className="border border-gray-200 rounded-lg">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">LaTeX Source Code</h3>
          <button
            onClick={() => setShowTexPreview(!showTexPreview)}
            className="btn-secondary text-sm"
          >
            {showTexPreview ? 'Hide' : 'Show'} Code
          </button>
        </div>
        
        {showTexPreview && (
          <div className="p-4">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{texContent}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Success Message */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-semibold text-green-900 mb-2">✅ Resume Generated Successfully!</h3>
        <p className="text-green-800 text-sm">
          Your tailored resume has been generated based on your experiences and the job description. 
          The AI has selected the most relevant experiences and formatted them for optimal impact.
        </p>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for Using Your Resume:</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Review the generated content and make any necessary adjustments</li>
          <li>• The LaTeX file allows for easy customization of formatting and content</li>
          <li>• The PDF is ready to submit for job applications</li>
          <li>• Save both files for future reference and modifications</li>
        </ul>
      </div>
    </div>
  )
}
