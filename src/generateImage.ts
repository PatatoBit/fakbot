import { createCanvas, CanvasRenderingContext2D } from "canvas";

export default function generateImage(message: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const canvasWidth = 800; // Width of the canvas
    const canvasHeight = 800; // Height of the canvas
    const backgroundColor = "#ccc"; // Color of the background
    const fontSize = 60;
    const fontFamily = "Noto Sans Thai"; // Use the registered font family or a system font

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const context: CanvasRenderingContext2D = canvas.getContext("2d");

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    context.fillStyle = "#000"; // Color of the text
    context.font = `${fontSize}px ${fontFamily}`;
    context.textAlign = "center"; // Horizontal alignment

    const maxTextWidth = canvasWidth - 40; // Maximum width of the text within the canvas
    const lines = getWrappedTextLines(context, message, maxTextWidth);
    const lineHeight = fontSize + 5; // Line height including padding

    // Calculate the starting vertical position for the text
    const textHeight = lines.length * lineHeight;
    const startY = (canvasHeight - textHeight) / 2 + lineHeight / 2;

    // Draw each line of the wrapped text
    lines.forEach((line, index) => {
      const y = startY + index * lineHeight;
      context.fillText(line, canvasWidth / 2, y);
    });

    canvas.toBuffer((error, buffer) => {
      if (error) {
        reject(error);
      } else {
        resolve(buffer);
      }
    }, "image/jpeg");
  });
}

function getWrappedTextLines(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const { width } = context.measureText(currentLine + " " + word);

    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine.trim());
      currentLine = word;
    }
  }

  lines.push(currentLine.trim());

  return lines;
}
