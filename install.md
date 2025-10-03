# How To Install

## Quick Setup (Recommended)

### For macOS/Linux:
```bash
chmod +x setup.sh
./setup.sh
```

### For Windows:
```batch
setup.bat
```

The setup scripts will automatically:
- Check for Python and install dependencies
- Install LaTeX (MacTeX on macOS, TeX Live on Linux)
- Create template files if missing
- Guide you through API key setup

## Manual Installation

### Install MacTeX (macOS)
```
brew install --cask mactex
```

### Install LaTeX (Linux)
```bash
# Ubuntu/Debian
sudo apt-get install texlive-full

# CentOS/RHEL/Fedora
sudo yum install texlive  # or sudo dnf install texlive
```

### Install LaTeX (Windows)
Download and install either:
- [MiKTeX](https://miktex.org/download)
- [TeX Live](https://www.tug.org/texlive/windows.html)

### Install Python Dependencies
```
pip install -r requirements.txt
```

### Set up Gemini API Key
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Set it as an environment variable:

**macOS/Linux:**
```bash
export GEMINI_API_KEY="your-api-key-here"
```

**Windows:**
```batch
set GEMINI_API_KEY=your-api-key-here
```

**Or add it permanently to your shell profile:**

**macOS/Linux (.zshrc, .bashrc, etc.):**
```bash
echo 'export GEMINI_API_KEY="your-api-key-here"' >> ~/.zshrc
source ~/.zshrc
```

**Windows (Environment Variables):**
Add `GEMINI_API_KEY` through System Properties → Environment Variables
