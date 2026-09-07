class Timer {
    constructor() {
        this.seconds = 0;
        this.isRunning = false;
        this.intervalId = null;
        this.audioContext = null;
        this.signalPlayedAt = false;
        
        this.timeDisplay = document.getElementById('time');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.startBtn.addEventListener('click', () => this.toggleStart());
        this.resetBtn.addEventListener('click', () => this.reset());
    }
    
    toggleStart() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
    }
    
    start() {
        this.isRunning = true;
        this.startBtn.textContent = 'Stop';
        this.startBtn.classList.add('active');
        this.resetBtn.disabled = true;
        
        this.intervalId = setInterval(() => {
            this.seconds++;
            this.updateDisplay();
            
            // Check if we've reached 1:45 (105 seconds)
            if (this.seconds === 105 && !this.signalPlayedAt) {
                this.playDoorbell();
                this.signalPlayedAt = true;
            }
            
            // Check if we've reached 2:00 (120 seconds)
            if (this.seconds === 120) {
                this.seconds = 0;
                this.signalPlayedAt = false;
                this.updateDisplay();
            }
        }, 1000);
    }
    
    stop() {
        this.isRunning = false;
        this.startBtn.textContent = 'Start';
        this.startBtn.classList.remove('active');
        this.resetBtn.disabled = false;
        clearInterval(this.intervalId);
    }
    
    reset() {
        this.stop();
        this.seconds = 0;
        this.signalPlayedAt = false;
        this.updateDisplay();
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.seconds / 60);
        const secs = this.seconds % 60;
        this.timeDisplay.textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    
    playDoorbell() {
        // Initialize AudioContext if not already done
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const ctx = this.audioContext;
        const currentTime = ctx.currentTime;
        
        // Create a doorbell-like sound using two oscillators
        // Low frequency tone
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.frequency.value = 350;
        gain1.gain.setValueAtTime(0.3, currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.6);
        
        // High frequency tone
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 600;
        gain2.gain.setValueAtTime(0.2, currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.4);
        
        osc1.start(currentTime);
        osc1.stop(currentTime + 0.6);
        
        osc2.start(currentTime);
        osc2.stop(currentTime + 0.4);
    }
}

// Initialize the timer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Timer();
});
