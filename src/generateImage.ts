// import { createCanvas } from "canvas";

// import drawMultilineText from "./drawMultilineText.js";

// // Generate image from message using the canvas library
// export default async function generateImage(message: string): Promise<Buffer> {
//   const width = 2000;
//   const height = 2000;

//   const canvas = createCanvas(width, height);
//   const context = canvas.getContext("2d");

//   context.fillStyle = "#edf4ff";
//   context.fillRect(0, 0, width, height);

//   context.textAlign = "center";
//   context.textBaseline = "middle";
//   context.fillStyle = "#002763";

//   const fontSizeUsed = drawMultilineText(context, message, {
//     rect: {
//       x: 1000,
//       y: 0,
//       width: 2000,
//       height: 2000,
//     },
//     font: "Arial",
//     verbose: true,
//     lineHeight: 1,
//     minFontSize: 100,
//     maxFontSize: 200,
//   });

//   return canvas.toBuffer("image/png");
// }

import { createCanvas, registerFont } from "canvas";
import fs from "fs";

export default function generateImage(message: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const canvasWidth = 800; // Width of the canvas
    const canvasHeight = 800; // Height of the canvas
    const squareSize = 800; // Size of the square
    const fontSize = 24;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const context = canvas.getContext("2d");

    context.fillStyle = "#ccc"; // Color of the square
    context.fillRect(
      (canvasWidth - squareSize) / 2,
      (canvasHeight - squareSize) / 2,
      squareSize,
      squareSize
    );

    context.fillStyle = "#000"; // Color of the text
    context.textAlign = "center"; // Horizontal alignment
    context.textBaseline = "middle"; // Vertical alignment

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    context.fillText(message, centerX, centerY);

    canvas.toBuffer((error, buffer) => {
      if (error) {
        reject(error);
      } else {
        resolve(buffer);
      }
    });
  });
}
