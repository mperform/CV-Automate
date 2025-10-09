export async function compileLatexToPdf(latexContent: string): Promise<ArrayBuffer> {
  try {
    // Try LaTeX compilation services in order of reliability
    console.log('Starting LaTeX compilation...')
    
    // Method 1: Try latex.ytotech.com (YtoTech LaTeX API)
    try {
      console.log('Attempting compilation with latex.ytotech.com...')
      const pdfBuffer = await compileWithYtotech(latexContent)
      if (pdfBuffer) {
        console.log('✓ Successfully compiled with latex.ytotech.com')
        return pdfBuffer
      }
    } catch (error) {
      console.error('latex.ytotech.com failed:', error instanceof Error ? error.message : error)
    }

    // Method 2: Try latexonline.cc
    try {
      console.log('Attempting compilation with latexonline.cc...')
      const pdfBuffer = await compileWithLatexOnlineCC(latexContent)
      if (pdfBuffer) {
        console.log('✓ Successfully compiled with latexonline.cc')
        return pdfBuffer
      }
    } catch (error) {
      console.error('latexonline.cc failed:', error instanceof Error ? error.message : error)
    }

    // Method 3: Try ahrefs/texlive service
    try {
      console.log('Attempting compilation with Ahrefs TeX service...')
      const pdfBuffer = await compileWithAhrefs(latexContent)
      if (pdfBuffer) {
        console.log('✓ Successfully compiled with Ahrefs TeX service')
        return pdfBuffer
      }
    } catch (error) {
      console.error('Ahrefs TeX service failed:', error instanceof Error ? error.message : error)
    }
    
  } catch (error) {
    console.error('All LaTeX compilation services failed:', error)
  }
  
  // Fallback: Create a PDF with PDFKit
  console.log('All LaTeX services failed. Falling back to PDFKit rendering...')
  return createPdfKitPdf(latexContent)
}

async function compileWithYtotech(latexContent: string): Promise<ArrayBuffer | null> {
  const response = await fetch('https://latex.ytotech.com/builds/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      compiler: 'pdflatex',
      resources: [
        {
          file: 'main.tex',
          content: latexContent
        }
      ]
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('YtoTech API error response (status', response.status + '):', errorText)
    return null
  }

  const contentType = response.headers.get('content-type')
  console.log('YtoTech response content-type:', contentType)
  
  // Check if response is PDF
  if (contentType && contentType.includes('application/pdf')) {
    const buffer = await response.arrayBuffer()
    console.log('Received PDF from YtoTech, size:', buffer.byteLength)
    return buffer
  }
  
  // Check if response is JSON with PDF data
  if (contentType && contentType.includes('application/json')) {
    const result = await response.json()
    console.log('YtoTech JSON response structure:', Object.keys(result))
    
    // Check for various possible response formats
    if (result.pdf) {
      // Base64 encoded PDF
      console.log('Found base64 PDF in result.pdf')
      return base64ToArrayBuffer(result.pdf)
    }
    
    if (result.result && result.result.pdf) {
      console.log('Found base64 PDF in result.result.pdf')
      return base64ToArrayBuffer(result.result.pdf)
    }
    
    // Check for URL to download PDF
    if (result.url) {
      console.log('Found PDF URL:', result.url)
      const pdfResponse = await fetch(result.url)
      if (pdfResponse.ok) {
        const buffer = await pdfResponse.arrayBuffer()
        console.log('Downloaded PDF from URL, size:', buffer.byteLength)
        return buffer
      }
    }

    console.error('Unexpected JSON response format. Keys:', Object.keys(result))
    console.error('Sample response:', JSON.stringify(result).substring(0, 500))
  }

  return null
}

async function compileWithLatexOnlineCC(latexContent: string): Promise<ArrayBuffer | null> {
  // latexonline.cc requires the document to be available via a URL
  // Since we can't easily do that, we'll try a POST with the content
  
  // Try using query parameter (some mirrors support this)
  const encodedLatex = encodeURIComponent(latexContent)
  
  // This URL is too long for most servers, so this method typically won't work
  // but we'll try it as a fallback
  if (encodedLatex.length < 8000) { // URL length limit
    try {
      const response = await fetch(`https://latexonline.cc/compile?text=${encodedLatex}`)
      
      if (response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/pdf')) {
          return await response.arrayBuffer()
        }
      }
    } catch (error) {
      console.error('latexonline.cc GET method failed:', error)
    }
  }

  return null
}

async function compileWithAhrefs(latexContent: string): Promise<ArrayBuffer | null> {
  // Try the Ahrefs LaTeX compilation service
  const response = await fetch('https://texlive2020.ahrefs.com/compile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: latexContent,
      format: 'pdf'
    })
  })

  if (!response.ok) {
    return null
  }

  const contentType = response.headers.get('content-type')
  
  if (contentType && contentType.includes('application/pdf')) {
    return await response.arrayBuffer()
  }
  
  if (contentType && contentType.includes('application/json')) {
    const result = await response.json()
    
    if (result.pdf) {
      return base64ToArrayBuffer(result.pdf)
    }
    
    if (result.url) {
      const pdfResponse = await fetch(result.url)
      if (pdfResponse.ok) {
        return await pdfResponse.arrayBuffer()
      }
    }
  }

  return null
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  // Remove data URI prefix if present
  const base64Clean = base64.replace(/^data:application\/pdf;base64,/, '')
  
  // Decode base64 to binary string
  const binaryString = Buffer.from(base64Clean, 'base64').toString('binary')
  
  // Convert binary string to ArrayBuffer
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  
  return bytes.buffer
}

async function createPdfKitPdf(latexContent: string): Promise<ArrayBuffer> {
  try {
    // Import PDFKit dynamically for server-side use
    const PDFDocument = require('pdfkit')
    
    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      }
    })
    
    // Collect the PDF data
    const chunks: Buffer[] = []
    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    
    // Add warning header
    doc.fontSize(14).fillColor('red').text('⚠️ LaTeX Compilation Not Available', 50, 50)
    doc.moveDown()
    
    doc.fontSize(10).fillColor('black')
    doc.text('The LaTeX compilation services are currently unavailable.', { align: 'left' })
    doc.text('Please download the .tex file and compile it manually using a LaTeX editor.', { align: 'left' })
    doc.moveDown()
    doc.text('Recommended tools:', { align: 'left' })
    doc.text('• Overleaf (https://overleaf.com) - Online LaTeX editor', { align: 'left' })
    doc.text('• TeXShop, TeXworks, or MiKTeX - Desktop LaTeX editors', { align: 'left' })
    doc.moveDown()
    doc.moveDown()
    
    doc.fontSize(12).fillColor('blue').text('LaTeX Source Code Preview:', { underline: true })
    doc.moveDown()
    
    // Add LaTeX content
    doc.fontSize(9).fillColor('black').font('Courier')
    
    const lines = latexContent.split('\n')
    const maxLinesPerPage = 55
    let lineCount = 0
    
    for (const line of lines) {
      if (lineCount >= maxLinesPerPage) {
        doc.addPage()
        lineCount = 0
      }
      
      // Truncate very long lines
      const truncatedLine = line.length > 95 ? line.substring(0, 95) + '...' : line
      doc.text(truncatedLine)
      lineCount++
    }
    
    // Finalize the PDF
    doc.end()
    
    // Wait for the PDF to be generated
    return await new Promise<ArrayBuffer>((resolve, reject) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks)
        resolve(pdfBuffer.buffer.slice(pdfBuffer.byteOffset, pdfBuffer.byteOffset + pdfBuffer.byteLength))
      })
      
      doc.on('error', (error: Error) => {
        reject(error)
      })
    })
  } catch (error) {
    console.error('PDFKit error:', error)
    
    // Ultimate fallback: create a simple text-based PDF
    return createSimpleTextPdf(latexContent)
  }
}

function createSimpleTextPdf(latexContent: string): ArrayBuffer {
  // Create a very simple but valid PDF with just the LaTeX content as text
  const content = `LaTeX Source Code:\n\n${latexContent.substring(0, 2000)}`
  
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(LaTeX compilation failed. Here is the source code:) Tj
0 -20 Td
(Please compile manually with pdflatex) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000079 00000 n 
0000000173 00000 n 
0000000301 00000 n 
0000000500 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
700
%%EOF`

  const encoder = new TextEncoder()
  return encoder.encode(pdfContent).buffer
}
