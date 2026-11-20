import { NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const goals = body.goals || 'Strength & Conditioning';
    const constraints: string[] = body.constraints || [];
    const sleepQuality = Number(body.sleepQuality) || 75;
    const frequency = body.frequency || '3';

    let recommendations: string[] = [];
    let summary = `Neural wellness assessment complete for ${frequency} sessions/week protocol.`;
    let readinessScore = Math.min(98, Math.max(55, Math.round(sleepQuality * 0.8 + 20)));

    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `You are the chief sports scientist at E-fitness, an elite neural training and athletic performance institute.
Evaluate the following athlete intake data:
- Primary Goals: "${goals}"
- Physical Constraints / Sensitivities: ${constraints.length > 0 ? constraints.join(', ') : 'None reported'}
- Sleep Quality Score: ${sleepQuality}%
- Weekly Training Commitment: ${frequency} days/week

Return a concise JSON object with:
{
  "summary": "1-2 sentences summarizing their neurological readiness and focus",
  "readinessScore": number between 50 and 99,
  "recommendations": [
    "4 high-impact, biomechanically rigorous, specific bullet points for training, recovery, and nutrition"
  ]
}
Return ONLY valid JSON with no markdown wrapping.`;

        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text?.trim();
        if (text) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) {
            recommendations = parsed.recommendations;
          }
          if (parsed.summary) summary = parsed.summary;
          if (parsed.readinessScore) readinessScore = parsed.readinessScore;
        }
      } catch (err) {
        console.warn('Gemini API call failed, using deterministic protocol heuristics:', err);
      }
    }

    if (recommendations.length === 0) {
      recommendations = [
        `Targeted adaptation protocol aligned with: "${goals}".`,
        ...(constraints.length > 0
          ? constraints.map((c: string) => `Targeted mobility & stabilization drills for ${c}.`)
          : ['Full range-of-motion eccentric loading to reinforce joint resilience and tendon stiffness.']),
        `Recovery baseline: Target ${Math.max(7, Math.round((100 - sleepQuality) / 15 + 7))} hours restorative sleep based on your ${sleepQuality}% score.`,
        `Nutritional synthesis: high-bioavailability protein (2.0g/kg bodyweight daily) and 35ml water per kg bodyweight.`,
      ];
    }

    return NextResponse.json({
      ok: true,
      assessment: {
        summary,
        readinessScore,
        inputs: body,
      },
      readinessScore,
      recommendations,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to process wellness assessment' },
      { status: 500 }
    );
  }
}
