// Pure appearance rules. The browser bundle includes this exact source.
export const STAGES = ['low', 'medium', 'high', 'xhigh', 'max'];
export function normalizeEffort(value) {
  if (typeof value !== 'string') return null;
  const id = value.trim().toLowerCase().replace(/[\s_-]+/g, '');
  if (['off', 'none', 'minimal', 'min', 'low'].includes(id)) return 'low';
  if (id === 'medium') return 'medium';
  if (id === 'high') return 'high';
  if (['xhigh', 'extrahigh'].includes(id)) return 'xhigh';
  if (['max', 'maximum'].includes(id)) return 'max';
  return null;
}
export const CHARACTERS = ['dragon', 'claude', 'deepseek'];
export function resolveCharacter(model, setting = 'auto') {
  if (CHARACTERS.includes(setting)) return setting;
  const id = typeof model === 'string' ? model : '';
  return /(?:^|[/:\s-])claude/i.test(id) ? 'claude' : /(?:^|[/:\s-])deepseek/i.test(id) ? 'deepseek' : 'dragon';
}
export const DEFAULT_SETTINGS = Object.freeze({
  name: '', character: 'auto', followModels: ['gpt*', 'o1*', 'o3*', 'o4*', 'claude*', 'deepseek*'], illustrations: {},
  width: 220, visible: true, showCaption: true, stage: 'auto', divineGlow: true,
});
export function splitPatterns(text) {
  if (typeof text !== 'string') return [];
  return [...new Set(text.split(/[,，;；\n\r\s]+/).map(p => p.trim()).filter(Boolean))].slice(0, 100);
}
export function safeIllustration(value) {
  if (typeof value !== 'string') return '';
  const text = value.trim();
  if (/^data:image\/(?:png|jpeg|webp|gif);base64,[a-z0-9+/=\r\n]+$/i.test(text)) return text;
  try {
    const url = new URL(text);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : '';
  } catch { return ''; }
}
export function normalizeSettings(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) raw = {};
  const illustrations = {};
  for (const stage of STAGES) illustrations[stage] = safeIllustration(raw.illustrations?.[stage]);
  return {
    name: typeof raw.name === 'string' ? raw.name.trim().slice(0, 80) : '',
    character: raw.character === 'auto' || CHARACTERS.includes(raw.character) ? raw.character : 'auto',
    followModels: Array.isArray(raw.followModels) ? raw.followModels.filter(p => typeof p === 'string').map(p => p.trim()).filter(Boolean).slice(0, 100) : [...DEFAULT_SETTINGS.followModels],
    illustrations,
    width: Number.isFinite(raw.width) ? Math.min(420, Math.max(140, raw.width)) : DEFAULT_SETTINGS.width,
    visible: raw.visible !== false, showCaption: raw.showCaption !== false,
    stage: STAGES.includes(raw.stage) ? raw.stage : 'auto', divineGlow: raw.divineGlow !== false,
  };
}
export function matchesFollowModel(selection, patterns = DEFAULT_SETTINGS.followModels) {
  if (!selection?.model) return false;
  const model = selection.model;
  const provider = selection.provider ?? '';
  return patterns.some(pattern => {
    if (typeof pattern !== 'string' || !pattern.trim()) return false;
    const text = pattern.trim();
    const source = text.split('*').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
    const match = new RegExp(`^${source}$`, 'i');
    return match.test(model) || match.test(`${provider}/${model}`) ||
      (!text.includes('/') && match.test(model.split(/[/:]/).at(-1)));
  });
}
export function resolveAppearance(projection, catalog, preview = null, settings = DEFAULT_SETTINGS) {
  const selection = projection?.next ?? catalog?.default ?? null;
  const model = selection?.model ?? '';
  const group = catalog?.groups?.find(item => item.id === selection?.provider);
  const metadata = group?.models?.find(item => item.id === model);
  const effort = selection?.reasoningEffort ?? metadata?.reasoning?.defaultEffort ?? null;
  const gpt = matchesFollowModel(selection, settings?.followModels ?? DEFAULT_SETTINGS.followModels);
  const normalized = normalizeEffort(effort);
  const previewStage = STAGES.includes(preview) ? preview : STAGES.includes(settings.stage) ? settings.stage : null;
  return {
    character: resolveCharacter(model, settings?.character),
    stage: previewStage ?? (gpt && normalized ? normalized : 'low'),
    effort, model, provider: selection?.provider ?? '', gpt,
    preview: previewStage !== null,
    mode: previewStage ? 'preview' : !selection ? 'waiting' : !gpt ? 'otherModel' : normalized ? 'following' : 'default',
  };
}
export function safeAssetStage(pathname) {
  const match = /^\/dragon-maid-pet\/assets\/(low|medium|high|xhigh|max)$/.exec(pathname);
  return match?.[1] ?? null;
}
