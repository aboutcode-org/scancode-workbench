const debugClasses = new Set([
  // 'add file',
  // 'file processor',
])

export const DebugLogger = (debugClass: string, ...args: unknown[]) => {
  if(debugClasses.has(debugClass))
    console.log(...args);
}