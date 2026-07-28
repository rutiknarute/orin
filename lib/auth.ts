/**
 * Demo session boundary. Deliberately dependency-free so client components can
 * import the credential hints without pulling the catalog into their bundle.
 * Replace with production identity when real accounts land.
 */
export const SESSION_COOKIE = "orin_demo_session";
export const SESSION_VALUE = "orin-demo-v1";

export const DEMO_CREDENTIALS = {
  email: "maya@orin.demo",
  password: "orin-demo",
};

export function isDemoSession(value: string | undefined) {
  return value === SESSION_VALUE;
}
