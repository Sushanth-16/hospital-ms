const triageRules = [
  {
    specialization: "Dermatology",
    keywords: ["rash", "itch", "itching", "skin", "acne", "pimple", "eczema", "allergy", "spots"]
  },
  {
    specialization: "Cardiology",
    keywords: ["chest pain", "palpitation", "heart", "breath", "breathing", "pressure", "bp", "swelling"]
  },
  {
    specialization: "Neurology",
    keywords: ["headache", "migraine", "seizure", "numbness", "dizziness", "memory", "nerve", "tingling"]
  },
  {
    specialization: "Orthopedics",
    keywords: ["bone", "joint", "knee", "back pain", "fracture", "sprain", "shoulder", "neck pain"]
  },
  {
    specialization: "Gastroenterology",
    keywords: ["stomach", "abdominal", "vomiting", "diarrhea", "constipation", "acidity", "gas", "indigestion"]
  },
  {
    specialization: "Endocrinology",
    keywords: ["diabetes", "thyroid", "sugar", "hormone", "weight gain", "fatigue", "insulin"]
  },
  {
    specialization: "Pediatrics",
    keywords: ["child", "baby", "infant", "kid", "newborn", "growth", "vaccination"]
  },
  {
    specialization: "Psychiatry",
    keywords: ["anxiety", "depression", "stress", "panic", "sleep", "insomnia", "mood", "fear"]
  },
  {
    specialization: "Oncology",
    keywords: ["lump", "tumor", "cancer", "bleeding", "mass", "unexplained weight loss"]
  },
  {
    specialization: "General Medicine",
    keywords: ["fever", "cold", "cough", "infection", "weakness", "body pain", "tired", "viral"]
  }
];

const normalizeText = (value) => value.toLowerCase().replace(/[^a-z0-9\s]/g, " ");

export function analyzeSymptoms(symptoms) {
  const normalizedSymptoms = normalizeText(symptoms || "").trim();

  if (!normalizedSymptoms) {
    return null;
  }

  const rankedMatches = triageRules
    .map((rule) => {
      const matches = rule.keywords.filter((keyword) => normalizedSymptoms.includes(keyword));

      return {
        specialization: rule.specialization,
        matchCount: matches.length,
        matchedKeywords: matches
      };
    })
    .filter((rule) => rule.matchCount > 0)
    .sort((first, second) => second.matchCount - first.matchCount);

  if (!rankedMatches.length) {
    return {
      specialization: "General Medicine",
      confidence: "Low",
      explanation: "The symptoms are broad, so General Medicine is the safest first step.",
      alternatives: []
    };
  }

  const [bestMatch, ...otherMatches] = rankedMatches;
  const confidence =
    bestMatch.matchCount >= 3 ? "High" : bestMatch.matchCount === 2 ? "Medium" : "Low";

  return {
    specialization: bestMatch.specialization,
    confidence,
    explanation: `Matched symptoms: ${bestMatch.matchedKeywords.join(", ")}.`,
    alternatives: otherMatches.slice(0, 2).map((rule) => rule.specialization)
  };
}
