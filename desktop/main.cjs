const { app, BrowserWindow, dialog } = require("electron");
const fs = require("fs");
const http = require("http");
const net = require("net");
const path = require("path");

const API_PORT_DEFAULT = 4000;
const WEB_PORT_DEFAULT = 3000;
const LOG_FILE = path.join(process.env.TEMP || process.cwd(), "pmmodern-desktop.log");

function logLine(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  try {
    fs.appendFileSync(LOG_FILE, line, "utf8");
  } catch {
    // ignore log write failures
  }
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode || 0,
          body
        });
      });
    });
    req.on("error", reject);
  });
}

async function waitForCondition(check, timeoutMs = 45_000, intervalMs = 500) {
  const started = Date.now();
  while (Date.now() - started <= timeoutMs) {
    try {
      const passed = await check();
      if (passed) return;
    } catch {
      // Ignore transient startup errors and retry.
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new Error("Service readiness timeout");
}

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const tester = net
      .createServer()
      .once("error", () => {
        resolve(false);
      })
      .once("listening", () => {
        tester.close(() => resolve(true));
      })
      .listen(port, "127.0.0.1");
  });
}

async function findAvailablePort(preferredPort, maxOffset = 50, blockedPorts = []) {
  for (let offset = 0; offset <= maxOffset; offset += 1) {
    const candidate = preferredPort + offset;
    if (blockedPorts.includes(candidate)) {
      continue;
    }
    // eslint-disable-next-line no-await-in-loop
    const available = await isPortAvailable(candidate);
    if (available) {
      return candidate;
    }
  }
  throw new Error(`No available port found near ${preferredPort}`);
}

async function waitForApiReady(apiOrigin) {
  await waitForCondition(async () => {
    const health = await fetchText(`${apiOrigin}/health`);
    if (health.statusCode !== 200 || !health.body.includes("ok")) {
      return false;
    }

    const products = await fetchText(`${apiOrigin}/api/products?limit=1`);
    if (products.statusCode !== 200) {
      return false;
    }
    try {
      const json = JSON.parse(products.body);
      return Array.isArray(json.items);
    } catch {
      return false;
    }
  }, 45_000);
}

async function waitForWebReady(webOrigin) {
  await waitForCondition(async () => {
    const home = await fetchText(webOrigin);
    return home.statusCode === 200;
  }, 60_000);
}

function findWebServer(runtimeRoot) {
  const directCandidates = [
    path.join(runtimeRoot, "web", "server.js"),
    path.join(runtimeRoot, "web", "apps", "web", "server.js")
  ];
  for (const candidate of directCandidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  const queue = [path.join(runtimeRoot, "web")];
  while (queue.length) {
    const dir = queue.shift();
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const target = path.join(dir, entry.name);
      if (entry.isFile() && entry.name === "server.js") {
        return target;
      }
      if (entry.isDirectory() && entry.name !== "node_modules") {
        queue.push(target);
      }
    }
  }

  throw new Error("Unable to locate Next.js standalone server.js in desktop/runtime/web");
}

async function bootServices(runtimeRoot) {
  const backendEntry = path.join(runtimeRoot, "api", "server.cjs");
  if (!fs.existsSync(backendEntry)) {
    throw new Error(`Backend runtime missing: ${backendEntry}`);
  }

  const apiPort = await findAvailablePort(API_PORT_DEFAULT);
  const webPort = await findAvailablePort(WEB_PORT_DEFAULT, 50, [apiPort]);
  const apiOrigin = `http://127.0.0.1:${apiPort}`;
  const webOrigin = `http://127.0.0.1:${webPort}`;
  logLine(`Selected ports -> api:${apiPort} web:${webPort}`);

  process.env.PORT = String(apiPort);
  process.env.CORS_ORIGIN = webOrigin;
  process.env.JWT_SECRET = process.env.JWT_SECRET || "desktop-runtime-secret";
  require(backendEntry);
  await waitForApiReady(apiOrigin);
  logLine("API ready");

  const webServerEntry = findWebServer(runtimeRoot);
  process.env.PORT = String(webPort);
  process.env.HOSTNAME = "127.0.0.1";
  process.env.NODE_ENV = "production";
  process.env.API_BASE_URL = apiOrigin;
  process.env.NEXT_PUBLIC_API_BASE_URL = apiOrigin;

  const webServerDir = path.dirname(webServerEntry);
  process.chdir(webServerDir);
  require(webServerEntry);
  await waitForWebReady(webOrigin);
  logLine(`Web ready at ${webOrigin}`);

  return {
    webOrigin
  };
}

function createMainWindow(webOrigin) {
  const window = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1100,
    minHeight: 720,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      sandbox: false
    }
  });

  window.webContents.on("console-message", (_event, level, message, line, sourceId) => {
    logLine(`[renderer:${level}] ${message} (${sourceId}:${line})`);
  });
  window.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedURL) => {
    logLine(`did-fail-load code=${errorCode} desc=${errorDescription} url=${validatedURL}`);
  });
  window.webContents.on("render-process-gone", (_event, details) => {
    logLine(`render-process-gone reason=${details.reason} exitCode=${details.exitCode}`);
  });
  window.webContents.on("unresponsive", () => {
    logLine("renderer became unresponsive");
  });

  logLine(`Loading window URL: ${webOrigin}`);
  window.loadURL(webOrigin);
}

app.whenReady().then(async () => {
  try {
    try {
      fs.writeFileSync(LOG_FILE, "", "utf8");
    } catch {
      // ignore
    }
    logLine("App startup");
    const runtimeRoot = path.join(__dirname, "runtime");
    const { webOrigin } = await bootServices(runtimeRoot);
    createMainWindow(webOrigin);
  } catch (error) {
    logLine(`Startup error: ${error instanceof Error ? error.stack || error.message : String(error)}`);
    dialog.showErrorBox(
      "PMModern failed to start",
      error instanceof Error ? error.message : "Unknown startup error"
    );
    app.quit();
  }
});

app.on("window-all-closed", () => {
  logLine("All windows closed. Quitting.");
  app.quit();
});

process.on("uncaughtException", (error) => {
  logLine(`uncaughtException: ${error.stack || error.message}`);
});

process.on("unhandledRejection", (reason) => {
  logLine(`unhandledRejection: ${String(reason)}`);
});
