"use client";

import type React from "react";
import type { TextState } from "../types";
import { toast } from "react-hot-toast";
import { ImageIcon } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

interface ImagePreviewProps {
  backgroundImage: string | null;
  subjectImage: string | null;
  textState: TextState;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export default function ImagePreview({
  backgroundImage,
  subjectImage,
  textState,
  previewRef,
}: ImagePreviewProps) {
  const [isLoading, setIsLoading] = useState({
    background: false,
    subject: false,
  });
  const [backgroundLoadFailed, setBackgroundLoadFailed] = useState(false);
  const [subjectLoadFailed, setSubjectLoadFailed] = useState(false);
  const [backgroundImageSrc, setBackgroundImageSrc] = useState<string | null>(backgroundImage);
  const [subjectImageSrc, setSubjectImageSrc] = useState<string | null>(subjectImage);

  const [containerDimensions, setContainerDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Reset loading state and image sources when props change
  useEffect(() => {
    setIsLoading({
      background: !!backgroundImage,
      subject: !!subjectImage,
    });
    setBackgroundLoadFailed(false);
    setSubjectLoadFailed(false);
    setBackgroundImageSrc(backgroundImage);
    setSubjectImageSrc(subjectImage);
  }, [backgroundImage, subjectImage]);

  // Load image dimensions with cleanup to prevent race conditions
  useEffect(() => {
    let isMounted = true;

    const loadImage = (src: string) => {
      return new Promise<{ width: number; height: number }>((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.crossOrigin = "anonymous";
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => reject(new Error("Failed to load image for dimensions"));
      });
    };

    const setDimensions = async () => {
      try {
        if (subjectImage) {
          const { width, height } = await loadImage(subjectImage);
          if (isMounted) setContainerDimensions({ width, height });
        } else if (backgroundImage) {
          const { width, height } = await loadImage(backgroundImage);
          if (isMounted) setContainerDimensions({ width, height });
        } else {
          if (isMounted) setContainerDimensions({ width: 400, height: 400 });
        }
      } catch (error) {
        console.error("Error loading image dimensions:", error);
        if (isMounted) {
          setContainerDimensions({ width: 400, height: 400 });
          toast.error("Failed to load image dimensions. Using default size.");
        }
      }
    };

    setDimensions();

    return () => {
      isMounted = false;
    };
  }, [backgroundImage, subjectImage]);

  // Container style with pixel-based height
  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    backgroundColor: "transparent",
    height: containerDimensions
      ? `${(containerDimensions.height / containerDimensions.width) * 500}px` // Adjust 500 based on parent width
      : "400px",
  };

  const imageStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
  };

  const backgroundImageStyle: React.CSSProperties = {
    ...imageStyle,
    zIndex: 1,
  };

  const subjectImageStyle: React.CSSProperties = {
    ...imageStyle,
    zIndex: 3,
  };

  // Compute text style with dependency on container dimensions
  const computedTextColor = textState.textColor;
  const computedBgColor = textState.backgroundColor;

  const textStyle: React.CSSProperties = useMemo(
    () => ({
      position: "absolute",
      top: `${textState.position.y}%`,
      left: `${textState.position.x}%`,
      transform: `translate(-50%, -50%) rotate(${textState.rotation}deg)`,
      color: computedTextColor,
      fontSize: `${textState.fontSize}px`,
      fontWeight: textState.fontWeight,
      opacity: textState.opacity,
      backgroundColor: computedBgColor,
      padding: "10px",
      textAlign: "center",
      whiteSpace: "nowrap",
      zIndex: 2,
      textShadow: computedBgColor === "transparent" ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
    }),
    [textState, computedTextColor, computedBgColor, containerDimensions]
  );

  // Validate text and background colors
  useEffect(() => {
    if (computedTextColor === "#000000" && textState.textColor !== "#000000" && textState.textColor !== "black") {
      toast.error("Invalid text color detected, defaulting to black");
    }
    if (computedBgColor === "#000000" && textState.backgroundColor !== "#000000" && textState.backgroundColor !== "black") {
      toast.error("Invalid background color detected, defaulting to black");
    }
  }, [computedTextColor, computedBgColor, textState.textColor, textState.backgroundColor]);

  return (
    <div className="w-full">
      <div ref={previewRef} className="rounded-lg" style={containerStyle}>
        {backgroundImage && !backgroundLoadFailed ? (
          <>
            {isLoading.background && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="loading loading-spinner loading-md text-primary"></span>
              </div>
            )}
            <img
              src={backgroundImageSrc || "/local-placeholder.png"}
              alt="Background"
              style={backgroundImageStyle}
              crossOrigin="anonymous"
              onLoad={() => setIsLoading((prev) => ({ ...prev, background: false }))}
              onError={() => {
                toast.error("Failed to load background image. Check CORS settings.");
                setIsLoading((prev) => ({ ...prev, background: false }));
                setBackgroundLoadFailed(true);
                setBackgroundImageSrc("/local-placeholder.png");
              }}
              className="transition-opacity duration-300"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-base-300 bg-opacity-50 z-1">
            <ImageIcon size={48} className="text-base-content opacity-20 mb-2" />
            <p className="text-base-content opacity-60 text-center px-4">No background image uploaded</p>
          </div>
        )}

        {textState.text && (
          <div style={textStyle} className={`${textState.font} select-none`}>
            {textState.text}
          </div>
        )}

        {subjectImage && !subjectLoadFailed ? (
          <>
            {isLoading.subject && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="loading loading-spinner loading-md text-primary"></span>
              </div>
            )}
            <img
              src={subjectImageSrc || "/local-placeholder.png"}
              alt="Subject"
              style={subjectImageStyle}
              crossOrigin="anonymous"
              onLoad={() => setIsLoading((prev) => ({ ...prev, subject: false }))}
              onError={() => {
                toast.error("Failed to load processed image. Check CORS settings.");
                setIsLoading((prev) => ({ ...prev, subject: false }));
                setSubjectLoadFailed(true);
                setSubjectImageSrc("/local-placeholder.png");
              }}
              className="transition-opacity duration-300"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-base-200 h-full bg-opacity-50 z-3">
            <ImageIcon size={48} className="text-base-content opacity-20 mb-2" />
          </div>
        )}
      </div>
    </div>
  );
}