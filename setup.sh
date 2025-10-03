#!/bin/bash

# CV-Automate Setup Script
# This script helps set up the CV automation environment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if we're on macOS
is_macos() {
    [[ "$OSTYPE" == "darwin"* ]]
}

# Function to check if we're on Linux
is_linux() {
    [[ "$OSTYPE" == "linux-gnu"* ]]
}

echo "=========================================="
echo "🚀 CV-Automate Setup Script"
echo "=========================================="

# Check Python installation
print_status "Checking Python installation..."
if command_exists python3; then
    PYTHON_VERSION=$(python3 --version 2>&1)
    print_success "Python found: $PYTHON_VERSION"
    PYTHON_CMD="python3"
elif command_exists python; then
    PYTHON_VERSION=$(python --version 2>&1)
    print_success "Python found: $PYTHON_VERSION"
    PYTHON_CMD="python"
else
    print_error "Python is not installed. Please install Python 3.7+ and try again."
    exit 1
fi

# Check pip installation
print_status "Checking pip installation..."
if command_exists pip3; then
    print_success "pip3 found"
    PIP_CMD="pip3"
elif command_exists pip; then
    print_success "pip found"
    PIP_CMD="pip"
else
    print_warning "pip not found. Installing pip..."
    curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
    $PYTHON_CMD get-pip.py
    rm get-pip.py
    PIP_CMD="pip"
fi

# Install Python dependencies
print_status "Installing Python dependencies..."
if [ -f "requirements.txt" ]; then
    $PIP_CMD install -r requirements.txt
    print_success "Python dependencies installed"
else
    print_warning "requirements.txt not found, installing google-generativeai directly..."
    $PIP_CMD install google-generativeai
    print_success "google-generativeai installed"
fi

# Check and install MacTeX (macOS only)
if is_macos; then
    print_status "Checking MacTeX installation..."
    if command_exists pdflatex; then
        print_success "MacTeX is already installed"
    else
        print_warning "MacTeX not found. Installing via Homebrew..."
        if command_exists brew; then
            brew install --cask mactex
            print_success "MacTeX installed via Homebrew"
            print_warning "You may need to restart your terminal or run: export PATH=\"/usr/local/texlive/2023/bin/universal-darwin:\$PATH\""
        else
            print_error "Homebrew not found. Please install MacTeX manually:"
            echo "1. Visit: https://www.tug.org/mactex/"
            echo "2. Download and install MacTeX"
            echo "3. Run this script again"
            exit 1
        fi
    fi
elif is_linux; then
    print_status "Checking LaTeX installation (Linux)..."
    if command_exists pdflatex; then
        print_success "LaTeX is already installed"
    else
        print_warning "LaTeX not found. Installing..."
        if command_exists apt-get; then
            sudo apt-get update
            sudo apt-get install -y texlive-full
        elif command_exists yum; then
            sudo yum install -y texlive
        elif command_exists dnf; then
            sudo dnf install -y texlive
        else
            print_error "Package manager not found. Please install LaTeX manually for your distribution."
            exit 1
        fi
        print_success "LaTeX installed"
    fi
else
    print_warning "Unsupported operating system. Please install LaTeX manually."
fi

# Check for required files
print_status "Checking for required files..."
REQUIRED_FILES=("base_resume.tex" "full_experiences.md" "job_description.txt")
MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "Found: $file"
    else
        print_warning "Missing: $file"
        MISSING_FILES+=("$file")
    fi
done

# Create missing files with templates
for file in "${MISSING_FILES[@]}"; do
    case $file in
        "job_description.txt")
            print_status "Creating template: $file"
            cat > "$file" << 'EOF'
# Job Description Template
# Paste the job description here

Position: Software Engineer
Company: Example Company
Location: Remote

Job Description:
We are looking for a talented software engineer to join our team...

Required Skills:
- Python
- JavaScript
- React
- Database experience

Responsibilities:
- Develop web applications
- Collaborate with cross-functional teams
- Write clean, maintainable code
EOF
            ;;
        "full_experiences.md")
            print_status "Creating template: $file"
            cat > "$file" << 'EOF'
# Your Full Experiences

## Work Experience

### Software Engineer | Company A | 2022-2024
- Led development of web application serving 10,000+ users
- Implemented REST APIs using Python and Django
- Collaborated with cross-functional teams to deliver features on time

### Junior Developer | Company B | 2020-2022
- Developed mobile applications using React Native
- Participated in agile development processes
- Contributed to code reviews and testing

## Project Experience

### Personal Portfolio Website | 2023
- Built responsive website using React and Node.js
- Implemented CI/CD pipeline with GitHub Actions
- Deployed on AWS with automatic scaling

### E-commerce Platform | 2022
- Created full-stack application with Django and PostgreSQL
- Integrated payment processing with Stripe
- Implemented user authentication and authorization
EOF
            ;;
    esac
done

# API Key setup
print_status "Setting up Gemini API key..."
echo ""
echo "🔑 Gemini API Key Setup"
echo "======================="
echo "To use this tool, you need a Gemini API key from Google AI Studio."
echo ""
echo "1. Visit: https://makersuite.google.com/app/apikey"
echo "2. Sign in with your Google account"
echo "3. Click 'Create API Key'"
echo "4. Copy the generated API key"
echo ""

# Ask user if they want to set up API key now
read -p "Do you have a Gemini API key ready to set up? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter your Gemini API key: " api_key
    if [ -n "$api_key" ]; then
        # Add to shell profile
        SHELL_PROFILE=""
        if [ -f "$HOME/.zshrc" ]; then
            SHELL_PROFILE="$HOME/.zshrc"
        elif [ -f "$HOME/.bashrc" ]; then
            SHELL_PROFILE="$HOME/.bashrc"
        elif [ -f "$HOME/.bash_profile" ]; then
            SHELL_PROFILE="$HOME/.bash_profile"
        fi
        
        if [ -n "$SHELL_PROFILE" ]; then
            echo "" >> "$SHELL_PROFILE"
            echo "# CV-Automate API Key" >> "$SHELL_PROFILE"
            echo "export GEMINI_API_KEY=\"$api_key\"" >> "$SHELL_PROFILE"
            print_success "API key added to $SHELL_PROFILE"
            print_warning "Please restart your terminal or run: source $SHELL_PROFILE"
        else
            print_warning "Could not find shell profile. Please manually add:"
            echo "export GEMINI_API_KEY=\"$api_key\""
        fi
    else
        print_warning "No API key provided. You'll need to set it manually later."
    fi
else
    print_warning "Skipping API key setup. You can set it later with:"
    echo "export GEMINI_API_KEY=\"your-api-key-here\""
fi

# Test the installation
print_status "Testing installation..."
if [ -f "main.py" ]; then
    print_success "main.py found"
    print_status "You can now run the CV automation with:"
    echo "  python main.py"
    echo ""
    echo "Optional arguments:"
    echo "  --job-description job_description.txt"
    echo "  --experiences full_experiences.md"
    echo "  --resume-template base_resume.tex"
    echo "  --output-tex resume.tex"
    echo "  --output-pdf resume.pdf"
else
    print_error "main.py not found. Please ensure you're in the correct directory."
fi

echo ""
echo "=========================================="
print_success "Setup completed!"
echo "=========================================="
echo ""
echo "📝 Next steps:"
echo "1. Edit the template files with your information:"
echo "   - job_description.txt (paste the job description)"
echo "   - full_experiences.md (add your experiences)"
echo "   - base_resume.tex (customize if needed)"
echo ""
echo "2. Set your API key (if not done during setup):"
echo "   export GEMINI_API_KEY=\"your-api-key-here\""
echo ""
echo "3. Run the automation:"
echo "   python main.py"
echo ""
echo "📖 For more information, see install.md"
echo "=========================================="
