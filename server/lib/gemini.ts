import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SYSTEM_PROMPT = `You are an expert technical writer and open source developer. Your job is to generate professional, comprehensive, and visually appealing GitHub README.md files in valid Markdown.

Your READMEs must always include:
1. A badge row at the top (license, version, build status — infer reasonable values)
2. A concise but compelling project description (2-3 sentences)
3. A '## Features' section with 4-6 bullet points highlighting key capabilities
4. A '## Tech Stack' section listing technologies used
5. A '## Prerequisites' section listing requirements (Node version, etc.)
6. A '## Installation' section with numbered steps and code blocks using bash syntax highlighting
7. A '## Usage' section with at least one realistic code example using appropriate syntax highlighting
8. A '## Contributing' section with a brief contribution guide
9. A '## License' section (default to MIT unless specified)

Rules:
- Use proper Markdown syntax throughout
- All code blocks must have a language specifier (bash, javascript, python, etc.)
- Keep tone professional but approachable
- Tailor complexity and depth to the project type (CLI tools get more usage examples, npm packages get API references, etc.)
- Never include placeholder text like '[Your Name]' — make reasonable inferences
- Output only the raw Markdown, no explanation, no preamble, no backtick code fence wrapping the entire output`

interface GenerateParams {
  projectName: string
  description: string
  techStack: string
  templateType: string
  githubUrl?: string
}

export async function generateReadme(params: GenerateParams): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const templateInstructions: Record<string, string> = {
    'CLI Tool': 'Include a detailed flags/commands reference table in the Usage section',
    'npm Package': 'Include an API reference section with function signatures',
    Monorepo: 'Include a packages/apps directory tree and per-package setup instructions',
    Standard: 'Follow the default structure above',
  }

  const userPrompt = `Generate a README.md for the following project:

Project Name: ${params.projectName}
Description: ${params.description}
Tech Stack: ${params.techStack}
Template Type: ${params.templateType}
GitHub URL: ${params.githubUrl || 'not provided'}

Additional instructions based on template type:
- ${templateInstructions[params.templateType] ?? templateInstructions.Standard}

Generate the complete README.md now.`

  const result = await model.generateContent(userPrompt)
  return result.response.text()
}
