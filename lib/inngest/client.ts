import { Inngest } from "inngest";

const isDev = process.env.NODE_ENV === "development" || process.env.INNGEST_DEV === "1";

// Create a client to send and receive events locally or in production
export const inngest = new Inngest({
  id: "nano-pay",
  isDev,
  eventKey: process.env.INNGEST_EVENT_KEY || "local-dev-key",
  baseUrl: isDev ? "http://127.0.0.1:8288" : undefined,
});
