import { cpSync, mkdirSync, existsSync, rmSync, renameSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve('D:/Antigravity-work/Bilight_src');
const softwareDir = resolve('D:/software');
const bilightDir = join(softwareDir, 'Bilight');
const coreDir = join(bilightDir, 'core');
const electronDist = join(root, 'node_modules/electron/dist');
const appDir = join(coreDir, 'resources/app');
const iconIco = join(root, 'branding/anime-icon.ico');
const rceditExe = join(root, 'node_modules/rcedit/bin/rcedit-x64.exe');
const cscExe = 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';

console.log('1. Cleaning D:\\software\\Bilight ...');
const looseExe = join(softwareDir, 'Bilight.exe');
if (existsSync(looseExe)) {
  rmSync(looseExe, { force: true });
}

if (existsSync(bilightDir)) {
  rmSync(bilightDir, { recursive: true, force: true });
}
mkdirSync(bilightDir, { recursive: true });
mkdirSync(coreDir, { recursive: true });

console.log('2. Copying Electron runtime binaries into core/ ...');
cpSync(electronDist, coreDir, { recursive: true });

// Rename electron.exe to Bilight.exe inside core/
const coreExe = join(coreDir, 'Bilight.exe');
if (existsSync(join(coreDir, 'electron.exe'))) {
  renameSync(join(coreDir, 'electron.exe'), coreExe);
}

// Remove default_app.asar
const defaultApp = join(coreDir, 'resources/default_app.asar');
if (existsSync(defaultApp)) {
  rmSync(defaultApp, { force: true });
}

console.log('3. Slimming: Pruning unused locales (saving ~46MB) ...');
const localesDir = join(coreDir, 'locales');
if (existsSync(localesDir)) {
  const keepLocales = new Set(['zh-CN.pak', 'zh-TW.pak', 'en-US.pak']);
  for (const file of readdirSync(localesDir)) {
    if (!keepLocales.has(file)) {
      rmSync(join(localesDir, file), { force: true });
    }
  }
}

console.log('4. Injecting anime icon and version metadata into core/Bilight.exe ...');
if (existsSync(rceditExe) && existsSync(iconIco)) {
  execFileSync(rceditExe, [
    coreExe,
    '--set-icon', iconIco,
    '--set-version-string', 'FileDescription', 'Bilight 客户端核心',
    '--set-version-string', 'ProductName', 'Bilight',
    '--set-version-string', 'CompanyName', 'Bilight Project',
    '--set-version-string', 'LegalCopyright', 'MIT License',
    '--set-file-version', '0.1.4.0',
    '--set-product-version', '0.1.4.0'
  ], { stdio: 'inherit' });
}

console.log('5. Packaging clean application bundle to core/resources/app ...');
mkdirSync(appDir, { recursive: true });
cpSync(join(root, 'dist'), join(appDir, 'dist'), { recursive: true });
cpSync(join(root, 'dist-server'), join(appDir, 'dist-server'), { recursive: true });
cpSync(join(root, 'desktop'), join(appDir, 'desktop'), { recursive: true });
cpSync(join(root, 'shared'), join(appDir, 'shared'), { recursive: true });

// App package.json
writeFileSync(join(appDir, 'package.json'), JSON.stringify({
  name: 'bilight-desktop',
  version: '0.1.4',
  main: 'desktop/main.cjs'
}, null, 2));

console.log('6. Slimming: Copying minimal production runtime dependencies (saving ~200MB) ...');
const prodSource = 'D:/Antigravity-work/temp_prod_modules/node_modules';
const targetModules = join(appDir, 'node_modules');

if (existsSync(prodSource)) {
  cpSync(prodSource, targetModules, { recursive: true });
} else {
  // Fallback: copy only essential server runtime packages
  const runtimePkgs = [
    'fastify', '@fastify', 'fast-xml-parser', 'tough-cookie', 'strnum',
    'tldts', 'tldts-core', 'abstract-logging', 'avvio', 'fastq', 'find-my-way',
    'light-my-request', 'pino', 'pino-std-serializers', 'process-warning',
    'quick-format-unescaped', 'real-require', 'reusify', 'rfdc', 'secure-json-parse',
    'semver', 'set-cookie-parser', 'sonic-boom', 'split2', 'thread-stream', 'atomic-sleep'
  ];
  mkdirSync(targetModules, { recursive: true });
  for (const pkg of runtimePkgs) {
    const src = join(root, 'node_modules', pkg);
    if (existsSync(src)) {
      cpSync(src, join(targetModules, pkg), { recursive: true });
    }
  }
}

console.log('7. Compiling top-level Bilight.exe launcher in D:\\software\\Bilight ...');
const cleanMainExe = join(bilightDir, 'Bilight.exe');
const launcherCs = join(root, 'desktop/launcher.cs');
if (existsSync(cscExe) && existsSync(launcherCs)) {
  execFileSync(cscExe, [
    '/nologo',
    '/target:winexe',
    `/win32icon:${iconIco}`,
    `/out:${cleanMainExe}`,
    launcherCs
  ], { stdio: 'inherit' });
}

function getDirSize(dir) {
  let size = 0;
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, item.name);
    if (item.isDirectory()) size += getDirSize(p);
    else size += statSync(p).size;
  }
  return size;
}

const finalCoreMb = (getDirSize(coreDir) / 1024 / 1024).toFixed(2);
console.log('=====================================================');
console.log(`SLIMMED PACKAGE COMPLETE: core directory is only ${finalCoreMb} MB!`);
console.log('Structure:');
console.log('  D:\\software\\Bilight\\Bilight.exe (主程序入口，萌系二次元图标)');
console.log('  D:\\software\\Bilight\\core\\       (精简瘦身后的核心运行库与组件)');
