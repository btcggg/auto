(() => {
  if (window.__autoClickSessionControllerLoaded) {
    return;
  }
  window.__autoClickSessionControllerLoaded = true;

  const config = window.AutoClickConfig;
  const logger = window.AutoClickLogger;
  const dom = window.AutoClickDOM;
  const panel = window.AutoClickPanel;

  if (!config || !logger || !dom) {
    console.warn(
      "[AutoClick] Missing prerequisites (config/logger/dom). Controller not started."
    );
    return;
  }

  const activeSite =
    config.sites?.find(site => {
      try {
        return typeof site.match === "function"
          ? site.match(window.location.href)
          : false;
      } catch (error) {
        logger.error("Match function threw for site", site?.id, error);
        return false;
      }
    }) ?? null;

  if (!activeSite) {
    return;
  }

  const hasLabel = (label, expected) => {
    if (!label || !expected) {
      return false;
    }
    return label.includes(expected.trim().toLowerCase());
  };

  const state = {
    clickCount: 0,
    intervalId: null,
    verificationTimeoutId: null,
    rapidRetryTimeoutId: null,
    isPaused: false,
    lastButtonSource: null,
    hasConfirmedSession: false
  };

  const computeRapidRetryInterval = () => {
    const configured = activeSite.intervals?.rapidRetry;
    if (typeof configured === "number" && configured > 0) {
      return configured;
    }
    const checkInterval = activeSite.intervals?.check ?? 1_000;
    const derived = Math.floor(checkInterval / 10);
    return Math.max(250, Math.min(1_000, derived || 500));
  };

  const rapidRetryInterval = computeRapidRetryInterval();

  const updateStatus = text => {
    panel?.setStatus?.(text);
  };

  const applyPauseState = () => {
    panel?.setPaused?.(state.isPaused);
    updateStatus(
      state.isPaused ? "Monitoring paused" : "Monitoring active and checking"
    );
  };

  const togglePause = () => {
    state.isPaused = !state.isPaused;
    if (state.isPaused) {
      clearRapidRetry();
    } else {
      evaluateButton();
    }
    applyPauseState();
  };

  const initPanel = () => {
    if (!panel || typeof panel.init !== "function") {
      return;
    }
    panel.init({
      onToggle: () => {
        togglePause();
      },
      onRefresh: () => {
        updateStatus("Manual reload requested");
        window.location.reload();
      }
    });
    applyPauseState();
  };

  const registerButtonSource = source => {
    if (state.lastButtonSource === source) {
      return;
    }
    state.lastButtonSource = source;
    if (!source) {
      return;
    }
    const label =
      source === "fallback" ? "Fallback text search" : "Configured selector";
    logger.info(`Button located via: ${label}.`);
    updateStatus(`Button located via ${label.toLowerCase()}`);
  };

  const getButton = () => {
    const fromSelector = dom.qs(activeSite.selectors.startButton);
    if (fromSelector) {
      registerButtonSource("selector");
      return fromSelector;
    }
    const fallback = dom.findButtonByText([
      activeSite.expectations.startLabel,
      activeSite.expectations.stopLabel
    ]);
    if (fallback) {
      registerButtonSource("fallback");
    } else {
      registerButtonSource(null);
    }
    return fallback;
  };

  const clearRapidRetry = () => {
    window.clearTimeout(state.rapidRetryTimeoutId);
    state.rapidRetryTimeoutId = null;
  };

  const scheduleRapidRetry = () => {
    if (state.isPaused || state.hasConfirmedSession) {
      return;
    }
    clearRapidRetry();
    state.rapidRetryTimeoutId = window.setTimeout(() => {
      evaluateButton();
    }, rapidRetryInterval);
  };

  const markSessionRunning = (statusText = "Session running") => {
    state.hasConfirmedSession = true;
    clearRapidRetry();
    updateStatus(statusText);
  };

  const verifyAfterClick = () => {
    window.clearTimeout(state.verificationTimeoutId);
    state.verificationTimeoutId = window.setTimeout(() => {
      const button = getButton();
      const label = dom.getLabel(button);
      if (hasLabel(label, activeSite.expectations.stopLabel)) {
        logger.info("Session confirmed running after click.");
        markSessionRunning();
        return;
      }
      logger.warn(
        "Button did not switch to Stop session within timeout. Reloading page."
      );
      updateStatus("Reloading page for retry");
      window.location.replace(activeSite.url);
    }, activeSite.intervals.postClickVerify);
  };

  const triggerClick = button => {
    state.clickCount += 1;
    logger.logClick(state.clickCount, new Date());
    clearRapidRetry();
    state.hasConfirmedSession = false;
    button.click();
    updateStatus("Start session clicked, verifying...");
    verifyAfterClick();
  };

  const evaluateButton = () => {
    if (state.isPaused) {
      logger.info("Monitoring paused; skipping button evaluation.");
      updateStatus("Paused (no checks running)");
      return;
    }

    const button = getButton();
    if (!button) {
      logger.warn("Start session button not found. Will retry.");
      updateStatus("Button not found, retrying soon");
      state.hasConfirmedSession = false;
      scheduleRapidRetry();
      return;
    }

    const label = dom.getLabel(button);

    if (hasLabel(label, activeSite.expectations.stopLabel)) {
      logger.info("Session already running.");
      markSessionRunning();
      return;
    }

    if (hasLabel(label, activeSite.expectations.startLabel)) {
      state.hasConfirmedSession = false;
      triggerClick(button);
      return;
    }

    logger.info("Button found but state is unknown:", label);
    updateStatus(`Unknown button state: ${label || "empty"}`);
    scheduleRapidRetry();
  };

  const startMonitoring = () => {
    logger.info("AutoClick controller active for", activeSite.label);
    initPanel();
    evaluateButton();
    state.intervalId = window.setInterval(
      evaluateButton,
      activeSite.intervals.check
    );
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startMonitoring, {
      once: true
    });
  } else {
    startMonitoring();
  }
})();
