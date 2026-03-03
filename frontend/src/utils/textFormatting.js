/**
 * Utility to clean markdown formatting from Gemini responses
 * Removes ** bold markers and other markdown syntax
 */
export const cleanGeminiFormatting = (text) => {
    if (!text) return '';

    let cleaned = text;

    // Remove ** bold markers
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');

    // Remove single * italic markers
    cleaned = cleaned.replace(/\*(.*?)\*/g, '$1');

    // Remove __ bold markers
    cleaned = cleaned.replace(/__(.*?)__/g, '$1');

    // Remove _ italic markers  
    cleaned = cleaned.replace(/_(.*?)_/g, '$1');

    // Clean up any remaining markdown headers (###, ##, #)
    cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');

    return cleaned.trim();
};

/**
 * Format text for display with proper line breaks
 */
export const formatEmailText = (text) => {
    if (!text) return '';

    // Clean markdown first
    const cleaned = cleanGeminiFormatting(text);

    // Ensure proper spacing between paragraphs
    return cleaned.replace(/\n{3,}/g, '\n\n');
};
