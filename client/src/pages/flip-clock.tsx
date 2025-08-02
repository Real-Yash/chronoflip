import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Settings, Maximize, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import FlipCard from "../components/flip-card";
import { usePomodoroTimer } from "../hooks/use-pomodoro-timer";
import { useSound } from "../hooks/use-sound";

type TimerMode = 'pomodoro' | 'break' | 'clock';

export default function FlipClock() {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [showSettings, setShowSettings] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [is24Hour, setIs24Hour] = useState(false);
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Auto-hide UI state
  const [hideUI, setHideUI] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  const { playNotificationSound } = useSound();
  
  const {
    timeRemaining,
    isRunning,
    sessionCount,
    currentSession,
    progress,
    start,
    pause,
    reset,
    switchMode
  } = usePomodoroTimer({
    pomodoroMinutes,
    breakMinutes,
    onSessionComplete: handleSessionComplete
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  // Handle user activity to control UI visibility
  const handleUserActivity = useCallback(() => {
    setLastActivity(Date.now());
    setHideUI(false);
  }, []);

  // Update current time every second when in clock mode
  useEffect(() => {
    if (mode === 'clock') {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  // Auto-hide UI after 10 seconds of inactivity
  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      if (now - lastActivity > 5000 && !showSettings && !showNotification) {
        setHideUI(true);
      }
    };

    const interval = setInterval(checkInactivity, 1000);
    return () => clearInterval(interval);
  }, [lastActivity, showSettings, showNotification]);

  // Track user interactions
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [handleUserActivity]);

  // Handle session completion
  function handleSessionComplete(sessionType: 'pomodoro' | 'break') {
    if (soundEnabled) {
      playNotificationSound();
    }
    setShowNotification(true);
  }

  // Get display time based on mode
  function getDisplayTime() {
    if (mode === 'clock') {
      let hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const seconds = currentTime.getSeconds();
      
      if (!is24Hour) {
        hours = hours % 12 || 12;
      }
      
      return {
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      };
    } else {
      const totalSeconds = timeRemaining;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      return {
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      };
    }
  }

  const displayTime = getDisplayTime();

  function handlePlayPause() {
    if (mode === 'clock') return;
    
    if (isRunning) {
      pause();
    } else {
      start();
    }
  }

  function handleReset() {
    if (mode === 'clock') return;
    reset();
  }

  function handleModeChange(newMode: TimerMode) {
    setMode(newMode);
    if (newMode !== 'clock') {
      switchMode(newMode);
    }
    pause();
  }

  function handleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  function getModeText() {
    if (mode === 'clock') return 'CURRENT TIME';
    if (mode === 'pomodoro') return 'POMODORO SESSION';
    return 'BREAK TIME';
  }

  function getProgressInfo() {
    if (mode === 'clock') return null;
    
    const totalTime = mode === 'pomodoro' ? pomodoroMinutes * 60 : breakMinutes * 60;
    const elapsed = totalTime - timeRemaining;
    
    return {
      elapsed: `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')} elapsed`,
      remaining: `${Math.floor(timeRemaining / 60)}:${String(timeRemaining % 60).padStart(2, '0')} remaining`,
      progress: (elapsed / totalTime) * 100
    };
  }

  const progressInfo = getProgressInfo();

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger keyboard shortcuts when settings dialog is open
      if (showSettings) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'KeyF':
          e.preventDefault();
          handleFullscreen();
          break;
        case 'KeyR':
          e.preventDefault();
          handleReset();
          break;
        case 'Escape':
          setShowSettings(false);
          setShowNotification(false);
          break;
        case 'Digit1':
          e.preventDefault();
          handleModeChange('pomodoro');
          break;
        case 'Digit2':
          e.preventDefault();
          handleModeChange('break');
          break;
        case 'Digit3':
          e.preventDefault();
          handleModeChange('clock');
          break;
      }
    }
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mode, isRunning, showSettings]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-white" style={{ backgroundColor: '#1b1b1d' }}>
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-gray-800/10 to-black/20 opacity-80"></div>
      
      {/* Mode Selection - Auto Hide */}
      <div className={`fixed top-4 md:top-8 left-1/2 transform -translate-x-1/2 z-10 transition-all duration-500 ${
        hideUI ? 'opacity-0 translate-y-[-20px] pointer-events-none' : 'opacity-100 translate-y-0'
      }`}>
        <div className="modern-glass rounded-2xl p-2 border border-white/10">
          <div className="flex items-center space-x-1">
            <Button
              onClick={() => handleModeChange('pomodoro')}
              className={mode === 'pomodoro' 
                ? 'px-4 md:px-6 py-2 md:py-3 rounded-xl bg-blue-500/20 border-blue-400/30 text-blue-200 hover:text-blue-100 text-xs md:text-sm font-medium' 
                : 'px-4 md:px-6 py-2 md:py-3 rounded-xl bg-transparent border-transparent text-gray-400 hover:text-white text-xs md:text-sm font-medium hover:bg-white/5'
              }
            >
              Pomodoro
            </Button>
            <Button
              onClick={() => handleModeChange('break')}
              className={mode === 'break' 
                ? 'px-4 md:px-6 py-2 md:py-3 rounded-xl bg-green-500/20 border-green-400/30 text-green-200 hover:text-green-100 text-xs md:text-sm font-medium' 
                : 'px-4 md:px-6 py-2 md:py-3 rounded-xl bg-transparent border-transparent text-gray-400 hover:text-white text-xs md:text-sm font-medium hover:bg-white/5'
              }
            >
              Break
            </Button>
            <Button
              onClick={() => handleModeChange('clock')}
              className={mode === 'clock' 
                ? 'px-4 md:px-6 py-2 md:py-3 rounded-xl bg-purple-500/20 border-purple-400/30 text-purple-200 hover:text-purple-100 text-xs md:text-sm font-medium' 
                : 'px-4 md:px-6 py-2 md:py-3 rounded-xl bg-transparent border-transparent text-gray-400 hover:text-white text-xs md:text-sm font-medium hover:bg-white/5'
              }
            >
              Clock
            </Button>
          </div>
        </div>
      </div>

      {/* Main Clock Display - Always Visible */}
      <div className="flex flex-col items-center space-y-8 z-10">
        {/* Time Display */}
        <div className="flex items-center justify-center space-x-3 md:space-x-6">
          {/* Hours */}
          <FlipCard value={displayTime.hours} size="large" />
          
          {/* Separator */}
          <div className={`text-5xl md:text-7xl lg:text-8xl font-mono font-light text-white/90 ${
            isRunning && mode !== 'clock' ? 'animate-pulse-slow' : ''
          }`}>:</div>
          
          {/* Minutes */}
          <FlipCard value={displayTime.minutes} size="large" />
          
          {/* Separator */}
          <div className={`text-6xl md:text-8xl lg:text-9xl font-mono font-light text-white/60 ${
            isRunning && mode !== 'clock' ? 'animate-pulse-slow' : ''
          }`}>:</div>
          
          {/* Seconds */}
          <FlipCard value={displayTime.seconds} size="small" />
        </div>
        
        {/* Session Info - Auto Hide */}
        <div className={`flex flex-col items-center space-y-2 transition-all duration-500 ${
          hideUI ? 'opacity-0 translate-y-[10px]' : 'opacity-100 translate-y-0'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${
              mode === 'pomodoro' ? 'bg-blue-400 animate-pulse' :
              mode === 'break' ? 'bg-green-400 animate-pulse' :
              'bg-purple-400 animate-pulse'
            }`}></div>
            <span className="text-base md:text-lg font-medium text-white/80">{getModeText()}</span>
          </div>
          {mode !== 'clock' && (
            <div className="text-xs md:text-sm text-white/50">
              Session {sessionCount} - {currentSession === 'pomodoro' ? 'Work' : 'Break'}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar - Auto Hide */}
      {progressInfo && (
        <div className={`fixed bottom-32 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-8 transition-all duration-500 ${
          hideUI ? 'opacity-0 translate-y-[20px]' : 'opacity-100 translate-y-0'
        }`}>
          <div className="modern-glass rounded-full p-2 border border-white/10">
            <Progress value={progressInfo.progress} className="h-1 bg-white/10" />
          </div>
          <div className="flex justify-between mt-3 text-xs text-white/60">
            <span>{progressInfo.elapsed}</span>
            <span>{progressInfo.remaining}</span>
          </div>
        </div>
      )}

      {/* Control Panel - Auto Hide */}
      <div className={`fixed bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
        hideUI ? 'opacity-0 translate-y-[20px] pointer-events-none' : 'opacity-100 translate-y-0'
      }`}>
        <div className="modern-glass rounded-3xl p-3 md:p-4 border border-white/10">
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Play/Pause Button */}
            <Button
              onClick={handlePlayPause}
              disabled={mode === 'clock'}
              className="rounded-2xl w-12 h-12 md:w-14 md:h-14 bg-blue-500/20 border-blue-400/30 text-blue-200 hover:text-blue-100 hover:bg-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 touch-manipulation"
            >
              {isRunning ? <Pause className="w-5 h-5 md:w-6 md:h-6" /> : <Play className="w-5 h-5 md:w-6 md:h-6 ml-0.5" />}
            </Button>
            
            {/* Reset Button */}
            <Button
              onClick={handleReset}
              disabled={mode === 'clock'}
              className="rounded-2xl w-10 h-10 md:w-12 md:h-12 bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 touch-manipulation"
            >
              <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
            
            {/* Settings Button */}
            <Button
              onClick={() => setShowSettings(true)}
              className="rounded-2xl w-10 h-10 md:w-12 md:h-12 bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 touch-manipulation"
            >
              <Settings className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
            
            {/* Fullscreen Button */}
            <Button
              onClick={handleFullscreen}
              className="rounded-2xl w-10 h-10 md:w-12 md:h-12 bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 touch-manipulation"
            >
              <Maximize className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="modern-glass border border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">Timer Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-6">
            {/* Time Format Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-white/90 font-medium">24-Hour Format</span>
              <Switch
                checked={is24Hour}
                onCheckedChange={setIs24Hour}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>
            
            {/* Pomodoro Duration */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <label className="block text-white/90 font-medium mb-3">
                Pomodoro Duration: {pomodoroMinutes} minutes
              </label>
              <Slider
                value={[pomodoroMinutes]}
                onValueChange={(value) => setPomodoroMinutes(value[0])}
                min={15}
                max={60}
                step={5}
                className="w-full"
              />
            </div>
            
            {/* Break Duration */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <label className="block text-white/90 font-medium mb-3">
                Break Duration: {breakMinutes} minutes
              </label>
              <Slider
                value={[breakMinutes]}
                onValueChange={(value) => setBreakMinutes(value[0])}
                min={3}
                max={15}
                step={1}
                className="w-full"
              />
            </div>
            
            {/* Sound Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-white/90 font-medium">Sound Notifications</span>
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Overlay */}
      {showNotification && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="modern-glass rounded-3xl p-8 text-center border border-white/20 max-w-md mx-4 animate-fade-in">
            <div className="text-5xl mb-6">
              {currentSession === 'pomodoro' ? '🍅' : '☕'}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Session Complete!</h3>
            <p className="text-white/70 mb-8 text-lg">
              {currentSession === 'pomodoro' ? 'Time for a well-deserved break!' : 'Ready to get back to work?'}
            </p>
            <Button
              onClick={() => setShowNotification(false)}
              className="px-8 py-4 rounded-2xl bg-blue-500/20 border-blue-400/30 text-blue-200 hover:text-blue-100 hover:bg-blue-500/30 text-lg font-medium transition-all duration-200"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
