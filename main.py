from google import genai
import os
import logging
import time
# Configure logging
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)


system_prompt = """
You are an expert resume assistant that transforms a person’s full experience into a concise, tailored LaTeX resume for a specific job.

You are given three inputs:
1. A base LaTeX resume template (`base_resume.tex`).
2. A Markdown file of the candidate’s complete experiences (`full_experiences.md`).
3. A job description.

Your task is to generate a `.tex` file that:
- Preserves the overall formatting and structure of `base_resume.tex`.
- Selects and tailors only the most relevant experiences from `full_experiences.md` according to the job description.
- For each **Work or Research Experience**, output exactly **3 concise bullet points** summarizing the most impactful, job-relevant accomplishments.
- For each **Project Experience**, output exactly **2 concise bullet points**.
- The final content must fit on a **single one-page PDF** (avoid redundancy, trim wordiness, prioritize relevance).
- Keep technical detail and metrics where relevant (impact, improvements, performance gains).
- Do not invent experiences or skills not present in the input files, but you may rephrase and condense.
- Maintain consistent tense, formatting, and LaTeX syntax so that the `.tex` compiles successfully.

Output only the full `.tex` file content, ready to be compiled with `pdflatex`.
Do not include explanations or extra commentary.
"""

def clean_latex_output(output: str) -> str:
    text = output.strip()
    if text.startswith("```"):
        # remove ```latex ... ```
        text = text.split("```")[1] if "```" in text else text
        text = text.replace("latex\n", "").replace("latex\r\n", "")
    return text.strip()

if __name__ == "__main__":
    # arguments to be passed to the model
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", type=str, default="gemini-pro")
    parser.add_argument("--job-description", type=str, default="job_description.txt")
    parser.add_argument("--experiences", type=str, default="full_experiences.md")
    parser.add_argument("--resume-template", type=str, default="base_resume.tex")
    parser.add_argument("--output-tex", type=str, default="resume.tex")
    parser.add_argument("--output-pdf", type=str, default="resume.pdf")
    args = parser.parse_args()
    
    # if output_text or pdf exists, add a timestamp to the file name
    if os.path.exists(args.output_tex):
        args.output_tex = f"{args.output_tex.split('.')[0]}_{time.time()}.tex"
    if os.path.exists(args.output_pdf):
        args.output_pdf = f"{args.output_pdf.split('.')[0]}_{time.time()}.pdf"
    
    # read the job description file
    with open(args.job_description, "r") as f:
        job_description = f.read()
    
    # read the experiences file
    with open(args.experiences, "r") as f:
        experiences = f.read()
    
    # read the resume template
    with open(args.resume_template, "r") as f:
        resume_template = f.read()
    
    # prompt the model
    prompt = f"{system_prompt}\n\nJob description: {job_description}\n\nExperiences: {experiences}\n\nResume template: {resume_template}"
    
    try:
        client = genai.Client()
        response = client.models.generate_content(
            model="gemini-2.5-pro", contents=prompt
        )
        logger.info(response.text)
        clean_text = clean_latex_output(response.text)
        # write the response to a file
        with open(args.output_tex, "w") as f:
            f.write(clean_text)
    except Exception as e:
        logger.error(f"❌ Error calling Gemini API: {e}")
        logger.info("Please check your API key and internet connection.")
        exit(1)
        
    # compile the resume
    exit_code = os.system(f"pdflatex -interaction=nonstopmode {args.output_tex}")
    if exit_code != 0:
        logger.error("⚠️ pdflatex failed. Check the .log file for errors.")
        
    logger.info(f"✅ Resume generated successfully. View it at: {args.output_pdf}")
    
    