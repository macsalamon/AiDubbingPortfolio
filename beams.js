// Animated Beams Background
console.log('Beams script loaded');

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBeams);
} else {
    initBeams();
}

function initBeams() {
    console.log('Initializing beams...');
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'beams-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
    
    console.log('Canvas created:', canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get canvas context');
        return;
    }
    
    let beams = [];
    let animationFrameId;
    const BEAM_COUNT = 12;

    // Beam configuration using your color palette
    const config = {
        baseHue: 45, // Gold/accent color base
        hueRange: 20, // Variation around base
        opacity: 0.2, // Subtle effect
        blur: 20
    };

    class Beam {
        constructor(canvasWidth, canvasHeight) {
            this.x = Math.random() * canvasWidth;
            this.y = Math.random() * canvasHeight;
            this.width = 40 + Math.random() * 60;
            this.length = canvasHeight * 1.5;
            this.angle = -35 + Math.random() * 10;
            this.speed = 0.5 + Math.random() * 0.5;
            this.opacity = config.opacity * (0.8 + Math.random() * 0.4);
            this.hue = config.baseHue + (Math.random() - 0.5) * config.hueRange;
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.015;
        }

        update() {
            this.y -= this.speed;
            this.pulse += this.pulseSpeed;
        }

        draw(context) {
            context.save();
            context.translate(this.x, this.y);
            context.rotate((this.angle * Math.PI) / 180);

            const pulsingOpacity = this.opacity * (0.8 + Math.sin(this.pulse) * 0.2);
            const gradient = context.createLinearGradient(0, 0, 0, this.length);
            
            gradient.addColorStop(0, `hsla(${this.hue}, 70%, 55%, 0)`);
            gradient.addColorStop(0.2, `hsla(${this.hue}, 70%, 55%, ${pulsingOpacity * 0.5})`);
            gradient.addColorStop(0.5, `hsla(${this.hue}, 70%, 55%, ${pulsingOpacity})`);
            gradient.addColorStop(0.8, `hsla(${this.hue}, 70%, 55%, ${pulsingOpacity * 0.5})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 70%, 55%, 0)`);

            context.fillStyle = gradient;
            context.fillRect(-this.width / 2, 0, this.width, this.length);
            context.restore();
        }

        isOffScreen(canvasHeight) {
            return this.y + this.length < -100;
        }

        reset(canvasWidth, canvasHeight) {
            this.y = canvasHeight + 100;
            this.x = Math.random() * canvasWidth;
        }
    }

    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.scale(dpr, dpr);
        
        console.log('Canvas sized:', window.innerWidth, 'x', window.innerHeight);
        
        // Recreate beams on resize
        beams = [];
        for (let i = 0; i < BEAM_COUNT; i++) {
            beams.push(new Beam(window.innerWidth, window.innerHeight));
        }
        
        console.log('Beams created:', beams.length);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.filter = `blur(${config.blur}px)`;

        beams.forEach(beam => {
            beam.update();
            
            if (beam.isOffScreen(window.innerHeight)) {
                beam.reset(window.innerWidth, window.innerHeight);
            }
            
            beam.draw(ctx);
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();
    
    console.log('Beams animation started');
    
    // Cleanup
    window.addEventListener('beforeunload', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        window.removeEventListener('resize', resizeCanvas);
    });
}