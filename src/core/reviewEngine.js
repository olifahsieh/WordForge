import { loadVocabulary } from '../services/storageService.js';

const REVIEW_STORAGE_KEY = 'wf_review_schedule';

const INTERVALS = {
  again: 10 * 60 * 1000,
  hard: 4 * 60 * 60 * 1000,
  good: 24 * 60 * 60 * 1000,
  easy: 3 * 24 * 60 * 60 * 1000,
};

function loadSchedule() {
  const saved = localStorage.getItem(REVIEW_STORAGE_KEY);
  if (!saved) return {};

  try {
    const parsed = JSON.parse(saved);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (error) {
    return {};
  }
}

function saveSchedule(schedule) {
  localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(schedule));
}

function getDueWords() {
  const vocabulary = loadVocabulary();
  const schedule = loadSchedule();
  const now = Date.now();

  if (!vocabulary.length) return [];

  return vocabulary
    .map((item) => {
      const entry = schedule[item.id];
      return {
        id: item.id,
        word: item.word,
        phonetic: item.phonetic,
        translation: item.translation,
        nextReview: entry?.nextReview ?? 0,
        lastRating: entry?.lastRating ?? null,
      };
    })
    .filter((item) => !item.nextReview || item.nextReview <= now);
}

function scheduleWord(wordId, rating) {
  if (!wordId || !rating || !INTERVALS[rating]) return;
  const schedule = loadSchedule();
  const interval = INTERVALS[rating];
  const nextReview = Date.now() + interval;

  schedule[wordId] = {
    nextReview,
    lastRating: rating,
  };

  saveSchedule(schedule);
}

function markAgain(wordId) {
  scheduleWord(wordId, 'again');
}

function markHard(wordId) {
  scheduleWord(wordId, 'hard');
}

function markGood(wordId) {
  scheduleWord(wordId, 'good');
}

function markEasy(wordId) {
  scheduleWord(wordId, 'easy');
}

export { getDueWords, markAgain, markHard, markGood, markEasy };