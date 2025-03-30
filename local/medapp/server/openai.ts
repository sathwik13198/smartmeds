import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function generateChatResponse(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "I'm sorry, there was an error processing your request. Please try again later.";
  }
}

export async function getAppointmentSummary(appointments: any[]): Promise<string> {
  try {
    const appointmentsText = appointments.map(app => 
      `Patient: ${app.patientName}, Time: ${app.time}, Reason: ${app.reason}`
    ).join("\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant for doctors. Summarize the following appointments concisely, highlighting any important details or patterns."
        },
        {
          role: "user",
          content: `Please summarize these appointments for today:\n${appointmentsText}`
        }
      ],
      temperature: 0.5,
      max_tokens: 300,
    });

    return response.choices[0].message.content || "No summary available.";
  } catch (error) {
    console.error("Error generating appointment summary:", error);
    return "Unable to generate appointment summary at this time.";
  }
}

export async function getMedicineRecommendations(medication: string): Promise<{
  apps: { name: string, url: string }[],
  alternatives: string[],
  information: string
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a medical assistant providing information about medications and where to purchase them. Provide a JSON response with recommended apps, alternative medications, and general information."
        },
        {
          role: "user",
          content: `Provide information about ${medication} including where to purchase it and possible alternatives.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const content = response.choices[0].message.content;
    const result = JSON.parse(content || "{}");
    
    return {
      apps: result.apps || [],
      alternatives: result.alternatives || [],
      information: result.information || ""
    };
  } catch (error) {
    console.error("Error generating medicine recommendations:", error);
    return {
      apps: [
        { name: "PharmEasy", url: "https://pharmeasy.in/" },
        { name: "1mg", url: "https://www.1mg.com/" }
      ],
      alternatives: ["Generic alternatives not available"],
      information: "Unable to retrieve detailed information at this time."
    };
  }
}

export async function analyzeADRSentiment(text: string): Promise<{
  sentiment: "positive" | "negative" | "neutral";
  severity: number;
  summary: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an AI that analyzes adverse drug reaction reports. Rate the sentiment (positive/negative/neutral), severity (1-5), and provide a brief summary."
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    const result = JSON.parse(content || "{}");
    
    return {
      sentiment: result.sentiment || "neutral",
      severity: Number(result.severity) || 1,
      summary: result.summary || "No summary available."
    };
  } catch (error) {
    console.error("Error analyzing ADR sentiment:", error);
    return {
      sentiment: "neutral",
      severity: 1,
      summary: "Unable to analyze sentiment."
    };
  }
}
