export function convertColorToHex(color: string, fallback: string = "#000000"): string {
  // Return early if server-side
  if (typeof window === "undefined") {
    return fallback;
  }

  // If already in hex or transparent, return as-is
  if (color.startsWith("#") || color === "transparent") {
    return color;
  }

  try {
    const tempElement = document.createElement("div");
    tempElement.style.color = color;
    document.body.appendChild(tempElement);
    const computedColor = window.getComputedStyle(tempElement).color;
    document.body.removeChild(tempElement);

    // Convert rgb(255, 255, 255) to hex
    const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]).toString(16).padStart(2, "0");
      const g = parseInt(rgbMatch[2]).toString(16).padStart(2, "0");
      const b = parseInt(rgbMatch[3]).toString(16).padStart(2, "0");
      return `#${r}${g}${b}`;
    }

    // If no conversion needed or possible, return original
    return color;
  } catch (error) {
    console.error("Failed to convert color:", color, error);
    return fallback;
  }
}