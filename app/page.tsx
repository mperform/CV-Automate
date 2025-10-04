'use client'

import { useState } from 'react'
import { Upload, Download, FileText, Briefcase, Sparkles } from 'lucide-react'
import ResumeForm from '@/components/ResumeForm'
import GeneratedResume from '@/components/GeneratedResume'

export default function Home() {
  const [generatedResume, setGeneratedResume] = useState<{
    texContent: string
    pdfBuffer: ArrayBuffer
  } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleResumeGenerated = (texContent: string, pdfBuffer: ArrayBuffer) => {
    setGeneratedResume({ texContent, pdfBuffer })
  }

  const handleReset = () => {
    setGeneratedResume(null)
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary-100 p-3 rounded-full">
            <Sparkles className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI-Powered Resume Generator
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transform your work experiences into tailored, professional resumes. 
          Upload your experience history and job description, and let AI create the perfect resume for you.
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
            <Upload className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Upload Your Files</h3>
          <p className="text-gray-600">Upload your complete work experiences and target job description</p>
        </div>
        
        <div className="card text-center">
          <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
            <Sparkles className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">AI Processing</h3>
          <p className="text-gray-600">AI intelligently selects and tailors your experiences for the job</p>
        </div>
        
        <div className="card text-center">
          <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
            <Download className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Download Resume</h3>
          <p className="text-gray-600">Get professional LaTeX and PDF files ready for applications</p>
        </div>
      </div>

      {/* Main Content */}
      {!generatedResume ? (
        <ResumeForm 
          onResumeGenerated={handleResumeGenerated}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />
      ) : (
        <GeneratedResume 
          texContent={generatedResume.texContent}
          pdfBuffer={generatedResume.pdfBuffer}
          onReset={handleReset}
        />
      )}

      {/* How It Works */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 font-bold">
              1
            </div>
            <h3 className="font-semibold mb-2">Prepare Files</h3>
            <p className="text-sm text-gray-600">Upload your complete work history and job description</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 font-bold">
              2
            </div>
            <h3 className="font-semibold mb-2">AI Analysis</h3>
            <p className="text-sm text-gray-600">Our AI analyzes and selects the most relevant experiences</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 font-bold">
              3
            </div>
            <h3 className="font-semibold mb-2">Generate Content</h3>
            <p className="text-sm text-gray-600">Creates tailored bullet points and optimizes for one page</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 font-bold">
              4
            </div>
            <h3 className="font-semibold mb-2">Download Resume</h3>
            <p className="text-sm text-gray-600">Get professional LaTeX and PDF files ready to use</p>
          </div>
        </div>
      </div>
    </div>
  )
}
