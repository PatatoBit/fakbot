import { IgApiClient } from "instagram-private-api";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

import generateImage from "./generateImage.js";
import postImage from "./postImage.js";
import { registerFont } from "canvas";

// Initialize Instagram API client
const ig = new IgApiClient();

// API credentials
const username = process.env.INSTAGRAM_USERNAME;
const password = process.env.INSTAGRAM_PASSWORD;

// Path to the JSON file to store posted DMs
const dmFilePath = "posted_dms.json";

// Authenticate the bot account
async function authenticate(): Promise<void> {
  ig.state.generateDevice(username);
  await ig.account.login(username, password);

  registerFont("./NotoSansThai-Regular.ttf", {
    family: "Noto Sans Thai Loop",
  });
  console.log("Font registered.");
}

// Load posted DMs from JSON file
function loadPostedDMs(): string[] {
  try {
    const data = fs.readFileSync(dmFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log("Failed to load posted DMs:", error);
    return [];
  }
}

// Save posted DMs to JSON file
function savePostedDMs(postedDMs: string[]): void {
  try {
    const data = JSON.stringify(postedDMs);
    fs.writeFileSync(dmFilePath, data, "utf-8");
  } catch (error) {
    console.log("Failed to save posted DMs:", error);
  }
}

// Listen for incoming DMs
async function listenForDMs(): Promise<void> {
  const inboxFeed = ig.feed.directInbox();

  await inboxFeed.items();

  setInterval(async () => {
    const inbox = await inboxFeed.items();

    // Process each new DM
    for (const thread of inbox) {
      const lastItem = thread.items[0];

      // Check if the last item is a text message
      if (lastItem.item_type === "text") {
        const message = lastItem.text;

        console.log("New DM:", message);

        if (messageFormat(message)) {
          // Check if the DM has already been posted
          const postedDMs = loadPostedDMs();
          if (postedDMs.includes(message)) {
            console.log("DM already posted:", message);
            continue; // Skip this DM
          }

          const image = await generateImage(message);

          fs.writeFile("test.jpg", image, function (err) {
            console.error(err);
          });

          try {
            await postImage(image, message, ig);
            // Add the posted DM to the list and save it
            postedDMs.push(message);
            savePostedDMs(postedDMs);
          } catch (error) {
            console.error("Error posting image:", error);
          }
        } else {
          console.log("Message is not in the correct format.");
        }
      }
    }
  }, 5000); // Check for new DMs every 5 seconds
}

// Main function to authenticate and start listening for DMs
async function runBot(): Promise<void> {
  try {
    await authenticate();
    await listenForDMs();

    // Test post
    console.log("Bot is running.");
  } catch (error) {
    console.error("Bot encountered an error:", error);
  }
}

// Run the bot
runBot();

function messageFormat(input: string): boolean {
  const regex = /^“[^”]*”$/; // Regular expression pattern using alternate double quotes

  return regex.test(input);
}
