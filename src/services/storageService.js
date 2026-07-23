const STORAGE_KEY = 'wf_vocab';

function createId(word) {
  const base = String(word || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}${base ? `-${base}` : ''}`;
}

function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map((tag) => String(tag).trim()).filter(Boolean);
  return String(tags)
    .split(/\s*,\s*/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function defaultWordFields(item = {}) {
  const now = new Date().toISOString();
  return {
    id: String(item.id || createId(item.word || 'word')),
    word: String(item.word || '').trim(),
    phonetic: String(item.phonetic || '--').trim(),
    translation: String(item.translation || '--').trim(),
    example: String(item.example || '').trim(),
    notes: String(item.notes || '').trim(),
    tags: normalizeTags(item.tags),
    createdAt: String(item.createdAt || now),
    updatedAt: String(item.updatedAt || now),
  };
}

const builtInWords = [
  defaultWordFields({
    word: 'regulate',
    phonetic: '/ˈreɡjuleɪt/',
    translation: 'to control or maintain by rule or regulation',
  }),
  defaultWordFields({
    word: 'relative',
    phonetic: '/ˈrelətɪv/',
    translation: 'considered in relation to something else',
  }),
  defaultWordFields({
    word: 'resilience',
    phonetic: '/rɪˈzɪliəns/',
    translation: 'the ability to recover quickly from difficulty',
  }),
  defaultWordFields({
    word: 'summation',
    phonetic: '/sʌˈmeɪʃən/',
    translation: 'the process of adding things together',
  }),
];

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const chr = line[i];

    if (chr === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (chr === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    current += chr;
  }

  values.push(current);
  return values;
}

function parseCsv(text) {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const words = [];

  for (const row of rows) {
    const columns = parseCsvLine(row);
    if (columns.length < 3) continue;
    const [word, phonetic, translation] = columns;
    if (!word.trim()) continue;
    words.push(defaultWordFields({ word, phonetic, translation }));
  }

  return words;
}

function loadVocabulary() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return builtInWords.slice();
  }

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return builtInWords.slice();
    }

    return parsed.map((item) => defaultWordFields(item)).filter((item) => item.word.length > 0);
  } catch (error) {
    return builtInWords.slice();
  }
}

function saveVocabulary(words) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}

export { loadVocabulary, saveVocabulary, parseCsv, defaultWordFields };
