import { IgApiClient } from "instagram-private-api";

// Post the generated image to the bot account's feed
export default async function postImage(
  image: Buffer,
  text: string,
  ig: IgApiClient
): Promise<void> {
  const publishResult = await ig.publish.photo({
    file: image,
    caption: `"${text}\n#fakbot"`,
  });

  console.log("Image posted:", publishResult.media.code);
}
