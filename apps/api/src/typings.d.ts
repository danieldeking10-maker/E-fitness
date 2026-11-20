declare module '@e-fitness/shared' {
  export interface WellnessAssessmentRequest {
    goals?: string;
    constraints?: string[];
    sleepQuality?: number;
    frequency?: string;
  }
  export interface WellnessAssessmentResponse {
    ok: boolean;
    assessment: {
      summary: string;
      inputs: any;
    };
    recommendations?: string[];
  }
  export interface WorkoutGeneratorRequest {
    fitnessLevel?: string;
    focus?: string;
    durationMinutes?: number;
  }
  export interface WorkoutGeneratorResponse {
    ok: boolean;
    workout: {
      title: string;
      inputs?: any;
      focus?: string;
      duration?: number | string;
      exercises?: any[];
      coachNotes?: string;
    };
  }
  export interface WellnessCompanionChatRequest {
    message?: string;
  }
  export interface WellnessCompanionChatResponse {
    ok: boolean;
    reply: {
      message?: string;
    } | string;
  }
}
