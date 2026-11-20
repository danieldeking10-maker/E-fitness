export type EventCategory = 'Strength' | 'Conditioning' | 'Recovery';

export interface EventExercise {
  name: string;
  focus: string;
  sets: number;
  reps: number | string;
  load: string;
  rest: string;
  cue: string;
  img: string;
}

export interface FitnessEvent {
  id: string;
  slideNum: string;
  title: string;
  subtitle: string;
  category: EventCategory;
  venue: string;
  schedule: string;
  durationMinutes: number;
  intensity: string;
  coach: string;
  img: string;
  overview: string;
  coachNotes: string;
  exercises: EventExercise[];
}

export const FITNESS_EVENTS: FitnessEvent[] = [
  {
    id: 'powerlifting-force-combine',
    slideNum: '01',
    title: 'Barbell Force & Deadlift Combine',
    subtitle: 'Peak CNS Recruitment',
    category: 'Strength',
    venue: 'Lab Floor 01 · Chicago',
    schedule: 'Thu · 18:00 CST',
    durationMinutes: 60,
    intensity: 'RPE 8.5–9',
    coach: 'Marcus Thorne, MS',
    img: '/images/hero_athlete_training_1790903677189.jpg',
    overview:
      'High-threshold motor unit recruitment centered around velocity-tracked pulling mechanics, heavy axial loading, and spinal bracing under progressive competition cadence.',
    coachNotes:
      'Focus on bar speed off the floor. Take full 150-second recoveries between heavy top sets to preserve crisp CNS output.',
    exercises: [
      {
        name: 'Competition Conventional Deadlift',
        focus: 'Posterior Chain & Maximal Force',
        sets: 4,
        reps: 4,
        load: '82.5% 1RM',
        rest: '150s',
        cue: 'Pull slack out of the bar before wedging hips in; push the floor away evenly.',
        img: '/images/workout_deadlift_biomechanics_1790903711478.jpg',
      },
      {
        name: 'Paused Barbell Back Squat',
        focus: 'Quads & Bottom-Position Bracing',
        sets: 3,
        reps: 5,
        load: '75% 1RM',
        rest: '120s',
        cue: 'Hold 2 full seconds in the hole without losing lumbar neutrality.',
        img: '/images/workout_squat_technique_1790903690484.jpg',
      },
      {
        name: 'Pendlay Barbell Row',
        focus: 'Upper Back & Scapular Lock',
        sets: 4,
        reps: 6,
        load: 'RPE 8',
        rest: '90s',
        cue: 'Reset completely on the floor every rep; drive elbows to back pockets.',
        img: '/images/hero_athlete_training_1790903677189.jpg',
      },
      {
        name: 'Weighted Dead-Bug Brace',
        focus: 'Intra-Abdominal Pressure',
        sets: 3,
        reps: 10,
        load: 'Controlled',
        rest: '60s',
        cue: 'Keep lower ribs pinned down through a slow 4-second exhale.',
        img: '/images/athlete_recovery_biometrics_1790903721681.jpg',
      },
    ],
  },
  {
    id: 'neural-squat-clinic',
    slideNum: '02',
    title: 'Morning Squat & Power Clinic',
    subtitle: 'Explosive Lower-Body Drive',
    category: 'Strength',
    venue: 'Performance Bay · Austin',
    schedule: 'Sat · 08:30 CST',
    durationMinutes: 45,
    intensity: 'RPE 8',
    coach: 'Sarah Chen, CSCS',
    img: '/images/workout_squat_technique_1790903690484.jpg',
    overview:
      'Barbell biomechanics clinic pairing tempo squat work with ballistic contrast jumps to elevate rate of force development and knee-tracking stability.',
    coachNotes:
      'Control the 3-second lowering phase and explode vertically out of the transition while maintaining midfoot balance.',
    exercises: [
      {
        name: 'Tempo High-Bar Back Squat',
        focus: 'Quads & Ankle Dorsiflexion',
        sets: 4,
        reps: 6,
        load: '72.5% 1RM',
        rest: '120s',
        cue: 'Track knees smoothly over second toe; 3-1-X-0 tempo cadence.',
        img: '/images/workout_squat_technique_1790903690484.jpg',
      },
      {
        name: 'Trap-Bar Countermovement Jump',
        focus: 'Rate of Force Development',
        sets: 4,
        reps: 4,
        load: '25% BW',
        rest: '90s',
        cue: 'Triple extend rapidly through ankles, knees, and hips; land softly.',
        img: '/images/hero_athlete_training_1790903677189.jpg',
      },
      {
        name: 'Bulgarian Split Squat',
        focus: 'Unilateral Quad & Glute Stability',
        sets: 3,
        reps: 8,
        load: 'RPE 8',
        rest: '75s',
        cue: 'Maintain upright shin angle and steady pelvis across all reps.',
        img: '/images/workout_split_squat_1790903700979.jpg',
      },
      {
        name: 'Tibialis & Soleus Isometric Hold',
        focus: 'Patellar Tendon Resilience',
        sets: 3,
        reps: '30s',
        load: 'Bodyweight',
        rest: '45s',
        cue: 'Breathe steadily while holding peak midfoot tension.',
        img: '/images/athlete_recovery_biometrics_1790903721681.jpg',
      },
    ],
  },
  {
    id: 'unilateral-kinetic-sprint',
    slideNum: '03',
    title: 'Kinetic Balance & Hypertrophy',
    subtitle: 'Unilateral Metabolic Output',
    category: 'Conditioning',
    venue: 'Turf Arena · New York',
    schedule: 'Tue · 19:00 EST',
    durationMinutes: 50,
    intensity: 'RPE 8.5',
    coach: 'Devon Brooks, ATC',
    img: '/images/workout_split_squat_1790903700979.jpg',
    overview:
      'Asymmetric strength and conditioning session eliminating left-to-right force deficits while sustaining elevated aerobic-glycolytic power output.',
    coachNotes:
      'Start every unilateral set with your non-dominant leg and match exact rep quality on the dominant side.',
    exercises: [
      {
        name: 'Front-Foot Elevated Split Squat',
        focus: 'VMO & Hip Flexor Mobility',
        sets: 4,
        reps: 10,
        load: 'RPE 8',
        rest: '75s',
        cue: 'Drive forward knee gently past toes while keeping full heel contact.',
        img: '/images/workout_split_squat_1790903700979.jpg',
      },
      {
        name: 'Single-Arm Kettlebell Clean & Press',
        focus: 'Rotational Core & Shoulder Power',
        sets: 4,
        reps: 8,
        load: 'RPE 8',
        rest: '60s',
        cue: 'Snap hips forward on the clean; stack bicep cleanly beside ear overhead.',
        img: '/images/hero_athlete_training_1790903677189.jpg',
      },
      {
        name: 'Sled Push Sprint Intervals',
        focus: 'Alactic-Aerobic Capacity',
        sets: 6,
        reps: '25m',
        load: 'Heavy',
        rest: '60s',
        cue: '45-degree torso lean with rapid piston-like stride frequency.',
        img: '/images/workout_squat_technique_1790903690484.jpg',
      },
      {
        name: 'Pallof Anti-Rotation Press',
        focus: 'Lateral Oblique Stabilization',
        sets: 3,
        reps: 12,
        load: 'Moderate',
        rest: '45s',
        cue: 'Resist lateral cable pull; keep sternum centered over pelvis.',
        img: '/images/athlete_recovery_biometrics_1790903721681.jpg',
      },
    ],
  },
  {
    id: 'posterior-chain-summit',
    slideNum: '04',
    title: 'Posterior Hinge & Sprint Prep',
    subtitle: 'Hamstring & Glute Armor',
    category: 'Conditioning',
    venue: 'Track Studio · Seattle',
    schedule: 'Sun · 10:00 PST',
    durationMinutes: 45,
    intensity: 'RPE 7.5',
    coach: 'Elena Morales, CSCS',
    img: '/images/workout_deadlift_biomechanics_1790903711478.jpg',
    overview:
      'Precision hip-hinge biomechanics engineered for sprinters and field athletes seeking eccentric hamstring durability and explosive hip extension.',
    coachNotes:
      'Keep the barbell shaved along the thighs during Romanian Deadlifts and stop descending the moment hip flexion finishes.',
    exercises: [
      {
        name: 'Romanian Deadlift (RDL)',
        focus: 'Eccentric Hamstring Lengthening',
        sets: 4,
        reps: 8,
        load: 'RPE 7.5',
        rest: '90s',
        cue: 'Slide hips horizontally toward the back wall; pack lats firmly.',
        img: '/images/workout_deadlift_biomechanics_1790903711478.jpg',
      },
      {
        name: 'Single-Leg Hip Thrust',
        focus: 'Peak Glute Max Extension',
        sets: 3,
        reps: 12,
        load: 'RPE 8',
        rest: '60s',
        cue: 'Tuck chin slightly and pause 1 second at full hip lockout.',
        img: '/images/workout_split_squat_1790903700979.jpg',
      },
      {
        name: 'Nordic Hamstring Eccentric',
        focus: 'Knee-Flexor Tendon Capacity',
        sets: 3,
        reps: 5,
        load: 'Bodyweight',
        rest: '90s',
        cue: 'Lower torso as one rigid plank for a slow 4-second count.',
        img: '/images/hero_athlete_training_1790903677189.jpg',
      },
      {
        name: 'Assault Bike Threshold Flush',
        focus: 'Lactate Clearance',
        sets: 4,
        reps: '45s',
        load: '80% Effort',
        rest: '45s',
        cue: 'Maintain rhythmic nasal-to-mouth breathing cadence.',
        img: '/images/athlete_recovery_biometrics_1790903721681.jpg',
      },
    ],
  },
  {
    id: 'autonomic-recovery-lab',
    slideNum: '05',
    title: 'Autonomic Flow & HRV Reset',
    subtitle: 'CNS & Parasympathetic Calibration',
    category: 'Recovery',
    venue: 'Recovery Suite · Live Stream',
    schedule: 'Daily · 20:30 EST',
    durationMinutes: 30,
    intensity: 'RPE 4',
    coach: 'Elara Vance, PhD',
    img: '/images/athlete_recovery_biometrics_1790903721681.jpg',
    overview:
      'Evening parasympathetic down-regulation protocol utilizing zone-zero articular mobility, thoracic decompression, and extended-exhale breathwork to raise nocturnal HRV.',
    coachNotes:
      'Keep muscular effort effortless—this session is designed to lower resting heart rate and prepare slow-wave sleep architecture.',
    exercises: [
      {
        name: '90/90 Hip Capsule Rotations',
        focus: 'Pelvic & Hip Joint Lubrication',
        sets: 3,
        reps: 8,
        load: 'Bodyweight',
        rest: '30s',
        cue: 'Move slowly from the deep hip rotators without lumbar rounding.',
        img: '/images/athlete_recovery_biometrics_1790903721681.jpg',
      },
      {
        name: 'Thoracic Open-Book Rotation',
        focus: 'Upper Spine Extension & Rib Mobility',
        sets: 3,
        reps: 8,
        load: 'Bodyweight',
        rest: '30s',
        cue: 'Exhale deeply as the top shoulder opens toward the floor.',
        img: '/images/workout_split_squat_1790903700979.jpg',
      },
      {
        name: 'Copenhagen Adductor Isometric',
        focus: 'Groin & Pelvis Integrity',
        sets: 2,
        reps: '20s',
        load: 'Low Effort',
        rest: '45s',
        cue: 'Hold steady alignment without breath-holding.',
        img: '/images/workout_squat_technique_1790903690484.jpg',
      },
      {
        name: '4-7-8 Diaphragmatic Down-Regulation',
        focus: 'Vagal Tone & Sleep Priming',
        sets: 5,
        reps: 'Cycles',
        load: 'Zone 0',
        rest: '0s',
        cue: 'Expand lower lateral ribs 360 degrees on each nasal inhale.',
        img: '/images/athlete_recovery_biometrics_1790903721681.jpg',
      },
    ],
  },
];
