(() => {
  if (window.AutoClickDOM) {
    return;
  }

  const qs = (selector, root = document) => {
    try {
      return root.querySelector(selector);
    } catch (error) {
      window.AutoClickLogger?.warn?.(
        "Invalid selector supplied to AutoClickDOM.qs",
        selector,
        error
      );
      return null;
    }
  };

  const getLabel = element =>
    element ? element.textContent.trim().toLowerCase() : "";

  const findButtonByText = labels => {
    const normalized =
      labels
        ?.map(label => label?.trim().toLowerCase())
        .filter(Boolean) ?? [];
    if (!normalized.length) {
      return null;
    }
    return Array.from(document.querySelectorAll("button")).find(button => {
      const label = getLabel(button);
      return normalized.some(target => label.includes(target));
    });
  };

  window.AutoClickDOM = {
    qs,
    getLabel,
    findButtonByText
  };
})();
