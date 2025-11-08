## Auto Session Keeper

Automatically keeps the Midnight wizard session alive by clicking **Start session** whenever needed.

### Install
1. Open Chrome and visit `chrome://extensions`.
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select `chrome_ext/auto_click`.

### How it works
- A content script runs on `https://sm.midnight.gd/wizard/mine`.
- Every 60 seconds it checks the target button defined in `src/config.js`.
- If the label reads `Start session`, the script clicks it, logs the click count + timestamp, and waits 5 seconds.
- When the button fails to show `Stop session` within 5 seconds, the page reloads to retry.
- Utilities (`config`, `logger`, `dom`, `sessionController`) are split into separate files so you can reuse them for other sites by adding new entries to `AutoClickConfig.sites`.

### Customization
- Update intervals or selectors inside `src/config.js`.
- Add more site definitions to the `sites` array to support additional pages with similar logic.
