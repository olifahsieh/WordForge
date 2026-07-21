import { saveVocabulary, parseCsv } from './vocabRepository.js';
import { getDueWords, markAgain, markHard, markGood, markEasy } from '../core/reviewEngine.js';

let dueWords = getDueWords();
let index = 0;

const el = {
  word: document.getElementById('word'),
  phonetic: document.getElementById('phonetic'),
  translation: document.getElementById('translation'),
  card: document.getElementById('card'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  flipBtn: document.getElementById('flipBtn'),
  progressFill: document.getElementById('progressFill'),
  progressText: document.getElementById('progressText'),
  todaySummary: document.getElementById('today-summary'),
  feedback: document.getElementById('reviewFeedback'),
  ratingButtons: Array.from(document.querySelectorAll('.btn-ghost')),
  importBtn: document.getElementById('importBtn'),
  csvInput: document.getElementById('csvInput')
};

function updateStats() {
  const dueCount = dueWords.length;
  el.todaySummary.textContent = `${dueCount} words due today`;
  el.progressText.textContent = `${dueCount ? 1 : 0} / ${dueCount} reviewed`;
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

function moveTo(offset) {
  if (!dueWords.length) return;
  index = (index + offset + dueWords.length) % dueWords.length;
  renderCard();
}

function flipCard() {
  el.card.classList.toggle('flipped');
}

function rateCard(rating) {
  if (!dueWords.length) return;

  const word = dueWords[index];
  if (rating === 'again') markAgain(word.id);
  if (rating === 'hard') markHard(word.id);
  if (rating === 'good') markGood(word.id);
  if (rating === 'easy') markEasy(word.id);

  showFeedback(`Marked ${word.word} as ${rating}.`);
  dueWords = getDueWords();
  if (!dueWords.length) {
    index = 0;
    renderCard();
    return;
  }

  index = Math.min(index, dueWords.length - 1);
  renderCard();
}

function setVocabulary(newWords) {
  if (!newWords.length) {
    showFeedback('No valid vocabulary found in CSV.', 'error');
    return;
  }

  saveVocabulary(newWords);
  dueWords = getDueWords();
  index = 0;
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
  el.flipBtn.addEventListener('click', flipCard);

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
renderCard();
