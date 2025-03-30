// Simple implementation of VADER (Valence Aware Dictionary and sEntiment Reasoner) 
// for sentiment analysis of ADR reports

interface SentimentResult {
  score: number;
  comparative: number;
  tokens: string[];
  positive: string[];
  negative: string[];
}

// Simplified lexicon for demo purposes
const lexicon: Record<string, number> = {
  // Negative terms related to adverse drug reactions
  "side effect": -2,
  "adverse effect": -3,
  "adverse reaction": -3,
  "complication": -2,
  "risk": -1,
  "dangerous": -3,
  "harmful": -3,
  "hazardous": -3,
  "toxic": -3,
  "fatal": -4,
  "lethal": -4,
  "death": -4,
  "died": -4,
  "killed": -4,
  "hospitalized": -3,
  "hospitalization": -3,
  "headache": -2,
  "pain": -2,
  "nausea": -2,
  "vomiting": -2,
  "dizziness": -2,
  "fatigue": -2,
  "insomnia": -2,
  "anxiety": -2,
  "depression": -2,
  "allergic": -2,
  "allergy": -2,
  "rash": -2,
  "itching": -2,
  "swelling": -2,
  "severe": -3,
  "serious": -3,
  "extreme": -3,
  "awful": -3,
  "terrible": -3,
  "horrible": -3,
  "bad": -2,
  "worse": -3,
  "worst": -4,
  "difficult": -2,
  "problem": -2,
  "issue": -1,
  "concern": -1,
  "worried": -2,
  "worry": -2,
  "fear": -2,
  "scared": -2,
  "scary": -2,
  "uncomfortable": -2,
  "discomfort": -2,
  "unbearable": -3,
  "intolerable": -3,
  "upset": -2,
  "sick": -2,
  "ill": -2,
  "warning": -1,
  "caution": -1,

  // Positive terms (less common in ADR reports)
  "effective": 2,
  "works": 2,
  "working": 2,
  "improved": 2,
  "better": 2,
  "good": 2,
  "great": 3,
  "excellent": 3,
  "safe": 2,
  "recommend": 2,
  "recommended": 2,
  "helpful": 2,
  "relieved": 2,
  "relief": 2,
  "benefit": 2,
  "beneficial": 2,
  "success": 3,
  "successful": 3,
  "improvement": 2,
  "tolerable": 1,
  "manageable": 1
};

// Intensifiers and modifiers
const modifiers: Record<string, number> = {
  "very": 1.5,
  "extremely": 2,
  "slightly": 0.5,
  "somewhat": 0.75,
  "really": 1.5,
  "incredibly": 2,
  "not": -1,
  "no": -1,
  "never": -1,
  "none": -1,
  "hardly": -0.75,
  "barely": -0.75
};

export async function analyzeAdrSentiment(text: string): Promise<SentimentResult> {
  // Normalize text
  text = text.toLowerCase();

  // Tokenize
  const tokens = text.split(/\s+/);

  let score = 0;
  const positive: string[] = [];
  const negative: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Check for modifiers
    let modifier = 1;
    if (i > 0 && modifiers[tokens[i - 1]]) {
      modifier = modifiers[tokens[i - 1]];
    }

    // Check lexicon for single words
    if (lexicon[token]) {
      const sentimentScore = lexicon[token] * modifier;
      score += sentimentScore;

      if (sentimentScore > 0) {
        positive.push(token);
      } else if (sentimentScore < 0) {
        negative.push(token);
      }
      continue;
    }

    // Check for bigrams (two-word phrases)
    if (i < tokens.length - 1) {
      const bigram = `${token} ${tokens[i + 1]}`;
      if (lexicon[bigram]) {
        const sentimentScore = lexicon[bigram] * modifier;
        score += sentimentScore;

        if (sentimentScore > 0) {
          positive.push(bigram);
        } else if (sentimentScore < 0) {
          negative.push(bigram);
        }
        i++; // Skip the next token as it's part of the bigram
      }
    }
  }

  // Normalize score to be between -1 and 1
  const comparative = tokens.length > 0 ? score / tokens.length : 0;

  return {
    score: Math.max(-1, Math.min(1, comparative)), // Clamp between -1 and 1
    comparative,
    tokens,
    positive,
    negative
  };
}


// VADER (Valence Aware Dictionary and sEntiment Reasoner) implementation
// Simplified version focused on medical terminology

const VADER_LEXICON: { [key: string]: number | undefined } = {
  // Medication-related terms
  'side effect': -2.0,
  'adverse': -2.0,
  'reaction': -1.5,
  'severe': -3.0,
  'mild': -1.0,
  'moderate': -2.0,
  'improved': 2.0,
  'better': 2.0,
  'worse': -2.0,
  'stopped': -1.0,
  'discontinued': -1.5,
  'effective': 2.0,
  'ineffective': -2.0,
  'pain': -2.0,
  'relief': 2.0,
  'dangerous': -3.0,
  'safe': 2.0,
  'concerning': -2.0,
  'death': -4.0,
  'hospitalization': -3.0,
  'emergency': -3.0,
  'resolved': 1.5,
  'persistent': -1.5,
  'chronic': -2.0,
  'fatal': -4.0,
};

export function analyzeVADER(text: string) {
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  let wordCount = 0;

  // Calculate base score
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    
    // Check for multi-word phrases first
    // Update the phrase check to handle undefined
    if (i < words.length - 1) {
      const phrase = `${word} ${words[i + 1]}`;
      const phraseScore = VADER_LEXICON[phrase];
      if (phraseScore !== undefined) {
        score += phraseScore;
        wordCount++;
        i++; // Skip next word as it's part of the phrase
        continue;
      }
    }
    
    // Check for single words
    if (VADER_LEXICON[word]) {
      score += VADER_LEXICON[word];
      wordCount++;
    }
  }

  // Normalize score between -1 and 1
  const normalizedScore = wordCount > 0 ? score / (wordCount * 4) : 0;

  // Calculate severity (1-5 scale)
  const severity = Math.min(5, Math.max(1, Math.abs(normalizedScore) * 5));

  // Determine sentiment
  let sentiment: 'negative' | 'neutral' | 'positive';
  if (normalizedScore < -0.05) {
    sentiment = 'negative';
  } else if (normalizedScore > 0.05) {
    sentiment = 'positive';
  } else {
    sentiment = 'neutral';
  }

  return {
    score: normalizedScore,
    sentiment,
    severity: Math.round(severity)
  };
}