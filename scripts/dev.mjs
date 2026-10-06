import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
if (existsSync('.env') && process.loadEnvFile) process.loadEnvFile('.env');
const children = [spawn(process.execPath, ['server/index.js'], { stdio: 'inherit' }), spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5182', '--strictPort', ...process.argv.slice(2)], { stdio: 'inherit' })];
let stopping = false;
function stop(code = 0) { if (stopping) return; stopping = true; children.forEach(child => child.kill()); process.exitCode = code; }
children.forEach(child => { child.on('error', () => stop(1)); child.on('exit', code => stop(code || 0)); });
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
