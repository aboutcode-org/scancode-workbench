const debugClasses = new Set([
  // 'add file',
  // 'file processor',
  // 'license exp processor',
  // 'license policy processor',
  // 'copyright processor',
  // 'package processor',
  // 'email processor',
  // 'URL processor',
  // 'scan error processor',
]);

export const DebugLogger = (debugClass: string, ...args: unknown[]) => {
  if (debugClasses.has(debugClass)) console.log(...args);
};
