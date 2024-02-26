import "@testing-library/jest-dom";

// ignoring css parsing problem of component libraries
const originalConsoleError = console.error;
console.error = function (...data) {
  if (
    typeof data[0]?.toString === "function" &&
    data[0].toString().includes("Error: Could not parse CSS stylesheet")
  )
    return;
  originalConsoleError(...data);
};
