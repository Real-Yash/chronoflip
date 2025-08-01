import { useState, useEffect, useCallback, useRef } from "react";

interface PomodoroTimerProps {
  pomodoroMinutes: number;
  breakMinutes: number;
  onSessionComplete: (sessionType: 'pomodoro' | 'break') => void;
}

export function usePomodoroTimer({ 
  pomodoroMinutes, 
  breakMinutes, 
  onSessionComplete 
}: PomodoroTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(pomodoroMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState<'pomodoro' | 'break'>('pomodoro');
  const [sessionCount, setSessionCount] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer when duration settings change
  useEffect(() => {
    if (!isRunning) {
      setTimeRemaining(currentSession === 'pomodoro' ? pomodoroMinutes * 60 : breakMinutes * 60);
    }
  }, [pomodoroMinutes, breakMinutes, currentSession, isRunning]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            onSessionComplete(currentSession);
            
            // Auto-switch to next session
            setTimeout(() => {
              if (currentSession === 'pomodoro') {
                setCurrentSession('break');
                setTimeRemaining(breakMinutes * 60);
              } else {
                setCurrentSession('pomodoro');
                setTimeRemaining(pomodoroMinutes * 60);
                setSessionCount(prev => prev + 1);
              }
            }, 1000);
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining, currentSession, pomodoroMinutes, breakMinutes, onSessionComplete]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(currentSession === 'pomodoro' ? pomodoroMinutes * 60 : breakMinutes * 60);
  }, [currentSession, pomodoroMinutes, breakMinutes]);

  const switchMode = useCallback((mode: 'pomodoro' | 'break') => {
    setIsRunning(false);
    setCurrentSession(mode);
    setTimeRemaining(mode === 'pomodoro' ? pomodoroMinutes * 60 : breakMinutes * 60);
  }, [pomodoroMinutes, breakMinutes]);

  const totalTime = currentSession === 'pomodoro' ? pomodoroMinutes * 60 : breakMinutes * 60;
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;

  return {
    timeRemaining,
    isRunning,
    currentSession,
    sessionCount,
    progress,
    start,
    pause,
    reset,
    switchMode
  };
}
