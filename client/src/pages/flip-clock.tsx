import { useState, useEffect } from "react";
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

  // Update current time every second when in clock mode
  useEffect(() => {
    if (mode === 'clock') {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode]);

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
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'KeyF':
          handleFullscreen();
          break;
        case 'KeyR':
          handleReset();
          break;
        case 'Escape':
          setShowSettings(false);
          setShowNotification(false);
          break;
      }
    }
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mode, isRunning]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" 
         style={{ backgroundColor: 'var(--deep-black)', color: 'white' }}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
      </div>
      
      {/* Mode Selection */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="glass-effect rounded-xl p-3 border border-gray-700">
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => handleModeChange('pomodoro')}
              className={mode === 'pomodoro' 
                ? 'px-4 py-2 rounded-lg glass-button-primary border-0 text-white hover:text-white text-sm' 
                : 'px-4 py-2 rounded-lg glass-button border-0 text-gray-400 hover:text-white text-sm'
              }
            >
              Pomodoro
            </Button>
            <Button
              onClick={() => handleModeChange('break')}
              className={mode === 'break' 
                ? 'px-4 py-2 rounded-lg glass-button-primary border-0 text-white hover:text-white text-sm' 
                : 'px-4 py-2 rounded-lg glass-button border-0 text-gray-400 hover:text-white text-sm'
              }
            >
              Break
            </Button>
            <Button
              onClick={() => handleModeChange('clock')}
              className={mode === 'clock' 
                ? 'px-4 py-2 rounded-lg glass-button-primary border-0 text-white hover:text-white text-sm' 
                : 'px-4 py-2 rounded-lg glass-button border-0 text-gray-400 hover:text-white text-sm'
              }
            >
              Clock
            </Button>
          </div>
        </div>
      </div>

      {/* Main Clock Display */}
      <div className="flex flex-col items-center space-y-8 z-10">
        {/* Time Display */}
        <div className="flex items-center space-x-4">
          {/* Hours */}
          <FlipCard value={displayTime.hours} size="large" />
          
          {/* Separator */}
          <div className="text-6xl md:text-7xl lg:text-8xl font-light time-shadow pulse-blue">:</div>
          
          {/* Minutes */}
          <FlipCard value={displayTime.minutes} size="large" />
          
          {/* Seconds */}
          <FlipCard value={displayTime.seconds} size="small" />
        </div>
        
        {/* Timer Mode Indicator */}
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full animate-pulse" 
               style={{ backgroundColor: 'var(--system-blue)' }}></div>
          <span className="text-lg font-medium text-gray-300">{getModeText()}</span>
          {mode !== 'clock' && (
            <div className="text-sm text-gray-400">
              Session {sessionCount} - {currentSession === 'pomodoro' ? 'Work' : 'Break'}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {progressInfo && (
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-8">
          <Progress value={progressInfo.progress} className="h-2 bg-gray-800" />
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>{progressInfo.elapsed}</span>
            <span>{progressInfo.remaining}</span>
          </div>
        </div>
      )}

      {/* Control Panel */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="glass-effect rounded-2xl p-4 border border-gray-700">
          <div className="flex items-center space-x-4">
            {/* Play/Pause Button */}
            <Button
              onClick={handlePlayPause}
              disabled={mode === 'clock'}
              className="rounded-full w-12 h-12 glass-button-primary border-0 text-white hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            
            {/* Reset Button */}
            <Button
              onClick={handleReset}
              disabled={mode === 'clock'}
              className="rounded-full w-10 h-10 glass-button border-0 text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            {/* Settings Button */}
            <Button
              onClick={() => setShowSettings(true)}
              className="rounded-full w-10 h-10 glass-button border-0 text-gray-300 hover:text-white"
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            {/* Fullscreen Button */}
            <Button
              onClick={handleFullscreen}
              className="rounded-full w-10 h-10 glass-button border-0 text-gray-300 hover:text-white"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Time Format Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300">24-Hour Format</span>
              <Switch
                checked={is24Hour}
                onCheckedChange={setIs24Hour}
              />
            </div>
            
            {/* Pomodoro Duration */}
            <div>
              <label className="block text-gray-300 mb-2">
                Pomodoro Duration: {pomodoroMinutes}m
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
            <div>
              <label className="block text-gray-300 mb-2">
                Break Duration: {breakMinutes}m
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
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Sound Notifications</span>
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Overlay */}
      {showNotification && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="glass-effect rounded-2xl p-8 text-center border border-gray-700 control-shadow max-w-md">
            <div className="text-4xl mb-4">🍅</div>
            <h3 className="text-2xl font-semibold mb-2">Session Complete!</h3>
            <p className="text-gray-300 mb-6">
              {currentSession === 'pomodoro' ? 'Time for a break!' : 'Time to get back to work!'}
            </p>
            <Button
              onClick={() => setShowNotification(false)}
              className="px-6 py-3 rounded-lg glass-button-primary border-0 text-white hover:text-white"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
