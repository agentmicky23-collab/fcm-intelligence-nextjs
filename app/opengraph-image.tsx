import { ogImage, ogSize } from "@/lib/og";

export const alt = "FCM Intelligence: buying and running a Post Office, with Mikesh Parekh";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: "FCM Intelligence", title: "Straight answers on buying and running a Post Office.", footer: "Mikesh Parekh · 43 branches · fcmintelligence.com" });
}
