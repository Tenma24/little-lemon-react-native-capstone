import test from 'node:test';
import assert from 'node:assert/strict';
import { blankProfile, isValidProfile, normalizeProfile, filterMenu, menu } from '../src/model.js';
test('onboarding rejects missing names and malformed email', () => {
  for (const p of [null, {}, blankProfile(), { firstName: ' ', email: 'a@b.co' }, { firstName: 'Alex', email: 'a@b' }, { firstName: 'Alex', email: 'a b@c.co' }]) assert.equal(isValidProfile(p), false);
  assert.equal(isValidProfile({ firstName: ' Әлия ', email: 'alex@example.com' }), true);
});
test('profile normalization preserves preferences and strips unrelated data', () => {
  assert.deepEqual(normalizeProfile({ firstName: ' Alex ', lastName: ' Brown ', email: 'ALEX@EXAMPLE.COM ', phone: ' 123 ', orderUpdates: false, newsletter: true, unrelated: 'x' }), { firstName: 'Alex', lastName: 'Brown', email: 'alex@example.com', phone: '123', orderUpdates: false, newsletter: true });
});
test('search is case insensitive and matches ingredients', () => {
  assert.deepEqual(filterMenu(' FETA ').map(x => x.name), ['Greek Salad']);
  assert.equal(filterMenu().length, menu.length);
});
test('category and query intersect; empty results are supported', () => {
  assert.deepEqual(filterMenu('lemon', 'Desserts').map(x => x.name), ['Lemon Cake']);
  assert.deepEqual(filterMenu('feta', 'Desserts'), []);
  assert.equal(filterMenu('', 'Mains').length, 2);
});
