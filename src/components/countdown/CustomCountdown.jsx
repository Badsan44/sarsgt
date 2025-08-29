import { useEffect, useState } from "react";
import CountdownWrapper from "./Countdown.style";

const CustomCountdown = ({ ...props }) => {
  const [remainingTime, setRemainingTime] = useState({
    seconds: "00",
    minutes: "00",
    hours: "00",
    days: "00",
  });

  // Fixed parameters for user-specific countdown
  const MIN_DISPLAY_TIME = 22 * 60 * 1000; // 22 minutes minimum
  const MAX_DISPLAY_TIME = 98 * 60 * 1000; // 98 minutes maximum (1h 38m)
  const RESET_THRESHOLD_MIN = 20 * 1000; // 20 seconds
  const RESET_THRESHOLD_MAX = 180 * 1000; // 3 minutes

  // Seeded random number generator for consistent results
  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Generate truly stable device identifier that's identical across all browsers
  const getStableDeviceIdentifier = () => {
    // Use only characteristics that are identical across browsers on same device
    const deviceSignature = [
      screen.width,
      screen.height, 
      screen.colorDepth,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      navigator.platform,
      // Add current week to create weekly rotation but keep same within week
      Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7))
    ].join('|');
    
    // Convert to hash
    let hash = 0;
    for (let i = 0; i < deviceSignature.length; i++) {
      const char = deviceSignature.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash);
  };

  // Get user seed that's identical across all browsers and profiles
  const getUserSeed = () => {
    return getStableDeviceIdentifier();
  };

  // Get truly deterministic countdown state that's the same across refreshes
  const getDeterministicCountdownState = () => {
    const userSeed = getUserSeed();
    const now = Date.now();
    
    // Use hourly cycles for countdown rotation
    const CYCLE_DURATION = 60 * 60 * 1000; // 1 hour cycles
    const currentCycle = Math.floor(now / CYCLE_DURATION);
    
    // Generate deterministic values for this user and cycle
    const cycleSeed = userSeed + currentCycle;
    const durationSeed = seededRandom(cycleSeed);
    const thresholdSeed = seededRandom(cycleSeed + 1);
    
    // Calculate display duration (22-98 minutes)
    const displayDuration = MIN_DISPLAY_TIME + (durationSeed * (MAX_DISPLAY_TIME - MIN_DISPLAY_TIME));
    
    // Calculate reset threshold (20s-3min)
    const resetThreshold = RESET_THRESHOLD_MIN + (thresholdSeed * (RESET_THRESHOLD_MAX - RESET_THRESHOLD_MIN));
    
    // Calculate when this cycle started
    const cycleStartTime = currentCycle * CYCLE_DURATION;
    
    // The countdown should end at a fixed time within this cycle
    // This ensures the same end time regardless of when the page is refreshed
    const endTime = cycleStartTime + displayDuration;
    
    // If this countdown has already expired, move to the next cycle
    if (endTime <= now) {
      const nextCycle = currentCycle + 1;
      const nextCycleSeed = userSeed + nextCycle;
      const nextDurationSeed = seededRandom(nextCycleSeed);
      const nextDisplayDuration = MIN_DISPLAY_TIME + (nextDurationSeed * (MAX_DISPLAY_TIME - MIN_DISPLAY_TIME));
      const nextCycleStartTime = nextCycle * CYCLE_DURATION;
      const nextEndTime = nextCycleStartTime + nextDisplayDuration;
      
      return {
        endTime: Math.floor(nextEndTime),
        resetThreshold: Math.floor(resetThreshold),
        userSeed: userSeed,
        currentCycle: nextCycle,
        displayDuration: Math.floor(nextDisplayDuration)
      };
    }
    
    return {
      endTime: Math.floor(endTime),
      resetThreshold: Math.floor(resetThreshold),
      userSeed: userSeed,
      currentCycle: currentCycle,
      displayDuration: Math.floor(displayDuration)
    };
  };

  // Calculate countdown state once and store it
  const [countdownState, setCountdownState] = useState(null);

  useEffect(() => {
    // Initialize countdown state
    const initialState = getDeterministicCountdownState();
    setCountdownState(initialState);
  }, []);

  useEffect(() => {
    if (!countdownState) return;

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = countdownState.endTime - now;

      if (difference > 0) {
        // Check if we've reached the reset threshold
        if (difference <= countdownState.resetThreshold) {
          // Time to reset - generate new countdown state
          const userSeed = getUserSeed();
          const resetSeed = userSeed + Math.floor(now / (5 * 60 * 1000)); // Reset every 5 minutes for variation
          const newDurationSeed = seededRandom(resetSeed);
          
          const newDisplayDuration = MIN_DISPLAY_TIME + (newDurationSeed * (MAX_DISPLAY_TIME - MIN_DISPLAY_TIME));
          const newEndTime = now + newDisplayDuration;
          
          // Update countdown state
          const newState = {
            endTime: newEndTime,
            resetThreshold: countdownState.resetThreshold,
            userSeed: userSeed,
            displayDuration: newDisplayDuration
          };
          setCountdownState(newState);
          
          const newDifference = newEndTime - now;
          return {
            days: String(Math.floor(newDifference / (1000 * 60 * 60 * 24))).padStart(2, "0"),
            hours: String(Math.floor((newDifference / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
            minutes: String(Math.floor((newDifference / 1000 / 60) % 60)).padStart(2, "0"),
            seconds: String(Math.floor((newDifference / 1000) % 60)).padStart(2, "0"),
          };
        } else {
          // Normal countdown - just calculate time remaining
          return {
            days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, "0"),
            hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
            minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, "0"),
            seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, "0"),
          };
        }
      } else {
        // If countdown has expired, generate new countdown state
        const userSeed = getUserSeed();
        const fallbackSeed = userSeed + Math.floor(now / (10 * 60 * 1000)); // Every 10 minutes
        const fallbackDurationSeed = seededRandom(fallbackSeed);
        
        const fallbackDisplayDuration = MIN_DISPLAY_TIME + (fallbackDurationSeed * (MAX_DISPLAY_TIME - MIN_DISPLAY_TIME));
        const fallbackEndTime = now + fallbackDisplayDuration;
        
        // Update countdown state
        const newState = {
          endTime: fallbackEndTime,
          resetThreshold: countdownState.resetThreshold,
          userSeed: userSeed,
          displayDuration: fallbackDisplayDuration
        };
        setCountdownState(newState);
        
        const newDifference = fallbackEndTime - now;
        return {
          days: String(Math.floor(newDifference / (1000 * 60 * 60 * 24))).padStart(2, "0"),
          hours: String(Math.floor((newDifference / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
          minutes: String(Math.floor((newDifference / 1000 / 60) % 60)).padStart(2, "0"),
          seconds: String(Math.floor((newDifference / 1000) % 60)).padStart(2, "0"),
        };
      }
    };

    setRemainingTime(calculateTimeLeft());

    const timer = setInterval(() => {
      setRemainingTime(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownState]); // Depend on countdownState

  return (
    <CountdownWrapper {...props}>
      <div className="count-item">
        <span className="count">{remainingTime.days}</span>
        <span className="label">D</span>
      </div>
      <div className="count-item">
        <span className="count">{remainingTime.hours}</span>
        <span className="label">H</span>
      </div>
      <div className="count-item">
        <span className="count">{remainingTime.minutes}</span>
        <span className="label">M</span>
      </div>
      <div className="count-item">
        <span className="count">{remainingTime.seconds}</span>
        <span className="label">S</span>
      </div>
    </CountdownWrapper>
  );
};

export default CustomCountdown;