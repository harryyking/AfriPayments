import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import { cleanText } from '@/lib/cleanText';

export async function POST(req: Request) {
  try {
    const { threadInput, selectedVoice } = await req.json();

    let text = threadInput;
    if (threadInput.startsWith('https://x.com/')) {
      const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN!);
      const tweetId = threadInput.split('/')[5]; // Extracts tweet ID from URL
      const tweet = await client.v2.singleTweet(tweetId, { 'tweet.fields': ['text'] });
      text = tweet.data.text;
    }

    const cleanedText = cleanText(text);

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ELEVENLABS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: cleanedText }),
    });

    if (!response.ok) throw new Error('TTS conversion failed');

    const audioBuffer = await response.arrayBuffer();
    return new NextResponse(Buffer.from(audioBuffer), {
      headers: { 'Content-Type': 'audio/mpeg' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}