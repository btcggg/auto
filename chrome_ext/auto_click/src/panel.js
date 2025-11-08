(() => {
  if (window.AutoClickPanel) {
    return;
  }

  const PANEL_ID = "auto-click-control-panel";
  const STYLE_ID = "auto-click-control-panel-style";

  const ensureStyles = () => {
    if (document.getElementById(STYLE_ID)) {
      return;
    }
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${PANEL_ID} {
        position: fixed;
        bottom: 16px;
        right: 16px;
        z-index: 2147483647;
        background: rgba(16, 20, 24, 0.9);
        color: #f7fafc;
        padding: 10px 12px;
        border-radius: 8px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 220px;
      }

      #${PANEL_ID} .auto-click-controls {
        display: flex;
        gap: 8px;
      }

      #${PANEL_ID} .auto-click-button {
        border: none;
        border-radius: 6px;
        padding: 8px 10px;
        cursor: pointer;
        font-weight: 600;
        font-size: 13px;
        background: #22c55e;
        color: #04100c;
        transition: background 0.2s ease, transform 0.1s ease;
      }

      #${PANEL_ID}[data-state="paused"] .auto-click-toggle {
        background: #f87171;
        color: #210000;
      }

      #${PANEL_ID} .auto-click-button:hover {
        transform: translateY(-1px);
      }

      #${PANEL_ID} .auto-click-status {
        font-size: 12px;
        opacity: 0.85;
      }
    `;
    document.head.appendChild(style);
  };

  const createPanel = () => {
    const root = document.createElement("div");
    root.id = PANEL_ID;

    const controls = document.createElement("div");
    controls.className = "auto-click-controls";

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.textContent = "AutoClick: Initializing...";
    toggleButton.className = "auto-click-button auto-click-toggle";

    const reloadButton = document.createElement("button");
    reloadButton.type = "button";
    reloadButton.textContent = "Reload page";
    reloadButton.className = "auto-click-button auto-click-reload";

    const status = document.createElement("div");
    status.className = "auto-click-status";
    status.textContent = "Status: Preparing controller";

    controls.appendChild(toggleButton);
    controls.appendChild(reloadButton);

    root.appendChild(controls);
    root.appendChild(status);

    return { root, toggleButton, reloadButton, status };
  };

  let panelElements = null;
  let toggleHandler = null;
  let refreshHandler = null;

  const ensurePanel = () => {
    ensureStyles();
    if (!panelElements) {
      panelElements = createPanel();
      document.body.appendChild(panelElements.root);
    }
    return panelElements;
  };

  window.AutoClickPanel = {
    init({ onToggle, onRefresh } = {}) {
      toggleHandler = onToggle;
      refreshHandler = onRefresh;
      const panel = ensurePanel();
      panel.toggleButton.onclick = () => {
        toggleHandler?.();
      };
      panel.reloadButton.onclick = () => {
        refreshHandler?.();
      };
      return panel;
    },
    setPaused(isPaused) {
      if (!panelElements) {
        return;
      }
      panelElements.root.dataset.state = isPaused ? "paused" : "running";
      panelElements.toggleButton.textContent = isPaused
        ? "AutoClick: Paused (click to resume)"
        : "AutoClick: Monitoring (click to pause)";
    },
    setStatus(text) {
      if (!panelElements) {
        return;
      }
      panelElements.status.textContent = `Status: ${text}`;
    }
  };
})();
