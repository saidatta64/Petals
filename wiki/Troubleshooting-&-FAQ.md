# ❓ Troubleshooting & FAQ

This page addresses common issues, debugging techniques, and frequently asked questions for developers and users of **Petals**.

---

## 🛠️ Frequently Encountered Issues

### 1. `better-sqlite3` Native Module Compilation Errors

**Symptom**: Running `npm install` or `npm run dev` yields `node-gyp` error messages, or Electron throws `NODE_MODULE_VERSION mismatch`.

**Cause**: `better-sqlite3` is a C++ native extension that must be compiled specifically against Electron's Node ABI version.

**Solution**:
1. Ensure C/C++ build tools are installed:
   - **Windows**: Install Visual Studio Community with the *"Desktop development with C++"* workload or run:
     ```bash
     npm install --global --production windows-build-tools
     ```
2. Force rebuild native modules for Electron:
   - Run:
     ```bash
     npx electron-rebuild -f -w better-sqlite3
     ```

---

### 2. `window.taskflow is undefined` in Renderer

**Symptom**: Open React Developer Tools console shows `TypeError: Cannot read properties of undefined (reading 'tasks')`.

**Cause**: The preload script failed to load or context isolation failed to bind `window.taskflow`.

**Solution**:
- Ensure `electron/main.ts` correctly specifies the absolute path to `preload.js` in `webPreferences`:
  ```ts
  webPreferences: {
    preload: path.join(__dirname, '../electron/preload.js'),
    contextIsolation: true,
    nodeIntegration: false,
  }
  ```
- Run `npm run build:electron` to compile `electron/preload.ts` into JavaScript.

---

### 3. Desktop Toast Notifications Not Appearing

**Symptom**: Task reminders or background triggers do not show desktop popups.

**Cause**: OS-level notification permissions are disabled, or Windows AppUserModelID is missing.

**Solution**:
- **Windows**: On Windows 10/11, ensure Focus Assist / Do Not Disturb is disabled and system notifications are permitted for Petals in Windows Settings.
- Petals registers its Windows App User Model ID on startup via Electron's `app.setAppUserModelId('com.taskflow.app')`.

---

### 4. Blank White Screen on Production Packaging (`npm run build`)

**Symptom**: The packaged `.exe` opens to a completely blank screen.

**Cause**: Asset paths in HTML/JS renderer build defaulted to absolute `/` instead of relative `./`.

**Solution**:
- Verify `vite.config.ts` has `base: './'` set.
- Verify `package.json` has `"homepage": "./"`.

---

### 5. `http://localhost:5173` Port Conflict

**Symptom**: `npm run dev` fails because port 5173 is in use by another Vite process.

**Solution**:
- Kill any stray Vite or Node processes on your machine:
  - **Windows (PowerShell)**:
    ```powershell
    Get-Process -Name "node" | Stop-Process -Force
    ```
  - **macOS/Linux**:
    ```bash
    killall node
    ```

---

## ❓ Frequently Asked Questions (FAQ)

### Q: Is my data backed up to the cloud?
**A**: No. Petals is **100% offline-first**. All your tasks, notes, and preferences remain strictly on your local disk in `taskflow.db` and text files.

### Q: How can I back up my Petals data?
**A**: Simply copy your `taskflow.db` file to a backup drive or cloud folder (e.g. OneDrive/Google Drive). You can check your exact database path anytime inside **Settings**.

### Q: Can I edit notes created in Petals with external code editors like VS Code or Notepad++?
**A**: Yes! Internal notes are stored standard `.txt` files. Any edit made by external software is synced back into Petals.
