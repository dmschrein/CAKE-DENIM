import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {},
  client: { NEXT_PUBLIC_URL: z.string().url() },
},
experimental_runtimeEnv: {
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
},
});

