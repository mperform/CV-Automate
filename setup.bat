@echo off
setlocal enabledelayedexpansion

REM CV-Automate Setup Script for Windows
REM This script helps set up the CV automation environment on Windows

echo ==========================================
echo 🚀 CV-Automate Setup Script (Windows)
echo ==========================================

REM Check Python installation
echo [INFO] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.7+ from https://python.org and try again.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
    echo [SUCCESS] Python found: !PYTHON_VERSION!
)

REM Check pip installation
echo [INFO] Checking pip installation...
pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] pip not found. Please ensure Python was installed with pip.
    pause
    exit /b 1
) else (
    echo [SUCCESS] pip found
)

REM Install Python dependencies
echo [INFO] Installing Python dependencies...
if exist requirements.txt (
    pip install -r requirements.txt
    echo [SUCCESS] Python dependencies installed
) else (
    echo [WARNING] requirements.txt not found, installing google-generativeai directly...
    pip install google-generativeai
    echo [SUCCESS] google-generativeai installed
)

REM Check LaTeX installation
echo [INFO] Checking LaTeX installation...
pdflatex --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] LaTeX (pdflatex) not found.
    echo Please install MiKTeX or TeX Live:
    echo 1. MiKTeX: https://miktex.org/download
    echo 2. TeX Live: https://www.tug.org/texlive/windows.html
    echo.
    echo After installation, restart your command prompt and run this script again.
    pause
    exit /b 1
) else (
    echo [SUCCESS] LaTeX is already installed
)

REM Check for required files
echo [INFO] Checking for required files...
set MISSING_FILES=0

if not exist "base_resume.tex" (
    echo [WARNING] Missing: base_resume.tex
    set /a MISSING_FILES+=1
) else (
    echo [SUCCESS] Found: base_resume.tex
)

if not exist "full_experiences.md" (
    echo [WARNING] Missing: full_experiences.md
    set /a MISSING_FILES+=1
) else (
    echo [SUCCESS] Found: full_experiences.md
)

if not exist "job_description.txt" (
    echo [WARNING] Missing: job_description.txt
    set /a MISSING_FILES+=1
) else (
    echo [SUCCESS] Found: job_description.txt
)

REM Create missing files with templates
if %MISSING_FILES% gtr 0 (
    echo [INFO] Creating template files...
    
    if not exist "job_description.txt" (
        echo [INFO] Creating template: job_description.txt
        (
            echo # Job Description Template
            echo # Paste the job description here
            echo.
            echo Position: Software Engineer
            echo Company: Example Company
            echo Location: Remote
            echo.
            echo Job Description:
            echo We are looking for a talented software engineer to join our team...
            echo.
            echo Required Skills:
            echo - Python
            echo - JavaScript
            echo - React
            echo - Database experience
            echo.
            echo Responsibilities:
            echo - Develop web applications
            echo - Collaborate with cross-functional teams
            echo - Write clean, maintainable code
        ) > job_description.txt
    )
    
    if not exist "full_experiences.md" (
        echo [INFO] Creating template: full_experiences.md
        (
            echo # Your Full Experiences
            echo.
            echo ## Work Experience
            echo.
            echo ### Software Engineer ^| Company A ^| 2022-2024
            echo - Led development of web application serving 10,000+ users
            echo - Implemented REST APIs using Python and Django
            echo - Collaborated with cross-functional teams to deliver features on time
            echo.
            echo ### Junior Developer ^| Company B ^| 2020-2022
            echo - Developed mobile applications using React Native
            echo - Participated in agile development processes
            echo - Contributed to code reviews and testing
            echo.
            echo ## Project Experience
            echo.
            echo ### Personal Portfolio Website ^| 2023
            echo - Built responsive website using React and Node.js
            echo - Implemented CI/CD pipeline with GitHub Actions
            echo - Deployed on AWS with automatic scaling
            echo.
            echo ### E-commerce Platform ^| 2022
            echo - Created full-stack application with Django and PostgreSQL
            echo - Integrated payment processing with Stripe
            echo - Implemented user authentication and authorization
        ) > full_experiences.md
    )
)

REM API Key setup
echo.
echo 🔑 Gemini API Key Setup
echo =======================
echo To use this tool, you need a Gemini API key from Google AI Studio.
echo.
echo 1. Visit: https://makersuite.google.com/app/apikey
echo 2. Sign in with your Google account
echo 3. Click 'Create API Key'
echo 4. Copy the generated API key
echo.

REM Ask user if they want to set up API key now
set /p SETUP_KEY="Do you have a Gemini API key ready to set up? (y/n): "
if /i "%SETUP_KEY%"=="y" (
    set /p API_KEY="Enter your Gemini API key: "
    if not "!API_KEY!"=="" (
        echo [SUCCESS] API key received
        echo [INFO] To use this API key, run the following command before using the script:
        echo set GEMINI_API_KEY=!API_KEY!
        echo.
        echo Or add it permanently to your environment variables through System Properties.
    ) else (
        echo [WARNING] No API key provided. You'll need to set it manually later.
    )
) else (
    echo [WARNING] Skipping API key setup. You can set it later with:
    echo set GEMINI_API_KEY=your-api-key-here
)

REM Test the installation
echo [INFO] Testing installation...
if exist "main.py" (
    echo [SUCCESS] main.py found
    echo [INFO] You can now run the CV automation with:
    echo   python main.py
    echo.
    echo Optional arguments:
    echo   --job-description job_description.txt
    echo   --experiences full_experiences.md
    echo   --resume-template base_resume.tex
    echo   --output-tex resume.tex
    echo   --output-pdf resume.pdf
) else (
    echo [ERROR] main.py not found. Please ensure you're in the correct directory.
)

echo.
echo ==========================================
echo [SUCCESS] Setup completed!
echo ==========================================
echo.
echo 📝 Next steps:
echo 1. Edit the template files with your information:
echo    - job_description.txt (paste the job description)
echo    - full_experiences.md (add your experiences)
echo    - base_resume.tex (customize if needed)
echo.
echo 2. Set your API key (if not done during setup):
echo    set GEMINI_API_KEY=your-api-key-here
echo.
echo 3. Run the automation:
echo    python main.py
echo.
echo 📖 For more information, see install.md
echo ==========================================
pause
