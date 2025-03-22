'use client';

import Image from 'next/image';
import { getFontByValue } from '../lib/font';
import { TextState } from '../types';
import { RefObject } from 'react';

interface ImagePreviewProps extends TextState {
  backgroundImage: string;
  subjectImage: string | null;
  previewRef: RefObject<HTMLDivElement | null>;
}

export default function ImagePreview({
  backgroundImage,
  subjectImage,
  text,
  textColor,
  fontSize,
  fontWeight,
  font,
  position,
  rotation,
  opacity,
  backgroundColor,
  useOverlay,
  brightness,
  contrast,
  previewRef,
}: ImagePreviewProps) {
  const selectedFont = getFontByValue(font);
  if (!selectedFont) {
    console.warn(`Font not found for value: ${font}. Falling back to default font.`);
  }

  if (!backgroundImage) {
    console.error('Invalid background image source:', backgroundImage);
    return <div className="text-red-500">Error: No background image provided.</div>;
  }

  const safePosition = {
    x: typeof position.x === 'number' && !isNaN(position.x) ? position.x : 50,
    y: typeof position.y === 'number' && !isNaN(position.y) ? position.y : 50,
  };

  return (
    <div
      ref={previewRef}
      className="relative w-full max-w-3xl h-[500px] sm:h-[400px] xs:h-[300px] mx-auto border border-gray-300 rounded-lg overflow-hidden"
    >
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt="Background image"
        layout="fill"
        objectFit="cover"
        quality={75}
        style={{
          filter: `brightness(${brightness}) contrast(${contrast})`,
        }}
        onError={() => console.error('Failed to load background image:', backgroundImage)}
      />

      {/* Text Overlay */}
      <div
        className={`absolute z-10 text-shadow ${
          selectedFont ? selectedFont.fontObject.className : 'font-sans'
        } ${
          useOverlay ? 'before:absolute before:inset-[-10px] before:bg-black/30 before:z-[-1]' : ''
        }`}
        style={{
          top: `${safePosition.y}%`,
          left: `${safePosition.x}%`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          color: textColor,
          fontSize: `${fontSize}px`,
          fontWeight: fontWeight,
          opacity: opacity,
          backgroundColor: backgroundColor,
          padding: backgroundColor !== 'transparent' ? '5px 10px' : '0',
          borderRadius: backgroundColor !== 'transparent' ? '5px' : '0',
        }}
      >
        {text}
      </div>

      {/* Subject Image (if provided) */}
      {subjectImage && (
        <Image
          src={subjectImage}
          alt="Subject image"
          layout="fill"
          objectFit="contain"
          quality={75}
          style={{
            zIndex: 20,
          }}
          onError={() => console.error('Failed to load subject image:', subjectImage)}
        />
      )}
    </div>
  );
}