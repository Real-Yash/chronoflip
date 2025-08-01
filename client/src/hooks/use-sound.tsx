import { useCallback } from "react";

export function useSound() {
  const playNotificationSound = useCallback(() => {
    try {
      // Create a simple notification beep using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create oscillator for the beep sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configure the beep
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      // Fade in and out
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      // Play the sound
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      // Play a second beep for emphasis
      setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        
        oscillator2.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator2.type = 'sine';
        
        gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode2.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 0.5);
      }, 200);
      
    } catch (error) {
      console.log('Web Audio API not supported, falling back to system beep');
      // Fallback: try to play a system beep
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgaBDaB0PTSeSMGKW2+8+OZBA0PFBogAAAAAiQBAP//oAcS4wgFtQTBnJuXmBZiPzBgYIV2f3u+jKaLi1G8mjXLuTNzZw7/pST0PpWdmVdLg2xdgn9/f3K5hWTBvJk1yb89c2oP/qUp9T6Wm5lZT4JsXYKAfn9yuH9hxL2aM8m/PXNrD/6kKfQ+lZuZWU+CbF2CgH5/crh/YcS9mjPJvz1zaw/+pCn0PpWbmVlPgmxdgoB+f3K4f2HEvZozyb89c2sP/qQp9D6Vm5lZT4JsXYKAfn9yuH9hxL2aM8m/PXNrD/6kKfQ+lZuZWU+CbF2CgH5/crh/YcS9mjPJvz1zaw/+pCn0PpWbmVlPgmxdgoB+f3K4f2HEvZozyb89c2sP/qQp9D6Vm5lZT4JsXYKAfn9yuH9hxL2aM8m/PXNrD/6kKfQ+lZuZWU+CbF2CgH5/crh/YcS9mjPJvz1zaw/+pCn0PpWbmVlPgmxdgoB+f3K4f2HEvZozyb89c2sP/qQp9D6Vm5lZT4JsXYKAfn9yuH9hxL2aM8m/PXNrD/6kKfQ+lZuZWU+CbF2CgH5/crh/YcS9mjPJvz1zaw/+pCn0PpWbmVlPgmxdgoB+f3K4f2HEvZozyb89c2sP/qQp9D6Vm5lZT4JsXYKAfn9yuH9hxL2aM8m/PXNrD/6kKfQ+lZuZWU+CbF2CgH5/crh/YcS9mjPJvz1zaw/+pCn0PpWbmVlPgmxdg==');
        audio.play();
      } catch (e) {
        // Silent fallback
        console.log('No audio support available');
      }
    }
  }, []);

  return { playNotificationSound };
}
