import { NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini';

const WORKOUT_IMAGES = [
  '/images/workout_squat_technique_1790903690484.jpg',
  '/images/workout_split_squat_1790903700979.jpg',
  '/images/workout_deadlift_biomechanics_1790903711478.jpg',
  '/images/athlete_recovery_biometrics_1790903721681.jpg',
  '/images/hero_athlete_training_1790903677189.jpg',
];

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const fitnessLevel = body.fitnessLevel || 'Advanced';
    const focus = body.focus || 'Strength';
    const duration = Number(body.durationMinutes) || 45;

    let workoutTitle = `${focus} Neural Protocol [${fitnessLevel}]`;
    let coachNotes = `Neural efficiency calibrated for ${fitnessLevel} tier. Maintain a 3-second eccentric tempo on compound movements to maximize mechanical tension and fiber recruitment.`;
    let exercises: any[] = [];

    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `You are a high-performance strength coach at E-fitness.
Create a structured workout session with these specifications:
- Fitness Level: ${fitnessLevel}
- Training Focus: ${focus}
- Duration: ${duration} minutes

Return a JSON object with:
{
  "title": "Short punchy protocol title",
  "coachNotes": "2-3 sentences of biomechanical guidance and neural pacing notes",
  "exercises": [
    {
      "name": "Exercise Name",
      "focus": "Target muscle / movement pattern",
      "sets": number (e.g. 3 or 4),
      "reps": number or string (e.g. 8 or "10-12"),
      "load": "Load or RPE guidance (e.g. '75% 1RM' or 'RPE 8')",
      "rest": "Rest duration in seconds (e.g. '90s' or '120s')",
      "cue": "A critical execution technique cue"
    }
  ]
}
Include between 4 and 5 exercises suitable for ${duration} minutes. Return ONLY valid JSON with no markdown formatting.`;

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
          if (parsed.title) workoutTitle = parsed.title;
          if (parsed.coachNotes) coachNotes = parsed.coachNotes;
          if (Array.isArray(parsed.exercises) && parsed.exercises.length > 0) {
            exercises = parsed.exercises.map((ex: any, idx: number) => ({
              ...ex,
              img: WORKOUT_IMAGES[idx % WORKOUT_IMAGES.length],
            }));
          }
        }
      } catch (err) {
        console.warn('Gemini workout generation failed, using sports science fallbacks:', err);
      }
    }

    if (exercises.length === 0) {
      exercises = [
        {
          name: focus === 'Conditioning' ? 'Barbell Thrusters' : 'Barbell Back Squat',
          focus: 'Compound Lower & Core Force',
          sets: 4,
          reps: 8,
          load: '75% 1RM',
          rest: '120s',
          cue: 'Drive heels through the floor, keeping thoracic spine locked.',
          img: WORKOUT_IMAGES[0],
        },
        {
          name: 'Bulgarian Split Squat',
          focus: 'Unilateral Force Production',
          sets: 3,
          reps: 10,
          load: 'RPE 8',
          rest: '90s',
          cue: 'Maintain slight forward torso lean to maximize glute activation.',
          img: WORKOUT_IMAGES[1],
        },
        {
          name: 'Romanian Deadlift',
          focus: 'Posterior Kinetic Chain',
          sets: 3,
          reps: 10,
          load: 'RPE 7.5',
          rest: '90s',
          cue: 'Hinge hips backward until hamstring tension peaks; keep lats packed.',
          img: WORKOUT_IMAGES[2],
        },
        {
          name: 'Rotational Cable Woodchopper & Pallof Hold',
          focus: 'Anti-Rotational Trunk Stability',
          sets: 3,
          reps: 12,
          load: 'Moderate Controlled',
          rest: '60s',
          cue: 'Lock pelvis square; drive rotation entirely through upper torso.',
          img: WORKOUT_IMAGES[3],
        },
      ];
    }

    return NextResponse.json({
      ok: true,
      workout: {
        title: workoutTitle,
        focus,
        duration,
        coachNotes,
        exercises,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to generate workout' },
      { status: 500 }
    );
  }
}
