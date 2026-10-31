const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');

// Single-instance lock: ensure only one client runs
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

// 1. Data Directory: neatly encapsulated under software's data directory
const exeDir = path.dirname(app.getPath('exe'));
const parentDir = path.dirname(exeDir);
const dataRoot = path.basename(exeDir).toLowerCase() === 'core'
  ? path.join(parentDir, 'data')
  : path.join(exeDir, 'data');

const secretsDir = path.join(dataRoot, 'secrets');
const storageDir = path.join(dataRoot, 'storage');
const masterKeyFile = path.join(secretsDir, 'master-key');
const stateFile = path.join(dataRoot, 'window-state.json');

fs.mkdirSync(secretsDir, { recursive: true });
fs.mkdirSync(storageDir, { recursive: true });

if (!fs.existsSync(masterKeyFile)) {
  fs.writeFileSync(masterKeyFile, crypto.randomBytes(32));
}

process.env.DATA_DIR = storageDir;
process.env.BILIGHT_KEY_FILE = masterKeyFile;
process.env.PORT = process.env.PORT || '3880';
process.env.HOST = '127.0.0.1';
process.env.NODE_ENV = 'production';

// Redirect all Electron caches, storage, and indexedDB to D:\ drive
app.setPath('userData', path.join(dataRoot, 'electron_userData'));
app.setPath('sessionData', path.join(dataRoot, 'electron_sessionData'));

// 2. Hardware Acceleration, High Refresh Rate & Video Engine Tuning
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoding,PlatformHEVCDecoderSupport,CanvasOopRasterization,AudioServiceOutOfProcess,D3D11VideoDecoder,D3D11VideoProcessor');
app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('use-angle', 'd3d11');
app.commandLine.appendSwitch('enable-accelerated-video-decode');
app.commandLine.appendSwitch('force-color-profile', 'srgb');
app.commandLine.appendSwitch('high-dpi-support', '1');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

let mainWindow = null;
let serverInstance = null;

function loadWindowState() {
  try {
    if (fs.existsSync(stateFile)) {
      return JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    }
  } catch {}
  return { width: 1320, height: 860, isMaximized: false };
}

function saveWindowState() {
  if (!mainWindow) return;
  try {
    const isMaximized = mainWindow.isMaximized();
    const bounds = mainWindow.getBounds();
    fs.writeFileSync(stateFile, JSON.stringify({ ...bounds, isMaximized }));
  } catch {}
}

async function startServer() {
  const { BiliHttp } = await import('../dist-server/server/transport.js');
  const { SecretStore } = await import('../dist-server/server/store.js');
  const { AuthService } = await import('../dist-server/server/auth.js');
  const { BiliGateway } = await import('../dist-server/server/gateway.js');
  const { createApp } = await import('../dist-server/server/app.js');

  const key = fs.readFileSync(masterKeyFile);
  const store = new SecretStore(path.join(storageDir, 'bilight.sqlite'), key);
  const http = new BiliHttp();
  const auth = new AuthService(http, store);
  await auth.init();
  const gateway = new BiliGateway(http);
  const staticDir = path.resolve(__dirname, '../dist');
  const fastifyApp = await createApp({ auth, gateway, key, staticDir });
  const port = Number(process.env.PORT);
  await fastifyApp.listen({ port, host: '127.0.0.1' });
  serverInstance = { fastifyApp, auth, store };
  return port;
}

function createWindow(port) {
  const iconPath = path.join(__dirname, 'anime-icon.png');
  const state = loadWindowState();

  mainWindow = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width || 1320,
    height: state.height || 860,
    minWidth: 860,
    minHeight: 620,
    title: 'Bilight',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    autoHideMenuBar: true,
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
      webSecurity: true,
      spellcheck: false
    }
  });

  if (state.isMaximized) {
    mainWindow.maximize();
  }

  // Keyboard navigation & shortcuts
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F11') {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
      event.preventDefault();
    } else if (input.key === 'Escape' && mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
      event.preventDefault();
    } else if (input.key === 'F12' || (input.control && input.shift && input.key.toUpperCase() === 'I')) {
      mainWindow.webContents.toggleDevTools();
      event.preventDefault();
    } else if (input.key === 'F5' || (input.control && input.key.toUpperCase() === 'R')) {
      mainWindow.reload();
      event.preventDefault();
    }
  });

  mainWindow.loadURL(`http://127.0.0.1:${port}/`);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('close', () => {
    saveWindowState();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.whenReady().then(async () => {
  try {
    const port = await startServer();
    createWindow(port);
  } catch (err) {
    console.error('Failed to start Bilight Desktop:', err);
    app.quit();
  }
});

app.on('window-all-closed', async () => {
  saveWindowState();
  if (serverInstance) {
    try {
      await serverInstance.fastifyApp.close();
      await serverInstance.auth.close();
      serverInstance.store.close();
    } catch (e) {
      console.error('Error closing server:', e);
    }
  }
  app.quit();
});
