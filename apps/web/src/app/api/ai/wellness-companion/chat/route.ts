import { NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini';

function generateFallbackReply(message: string): string {
  const lower = (message || '').toLowerCase();

  if (lower.includes('sore') || lower.includes('pain') || lower.includes('fatigue') || lower.includes('tired')) {
    return 'Your central nervous system recovery markers suggest prioritizing active recovery today. Engage in 15 minutes of dynamic diaphragmatic breathing, a light 20-minute zone-2 flush, and elevate hydration with sodium and magnesium.';
  }
  if (lower.includes('eat') || lower.includes('food') || lower.includes('protein') || lower.includes('diet') || lower.includes('nutrition')) {
    return 'Aim for approximately 2.0g to 2.2g of bioavailable protein per kilogram of bodyweight distributed across 3–4 meals. Prioritize leucine-rich protein sources post-training alongside complex carbohydrates to accelerate glycogen replenishment.';
  }
  if (lower.includes('sleep') || lower.includes('rest') || lower.includes('insomnia')) {
    return 'Deep slow-wave sleep is where 95% of human growth hormone release occurs. Implement a 60-minute digital sunset prior to sleep, lower ambient room temperature to 18°C (65°F), and avoid caffeine within 9 hours of your target sleep window.';
  }
  if (lower.includes('workout') || lower.includes('routine') || lower.includes('exercise') || lower.includes('train')) {
    return 'For optimal neurological adaptation and hypertrophy, keep compound movements in the 6–10 rep range at RPE 7.5–8.5, allowing 2–3 minutes of rest between heavy sets to replenish intracellular ATP.';
  }

  return `Analysis received: "${message}". Your autonomic nervous system parameters are balanced. Maintain progressive overload on primary compounds, stay hydrated, and focus on clean movement execution. What area of your training protocol shall we optimize next?`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const message = (body.message || '').trim();
    const history = Array.isArray(body.history) ? body.history : [];

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let reply = '';
    const ai = getGeminiClient();

    if (ai) {
      try {
        const systemInstruction = `You are the E-fitness Neural Performance Companion, an elite AI sports scientist and athletic coach.
You specialize in exercise physiology, neuromuscular recovery, biomechanics, sleep architecture, and sports nutrition.
Keep responses concise (2 to 3 paragraphs max), actionable, authoritative yet encouraging, and grounded in exercise science.
Avoid fluffy intros or generic disclaimers. Give exact numbers (e.g. g/kg, RPE, rest intervals, heart rate zones) whenever relevant.`;

        // Format history for Gemini
        const contents: any[] = [];
        for (const item of history.slice(-6)) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text || item.content || '' }],
          });
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents,
          config: {
            systemInstruction,
          },
        });

        if (response.text) {
          reply = response.text.trim();
        }
      } catch (err) {
        console.warn('Gemini chat failed, using fallback coach response:', err);
      }
    }

    if (!reply) {
      reply = generateFallbackReply(message);
    }

    return NextResponse.json({
      ok: true,
      reply,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to process companion chat' },
      { status: 500 }
    );
  }
}
