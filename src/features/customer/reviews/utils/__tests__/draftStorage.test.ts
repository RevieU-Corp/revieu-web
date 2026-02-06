import { describe, expect, it } from 'vitest';
import { clearDraft, loadDraft, saveDraft } from '../draftStorage';

describe('draftStorage', () => {
  it('saves and loads draft data', () => {
    const draft = { reviewText: 'hello', tags: ['#food'], overallRating: 4 };
    saveDraft(draft);
    const loaded = loadDraft<typeof draft>();
    expect(loaded?.reviewText).toBe('hello');
    clearDraft();
  });
});
