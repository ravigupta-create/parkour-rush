// ============================================
// PARKOUR RUSH - Complete Game Engine v2.0
// A fast-paced 2D parkour platformer
// Delta-time physics, mobile support, enhanced visuals
// ============================================

// ---------- CONSTANTS ----------
const TILE = 32;
const GRAVITY = 0.55;
const MAX_FALL = 12;
const RUN_SPEED = 5;
const JUMP_FORCE = -10.5;
const WALL_JUMP_X = 7;
const WALL_JUMP_Y = -9;
const DASH_SPEED = 14;
const DASH_DURATION = 8;
const DASH_COOLDOWN = 30;
const SLIDE_SPEED = 6;
const SLIDE_DURATION = 20;
const PLAYER_W = 20;
const PLAYER_H = 32;
const PLAYER_H_SLIDE = 18;
const COYOTE_TIME = 6;
const JUMP_BUFFER = 6;
const WORLD_W = 200;
const WORLD_H = 20;
const CAM_SMOOTH = 0.1;

// ---------- GRADE THRESHOLDS ----------
const GRADE_THRESHOLDS = [
    { gold: 6, silver: 10, bronze: 15 },
    { gold: 8, silver: 13, bronze: 20 },
    { gold: 10, silver: 15, bronze: 22 },
    { gold: 8, silver: 12, bronze: 18 },
    { gold: 12, silver: 18, bronze: 25 },
    { gold: 10, silver: 15, bronze: 22 },
    { gold: 15, silver: 22, bronze: 30 },
    { gold: 12, silver: 18, bronze: 25 },
    { gold: 18, silver: 25, bronze: 35 },
    { gold: 25, silver: 35, bronze: 50 },
    { gold: 15, silver: 22, bronze: 30 },
    { gold: 12, silver: 18, bronze: 25 },
    { gold: 14, silver: 20, bronze: 28 },
    { gold: 16, silver: 24, bronze: 32 },
    { gold: 30, silver: 42, bronze: 55 },
];

// ---------- TUTORIAL HINTS ----------
const TUTORIAL_HINTS = [
    "Use A/D or Arrow Keys to move. Jump with W or SPACE.",
    "Jump between walls! Press JUMP while touching a wall to wall-jump.",
    "Press SHIFT in midair to DASH across big gaps!",
    "Press S or DOWN while running to SLIDE under low ceilings."
];

// ---------- GAME STATE ----------
let canvas, ctx, editorCanvas, editorCtx, menuBgCanvas, menuBgCtx;
let currentScreen = 'menu';
let gameState = 'menu';
let currentLevel = 0;
let levelTimer = 0;
let bestTimes = {};
let bestGrades = {};
let unlockedLevel = 0;
let soundEnabled = true;
let keys = {};
let prevKeys = {};
let deathCount = 0;
let totalDeaths = 0;
let screenShake = 0;
let lastTime = performance.now();
let dtScale = 1;
let canvasW = 800;
let canvasH = 600;
let dpr = 1;

// Combo system
let comboCount = 0;
let comboTimer = 0;
let lastActionTime = 0;

// Tutorial
let tutorialShown = {};
let tutorialTimer = 0;

// Mobile detection
const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Player state
let player = {};
let particles = [];
let ambientParticles = [];
let camera = { x: 0, y: 0 };

// Level data
let platforms = [];
let spikes = [];
let movingPlatforms = [];
let fallingPlatforms = [];
let boostPads = [];
let walls = [];
let goalZone = null;
let spawnPoint = { x: 100, y: 500 };

// Checkpoint system
let checkpoints = [];
let lastCheckpoint = null;

// Ghost trail system
let ghostRecording = [];
let ghostPlayback = [];
let ghostFrame = 0;
let ghostRecordFrame = 0;
let ghostEnabled = true;

// R key double-tap tracking
let lastRPressTime = 0;

// Background layers
let bgLayers = [];
let bgGenerated = false;

// Menu particles
let menuParticles = [];

// Player animation
let playerAnimFrame = 0;
let playerDistTraveled = 0;
let landTimer = 0;
let jumpSquashTimer = 0;
let dashTrail = [];

// Music
let musicPlaying = false;
let musicNodes = [];
let musicInterval = null;

// FPS tracking
let fpsHistory = [];
let lowFpsMode = false;

// Editor state
let editorTool = 'platform';
let editorCamera = { x: 0, y: 0 };
let editorDragging = false;
let editorObjects = [];
let editorSpawn = { x: 2, y: 16 };
let editorGoal = { x: 190, y: 16 };

// ---------- AUDIO (Web Audio API - free browser synth) ----------
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playSound(type) {
    if (!soundEnabled || !audioCtx) return;
    try {
        const now = audioCtx.currentTime;
        const pitchVar = 0.95 + Math.random() * 0.1;

        switch (type) {
            case 'jump': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const osc2 = audioCtx.createOscillator();
                const gain2 = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioCtx.destination);
                osc2.connect(gain2); gain2.connect(audioCtx.destination);
                osc.type = 'square';
                osc.frequency.setValueAtTime(300 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(600 * pitchVar, now + 0.1);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(450 * pitchVar, now);
                osc2.frequency.exponentialRampToValueAtTime(900 * pitchVar, now + 0.1);
                gain2.gain.setValueAtTime(0.03, now);
                gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.start(now); osc.stop(now + 0.15);
                osc2.start(now); osc2.stop(now + 0.12);
                break;
            }
            case 'dash': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const osc2 = audioCtx.createOscillator();
                const gain2 = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioCtx.destination);
                osc2.connect(gain2); gain2.connect(audioCtx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(800 * pitchVar, now + 0.12);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc2.type = 'square';
                osc2.frequency.setValueAtTime(150 * pitchVar, now);
                osc2.frequency.exponentialRampToValueAtTime(600 * pitchVar, now + 0.1);
                gain2.gain.setValueAtTime(0.03, now);
                gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
                osc.start(now); osc.stop(now + 0.15);
                osc2.start(now); osc2.stop(now + 0.13);
                break;
            }
            case 'walljump': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const osc2 = audioCtx.createOscillator();
                const gain2 = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioCtx.destination);
                osc2.connect(gain2); gain2.connect(audioCtx.destination);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(400 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(800 * pitchVar, now + 0.08);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(600 * pitchVar, now);
                osc2.frequency.exponentialRampToValueAtTime(1200 * pitchVar, now + 0.08);
                gain2.gain.setValueAtTime(0.03, now);
                gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.start(now); osc.stop(now + 0.12);
                osc2.start(now); osc2.stop(now + 0.1);
                break;
            }
            case 'slide': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const filter = audioCtx.createBiquadFilter();
                osc.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100 * pitchVar, now);
                osc.frequency.linearRampToValueAtTime(60 * pitchVar, now + 0.2);
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(800, now);
                filter.frequency.linearRampToValueAtTime(200, now + 0.2);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.start(now); osc.stop(now + 0.25);
                break;
            }
            case 'boost': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const osc2 = audioCtx.createOscillator();
                const gain2 = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioCtx.destination);
                osc2.connect(gain2); gain2.connect(audioCtx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(1200 * pitchVar, now + 0.15);
                gain.gain.setValueAtTime(0.07, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc2.type = 'triangle';
                osc2.frequency.setValueAtTime(800 * pitchVar, now);
                osc2.frequency.exponentialRampToValueAtTime(1600 * pitchVar, now + 0.12);
                gain2.gain.setValueAtTime(0.03, now);
                gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now); osc.stop(now + 0.2);
                osc2.start(now); osc2.stop(now + 0.15);
                break;
            }
            case 'death': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const filter = audioCtx.createBiquadFilter();
                osc.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
                osc.type = 'square';
                osc.frequency.setValueAtTime(300 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(2000, now);
                filter.frequency.exponentialRampToValueAtTime(100, now + 0.4);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                osc.start(now); osc.stop(now + 0.5);
                break;
            }
            case 'complete': {
                const notes = [523, 659, 784];
                for (let i = 0; i < 3; i++) {
                    const o = audioCtx.createOscillator();
                    const g = audioCtx.createGain();
                    const o2 = audioCtx.createOscillator();
                    const g2 = audioCtx.createGain();
                    o.connect(g); g.connect(audioCtx.destination);
                    o2.connect(g2); g2.connect(audioCtx.destination);
                    const t = now + i * 0.15;
                    o.type = 'sine';
                    o.frequency.setValueAtTime(notes[i] * pitchVar, t);
                    g.gain.setValueAtTime(0.08, t);
                    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
                    o2.type = 'triangle';
                    o2.frequency.setValueAtTime(notes[i] * 2 * pitchVar, t);
                    g2.gain.setValueAtTime(0.02, t);
                    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
                    o.start(t); o.stop(t + 0.5);
                    o2.start(t); o2.stop(t + 0.4);
                }
                break;
            }
            case 'click': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioCtx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(600 * pitchVar, now + 0.05);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.start(now); osc.stop(now + 0.08);
                break;
            }
            case 'checkpoint': {
                const notes = [523, 659, 784, 1047];
                for (let i = 0; i < 4; i++) {
                    const o = audioCtx.createOscillator();
                    const g = audioCtx.createGain();
                    o.connect(g); g.connect(audioCtx.destination);
                    const t = now + i * 0.1;
                    o.type = 'sine';
                    o.frequency.setValueAtTime(notes[i] * pitchVar, t);
                    g.gain.setValueAtTime(0.06, t);
                    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
                    o.start(t); o.stop(t + 0.3);
                }
                break;
            }
        }
    } catch (e) {
        // Audio errors are non-critical
    }
}

// ---------- BACKGROUND MUSIC ----------
function startMusic() {
    if (musicPlaying || !soundEnabled || !audioCtx) return;
    musicPlaying = true;
    try {
        const bassNotes = [55, 65, 73, 82];
        let noteIndex = 0;
        const bpm = 120;
        const beatTime = 60 / bpm;

        // Bass line
        function playBassNote() {
            if (!musicPlaying || !audioCtx) return;
            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioCtx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(bassNotes[noteIndex % bassNotes.length], audioCtx.currentTime);
                gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + beatTime * 0.9);
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + beatTime * 0.9);
                musicNodes.push({ osc, gain });
                noteIndex++;
            } catch(e) {}
        }

        // Kick
        function playKick() {
            if (!musicPlaying || !audioCtx) return;
            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioCtx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(150, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 0.15);
                musicNodes.push({ osc, gain });
            } catch(e) {}
        }

        // Pad chord
        function playPad() {
            if (!musicPlaying || !audioCtx) return;
            try {
                const freqs = [130, 164, 196];
                for (const f of freqs) {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    const filter = audioCtx.createBiquadFilter();
                    osc.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(f, audioCtx.currentTime);
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(400, audioCtx.currentTime);
                    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + beatTime * 3.8);
                    osc.start(audioCtx.currentTime);
                    osc.stop(audioCtx.currentTime + beatTime * 3.8);
                    musicNodes.push({ osc, gain });
                }
            } catch(e) {}
        }

        let beatCount = 0;
        musicInterval = setInterval(() => {
            if (!musicPlaying) { clearInterval(musicInterval); return; }
            playBassNote();
            playKick();
            if (beatCount % 4 === 0) playPad();
            beatCount++;
        }, beatTime * 1000);
    } catch (e) {}
}

function stopMusic() {
    musicPlaying = false;
    if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
    for (const node of musicNodes) {
        try { node.osc.stop(); } catch(e) {}
    }
    musicNodes = [];
}

// ---------- PARTICLE SYSTEM ----------
function spawnParticles(x, y, count, color, spread, speedMul) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * spread * (speedMul || 1),
            vy: (Math.random() - 0.8) * spread * (speedMul || 1),
            life: 15 + Math.random() * 15,
            maxLife: 30,
            size: 2 + Math.random() * 3,
            color: color
        });
    }
}

function updateParticles(dt) {
    const s = dt;
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * s;
        p.y += p.vy * s;
        p.vy += 0.1 * s;
        p.life -= s;
        if (p.life <= 0) {
            // Swap and pop
            particles[i] = particles[particles.length - 1];
            particles.pop();
        }
    }
}

function drawParticles() {
    for (const p of particles) {
        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(
            p.x - camera.x - p.size / 2,
            p.y - camera.y - p.size / 2,
            p.size, p.size
        );
    }
    ctx.globalAlpha = 1;
}

// ---------- AMBIENT PARTICLES ----------
function initAmbientParticles() {
    ambientParticles = [];
    const count = lowFpsMode ? 15 : 40;
    for (let i = 0; i < count; i++) {
        ambientParticles.push({
            x: Math.random() * canvasW,
            y: Math.random() * canvasH,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.2 - 0.1,
            size: 1 + Math.random() * 2,
            alpha: 0.1 + Math.random() * 0.3
        });
    }
}

function updateAmbientParticles(dt) {
    for (const p of ambientParticles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < 0) p.x = canvasW;
        if (p.x > canvasW) p.x = 0;
        if (p.y < 0) p.y = canvasH;
        if (p.y > canvasH) p.y = 0;
    }
}

function drawAmbientParticles() {
    for (const p of ambientParticles) {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

// ---------- MENU BACKGROUND PARTICLE NETWORK ----------
function initMenuParticles() {
    menuParticles = [];
    for (let i = 0; i < 50; i++) {
        menuParticles.push({
            x: Math.random() * canvasW,
            y: Math.random() * canvasH,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: 2
        });
    }
}

function drawMenuBackground() {
    if (!menuBgCanvas || !menuBgCtx) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (menuBgCanvas.width !== w || menuBgCanvas.height !== h) {
        menuBgCanvas.width = w;
        menuBgCanvas.height = h;
    }
    const mctx = menuBgCtx;
    mctx.clearRect(0, 0, w, h);
    mctx.fillStyle = '#0a0a0f';
    mctx.fillRect(0, 0, w, h);

    // Update particles
    for (const p of menuParticles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));
    }

    // Draw connections
    mctx.strokeStyle = 'rgba(0, 229, 255, 0.1)';
    mctx.lineWidth = 1;
    for (let i = 0; i < menuParticles.length; i++) {
        for (let j = i + 1; j < menuParticles.length; j++) {
            const dx = menuParticles[i].x - menuParticles[j].x;
            const dy = menuParticles[i].y - menuParticles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                mctx.globalAlpha = (1 - dist / 120) * 0.3;
                mctx.beginPath();
                mctx.moveTo(menuParticles[i].x, menuParticles[i].y);
                mctx.lineTo(menuParticles[j].x, menuParticles[j].y);
                mctx.stroke();
            }
        }
    }

    // Draw dots
    mctx.globalAlpha = 0.5;
    mctx.fillStyle = '#00e5ff';
    for (const p of menuParticles) {
        mctx.beginPath();
        mctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        mctx.fill();
    }
    mctx.globalAlpha = 1;
}

// ---------- PARALLAX CITYSCAPE ----------
function generateCityscape() {
    bgLayers = [];
    for (let layer = 0; layer < 3; layer++) {
        const buildings = [];
        const count = 30 + layer * 10;
        for (let i = 0; i < count; i++) {
            buildings.push({
                x: i * (60 - layer * 15) + Math.random() * 20,
                w: 20 + Math.random() * (40 - layer * 10),
                h: 40 + Math.random() * (120 + layer * 40),
                windows: Math.random() > 0.3
            });
        }
        bgLayers.push({
            buildings,
            parallax: 0.05 + layer * 0.1,
            color: `rgba(0, ${100 + layer * 50}, ${150 + layer * 40}, ${0.15 + layer * 0.05})`
        });
    }
    bgGenerated = true;
}

// ---------- PLAYER ----------
function resetPlayer() {
    player = {
        x: spawnPoint.x, y: spawnPoint.y,
        vx: 0, vy: 0,
        w: PLAYER_W, h: PLAYER_H,
        onGround: false,
        onWallLeft: false, onWallRight: false,
        facing: 1,
        coyoteTimer: 0, jumpBuffer: 0,
        dashTimer: 0, dashCooldown: 0, dashDir: 1,
        slideTimer: 0,
        canClimb: false, climbTimer: 0,
        isSliding: false, isDashing: false,
        wasOnGround: false,
        ridingPlatform: null
    };
    playerAnimFrame = 0;
    playerDistTraveled = 0;
    landTimer = 0;
    jumpSquashTimer = 0;
    dashTrail = [];
}

// ---------- LEVEL HELPERS ----------
function plat(tx, ty, tw, th) {
    return { x: tx * TILE, y: ty * TILE, w: tw * TILE, h: (th || 1) * TILE };
}

function spike(tx, ty, tw, th) {
    return { x: tx * TILE, y: ty * TILE, w: (tw || 1) * TILE, h: (th || 1) * TILE };
}

function moving(tx, ty, tw, th, dx, dy, speed, range) {
    return {
        x: tx * TILE, y: ty * TILE, w: tw * TILE, h: (th || 1) * TILE,
        dx: dx || 1, dy: dy || 0, speed: speed || 1, range: (range || 3) * TILE,
        t: 0, startX: tx * TILE, startY: ty * TILE, trail: []
    };
}

function falling(tx, ty, tw, th) {
    return {
        x: tx * TILE, y: ty * TILE, w: tw * TILE, h: (th || 1) * TILE,
        triggered: false, fallTimer: 0, fallen: false, origY: ty * TILE, vy: 0
    };
}

function boost(tx, ty, tw, dir) {
    return { x: tx * TILE, y: ty * TILE, w: tw * TILE, h: TILE, dir: dir || 1 };
}

function wall(tx, ty, th) {
    return { x: tx * TILE, y: ty * TILE, w: TILE, h: (th || 3) * TILE };
}

function goal(tx, ty) {
    return { x: tx * TILE, y: (ty - 1) * TILE, w: TILE * 2, h: TILE * 2 };
}

function checkpoint(tx, ty) {
    return { x: tx * TILE, y: ty * TILE, w: TILE, h: TILE * 2, activated: false };
}

// ---------- LEVEL DEFINITIONS ----------
const LEVELS = [
    // ----- LEVEL 1: Tutorial Run -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(58, 17);
        platforms = [
            plat(0, 18, 15, 2),
            plat(17, 18, 6, 2),
            plat(25, 18, 6, 2),
            plat(33, 16, 5, 1),
            plat(40, 18, 8, 2),
            plat(50, 18, 12, 2),
        ];
        spikes = [];
        movingPlatforms = [];
        fallingPlatforms = [];
        boostPads = [];
        walls = [];
        checkpoints = [];
    },

    // ----- LEVEL 2: Wall Jump Intro -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(48, 5);
        platforms = [
            plat(0, 18, 10, 2),
            plat(20, 18, 6, 2),
            plat(35, 18, 8, 2),
            plat(45, 6, 6, 1),
        ];
        walls = [
            wall(14, 8, 10),
            wall(17, 8, 10),
        ];
        spikes = [];
        movingPlatforms = [];
        fallingPlatforms = [];
        boostPads = [];
        checkpoints = [];
    },

    // ----- LEVEL 3: Dash Training -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(70, 17);
        platforms = [
            plat(0, 18, 10, 2),
            plat(17, 18, 4, 2),
            plat(28, 18, 4, 2),
            plat(39, 18, 4, 2),
            plat(50, 16, 4, 1),
            plat(60, 18, 14, 2),
        ];
        boostPads = [
            boost(62, 17, 3, 1),
        ];
        spikes = [
            spike(12, 19, 4, 1),
            spike(23, 19, 4, 1),
            spike(34, 19, 4, 1),
        ];
        walls = [];
        movingPlatforms = [];
        fallingPlatforms = [];
        checkpoints = [];
    },

    // ----- LEVEL 4: Slide & Spikes -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(65, 17);
        platforms = [
            plat(0, 18, 20, 2),
            plat(8, 15, 10, 1),
            plat(22, 18, 10, 2),
            plat(22, 14, 10, 1),
            plat(34, 18, 8, 2),
            plat(44, 18, 6, 2),
            plat(55, 18, 14, 2),
        ];
        spikes = [
            spike(10, 17, 6, 1),
            spike(24, 17, 6, 1),
            spike(42, 19, 2, 1),
        ];
        walls = [];
        movingPlatforms = [];
        fallingPlatforms = [];
        boostPads = [];
        checkpoints = [];
    },

    // ----- LEVEL 5: Moving Platforms -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(65, 8);
        platforms = [
            plat(0, 18, 8, 2),
            plat(60, 10, 8, 1),
        ];
        movingPlatforms = [
            moving(12, 16, 4, 1, 0, 1, 0.8, 3),
            moving(22, 14, 4, 1, 1, 0, 1, 4),
            moving(35, 12, 4, 1, 0, 1, 1, 3),
            moving(45, 10, 4, 1, 1, 0, 0.6, 5),
        ];
        spikes = [
            spike(0, 19, 80, 1),
        ];
        walls = [];
        fallingPlatforms = [];
        boostPads = [];
        checkpoints = [];
    },

    // ----- LEVEL 6: Falling Floor -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(55, 17);
        platforms = [
            plat(0, 18, 6, 2),
            plat(50, 18, 10, 2),
        ];
        fallingPlatforms = [
            falling(8, 18, 3, 1),
            falling(13, 18, 3, 1),
            falling(18, 18, 3, 1),
            falling(23, 16, 3, 1),
            falling(28, 14, 3, 1),
            falling(33, 16, 3, 1),
            falling(38, 18, 3, 1),
            falling(43, 18, 3, 1),
        ];
        spikes = [
            spike(6, 19, 44, 1),
        ];
        walls = [];
        movingPlatforms = [];
        boostPads = [];
        checkpoints = [];
    },

    // ----- LEVEL 7: Wall Climb Challenge -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(58, 3);
        platforms = [
            plat(0, 18, 8, 2),
            plat(15, 18, 3, 2),
            plat(30, 18, 3, 2),
            plat(55, 4, 6, 1),
        ];
        walls = [
            wall(10, 5, 13),
            wall(13, 5, 13),
            wall(25, 5, 13),
            wall(28, 5, 13),
            wall(40, 5, 13),
            wall(43, 5, 13),
            wall(52, 4, 5),
        ];
        spikes = [
            spike(0, 19, 60, 1),
        ];
        movingPlatforms = [];
        fallingPlatforms = [];
        boostPads = [];
        checkpoints = [];
    },

    // ----- LEVEL 8: Boost Rush -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(90, 17);
        platforms = [
            plat(0, 18, 10, 2),
            plat(15, 18, 6, 2),
            plat(26, 16, 4, 1),
            plat(35, 18, 6, 2),
            plat(46, 14, 4, 1),
            plat(55, 18, 8, 2),
            plat(68, 16, 4, 1),
            plat(78, 18, 6, 2),
            plat(88, 18, 6, 2),
        ];
        boostPads = [
            boost(3, 17, 3, 1),
            boost(16, 17, 3, 1),
            boost(36, 17, 3, 1),
            boost(56, 17, 3, 1),
            boost(79, 17, 3, 1),
        ];
        spikes = [
            spike(12, 19, 2, 1),
            spike(32, 19, 2, 1),
            spike(52, 19, 2, 1),
            spike(65, 19, 2, 1),
            spike(75, 19, 2, 1),
        ];
        walls = [];
        movingPlatforms = [];
        fallingPlatforms = [];
        checkpoints = [];
    },

    // ----- LEVEL 9: The Gauntlet -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(95, 5);
        platforms = [
            plat(0, 18, 6, 2),
            plat(20, 18, 4, 2),
            plat(35, 14, 4, 1),
            plat(55, 18, 4, 2),
            plat(70, 18, 3, 2),
            plat(90, 6, 8, 1),
        ];
        walls = [
            wall(10, 8, 10),
            wall(13, 8, 10),
            wall(45, 6, 12),
            wall(48, 6, 12),
            wall(80, 3, 15),
            wall(83, 3, 15),
        ];
        movingPlatforms = [
            moving(25, 16, 3, 1, 1, 0, 1.2, 4),
            moving(60, 14, 3, 1, 0, 1, 0.8, 4),
        ];
        fallingPlatforms = [
            falling(72, 16, 3, 1),
            falling(76, 14, 3, 1),
        ];
        spikes = [
            spike(0, 19, 100, 1),
            spike(38, 13, 2, 1),
        ];
        boostPads = [
            boost(21, 17, 2, 1),
        ];
        checkpoints = [];
    },

    // ----- LEVEL 10: Parkour Master -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(120, 3);
        platforms = [
            plat(0, 18, 5, 2),
            plat(25, 18, 3, 2),
            plat(40, 16, 3, 1),
            plat(60, 18, 3, 2),
            plat(80, 14, 3, 1),
            plat(100, 18, 3, 2),
            plat(115, 4, 8, 1),
        ];
        walls = [
            wall(8, 5, 13),
            wall(12, 5, 13),
            wall(30, 5, 13),
            wall(34, 5, 13),
            wall(50, 5, 13),
            wall(54, 5, 13),
            wall(70, 5, 13),
            wall(74, 5, 13),
            wall(90, 5, 13),
            wall(94, 5, 13),
            wall(108, 2, 10),
            wall(112, 2, 10),
        ];
        movingPlatforms = [
            moving(15, 15, 3, 1, 1, 0, 1.5, 3),
            moving(42, 14, 3, 1, 0, 1, 1, 3),
            moving(65, 12, 3, 1, 1, 0, 1.2, 4),
            moving(95, 10, 3, 1, 0, 1, 1, 4),
        ];
        fallingPlatforms = [
            falling(82, 12, 3, 1),
            falling(86, 10, 3, 1),
            falling(102, 16, 3, 1),
            falling(106, 14, 3, 1),
        ];
        spikes = [
            spike(0, 19, 130, 1),
            spike(42, 15, 1, 1),
            spike(83, 13, 1, 1),
        ];
        boostPads = [
            boost(26, 17, 2, 1),
            boost(61, 17, 2, 1),
            boost(101, 17, 2, 1),
        ];
        checkpoints = [];
    },

    // ----- LEVEL 11: Sky Highway -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(85, 6);
        platforms = [
            plat(0, 18, 6, 2),
            plat(80, 8, 8, 1),
        ];
        movingPlatforms = [
            moving(8, 16, 4, 1, 1, 0, 1, 4),
            moving(20, 14, 4, 1, 1, 0, 0.8, 5),
            moving(35, 12, 4, 1, 0, 1, 0.7, 3),
            moving(48, 10, 4, 1, 1, 0, 1.2, 4),
            moving(62, 8, 4, 1, 0, 1, 0.9, 3),
            moving(72, 8, 3, 1, 1, 0, 1, 3),
        ];
        boostPads = [
            boost(2, 17, 3, 1),
            boost(50, 9, 2, 1),
        ];
        spikes = [
            spike(0, 19, 100, 1),
        ];
        walls = [];
        fallingPlatforms = [];
        checkpoints = [
            checkpoint(38, 10),
        ];
    },

    // ----- LEVEL 12: The Pit -----
    function() {
        spawnPoint = { x: 3 * TILE, y: 2 * TILE };
        goalZone = goal(45, 17);
        platforms = [
            plat(0, 4, 8, 1),
            plat(40, 18, 10, 2),
        ];
        walls = [
            wall(10, 2, 8),
            wall(14, 2, 8),
            wall(18, 6, 8),
            wall(22, 6, 8),
            wall(26, 2, 8),
            wall(30, 2, 8),
            wall(34, 6, 8),
            wall(38, 6, 8),
        ];
        spikes = [
            spike(12, 19, 2, 1),
            spike(20, 19, 2, 1),
            spike(28, 19, 2, 1),
            spike(36, 19, 2, 1),
        ];
        movingPlatforms = [];
        fallingPlatforms = [];
        boostPads = [];
        checkpoints = [
            checkpoint(20, 12),
        ];
    },

    // ----- LEVEL 13: Mirror Run -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(78, 17);
        platforms = [
            plat(0, 18, 8, 2),
            plat(10, 18, 12, 2),
            plat(10, 15, 12, 1),
            plat(24, 18, 6, 2),
            plat(32, 18, 14, 2),
            plat(32, 14, 14, 1),
            plat(48, 18, 6, 2),
            plat(56, 18, 10, 2),
            plat(56, 15, 10, 1),
            plat(68, 18, 14, 2),
        ];
        spikes = [
            spike(12, 17, 8, 1),
            spike(34, 17, 10, 1),
            spike(58, 17, 6, 1),
        ];
        boostPads = [
            boost(25, 17, 2, 1),
            boost(49, 17, 2, 1),
        ];
        walls = [];
        movingPlatforms = [];
        fallingPlatforms = [];
        checkpoints = [
            checkpoint(36, 16),
        ];
    },

    // ----- LEVEL 14: Momentum -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(100, 12);
        platforms = [
            plat(0, 18, 6, 2),
            plat(14, 18, 3, 1),
            plat(24, 16, 3, 1),
            plat(34, 14, 3, 1),
            plat(44, 16, 3, 1),
            plat(54, 18, 4, 2),
            plat(66, 16, 3, 1),
            plat(76, 14, 3, 1),
            plat(86, 16, 3, 1),
            plat(95, 14, 8, 1),
        ];
        boostPads = [
            boost(2, 17, 3, 1),
            boost(15, 17, 2, 1),
            boost(25, 15, 2, 1),
            boost(55, 17, 3, 1),
            boost(67, 15, 2, 1),
            boost(77, 13, 2, 1),
        ];
        spikes = [
            spike(8, 19, 50, 1),
            spike(60, 19, 40, 1),
        ];
        walls = [];
        movingPlatforms = [];
        fallingPlatforms = [];
        checkpoints = [
            checkpoint(56, 16),
        ];
    },

    // ----- LEVEL 15: Final Rush -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(148, 3);
        platforms = [
            plat(0, 18, 6, 2),
            plat(20, 18, 4, 2),
            plat(35, 16, 3, 1),
            plat(50, 18, 4, 2),
            plat(70, 14, 3, 1),
            plat(85, 18, 5, 2),
            plat(85, 14, 5, 1),
            plat(100, 18, 4, 2),
            plat(118, 16, 3, 1),
            plat(130, 18, 4, 2),
            plat(143, 4, 8, 1),
        ];
        walls = [
            wall(10, 6, 12),
            wall(13, 6, 12),
            wall(42, 6, 12),
            wall(45, 6, 12),
            wall(60, 5, 13),
            wall(63, 5, 13),
            wall(108, 4, 14),
            wall(112, 4, 14),
            wall(135, 2, 10),
            wall(140, 2, 10),
        ];
        movingPlatforms = [
            moving(25, 16, 3, 1, 1, 0, 1.2, 3),
            moving(75, 12, 3, 1, 0, 1, 1, 3),
            moving(95, 14, 3, 1, 1, 0, 1, 4),
            moving(122, 14, 3, 1, 0, 1, 0.8, 3),
        ];
        fallingPlatforms = [
            falling(55, 16, 3, 1),
            falling(102, 16, 3, 1),
            falling(106, 14, 3, 1),
            falling(132, 16, 3, 1),
        ];
        boostPads = [
            boost(21, 17, 2, 1),
            boost(51, 17, 2, 1),
            boost(86, 17, 3, 1),
            boost(101, 17, 2, 1),
        ];
        spikes = [
            spike(0, 19, 155, 1),
            spike(37, 15, 2, 1),
            spike(72, 13, 1, 1),
            spike(87, 17, 3, 1),
            spike(120, 15, 2, 1),
        ];
        checkpoints = [
            checkpoint(22, 16),
            checkpoint(52, 16),
            checkpoint(87, 12),
        ];
    },
];

// ---------- GRADE SYSTEM ----------
function getGrade(level, time) {
    if (level < 0 || level >= GRADE_THRESHOLDS.length) return 'none';
    const t = GRADE_THRESHOLDS[level];
    if (time <= t.gold) return 'gold';
    if (time <= t.silver) return 'silver';
    if (time <= t.bronze) return 'bronze';
    return 'none';
}

// ---------- LEVEL LOADING ----------
function loadLevel(index) {
    platforms = [];
    spikes = [];
    movingPlatforms = [];
    fallingPlatforms = [];
    boostPads = [];
    walls = [];
    goalZone = null;
    particles = [];
    checkpoints = [];
    lastCheckpoint = null;
    ghostRecording = [];
    ghostFrame = 0;
    ghostRecordFrame = 0;
    deathCount = 0;

    currentLevel = index;
    LEVELS[index]();

    // Reset falling platforms state
    for (const fp of fallingPlatforms) {
        fp.triggered = false;
        fp.fallTimer = 0;
        fp.fallen = false;
        fp.y = fp.origY;
        fp.vy = 0;
    }

    // Reset moving platform timers
    for (const mp of movingPlatforms) {
        mp.t = 0;
        mp.x = mp.startX;
        mp.y = mp.startY;
        mp.trail = [];
    }

    // Reset checkpoints
    for (const cp of checkpoints) {
        cp.activated = false;
    }

    // Load ghost
    try {
        const saved = localStorage.getItem('parkour_ghost_' + index);
        if (saved) ghostPlayback = JSON.parse(saved);
        else ghostPlayback = [];
    } catch (e) { ghostPlayback = []; }

    resetPlayer();
    levelTimer = 0;
    camera.x = player.x - canvasW / 2;
    camera.y = player.y - canvasH / 2;
    comboCount = 0;
    comboTimer = 0;

    // Update HUD
    const hudLevel = document.getElementById('hud-level');
    const hudBest = document.getElementById('hud-best');
    const hudDeaths = document.getElementById('hud-deaths');
    const hudDash = document.getElementById('hud-dash');
    if (hudLevel) hudLevel.textContent = 'Level ' + (index + 1);
    const best = bestTimes[index];
    if (hudBest) hudBest.textContent = best ? 'Best: ' + best.toFixed(2) + 's' : 'Best: --';
    if (hudDeaths) hudDeaths.textContent = 'Deaths: 0';
    if (hudDash) { hudDash.textContent = 'DASH \u25CF'; hudDash.classList.remove('cooldown'); }

    // Tutorial hint
    showTutorialHint(index);
}

// ---------- TUTORIAL HINTS ----------
function showTutorialHint(level) {
    const el = document.getElementById('tutorial-hint');
    if (!el) return;
    try {
        const shown = localStorage.getItem('parkour_tutorials');
        if (shown) tutorialShown = JSON.parse(shown);
    } catch(e) { tutorialShown = {}; }

    if (level < TUTORIAL_HINTS.length && !tutorialShown[level]) {
        el.textContent = TUTORIAL_HINTS[level];
        el.classList.add('visible');
        tutorialShown[level] = true;
        try { localStorage.setItem('parkour_tutorials', JSON.stringify(tutorialShown)); } catch(e) {}
        tutorialTimer = 240; // ~4 seconds at 60fps
    } else {
        el.classList.remove('visible');
    }
}

// ---------- COLLISION HELPERS ----------
function aabb(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
}

function getAllSolids() {
    const solids = [...platforms, ...walls];
    for (const mp of movingPlatforms) {
        solids.push(mp);
    }
    for (const fp of fallingPlatforms) {
        if (!fp.fallen) solids.push(fp);
    }
    return solids;
}

// ---------- PLAYER PHYSICS & MOVEMENT ----------
function getPlayerState() {
    const p = player;
    if (p.isDashing) return 'dashing';
    if (p.isSliding) return 'sliding';
    if (p.onWallLeft || p.onWallRight) return 'wall_sliding';
    if (p.vy < -1) return 'jumping';
    if (!p.onGround) return 'falling';
    if (Math.abs(p.vx) > 0.5) return 'running';
    return 'idle';
}

function updatePlayer(dt) {
    const p = player;
    const s = dt; // dtScale
    const currentH = p.isSliding ? PLAYER_H_SLIDE : PLAYER_H;
    p.h = currentH;
    p.wasOnGround = p.onGround;

    // ---- Horizontal movement ----
    let inputX = 0;
    if (keys['KeyA'] || keys['ArrowLeft']) inputX = -1;
    if (keys['KeyD'] || keys['ArrowRight']) inputX = 1;

    if (!p.isDashing && !p.isSliding && p.climbTimer <= 0) {
        p.vx = inputX * RUN_SPEED;
        if (inputX !== 0) p.facing = inputX;
    }

    // Track distance for run animation
    playerDistTraveled += Math.abs(p.vx) * s;

    // ---- Dash ----
    if (p.dashCooldown > 0) p.dashCooldown -= s;

    if ((keys['ShiftLeft'] || keys['ShiftRight'] || keys['touchDash']) &&
        !(prevKeys['ShiftLeft'] || prevKeys['ShiftRight'] || prevKeys['touchDash']) &&
        !p.onGround && p.dashTimer <= 0 && p.dashCooldown <= 0) {
        p.isDashing = true;
        p.dashTimer = DASH_DURATION;
        p.dashCooldown = DASH_COOLDOWN;
        p.dashDir = p.facing;
        p.vy = 0;
        playSound('dash');
        spawnParticles(p.x + p.w / 2, p.y + p.h / 2, 12, '#ff4081', 4, 1.5);
        triggerCombo();
    }

    if (p.dashTimer > 0) {
        p.vx = DASH_SPEED * p.dashDir;
        p.vy = 0;
        p.dashTimer -= s;
        if (p.dashTimer <= 0) {
            p.isDashing = false;
            p.vx = inputX * RUN_SPEED;
        }
        spawnParticles(p.x + p.w / 2, p.y + p.h / 2, 2, '#ff4081', 2, 0.5);
        // Dash afterimage trail
        dashTrail.push({ x: p.x, y: p.y, w: p.w, h: p.h, life: 3 });
        if (dashTrail.length > 3) dashTrail.shift();
    } else {
        dashTrail = [];
    }

    // Update dash HUD
    const hudDash = document.getElementById('hud-dash');
    if (hudDash) {
        if (p.dashCooldown > 0) {
            hudDash.textContent = 'DASH \u25CB';
            hudDash.classList.add('cooldown');
        } else {
            hudDash.textContent = 'DASH \u25CF';
            hudDash.classList.remove('cooldown');
        }
    }

    // ---- Slide ----
    if ((keys['KeyS'] || keys['ArrowDown'] || keys['touchSlide']) &&
        !(prevKeys['KeyS'] || prevKeys['ArrowDown'] || prevKeys['touchSlide']) &&
        p.onGround && !p.isSliding && Math.abs(p.vx) > 1) {
        p.isSliding = true;
        p.slideTimer = SLIDE_DURATION;
        p.y += PLAYER_H - PLAYER_H_SLIDE;
        playSound('slide');
        triggerCombo();
    }

    if (p.slideTimer > 0 && p.isSliding) {
        p.vx = SLIDE_SPEED * p.facing;
        p.slideTimer -= s;
        if (p.onGround) {
            spawnParticles(p.x + p.w / 2, p.y + p.h, 1, '#00e5ff', 2, 0.3);
        }
        if (p.slideTimer <= 0) {
            p.isSliding = false;
            const testY = p.y - (PLAYER_H - PLAYER_H_SLIDE);
            const testBox = { x: p.x, y: testY, w: p.w, h: PLAYER_H };
            let blocked = false;
            for (const sol of getAllSolids()) {
                if (aabb(testBox, sol)) { blocked = true; break; }
            }
            if (!blocked) {
                p.y = testY;
            } else {
                p.isSliding = true;
                p.slideTimer = 5;
            }
        }
    }

    // ---- Ledge Climb ----
    if ((keys['KeyE'] || keys['touchClimb']) && p.canClimb && p.climbTimer <= 0 && !p.onGround) {
        p.climbTimer = 10;
        p.vy = -6;
        p.vx = p.facing * 3;
    }
    if (p.climbTimer > 0) {
        p.climbTimer -= s;
    }

    // ---- Gravity ----
    if (!p.isDashing) {
        p.vy += GRAVITY * s;
        if (p.vy > MAX_FALL) p.vy = MAX_FALL;
    }

    // ---- Coyote time & jump buffer ----
    if (p.onGround) {
        p.coyoteTimer = COYOTE_TIME;
        p.dashCooldown = 0;
    } else {
        if (p.coyoteTimer > 0) p.coyoteTimer -= s;
    }

    if ((keys['KeyW'] || keys['Space'] || keys['ArrowUp'] || keys['touchJump']) &&
        !(prevKeys['KeyW'] || prevKeys['Space'] || prevKeys['ArrowUp'] || prevKeys['touchJump'])) {
        p.jumpBuffer = JUMP_BUFFER;
    }
    if (p.jumpBuffer > 0) p.jumpBuffer -= s;

    // ---- Jump ----
    if (p.jumpBuffer > 0 && p.coyoteTimer > 0 && !p.isDashing) {
        p.vy = JUMP_FORCE;
        p.onGround = false;
        p.coyoteTimer = 0;
        p.jumpBuffer = 0;
        jumpSquashTimer = 4;
        if (p.isSliding) {
            p.isSliding = false;
            p.slideTimer = 0;
            p.y -= (PLAYER_H - PLAYER_H_SLIDE);
        }
        playSound('jump');
        spawnParticles(p.x + p.w / 2, p.y + p.h, 8, '#00e5ff', 3, 1);
        triggerCombo();
    }

    // ---- Wall Jump ----
    if (p.jumpBuffer > 0 && !p.onGround && p.coyoteTimer <= 0 && !p.isDashing) {
        if (p.onWallLeft) {
            p.vx = WALL_JUMP_X;
            p.vy = WALL_JUMP_Y;
            p.facing = 1;
            p.jumpBuffer = 0;
            jumpSquashTimer = 4;
            playSound('walljump');
            spawnParticles(p.x, p.y + p.h / 2, 8, '#00ff88', 3, 1);
            triggerCombo();
        } else if (p.onWallRight) {
            p.vx = -WALL_JUMP_X;
            p.vy = WALL_JUMP_Y;
            p.facing = -1;
            p.jumpBuffer = 0;
            jumpSquashTimer = 4;
            playSound('walljump');
            spawnParticles(p.x + p.w, p.y + p.h / 2, 8, '#00ff88', 3, 1);
            triggerCombo();
        }
    }

    // ---- Wall slide ----
    if (!p.onGround && (p.onWallLeft || p.onWallRight) && p.vy > 1 && !p.isDashing) {
        p.vy = Math.min(p.vy, 2);
        if (Math.random() < 0.3) {
            const wx = p.onWallLeft ? p.x : p.x + p.w;
            spawnParticles(wx, p.y + p.h / 2, 1, '#aaa', 1, 0.3);
        }
    }

    // ---- Squash & stretch timers ----
    if (jumpSquashTimer > 0) jumpSquashTimer -= s;
    if (landTimer > 0) landTimer -= s;

    // ---- Move & collide ----
    const solids = getAllSolids();

    // Horizontal
    p.x += p.vx * s;
    p.onWallLeft = false;
    p.onWallRight = false;
    p.canClimb = false;

    const pBox = { x: p.x, y: p.y, w: p.w, h: p.h };

    for (const sol of solids) {
        if (aabb(pBox, sol)) {
            if (p.vx > 0) {
                p.x = sol.x - p.w;
                p.onWallRight = true;
            } else if (p.vx < 0) {
                p.x = sol.x + sol.w;
                p.onWallLeft = true;
            }
            if (p.isDashing) {
                p.isDashing = false;
                p.dashTimer = 0;
            }
            p.vx = 0;
        }
    }

    // Check ledge climb availability
    if (p.onWallLeft || p.onWallRight) {
        const wallEdgeX = p.onWallLeft ? p.x - 2 : p.x + p.w + 2;
        const aboveBox = { x: wallEdgeX - 4, y: p.y - TILE, w: 8, h: TILE };
        let blockedAbove = false;
        for (const sol of solids) {
            if (aabb(aboveBox, sol)) { blockedAbove = true; break; }
        }
        if (!blockedAbove && p.vy >= 0) {
            p.canClimb = true;
        }
    }

    // Vertical
    p.y += p.vy * s;
    p.onGround = false;
    p.ridingPlatform = null;
    pBox.x = p.x;
    pBox.y = p.y;

    for (const sol of solids) {
        if (aabb(pBox, sol)) {
            if (p.vy > 0) {
                p.y = sol.y - p.h;
                p.onGround = true;
                for (const mp of movingPlatforms) {
                    if (mp === sol) p.ridingPlatform = mp;
                }
                // Landing effects
                if (!p.wasOnGround && p.vy > 3) {
                    spawnParticles(p.x + p.w / 2, p.y + p.h, 6, '#fff', 3, 0.8);
                    landTimer = 4;
                }
            } else if (p.vy < 0) {
                p.y = sol.y + sol.h;
            }
            p.vy = 0;
        }
    }

    // ---- Falling platforms trigger ----
    for (const fp of fallingPlatforms) {
        if (fp.fallen) continue;
        const standBox = { x: p.x, y: p.y + p.h, w: p.w, h: 2 };
        const fpBox = { x: fp.x, y: fp.y, w: fp.w, h: fp.h };
        if (aabb(standBox, fpBox)) {
            fp.triggered = true;
        }
    }

    // ---- Boost pads ----
    for (const bp of boostPads) {
        if (aabb({ x: p.x, y: p.y, w: p.w, h: p.h }, bp)) {
            p.vx = DASH_SPEED * bp.dir;
            p.facing = bp.dir;
            playSound('boost');
            spawnParticles(bp.x + bp.w / 2, bp.y, 8, '#ffd700', 4, 1);
            triggerCombo();
        }
    }

    // ---- Checkpoint collision ----
    for (const cp of checkpoints) {
        if (!cp.activated && aabb({ x: p.x, y: p.y, w: p.w, h: p.h }, cp)) {
            cp.activated = true;
            lastCheckpoint = { x: cp.x, y: cp.y - PLAYER_H + TILE };
            playSound('checkpoint');
            spawnParticles(cp.x + cp.w / 2, cp.y, 12, '#00ffaa', 4, 1.5);
        }
    }

    // ---- Spike collision (death) ----
    for (const sp of spikes) {
        if (aabb({ x: p.x + 2, y: p.y + 2, w: p.w - 4, h: p.h - 4 }, sp)) {
            killPlayer();
            return;
        }
    }

    // ---- Goal check ----
    if (goalZone && aabb({ x: p.x, y: p.y, w: p.w, h: p.h }, goalZone)) {
        completeLevel();
        return;
    }

    // ---- Death by falling off screen ----
    if (p.y > WORLD_H * TILE + 100) {
        killPlayer();
    }

    // ---- Ghost recording ----
    ghostRecordFrame++;
    if (ghostRecordFrame % 3 === 0) {
        ghostRecording.push({ x: p.x, y: p.y, state: getPlayerState() });
    }
}

// ---------- COMBO SYSTEM ----------
function triggerCombo() {
    const now = performance.now();
    if (now - lastActionTime < 1000) {
        comboCount++;
    } else {
        comboCount = 1;
    }
    lastActionTime = now;
    comboTimer = 120; // ~2 seconds at 60fps

    const hudCombo = document.getElementById('hud-combo');
    if (hudCombo && comboCount > 1) {
        hudCombo.textContent = 'COMBO x' + comboCount;
        hudCombo.classList.add('visible');
    }
}

function updateCombo(dt) {
    if (comboTimer > 0) {
        comboTimer -= dt;
        if (comboTimer <= 0) {
            comboCount = 0;
            const hudCombo = document.getElementById('hud-combo');
            if (hudCombo) hudCombo.classList.remove('visible');
        }
    }
}

// ---------- MOVING PLATFORMS ----------
function updateMovingPlatforms(dt) {
    for (const mp of movingPlatforms) {
        const prevX = mp.x;
        const prevY = mp.y;
        mp.t += mp.speed * 0.02 * dt;
        mp.x = mp.startX + Math.sin(mp.t) * mp.range * mp.dx;
        mp.y = mp.startY + Math.sin(mp.t) * mp.range * mp.dy;

        // Trail
        mp.trail.push({ x: mp.x, y: mp.y });
        if (mp.trail.length > 5) mp.trail.shift();

        if (player.ridingPlatform === mp) {
            player.x += mp.x - prevX;
            player.y += mp.y - prevY;
        }
    }
}

// ---------- FALLING PLATFORMS ----------
function updateFallingPlatforms(dt) {
    for (const fp of fallingPlatforms) {
        if (fp.fallen) continue;
        if (fp.triggered) {
            fp.fallTimer += dt;
            if (fp.fallTimer < 30) {
                fp.x = fp.x + (Math.random() - 0.5) * 2;
            } else {
                if (fp.fallTimer >= 30 && fp.fallTimer < 31) {
                    // Spawn debris particles when first starting to fall
                    spawnParticles(fp.x + fp.w / 2, fp.y + fp.h / 2, 6, '#7a5a3a', 3, 1);
                }
                fp.vy += GRAVITY * dt;
                fp.y += fp.vy * dt;
                if (fp.y > WORLD_H * TILE + 100) {
                    fp.fallen = true;
                }
            }
        }
    }
}

function killPlayer() {
    gameState = 'dead';
    deathCount++;
    totalDeaths++;
    screenShake = 12;
    playSound('death');
    spawnParticles(player.x + player.w / 2, player.y + player.h / 2, 20, '#ff4444', 6, 2);

    const hudDeaths = document.getElementById('hud-deaths');
    if (hudDeaths) hudDeaths.textContent = 'Deaths: ' + deathCount;

    // If we have a checkpoint, auto-retry from there
    if (lastCheckpoint) {
        setTimeout(() => {
            if (gameState === 'dead') {
                respawnAtCheckpoint();
            }
        }, 600);
    } else {
        document.getElementById('death-overlay').classList.remove('hidden');
    }
}

function respawnAtCheckpoint() {
    gameState = 'playing';
    spawnPoint = { x: lastCheckpoint.x, y: lastCheckpoint.y };
    resetPlayer();
    camera.x = player.x - canvasW / 2;
    camera.y = player.y - canvasH / 2;

    // Reset falling platforms
    for (const fp of fallingPlatforms) {
        fp.triggered = false;
        fp.fallTimer = 0;
        fp.fallen = false;
        fp.y = fp.origY;
        fp.vy = 0;
    }
}

function completeLevel() {
    gameState = 'complete';
    playSound('complete');
    stopMusic();

    const time = levelTimer;
    const isNewRecord = !bestTimes[currentLevel] || time < bestTimes[currentLevel];

    if (isNewRecord) {
        bestTimes[currentLevel] = time;
        saveBestTimes();
        // Save ghost for best run
        try {
            localStorage.setItem('parkour_ghost_' + currentLevel, JSON.stringify(ghostRecording));
        } catch(e) {}
    }

    // Grade
    const grade = getGrade(currentLevel, time);
    if (grade !== 'none') {
        const savedGrade = bestGrades[currentLevel];
        const gradeRank = { gold: 3, silver: 2, bronze: 1, none: 0 };
        if (!savedGrade || gradeRank[grade] > gradeRank[savedGrade]) {
            bestGrades[currentLevel] = grade;
            try { localStorage.setItem('parkour_grades', JSON.stringify(bestGrades)); } catch(e) {}
        }
    }

    // Unlock next level
    if (currentLevel + 1 > unlockedLevel && currentLevel + 1 < LEVELS.length) {
        unlockedLevel = currentLevel + 1;
        try { localStorage.setItem('parkour_unlocked', unlockedLevel); } catch(e) {}
    }

    // Update complete overlay
    document.getElementById('complete-time').textContent = 'Time: ' + time.toFixed(2) + 's';
    document.getElementById('complete-best').textContent = 'Best: ' + bestTimes[currentLevel].toFixed(2) + 's';

    const deathEl = document.getElementById('death-count');
    if (deathEl) deathEl.textContent = deathCount > 0 ? 'Deaths: ' + deathCount : '';

    // Grade display
    const gradeEl = document.getElementById('complete-grade');
    if (gradeEl) {
        const starClass = grade !== 'none' ? 'star-' + grade : 'star-none';
        const stars = grade === 'gold' ? '\u2605\u2605\u2605' :
                      grade === 'silver' ? '\u2605\u2605' :
                      grade === 'bronze' ? '\u2605' : '';
        gradeEl.innerHTML = '<span class="' + starClass + '">' + stars + '</span>';
    }

    const newRecordEl = document.getElementById('complete-new-record');
    if (isNewRecord) {
        newRecordEl.classList.remove('hidden');
    } else {
        newRecordEl.classList.add('hidden');
    }

    document.getElementById('btn-next').style.display =
        currentLevel + 1 >= LEVELS.length ? 'none' : '';

    document.getElementById('complete-overlay').classList.remove('hidden');

    // Victory particles
    for (let i = 0; i < 40; i++) {
        const colors = ['#00e5ff', '#ff4081', '#ffd700', '#4caf50'];
        spawnParticles(
            player.x + player.w / 2 + (Math.random() - 0.5) * 100,
            player.y + (Math.random() - 0.5) * 100,
            1, colors[Math.floor(Math.random() * colors.length)], 5, 2
        );
    }
}

// ---------- CAMERA ----------
function updateCamera(dt) {
    const targetX = player.x - canvasW / 2 + player.w / 2;
    const targetY = player.y - canvasH / 2 + player.h / 2;
    const smooth = 1 - Math.pow(1 - CAM_SMOOTH, dt);
    camera.x += (targetX - camera.x) * smooth;
    camera.y += (targetY - camera.y) * smooth;

    if (camera.y > (WORLD_H - 2) * TILE - canvasH) {
        camera.y = (WORLD_H - 2) * TILE - canvasH;
    }
}

// ---------- RENDERING ----------
function drawBackground() {
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Parallax city
    if (bgGenerated) {
        for (let l = 0; l < bgLayers.length; l++) {
            const layer = bgLayers[l];
            ctx.fillStyle = layer.color;
            for (const b of layer.buildings) {
                const bx = (b.x - camera.x * layer.parallax) % (canvasW + 200) - 100;
                const by = canvasH - b.h;
                if (bx + b.w < -10 || bx > canvasW + 10) continue;
                ctx.fillRect(bx, by, b.w, b.h);
                // Windows
                if (b.windows) {
                    const winColor = l === 0 ? 'rgba(0, 200, 255, 0.08)' :
                                     l === 1 ? 'rgba(0, 200, 255, 0.06)' :
                                               'rgba(0, 200, 255, 0.04)';
                    ctx.fillStyle = winColor;
                    for (let wy = by + 8; wy < canvasH - 8; wy += 16) {
                        for (let wx = bx + 4; wx < bx + b.w - 4; wx += 10) {
                            ctx.fillRect(wx, wy, 4, 6);
                        }
                    }
                    ctx.fillStyle = layer.color;
                }
            }
        }
    }

    // Subtle grid
    ctx.strokeStyle = '#151525';
    ctx.lineWidth = 1;
    const gridSize = 64;
    const offsetX = (-camera.x * 0.3) % gridSize;
    const offsetY = (-camera.y * 0.3) % gridSize;
    for (let x = offsetX; x < canvasW; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasH);
        ctx.stroke();
    }
    for (let y = offsetY; y < canvasH; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasW, y);
        ctx.stroke();
    }
}

function drawPlatforms() {
    for (const p of platforms) {
        const sx = p.x - camera.x;
        const sy = p.y - camera.y;
        if (sx + p.w < 0 || sx > canvasW || sy + p.h < 0 || sy > canvasH) continue;

        // Main body — bright enough to see clearly
        ctx.fillStyle = '#3d3d6b';
        ctx.fillRect(sx, sy, p.w, p.h);
        // Bright top edge — neon highlight so you can see where to land
        ctx.fillStyle = '#6a6aff';
        ctx.fillRect(sx, sy, p.w, 3);
        // Glowing top line
        ctx.fillStyle = 'rgba(106, 106, 255, 0.3)';
        ctx.fillRect(sx, sy - 2, p.w, 2);
        // Bottom shadow
        ctx.fillStyle = '#1e1e40';
        ctx.fillRect(sx, sy + p.h - 4, p.w, 4);
        // Side edges
        ctx.fillStyle = '#4e4e8a';
        ctx.fillRect(sx, sy, 2, p.h);
        ctx.fillRect(sx + p.w - 2, sy, 2, p.h);
        // Rivets
        ctx.fillStyle = '#5555aa';
        for (let rx = TILE / 2; rx < p.w; rx += TILE) {
            ctx.fillRect(sx + rx - 2, sy + 6, 4, 4);
            if (p.h > TILE) ctx.fillRect(sx + rx - 2, sy + p.h - 10, 4, 4);
        }
        // Grid lines
        ctx.strokeStyle = '#2b2b55';
        ctx.lineWidth = 1;
        for (let gx = TILE; gx < p.w; gx += TILE) {
            ctx.beginPath();
            ctx.moveTo(sx + gx, sy);
            ctx.lineTo(sx + gx, sy + p.h);
            ctx.stroke();
        }
        for (let gy = TILE; gy < p.h; gy += TILE) {
            ctx.beginPath();
            ctx.moveTo(sx, sy + gy);
            ctx.lineTo(sx + p.w, sy + gy);
            ctx.stroke();
        }
    }
}

function drawWalls() {
    for (const w of walls) {
        const sx = w.x - camera.x;
        const sy = w.y - camera.y;
        if (sx + w.w < 0 || sx > canvasW || sy + w.h < 0 || sy > canvasH) continue;

        // Main body — bright green-tinted
        ctx.fillStyle = '#3a5a3a';
        ctx.fillRect(sx, sy, w.w, w.h);
        // Bright side edges — neon green highlights
        ctx.fillStyle = '#55cc55';
        ctx.fillRect(sx, sy, 3, w.h);
        ctx.fillRect(sx + w.w - 3, sy, 3, w.h);
        // Glow on edges
        ctx.fillStyle = 'rgba(85, 204, 85, 0.2)';
        ctx.fillRect(sx - 2, sy, 2, w.h);
        ctx.fillRect(sx + w.w, sy, 2, w.h);
        // Top/bottom caps
        ctx.fillStyle = '#4a7a4a';
        ctx.fillRect(sx, sy, w.w, 2);
        ctx.fillRect(sx, sy + w.h - 2, w.w, 2);
        // Rivets
        ctx.fillStyle = '#5a8a5a';
        for (let ry = TILE / 2; ry < w.h; ry += TILE) {
            ctx.fillRect(sx + w.w / 2 - 2, sy + ry - 2, 4, 4);
        }
        ctx.strokeStyle = '#2a3a2a';
        ctx.lineWidth = 1;
        for (let gy = TILE; gy < w.h; gy += TILE) {
            ctx.beginPath();
            ctx.moveTo(sx, sy + gy);
            ctx.lineTo(sx + w.w, sy + gy);
            ctx.stroke();
        }
    }
}

function drawSpikes() {
    const pulseAlpha = Math.sin(Date.now() * 0.005) * 0.15 + 0.25;
    for (const s of spikes) {
        const sx = s.x - camera.x;
        const sy = s.y - camera.y;
        if (sx + s.w < 0 || sx > canvasW || sy + s.h < 0 || sy > canvasH) continue;

        // Pulsing glow behind spikes
        ctx.fillStyle = `rgba(255, 50, 50, ${pulseAlpha * 0.3})`;
        ctx.fillRect(sx, sy - 2, s.w, s.h + 4);

        // Spike triangles
        const spikeW = 12;
        for (let i = 0; i < s.w; i += spikeW) {
            ctx.fillStyle = '#ff4444';
            ctx.beginPath();
            ctx.moveTo(sx + i, sy + s.h);
            ctx.lineTo(sx + i + spikeW / 2, sy + 2);
            ctx.lineTo(sx + i + spikeW, sy + s.h);
            ctx.fill();
            // White tip
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(sx + i + spikeW / 2 - 1, sy + 2, 2, 3);
        }
    }
}

function drawMovingPlatforms() {
    for (const mp of movingPlatforms) {
        const sx = mp.x - camera.x;
        const sy = mp.y - camera.y;
        if (sx + mp.w < -50 || sx > canvasW + 50 || sy + mp.h < -50 || sy > canvasH + 50) continue;

        // Glow trail
        for (let t = 0; t < mp.trail.length; t++) {
            const tr = mp.trail[t];
            const alpha = (t + 1) / (mp.trail.length + 1) * 0.15;
            ctx.fillStyle = `rgba(122, 90, 170, ${alpha})`;
            ctx.fillRect(tr.x - camera.x, tr.y - camera.y, mp.w, mp.h);
        }

        ctx.fillStyle = '#5a4a8a';
        ctx.fillRect(sx, sy, mp.w, mp.h);
        // Bright purple top edge
        ctx.fillStyle = '#aa7aff';
        ctx.fillRect(sx, sy, mp.w, 3);
        ctx.fillStyle = 'rgba(170, 122, 255, 0.25)';
        ctx.fillRect(sx, sy - 2, mp.w, 2);
        // Side edges
        ctx.fillStyle = '#6a5a9a';
        ctx.fillRect(sx, sy, 2, mp.h);
        ctx.fillRect(sx + mp.w - 2, sy, 2, mp.h);

        // Path guide
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(170, 122, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (mp.dx) {
            ctx.moveTo(mp.startX + mp.w / 2 - camera.x - mp.range, mp.startY + mp.h / 2 - camera.y);
            ctx.lineTo(mp.startX + mp.w / 2 - camera.x + mp.range, mp.startY + mp.h / 2 - camera.y);
        }
        if (mp.dy) {
            ctx.moveTo(mp.startX + mp.w / 2 - camera.x, mp.startY + mp.h / 2 - camera.y - mp.range);
            ctx.lineTo(mp.startX + mp.w / 2 - camera.x, mp.startY + mp.h / 2 - camera.y + mp.range);
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

function drawFallingPlatforms() {
    for (const fp of fallingPlatforms) {
        if (fp.fallen) continue;
        const sx = fp.x - camera.x;
        const sy = fp.y - camera.y;
        if (sx + fp.w < 0 || sx > canvasW || sy + fp.h < 0 || sy > canvasH) continue;

        if (fp.triggered && fp.fallTimer < 30) {
            ctx.fillStyle = fp.fallTimer % 6 < 3 ? '#8a4a3a' : '#6a3a2a';
        } else {
            ctx.fillStyle = '#6a5035';
        }
        ctx.fillRect(sx, sy, fp.w, fp.h);
        // Bright orange top edge
        ctx.fillStyle = '#cc8844';
        ctx.fillRect(sx, sy, fp.w, 3);
        ctx.fillStyle = 'rgba(204, 136, 68, 0.25)';
        ctx.fillRect(sx, sy - 2, fp.w, 2);

        // Progressive crack lines
        ctx.strokeStyle = '#3a2a1a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx + fp.w * 0.3, sy);
        ctx.lineTo(sx + fp.w * 0.5, sy + fp.h);
        ctx.moveTo(sx + fp.w * 0.7, sy);
        ctx.lineTo(sx + fp.w * 0.4, sy + fp.h);
        if (fp.triggered && fp.fallTimer > 10) {
            ctx.moveTo(sx + fp.w * 0.1, sy + fp.h * 0.3);
            ctx.lineTo(sx + fp.w * 0.6, sy + fp.h * 0.7);
        }
        if (fp.triggered && fp.fallTimer > 20) {
            ctx.moveTo(sx + fp.w * 0.8, sy + fp.h * 0.2);
            ctx.lineTo(sx + fp.w * 0.3, sy + fp.h * 0.9);
        }
        ctx.stroke();
    }
}

function drawBoostPads() {
    const pulse = Math.sin(Date.now() * 0.008) * 0.2 + 0.8;
    for (const bp of boostPads) {
        const sx = bp.x - camera.x;
        const sy = bp.y - camera.y;
        if (sx + bp.w < 0 || sx > canvasW) continue;

        ctx.globalAlpha = pulse;
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(sx, sy, bp.w, bp.h);
        ctx.globalAlpha = 1;

        // Arrow
        ctx.fillStyle = '#0a0a0f';
        const arrowX = sx + bp.w / 2;
        const arrowY = sy + bp.h / 2;
        ctx.beginPath();
        if (bp.dir > 0) {
            ctx.moveTo(arrowX - 8, arrowY - 5);
            ctx.lineTo(arrowX + 8, arrowY);
            ctx.lineTo(arrowX - 8, arrowY + 5);
        } else {
            ctx.moveTo(arrowX + 8, arrowY - 5);
            ctx.lineTo(arrowX - 8, arrowY);
            ctx.lineTo(arrowX + 8, arrowY + 5);
        }
        ctx.fill();
    }
}

function drawCheckpoints() {
    for (const cp of checkpoints) {
        const sx = cp.x - camera.x;
        const sy = cp.y - camera.y;
        if (sx < -50 || sx > canvasW + 50) continue;

        const pulse = Math.sin(Date.now() * 0.004) * 0.3 + 0.7;

        // Flag pole
        ctx.fillStyle = cp.activated ? '#00ffaa' : '#555';
        ctx.fillRect(sx + cp.w / 2 - 2, sy, 4, cp.h);

        // Flag triangle
        const flagColor = cp.activated ? `rgba(0, 255, 170, ${pulse})` : 'rgba(100, 100, 100, 0.5)';
        ctx.fillStyle = flagColor;
        ctx.beginPath();
        ctx.moveTo(sx + cp.w / 2 + 2, sy);
        ctx.lineTo(sx + cp.w / 2 + 18, sy + 8);
        ctx.lineTo(sx + cp.w / 2 + 2, sy + 16);
        ctx.fill();

        // Glow when activated
        if (cp.activated) {
            ctx.fillStyle = `rgba(0, 255, 170, ${pulse * 0.1})`;
            ctx.fillRect(sx - 4, sy - 4, cp.w + 8, cp.h + 8);
        }
    }
}

function drawGoal() {
    if (!goalZone) return;
    const sx = goalZone.x - camera.x;
    const sy = goalZone.y - camera.y;
    const now = Date.now();
    const pulse = Math.sin(now * 0.005) * 0.3 + 0.7;

    // Radial glow
    ctx.fillStyle = `rgba(0, 229, 255, ${0.08 * pulse})`;
    ctx.fillRect(sx - 12, sy - 12, goalZone.w + 24, goalZone.h + 24);
    ctx.fillStyle = `rgba(0, 229, 255, ${0.15 * pulse})`;
    ctx.fillRect(sx - 4, sy - 4, goalZone.w + 8, goalZone.h + 8);
    ctx.fillStyle = `rgba(0, 229, 255, ${0.3 * pulse})`;
    ctx.fillRect(sx, sy, goalZone.w, goalZone.h);

    // Rotating rings (3 concentric)
    const cx = sx + goalZone.w / 2;
    const cy = sy + goalZone.h / 2;
    for (let r = 0; r < 3; r++) {
        const radius = 12 + r * 8;
        const angle = now * (0.002 + r * 0.001) * (r % 2 === 0 ? 1 : -1);
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.4 - r * 0.1})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, angle, angle + Math.PI * 1.2);
        ctx.stroke();
    }

    // Flag marker
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(cx - 2, sy, 4, goalZone.h);
    ctx.fillStyle = '#ff4081';
    ctx.beginPath();
    ctx.moveTo(cx + 2, sy);
    ctx.lineTo(cx + 20, sy + 10);
    ctx.lineTo(cx + 2, sy + 20);
    ctx.fill();

    // Particle fountain upward
    if (gameState === 'playing' && Math.random() < 0.3) {
        spawnParticles(cx, sy + goalZone.h, 1, '#00e5ff', 1, 0.5);
    }
}

function toggleGhost() {
    ghostEnabled = !ghostEnabled;
    try { localStorage.setItem('parkour_ghost_enabled', ghostEnabled); } catch(e) {}
    const label = ghostEnabled ? 'GHOST: ON' : 'GHOST: OFF';
    const btn1 = document.getElementById('btn-ghost-toggle');
    const btn2 = document.getElementById('btn-ghost-pause');
    if (btn1) btn1.textContent = label;
    if (btn2) btn2.textContent = label;
}

function drawGhost() {
    if (!ghostEnabled || ghostPlayback.length === 0 || gameState !== 'playing') return;
    const idx = Math.min(ghostFrame, ghostPlayback.length - 1);
    const g = ghostPlayback[idx];
    if (!g) return;

    const gx = g.x - camera.x;
    const gy = g.y - camera.y;
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(gx, gy, PLAYER_W, PLAYER_H);
    ctx.globalAlpha = 1;
}

function drawPlayer() {
    const p = player;
    const sx = p.x - camera.x;
    const sy = p.y - camera.y;
    const state = getPlayerState();
    const centerX = sx + p.w / 2;
    const bottomY = sy + p.h;

    // Dash afterimage
    for (let i = 0; i < dashTrail.length; i++) {
        const dt = dashTrail[i];
        const alpha = [0.05, 0.1, 0.15][i] || 0.05;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ff4081';
        ctx.fillRect(dt.x - camera.x, dt.y - camera.y, dt.w, dt.h);
    }
    ctx.globalAlpha = 1;

    // Squash & stretch
    let scaleX = 1, scaleY = 1;
    if (jumpSquashTimer > 0) {
        const t = jumpSquashTimer / 4;
        scaleX = 1 - 0.2 * t;
        scaleY = 1 + 0.2 * t;
    }
    if (landTimer > 0) {
        const t = landTimer / 4;
        scaleX = 1 + 0.3 * t;
        scaleY = 1 - 0.3 * t;
    }

    ctx.save();
    ctx.translate(centerX, bottomY);
    ctx.scale(p.facing * scaleX, scaleY);

    // Draw character based on state
    if (state === 'sliding') {
        // Sliding: body low and horizontal
        ctx.fillStyle = '#00b8d4';
        ctx.fillRect(-10, -PLAYER_H_SLIDE, 20, PLAYER_H_SLIDE);
        // Head
        ctx.fillStyle = '#00e5ff';
        ctx.fillRect(-4, -PLAYER_H_SLIDE, 8, 6);
        // Eye
        ctx.fillStyle = '#fff';
        ctx.fillRect(1, -PLAYER_H_SLIDE + 2, 2, 2);
    } else {
        // Body color based on state
        let bodyColor = '#00e5ff';
        if (state === 'dashing') bodyColor = '#ff4081';
        else if (state === 'jumping' || state === 'falling') bodyColor = '#33ecff';
        else if (state === 'wall_sliding') bodyColor = '#00cc99';

        // Head (8x8)
        ctx.fillStyle = bodyColor;
        ctx.fillRect(-4, -PLAYER_H, 8, 8);

        // Eyes (2x2 white dots)
        ctx.fillStyle = '#fff';
        ctx.fillRect(1, -PLAYER_H + 3, 2, 2);

        // Torso (12x10)
        const breathOffset = state === 'idle' ? Math.sin(Date.now() * 0.003) * 0.5 : 0;
        ctx.fillStyle = bodyColor;
        ctx.fillRect(-6, -PLAYER_H + 8 + breathOffset, 12, 10);

        // Arms (4x8 each side)
        const animCycle = Math.floor(playerDistTraveled / 12) % 4;
        let leftArmY = -PLAYER_H + 9;
        let rightArmY = -PLAYER_H + 9;

        if (state === 'running') {
            const offsets = [0, -3, 0, 3];
            leftArmY += offsets[animCycle];
            rightArmY += offsets[(animCycle + 2) % 4];
        } else if (state === 'jumping') {
            leftArmY -= 4;
            rightArmY -= 4;
        } else if (state === 'falling') {
            leftArmY -= 2;
            rightArmY -= 2;
        } else if (state === 'dashing') {
            leftArmY += 2;
            rightArmY += 2;
        }

        ctx.fillRect(-10, leftArmY, 4, 8);
        ctx.fillRect(6, rightArmY, 4, 8);

        // Legs (4x10 each)
        let leftLegY = -PLAYER_H + 18;
        let rightLegY = -PLAYER_H + 18;
        let leftLegX = -5;
        let rightLegX = 1;

        if (state === 'running') {
            const legOffsets = [0, -3, 0, 3];
            leftLegY += legOffsets[animCycle];
            rightLegY += legOffsets[(animCycle + 2) % 4];
            leftLegX += (animCycle < 2 ? -1 : 1);
            rightLegX += (animCycle < 2 ? 1 : -1);
        } else if (state === 'jumping') {
            leftLegY += 3;
            rightLegY += 3;
            leftLegX -= 1;
            rightLegX += 1;
        } else if (state === 'falling') {
            leftLegX -= 2;
            rightLegX += 2;
        } else if (state === 'wall_sliding') {
            leftLegX = -3;
            rightLegX = -1;
        }

        ctx.fillRect(leftLegX, leftLegY, 4, 10);
        ctx.fillRect(rightLegX, rightLegY, 4, 10);
    }

    ctx.restore();

    // Climb indicator
    if (p.canClimb) {
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(sx + p.w / 2 - 3, sy - 8, 6, 4);
    }
}

// Speed lines when moving fast
function drawSpeedLines() {
    if (Math.abs(player.vx) < 8) return;
    const alpha = Math.min((Math.abs(player.vx) - 8) / 10, 0.4);
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1;
    const dir = player.vx > 0 ? -1 : 1;
    for (let i = 0; i < 6; i++) {
        const y = Math.random() * canvasH;
        const x = dir > 0 ? 0 : canvasW;
        const len = 40 + Math.random() * 60;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + len * dir, y);
        ctx.stroke();
    }
}

// Vignette
function drawVignette() {
    const grd = ctx.createRadialGradient(
        canvasW / 2, canvasH / 2, canvasH * 0.3,
        canvasW / 2, canvasH / 2, canvasH * 0.85
    );
    grd.addColorStop(0, 'rgba(0,0,0,0)');
    grd.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvasW, canvasH);
}

// ---------- MAIN GAME LOOP ----------
function gameLoop(timestamp) {
    requestAnimationFrame(gameLoop);

    // Delta time
    const now = timestamp || performance.now();
    const dt = now - lastTime;
    lastTime = now;
    dtScale = dt / (1000 / 60);
    // Cap dtScale to prevent physics explosions
    if (dtScale < 0.5) dtScale = 0.5;
    if (dtScale > 3) dtScale = 3;

    // FPS tracking
    fpsHistory.push(1000 / Math.max(dt, 1));
    if (fpsHistory.length > 60) fpsHistory.shift();
    if (fpsHistory.length >= 60) {
        const avgFps = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;
        if (avgFps < 30 && !lowFpsMode) {
            lowFpsMode = true;
            initAmbientParticles();
        }
    }

    // Menu background
    if (currentScreen === 'menu' || currentScreen === 'level' || currentScreen === 'controls') {
        drawMenuBackground();
    }

    if (gameState === 'playing') {
        levelTimer += dt / 1000;
        updatePlayer(dtScale);
        updateMovingPlatforms(dtScale);
        updateFallingPlatforms(dtScale);
        updateCamera(dtScale);
        updateCombo(dtScale);

        // Tutorial hint timer
        if (tutorialTimer > 0) {
            tutorialTimer -= dtScale;
            if (tutorialTimer <= 0) {
                const el = document.getElementById('tutorial-hint');
                if (el) el.classList.remove('visible');
            }
        }

        // Ghost playback frame
        if (ghostPlayback.length > 0) {
            ghostFrame++;
            if (ghostFrame >= ghostPlayback.length) ghostFrame = ghostPlayback.length - 1;
        }

        // Update HUD timer
        const hudTimer = document.getElementById('hud-timer');
        if (hudTimer) hudTimer.textContent = levelTimer.toFixed(2) + 's';
    }

    updateParticles(dtScale);

    // Screen shake decay
    if (screenShake > 0.1) {
        screenShake *= 0.85;
    } else {
        screenShake = 0;
    }

    // Render
    if (currentScreen === 'game') {
        // Apply screen shake
        ctx.save();
        if (screenShake > 0.5) {
            ctx.translate(
                (Math.random() - 0.5) * screenShake,
                (Math.random() - 0.5) * screenShake
            );
        }

        drawBackground();
        drawAmbientParticles();
        updateAmbientParticles(dtScale);
        drawGhost();
        drawGoal();
        drawCheckpoints();
        drawPlatforms();
        drawWalls();
        drawSpikes();
        drawMovingPlatforms();
        drawFallingPlatforms();
        drawBoostPads();
        drawPlayer();
        drawParticles();
        drawSpeedLines();
        drawVignette();

        ctx.restore();
    }

    // Store previous keys for edge detection
    prevKeys = {};
    for (const k in keys) {
        prevKeys[k] = keys[k];
    }
}

// ---------- INPUT HANDLING ----------
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    initAudio();

    if (e.code === 'KeyR' && gameState === 'playing') {
        const now = performance.now();
        if (now - lastRPressTime < 500) {
            // Double-tap R: restart from Level 1
            lastRPressTime = 0;
            deathCount = 0;
            doScreenWipe(() => startLevel(0));
        } else {
            // Single R: restart current level
            lastRPressTime = now;
            loadLevel(currentLevel);
            gameState = 'playing';
        }
    }

    if (e.code === 'Escape') {
        if (gameState === 'playing') {
            gameState = 'paused';
            stopMusic();
            document.getElementById('pause-overlay').classList.remove('hidden');
            const gpb = document.getElementById('btn-ghost-pause');
            if (gpb) gpb.textContent = ghostEnabled ? 'GHOST: ON' : 'GHOST: OFF';
        } else if (gameState === 'paused') {
            gameState = 'playing';
            startMusic();
            document.getElementById('pause-overlay').classList.add('hidden');
        }
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

window.addEventListener('keydown', (e) => {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
    }
});

// ---------- TOUCH CONTROLS ----------
function initTouchControls() {
    if (!isMobile) return;

    const touchEl = document.getElementById('touch-controls');
    if (touchEl) touchEl.classList.add('visible');

    const mappings = {
        'touch-left': 'ArrowLeft',
        'touch-right': 'ArrowRight',
        'touch-jump': 'touchJump',
        'touch-dash': 'touchDash',
        'touch-slide': 'touchSlide'
    };

    for (const [id, key] of Object.entries(mappings)) {
        const el = document.getElementById(id);
        if (!el) continue;

        el.addEventListener('touchstart', (e) => {
            e.preventDefault();
            initAudio();
            keys[key] = true;
            // Map touch dash/slide to actual keys
            if (key === 'touchDash') keys['ShiftLeft'] = true;
            if (key === 'touchSlide') keys['KeyS'] = true;
            if (key === 'touchJump') keys['Space'] = true;
        }, { passive: false });

        el.addEventListener('touchend', (e) => {
            e.preventDefault();
            keys[key] = false;
            if (key === 'touchDash') keys['ShiftLeft'] = false;
            if (key === 'touchSlide') keys['KeyS'] = false;
            if (key === 'touchJump') keys['Space'] = false;
        }, { passive: false });

        el.addEventListener('touchcancel', (e) => {
            keys[key] = false;
            if (key === 'touchDash') keys['ShiftLeft'] = false;
            if (key === 'touchSlide') keys['KeyS'] = false;
            if (key === 'touchJump') keys['Space'] = false;
        });
    }
}

// Prevent rubber-banding on iOS
document.addEventListener('touchmove', (e) => {
    if (currentScreen === 'game') {
        e.preventDefault();
    }
}, { passive: false });

// Tab visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (gameState === 'playing') {
            gameState = 'paused';
            stopMusic();
            document.getElementById('pause-overlay').classList.remove('hidden');
        }
    } else {
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }
});

// ---------- SAVE / LOAD ----------
function saveBestTimes() {
    try { localStorage.setItem('parkour_best', JSON.stringify(bestTimes)); } catch(e) {}
}

function loadBestTimes() {
    try {
        const saved = localStorage.getItem('parkour_best');
        if (saved) bestTimes = JSON.parse(saved);
    } catch (e) { bestTimes = {}; }
    try {
        const grades = localStorage.getItem('parkour_grades');
        if (grades) bestGrades = JSON.parse(grades);
    } catch(e) { bestGrades = {}; }
    try {
        unlockedLevel = parseInt(localStorage.getItem('parkour_unlocked') || '0');
    } catch(e) { unlockedLevel = 0; }
    try {
        const ge = localStorage.getItem('parkour_ghost_enabled');
        if (ge !== null) ghostEnabled = ge !== 'false';
    } catch(e) {}
}

// ---------- SCREEN MANAGEMENT ----------
function showScreen(name) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => {
        s.classList.add('fading');
    });

    setTimeout(() => {
        screens.forEach(s => {
            s.classList.remove('active');
            s.classList.remove('fading');
        });
        const target = document.getElementById(name + '-screen');
        if (target) target.classList.add('active');
        currentScreen = name;

        // Show/hide touch controls
        const touchEl = document.getElementById('touch-controls');
        if (touchEl) {
            if (isMobile && name === 'game') {
                touchEl.classList.add('visible');
            } else {
                touchEl.classList.remove('visible');
            }
        }
    }, 150);
}

function doScreenWipe(callback) {
    const wipe = document.getElementById('screen-wipe');
    if (!wipe) { callback(); return; }

    // Remove and re-add class to restart animation
    wipe.classList.remove('active');
    void wipe.offsetWidth; // Force reflow
    wipe.classList.add('active');

    setTimeout(() => {
        callback();
    }, 250);

    setTimeout(() => {
        wipe.classList.remove('active');
    }, 600);
}

function populateLevelGrid() {
    const grid = document.getElementById('level-grid');
    grid.innerHTML = '';
    for (let i = 0; i < LEVELS.length; i++) {
        const tile = document.createElement('div');
        tile.className = 'level-tile';
        if (i > unlockedLevel) tile.classList.add('locked');
        if (bestTimes[i]) tile.classList.add('completed');

        let gradeHTML = '';
        if (bestGrades[i]) {
            const g = bestGrades[i];
            const cls = 'level-grade grade-' + g;
            const star = g === 'gold' ? '\u2605\u2605\u2605' : g === 'silver' ? '\u2605\u2605' : '\u2605';
            gradeHTML = '<span class="' + cls + '">' + star + '</span>';
        }

        tile.innerHTML =
            '<span class="level-num">' + (i + 1) + '</span>' +
            '<span class="level-best">' + (bestTimes[i] ? bestTimes[i].toFixed(2) + 's' : '---') + '</span>' +
            gradeHTML;

        if (i <= unlockedLevel) {
            tile.addEventListener('click', ((lvl) => () => {
                initAudio();
                playSound('click');
                doScreenWipe(() => startLevel(lvl));
            })(i));
        }
        grid.appendChild(tile);
    }
}

function startLevel(index) {
    showScreen('game');
    loadLevel(index);
    gameState = 'playing';
    startMusic();
    document.getElementById('pause-overlay').classList.add('hidden');
    document.getElementById('complete-overlay').classList.add('hidden');
    document.getElementById('death-overlay').classList.add('hidden');
}

// ---------- LEVEL EDITOR ----------
function initEditor() {
    editorCanvas = document.getElementById('editorCanvas');
    editorCtx = editorCanvas.getContext('2d');
    editorObjects = [];
    editorSpawn = { x: 2, y: 16 };
    editorGoal = { x: 50, y: 16 };
    editorCamera = { x: 0, y: 0 };

    let isDrawing = false;
    let dragStart = null;
    let lastRightClick = null;

    editorCanvas.addEventListener('mousedown', (e) => {
        initAudio();
        const mx = e.offsetX + editorCamera.x;
        const my = e.offsetY + editorCamera.y;
        const tx = Math.floor(mx / TILE);
        const ty = Math.floor(my / TILE);

        if (e.button === 2) {
            lastRightClick = { x: e.clientX, y: e.clientY };
            return;
        }

        if (editorTool === 'spawn') {
            editorSpawn = { x: tx, y: ty };
            playSound('click');
        } else if (editorTool === 'goal') {
            editorGoal = { x: tx, y: ty };
            playSound('click');
        } else if (editorTool === 'erase') {
            editorObjects = editorObjects.filter(o => {
                return !(tx >= o.tx && tx < o.tx + (o.tw || 1) &&
                         ty >= o.ty && ty < o.ty + (o.th || 1));
            });
            playSound('click');
        } else {
            isDrawing = true;
            dragStart = { x: tx, y: ty };
        }
    });

    editorCanvas.addEventListener('mousemove', (e) => {
        if (lastRightClick) {
            editorCamera.x -= e.clientX - lastRightClick.x;
            editorCamera.y -= e.clientY - lastRightClick.y;
            lastRightClick = { x: e.clientX, y: e.clientY };
        }
    });

    editorCanvas.addEventListener('mouseup', (e) => {
        if (e.button === 2) {
            lastRightClick = null;
            return;
        }

        if (isDrawing && dragStart) {
            const mx = e.offsetX + editorCamera.x;
            const my = e.offsetY + editorCamera.y;
            const tx = Math.floor(mx / TILE);
            const ty = Math.floor(my / TILE);

            const minX = Math.min(dragStart.x, tx);
            const minY = Math.min(dragStart.y, ty);
            const maxX = Math.max(dragStart.x, tx);
            const maxY = Math.max(dragStart.y, ty);

            editorObjects.push({
                type: editorTool,
                tx: minX, ty: minY,
                tw: maxX - minX + 1,
                th: maxY - minY + 1
            });
            playSound('click');
        }
        isDrawing = false;
        dragStart = null;
    });

    editorCanvas.addEventListener('contextmenu', (e) => e.preventDefault());

    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            editorTool = btn.dataset.tool;
            playSound('click');
        });
    });

    editorRenderLoop();
}

function editorRenderLoop() {
    if (currentScreen !== 'editor') {
        requestAnimationFrame(editorRenderLoop);
        return;
    }

    const parentEl = editorCanvas.parentElement;
    const ew = parentEl ? parentEl.clientWidth - 200 : window.innerWidth - 200;
    const eh = window.innerHeight;

    // High-DPI for editor
    const edpr = window.devicePixelRatio || 1;
    editorCanvas.width = ew * edpr;
    editorCanvas.height = eh * edpr;
    editorCanvas.style.width = ew + 'px';
    editorCanvas.style.height = eh + 'px';
    editorCtx.scale(edpr, edpr);

    const ectx = editorCtx;

    ectx.fillStyle = '#0a0a0f';
    ectx.fillRect(0, 0, ew, eh);

    // Grid
    ectx.strokeStyle = '#151525';
    ectx.lineWidth = 1;
    const offX = -editorCamera.x % TILE;
    const offY = -editorCamera.y % TILE;
    for (let x = offX; x < ew; x += TILE) {
        ectx.beginPath();
        ectx.moveTo(x, 0);
        ectx.lineTo(x, eh);
        ectx.stroke();
    }
    for (let y = offY; y < eh; y += TILE) {
        ectx.beginPath();
        ectx.moveTo(0, y);
        ectx.lineTo(ew, y);
        ectx.stroke();
    }

    // Objects
    const colors = {
        platform: '#2a2a4a',
        spike: '#ff4444',
        moving: '#4a3a6a',
        falling: '#4a3a2a',
        boost: '#ffd700',
        wall: '#2a3a2a'
    };

    for (const obj of editorObjects) {
        const sx = obj.tx * TILE - editorCamera.x;
        const sy = obj.ty * TILE - editorCamera.y;
        const sw = obj.tw * TILE;
        const sh = obj.th * TILE;

        ectx.fillStyle = colors[obj.type] || '#555';
        ectx.fillRect(sx, sy, sw, sh);
        ectx.strokeStyle = '#fff3';
        ectx.strokeRect(sx, sy, sw, sh);

        ectx.fillStyle = '#fff8';
        ectx.font = '10px monospace';
        ectx.fillText(obj.type[0].toUpperCase(), sx + 2, sy + 12);
    }

    // Spawn
    const spX = editorSpawn.x * TILE - editorCamera.x;
    const spY = editorSpawn.y * TILE - editorCamera.y;
    ectx.fillStyle = '#00e5ff';
    ectx.fillRect(spX + 6, spY, PLAYER_W, PLAYER_H);
    ectx.fillStyle = '#fff';
    ectx.font = '10px monospace';
    ectx.fillText('SPAWN', spX, spY - 4);

    // Goal
    const gX = editorGoal.x * TILE - editorCamera.x;
    const gY = editorGoal.y * TILE - editorCamera.y;
    ectx.fillStyle = '#ff408177';
    ectx.fillRect(gX, gY - TILE, TILE * 2, TILE * 2);
    ectx.fillStyle = '#fff';
    ectx.fillText('GOAL', gX, gY - TILE - 4);

    requestAnimationFrame(editorRenderLoop);
}

function buildEditorLevel() {
    spawnPoint = { x: editorSpawn.x * TILE, y: editorSpawn.y * TILE };
    goalZone = { x: editorGoal.x * TILE, y: (editorGoal.y - 1) * TILE, w: TILE * 2, h: TILE * 2 };
    platforms = [];
    spikes = [];
    movingPlatforms = [];
    fallingPlatforms = [];
    boostPads = [];
    walls = [];
    particles = [];
    checkpoints = [];
    lastCheckpoint = null;

    for (const obj of editorObjects) {
        const px = obj.tx * TILE;
        const py = obj.ty * TILE;
        const pw = obj.tw * TILE;
        const ph = obj.th * TILE;

        switch (obj.type) {
            case 'platform':
                platforms.push({ x: px, y: py, w: pw, h: ph });
                break;
            case 'spike':
                spikes.push({ x: px, y: py, w: pw, h: ph });
                break;
            case 'moving':
                movingPlatforms.push({
                    x: px, y: py, w: pw, h: ph,
                    dx: 1, dy: 0, speed: 1, range: 3 * TILE,
                    t: 0, startX: px, startY: py, trail: []
                });
                break;
            case 'falling':
                fallingPlatforms.push({
                    x: px, y: py, w: pw, h: ph,
                    triggered: false, fallTimer: 0, fallen: false, origY: py, vy: 0
                });
                break;
            case 'boost':
                boostPads.push({ x: px, y: py, w: pw, h: TILE, dir: 1 });
                break;
            case 'wall':
                walls.push({ x: px, y: py, w: TILE, h: ph });
                break;
        }
    }
}

function saveEditorLevel() {
    const data = {
        spawn: editorSpawn,
        goal: editorGoal,
        objects: editorObjects
    };
    const json = JSON.stringify(data);
    try {
        localStorage.setItem('parkour_custom_level', json);
        alert('Level saved to browser storage!');
    } catch(e) {
        alert('Error saving level.');
    }
}

function loadEditorLevel() {
    try {
        const json = localStorage.getItem('parkour_custom_level');
        if (!json) {
            alert('No saved level found.');
            return;
        }
        const data = JSON.parse(json);
        editorSpawn = data.spawn;
        editorGoal = data.goal;
        editorObjects = data.objects;
    } catch (e) {
        alert('Error loading level.');
    }
}

// ---------- UI EVENT WIRING ----------
function initUI() {
    document.getElementById('btn-play').addEventListener('click', () => {
        initAudio();
        playSound('click');
        doScreenWipe(() => startLevel(0));
    });

    document.getElementById('btn-levels').addEventListener('click', () => {
        playSound('click');
        populateLevelGrid();
        showScreen('level');
    });

    document.getElementById('btn-editor').addEventListener('click', () => {
        playSound('click');
        showScreen('editor');
    });

    document.getElementById('btn-controls').addEventListener('click', () => {
        playSound('click');
        showScreen('controls');
    });

    document.getElementById('btn-back-menu').addEventListener('click', () => {
        playSound('click');
        showScreen('menu');
    });

    document.getElementById('btn-back-controls').addEventListener('click', () => {
        playSound('click');
        showScreen('menu');
    });

    // Fullscreen
    document.getElementById('btn-fullscreen').addEventListener('click', () => {
        playSound('click');
        const el = document.documentElement;
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (el.requestFullscreen) {
                el.requestFullscreen().catch(() => {});
            } else if (el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    });

    // Sound toggle
    document.getElementById('btn-sound-toggle').addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        document.getElementById('btn-sound-toggle').textContent =
            soundEnabled ? 'SOUND: ON' : 'SOUND: OFF';
        if (!soundEnabled) stopMusic();
        playSound('click');
    });

    // Ghost trail toggle (menu)
    const ghostBtn = document.getElementById('btn-ghost-toggle');
    if (ghostBtn) {
        ghostBtn.textContent = ghostEnabled ? 'GHOST: ON' : 'GHOST: OFF';
        ghostBtn.addEventListener('click', () => {
            toggleGhost();
            playSound('click');
        });
    }

    // Ghost trail toggle (pause)
    const ghostPauseBtn = document.getElementById('btn-ghost-pause');
    if (ghostPauseBtn) {
        ghostPauseBtn.textContent = ghostEnabled ? 'GHOST: ON' : 'GHOST: OFF';
        ghostPauseBtn.addEventListener('click', () => {
            toggleGhost();
            playSound('click');
        });
    }

    // Pause overlay
    document.getElementById('btn-resume').addEventListener('click', () => {
        playSound('click');
        gameState = 'playing';
        startMusic();
        document.getElementById('pause-overlay').classList.add('hidden');
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
        playSound('click');
        document.getElementById('pause-overlay').classList.add('hidden');
        loadLevel(currentLevel);
        gameState = 'playing';
        startMusic();
    });

    document.getElementById('btn-quit').addEventListener('click', () => {
        playSound('click');
        document.getElementById('pause-overlay').classList.add('hidden');
        gameState = 'menu';
        stopMusic();
        showScreen('menu');
    });

    // Complete overlay
    document.getElementById('btn-next').addEventListener('click', () => {
        playSound('click');
        document.getElementById('complete-overlay').classList.add('hidden');
        if (currentLevel + 1 < LEVELS.length) {
            doScreenWipe(() => startLevel(currentLevel + 1));
        }
    });

    document.getElementById('btn-replay').addEventListener('click', () => {
        playSound('click');
        document.getElementById('complete-overlay').classList.add('hidden');
        doScreenWipe(() => startLevel(currentLevel));
    });

    document.getElementById('btn-quit2').addEventListener('click', () => {
        playSound('click');
        document.getElementById('complete-overlay').classList.add('hidden');
        gameState = 'menu';
        stopMusic();
        showScreen('menu');
    });

    // Death overlay
    document.getElementById('btn-retry').addEventListener('click', () => {
        playSound('click');
        document.getElementById('death-overlay').classList.add('hidden');
        loadLevel(currentLevel);
        gameState = 'playing';
    });

    document.getElementById('btn-quit3').addEventListener('click', () => {
        playSound('click');
        document.getElementById('death-overlay').classList.add('hidden');
        gameState = 'menu';
        stopMusic();
        showScreen('menu');
    });

    // Editor buttons
    document.getElementById('btn-test-level').addEventListener('click', () => {
        initAudio();
        playSound('click');
        buildEditorLevel();
        resetPlayer();
        levelTimer = 0;
        deathCount = 0;
        currentLevel = -1;
        camera.x = player.x - canvasW / 2;
        camera.y = player.y - canvasH / 2;
        const hudLevel = document.getElementById('hud-level');
        if (hudLevel) hudLevel.textContent = 'Custom';
        const hudBest = document.getElementById('hud-best');
        if (hudBest) hudBest.textContent = '';
        const hudDeaths = document.getElementById('hud-deaths');
        if (hudDeaths) hudDeaths.textContent = 'Deaths: 0';
        showScreen('game');
        gameState = 'playing';
        startMusic();
        document.getElementById('pause-overlay').classList.add('hidden');
        document.getElementById('complete-overlay').classList.add('hidden');
        document.getElementById('death-overlay').classList.add('hidden');
    });

    document.getElementById('btn-save-level').addEventListener('click', () => {
        playSound('click');
        saveEditorLevel();
    });

    document.getElementById('btn-load-level').addEventListener('click', () => {
        playSound('click');
        loadEditorLevel();
    });

    document.getElementById('btn-clear-level').addEventListener('click', () => {
        playSound('click');
        if (confirm('Clear all editor objects?')) {
            editorObjects = [];
        }
    });

    document.getElementById('btn-back-editor').addEventListener('click', () => {
        playSound('click');
        showScreen('menu');
    });
}

// ---------- CANVAS RESIZE HANDLER ----------
function handleResize() {
    canvasW = window.innerWidth;
    canvasH = window.innerHeight;
    dpr = window.devicePixelRatio || 1;

    if (canvas) {
        canvas.width = canvasW * dpr;
        canvas.height = canvasH * dpr;
        canvas.style.width = canvasW + 'px';
        canvas.style.height = canvasH + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }

    initAmbientParticles();
}

// ---------- INIT ----------
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    menuBgCanvas = document.getElementById('menuBgCanvas');
    if (menuBgCanvas) {
        menuBgCtx = menuBgCanvas.getContext('2d');
    }

    canvasW = window.innerWidth;
    canvasH = window.innerHeight;
    handleResize();

    loadBestTimes();
    generateCityscape();
    initMenuParticles();
    initAmbientParticles();
    initUI();
    initEditor();
    initTouchControls();
    showScreen('menu');

    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('resize', handleResize);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
