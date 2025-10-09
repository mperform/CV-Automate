'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, Briefcase, Loader2 } from 'lucide-react'

interface ResumeFormProps {
  onResumeGenerated: (explanation: string, texContent: string, pdfBuffer: ArrayBuffer) => void
  isGenerating: boolean
  setIsGenerating: (value: boolean) => void
}

export default function ResumeForm({ onResumeGenerated, isGenerating, setIsGenerating }: ResumeFormProps) {
  const [experiencesFile, setExperiencesFile] = useState<File | null>(null)
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(null)
  const [jobDescriptionText, setJobDescriptionText] = useState<string>('')
  const [useJobDescriptionText, setUseJobDescriptionText] = useState<boolean>(false)
  const [resumeTemplateFile, setResumeTemplateFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const experiencesRef = useRef<HTMLInputElement>(null)
  const jobDescriptionRef = useRef<HTMLInputElement>(null)
  const resumeTemplateRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (
    file: File | null,
    setFile: (file: File | null) => void,
    type: string
  ) => {
    if (file) {
      if (type === 'experiences' && !file.name.endsWith('.md')) {
        setError('Experiences file must be a .md file')
        return
      }
      if (type === 'job' && !file.name.endsWith('.txt')) {
        setError('Job description file must be a .txt file')
        return
      }
      if (type === 'template' && !file.name.endsWith('.tex')) {
        setError('Resume template file must be a .tex file')
        return
      }
      setError(null)
    }
    setFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!experiencesFile || (!jobDescriptionFile && !jobDescriptionText.trim())) {
      setError('Please upload experiences file and provide job description (file or text)')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('experiences', experiencesFile)
      
      // Add job description either as file or text
      if (useJobDescriptionText && jobDescriptionText.trim()) {
        formData.append('jobDescriptionText', jobDescriptionText.trim())
      } else if (jobDescriptionFile) {
        formData.append('jobDescription', jobDescriptionFile)
      }
      
      if (resumeTemplateFile) {
        formData.append('resumeTemplate', resumeTemplateFile)
      }

      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate resume')
      }

      const result = await response.json()
      
      // Convert the number array back to ArrayBuffer
      const pdfArray = new Uint8Array(result.pdfBuffer)
      const pdfBuffer = pdfArray.buffer
      
      onResumeGenerated(result.explanation, result.texContent, pdfBuffer)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setExperiencesFile(null)
    setJobDescriptionFile(null)
    setJobDescriptionText('')
    setUseJobDescriptionText(false)
    setResumeTemplateFile(null)
    setError(null)
    if (experiencesRef.current) experiencesRef.current.value = ''
    if (jobDescriptionRef.current) jobDescriptionRef.current.value = ''
    if (resumeTemplateRef.current) resumeTemplateRef.current.value = ''
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Your Resume</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Experiences File */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Briefcase className="inline h-4 w-4 mr-1" />
            Work Experiences (Markdown file)
          </label>
          <div className="relative">
            <input
              ref={experiencesRef}
              type="file"
              accept=".md"
              onChange={(e) => handleFileChange(
                e.target.files?.[0] || null,
                setExperiencesFile,
                'experiences'
              )}
              className="input-field"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Upload your complete work history in Markdown format (.md)
          </p>
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="inline h-4 w-4 mr-1" />
            Job Description
          </label>
          
          {/* Toggle between file upload and text input */}
          <div className="flex gap-4 mb-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="jobDescriptionType"
                checked={!useJobDescriptionText}
                onChange={() => setUseJobDescriptionText(false)}
                className="mr-2"
              />
              Upload File (.txt)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="jobDescriptionType"
                checked={useJobDescriptionText}
                onChange={() => setUseJobDescriptionText(true)}
                className="mr-2"
              />
              Paste Text
            </label>
          </div>

          {!useJobDescriptionText ? (
            <div className="relative">
              <input
                ref={jobDescriptionRef}
                type="file"
                accept=".txt"
                onChange={(e) => handleFileChange(
                  e.target.files?.[0] || null,
                  setJobDescriptionFile,
                  'job'
                )}
                className="input-field"
                required={!useJobDescriptionText}
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload the target job description in text format (.txt)
              </p>
            </div>
          ) : (
            <div>
              <textarea
                value={jobDescriptionText}
                onChange={(e) => setJobDescriptionText(e.target.value)}
                placeholder="Paste the job description here..."
                className="input-field min-h-[120px] resize-vertical"
                required={useJobDescriptionText}
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste the job description directly into this text box
              </p>
            </div>
          )}
        </div>

        {/* Resume Template File (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="inline h-4 w-4 mr-1" />
            Resume Template (LaTeX file) - Optional
          </label>
          <div className="relative">
            <input
              ref={resumeTemplateRef}
              type="file"
              accept=".tex"
              onChange={(e) => handleFileChange(
                e.target.files?.[0] || null,
                setResumeTemplateFile,
                'template'
              )}
              className="input-field"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Upload a custom LaTeX resume template (.tex) or use the default
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isGenerating}
            className="btn-primary flex-1 flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Resume...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Generate Resume
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            disabled={isGenerating}
            className="btn-secondary"
          >
            Reset
          </button>
        </div>
      </form>

      {/* File Format Help */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">File Format Requirements:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>Experiences:</strong> Markdown (.md) file with your complete work history</li>
          <li>• <strong>Job Description:</strong> Text (.txt) file with the target job posting</li>
          <li>• <strong>Template:</strong> LaTeX (.tex) file (optional, uses default if not provided)</li>
        </ul>
      </div>
    </div>
  )
}
