# Countdown Admin Guide - BACKEND ONLY

## Overview
The application now includes a flexible countdown system that allows you to switch between three different modes:

1. **Original Countdown** - Shows the original countdown based on `stageEnd` from the presale context
2. **Custom Countdown** - Shows a custom countdown with random reset logic
3. **Hidden** - Completely hides the countdown section

**IMPORTANT**: This is a backend-only control system. Users cannot see or access these controls.

## How to Control the Countdown

### Backend Configuration (ONLY Method)
1. Open `/workspace/BBN/src/utils/CountdownConfig.js`
2. Change the `mode` value to one of:
   - `'original'` - Original countdown
   - `'custom'` - Custom countdown  
   - `'hidden'` - Hide countdown completely
3. Save the file
4. Rebuild the application: `npm run build`
5. Restart the server: `pkill -f "node server.js" && node server.js > server.log 2>&1 &`

## Custom Countdown Logic

The custom countdown follows this behavior:
- **Start Time**: Random duration between 22 minutes and 1 hour 38 minutes
- **Countdown Direction**: Counts DOWN from the random start time
- **Reset Logic**: When countdown reaches between 20 seconds and 3 minutes, it automatically resets
- **Reset Behavior**: Immediately jumps to a new random start time (22min - 1h38min)
- **Continuous Loop**: This process repeats indefinitely
- **Persistence**: ✅ **NEW**: Countdown state persists across page refreshes using localStorage
- **User Experience**: Users see the same countdown time even after refreshing the page

## Technical Details

### Files Modified/Created:
- `/src/sections/banner/v6/Banner.jsx` - Updated to support countdown modes
- `/src/components/countdown/CustomCountdown.jsx` - New custom countdown component
- `/src/utils/CountdownConfig.js` - Backend configuration file for countdown modes

### Current Configuration:
The countdown is currently set to: **custom** mode

### Security:
✅ **SECURE**: No frontend controls - only backend configuration file access

## Troubleshooting

### Changes Not Applied
- Ensure you rebuild the application: `npm run build`
- Restart the server after rebuilding
- Clear browser cache if needed
- Check that the mode value in CountdownConfig.js is correctly set

### Custom Countdown Not Working
- Check browser console for errors
- Ensure the CustomCountdown component is properly imported
- Verify the countdown mode is set to 'custom' in CountdownConfig.js
- Make sure you rebuilt and restarted after changes

### Countdown Not Hidden
- Verify mode is set to 'hidden' in CountdownConfig.js
- Rebuild and restart the server
- Check that the conditional rendering logic is working in Banner.jsx

### Reset Custom Countdown (if needed)
If you need to reset the custom countdown to start fresh:
```bash
# This will clear the saved countdown state for all users
# Users will get a new random countdown on their next visit
```
**Note**: The countdown automatically resets when it reaches the threshold, so manual reset is rarely needed.

## Quick Commands

### To Switch to Custom Countdown:
```bash
# 1. Edit the config file
sed -i "s/mode: 'original'/mode: 'custom'/" /workspace/BBN/src/utils/CountdownConfig.js

# 2. Rebuild and restart
cd /workspace/BBN
npm run build
pkill -f "node server.js"
node server.js > server.log 2>&1 &
```

### To Hide Countdown:
```bash
# 1. Edit the config file  
sed -i "s/mode: 'original'/mode: 'hidden'/" /workspace/BBN/src/utils/CountdownConfig.js

# 2. Rebuild and restart
cd /workspace/BBN
npm run build
pkill -f "node server.js"
node server.js > server.log 2>&1 &
```

### To Restore Original Countdown:
```bash
# 1. Edit the config file
sed -i "s/mode: 'custom'/mode: 'original'/" /workspace/BBN/src/utils/CountdownConfig.js
# OR
sed -i "s/mode: 'hidden'/mode: 'original'/" /workspace/BBN/src/utils/CountdownConfig.js

# 2. Rebuild and restart
cd /workspace/BBN
npm run build
pkill -f "node server.js"
node server.js > server.log 2>&1 &
```