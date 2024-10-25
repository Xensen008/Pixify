import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const timeDifference = now.getTime() - date.getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds === 0) return 'Just now';
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days < 30) return days === 1 ? 'Yesterday' : `${days} days ago`;
  if (months < 12) return `${months} months ago`;
  return `${years} years ago`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);


export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};

