export type Role = 'user' | 'instructor' | 'admin';

// =========================
// AI Wellness Assessment
// =========================

export type WellnessAssessmentRequest = {
  goals?: string;
  constraints?: string;
};

export type WellnessAssessmentResponse = {
  ok: true;
  assessment: {
    summary: string;
    inputs: WellnessAssessmentRequest;
  };
};

// =========================
// AI Workout Generator
// =========================

export type WorkoutGeneratorRequest = {
  fitnessLevel?: string;
  focus?: string;
  durationMinutes?: number;
};

export type WorkoutGeneratorResponse = {
  ok: true;
  workout: {
    title: string;
    inputs: WorkoutGeneratorRequest;
  };
};

// =========================
// AI Wellness Companion Chat
// =========================

export type WellnessCompanionChatRequest = {
  message?: string;
};

export type WellnessCompanionChatResponse = {
  ok: true;
  reply: {
    message: string;
  };
};


