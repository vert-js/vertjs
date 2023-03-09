import { mkdirSync, existsSync, rmSync } from "fs";
import copyPublic from "./copyPublic";
import transformSrc from "./tranformSrc";

const destDir = `dist`;

if (existsSync(destDir)) rmSync(destDir, { recursive: true, force: true });
mkdirSync(destDir);

copyPublic();
transformSrc();
