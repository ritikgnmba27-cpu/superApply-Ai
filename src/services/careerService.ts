import { GoogleGenAI, Type } from "@google/genai";

const GEMINI_MODEL = "gemini-3.1-pro-preview";

export interface JobMatch {
  jobTitle: string;
  companyName: string;
  matchScore: number;
  matchRank: "Perfect Job" | "Good Match" | "Moderate Match" | "Low Match";
  location: string;
  jobType: string;
  summary: string;
  requiredSkills: {
    primary: string[];
    secondary: string[];
    technical: string[];
    soft: string[];
    tools: string[];
  };
  missingKeywords: string[];
  resumeAnalysis: string;
  recommendedUpdates: string[];
  optimizedResume: string;
  coverLetter: string;
  applyInstructions: string;
  searchLinks: {
    platform: string;
    link: string;
  }[];
}

export interface AnalysisResult {
  topJobMatches: JobMatch[];
  skillCertificationRecommendations: string[];
}

export class CareerService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async analyzeJobAndResume(
    resumeText: string,
    jobDescription: string,
    targetRole: string,
    location: string,
    experienceLevel: string,
    techStack: string
  ): Promise<AnalysisResult> {
    const prompt = `
      You are a "Super Job Finder & Auto-Apply Agent".
      
      User Info:
      - Target Role: ${targetRole}
      - Experience Level: ${experienceLevel}
      - Tech Stack: ${techStack}
      - Preferred Location: ${location}
      
      User Resume:
      ${resumeText}
      
      Target Job Description (if provided):
      ${jobDescription}
      
      Task:
      1. Analyze the job description (or generate potential matches based on target role if JD is sparse).
      2. Extract Primary, Secondary, ATS, HR, Technical, and Soft skills.
      3. Rank matches: 90-100% (Perfect Job), 70-89% (Good Match), 50-69% (Moderate Match), <50% (Low Match).
      4. Identify missing keywords, achievements, and measurable metrics in the resume.
      5. Provide an ATS-optimized version of the resume and a personalized cover letter for the top match.
      6. Generate optimized search links for LinkedIn, Naukri, Indeed, and JobSearch.
      
      Return the response in JSON format matching the following schema.
    `;

    const response = await this.ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topJobMatches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  jobTitle: { type: Type.STRING },
                  companyName: { type: Type.STRING },
                  matchScore: { type: Type.NUMBER },
                  matchRank: { type: Type.STRING, enum: ["Perfect Job", "Good Match", "Moderate Match", "Low Match"] },
                  location: { type: Type.STRING },
                  jobType: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  requiredSkills: {
                    type: Type.OBJECT,
                    properties: {
                      primary: { type: Type.ARRAY, items: { type: Type.STRING } },
                      secondary: { type: Type.ARRAY, items: { type: Type.STRING } },
                      technical: { type: Type.ARRAY, items: { type: Type.STRING } },
                      soft: { type: Type.ARRAY, items: { type: Type.STRING } },
                      tools: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["primary", "secondary", "technical", "soft", "tools"]
                  },
                  missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  resumeAnalysis: { type: Type.STRING },
                  recommendedUpdates: { type: Type.ARRAY, items: { type: Type.STRING } },
                  optimizedResume: { type: Type.STRING, description: "A full rewritten ATS-optimized resume text" },
                  coverLetter: { type: Type.STRING, description: "A personalized cover letter" },
                  applyInstructions: { type: Type.STRING },
                  searchLinks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        platform: { type: Type.STRING },
                        link: { type: Type.STRING }
                      },
                      required: ["platform", "link"]
                    }
                  }
                },
                required: [
                  "jobTitle", "companyName", "matchScore", "matchRank", "location", 
                  "jobType", "summary", "requiredSkills", "missingKeywords", 
                  "resumeAnalysis", "recommendedUpdates", "optimizedResume", 
                  "coverLetter", "applyInstructions", "searchLinks"
                ]
              }
            },
            skillCertificationRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["topJobMatches", "skillCertificationRecommendations"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  }
}
