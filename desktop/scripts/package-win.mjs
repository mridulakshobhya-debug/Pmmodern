import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import packager from "electron-packager";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const desktopRoot = path.resolve(__dirname, "..");
const releaseDir = path.join(desktopRoot, "release");
const runtimeDir = path.join(desktopRoot, "runtime");

if (!fs.existsSync(runtimeDir)) {
  throw new Error("Runtime folder not found. Run prepare:runtime first.");
}

fs.mkdirSync(releaseDir, { recursive: true });

const staleTargets = [
  path.join(releaseDir, "PMModern-win32-x64"),
  path.join(releaseDir, "@pmmodern-desktop-win32-x64")
];

for (const target of staleTargets) {
  if (!fs.existsSync(target)) continue;
  try {
    fs.rmSync(target, { recursive: true, force: true });
  } catch {
    // Ignore lock errors; packager will place output in release with overwrite logic.
  }
}

async function buildWithName(name) {
  return packager({
    name,
    dir: desktopRoot,
    out: releaseDir,
    overwrite: true,
    platform: "win32",
    arch: "x64",
    asar: false,
    executableName: "PMModern",
    appCopyright: "PMModern",
    prune: false,
    ignore: [
      /^\/release$/,
      /^\/scripts$/,
      /^\/node_modules$/,
      /^\/runtime\/manifest\.json$/,
      /^\/npm-debug\.log/
    ]
  });
}

function cleanupOldPackages(latestOutputs) {
  const keep = new Set(latestOutputs.map((entry) => path.resolve(entry)));
  const entries = fs.readdirSync(releaseDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (!/^PMModern.*-win32-x64$/.test(entry.name)) continue;

    const fullPath = path.resolve(path.join(releaseDir, entry.name));
    if (keep.has(fullPath)) continue;

    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } catch {
      // Ignore lock errors from previously opened builds.
    }
  }
}

let outputs = [];
try {
  outputs = await buildWithName("PMModern");
} catch (error) {
  if (error && typeof error === "object" && "code" in error && error.code === "EBUSY") {
    const fallbackName = `PMModern-${Date.now()}`;
    // eslint-disable-next-line no-console
    console.warn(`Primary output locked. Retrying with fallback app name: ${fallbackName}`);
    outputs = await buildWithName(fallbackName);
  } else {
    throw error;
  }
}

cleanupOldPackages(outputs);

// eslint-disable-next-line no-console
console.log("Windows package generated in desktop/release");
