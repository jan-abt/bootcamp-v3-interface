// utils/logging.js
export function suppressMetaMaskLogs() {
  if (typeof window !== "undefined") {
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      // Suppress logs containing "MM_SDK-React"
      if (args.some(arg => typeof arg === "string" && arg.includes("MM_SDK-React"))) {
        return;
      }
      originalConsoleLog.apply(console, args);
    };
  }
}