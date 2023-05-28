import { IgApiClient } from "instagram-private-api";

export default async function generateUsertagFromName(
  name: string,
  x: number,
  y: number,
  ig: IgApiClient
): Promise<{ user_id: number; position: [number, number] }> {
  const clamp = (value: number, min: number, max: number) =>
    Math.max(Math.min(value, max), min);

  // constrain x and y to 0..1 (0 and 1 are not supported)
  x = clamp(x, 0.0001, 0.9999);
  y = clamp(y, 0.0001, 0.9999);
  // get the user_id (pk) for the name
  const { pk } = await ig.user.searchExact(name);
  return {
    user_id: pk,
    position: [x, y],
  };
}
