import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { type Mail } from "@/drizzle/schemas/mails.db.server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function cacheMail(mail: Mail) {
  const storedMails = JSON.parse(localStorage.getItem('mails') || "[]") as Mails[];
  const existingMailIndex = storedMails.findIndex(existingMail => existingMail.id === mail.id);

  if (existingMailIndex !== -1) {
    storedMails[existingMailIndex] = mail;
  } else {
    storedMails.push(mail);
  }

  await localStorage.setItem('mails', JSON.stringify(storedMails));
}


export async function getCachedMail(id: number) {
  const storedMails = JSON.parse(localStorage.getItem('mails') || "[]") as Mail[];

  return storedMails.find(mail => mail.id === id);
}
