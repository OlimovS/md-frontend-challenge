import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// setting up worker for mock server
export const worker = setupWorker(...handlers);
