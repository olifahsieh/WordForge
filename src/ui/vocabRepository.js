const STORAGE_KEY = 'wf_vocab';

const builtInWords = [
  {word:'regulate', phonetic:'/ˈreɡjuleɪt/', translation:'to control or maintain by rule or regulation'},
  {word:'relative', phonetic:'/ˈrelətɪv/', translation:'considered in relation to something else'},
  {word:'resilience', phonetic:'/rɪˈzɪliəns/', translation:'the ability to recover quickly from difficulty'},
  {word:'summation', phonetic:'/sʌˈmeɪʃən/', translation:'the process of adding things together'}
];

function parseCsv(text) {
  const rows = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const words = [];

  for (const row of rows) {
    const columns = parseCsvLine(row);
    if (columns.length < 3) continue;
    const [word, phonetic, translation] = columns;
    if (!word.trim()) continue;
    words.push({
      word: word.trim(),
      phonetic: phonetic.trim() || '--',
      translation: translation.trim() || '--'
    });
  }

  return words;
}

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

    return parsed.map(item => ({
      word: String(item.word || '').trim(),
      phonetic: String(item.phonetic || '--').trim(),
      translation: String(item.translation || '--').trim()
    })).filter(item => item.word.length > 0);
  } catch (error) {
    return builtInWords.slice();
  }
}

function saveVocabulary(words) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}

export { loadVocabulary, saveVocabulary, parseCsv, builtInWords };
