
import { GoogleGenAI, Type } from "@google/genai";
import { MatchPrediction, BetSlip } from "./types";

// Safety check for API Key to avoid runtime crashes on misconfigured environments
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY missing in process.env. Ensure environment variables are set correctly.");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export async function generateDailyBetSlip(targetDate: string): Promise<BetSlip> {
  const ai = getAI();
  const prompt = `
    Atue como um analista de futebol especialista em apostas esportivas e CustomBet.
    Consulte os calendários de jogos de futebol para a data: ${targetDate}.
    
    Selecione os 14 jogos mais importantes do dia (priorize Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League, Europa League, Brasileirão Série A ou principais jogos internacionais).
    
    Para cada um dos 14 jogos, crie uma "CustomBet" combinando exatamente 2 mercados (ex: Vencedor + Total de Gols, Ambos Marcam + Handicap, etc).
    
    IMPORTANTE: Todos os textos, nomes de mercados, descrições e insights DEVEM estar obrigatoriamente em PORTUGUÊS do Brasil.
    Os mercados devem ser curtos e claros.
    
    Retorne os dados em JSON seguindo este esquema:
    - matches: array de objetos com {homeTeam, awayTeam, league, time, customBet: {market1, market2, description}, probability (0-100), insight}
    - totalOddsEstimate: uma estimativa de odd acumulada (ex: "250.00")
    - reliability: "Alta", "Média" ou "Baixa" baseada na força dos favoritos do dia.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  homeTeam: { type: Type.STRING },
                  awayTeam: { type: Type.STRING },
                  league: { type: Type.STRING },
                  time: { type: Type.STRING },
                  customBet: {
                    type: Type.OBJECT,
                    properties: {
                      market1: { type: Type.STRING },
                      market2: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ["market1", "market2", "description"]
                  },
                  probability: { type: Type.NUMBER },
                  insight: { type: Type.STRING }
                },
                required: ["homeTeam", "awayTeam", "league", "time", "customBet", "probability", "insight"]
              }
            },
            totalOddsEstimate: { type: Type.STRING },
            reliability: { type: Type.STRING }
          },
          required: ["matches", "totalOddsEstimate", "reliability"]
        }
      },
    });

    const data = JSON.parse(response.text || '{}');
    
    if (!data.matches) throw new Error("Invalid response format from AI");

    return {
      id: Math.random().toString(36).substr(2, 9),
      date: targetDate,
      matches: data.matches.map((m: any, idx: number) => ({ ...m, id: `m-${idx}` })),
      totalOddsEstimate: data.totalOddsEstimate,
      reliability: data.reliability as any
    };
  } catch (error) {
    console.error("Erro ao gerar ficha:", error);
    throw error;
  }
}
