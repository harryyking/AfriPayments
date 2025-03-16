export function cleanText(text: string): string {
    return text
      .replace(/https?:\/\/\S+/g, '') // Remove URLs
      .replace(/@\w+/g, '') // Remove mentions
      .replace(/#\w+/g, '') // Remove hashtags
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }