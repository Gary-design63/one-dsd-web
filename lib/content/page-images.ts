/** Image references stay inside the application's existing public image folder. */
export function isSafePageImage(value: string): boolean {
  return /^\/images\/[a-zA-Z0-9][a-zA-Z0-9/_-]*\.(?:avif|webp|png|jpe?g)$/i.test(value);
}

export const LOCAL_PAGE_IMAGE_ERROR = "Choose an image from the program's images folder.";

export const HOME_HERO_IMAGE = "/images/program-workplace-conversation.webp";
export const EQUITY_TOOLKIT_HERO_IMAGE = "/images/staff-hero-office.jpg";

export function resolvePageImage(value: unknown, fallback: string): string {
  return typeof value === "string" && isSafePageImage(value) ? value : fallback;
}
