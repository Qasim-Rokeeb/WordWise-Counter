import { test, expect } from '@playwright/test';

test.describe('Word Counter Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/word-counter');
  });

  test('should count words and modify text', async ({ page }) => {
    const sampleText = 'This is a sample text to test the word counter functionality.';
    
    // 1. Find the textarea and type some text
    const textarea = page.locator('textarea[id="text-input"]');
    await textarea.fill(sampleText);

    // 2. Verify original text analysis
    const originalAnalysisCard = page.locator('footer');
    await expect(originalAnalysisCard.getByText('10', { exact: true })).toBeVisible(); // Word count
    await expect(originalAnalysisCard.getByText('60', { exact: true })).toBeVisible(); // Character count

    // 3. Set up AI modification
    await page.locator('input[id="length-1"]').fill('20');
    
    // 4. Click the "Modify Text" button
    const modifyButton = page.getByRole('button', { name: 'Modify Text' });
    await modifyButton.click();

    // 5. Verify the modified text appears and is analyzed
    const modifiedTextarea = page.locator('textarea[readonly]');
    await expect(modifiedTextarea).not.toBeEmpty({ timeout: 15000 }); // Wait for AI
    
    const modifiedTextValue = await modifiedTextarea.inputValue();
    const modifiedWordCount = modifiedTextValue.trim().split(/\s+/).length;
    
    // Check if the word count is around the requested 20 words.
    expect(modifiedWordCount).toBeGreaterThanOrEqual(18);
    expect(modifiedWordCount).toBeLessThanOrEqual(22);

    const modifiedAnalysisContainer = page.locator('div:has-text("Modified Text") + textarea + div + div');
    await expect(modifiedAnalysisContainer.getByText(String(modifiedWordCount), { exact: true })).toBeVisible();
  });
});
