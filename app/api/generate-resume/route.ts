import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { compileLatexToPdf } from '@/lib/latexToPdf'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Default resume template
const DEFAULT_TEMPLATE = `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\setlength{\\footskip}{80pt}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[2]{
  \\item\\small{
    \\textbf{#1}{: #2 \\vspace{-2pt}}
  }
}

\\newcommand{\\classesList}[4]{
    \\item\\small{
        \\textbf{#1}{ #2 \\textbf{#3}{ #4} \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-5pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[2]{\\resumeItem{#1}{#2}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\circ$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=*]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING-----------------
\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{\\Large [YOUR NAME]} & Email: [YOUR EMAIL] \\\\
  [YOUR ADDRESS] & Mobile: [YOUR PHONE] \\\\
  & LinkedIn: [YOUR LINKEDIN] \\\\
  & GitHub: [YOUR GITHUB] \\\\
\\end{tabular*}

%-----------EDUCATION-----------------
\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {[UNIVERSITY NAME]}{[LOCATION]}
      {[DEGREE] in [MAJOR]}{[START DATE] -- [END DATE]}
  \\resumeSubHeadingListEnd

%-----------EXPERIENCE-----------------
\\section{Experience}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {[JOB TITLE]}{[START DATE] -- [END DATE]}
      {[COMPANY NAME]}{[LOCATION]}
      \\resumeItemListStart
        \\resumeItem{[ACHIEVEMENT 1]}
        {[DETAILS AND IMPACT]}
        \\resumeItem{[ACHIEVEMENT 2]}
        {[DETAILS AND IMPACT]}
        \\resumeItem{[ACHIEVEMENT 3]}
        {[DETAILS AND IMPACT]}
      \\resumeItemListEnd
  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------------
\\section{Projects}
  \\resumeSubHeadingListStart
    \\resumeProjectHeading
      {\\textbf{[PROJECT NAME]} $|$ \\emph{[TECHNOLOGIES]}}{[DATE]}
      \\resumeItemListStart
        \\resumeItem{[PROJECT ACHIEVEMENT 1]}
        {[DETAILS AND IMPACT]}
        \\resumeItem{[PROJECT ACHIEVEMENT 2]}
        {[DETAILS AND IMPACT]}
      \\resumeItemListEnd
  \\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: [LIST LANGUAGES]} \\\\
     \\textbf{Technologies}{: [LIST TECHNOLOGIES]} \\\\
     \\textbf{Tools}{: [LIST TOOLS]} \\\\
    }}
 \\end{itemize}

%-------------------------------------------
\\end{document}`

const systemPrompt = `You are an expert resume assistant that transforms a person's full experience into a concise, tailored LaTeX resume for a specific job.

You are given three inputs:
1. A base LaTeX resume template.
2. A Markdown file of the candidate's complete experiences.
3. A job description.

Your task is to generate a .tex file that:
- Preserves the overall formatting and structure of the base template.
- Selects and tailors only the most relevant experiences from the experiences file according to the job description.
- Typically include 3+ work experiences and 1-2 project experience to fill a one-page resume.
- For each Work or Research Experience, output exactly 3 concise bullet points summarizing the most impactful, job-relevant accomplishments.
- For each Project Experience, output exactly 2 concise bullet points.
- Use textbf to highlight key achievements such as metrics, technologies used, and outcomes.
- The final content must fit on a single one-page PDF (avoid redundancy, trim wordiness, prioritize relevance).
- Where needed, add vspace using px (e.g. \\vspace{-2pt}) to ensure compactness.
- Keep technical detail and metrics where relevant (impact, improvements, performance gains).
- Do not invent experiences or skills not present in the input files, but you may rephrase and condense.
- Maintain consistent tense, formatting, and LaTeX syntax so that the .tex compiles successfully.
- Replace placeholders like [YOUR NAME], [YOUR EMAIL], etc. with appropriate content from the experiences file.

IMPORTANT: You must provide TWO outputs in the following format:

1. First, provide a brief explanation paragraph (2-3 sentences) explaining:
   - Which work experiences and projects you selected from the candidate's background
   - How these selections align with the specific job requirements
   - Why these experiences make the candidate a strong fit for this role

2. Then, provide the complete .tex file content, ready to be compiled with pdflatex.

Use this exact format:
EXPLANATION: [Your 2-3 sentence explanation here]

LATEX_CONTENT:
[Full .tex file content here]`

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const experiencesFile = formData.get('experiences') as File
    const jobDescriptionFile = formData.get('jobDescription') as File
    const jobDescriptionText = formData.get('jobDescriptionText') as string
    const resumeTemplateFile = formData.get('resumeTemplate') as File

    if (!experiencesFile || (!jobDescriptionFile && !jobDescriptionText)) {
      return NextResponse.json(
        { error: 'Missing required experiences and job description' },
        { status: 400 }
      )
    }

    // Read file contents
    const experiences = await experiencesFile.text()
    const jobDescription = jobDescriptionText || (await jobDescriptionFile.text())
    const resumeTemplate = resumeTemplateFile 
      ? await resumeTemplateFile.text()
      : DEFAULT_TEMPLATE

    // Generate resume using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" })    
    const prompt = `${systemPrompt}

Job description: ${jobDescription}

Experiences: ${experiences}

Resume template: ${resumeTemplate}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const fullResponse = response.text()

    // Parse the response to extract explanation and LaTeX content
    let explanation = ''
    let texContent = ''
    
    // Split by LATEX_CONTENT: to separate explanation from LaTeX
    const parts = fullResponse.split('LATEX_CONTENT:')
    if (parts.length === 2) {
      // Extract explanation (remove "EXPLANATION: " prefix)
      explanation = parts[0].replace('EXPLANATION:', '').trim()
      texContent = parts[1].trim()
    } else {
      // Fallback: if format not followed, treat entire response as LaTeX
      explanation = 'No explanation provided by AI'
      texContent = fullResponse
    }

    // Clean up the LaTeX output - remove markdown code blocks and extra content
    let cleanTexContent = texContent
      .replace(/```latex\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/```tex\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    
    // Remove any content before the first \documentclass
    const documentClassIndex = cleanTexContent.indexOf('\\documentclass')
    if (documentClassIndex > 0) {
      cleanTexContent = cleanTexContent.substring(documentClassIndex)
    }
    
    // Remove any content after the last \end{document}
    const endDocumentIndex = cleanTexContent.lastIndexOf('\\end{document}')
    if (endDocumentIndex > 0) {
      cleanTexContent = cleanTexContent.substring(0, endDocumentIndex + '\\end{document}'.length)
    }

    // Compile LaTeX to PDF using our service
    const pdfBuffer = await compileLatexToPdf(cleanTexContent)

    return NextResponse.json({
      explanation: explanation,
      texContent: cleanTexContent,
      pdfBuffer: Array.from(new Uint8Array(pdfBuffer))
    })

  } catch (error) {
    console.error('Error generating resume:', error)
    return NextResponse.json(
      { error: 'Failed to generate resume' },
      { status: 500 }
    )
  }
}
