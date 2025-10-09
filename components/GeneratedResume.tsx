'use client'

import { useState } from 'react'
import { Download, RotateCcw, Eye, FileText } from 'lucide-react'

interface GeneratedResumeProps {
  explanation: string
  texContent: string
  pdfBuffer: ArrayBuffer
  onReset: () => void
}

export default function GeneratedResume({ explanation, texContent, pdfBuffer, onReset }: GeneratedResumeProps) {
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
    try {
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      // Check if the PDF is valid by checking size
      if (blob.size < 100) {
        alert('Warning: PDF file seems unusually small. It may not have compiled correctly.')
      }
      
      window.open(url, '_blank')
    } catch (error) {
      console.error('Error viewing PDF:', error)
      alert('Error opening PDF. Please try downloading it instead.')
    }
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

      {/* AI Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          AI Selection Rationale
        </h3>
        <p className="text-blue-800 text-sm leading-relaxed">
          {explanation}
        </p>
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
          <p className="text-sm text-gray-600 mb-1">
            Download the compiled PDF resume ready for applications
          </p>
          <p className="text-xs text-gray-500 mb-3">
            File size: {(pdfBuffer.byteLength / 1024).toFixed(1)} KB
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
          <li>• The PDF is compiled using online LaTeX services for convenience</li>
          <li>• If the PDF looks incorrect, download the .tex file and compile it manually with Overleaf</li>
          <li>• Save both files for future reference and modifications</li>
        </ul>
      </div>
    </div>
  )
}
