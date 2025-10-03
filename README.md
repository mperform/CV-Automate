# CV-Automate 🚀

**Automatically generate tailored resumes using AI and LaTeX**

CV-Automate is a powerful tool that uses Google's Gemini AI to transform your comprehensive work experiences into a polished, job-specific resume. Simply provide your full experience history and a job description, and the AI will create a perfectly tailored LaTeX resume that highlights your most relevant qualifications.

## ✨ Features

- **🤖 AI-Powered**: Uses Google Gemini to intelligently select and tailor content
- **📄 LaTeX Output**: Generates professional, ATS-friendly PDF resumes
- **🎯 Job-Specific**: Automatically prioritizes relevant experiences for each application
- **📋 Template-Based**: Uses your custom LaTeX resume template for consistent formatting
- **⚡ One-Click Setup**: Automated setup scripts for all platforms
- **🔧 Customizable**: Flexible arguments for different use cases
- **📊 Smart Formatting**: Automatically fits content to one page with optimal bullet points

## 🎯 How It Works

1. **Input**: Provide your full experience history and target job description
2. **AI Processing**: Gemini AI analyzes and selects the most relevant experiences
3. **Content Generation**: Creates tailored bullet points (3 for work experience, 2 for projects)
4. **LaTeX Compilation**: Generates a professional PDF resume ready for applications

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- LaTeX (MacTeX, TeX Live, or MiKTeX)
- Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

#### Option 1: Automated Setup (Recommended)

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```batch
setup.bat
```

#### Option 2: Manual Installation
See [install.md](install.md) for detailed manual installation instructions.

### Usage

1. **Prepare your files:**
   - Edit `job_description.txt` with your target job description
   - Edit `full_experiences.md` with your complete work history
   - Customize `base_resume.tex` if needed (optional)

2. **Set your API key:**
   ```bash
   export GEMINI_API_KEY="your-api-key-here"
   ```

3. **Generate your resume:**
   ```bash
   python main.py
   ```

4. **View your resume:**
   ```bash
   open resume.pdf  # macOS
   xdg-open resume.pdf  # Linux
   start resume.pdf  # Windows
   ```

## 📁 File Structure

```
CV-Automate/
├── main.py                 # Main automation script
├── requirements.txt        # Python dependencies
├── setup.sh               # macOS/Linux setup script
├── setup.bat              # Windows setup script
├── install.md             # Detailed installation guide
├── base_resume.tex        # LaTeX resume template
├── full_experiences.md    # Your complete work history
├── job_description.txt    # Target job description
├── resume.tex             # Generated LaTeX file
└── resume.pdf             # Final PDF output
```

## 🔧 Command Line Options

```bash
python main.py [OPTIONS]

Options:
  --model MODEL              Gemini model to use (default: gemini-pro)
  --job-description FILE     Job description file (default: job_description.txt)
  --experiences FILE         Experience history file (default: full_experiences.md)
  --resume-template FILE     LaTeX template file (default: base_resume.tex)
  --output-tex FILE          Output LaTeX file (default: resume.tex)
  --output-pdf FILE          Output PDF file (default: resume.pdf)
```

### Examples

```bash
# Basic usage
python main.py

# Custom files
python main.py --job-description "software_engineer.txt" --experiences "my_experience.md"

# Different output names
python main.py --output-tex "software_engineer_resume.tex" --output-pdf "software_engineer_resume.pdf"

# Use different Gemini model
python main.py --model "gemini-1.5-flash"
```

## 📝 Input File Formats

### `full_experiences.md`
Your complete work history in Markdown format:

```markdown
# Your Full Experiences

## Work Experience

### Software Engineer | Company A | 2022-2024
- Led development of web application serving 10,000+ users
- Implemented REST APIs using Python and Django
- Collaborated with cross-functional teams to deliver features on time

## Project Experience

### Personal Portfolio Website | 2023
- Built responsive website using React and Node.js
- Implemented CI/CD pipeline with GitHub Actions
```

### `job_description.txt`
Target job description in plain text:

```
Position: Software Engineer
Company: Tech Corp
Location: Remote

Job Description:
We are looking for a talented software engineer...

Required Skills:
- Python
- JavaScript
- React
```

### `base_resume.tex`
LaTeX resume template with placeholders that the AI will fill.

## 🎨 Customization

### Modifying the Resume Template
Edit `base_resume.tex` to customize:
- Fonts and styling
- Section layout
- Color scheme
- Header format

### Adjusting AI Behavior
Modify the `system_prompt` in `main.py` to change:
- Bullet point count per experience type
- Content prioritization
- Formatting preferences
- Length constraints

## 🔒 Security & Privacy

- **API Key**: Store your Gemini API key as an environment variable
- **Local Processing**: All processing happens locally except AI generation
- **No Data Storage**: No personal data is stored or transmitted beyond the API call

## 🐛 Troubleshooting

### Common Issues

**"API key not found"**
- Ensure `GEMINI_API_KEY` is set: `export GEMINI_API_KEY="your-key"`
- Or embed the key directly in `main.py` (not recommended for production)

**"pdflatex failed"**
- Install LaTeX: `brew install --cask mactex` (macOS) or `sudo apt-get install texlive-full` (Linux)
- Check the `.log` file for specific LaTeX errors

**"Model not found"**
- Try different model names: `gemini-pro`, `gemini-1.5-flash`, etc.
- Check your API key permissions

**"File not found"**
- Ensure all required files exist: `base_resume.tex`, `full_experiences.md`, `job_description.txt`
- Run the setup script to create template files

### Getting Help

1. Check the [installation guide](install.md)
2. Review error messages in the terminal output
3. Check generated `.log` files for LaTeX errors
4. Verify your API key at [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/CV-Automate.git`
3. Create a feature branch: `git checkout -b feature-name`
4. Make your changes and test thoroughly
5. Commit your changes: `git commit -m "Add some feature"`
6. Push to the branch: `git push origin feature-name`
7. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for the AI capabilities
- [LaTeX](https://www.latex-project.org/) for professional document formatting
- The open-source community for inspiration and tools

## 📊 Project Stats

- **Language**: Python
- **AI Model**: Google Gemini
- **Output Format**: LaTeX → PDF
- **Platform**: Cross-platform (macOS, Linux, Windows)

---

**⭐ Star this repository if you find it helpful!**

**🐛 Found a bug?** [Open an issue](https://github.com/yourusername/CV-Automate/issues)

**💡 Have a suggestion?** [Start a discussion](https://github.com/yourusername/CV-Automate/discussions)
