import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import animationData from "../assets/lootie-json.json"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const colors = [
  // Deep purple with pink accent
  "bg-[#2d1b4057] text-[#e64dff] border-[1px] border-[#e64dffaa]",

  // Rich teal
  "bg-[#00897b2a] text-[#00e5cc] border-[1px] border-[#00e5ccbb]",

  // Vibrant coral
  "bg-[#ff595e2a] text-[#ff595e] border-[1px] border-[#ff595ebb]",

  // Royal blue
  "bg-[#3a86ff2a] text-[#3a86ff] border-[1px] border-[#3a86ffbb]",

  // Amber gold
  "bg-[#ffbe0b2a] text-[#ffbe0b] border-[1px] border-[#ffbe0bbb]",

  // Emerald green
  "bg-[#38b0002a] text-[#38b000] border-[1px] border-[#38b000bb]",

  // Lavender
  "bg-[#8338ec2a] text-[#8338ec] border-[1px] border-[#8338ecbb]",

  // Crimson
  "bg-[#d904292a] text-[#ff2e5a] border-[1px] border-[#ff2e5abb]",
]

export const getColor = (color: number) => {
  if (color >= 0 && color < colors.length) {
    return colors[color]
  }
  return colors[0]
}

export const animationDefaultOptions = {
  loop : true,
  autoplay : false,
  animationData,
  // path: "/assets/lootie-json.json",
}