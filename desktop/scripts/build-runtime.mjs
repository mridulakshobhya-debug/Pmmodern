import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { build } from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..", "..");
const runtimeDir = path.join(root, "desktop", "runtime");
const webStandaloneDir = path.join(root, "apps", "web", ".next", "standalone");
const webStaticDir = path.join(root, "apps", "web", ".next", "static");
const webPublicDir = path.join(root, "apps", "web", "public");

const nodeNextJsImportPlugin = {
  name: "node-next-js-imports",
  setup(buildContext) {
    buildContext.onResolve({ filter: /^\.{1,2}\// }, (args) => {
      if (!args.path.endsWith(".js")) {
        return null;
      }

      const baseWithoutExt = args.path.slice(0, -3);
      const candidates = [
        `${baseWithoutExt}.ts`,
        `${baseWithoutExt}.tsx`,
        `${baseWithoutExt}.mts`,
        `${baseWithoutExt}.cts`,
        path.join(baseWithoutExt, "index.ts"),
        path.join(baseWithoutExt, "index.tsx")
      ];

      for (const candidate of candidates) {
        const absolute = path.resolve(args.resolveDir, candidate);
        if (fs.existsSync(absolute)) {
          return { path: absolute };
        }
      }

      return null;
    });
  }
};

function ensureExists(targetPath, message) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(message);
  }
}

function copyDir(source, destination) {
  fs.cpSync(source, destination, { recursive: true, force: true });
}

function findFileRecursive(dir, fileName) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const target = path.join(dir, entry.name);
    if (entry.isFile() && entry.name === fileName) {
      return target;
    }
    if (entry.isDirectory()) {
      const found = findFileRecursive(target, fileName);
      if (found) return found;
    }
  }
  return null;
}

function copyWebAssets(runtimeWebRoot) {
  const candidates = [
    runtimeWebRoot,
    path.join(runtimeWebRoot, "apps", "web")
  ];

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue;
    const dotNextDir = path.join(candidate, ".next");
    fs.mkdirSync(dotNextDir, { recursive: true });
    copyDir(webStaticDir, path.join(dotNextDir, "static"));
    copyDir(webPublicDir, path.join(candidate, "public"));
  }
}

async function main() {
  ensureExists(
    webStandaloneDir,
    "Next standalone build not found. Run `npm run build:web` before desktop packaging."
  );
  ensureExists(
    webStaticDir,
    "Next static assets missing. Run `npm run build:web` before desktop packaging."
  );

  fs.rmSync(runtimeDir, { recursive: true, force: true });
  fs.mkdirSync(runtimeDir, { recursive: true });

  const runtimeWebRoot = path.join(runtimeDir, "web");
  copyDir(webStandaloneDir, runtimeWebRoot);
  copyWebAssets(runtimeWebRoot);

  const runtimeApiRoot = path.join(runtimeDir, "api");
  fs.mkdirSync(runtimeApiRoot, { recursive: true });

  try {
    await build({
      entryPoints: [path.join(root, "apps", "api", "src", "server.ts")],
      outfile: path.join(runtimeApiRoot, "server.cjs"),
      bundle: true,
      platform: "node",
      format: "cjs",
      target: "node18",
      minify: false,
      sourcemap: false,
      tsconfig: path.join(root, "apps", "api", "tsconfig.json"),
      define: {
        "process.env.NODE_ENV": "\"production\""
      },
      plugins: [nodeNextJsImportPlugin]
    });
  } catch (error) {
    if (error && typeof error === "object" && "errors" in error && Array.isArray(error.errors)) {
      // eslint-disable-next-line no-console
      console.error("esbuild failed with:");
      for (const detail of error.errors) {
        const location = detail.location
          ? `${detail.location.file}:${detail.location.line}:${detail.location.column}`
          : "unknown location";
        // eslint-disable-next-line no-console
        console.error(`- ${detail.text} (${location})`);
      }
    }
    throw error;
  }

  const webServerEntry = findFileRecursive(runtimeWebRoot, "server.js");
  if (!webServerEntry) {
    throw new Error("Next standalone server.js not found after runtime copy.");
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    runtimeWebServer: path.relative(runtimeDir, webServerEntry).replaceAll("\\", "/"),
    runtimeApiServer: "api/server.cjs"
  };
  fs.writeFileSync(
    path.join(runtimeDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8"
  );
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
