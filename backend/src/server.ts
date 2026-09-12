import { app } from "./app";
import { env } from "./lib/env";

app.listen(env.port, () => {
  console.log(`Sheba API listening on http://localhost:${env.port}`);
});
