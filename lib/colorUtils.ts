// app/lib/colorUtils.ts
export function convertColorToHex(color: string): string {
    // If the color is already in a supported format, return it
    if (
      color.startsWith("#") ||
      color.startsWith("rgb") ||
      color.startsWith("hsl") ||
      color === "transparent"
    ) {
      return color;
    }
  
    // If the color is in oklch format, convert it to hex
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
  
      // Fallback to the original color if conversion fails
      return color;
    } catch (error) {
      console.error("Failed to convert color:", color, error);
      return "#000000"; // Fallback to black
    }
  }