import { createCanvas } from "canvas";

// Generate image from message using the canvas library
export default async function generateImage(message: string): Promise<Buffer> {
  const canvas = createCanvas(800, 800);
  const ctx = canvas.getContext("2d");

  // Customize image appearance
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#000000";
  ctx.font = "24px Arial";
  ctx.fillText(message, 20, 40);

  // Load additional images or draw shapes as desired

  return canvas.toBuffer("image/jpeg");
}
