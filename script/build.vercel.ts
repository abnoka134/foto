import { build as viteBuild } from "vite";
import { rm } from "fs/promises";

async function buildVercel() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("done! vercel will handle the server via api/index.ts");
}

buildVercel().catch((err) => {
  console.error(err);
  process.exit(1);
});