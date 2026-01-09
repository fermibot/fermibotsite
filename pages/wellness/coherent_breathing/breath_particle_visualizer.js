/**
 * Breath Particle Visualizer
 * A physics-based particle system that responds to breathing phases
 * Particles flow inward during inhale, outward during exhale, and float during pauses
 */
class BreathParticleVisualizer {
    constructor(container) {
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.isRunning = false;

        // Physics parameters
        this.currentPhase = 'idle'; // 'in', 'out', 'pause1', 'pause2', 'idle'
        this.phaseIntensity = 0;
        this.targetIntensity = 0;

        // Particle settings
        this.particleCount = 60;
        this.baseSpeed = 0.3;

        // Colors for different phases
        this.colors = {
            in: { r: 76, g: 175, b: 80, a: 0.8 },      // Green - inhale
            out: { r: 33, g: 150, b: 243, a: 0.8 },    // Blue - exhale
            pause1: { r: 255, g: 152, b: 0, a: 0.7 },  // Orange - hold after inhale
            pause2: { r: 156, g: 39, b: 176, a: 0.7 }, // Purple - hold after exhale
            idle: { r: 158, g: 158, b: 158, a: 0.5 }   // Gray - idle
        };

        this.currentColor = { ...this.colors.idle };
        this.targetColor = { ...this.colors.idle };

        // Center point (where particles converge/diverge)
        this.centerX = 0;
        this.centerY = 0;

        // Breathing wave effect
        this.breathWave = 0;
        this.breathWaveSpeed = 0.02;
        this.turbulence = 0.08; // Amount of random motion

        this.init();
    }

    init() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'breath-particle-canvas';
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
        `;

        // Insert canvas into container
        this.container.style.position = 'relative';
        this.container.appendChild(this.canvas);

        // Get context
        this.ctx = this.canvas.getContext('2d');

        // Set canvas size
        this.resize();

        // Create initial particles
        this.createParticles();

        // Handle resize
        window.addEventListener('resize', () => this.resize());

        // Start idle animation
        this.startIdleAnimation();
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        this.width = rect.width;
        this.height = rect.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;

        // Reinitialize particles on resize
        this.createParticles();
    }

    createParticles() {
        this.particles = [];

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle(fromCenter = false) {
        const angle = Math.random() * Math.PI * 2;
        const distance = fromCenter ?
            Math.random() * 20 :
            Math.random() * Math.max(this.width, this.height) * 0.6;

        return {
            x: this.centerX + Math.cos(angle) * distance,
            y: this.centerY + Math.sin(angle) * distance,
            vx: (Math.random() - 0.5) * this.baseSpeed,
            vy: (Math.random() - 0.5) * this.baseSpeed,
            size: Math.random() * 3 + 1.5,
            baseSize: Math.random() * 3 + 1.5,
            alpha: Math.random() * 0.5 + 0.3,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.05 + 0.02,
            trail: [],
            maxTrailLength: Math.floor(Math.random() * 5) + 3
        };
    }

    setPhase(phase) {
        console.log('Particle visualizer: setPhase called with:', phase);
        this.currentPhase = phase;
        this.targetColor = { ...this.colors[phase] || this.colors.idle };

        switch (phase) {
            case 'in':
                this.targetIntensity = 1.0;
                this.breathWaveSpeed = 0.03;
                this.turbulence = 0.05;
                break;
            case 'out':
                this.targetIntensity = -1.0;
                this.breathWaveSpeed = 0.03;
                this.turbulence = 0.05;
                break;
            case 'pause1':
                // Hold after inhale - particles orbit slowly near center
                this.targetIntensity = 0.1; // slight inward pull to keep them centered
                this.breathWaveSpeed = 0.02;
                this.turbulence = 0.15; // more turbulence during hold
                break;
            case 'pause2':
                // Hold after exhale - particles orbit slowly at edges
                this.targetIntensity = -0.1; // slight outward push
                this.breathWaveSpeed = 0.02;
                this.turbulence = 0.15;
                break;
            default:
                this.targetIntensity = 0;
                this.breathWaveSpeed = 0.015;
                this.turbulence = 0.08;
        }
    }

    updatePhysics() {
        // Smooth intensity transition
        this.phaseIntensity += (this.targetIntensity - this.phaseIntensity) * 0.05;

        // Smooth color transition
        this.currentColor.r += (this.targetColor.r - this.currentColor.r) * 0.03;
        this.currentColor.g += (this.targetColor.g - this.currentColor.g) * 0.03;
        this.currentColor.b += (this.targetColor.b - this.currentColor.b) * 0.03;
        this.currentColor.a += (this.targetColor.a - this.currentColor.a) * 0.03;

        // Update breath wave
        this.breathWave += this.breathWaveSpeed;

        // Update each particle
        for (let p of this.particles) {
            // Calculate direction to/from center
            const dx = this.centerX - p.x;
            const dy = this.centerY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const nx = dx / dist;
            const ny = dy / dist;

            // Apply breathing force
            const breathForce = this.phaseIntensity * 0.15;
            p.vx += nx * breathForce;
            p.vy += ny * breathForce;

            // Add orbital motion during pauses (perpendicular to radius)
            if (this.currentPhase === 'pause1' || this.currentPhase === 'pause2') {
                // Perpendicular direction for orbital motion
                const orbitalSpeed = 0.03;
                p.vx += -ny * orbitalSpeed;
                p.vy += nx * orbitalSpeed;
            }

            // Add turbulence (random motion)
            p.vx += (Math.random() - 0.5) * this.turbulence;
            p.vy += (Math.random() - 0.5) * this.turbulence;

            // Add wave effect
            const waveInfluence = Math.sin(this.breathWave + dist * 0.02) * 0.02;
            p.vx += nx * waveInfluence;
            p.vy += ny * waveInfluence;

            // Apply friction
            p.vx *= 0.96;
            p.vy *= 0.96;

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Store trail
            p.trail.unshift({ x: p.x, y: p.y });
            if (p.trail.length > p.maxTrailLength) {
                p.trail.pop();
            }

            // Pulse size
            p.pulse += p.pulseSpeed;
            p.size = p.baseSize * (1 + Math.sin(p.pulse) * 0.3);

            // Boundary handling - wrap around with some margin
            const margin = 20;
            if (p.x < -margin) p.x = this.width + margin;
            if (p.x > this.width + margin) p.x = -margin;
            if (p.y < -margin) p.y = this.height + margin;
            if (p.y > this.height + margin) p.y = -margin;

            // Reset particles that get too close to center during inhale
            if (this.phaseIntensity > 0.5 && dist < 10) {
                const newP = this.createParticle(false);
                p.x = newP.x;
                p.y = newP.y;
                p.vx = newP.vx;
                p.vy = newP.vy;
                p.trail = [];
            }
        }
    }

    render() {
        // Clear canvas with slight fade for trail effect
        this.ctx.fillStyle = 'rgba(248, 249, 250, 0.15)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw central glow based on phase
        this.drawCenterGlow();

        // Draw particles
        for (let p of this.particles) {
            this.drawParticle(p);
        }

        // Draw phase indicator arc at the bottom
        this.drawPhaseIndicator();
    }

    drawCenterGlow() {
        const glowRadius = 30 + Math.sin(this.breathWave) * 10;
        const intensity = Math.abs(this.phaseIntensity) * 0.3 + 0.1;

        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, glowRadius
        );

        const { r, g, b } = this.currentColor;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${intensity})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${intensity * 0.3})`);
        gradient.addColorStop(1, 'rgba(248, 249, 250, 0)');

        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, glowRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    drawParticle(p) {
        const { r, g, b, a } = this.currentColor;

        // Draw trail
        if (p.trail.length > 1) {
            this.ctx.beginPath();
            this.ctx.moveTo(p.trail[0].x, p.trail[0].y);

            for (let i = 1; i < p.trail.length; i++) {
                this.ctx.lineTo(p.trail[i].x, p.trail[i].y);
            }

            const trailAlpha = a * 0.3 * p.alpha;
            this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${trailAlpha})`;
            this.ctx.lineWidth = p.size * 0.5;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();
        }

        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        // Particle gradient
        const particleGradient = this.ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, p.size
        );
        particleGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a * p.alpha})`);
        particleGradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${a * p.alpha * 0.6})`);
        particleGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        this.ctx.fillStyle = particleGradient;
        this.ctx.fill();
    }

    drawPhaseIndicator() {
        // Draw a subtle progress bar at the bottom
        const barHeight = 3;
        const barY = this.height - barHeight - 2;
        const { r, g, b } = this.currentColor;

        // Background bar
        this.ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
        this.ctx.fillRect(0, barY, this.width, barHeight);

        // Phase indicator (pulsing)
        const pulseWidth = 30 + Math.sin(this.breathWave * 2) * 10;
        const pulseX = (this.breathWave * 20) % (this.width + pulseWidth) - pulseWidth / 2;

        const gradient = this.ctx.createLinearGradient(pulseX - pulseWidth/2, 0, pulseX + pulseWidth/2, 0);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.8)`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(pulseX - pulseWidth/2, barY, pulseWidth, barHeight);
    }

    animate() {
        if (!this.isRunning) return;

        this.updatePhysics();
        this.render();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    startIdleAnimation() {
        this.isRunning = true;
        this.setPhase('idle');
        this.animate();
    }

    start() {
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.setPhase('idle');

        // Final render in idle state
        this.isRunning = true;
        this.animate();
    }

    pause() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    destroy() {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        window.removeEventListener('resize', () => this.resize());
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BreathParticleVisualizer;
}

