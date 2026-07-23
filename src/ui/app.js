import { loadVocabulary, saveVocabulary, parseCsv } from '../services/storageService.js';
import { getDueWords, markAgain, markHard, markGood, markEasy } from '../core/reviewEngine.js';

let vocabulary = loadVocabulary();
let dueWords = getDueWords();
let index = 0;
let selectedWordId = vocabulary.length ? vocabulary[0].id : null;

const el = {
  word: document.getElementById('word'),
  phonetic: document.getElementById('phonetic'),
  translation: document.getElementById('translation'),
  card: document.getElementById('card'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  progressFill: document.getElementById('progressFill'),
  progressText: document.getElementById('progressText'),
  todaySummary: document.getElementById('today-summary'),
  feedback: document.getElementById('reviewFeedback'),
  ratingButtons: Array.from(document.querySelectorAll('.review-actions [data-rating]')),
  importBtn: document.getElementById('importBtn'),
  csvInput: document.getElementById('csvInput'),
  studyViewBtn: document.getElementById('studyViewBtn'),
  vocabViewBtn: document.getElementById('vocabViewBtn'),
  studyPanel: document.getElementById('studyPanel'),
  vocabPanel: document.getElementById('vocabPanel'),
  addWordBtn: document.getElementById('addWordBtn'),
  vocabSearch: document.getElementById('vocabSearch'),
  vocabList: document.getElementById('vocabList'),
  editorWord: document.getElementById('editorWord'),
  pronounceWordBtn: document.getElementById('pronounceWordBtn'),
  lookupStatus: document.getElementById('lookupStatus'),
  editorPhonetic: document.getElementById('editorPhonetic'),
  editorTranslation: document.getElementById('editorTranslation'),
  editorExample: document.getElementById('editorExample'),
  editorNotes: document.getElementById('editorNotes'),
  editorTags: document.getElementById('editorTags'),
  editorCreated: document.getElementById('editorCreated'),
  editorUpdated: document.getElementById('editorUpdated'),
  saveWordBtn: document.getElementById('saveWordBtn'),
  deleteWordBtn: document.getElementById('deleteWordBtn'),
  workspaceFeedback: document.getElementById('workspaceFeedback')
};

function createUniqueId() {
  return `word-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
}

function switchView(view) {
  const showStudy = view === 'study';
  el.studyPanel.classList.toggle('hidden', !showStudy);
  el.vocabPanel.classList.toggle('hidden', showStudy);
  el.studyViewBtn.classList.toggle('active', showStudy);
  el.vocabViewBtn.classList.toggle('active', !showStudy);
}

function updateStats() {
  const dueCount = dueWords.length;
  el.todaySummary.textContent = `${dueCount} words due today`;
  el.progressText.textContent = `${dueCount ? index + 1 : 0} / ${dueCount} reviewed`;
  el.progressFill.style.width = `${dueCount ? ((index + 1) / dueCount) * 100 : 0}%`;
}

function renderCard() {
  if (!dueWords.length) {
    el.word.textContent = 'No words due';
    el.phonetic.textContent = '';
    el.translation.textContent = 'Import a CSV or wait for review items to become due.';
    el.card.classList.remove('flipped');
    updateStats();
    return;
  }

  const word = dueWords[index];
  el.word.textContent = word.word;
  el.phonetic.textContent = word.phonetic;
  el.translation.textContent = word.translation;
  el.card.classList.remove('flipped');
  updateStats();
}

function showFeedback(message, variant = 'info') {
  el.feedback.textContent = message;
  el.feedback.dataset.variant = variant;
  if (message) {
    window.clearTimeout(el.feedback.cleanupId);
    el.feedback.cleanupId = window.setTimeout(() => {
      el.feedback.textContent = '';
    }, 2800);
  }
}

function showWorkspaceFeedback(message, variant = 'info') {
  el.workspaceFeedback.textContent = message;
  el.workspaceFeedback.dataset.variant = variant;
  if (message) {
    window.clearTimeout(el.workspaceFeedback.cleanupId);
    el.workspaceFeedback.cleanupId = window.setTimeout(() => {
      el.workspaceFeedback.textContent = '';
    }, 2800);
  }
}

function rateCard(rating) {
  if (!dueWords.length) return;
  const card = dueWords[index];
  if (!card || !card.id) return;

  if (rating === 'again') markAgain(card.id);
  else if (rating === 'hard') markHard(card.id);
  else if (rating === 'good') markGood(card.id);
  else if (rating === 'easy') markEasy(card.id);

  refreshDueWords();
  if (index >= dueWords.length) index = 0;
  renderCard();
}

const lookupCache = { word: '', audioUrl: '' };

function isBlankOrPlaceholder(value) {
  const trimmed = String(value || '').trim();
  return trimmed === '' || trimmed === '--';
}

function updateLookupStatus(message) {
  el.lookupStatus.textContent = message;
}

async function lookupDictionaryWord(word) {
  const query = String(word || '').trim();
  if (!query || lookupCache.word === query.toLowerCase()) return;

  lookupCache.word = query.toLowerCase();
  lookupCache.audioUrl = '';
  updateLookupStatus('Looking up...');

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Not found');
    }

    const [entry] = await response.json();
    if (!entry || typeof entry !== 'object') {
      throw new Error('Invalid response');
    }

    const phonetic = (entry.phonetics || []).find(item => item.text && item.text.trim())?.text || '';
    const audioUrl = (entry.phonetics || []).find(item => item.audio && item.audio.trim())?.audio || '';
    const firstMeaning = (entry.meanings || [])[0];
    const firstDefinition = firstMeaning?.definitions?.[0];
    const definition = firstDefinition?.definition || '';
    const example = firstDefinition?.example || '';

    if (isBlankOrPlaceholder(el.editorPhonetic.value) && phonetic) {
      el.editorPhonetic.value = phonetic;
    }

    if (isBlankOrPlaceholder(el.editorTranslation.value) && definition) {
      el.editorTranslation.value = definition;
    }

    if (isBlankOrPlaceholder(el.editorExample.value) && example) {
      el.editorExample.value = example;
    }

    if (audioUrl) {
      lookupCache.audioUrl = audioUrl;
    }

    updateLookupStatus('Lookup complete.');
    window.clearTimeout(el.lookupStatus.cleanupId);
    el.lookupStatus.cleanupId = window.setTimeout(() => updateLookupStatus(''), 2000);
  } catch (error) {
    updateLookupStatus('No dictionary entry found.');
    window.clearTimeout(el.lookupStatus.cleanupId);
    el.lookupStatus.cleanupId = window.setTimeout(() => updateLookupStatus(''), 2000);
  }
}

function pronounceWord() {
  const text = el.editorWord.value.trim();
  if (!text) return;

  if (lookupCache.word === text.toLowerCase() && lookupCache.audioUrl) {
    const audio = new Audio(lookupCache.audioUrl);
    audio.play().catch(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    });
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

function moveTo(offset) {
  if (!dueWords.length) return;
  index = (index + offset + dueWords.length) % dueWords.length;
  renderCard();
}

function flipCard() {
  el.card.classList.toggle('flipped');
}

function getSelectedWord() {
  return vocabulary.find(item => item.id === selectedWordId) || null;
}

function refreshVocabulary() {
  vocabulary = loadVocabulary();
}

function refreshDueWords() {
  dueWords = getDueWords();
  if (index >= dueWords.length) index = 0;
}

function updateVocabularyList(filter = '') {
  const normalized = filter.trim().toLowerCase();
  el.vocabList.innerHTML = '';

  const items = vocabulary.filter(item => {
    const searchable = `${item.word} ${item.phonetic} ${item.translation} ${item.example} ${item.notes} ${item.tags.join(' ')}`.toLowerCase();
    return searchable.includes(normalized);
  });

  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'vocab-empty';
    empty.textContent = 'No matching words.';
    el.vocabList.appendChild(empty);
    return;
  }

  items.forEach(item => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `vocab-item${item.id === selectedWordId ? ' selected' : ''}`;
    button.dataset.id = item.id;
    const title = document.createElement('span');
    title.className = 'vocab-word';
    title.textContent = item.word;
    const subtitle = document.createElement('span');
    subtitle.className = 'vocab-meta';
    subtitle.textContent = item.translation;
    button.appendChild(title);
    button.appendChild(subtitle);
    button.addEventListener('click', () => openEditor(item.id));
    el.vocabList.appendChild(button);
  });
}

function openEditor(wordId) {
  selectedWordId = wordId;
  const word = getSelectedWord();
  if (!word) return;

  el.editorWord.value = word.word;
  el.editorPhonetic.value = word.phonetic;
  el.editorTranslation.value = word.translation;
  el.editorExample.value = word.example;
  el.editorNotes.value = word.notes;
  el.editorTags.value = word.tags.join(', ');
  el.editorCreated.textContent = formatDate(word.createdAt);
  el.editorUpdated.textContent = formatDate(word.updatedAt);
  updateVocabularyList(el.vocabSearch.value);
}

function clearEditor() {
  selectedWordId = null;
  el.editorWord.value = '';
  el.editorPhonetic.value = '';
  el.editorTranslation.value = '';
  el.editorExample.value = '';
  el.editorNotes.value = '';
  el.editorTags.value = '';
  el.editorCreated.textContent = '-';
  el.editorUpdated.textContent = '-';
  updateVocabularyList(el.vocabSearch.value);
}

function createNewWord() {
  const now = new Date().toISOString();
  const newWord = {
    id: createUniqueId(),
    word: '',
    phonetic: '',
    translation: '',
    example: '',
    notes: '',
    tags: [],
    createdAt: now,
    updatedAt: now
  };

  vocabulary.unshift(newWord);
  saveVocabulary(vocabulary);
  refreshDueWords();
  selectedWordId = newWord.id;
  updateVocabularyList(el.vocabSearch.value);
  openEditor(newWord.id);
  showWorkspaceFeedback('New vocabulary item created.');
}

function saveWord() {
  const word = getSelectedWord();
  if (!word) {
    showWorkspaceFeedback('Select or add a word before saving.', 'error');
    return;
  }

  const value = el.editorWord.value.trim();
  if (!value) {
    showWorkspaceFeedback('Word is required.', 'error');
    return;
  }

  const meaning = el.editorTranslation.value.trim();
  if (!meaning) {
    showWorkspaceFeedback('Meaning is required.', 'error');
    return;
  }

  word.word = value;
  word.phonetic = el.editorPhonetic.value.trim() || '--';
  word.translation = meaning;
  word.example = el.editorExample.value.trim();
  word.notes = el.editorNotes.value.trim();
  word.tags = el.editorTags.value.split(',').map(tag => tag.trim()).filter(Boolean);
  word.updatedAt = new Date().toISOString();

  saveVocabulary(vocabulary);
  refreshDueWords();
  updateVocabularyList(el.vocabSearch.value);
  openEditor(word.id);
  showWorkspaceFeedback('Vocabulary saved.');
  renderCard();
}

function deleteWord() {
  const word = getSelectedWord();
  if (!word) {
    showWorkspaceFeedback('Select a word to delete.', 'error');
    return;
  }

  vocabulary = vocabulary.filter(item => item.id !== word.id);
  saveVocabulary(vocabulary);
  refreshDueWords();
  selectedWordId = vocabulary.length ? vocabulary[0].id : null;
  updateVocabularyList(el.vocabSearch.value);

  if (selectedWordId) {
    openEditor(selectedWordId);
  } else {
    clearEditor();
  }

  showWorkspaceFeedback('Word deleted.');
  renderCard();
}

function setVocabulary(newWords) {
  if (!newWords.length) {
    showFeedback('No valid vocabulary found in CSV.', 'error');
    return;
  }

  saveVocabulary(newWords);
  vocabulary = loadVocabulary();
  refreshDueWords();
  index = 0;
  selectedWordId = vocabulary.length ? vocabulary[0].id : null;
  updateVocabularyList(el.vocabSearch.value);
  if (selectedWordId) openEditor(selectedWordId);
  showFeedback(`Loaded ${newWords.length} words from CSV.`);
  renderCard();
}

function handleCsvFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const parsed = parseCsv(String(reader.result));
    const filtered = parsed.filter(item => item.word.length > 0);
    setVocabulary(filtered);
  };
  reader.onerror = () => {
    showFeedback('Unable to read CSV file.', 'error');
  };
  reader.readAsText(file, 'utf-8');
}

function attachEvents() {
  el.prevBtn.addEventListener('click', () => moveTo(-1));
  el.nextBtn.addEventListener('click', () => moveTo(1));
  el.card.addEventListener('click', flipCard);

  el.ratingButtons.forEach(button => {
    button.addEventListener('click', () => {
      rateCard(button.dataset.rating);
    });
  });

  el.importBtn.addEventListener('click', () => el.csvInput.click());

  el.csvInput.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (file) handleCsvFile(file);
    el.csvInput.value = '';
  });

  el.studyViewBtn.addEventListener('click', () => switchView('study'));
  el.vocabViewBtn.addEventListener('click', () => switchView('vocab'));
  el.addWordBtn.addEventListener('click', createNewWord);
  el.saveWordBtn.addEventListener('click', saveWord);
  el.deleteWordBtn.addEventListener('click', deleteWord);
  el.vocabSearch.addEventListener('input', () => updateVocabularyList(el.vocabSearch.value));
  el.editorWord.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      lookupDictionaryWord(el.editorWord.value);
    }
  });
  el.editorWord.addEventListener('blur', () => lookupDictionaryWord(el.editorWord.value));
  el.pronounceWordBtn.addEventListener('click', pronounceWord);

  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') moveTo(-1);
    if (event.key === 'ArrowRight') moveTo(1);
    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      flipCard();
    }
  });
}

attachEvents();
updateVocabularyList('');
if (selectedWordId) openEditor(selectedWordId);
renderCard();
switchView('study');
