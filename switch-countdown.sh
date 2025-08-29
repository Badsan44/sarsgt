#!/bin/bash

# Countdown Mode Switcher Script
# Usage: ./switch-countdown.sh [original|custom|hidden]

if [ $# -eq 0 ]; then
    echo "Usage: $0 [original|custom|hidden]"
    echo "Current mode:"
    grep "mode:" src/utils/CountdownConfig.js
    exit 1
fi

MODE=$1

if [[ "$MODE" != "original" && "$MODE" != "custom" && "$MODE" != "hidden" ]]; then
    echo "Error: Mode must be 'original', 'custom', or 'hidden'"
    exit 1
fi

echo "Switching countdown mode to: $MODE"

# Update the config file
sed -i "s/mode: '[^']*'/mode: '$MODE'/" src/utils/CountdownConfig.js

echo "Updated configuration:"
grep "mode:" src/utils/CountdownConfig.js

echo "Building application..."
npm run build

echo "Restarting server..."
pkill -f "node server.js" 2>/dev/null
sleep 2
node server.js > server.log 2>&1 &

echo "Server restarted. New countdown mode is active!"
echo "Access your website at: https://bnbmaga.com"