import scrollIntoView from "scroll-into-view-if-needed";

const FOCUS_ATTEMPT_DELAY = 500;

function triggerScroll(targetNode: Element) {
  scrollIntoView(targetNode, {
    scrollMode: "if-needed",
    behavior: "smooth",
    block: "center",
    inline: "start",
  });
}

export function throttledScroller(
  domElementQuery: string,
  postScrollAction?: () => void
) {
  // Timeout ensures that targetNode is accessed only after its rendered
  let pendingScrollerTimeoutId: NodeJS.Timeout;

  const alreadyRenderedTargetNode = document.querySelector(domElementQuery);

  if (alreadyRenderedTargetNode) {
    // Immediate scroll possible
    triggerScroll(alreadyRenderedTargetNode);
    postScrollAction?.();
  } else {
    // Wait for target node to render
    pendingScrollerTimeoutId = setTimeout(() => {
      const targetNode = document.querySelector(domElementQuery);

      if (targetNode) {
        pendingScrollerTimeoutId = setTimeout(() => {
          triggerScroll(targetNode);
        }, FOCUS_ATTEMPT_DELAY);

        postScrollAction?.();
      }
    });
  }

  return () => {
    clearTimeout(pendingScrollerTimeoutId);
  };
}
