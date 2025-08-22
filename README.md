
# WordWise Counter

WordWise Counter is a powerful and intelligent text analysis tool designed for writers, editors, students, and anyone who works with text. It goes beyond simple word and character counting, offering a suite of advanced features to help you refine and understand your writing. Built with Next.js, ShadCN, and Genkit, this application provides a seamless and responsive user experience.

## Key Features

-   **Live Text Analysis**: Get instantaneous feedback as you type.
    -   **Word & Character Count**: Track your word and character counts in real-time.
    -   **Reading Time Estimate**: See an estimate of how long your text will take to read.
    -   **Syllable Count**: Instantly see the total number of syllables in your text.
    -   **Readability Score**: Get a Flesch Reading Ease score to gauge your text's complexity.

-   **Advanced Analysis Options**: Customize how your text is analyzed.
    -   **Include/Exclude Spaces**: Toggle whether spaces are included in the character count.
    -   **Ignore Punctuation**: Exclude punctuation from all calculations for a pure word analysis.
    -   **Ignore Stopwords**: Filter out common words (like "the", "a", "an") to focus on more substantive terms.
    -   **Word Length Filtering**: Highlight words that fall within a specified minimum and maximum length.

-   **AI-Powered Text Modifications**: Leverage the power of AI to transform your text.
    -   **Summarize**: Condense long texts into concise summaries.
    -   **Change Length**: Automatically expand or shorten your text to a specific word count.
    -   **Explain Like I'm Five**: Simplify complex topics into easy-to-understand language.
    -   **Creative Explanations**: Get more imaginative and illustrative explanations of your text.
    -   **Humanize/Jargonize**: Make your text sound more conversational or more technical.
    -   **Chain Modifications**: Apply multiple transformations sequentially for complex text editing tasks.

-   **Data Visualization & Export**:
    -   **Word Length Distribution Chart**: Visualize the frequency of different word lengths in your text with an interactive bar chart.
    -   **Export Results**: Download your complete analysis, including all metrics and the original/modified text, as a **JSON** or **CSV** file.

## How to Use

1.  **Navigate to the Counter**: Open the application and go to the `/word-counter` page.
2.  **Enter Your Text**: Type or paste your text into the main text area.
3.  **View Live Analysis**: Instantly see your word count, character count, reading time, and other metrics update as you type.
4.  **Customize Analysis**: Use the switches and input fields in the "Original Text Analysis" section to tailor the analysis to your needs (e.g., ignore punctuation, filter by word length).
5.  **Apply AI Modifications**:
    -   Choose a modification type from the dropdown (e.g., "Summarize").
    -   Configure any necessary options (like target word count for "Change Length").
    -   Click "Add Modification" to chain multiple transformations.
    -   Click "Modify Text" to generate the AI-powered result.
6.  **Export Your Data**: Once you're done, click "Export JSON" or "Export CSV" to save a complete record of your analysis.
