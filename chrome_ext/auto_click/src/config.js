(() => {
  if (window.AutoClickConfig) {
    return;
  }

  const midnightWizardSite = {
    id: "midnightWizard",
    label: "Midnight Wizard Mine",
    match: url => url.startsWith("https://sm.midnight.gd/wizard/mine"),
    url: "https://sm.midnight.gd/wizard/mine",
    selectors: {
      startButton:
        "body > div.h-screen.w-screen.flex.items-center.justify-center.bg-surface-z-0-GD > div > main > div > div:nth-child(3) > div > button"
    },
    intervals: {
      check: 60_000,
      postClickVerify: 5_000
    },
    expectations: {
      startLabel: "Start session",
      stopLabel: "Stop session"
    }
  };

  window.AutoClickConfig = {
    sites: [midnightWizardSite]
  };
})();
