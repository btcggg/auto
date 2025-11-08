(() => {
  if (window.AutoClickLogger) {
    return;
  }

  const prefix = "[AutoClick]";

  const formatTime = date =>
    `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;

  window.AutoClickLogger = {
    info: (...args) => console.log(prefix, ...args),
    warn: (...args) => console.warn(prefix, ...args),
    error: (...args) => console.error(prefix, ...args),
    logClick: (count, date) =>
      console.log(
        `${prefix} Click #${count} at ${formatTime(date)} (${date.toISOString()})`
      )
  };
})();
