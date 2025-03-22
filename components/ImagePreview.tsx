import { TextState } from "../types";
import { toast } from "react-hot-toast";

interface ImagePreviewProps {
  backgroundImage: string | null;
  subjectImage: string | null;
  textState: TextState;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export default function ImagePreview({ backgroundImage, subjectImage, textState, previewRef }: ImagePreviewProps) {
  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    paddingTop: "56.25%", // 16:9 aspect ratio
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
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
    zIndex: 1, // Bottom layer
  };

  const textStyle: React.CSSProperties = {
    position: "absolute",
    top: `${textState.position.y}%`,
    left: `${textState.position.x}%`,
    transform: `translate(-50%, -50%) rotate(${textState.rotation}deg)`,
    color: textState.textColor,
    fontSize: `${textState.fontSize}px`,
    fontWeight: textState.fontWeight,
    opacity: textState.opacity,
    backgroundColor: textState.backgroundColor,
    padding: "10px",
    textAlign: "center",
    whiteSpace: "nowrap",
    zIndex: 2, // Middle layer
  };

  const subjectImageStyle: React.CSSProperties = {
    ...imageStyle,
    zIndex: 3, // Top layer
  };

  return (
    <div ref={previewRef} style={containerStyle}>
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt="Background"
          style={backgroundImageStyle}
          crossOrigin="anonymous"
          onError={() => toast.error("Failed to load background image")}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500" style={{ zIndex: 1 }}>
          No image uploaded
        </div>
      )}
      {textState.text && (
        <div style={textStyle} className={textState.font}>
          {textState.text}
        </div>
      )}
      {subjectImage && (
        <img
          src={subjectImage}
          alt="Subject"
          style={subjectImageStyle}
          crossOrigin="anonymous"
          onError={() => toast.error("Failed to load subject image")}
        />
      )}
    </div>
  );
}