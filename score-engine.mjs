export const WEIGHTS = {
  abs: 20,
  leadership: 20,
  climate: 15,
  turnover: 15,
  people: 10,
  onboarding: 8,
  communication: 5,
  structure: 5,
  governance: 2,
};

export const BEHAVIOR_SCALE = {
  1: 'Não ocorre ou há evidência contrária',
  2: 'Raro, informal ou apenas reativo',
  3: 'Ocorre de forma inconsistente',
  4: 'Frequente, estruturado e verificável',
  5: 'Consolidado, demonstrável e sustentado',
};

export function behaviorToHealth(value) {
  const safe = Math.max(1, Math.min(5, Number(value) || 1));
  return Math.round((safe - 1) * 25);
}

export function dimensionScore({ objective, perception, observation }) {
  const sources = [
    [Number(objective), .4],
    [Number(perception), .3],
    [Number(observation), .3],
  ].filter(([value]) => Number.isFinite(value));
  if (!sources.length) return null;
  const totalWeight = sources.reduce((sum, [, weight]) => sum + weight, 0);
  return Math.round(sources.reduce((sum, [value, weight]) => sum + value * weight, 0) / totalWeight);
}

export function convergence(values) {
  const usable = values.map(Number).filter(Number.isFinite);
  if (usable.length < 2) return { label: 'Insuficiente', score: 0, spread: null };
  const spread = Math.max(...usable) - Math.min(...usable);
  if (spread <= 15) return { label: 'Alta', score: 100, spread };
  if (spread <= 30) return { label: 'Moderada', score: 70, spread };
  return { label: 'Baixa', score: 35, spread };
}

export function hasCriticalDivergence(management, team, threshold = 30) {
  return Math.abs(Number(management) - Number(team)) >= threshold;
}

export function overallScore(dimensions, weights = WEIGHTS) {
  const entries = Object.entries(weights).filter(([key]) => Number.isFinite(Number(dimensions[key])));
  if (!entries.length) return null;
  const denominator = entries.reduce((sum, [, weight]) => sum + weight, 0);
  return Math.round(entries.reduce((sum, [key, weight]) => sum + Number(dimensions[key]) * weight, 0) / denominator);
}

export function healthBand(score) {
  if (score < 40) return 'Crítico';
  if (score < 60) return 'Alto risco';
  if (score < 75) return 'Atenção';
  return 'Saudável';
}

export function findingCriticality({ severity, frequency, breadth, urgency }) {
  const values = [severity, frequency, breadth, urgency].map(v => Math.max(1, Math.min(5, Number(v) || 1)));
  const score = Math.round(values.reduce((product, value) => product * value, 1) / 6.25);
  const label = score >= 65 ? 'Crítico' : score >= 40 ? 'Alto' : score >= 20 ? 'Atenção' : 'Baixo';
  return { score, label };
}

export function diagnosisConfidence({ evidenceCount, quality, convergenceScore }) {
  const quantity = Math.min(100, Math.max(0, Number(evidenceCount) * 12.5));
  const safeQuality = Math.max(0, Math.min(100, Number(quality) || 0));
  const safeConvergence = Math.max(0, Math.min(100, Number(convergenceScore) || 0));
  return Math.round(quantity * .3 + safeQuality * .4 + safeConvergence * .3);
}
