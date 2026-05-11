import type { Card } from '../types/game.types';

export const createCardDeck = (): Card[] => {
  const cards: Card[] = [];
  let id = 0;

  // 1-10: 1 card each
  for (let i = 1; i <= 10; i++) {
    cards.push({ id: `card-${id++}`, value: i });
  }

  // 11-19: 2 cards each
  for (let i = 11; i <= 19; i++) {
    cards.push({ id: `card-${id++}`, value: i });
    cards.push({ id: `card-${id++}`, value: i });
  }

  // 20-30: 1 card each
  for (let i = 20; i <= 30; i++) {
    cards.push({ id: `card-${id++}`, value: i });
  }

  // Star cards (wild)
  for (let i = 0; i < 3; i++) {
    cards.push({ id: `card-${id++}`, value: 'star' });
  }

  return shuffleDeck(cards);
};

export const shuffleDeck = (cards: Card[]): Card[] => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
