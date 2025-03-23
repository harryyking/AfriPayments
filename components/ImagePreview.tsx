"use client";

import type React from "react";
import type { TextState } from "../types";
import { toast } from "react-hot-toast";
import { ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface ImagePreviewProps {
  backgroundImage: string | null;
  subjectImage: string | null;
  textState: TextState;
  previewRef: React.RefObject<HTMLDivElement | null>;
  aspectRatio?: "1:1" | "4:3";
}

export default function ImagePreview({
  backgroundImage,
  subjectImage,
  textState,
  previewRef,
  aspectRatio = "1:1",
}: ImagePreviewProps) {
  const [isLoading, setIsLoading] = useState({
    background: !!backgroundImage,
    subject: !!subjectImage,
  });

  const aspectRatioMap = {
    "1:1": "100%",
    "4:3": "75%",
  };

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    paddingTop: aspectRatioMap[aspectRatio],
    overflow: "hidden",
  };

  const imageStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const backgroundImageStyle: React.CSSProperties = {
    ...imageStyle,
    zIndex: 1,
  };

  const computedTextColor = textState.textColor;
  const computedBgColor = textState.backgroundColor;

  useEffect(() => {
    if (computedTextColor === "#000000" && textState.textColor !== "#000000" && textState.textColor !== "black") {
      toast.error("Invalid text color detected, defaulting to black");
    }
    if (computedBgColor === "#000000" && textState.backgroundColor !== "#000000" && textState.backgroundColor !== "black") {
      toast.error("Invalid background color detected, defaulting to black");
    }
  }, [computedTextColor, computedBgColor, textState.textColor, textState.backgroundColor]);

  const textStyle: React.CSSProperties = {
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
  };

  const subjectImageStyle: React.CSSProperties = {
    ...imageStyle,
    zIndex: 3,
  };

  return (
    <div className="w-full">
      <div
        ref={previewRef}
        className="rounded-lg border border-base-300 shadow-inner bg-base-200"
        style={containerStyle}
      >
        {backgroundImage ? (
          <>
            {isLoading.background && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="loading loading-spinner loading-md text-primary"></span>
              </div>
            )}
            <img
              src={backgroundImage || "/placeholder.svg"}
              alt="Background"
              style={backgroundImageStyle}
              crossOrigin="anonymous"
              onLoad={() => setIsLoading((prev) => ({ ...prev, background: false }))}
              onError={() => {
                toast.error("Failed to load background image");
                setIsLoading((prev) => ({ ...prev, background: false }));
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

        {subjectImage && (
          <>
            {isLoading.subject && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="loading loading-spinner loading-md text-primary"></span>
              </div>
            )}
            <img
              src={subjectImage || "/placeholder.svg"}
              alt="Subject"
              style={subjectImageStyle}
              crossOrigin="anonymous"
              onLoad={() => setIsLoading((prev) => ({ ...prev, subject: false }))}
              onError={() => {
                toast.error("Failed to load processed image");
                setIsLoading((prev) => ({ ...prev, subject: false }));
              }}
              className="transition-opacity duration-300"
            />
          </>
        )}
      </div>

      <div className="mt-2 text-xs text-base-content/60 text-center">
        {backgroundImage && `${aspectRatio} aspect ratio preview`}
      </div>
    </div>
  );
}