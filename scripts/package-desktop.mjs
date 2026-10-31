import { cpSync, mkdirSync, existsSync, rmSync, renameSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve('D:/Antigravity-work/Bilight_src');
const softwareDir = resolve('D:/software');
const bilightDir = join(softwareDir, 'Bilight');
const coreDir = join(bilightDir, 'core');
const electronDist = join(root, 'node_modules/electron/dist');
const appDir = join(coreDir, 'resources/app');
const iconIco = join(root, 'branding/anime-icon.ico');
const iconPng = join(root, 'branding/anime-icon.png');
const rceditExe = join(root, 'node_modules/rcedit/bin/rcedit-x64.exe');
const cscExe = 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';

console.log('1. Cleaning D:\\software\\Bilight ...');
// Delete loose root exe in D:\software if it existed
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

console.log('3. Injecting anime icon and version info into core/Bilight.exe ...');
if (existsSync(rceditExe) && existsSync(iconIco)) {
  execFileSync(rceditExe, [
    coreExe,
    '--set-icon', iconIco,
    '--set-version-string', 'FileDescription', 'Bilight 客户端核心',
    '--set-version-string', 'ProductName', 'Bilight',
    '--set-version-string', 'CompanyName', 'Ownhelm / Bilight Project',
    '--set-version-string', 'LegalCopyright', 'MIT License',
    '--set-file-version', '1.0.0.0',
    '--set-product-version', '1.0.0.0'
  ], { stdio: 'inherit' });
}

console.log('4. Copying Bilight application bundle to core/resources/app ...');
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

console.log('5. Copying production server dependencies...');
cpSync(join(root, 'node_modules'), join(appDir, 'node_modules'), {
  recursive: true,
  filter: (src) => {
    const normalized = src.replace(/\\/g, '/');
    if (normalized.includes('/node_modules/electron/dist')) return false;
    if (normalized.includes('/node_modules/rcedit')) return false;
    if (normalized.includes('/.bin')) return false;
    return true;
  }
});

console.log('6. Compiling top-level Bilight.exe launcher in D:\\software\\Bilight ...');
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

console.log('=====================================================');
console.log('SUCCESS! Folder structure in D:\\software\\Bilight:');
console.log('  D:\\software\\Bilight\\Bilight.exe (主程序入口，萌系二次元图标)');
console.log('  D:\\software\\Bilight\\core\\       (底层引擎、DLL及组件目录)');
console.log('  D:\\software\\Bilight\\data\\       (用户独立数据及缓存目录)');
console.log('=====================================================');
