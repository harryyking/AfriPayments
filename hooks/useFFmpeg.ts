import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { useEffect, useState } from 'react';

// The FFmpeg Hook updated for @ffmpeg/ffmpeg@0.12.15
export function useFFmpeg() {
  const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadFFmpeg = async () => {
      try {
        // Create new FFmpeg instance with the updated API
        const ffmpegInstance = new FFmpeg();
        
        // Load FFmpeg
        await ffmpegInstance.load({
          // coreURL: '/ffmpeg-core.js', // Uncomment if hosting WASM files locally
        });
        
        if (isMounted) {
          setFFmpeg(ffmpegInstance);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load FFmpeg: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadFFmpeg();

    return () => {
      isMounted = false;
    };
  }, []);

  return { ffmpeg, isLoading, error };
}