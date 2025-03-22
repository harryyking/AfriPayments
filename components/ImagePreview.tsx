'use client';

import Image from 'next/image';
import { getFontByValue } from '../lib/font';
import { TextState } from '../types';
import { RefObject } from 'react';

interface ImagePreviewProps extends TextState {
  image: string;
  previewRef: RefObject<HTMLDivElement | null>;
}

export default function ImagePreview({
  image,
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

  return (
    <div
      ref={previewRef}
      className="relative w-full max-w-3xl h-[500px] sm:h-[400px] xs:h-[300px] mx-auto border border-gray-300 rounded-lg overflow-hidden"
    >
      <Image
        src={image}
        alt="Uploaded image"
        layout="fill"
        objectFit="cover"
        quality={75}
        style={{
          filter: `brightness(${brightness}) contrast(${contrast})`,
        }}
      />
      <div
        className={`absolute z-10 text-shadow ${
          selectedFont ? selectedFont.fontObject.className : ''
        } ${
          useOverlay ? 'before:absolute before:inset-[-10px] before:bg-black/30 before:z-[-1]' : ''
        }`}
        style={{
          top: `${position.y}%`,
          left: `${position.x}%`,
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
    </div>
  );
}