"use client"

import type React from "react"

import type { TextState } from "../types"
import { toast } from "react-hot-toast"
import { ImageIcon } from "lucide-react"
import { useState } from "react"
import { convertColorToHex } from "@/lib/colorUtils"

interface ImagePreviewProps {
  backgroundImage: string | null
  subjectImage: string | null
  textState: TextState
  previewRef: React.RefObject<HTMLDivElement | null>
}

export default function ImagePreview({ backgroundImage, subjectImage, textState, previewRef }: ImagePreviewProps) {
  const [isLoading, setIsLoading] = useState({
    background: !!backgroundImage,
    subject: !!subjectImage,
  })

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    paddingTop: "56.25%", // 16:9 aspect ratio
    overflow: "hidden",
  }

  const imageStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }

  const backgroundImageStyle: React.CSSProperties = {
    ...imageStyle,
    zIndex: 1, // Bottom layer
  }

  const textStyle: React.CSSProperties = {
    position: "absolute",
    top: `${textState.position.y}%`,
    left: `${textState.position.x}%`,
    transform: `translate(-50%, -50%) rotate(${textState.rotation}deg)`,
    color: convertColorToHex(textState.textColor),
    fontSize: `${textState.fontSize}px`,
    fontWeight: textState.fontWeight,
    opacity: textState.opacity,
    backgroundColor: convertColorToHex(textState.backgroundColor),
    padding: "10px",
    textAlign: "center",
    whiteSpace: "nowrap",
    zIndex: 2, // Middle layer
    textShadow: textState.backgroundColor === "transparent" ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
  }

  const subjectImageStyle: React.CSSProperties = {
    ...imageStyle,
    zIndex: 3, // Top layer
  }

  return (
    <div className="w-full">
      {/* Main preview container */}
      <div
        ref={previewRef}
        className="rounded-lg border border-base-300 shadow-inner bg-base-200"
        style={containerStyle}
      >
        {/* Background image or placeholder */}
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
                toast.error("Failed to load background image")
                setIsLoading((prev) => ({ ...prev, background: false }))
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

        {/* Text overlay */}
        {textState.text && (
          <div style={textStyle} className={`${textState.font} select-none`}>
            {textState.text}
          </div>
        )}

        {/* Subject image (with removed background) */}
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
                toast.error("Failed to load processed image")
                setIsLoading((prev) => ({ ...prev, subject: false }))
              }}
              className="transition-opacity duration-300"
            />
          </>
        )}
      </div>

      {/* Image info */}
      <div className="mt-2 text-xs text-base-content/60 text-center">
        {backgroundImage && "16:9 aspect ratio preview"}
      </div>
    </div>
  )
}

