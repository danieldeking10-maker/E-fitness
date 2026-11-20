'use client';

export interface AthleteProfile {
  name: string;
  email: string;
  goals: string;
  constraints: string[];
  sleepQuality: number;
  frequency: string;
  readinessScore: number;
  lastAssessmentDate?: string;
  completedWorkoutsCount: number;
  registeredEventIds?: string[];
  activeWorkoutPlan?: any;
}

const STORAGE_KEY = 'efitness_athlete_profile';

const DEFAULT_PROFILE: AthleteProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera@e-fitness.io',
  goals: 'Increase deadlift 1RM, maintain sub-12% body fat, and improve tendon resilience',
  constraints: ['Knee Sensitivity'],
  sleepQuality: 82,
  frequency: '4',
  readinessScore: 86,
  lastAssessmentDate: new Date().toLocaleDateString(),
  completedWorkoutsCount: 14,
  registeredEventIds: ['powerlifting-force-combine', 'autonomic-recovery-lab'],
};

export function getAthleteProfile(): AthleteProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveAthleteProfile(updates: Partial<AthleteProfile>): AthleteProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const current = getAthleteProfile();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('athlete_profile_updated'));
    return updated;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function toggleEventRegistration(eventId: string): AthleteProfile {
  const current = getAthleteProfile();
  const existing = current.registeredEventIds || [];
  const next = existing.includes(eventId)
    ? existing.filter((id) => id !== eventId)
    : [...existing, eventId];
  return saveAthleteProfile({ registeredEventIds: next });
}
