import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface CompanyResearchData {
  name: string;
  summary: string;
  growthPredictions: {
    period: string;
    prediction: string;
    confidence: number;
  }[];
  patents: {
    title: string;
    number: string;
    date: string;
    summary: string;
  }[];
  hiringTrends: {
    trend: string;
    details: string;
    roles: string[];
  };
  employeeReviews: {
    platform: string;
    rating: number | null;
    summary: string;
    recentReviews: {
      text: string;
      date: string;
    }[];
    pros: string[];
    cons: string[];
    found: boolean;
  }[];
  keyMetrics: {
    label: string;
    value: string;
    change?: string;
  }[];
  competitors: {
    name: string;
    description: string;
    advantage: string;
  }[];
  pressCoverage: {
    title: string;
    date: string;
    source: string;
    url: string;
    summary: string;
  }[];
  sources: {
    title: string;
    url: string;
  }[];
}

export async function researchCompany(companyName: string): Promise<companyresearchdata> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Research the company "${companyName}". 
    
    Specifically, find the average Glassdoor rating (e.g., "1.8 out of 5") and recent employee reviews. 
    Provide a comprehensive analysis in the requested JSON format.`,
    config: {
      systemInstruction: `You are a professional corporate intelligence analyst. 
      Your goal is to provide consistent, accurate, and data-driven research on companies.
      
      CRITICAL INSTRUCTIONS FOR EMPLOYEE SENTIMENT:
      1. Distinguish between actual employee reviews and "Questions & Answers". Only report data from verified review sections.
      2. If a platform like Indeed only has Q&A and no reviews, set "found" to false for that platform.
      3. Do NOT sugarcoat sentiment. If reviews are predominantly negative, the "summary", "pros", and "cons" MUST reflect that reality.
      4. For Glassdoor, you MUST find the current overall rating (e.g., 1.8/5, 3.2/5). Look for the "X.X out of 5" pattern.
      5. CRITICAL: DO NOT default to 5.0 if you cannot find a rating. If no clear average rating is found, set "rating" to null.
      6. If the rating is low (e.g., below 3.0), investigate the specific reasons for dissatisfaction (e.g., management, work-life balance) and include them in the "cons" and "summary".
      7. MANDATORY KEY METRICS: You MUST provide exactly 5 key metrics in the "keyMetrics" array with these labels: "Total Funding", "Employee Count", "Estimated Total Revenue", "Industry", and "Products". If data is unavailable for any, use "N/A" or "Private" as the value.
      8. COMPETITORS: Identify 3-5 direct competitors. For each, provide a brief description and the company's competitive advantage over them.
      9. PRESS COVERAGE: Find 3-5 recent (last 12 months) press releases or major news articles about the company. Provide titles, dates, sources, URLs, and a one-sentence summary for each.
      10. Report the most recent and verifiable data available.`,
      tools: [{ googleSearch: {} }],
      temperature: 0,
      seed: 42,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          summary: { type: Type.STRING },
          growthPredictions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                period: { type: Type.STRING },
                prediction: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
              },
              required: ["period", "prediction", "confidence"],
            },
          },
          patents: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                number: { type: Type.STRING },
                date: { type: Type.STRING },
                summary: { type: Type.STRING },
              },
              required: ["title", "number", "date", "summary"],
            },
          },
          hiringTrends: {
            type: Type.OBJECT,
            properties: {
              trend: { type: Type.STRING },
              details: { type: Type.STRING },
              roles: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["trend", "details", "roles"],
          },
          employeeReviews: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                rating: { type: Type.NUMBER, nullable: true },
                summary: { type: Type.STRING },
                recentReviews: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      date: { type: Type.STRING },
                    },
                    required: ["text", "date"],
                  },
                },
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                found: { type: Type.BOOLEAN },
              },
              required: ["platform", "summary", "recentReviews", "pros", "cons", "found"],
            },
          },
          keyMetrics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.STRING },
                change: { type: Type.STRING },
              },
              required: ["label", "value"],
            },
          },
          competitors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                advantage: { type: Type.STRING },
              },
              required: ["name", "description", "advantage"],
            },
          },
          pressCoverage: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                date: { type: Type.STRING },
                source: { type: Type.STRING },
                url: { type: Type.STRING },
                summary: { type: Type.STRING },
              },
              required: ["title", "date", "source", "url", "summary"],
            },
          },
          sources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                url: { type: Type.STRING },
              },
              required: ["title", "url"],
            },
          },
        },
        required: ["name", "summary", "growthPredictions", "patents", "hiringTrends", "employeeReviews", "keyMetrics", "sources"],
      },
    },
  });

  try {
    const text = response.text || "";
    const cleanJson = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    const data = JSON.parse(cleanJson || "{}");
    
    // Ensure required arrays exist to prevent UI crashes
    const validatedData: CompanyResearchData = {
      name: data.name || "Unknown Company",
      summary: data.summary || "No summary available.",
      growthPredictions: Array.isArray(data.growthPredictions) ? data.growthPredictions : [],
      patents: Array.isArray(data.patents) ? data.patents : [],
      hiringTrends: data.hiringTrends || { trend: "Unknown", details: "No details available.", roles: [] },
      employeeReviews: Array.isArray(data.employeeReviews) ? data.employeeReviews.map((r: any) => ({
        ...r,
        recentReviews: Array.isArray(r.recentReviews) ? r.recentReviews : []
      })) : [],
      keyMetrics: Array.isArray(data.keyMetrics) ? data.keyMetrics : [],
      competitors: Array.isArray(data.competitors) ? data.competitors : [],
      pressCoverage: Array.isArray(data.pressCoverage) ? data.pressCoverage : [],
      sources: Array.isArray(data.sources) ? data.sources : []
    };
    
    // Supplement with grounding metadata if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && validatedData.sources.length === 0) {
      validatedData.sources = groundingChunks
        .filter(chunk => chunk.web)
        .map(chunk => ({
          title: chunk.web?.title || "Source",
          url: chunk.web?.uri || ""
        }));
    }
    
    return validatedData;
  } catch (e) {
    console.error("Failed to parse company research data", e);
    throw new Error("Failed to analyze company data. The AI response was invalid. Please try again.");
  }
}
