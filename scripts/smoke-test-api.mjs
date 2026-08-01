/**
 * Smoke test for the E-fitness API.
 *
 * Usage:
 *   node scripts/smoke-test-api.mjs
 *   API_BASE_URL=http://localhost:4000 node scripts/smoke-test-api.mjs
 */

const DEFAULT_BASE_URLS = [
  'http://127.0.0.1:4000',
  'http://localhost:4000',
  'http://127.0.0.1:3001',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://localhost:3000',
];

const API_BASE_URL = process.env.API_BASE_URL?.trim() || '';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function requestJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 4000);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    return { status: res.status, ok: res.ok, data };
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`Request timed out for ${url}`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

async function postJson(url, body, timeoutMs = 4000) {
  return requestJson(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    timeoutMs,
  });
}

async function getJson(url, timeoutMs = 4000) {
  return requestJson(url, { method: 'GET', timeoutMs });
}

async function withRetry(fn, tries = 5, delayMs = 500) {
  let lastErr;
  for (let i = 0; i < tries; i += 1) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < tries - 1) {
        await sleep(delayMs);
      }
    }
  }
  throw lastErr;
}

async function detectApiBaseUrl() {
  if (API_BASE_URL) {
    return API_BASE_URL.replace(/\/$/, '');
  }

  for (const baseUrl of DEFAULT_BASE_URLS) {
    try {
      const health = await withRetry(() => getJson(`${baseUrl}/health`), 2, 250);
      if (health.ok) {
        return baseUrl.replace(/\/$/, '');
      }
    } catch {
      // Try the next candidate URL.
    }
  }

  return 'http://localhost:4000';
}

async function main() {
  console.log('FitMind Hub API smoke test');
  const baseUrl = await detectApiBaseUrl();
  console.log(`API_BASE_URL=${baseUrl}`);
  console.log('');

  await sleep(300);

  const health = await withRetry(() => getJson(`${baseUrl}/health`), 6, 500);
  console.log('GET /health ->', health.status, health.ok ? 'OK' : 'FAIL');
  if (health.data) console.log('response:', health.data);
  console.log('');

  const wellnessAssessment = await postJson(`${baseUrl}/ai/wellness-assessment`, {
    goals: 'Lose 5kg fat and improve running stamina',
    constraints: ['Knee Sensitivity'],
  });
  console.log(
    'POST /ai/wellness-assessment ->',
    wellnessAssessment.status,
    wellnessAssessment.ok ? 'OK' : 'FAIL'
  );
  if (wellnessAssessment.data) console.log('response:', wellnessAssessment.data);
  console.log('');

  const workoutGenerator = await postJson(`${baseUrl}/ai/workout-generator`, {
    fitnessLevel: 'Intermediate',
    focus: 'Hypertrophy',
    durationMinutes: 45,
  });
  console.log(
    'POST /ai/workout-generator ->',
    workoutGenerator.status,
    workoutGenerator.ok ? 'OK' : 'FAIL'
  );
  if (workoutGenerator.data) console.log('response:', workoutGenerator.data);
  console.log('');

  const wellnessCompanionChat = await postJson(`${baseUrl}/ai/wellness-companion/chat`, {
    message: 'How should I adjust today’s workout if I feel fatigued?',
  });
  console.log(
    'POST /ai/wellness-companion/chat ->',
    wellnessCompanionChat.status,
    wellnessCompanionChat.ok ? 'OK' : 'FAIL'
  );
  if (wellnessCompanionChat.data) console.log('response:', wellnessCompanionChat.data);
  console.log('');

  const allOk = health.ok && wellnessAssessment.ok && workoutGenerator.ok && wellnessCompanionChat.ok;
  console.log(`Smoke test result: ${allOk ? 'PASS' : 'FAIL'}`);

  process.exit(allOk ? 0 : 1);
}

if (typeof fetch !== 'function') {
  console.error('Global fetch is not available. Use Node 18+ or add a fetch polyfill.');
  process.exit(2);
}

main().catch((err) => {
  console.error('Smoke test crashed:', err);
  process.exit(1);
});

