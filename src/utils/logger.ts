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

const lastLogs: { [key: string]: number } = {};
export const TimeThrottledLogger = (id: string, ...args: unknown[]) => {
  const currentTime = new Date().getTime();
  if (!(lastLogs[id] && currentTime < lastLogs[id] + 1000)) {
    console.log(id, ...args);
    lastLogs[id] = currentTime;
  }
};