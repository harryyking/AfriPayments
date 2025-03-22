import { toast } from "react-hot-toast";

interface ImagePreviewProps {
  backgroundImage: string;
  subjectImage: string | null;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export default function ImagePreview({ backgroundImage, subjectImage, previewRef }: ImagePreviewProps) {
  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    paddingTop: "56.25%", // 16:9 aspect ratio for responsiveness
    overflow: "hidden",
    backgroundColor: "#f0f0f0", // Fallback background color
  };

  const imageStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  };

  const backgroundStyle: React.CSSProperties = {
    ...imageStyle,
    objectFit: "cover",
    zIndex: 1,
  };

  const subjectStyle: React.CSSProperties = {
    ...imageStyle,
    objectFit: "contain",
    zIndex: 2,
  };

  return (
    <div ref={previewRef} style={containerStyle}>
      <img
        src={backgroundImage}
        alt="Background"
        style={backgroundStyle}
        crossOrigin="anonymous"
        onError={() => toast.error("Failed to load background image")}
      />
      {subjectImage && (
        <img
          src={subjectImage}
          alt="Subject"
          style={subjectStyle}
          crossOrigin="anonymous"
          onError={() => toast.error("Failed to load subject image")}
        />
      )}
    </div>
  );
}