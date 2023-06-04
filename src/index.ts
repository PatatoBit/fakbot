import { IgApiClient } from "instagram-private-api";

import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

import generateImage from "./generateImage.js";
import postImage from "./postImage.js";

// Initialize Instagram API client
const ig = new IgApiClient();

// API credentials
const username = process.env.INSTAGRAM_USERNAME;
const password = process.env.INSTAGRAM_PASSWORD;

// Authenticate the bot account
async function authenticate(): Promise<void> {
  ig.state.generateDevice(username);
  await ig.account.login(username, password);
}

interface Message {
  user_id: number;
  text: string;
  timestamp: string;
}

// Listen for incoming DMs
async function listenForDMs(): Promise<void> {
  const inboxFeed = ig.feed.directInbox();

  const messages: Message[] = [];
  let currentMsg = "";

  await inboxFeed.items();

  // setInterval(async () => {
  const inbox = await inboxFeed.items();

  // Process each new DM
  for (const thread of inbox) {
    const lastItem = thread.items[0];

    // Check if the last item is a text message
    if (lastItem.item_type === "text") {
      const message = lastItem.text;

      if (message !== currentMsg) {
        currentMsg = message;

        messages.push({
          user_id: lastItem.user_id,
          text: message,
          timestamp: lastItem.timestamp,
        });
      }

      console.log("New DM:", message);

      console.log(messages);

      // Generate image from message
      const image = await generateImage(message);

      fs.writeFile("test.jpg", image, function (err) {
        console.error(err);
      });

      // // // Post the image
      // try {
      //   await postImage(image, message, ig);
      // } catch (error) {
      //   console.error("Error posting image:", error);
      // }
    }
  }
  // }, 5000); // Check for new DMs every 5 seconds
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
