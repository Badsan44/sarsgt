// BACKEND COUNTDOWN CONFIGURATION
// ================================
// This file controls the countdown behavior on the website
// ONLY YOU (backend admin) should modify this file
// Users cannot see or access this configuration

export const CountdownConfig = {
  // Set the countdown mode:
  // 'original' - Shows the original countdown based on stageEnd
  // 'custom'   - Shows custom countdown with random reset logic  
  // 'hidden'   - Completely hides the countdown section
  mode: 'custom', // Change this value to switch modes
  
  // After changing the mode:
  // 1. Save this file
  // 2. Run: npm run build
  // 3. Restart the server
  // 4. Changes will be live on the website
};

// Helper function to get the current mode
export const getCountdownMode = () => {
  return CountdownConfig.mode;
};