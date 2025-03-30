import { InsertAdrReport } from "@shared/schema";
import { analyzeVADER } from "./lib/vader";

// Mock Twitter data to simulate real-time ADR monitoring
const twitterADRData = [
  "Been taking Lisinopril for 2 weeks and can't stop coughing. Anyone else experience this? #medication #sideeffects",
  "My doctor just switched me from Lisinopril to Losartan because of the cough. Much better now! #medication",
  "Day 3 on Atorvastatin and my muscles are so sore I can barely move #statins #sideeffects",
  "PSA: If you're on Metformin and experiencing stomach issues, try taking it with food. Helped me a lot! #diabetes #medication",
  "Just started Lisinopril and I'm feeling dizzy all the time. Is this normal? #hypertension #medication #help",
  "Anyone else get a metallic taste with Metformin? It's driving me crazy #diabetes #sideeffects",
  "Lisinopril is giving me the worst headaches. Calling my doctor tomorrow. #bloodpressure #medication",
  "Two months on Atorvastatin and my cholesterol numbers look great! No side effects at all #statins #heartHealth",
  "The dry cough from Lisinopril is unbearable. Waking up my whole family at night. #sideeffects #needHelp",
  "Finally found an antibiotic that doesn't upset my stomach! #medication #relief"
];

// Mock FDA data
const fdaADRData = [
  "Patient reported severe muscle pain and weakness after 4 weeks of Atorvastatin 40mg daily. Discontinued use.",
  "Multiple reports of persistent dry cough associated with Lisinopril, leading to medication switches in approximately 15% of patients.",
  "Reports of lactic acidosis in elderly patients taking Metformin with renal insufficiency. Monitoring recommended.",
  "Patient developed angioedema after first dose of Lisinopril. Required emergency treatment.",
  "Increased reports of myalgia with higher doses of Atorvastatin (40-80mg). Consider dose reduction if symptoms persist."
];

export async function getTwitterADRData(limit: number = 5): Promise<InsertAdrReport[]> {
  // In a real implementation, this would connect to Twitter API
  const randomSample = [...twitterADRData]
    .sort(() => 0.5 - Math.random())
    .slice(0, limit);
    
  const reports: InsertAdrReport[] = [];
  
  for (const tweet of randomSample) {
    // Determine which medication the tweet is referring to
    let medicationId = "1"; // Default to Atorvastatin
    if (tweet.toLowerCase().includes('lisinopril')) {
      medicationId = "2";
    } else if (tweet.toLowerCase().includes('metformin')) {
      medicationId = "3";
    }
    
    // Analyze the sentiment of the tweet
    const analysis = analyzeVADER(tweet);
    
    reports.push({
      medicationId,
      source: "Twitter",
      description: tweet,
      severity: analysis.severity,
      sentiment: analysis.sentiment
    });
  }
  
  return reports;
}

export async function getFDAADRData(limit: number = 3): Promise<InsertAdrReport[]> {
  // In a real implementation, this would connect to FDA API or dataset
  const randomSample = [...fdaADRData]
    .sort(() => 0.5 - Math.random())
    .slice(0, limit);
    
  const reports: InsertAdrReport[] = [];
  
  for (const report of randomSample) {
    // Determine which medication the report is referring to
    let medicationId = "1"; // Default to Atorvastatin
    if (report.toLowerCase().includes('lisinopril')) {
      medicationId = "2";
    } else if (report.toLowerCase().includes('metformin')) {
      medicationId = "3";
    }
    
    // Analyze the sentiment and severity
    const analysis = analyzeVADER(report);
    
    reports.push({
      medicationId,
      source: "FDA",
      description: report,
      severity: analysis.severity,
      sentiment: analysis.sentiment
    });
  }
  
  return reports;
}

export function getADRStatistics(adrReports: any[]): {
  topMedicationId: string;
  topMedicationName: string;
  topMedicationCount: number;
  commonSideEffect: string;
  commonSideEffectCount: number;
  increaseRate: number;
  totalReports: number;
  severityDistribution: Record<number, number>;
  sourceCounts: Record<string, number>;
  recentTrends: Array<{date: string, count: number}>;
} {
  // Group reports by medication
  const medicationCounts = new Map<string, number>();
  const medicationNames = new Map<string, string>([
    ["1", "Atorvastatin"],
    ["2", "Lisinopril"],
    ["3", "Metformin"]
  ]);
  
  // Count side effects (simplified for this mock implementation)
  const sideEffectCounts = new Map<string, number>();
  const sideEffects = [
    "cough", "muscle pain", "dizziness", "headache", 
    "fatigue", "nausea", "stomach issues", "metallic taste"
  ];
  
  for (const report of adrReports) {
    // Count by medication
    const medId = report.medicationId;
    medicationCounts.set(medId, (medicationCounts.get(medId) || 0) + 1);
    
    // Count side effects mentioned in the description
    for (const effect of sideEffects) {
      if (report.description.toLowerCase().includes(effect)) {
        sideEffectCounts.set(effect, (sideEffectCounts.get(effect) || 0) + 1);
      }
    }
  }
  
  // Find top medication
  let topMedicationId = "1";
  let topMedicationCount = 0;
  
  for (const [id, count] of Array.from(medicationCounts.entries())) {
    if (count > topMedicationCount) {
      topMedicationId = id;
      topMedicationCount = count;
    }
  }
  
  // Find most common side effect
  let commonSideEffect = "Unknown";
  let commonSideEffectCount = 0;
  
  for (const [effect, count] of Array.from(sideEffectCounts.entries())) {
    if (count > commonSideEffectCount) {
      commonSideEffect = effect;
      commonSideEffectCount = count;
    }
  }
  
  // Calculate severity distribution
  const severityDistribution: Record<number, number> = {};
  for (const report of adrReports) {
    severityDistribution[report.severity] = (severityDistribution[report.severity] || 0) + 1;
  }

  // Calculate source counts
  const sourceCounts: Record<string, number> = {};
  for (const report of adrReports) {
    sourceCounts[report.source] = (sourceCounts[report.source] || 0) + 1;
  }

  // Calculate recent trends (last 7 days)
  const recentTrends: Array<{date: string, count: number}> = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const count = adrReports.filter(r => r.reportDate.startsWith(dateStr)).length;
    recentTrends.push({ date: dateStr, count });
  }

  return {
    topMedicationId,
    topMedicationName: medicationNames.get(topMedicationId) || "Unknown",
    topMedicationCount,
    commonSideEffect: commonSideEffect.charAt(0).toUpperCase() + commonSideEffect.slice(1),
    commonSideEffectCount,
    increaseRate: Math.floor(Math.random() * 20) + 10, // Mocked increase rate between 10% and 30%
    totalReports: adrReports.length,
    severityDistribution,
    sourceCounts,
    recentTrends
  };

}
