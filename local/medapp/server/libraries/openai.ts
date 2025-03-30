import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Wrapper around OpenAI API for the chatbot functionality
export async function getAiChatResponse(message: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful medical assistant. Provide accurate, professional medical information while emphasizing the importance of consulting healthcare providers for specific medical advice. Focus on general health education, medication information, and appointment scheduling assistance."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content || "I apologize, but I'm unable to provide a response at the moment. Please try again.";

  } catch (error) {
    console.error("Error getting AI response:", error);
    return "I'm sorry, I encountered an issue processing your request. Please try again later.";
  }
}
