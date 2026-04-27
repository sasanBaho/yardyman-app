import { logEvent } from "firebase/analytics";
import { analytics } from "./firebase";

export async function trackEvent(name: string, params?: Record<string, any>) {
  const instance = await analytics;
  if (instance) {
    logEvent(instance, name, params);
  }
}