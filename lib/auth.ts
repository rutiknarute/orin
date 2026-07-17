import { DEMO_USER } from "@/lib/demo-data";

export const SESSION_COOKIE = "orin_demo_session";
export const SESSION_VALUE = "orin-demo-v1";

export function isDemoSession(value: string | undefined) {
  return value === SESSION_VALUE;
}

export function getDemoUser() {
  return DEMO_USER;
}
