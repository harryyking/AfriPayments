"use client";

import { useState, useEffect } from 'react';
import ThreadInput from '@/components/ThreadInput';
import VoiceSelector from '@/components/VoiceSelector';
import MusicToggle from '@/components/MusicToggle';
import ConvertButton from '@/components/ConvertButton';
import DownloadLink from '@/components/DownloadLink';
import { useFFmpeg } from '@/hooks/useFFmpeg';

export default function Home() {
  const [threadInput, setThreadInput] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('21m00Tcm4TlvDq8ikWAM'); // Example ElevenLabs voice ID
  const [includeMusic, setIncludeMusic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { ffmpeg, isLoading: isFFmpegLoading, error: ffmpegError } = useFFmpeg();
  
  // Clean up previous download URL when component unmounts
  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  // Handle FFmpeg error
  useEffect(() => {
    if (ffmpegError) {
      setError(`Audio processing error: ${ffmpegError}`);
    }
  }, [ffmpegError]);

  const checkConversionLimit = () => {
    const conversionCount = parseInt(localStorage.getItem('conversionCount') || '0');
    const lastReset = localStorage.getItem('lastReset');
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
    
    if (!lastReset || lastReset !== currentMonth) {
      localStorage.setItem('conversionCount', '0');
      localStorage.setItem('lastReset', currentMonth);
      return true;
    }
    
    return conversionCount < 1;
  };

  const incrementConversionCount = () => {
    const count = parseInt(localStorage.getItem('conversionCount') || '0') + 1;
    localStorage.setItem('conversionCount', count.toString());
  };

  const handleConvert = async () => {
    if (!threadInput.trim()) {
      setError('Please enter thread content to convert.');
      return;
    }
    
    if (!checkConversionLimit()) {
      setError('Free limit reached (1/month). Upgrade to premium for unlimited conversions.');
      return;
    }
    
    if (isFFmpegLoading) {
      setError('Audio processing is still initializing. Please wait a moment.');
      return;
    }
    
    if (!ffmpeg) {
      setError('Audio processing not ready. Please try again shortly.');
      return;
    }
    
    // Clean up previous download URL
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadInput, selectedVoice }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Conversion failed');
      }
      
      const ttsBlob = await res.blob();
      let outputBlob;
      
      if (includeMusic) {
        try {
          const musicRes = await fetch('/background.mp3');
          if (!musicRes.ok) throw new Error('Could not load background music');
          
          const musicBlob = await musicRes.blob();
          
          // Write files to FFmpeg virtual filesystem
          await ffmpeg.writeFile('tts.mp3', new Uint8Array(await ttsBlob.arrayBuffer()));
          await ffmpeg.writeFile('music.mp3', new Uint8Array(await musicBlob.arrayBuffer()));
          
          // Mix audio files with FFmpeg
          await ffmpeg.exec([
            '-i', 'tts.mp3',
            '-i', 'music.mp3',
            '-filter_complex', 'amix=inputs=2:duration=shortest:weights=3,1',  // Give voice more weight than music
            'output.mp3',
          ]);
          
          // Read the resulting file
          const output = await ffmpeg.readFile('output.mp3');
          outputBlob = new Blob([output], { type: 'audio/mpeg' });
          
          // Clean up files
          await ffmpeg.deleteFile('tts.mp3');
          await ffmpeg.deleteFile('music.mp3');
          await ffmpeg.deleteFile('output.mp3');
        } catch (mixErr) {
          console.error('Error mixing audio:', mixErr);
          // Fallback to TTS only if mixing fails
          outputBlob = ttsBlob;
          setError('Background music could not be added, using voice only.');
        }
      } else {
        outputBlob = ttsBlob;
      }
      
      setDownloadUrl(URL.createObjectURL(outputBlob));
      incrementConversionCount();
    } catch (err) {
      console.error('Conversion error:', err);
      setError(`An error occurred during conversion: ${err instanceof Error ? err.message : 'Please try again'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">X Thread to Podcast Converter</h1>
      <div className="space-y-4">
        <ThreadInput value={threadInput} onChange={setThreadInput} />
        <VoiceSelector value={selectedVoice} onChange={setSelectedVoice} />
        <MusicToggle checked={includeMusic} onChange={setIncludeMusic} />
        
        {isFFmpegLoading && (
          <p className="text-amber-500 text-center">
            Loading audio processing... This might take a moment.
          </p>
        )}
        
        {error && (
          <p className="text-red-500 text-center">
            {error} {error.includes('limit reached') && <a href="/premium" className="underline">Go Premium</a>}
          </p>
        )}
        
        <ConvertButton 
          onClick={handleConvert} 
          disabled={isLoading || isFFmpegLoading || !threadInput.trim()} 
          isLoading={isLoading}
        />
        
        {downloadUrl && <DownloadLink url={downloadUrl} />}
      </div>
    </div>
  );
}