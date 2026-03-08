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

// ---------- DIFFICULTY SETTINGS ----------
const DIFFICULTIES = {
    easy: {
        label: 'EASY',
        desc: 'Forgiving jumps, weaker gravity, generous hitboxes',
        gravity: 0.42,
        maxFall: 10,
        jumpForce: -11.5,
        coyoteTime: 14,
        jumpBuffer: 14,
        dashDuration: 12,
        dashCooldown: 20,
        spikeInset: 8,
        wallSlideMax: 1.5,
        timerMultiplier: 1,
        // Level geometry modifiers
        platWidthBonus: 3,   // extra tiles added to platform widths
        gapShrink: 2,        // tiles to shrink gaps between platforms
        spikeRemoveChance: 0.5, // chance to remove each spike group
        runSpeed: 5,
        // Visual theme: calm blue sky
        theme: {
            bgTop: '#0a1628',
            bgMid: '#0c1e3a',
            bgBot: '#0e264c',
            starColor: '#aaccff',
            platBody: '#3a5a9a',
            platTop: '#66aaff',
            platTopGlow: 'rgba(102, 170, 255, 0.6)',
            platGlow: 'rgba(60, 120, 220, 0.25)',
            platSide: '#4a7acc',
            platBottom: '#1a3a6a',
            platTexture: '#4a6aaa',
            platGrid: '#2a4a7a',
            wallBody: '#2a7a5a',
            wallEdge: '#44ddaa',
            wallGlow: 'rgba(68, 221, 170, 0.4)',
            wallCap: '#3a9a6a',
            wallRivet: '#55bb88',
            wallGridStroke: '#1a5a3a',
            movBody: '#4a4a9a',
            movTop: '#8888ff',
            movTopGlow: 'rgba(136, 136, 255, 0.5)',
            movSide: '#6a6acc',
            movTrail: [100, 100, 200],
            movPath: 'rgba(136, 136, 255, 0.3)',
            fallBody: '#6a7a50',
            fallTop: '#aacc66',
            fallTopGlow: 'rgba(170, 204, 102, 0.5)',
            fallSide: '#7a8a60',
            playerBody: '#44aaff',
            playerHead: '#55bbff',
            playerArms: '#3399ee',
            playerLegs: '#2288dd',
        },
    },
    medium: {
        label: 'MEDIUM',
        desc: 'The intended experience',
        gravity: 0.55,
        maxFall: 12,
        jumpForce: -10.5,
        coyoteTime: 6,
        jumpBuffer: 6,
        dashDuration: 8,
        dashCooldown: 30,
        spikeInset: 4,
        wallSlideMax: 2,
        timerMultiplier: 1,
        platWidthBonus: 0,
        gapShrink: 0,
        spikeRemoveChance: 0,
        runSpeed: 5,
        // Visual theme: neon purple (original look but brighter)
        theme: {
            bgTop: '#020208',
            bgMid: '#050510',
            bgBot: '#08040f',
            starColor: '#ffffff',
            platBody: '#5050a0',
            platTop: '#99aaff',
            platTopGlow: 'rgba(153, 170, 255, 0.6)',
            platGlow: 'rgba(100, 100, 255, 0.25)',
            platSide: '#7070cc',
            platBottom: '#2a2a5a',
            platTexture: '#6060aa',
            platGrid: '#3a3a70',
            wallBody: '#3a7a3a',
            wallEdge: '#77ee77',
            wallGlow: 'rgba(119, 238, 119, 0.45)',
            wallCap: '#4a9a4a',
            wallRivet: '#66cc66',
            wallGridStroke: '#2a5a2a',
            movBody: '#6050a0',
            movTop: '#cc99ff',
            movTopGlow: 'rgba(204, 153, 255, 0.5)',
            movSide: '#8070bb',
            movTrail: [140, 100, 200],
            movPath: 'rgba(200, 150, 255, 0.3)',
            fallBody: '#8a7040',
            fallTop: '#eebb55',
            fallTopGlow: 'rgba(238, 187, 85, 0.5)',
            fallSide: '#9a8050',
            playerBody: '#00e5ff',
            playerHead: '#33eeff',
            playerArms: '#00ccdd',
            playerLegs: '#00aabb',
        },
    },
    hard: {
        label: 'HARD',
        desc: 'Tight timing, faster falls, less forgiveness',
        gravity: 0.65,
        maxFall: 14,
        jumpForce: -10.5,
        coyoteTime: 3,
        jumpBuffer: 3,
        dashDuration: 6,
        dashCooldown: 40,
        spikeInset: 2,
        wallSlideMax: 2.5,
        timerMultiplier: 1,
        platWidthBonus: -1,   // narrower platforms
        gapShrink: -1,        // wider gaps
        spikeRemoveChance: 0,
        runSpeed: 5,
        // Visual theme: fiery orange/red
        theme: {
            bgTop: '#0f0502',
            bgMid: '#140804',
            bgBot: '#1a0a05',
            starColor: '#ffaa66',
            platBody: '#8a4020',
            platTop: '#ff8844',
            platTopGlow: 'rgba(255, 136, 68, 0.6)',
            platGlow: 'rgba(220, 100, 40, 0.25)',
            platSide: '#bb6030',
            platBottom: '#4a2010',
            platTexture: '#9a5030',
            platGrid: '#6a3020',
            wallBody: '#7a5a1a',
            wallEdge: '#ffcc33',
            wallGlow: 'rgba(255, 204, 51, 0.45)',
            wallCap: '#9a7a2a',
            wallRivet: '#ddaa22',
            wallGridStroke: '#5a4010',
            movBody: '#8a3040',
            movTop: '#ff6688',
            movTopGlow: 'rgba(255, 102, 136, 0.5)',
            movSide: '#aa4a5a',
            movTrail: [200, 80, 100],
            movPath: 'rgba(255, 100, 130, 0.3)',
            fallBody: '#6a3a20',
            fallTop: '#ff8833',
            fallTopGlow: 'rgba(255, 136, 51, 0.5)',
            fallSide: '#8a5030',
            playerBody: '#ff6622',
            playerHead: '#ff8844',
            playerArms: '#ee5511',
            playerLegs: '#dd4400',
        },
    },
    extreme: {
        label: 'EXTREME',
        desc: 'Pixel-perfect precision — no mercy',
        gravity: 0.75,
        maxFall: 15,
        jumpForce: -10.2,
        coyoteTime: 0,
        jumpBuffer: 0,
        dashDuration: 5,
        dashCooldown: 50,
        spikeInset: 0,
        wallSlideMax: 3,
        timerMultiplier: 1,
        platWidthBonus: -2,    // much narrower platforms
        gapShrink: -2,         // much wider gaps
        spikeRemoveChance: 0,
        runSpeed: 5,
        // Visual theme: blood red / black
        theme: {
            bgTop: '#0a0002',
            bgMid: '#100004',
            bgBot: '#150006',
            starColor: '#ff4444',
            platBody: '#6a1020',
            platTop: '#ff2244',
            platTopGlow: 'rgba(255, 34, 68, 0.7)',
            platGlow: 'rgba(255, 30, 60, 0.3)',
            platSide: '#aa2030',
            platBottom: '#3a0810',
            platTexture: '#7a1828',
            platGrid: '#5a1020',
            wallBody: '#5a2a6a',
            wallEdge: '#cc44ff',
            wallGlow: 'rgba(204, 68, 255, 0.5)',
            wallCap: '#7a3a8a',
            wallRivet: '#aa33dd',
            wallGridStroke: '#3a1a4a',
            movBody: '#6a1040',
            movTop: '#ff3366',
            movTopGlow: 'rgba(255, 51, 102, 0.5)',
            movSide: '#8a2050',
            movTrail: [200, 40, 80],
            movPath: 'rgba(255, 50, 100, 0.3)',
            fallBody: '#5a1a10',
            fallTop: '#ff3322',
            fallTopGlow: 'rgba(255, 51, 34, 0.6)',
            fallSide: '#7a2a18',
            playerBody: '#ff1133',
            playerHead: '#ff3355',
            playerArms: '#dd0022',
            playerLegs: '#bb0011',
        },
    }
};

// Helper to get current theme colors
function getTheme() { return getDiff().theme; }

let difficulty = 'medium';
let cheatMode = false;
function getDiff() { return DIFFICULTIES[difficulty]; }

// Cheat mode overrides — applied on top of difficulty settings
const CHEAT_OVERRIDES = {
    gravity: 0.3,
    maxFall: 8,
    jumpForce: -14,
    coyoteTime: 20,
    jumpBuffer: 20,
    dashDuration: 18,
    dashCooldown: 10,
    spikeInset: 12,
    wallSlideMax: 1,
    runSpeed: 8,
};

function getCheatGravity() { return cheatMode ? CHEAT_OVERRIDES.gravity : getDiff().gravity; }
function getCheatMaxFall() { return cheatMode ? CHEAT_OVERRIDES.maxFall : getDiff().maxFall; }
function getCheatJumpForce() { return cheatMode ? CHEAT_OVERRIDES.jumpForce : getDiff().jumpForce; }
function getCheatCoyoteTime() { return cheatMode ? CHEAT_OVERRIDES.coyoteTime : getDiff().coyoteTime; }
function getCheatJumpBuffer() { return cheatMode ? CHEAT_OVERRIDES.jumpBuffer : getDiff().jumpBuffer; }
function getCheatDashDuration() { return cheatMode ? CHEAT_OVERRIDES.dashDuration : getDiff().dashDuration; }
function getCheatDashCooldown() { return cheatMode ? CHEAT_OVERRIDES.dashCooldown : getDiff().dashCooldown; }
function getCheatSpikeInset() { return cheatMode ? CHEAT_OVERRIDES.spikeInset : getDiff().spikeInset; }
function getCheatWallSlideMax() { return cheatMode ? CHEAT_OVERRIDES.wallSlideMax : getDiff().wallSlideMax; }
function getCheatRunSpeed() { return cheatMode ? CHEAT_OVERRIDES.runSpeed : RUN_SPEED; }

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

// Best runs system
let bestRuns = {};
let replayData = [];
let replayFrame = 0;
let replayTimer = 0;
let replayLevelIndex = 0;
let replayPlayerState = 'idle';
let replayPlayerFacing = 1;
let replayDistTraveled = 0;
let replayTotalTime = 0;

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
// Background stars — generated once
let bgStars = [];

function generateBackground() {
    bgStars = [];
    for (let i = 0; i < 120; i++) {
        bgStars.push({
            x: Math.random() * 3000,
            y: Math.random() * 1200,
            size: 0.5 + Math.random() * 1.5,
            brightness: 0.2 + Math.random() * 0.5,
            twinkleSpeed: 0.001 + Math.random() * 0.003,
            parallax: 0.02 + Math.random() * 0.06
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

// ---------- BEST RUNS: COMPUTER PATH GENERATION ----------
function buildReplayPath(waypoints, totalFrames) {
    const path = [];
    for (let f = 0; f < totalFrames; f++) {
        let seg = 0;
        for (let i = 0; i < waypoints.length - 1; i++) {
            if (f >= waypoints[i].frame && f < waypoints[i + 1].frame) {
                seg = i;
                break;
            }
            if (i === waypoints.length - 2) seg = i;
        }
        const a = waypoints[seg];
        const b = waypoints[seg + 1] || waypoints[waypoints.length - 1];
        const segLen = b.frame - a.frame;
        const t = segLen > 0 ? Math.min(1, (f - a.frame) / segLen) : 1;
        path.push({
            x: a.x + (b.x - a.x) * t,
            y: a.y + (b.y - a.y) * t,
            state: t < 0.5 ? a.state : b.state
        });
    }
    return path;
}

function generateComputerRun(levelIndex) {
    // Define waypoints for each level: {x, y, state, frame}
    // frame = which frame to reach this point (at ~20fps recording rate, 3 frames per sample)
    // So 1 second = ~20 frames of replay data
    const T = TILE;
    const levelWaypoints = {
        // Level 1: Tutorial Run (~4.5s = 90 frames)
        0: {
            time: 4.5,
            frames: 90,
            waypoints: [
                { x: 2*T, y: 16*T, state: 'idle', frame: 0 },
                { x: 8*T, y: 16*T, state: 'running', frame: 10 },
                { x: 14*T, y: 16*T, state: 'running', frame: 18 },
                { x: 15.5*T, y: 14*T, state: 'jumping', frame: 22 },
                { x: 17*T, y: 16*T, state: 'falling', frame: 26 },
                { x: 22*T, y: 16*T, state: 'running', frame: 32 },
                { x: 24*T, y: 14*T, state: 'jumping', frame: 36 },
                { x: 25*T, y: 16*T, state: 'falling', frame: 40 },
                { x: 30*T, y: 16*T, state: 'running', frame: 46 },
                { x: 32*T, y: 13*T, state: 'jumping', frame: 50 },
                { x: 35*T, y: 14*T, state: 'falling', frame: 54 },
                { x: 38*T, y: 15*T, state: 'jumping', frame: 58 },
                { x: 40*T, y: 16*T, state: 'falling', frame: 62 },
                { x: 47*T, y: 16*T, state: 'running', frame: 72 },
                { x: 50*T, y: 16*T, state: 'running', frame: 76 },
                { x: 58*T, y: 16*T, state: 'running', frame: 88 },
                { x: 58*T, y: 16*T, state: 'idle', frame: 90 },
            ]
        },
        // Level 2: Wall Jump Intro (~6s = 120 frames)
        1: {
            time: 6.0,
            frames: 120,
            waypoints: [
                { x: 2*T, y: 16*T, state: 'idle', frame: 0 },
                { x: 8*T, y: 16*T, state: 'running', frame: 12 },
                { x: 13*T, y: 14*T, state: 'jumping', frame: 18 },
                { x: 14*T, y: 12*T, state: 'wall_sliding', frame: 22 },
                { x: 17*T, y: 10*T, state: 'jumping', frame: 28 },
                { x: 14*T, y: 8*T, state: 'wall_sliding', frame: 34 },
                { x: 17*T-PLAYER_W, y: 10*T, state: 'jumping', frame: 38 },
                { x: 20*T, y: 16*T, state: 'falling', frame: 46 },
                { x: 25*T, y: 16*T, state: 'running', frame: 52 },
                { x: 34*T, y: 16*T, state: 'running', frame: 62 },
                { x: 38*T, y: 14*T, state: 'jumping', frame: 68 },
                { x: 42*T, y: 10*T, state: 'jumping', frame: 76 },
                { x: 45*T, y: 4*T, state: 'falling', frame: 86 },
                { x: 48*T, y: 4*T, state: 'running', frame: 100 },
                { x: 48*T, y: 4*T, state: 'idle', frame: 120 },
            ]
        },
        // Level 3: Dash Training (~7s = 140 frames)
        2: {
            time: 7.0,
            frames: 140,
            waypoints: [
                { x: 2*T, y: 16*T, state: 'idle', frame: 0 },
                { x: 8*T, y: 16*T, state: 'running', frame: 12 },
                { x: 10*T, y: 13*T, state: 'jumping', frame: 16 },
                { x: 13*T, y: 14*T, state: 'dashing', frame: 20 },
                { x: 17*T, y: 16*T, state: 'falling', frame: 26 },
                { x: 20*T, y: 16*T, state: 'running', frame: 30 },
                { x: 21*T, y: 13*T, state: 'jumping', frame: 34 },
                { x: 24*T, y: 14*T, state: 'dashing', frame: 38 },
                { x: 28*T, y: 16*T, state: 'falling', frame: 44 },
                { x: 31*T, y: 16*T, state: 'running', frame: 48 },
                { x: 32*T, y: 13*T, state: 'jumping', frame: 52 },
                { x: 35*T, y: 14*T, state: 'dashing', frame: 56 },
                { x: 39*T, y: 16*T, state: 'falling', frame: 62 },
                { x: 42*T, y: 16*T, state: 'running', frame: 66 },
                { x: 44*T, y: 12*T, state: 'jumping', frame: 72 },
                { x: 48*T, y: 13*T, state: 'dashing', frame: 78 },
                { x: 50*T, y: 14*T, state: 'falling', frame: 84 },
                { x: 55*T, y: 15*T, state: 'jumping', frame: 92 },
                { x: 60*T, y: 16*T, state: 'falling', frame: 100 },
                { x: 65*T, y: 16*T, state: 'running', frame: 110 },
                { x: 70*T, y: 16*T, state: 'running', frame: 130 },
                { x: 70*T, y: 16*T, state: 'idle', frame: 140 },
            ]
        },
        // Level 4: Slide & Spikes (~6s = 120 frames)
        3: {
            time: 6.0,
            frames: 120,
            waypoints: [
                { x: 2*T, y: 16*T, state: 'idle', frame: 0 },
                { x: 6*T, y: 16*T, state: 'running', frame: 8 },
                { x: 8*T, y: 14*T+(PLAYER_H-PLAYER_H_SLIDE), state: 'sliding', frame: 14 },
                { x: 16*T, y: 14*T+(PLAYER_H-PLAYER_H_SLIDE), state: 'sliding', frame: 26 },
                { x: 18*T, y: 16*T, state: 'running', frame: 30 },
                { x: 20*T, y: 14*T, state: 'jumping', frame: 34 },
                { x: 22*T, y: 13*T+(PLAYER_H-PLAYER_H_SLIDE), state: 'sliding', frame: 40 },
                { x: 30*T, y: 13*T+(PLAYER_H-PLAYER_H_SLIDE), state: 'sliding', frame: 52 },
                { x: 31*T, y: 16*T, state: 'running', frame: 56 },
                { x: 34*T, y: 16*T, state: 'running', frame: 60 },
                { x: 40*T, y: 15*T, state: 'jumping', frame: 68 },
                { x: 44*T, y: 16*T, state: 'falling', frame: 76 },
                { x: 49*T, y: 16*T, state: 'running', frame: 84 },
                { x: 55*T, y: 16*T, state: 'running', frame: 92 },
                { x: 60*T, y: 16*T, state: 'running', frame: 102 },
                { x: 65*T, y: 16*T, state: 'running', frame: 115 },
                { x: 65*T, y: 16*T, state: 'idle', frame: 120 },
            ]
        },
        // Level 5: Moving Platforms (~9s = 180 frames)
        4: {
            time: 9.0,
            frames: 180,
            waypoints: [
                { x: 2*T, y: 16*T, state: 'idle', frame: 0 },
                { x: 6*T, y: 16*T, state: 'running', frame: 8 },
                { x: 8*T, y: 13*T, state: 'jumping', frame: 14 },
                { x: 12*T, y: 14*T, state: 'falling', frame: 22 },
                { x: 14*T, y: 12*T, state: 'jumping', frame: 30 },
                { x: 18*T, y: 11*T, state: 'jumping', frame: 42 },
                { x: 22*T, y: 12*T, state: 'falling', frame: 52 },
                { x: 26*T, y: 11*T, state: 'jumping', frame: 64 },
                { x: 30*T, y: 10*T, state: 'jumping', frame: 76 },
                { x: 35*T, y: 10*T, state: 'falling', frame: 88 },
                { x: 38*T, y: 9*T, state: 'jumping', frame: 100 },
                { x: 42*T, y: 8*T, state: 'jumping', frame: 112 },
                { x: 45*T, y: 8*T, state: 'falling', frame: 124 },
                { x: 50*T, y: 7*T, state: 'jumping', frame: 138 },
                { x: 55*T, y: 8*T, state: 'jumping', frame: 150 },
                { x: 60*T, y: 8*T, state: 'falling', frame: 160 },
                { x: 63*T, y: 7*T, state: 'running', frame: 170 },
                { x: 65*T, y: 7*T, state: 'idle', frame: 180 },
            ]
        },
        // Level 6: Falling Floor (~8s = 160 frames)
        5: {
            time: 8.0,
            frames: 160,
            waypoints: [
                { x: 2*T, y: 16*T, state: 'idle', frame: 0 },
                { x: 5*T, y: 16*T, state: 'running', frame: 6 },
                { x: 7*T, y: 14*T, state: 'jumping', frame: 12 },
                { x: 8*T, y: 16*T, state: 'falling', frame: 16 },
                { x: 10*T, y: 16*T, state: 'running', frame: 20 },
                { x: 12*T, y: 14*T, state: 'jumping', frame: 26 },
                { x: 13*T, y: 16*T, state: 'falling', frame: 30 },
                { x: 16*T, y: 14*T, state: 'jumping', frame: 38 },
                { x: 18*T, y: 16*T, state: 'falling', frame: 42 },
                { x: 21*T, y: 14*T, state: 'jumping', frame: 50 },
                { x: 23*T, y: 14*T, state: 'falling', frame: 56 },
                { x: 25*T, y: 12*T, state: 'jumping', frame: 64 },
                { x: 28*T, y: 12*T, state: 'falling', frame: 72 },
                { x: 30*T, y: 11*T, state: 'jumping', frame: 80 },
                { x: 33*T, y: 14*T, state: 'falling', frame: 88 },
                { x: 36*T, y: 14*T, state: 'jumping', frame: 96 },
                { x: 38*T, y: 16*T, state: 'falling', frame: 102 },
                { x: 40*T, y: 14*T, state: 'jumping', frame: 110 },
                { x: 43*T, y: 16*T, state: 'falling', frame: 118 },
                { x: 46*T, y: 15*T, state: 'jumping', frame: 126 },
                { x: 50*T, y: 16*T, state: 'falling', frame: 134 },
                { x: 53*T, y: 16*T, state: 'running', frame: 144 },
                { x: 55*T, y: 16*T, state: 'running', frame: 155 },
                { x: 55*T, y: 16*T, state: 'idle', frame: 160 },
            ]
        },
        // Level 7: Wall Climb Challenge (~12s = 240 frames)
        6: {
            time: 12.0,
            frames: 240,
            waypoints: [
                { x: 2*T, y: 16*T, state: 'idle', frame: 0 },
                { x: 6*T, y: 16*T, state: 'running', frame: 8 },
                { x: 9*T, y: 14*T, state: 'jumping', frame: 14 },
                { x: 10*T, y: 12*T, state: 'wall_sliding', frame: 20 },
                { x: 13*T-PLAYER_W, y: 10*T, state: 'jumping', frame: 28 },
                { x: 10*T, y: 8*T, state: 'wall_sliding', frame: 34 },
                { x: 13*T-PLAYER_W, y: 6*T, state: 'jumping', frame: 40 },
                { x: 15*T, y: 16*T, state: 'falling', frame: 52 },
                { x: 17*T, y: 16*T, state: 'running', frame: 58 },
                { x: 20*T, y: 14*T, state: 'jumping', frame: 64 },
                { x: 25*T, y: 12*T, state: 'wall_sliding', frame: 72 },
                { x: 28*T-PLAYER_W, y: 10*T, state: 'jumping', frame: 80 },
                { x: 25*T, y: 8*T, state: 'wall_sliding', frame: 86 },
                { x: 28*T-PLAYER_W, y: 6*T, state: 'jumping', frame: 92 },
                { x: 30*T, y: 16*T, state: 'falling', frame: 104 },
                { x: 32*T, y: 16*T, state: 'running', frame: 110 },
                { x: 35*T, y: 14*T, state: 'jumping', frame: 116 },
                { x: 40*T, y: 12*T, state: 'wall_sliding', frame: 124 },
                { x: 43*T-PLAYER_W, y: 10*T, state: 'jumping', frame: 132 },
                { x: 40*T, y: 8*T, state: 'wall_sliding', frame: 138 },
                { x: 43*T-PLAYER_W, y: 6*T, state: 'jumping', frame: 144 },
                { x: 45*T, y: 5*T, state: 'falling', frame: 154 },
                { x: 50*T, y: 4*T, state: 'jumping', frame: 168 },
                { x: 52*T, y: 4*T, state: 'wall_sliding', frame: 178 },
                { x: 55*T, y: 2*T, state: 'jumping', frame: 190 },
                { x: 56*T, y: 2*T, state: 'running', frame: 210 },
                { x: 58*T, y: 2*T, state: 'running', frame: 230 },
                { x: 58*T, y: 2*T, state: 'idle', frame: 240 },
            ]
        },
        // Level 8: Boost Rush (~10s = 200 frames)
        7: {
            time: 10.0,
            frames: 200,
            waypoints: [
                { x: 2*T, y: 16*T, state: 'idle', frame: 0 },
                { x: 3*T, y: 16*T, state: 'running', frame: 4 },
                { x: 8*T, y: 16*T, state: 'running', frame: 12 },
                { x: 12*T, y: 14*T, state: 'jumping', frame: 18 },
                { x: 15*T, y: 16*T, state: 'falling', frame: 24 },
                { x: 16*T, y: 16*T, state: 'running', frame: 28 },
                { x: 20*T, y: 16*T, state: 'running', frame: 34 },
                { x: 23*T, y: 12*T, state: 'jumping', frame: 42 },
                { x: 26*T, y: 14*T, state: 'falling', frame: 48 },
                { x: 29*T, y: 13*T, state: 'jumping', frame: 56 },
                { x: 33*T, y: 15*T, state: 'dashing', frame: 64 },
                { x: 35*T, y: 16*T, state: 'falling', frame: 70 },
                { x: 36*T, y: 16*T, state: 'running', frame: 74 },
                { x: 40*T, y: 16*T, state: 'running', frame: 82 },
                { x: 43*T, y: 11*T, state: 'jumping', frame: 90 },
                { x: 46*T, y: 12*T, state: 'falling', frame: 98 },
                { x: 49*T, y: 13*T, state: 'jumping', frame: 106 },
                { x: 55*T, y: 16*T, state: 'falling', frame: 114 },
                { x: 56*T, y: 16*T, state: 'running', frame: 118 },
                { x: 62*T, y: 16*T, state: 'running', frame: 130 },
                { x: 65*T, y: 12*T, state: 'jumping', frame: 138 },
                { x: 68*T, y: 14*T, state: 'falling', frame: 146 },
                { x: 72*T, y: 14*T, state: 'jumping', frame: 154 },
                { x: 76*T, y: 16*T, state: 'dashing', frame: 162 },
                { x: 78*T, y: 16*T, state: 'falling', frame: 168 },
                { x: 79*T, y: 16*T, state: 'running', frame: 172 },
                { x: 84*T, y: 16*T, state: 'running', frame: 182 },
                { x: 88*T, y: 16*T, state: 'running', frame: 192 },
                { x: 90*T, y: 16*T, state: 'idle', frame: 200 },
            ]
        },
        // Level 9: The Gauntlet (~15s = 300 frames)
        8: {
            time: 15.0,
            frames: 300,
            waypoints: [
                { x: 2*T, y: 16*T, state: 'idle', frame: 0 },
                { x: 5*T, y: 16*T, state: 'running', frame: 6 },
                { x: 8*T, y: 14*T, state: 'jumping', frame: 12 },
                { x: 10*T, y: 12*T, state: 'wall_sliding', frame: 18 },
                { x: 13*T-PLAYER_W, y: 10*T, state: 'jumping', frame: 26 },
                { x: 10*T, y: 9*T, state: 'wall_sliding', frame: 32 },
                { x: 15*T, y: 12*T, state: 'jumping', frame: 40 },
                { x: 20*T, y: 16*T, state: 'falling', frame: 52 },
                { x: 21*T, y: 16*T, state: 'running', frame: 56 },
                { x: 23*T, y: 14*T, state: 'jumping', frame: 64 },
                { x: 25*T, y: 14*T, state: 'running', frame: 72 },
                { x: 30*T, y: 12*T, state: 'jumping', frame: 84 },
                { x: 35*T, y: 12*T, state: 'falling', frame: 96 },
                { x: 37*T, y: 12*T, state: 'running', frame: 102 },
                { x: 40*T, y: 10*T, state: 'jumping', frame: 112 },
                { x: 45*T, y: 10*T, state: 'wall_sliding', frame: 122 },
                { x: 48*T-PLAYER_W, y: 8*T, state: 'jumping', frame: 132 },
                { x: 45*T, y: 7*T, state: 'wall_sliding', frame: 140 },
                { x: 50*T, y: 10*T, state: 'jumping', frame: 150 },
                { x: 55*T, y: 16*T, state: 'falling', frame: 164 },
                { x: 58*T, y: 16*T, state: 'running', frame: 172 },
                { x: 60*T, y: 12*T, state: 'jumping', frame: 182 },
                { x: 63*T, y: 12*T, state: 'falling', frame: 192 },
                { x: 66*T, y: 14*T, state: 'jumping', frame: 200 },
                { x: 70*T, y: 16*T, state: 'falling', frame: 210 },
                { x: 72*T, y: 14*T, state: 'jumping', frame: 218 },
                { x: 76*T, y: 12*T, state: 'jumping', frame: 228 },
                { x: 78*T, y: 10*T, state: 'jumping', frame: 238 },
                { x: 80*T, y: 8*T, state: 'wall_sliding', frame: 248 },
                { x: 83*T-PLAYER_W, y: 6*T, state: 'jumping', frame: 258 },
                { x: 80*T, y: 5*T, state: 'wall_sliding', frame: 266 },
                { x: 85*T, y: 4*T, state: 'jumping', frame: 276 },
                { x: 90*T, y: 4*T, state: 'falling', frame: 286 },
                { x: 95*T, y: 4*T, state: 'running', frame: 296 },
                { x: 95*T, y: 4*T, state: 'idle', frame: 300 },
            ]
        },
        // Level 10: Parkour Master (~20s = 400 frames)
        9: {
            time: 20.0,
            frames: 400,
            waypoints: [
                { x: 2*T, y: 16*T, state: 'idle', frame: 0 },
                { x: 4*T, y: 16*T, state: 'running', frame: 4 },
                { x: 7*T, y: 14*T, state: 'jumping', frame: 10 },
                { x: 8*T, y: 12*T, state: 'wall_sliding', frame: 16 },
                { x: 12*T-PLAYER_W, y: 10*T, state: 'jumping', frame: 24 },
                { x: 8*T, y: 8*T, state: 'wall_sliding', frame: 30 },
                { x: 12*T-PLAYER_W, y: 6*T, state: 'jumping', frame: 36 },
                { x: 15*T, y: 13*T, state: 'falling', frame: 50 },
                { x: 20*T, y: 14*T, state: 'jumping', frame: 60 },
                { x: 25*T, y: 16*T, state: 'falling', frame: 72 },
                { x: 26*T, y: 16*T, state: 'running', frame: 76 },
                { x: 29*T, y: 14*T, state: 'jumping', frame: 84 },
                { x: 30*T, y: 12*T, state: 'wall_sliding', frame: 90 },
                { x: 34*T-PLAYER_W, y: 10*T, state: 'jumping', frame: 98 },
                { x: 30*T, y: 8*T, state: 'wall_sliding', frame: 104 },
                { x: 36*T, y: 10*T, state: 'jumping', frame: 112 },
                { x: 40*T, y: 14*T, state: 'falling', frame: 124 },
                { x: 42*T, y: 12*T, state: 'jumping', frame: 134 },
                { x: 46*T, y: 12*T, state: 'dashing', frame: 142 },
                { x: 50*T, y: 10*T, state: 'jumping', frame: 154 },
                { x: 54*T-PLAYER_W, y: 8*T, state: 'wall_sliding', frame: 164 },
                { x: 50*T, y: 7*T, state: 'jumping', frame: 172 },
                { x: 55*T, y: 10*T, state: 'falling', frame: 182 },
                { x: 60*T, y: 16*T, state: 'falling', frame: 196 },
                { x: 61*T, y: 16*T, state: 'running', frame: 200 },
                { x: 65*T, y: 10*T, state: 'jumping', frame: 214 },
                { x: 68*T, y: 10*T, state: 'running', frame: 224 },
                { x: 70*T, y: 8*T, state: 'jumping', frame: 232 },
                { x: 74*T-PLAYER_W, y: 8*T, state: 'wall_sliding', frame: 240 },
                { x: 70*T, y: 6*T, state: 'jumping', frame: 248 },
                { x: 76*T, y: 10*T, state: 'falling', frame: 260 },
                { x: 80*T, y: 12*T, state: 'falling', frame: 272 },
                { x: 82*T, y: 10*T, state: 'jumping', frame: 280 },
                { x: 86*T, y: 8*T, state: 'jumping', frame: 290 },
                { x: 90*T, y: 10*T, state: 'jumping', frame: 302 },
                { x: 94*T-PLAYER_W, y: 8*T, state: 'wall_sliding', frame: 312 },
                { x: 90*T, y: 6*T, state: 'jumping', frame: 320 },
                { x: 96*T, y: 8*T, state: 'falling', frame: 332 },
                { x: 100*T, y: 16*T, state: 'falling', frame: 344 },
                { x: 101*T, y: 16*T, state: 'running', frame: 348 },
                { x: 102*T, y: 14*T, state: 'jumping', frame: 354 },
                { x: 106*T, y: 12*T, state: 'jumping', frame: 364 },
                { x: 108*T, y: 8*T, state: 'wall_sliding', frame: 374 },
                { x: 112*T-PLAYER_W, y: 5*T, state: 'jumping', frame: 382 },
                { x: 115*T, y: 2*T, state: 'falling', frame: 390 },
                { x: 120*T, y: 2*T, state: 'running', frame: 398 },
                { x: 120*T, y: 2*T, state: 'idle', frame: 400 },
            ]
        },
        // Level 11: Sky Highway (~12s = 240 frames)
        10: {
            time: 12.0,
            frames: 240,
            waypoints: [
                { x: 2*T, y: 16*T, state: 'idle', frame: 0 },
                { x: 2*T, y: 16*T, state: 'running', frame: 4 },
                { x: 6*T, y: 14*T, state: 'jumping', frame: 12 },
                { x: 8*T, y: 14*T, state: 'falling', frame: 20 },
                { x: 12*T, y: 13*T, state: 'jumping', frame: 30 },
                { x: 16*T, y: 12*T, state: 'jumping', frame: 42 },
                { x: 20*T, y: 12*T, state: 'falling', frame: 52 },
                { x: 24*T, y: 11*T, state: 'jumping', frame: 64 },
                { x: 28*T, y: 10*T, state: 'jumping', frame: 76 },
                { x: 32*T, y: 10*T, state: 'dashing', frame: 88 },
                { x: 35*T, y: 10*T, state: 'falling', frame: 96 },
                { x: 38*T, y: 9*T, state: 'jumping', frame: 108 },
                { x: 42*T, y: 8*T, state: 'jumping', frame: 120 },
                { x: 46*T, y: 8*T, state: 'dashing', frame: 130 },
                { x: 48*T, y: 8*T, state: 'falling', frame: 138 },
                { x: 50*T, y: 8*T, state: 'running', frame: 148 },
                { x: 54*T, y: 7*T, state: 'jumping', frame: 158 },
                { x: 58*T, y: 6*T, state: 'jumping', frame: 168 },
                { x: 62*T, y: 6*T, state: 'falling', frame: 178 },
                { x: 65*T, y: 6*T, state: 'jumping', frame: 188 },
                { x: 70*T, y: 6*T, state: 'jumping', frame: 200 },
                { x: 72*T, y: 6*T, state: 'falling', frame: 208 },
                { x: 76*T, y: 6*T, state: 'jumping', frame: 218 },
                { x: 80*T, y: 6*T, state: 'running', frame: 228 },
                { x: 85*T, y: 5*T, state: 'running', frame: 238 },
                { x: 85*T, y: 5*T, state: 'idle', frame: 240 },
            ]
        },
        // Level 12: The Pit (~10s = 200 frames)
        11: {
            time: 10.0,
            frames: 200,
            waypoints: [
                { x: 3*T, y: 2*T, state: 'idle', frame: 0 },
                { x: 6*T, y: 2*T, state: 'running', frame: 6 },
                { x: 8*T, y: 4*T, state: 'jumping', frame: 12 },
                { x: 10*T, y: 6*T, state: 'wall_sliding', frame: 20 },
                { x: 14*T-PLAYER_W, y: 8*T, state: 'jumping', frame: 28 },
                { x: 10*T, y: 9*T, state: 'wall_sliding', frame: 36 },
                { x: 15*T, y: 10*T, state: 'jumping', frame: 44 },
                { x: 18*T, y: 10*T, state: 'wall_sliding', frame: 52 },
                { x: 22*T-PLAYER_W, y: 12*T, state: 'jumping', frame: 60 },
                { x: 18*T, y: 13*T, state: 'wall_sliding', frame: 68 },
                { x: 23*T, y: 14*T, state: 'jumping', frame: 78 },
                { x: 26*T, y: 8*T, state: 'wall_sliding', frame: 88 },
                { x: 30*T-PLAYER_W, y: 10*T, state: 'jumping', frame: 98 },
                { x: 26*T, y: 11*T, state: 'wall_sliding', frame: 108 },
                { x: 31*T, y: 12*T, state: 'jumping', frame: 118 },
                { x: 34*T, y: 10*T, state: 'wall_sliding', frame: 128 },
                { x: 38*T-PLAYER_W, y: 12*T, state: 'jumping', frame: 138 },
                { x: 34*T, y: 13*T, state: 'wall_sliding', frame: 148 },
                { x: 39*T, y: 14*T, state: 'jumping', frame: 158 },
                { x: 40*T, y: 16*T, state: 'falling', frame: 168 },
                { x: 43*T, y: 16*T, state: 'running', frame: 180 },
                { x: 45*T, y: 16*T, state: 'running', frame: 195 },
                { x: 45*T, y: 16*T, state: 'idle', frame: 200 },
            ]
        },
        // Level 13: Mirror Run (~11s = 220 frames)
        12: {
            time: 11.0,
            frames: 220,
            waypoints: [
                { x: 2*T, y: 16*T, state: 'idle', frame: 0 },
                { x: 6*T, y: 16*T, state: 'running', frame: 8 },
                { x: 9*T, y: 16*T, state: 'running', frame: 14 },
                { x: 10*T, y: 14*T+(PLAYER_H-PLAYER_H_SLIDE), state: 'sliding', frame: 20 },
                { x: 16*T, y: 14*T+(PLAYER_H-PLAYER_H_SLIDE), state: 'sliding', frame: 34 },
                { x: 20*T, y: 14*T, state: 'jumping', frame: 42 },
                { x: 22*T, y: 16*T, state: 'falling', frame: 48 },
                { x: 24*T, y: 16*T, state: 'running', frame: 52 },
                { x: 25*T, y: 16*T, state: 'running', frame: 56 },
                { x: 28*T, y: 14*T, state: 'jumping', frame: 64 },
                { x: 32*T, y: 16*T, state: 'falling', frame: 72 },
                { x: 32*T, y: 13*T+(PLAYER_H-PLAYER_H_SLIDE), state: 'sliding', frame: 80 },
                { x: 42*T, y: 13*T+(PLAYER_H-PLAYER_H_SLIDE), state: 'sliding', frame: 100 },
                { x: 44*T, y: 14*T, state: 'jumping', frame: 106 },
                { x: 46*T, y: 16*T, state: 'falling', frame: 112 },
                { x: 48*T, y: 16*T, state: 'running', frame: 116 },
                { x: 49*T, y: 16*T, state: 'running', frame: 120 },
                { x: 53*T, y: 14*T, state: 'jumping', frame: 130 },
                { x: 56*T, y: 16*T, state: 'falling', frame: 138 },
                { x: 56*T, y: 14*T+(PLAYER_H-PLAYER_H_SLIDE), state: 'sliding', frame: 144 },
                { x: 62*T, y: 14*T+(PLAYER_H-PLAYER_H_SLIDE), state: 'sliding', frame: 160 },
                { x: 64*T, y: 14*T, state: 'jumping', frame: 168 },
                { x: 66*T, y: 16*T, state: 'falling', frame: 174 },
                { x: 68*T, y: 16*T, state: 'running', frame: 180 },
                { x: 74*T, y: 16*T, state: 'running', frame: 200 },
                { x: 78*T, y: 16*T, state: 'running', frame: 216 },
                { x: 78*T, y: 16*T, state: 'idle', frame: 220 },
            ]
        },
        // Level 14: Momentum (~13s = 260 frames)
        13: {
            time: 13.0,
            frames: 260,
            waypoints: [
                { x: 2*T, y: 16*T, state: 'idle', frame: 0 },
                { x: 2*T, y: 16*T, state: 'running', frame: 4 },
                { x: 5*T, y: 16*T, state: 'running', frame: 8 },
                { x: 9*T, y: 13*T, state: 'jumping', frame: 16 },
                { x: 14*T, y: 16*T, state: 'falling', frame: 26 },
                { x: 15*T, y: 16*T, state: 'running', frame: 30 },
                { x: 18*T, y: 12*T, state: 'jumping', frame: 40 },
                { x: 22*T, y: 13*T, state: 'dashing', frame: 48 },
                { x: 24*T, y: 14*T, state: 'falling', frame: 54 },
                { x: 25*T, y: 14*T, state: 'running', frame: 58 },
                { x: 28*T, y: 11*T, state: 'jumping', frame: 68 },
                { x: 32*T, y: 12*T, state: 'dashing', frame: 76 },
                { x: 34*T, y: 12*T, state: 'falling', frame: 82 },
                { x: 36*T, y: 13*T, state: 'jumping', frame: 90 },
                { x: 40*T, y: 14*T, state: 'dashing', frame: 100 },
                { x: 44*T, y: 14*T, state: 'falling', frame: 108 },
                { x: 46*T, y: 15*T, state: 'jumping', frame: 116 },
                { x: 50*T, y: 15*T, state: 'dashing', frame: 126 },
                { x: 54*T, y: 16*T, state: 'falling', frame: 134 },
                { x: 55*T, y: 16*T, state: 'running', frame: 138 },
                { x: 58*T, y: 14*T, state: 'jumping', frame: 148 },
                { x: 62*T, y: 13*T, state: 'dashing', frame: 158 },
                { x: 66*T, y: 14*T, state: 'falling', frame: 168 },
                { x: 67*T, y: 14*T, state: 'running', frame: 172 },
                { x: 70*T, y: 11*T, state: 'jumping', frame: 182 },
                { x: 74*T, y: 12*T, state: 'dashing', frame: 192 },
                { x: 76*T, y: 12*T, state: 'falling', frame: 198 },
                { x: 77*T, y: 12*T, state: 'running', frame: 202 },
                { x: 82*T, y: 13*T, state: 'jumping', frame: 214 },
                { x: 86*T, y: 14*T, state: 'falling', frame: 224 },
                { x: 88*T, y: 14*T, state: 'jumping', frame: 232 },
                { x: 95*T, y: 12*T, state: 'falling', frame: 248 },
                { x: 100*T, y: 11*T, state: 'running', frame: 258 },
                { x: 100*T, y: 11*T, state: 'idle', frame: 260 },
            ]
        },
        // Level 15: Final Rush (~25s = 500 frames)
        14: {
            time: 25.0,
            frames: 500,
            waypoints: [
                { x: 2*T, y: 16*T, state: 'idle', frame: 0 },
                { x: 5*T, y: 16*T, state: 'running', frame: 6 },
                { x: 8*T, y: 14*T, state: 'jumping', frame: 12 },
                { x: 10*T, y: 12*T, state: 'wall_sliding', frame: 20 },
                { x: 13*T-PLAYER_W, y: 10*T, state: 'jumping', frame: 28 },
                { x: 10*T, y: 8*T, state: 'wall_sliding', frame: 34 },
                { x: 13*T-PLAYER_W, y: 7*T, state: 'jumping', frame: 40 },
                { x: 16*T, y: 12*T, state: 'falling', frame: 52 },
                { x: 20*T, y: 16*T, state: 'falling', frame: 64 },
                { x: 21*T, y: 16*T, state: 'running', frame: 68 },
                { x: 24*T, y: 14*T, state: 'jumping', frame: 76 },
                { x: 25*T, y: 14*T, state: 'running', frame: 82 },
                { x: 28*T, y: 12*T, state: 'jumping', frame: 92 },
                { x: 32*T, y: 14*T, state: 'dashing', frame: 102 },
                { x: 35*T, y: 14*T, state: 'falling', frame: 110 },
                { x: 37*T, y: 14*T, state: 'running', frame: 116 },
                { x: 39*T, y: 12*T, state: 'jumping', frame: 124 },
                { x: 42*T, y: 10*T, state: 'wall_sliding', frame: 134 },
                { x: 45*T-PLAYER_W, y: 8*T, state: 'jumping', frame: 144 },
                { x: 42*T, y: 7*T, state: 'wall_sliding', frame: 152 },
                { x: 47*T, y: 10*T, state: 'jumping', frame: 162 },
                { x: 50*T, y: 16*T, state: 'falling', frame: 176 },
                { x: 51*T, y: 16*T, state: 'running', frame: 180 },
                { x: 54*T, y: 14*T, state: 'jumping', frame: 190 },
                { x: 55*T, y: 14*T, state: 'running', frame: 196 },
                { x: 57*T, y: 12*T, state: 'jumping', frame: 206 },
                { x: 60*T, y: 10*T, state: 'wall_sliding', frame: 216 },
                { x: 63*T-PLAYER_W, y: 8*T, state: 'jumping', frame: 226 },
                { x: 60*T, y: 6*T, state: 'wall_sliding', frame: 234 },
                { x: 65*T, y: 8*T, state: 'jumping', frame: 244 },
                { x: 70*T, y: 12*T, state: 'falling', frame: 258 },
                { x: 72*T, y: 12*T, state: 'running', frame: 264 },
                { x: 75*T, y: 10*T, state: 'jumping', frame: 274 },
                { x: 78*T, y: 10*T, state: 'falling', frame: 284 },
                { x: 82*T, y: 13*T, state: 'jumping', frame: 294 },
                { x: 85*T, y: 16*T, state: 'falling', frame: 304 },
                { x: 85*T, y: 13*T+(PLAYER_H-PLAYER_H_SLIDE), state: 'sliding', frame: 312 },
                { x: 89*T, y: 13*T+(PLAYER_H-PLAYER_H_SLIDE), state: 'sliding', frame: 324 },
                { x: 90*T, y: 14*T, state: 'running', frame: 330 },
                { x: 93*T, y: 12*T, state: 'jumping', frame: 340 },
                { x: 95*T, y: 12*T, state: 'running', frame: 348 },
                { x: 98*T, y: 14*T, state: 'jumping', frame: 358 },
                { x: 100*T, y: 16*T, state: 'falling', frame: 366 },
                { x: 101*T, y: 16*T, state: 'running', frame: 370 },
                { x: 102*T, y: 14*T, state: 'jumping', frame: 378 },
                { x: 106*T, y: 12*T, state: 'jumping', frame: 388 },
                { x: 108*T, y: 8*T, state: 'wall_sliding', frame: 398 },
                { x: 112*T-PLAYER_W, y: 6*T, state: 'jumping', frame: 408 },
                { x: 108*T, y: 5*T, state: 'wall_sliding', frame: 416 },
                { x: 114*T, y: 8*T, state: 'jumping', frame: 426 },
                { x: 118*T, y: 14*T, state: 'falling', frame: 438 },
                { x: 120*T, y: 14*T, state: 'running', frame: 444 },
                { x: 122*T, y: 12*T, state: 'jumping', frame: 454 },
                { x: 125*T, y: 12*T, state: 'falling', frame: 464 },
                { x: 130*T, y: 16*T, state: 'falling', frame: 472 },
                { x: 132*T, y: 14*T, state: 'jumping', frame: 478 },
                { x: 135*T, y: 6*T, state: 'wall_sliding', frame: 486 },
                { x: 140*T-PLAYER_W, y: 4*T, state: 'jumping', frame: 492 },
                { x: 143*T, y: 2*T, state: 'falling', frame: 496 },
                { x: 148*T, y: 2*T, state: 'running', frame: 499 },
                { x: 148*T, y: 2*T, state: 'idle', frame: 500 },
            ]
        },
    };

    const data = levelWaypoints[levelIndex];
    if (!data) {
        return { time: 30, username: 'COMPUTER', replay: [] };
    }
    // Scale to realistic human speed — 1.8x slower so movement looks natural
    const speedScale = 1.8;
    const scaledWaypoints = data.waypoints.map(wp => ({
        ...wp,
        frame: Math.round(wp.frame * speedScale)
    }));
    const scaledFrames = Math.round(data.frames * speedScale);
    const scaledTime = +(data.time * speedScale).toFixed(1);
    const replay = buildReplayPath(scaledWaypoints, scaledFrames);
    return { time: scaledTime, username: 'COMPUTER', replay: replay };
}

function loadBestRuns() {
    try {
        const saved = localStorage.getItem('parkour_best_runs');
        if (saved) bestRuns = JSON.parse(saved);
    } catch(e) {}
    // Fill missing with computer runs
    for (let i = 0; i < LEVELS.length; i++) {
        if (!bestRuns[i]) {
            bestRuns[i] = generateComputerRun(i);
        }
    }
}

// ---------- GRADE SYSTEM ----------
function getGrade(level, time) {
    if (level < 0 || level >= GRADE_THRESHOLDS.length) return 'none';
    const t = GRADE_THRESHOLDS[level];
    if (time <= t.gold) return 'gold';
    if (time <= t.silver) return 'silver';
    if (time <= t.bronze) return 'bronze';
    return 'none';
}

// ---------- DIFFICULTY GEOMETRY MODIFIER ----------
function applyDifficultyGeometry() {
    const diff = getDiff();
    const wb = diff.platWidthBonus || 0;
    const gs = diff.gapShrink || 0;
    const removeChance = diff.spikeRemoveChance || 0;

    if (wb === 0 && gs === 0 && removeChance === 0) return;

    // Widen or narrow platforms
    if (wb !== 0) {
        for (const p of platforms) {
            const addW = wb * TILE;
            // Center the width change — grow/shrink from both sides
            p.x -= Math.floor(addW / 2);
            p.w += addW;
            // Clamp minimum width
            if (p.w < TILE) {
                p.w = TILE;
            }
        }
        // Also adjust moving and falling platforms
        for (const mp of movingPlatforms) {
            const addW = Math.floor(wb * TILE * 0.5); // half effect on special plats
            mp.x -= Math.floor(addW / 2);
            mp.w += addW;
            mp.startX -= Math.floor(addW / 2);
            if (mp.w < TILE) mp.w = TILE;
        }
        for (const fp of fallingPlatforms) {
            const addW = Math.floor(wb * TILE * 0.5);
            fp.x -= Math.floor(addW / 2);
            fp.w += addW;
            if (fp.w < TILE) fp.w = TILE;
        }
    }

    // Shrink or grow gaps — move platforms closer/farther apart
    if (gs !== 0 && platforms.length > 1) {
        // Sort platforms by x position
        const sorted = [...platforms].sort((a, b) => a.x - b.x);
        for (let i = 1; i < sorted.length; i++) {
            const shift = gs * TILE;
            sorted[i].x -= shift * i; // cumulative shift
        }
        // Also shift goal if it exists
        if (goalZone) {
            goalZone.x -= gs * TILE * (sorted.length - 1);
        }
    }

    // Remove some spike groups on easy
    if (removeChance > 0) {
        // Use a seeded approach based on level so it's consistent
        const seed = currentLevel * 1000;
        spikes = spikes.filter((s, i) => {
            const pseudoRand = ((seed + i * 7919) % 100) / 100;
            return pseudoRand >= removeChance;
        });
    }

    // On hard/extreme: make moving platforms faster
    if (difficulty === 'hard') {
        for (const mp of movingPlatforms) {
            mp.speed *= 1.3;
        }
    } else if (difficulty === 'extreme') {
        for (const mp of movingPlatforms) {
            mp.speed *= 1.6;
        }
        // Falling platforms trigger faster
        // (handled in updateFallingPlatforms via fallTimer threshold)
    }

    // On easy: slow down moving platforms, longer falling platform timer
    if (difficulty === 'easy') {
        for (const mp of movingPlatforms) {
            mp.speed *= 0.7;
        }
    }
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

    // Apply difficulty-based geometry modifications
    applyDifficultyGeometry();

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
    if (hudLevel) hudLevel.textContent = 'Level ' + (index + 1) + ' [' + getDiff().label + ']';
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
        p.vx = inputX * getCheatRunSpeed();
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
        p.dashTimer = getCheatDashDuration();
        p.dashCooldown = getCheatDashCooldown();
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
            p.vx = inputX * getCheatRunSpeed();
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

    // ---- Gravity (difficulty + cheat scaled) ----
    const diff = getDiff();
    const cGravity = getCheatGravity();
    const cMaxFall = getCheatMaxFall();
    const cJumpForce = getCheatJumpForce();
    const cCoyoteTime = getCheatCoyoteTime();
    const cJumpBuffer = getCheatJumpBuffer();
    if (!p.isDashing) {
        p.vy += cGravity * s;
        if (p.vy > cMaxFall) p.vy = cMaxFall;
    }

    // ---- Coyote time & jump buffer ----
    if (p.onGround) {
        p.coyoteTimer = cCoyoteTime;
        p.dashCooldown = 0;
    } else {
        if (p.coyoteTimer > 0) p.coyoteTimer -= s;
    }

    if ((keys['KeyW'] || keys['Space'] || keys['ArrowUp'] || keys['touchJump']) &&
        !(prevKeys['KeyW'] || prevKeys['Space'] || prevKeys['ArrowUp'] || prevKeys['touchJump'])) {
        p.jumpBuffer = cJumpBuffer;
    }
    if (p.jumpBuffer > 0) p.jumpBuffer -= s;

    // ---- Jump ----
    if (p.jumpBuffer > 0 && p.coyoteTimer > 0 && !p.isDashing) {
        p.vy = cJumpForce;
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
        p.vy = Math.min(p.vy, getCheatWallSlideMax());
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

    // ---- Spike collision (death, hitbox shrunk by difficulty) ----
    const si = getCheatSpikeInset();
    for (const sp of spikes) {
        if (aabb({ x: p.x + si, y: p.y + si, w: p.w - si * 2, h: p.h - si * 2 }, sp)) {
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
    // Fall delay varies by difficulty: easy=50, medium=30, hard=20, extreme=12
    const fallDelay = difficulty === 'easy' ? 50 : difficulty === 'hard' ? 20 : difficulty === 'extreme' ? 12 : 30;
    for (const fp of fallingPlatforms) {
        if (fp.fallen) continue;
        if (fp.triggered) {
            fp.fallTimer += dt;
            if (fp.fallTimer < fallDelay) {
                fp.x = fp.x + (Math.random() - 0.5) * 2;
            } else {
                if (fp.fallTimer >= fallDelay && fp.fallTimer < fallDelay + 1) {
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

    // Check if player beat the best run
    if (currentLevel >= 0 && bestRuns[currentLevel] && time < bestRuns[currentLevel].time) {
        const username = prompt('NEW BEST RUN! Enter your name:', 'PLAYER');
        if (username && username.trim()) {
            bestRuns[currentLevel] = {
                time: time,
                username: username.trim().toUpperCase().substring(0, 12),
                replay: [...ghostRecording]
            };
            try {
                localStorage.setItem('parkour_best_runs', JSON.stringify(bestRuns));
            } catch(e) {}
        }
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
    const th = getTheme();
    const grad = ctx.createLinearGradient(0, 0, 0, canvasH);
    grad.addColorStop(0, th.bgTop);
    grad.addColorStop(0.5, th.bgMid);
    grad.addColorStop(1, th.bgBot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Stars with parallax and twinkle — colored by theme
    if (bgGenerated) {
        const t = Date.now();
        for (const s of bgStars) {
            const sx = ((s.x - camera.x * s.parallax) % (canvasW + 200) + canvasW + 200) % (canvasW + 200) - 100;
            const sy = ((s.y - camera.y * s.parallax * 0.5) % (canvasH + 200) + canvasH + 200) % (canvasH + 200) - 100;
            const twinkle = s.brightness * (0.6 + 0.4 * Math.sin(t * s.twinkleSpeed));
            ctx.globalAlpha = twinkle;
            ctx.fillStyle = th.starColor;
            ctx.fillRect(sx, sy, s.size, s.size);
        }
        ctx.globalAlpha = 1;
    }
}

function drawPlatforms() {
    const th = getTheme();
    for (const p of platforms) {
        const sx = p.x - camera.x;
        const sy = p.y - camera.y;
        if (sx + p.w < 0 || sx > canvasW || sy + p.h < 0 || sy > canvasH) continue;

        // BIG outer glow halo — impossible to miss
        ctx.fillStyle = th.platGlow;
        ctx.fillRect(sx - 8, sy - 8, p.w + 16, p.h + 16);
        // Second tighter glow
        ctx.fillStyle = th.platGlow;
        ctx.fillRect(sx - 4, sy - 4, p.w + 8, p.h + 8);

        // Main body
        ctx.fillStyle = th.platBody;
        ctx.fillRect(sx, sy, p.w, p.h);

        // THICK bright top edge — 6px, the main visual anchor
        ctx.fillStyle = th.platTop;
        ctx.fillRect(sx, sy, p.w, 6);
        // Glow above top edge — 5px tall
        ctx.fillStyle = th.platTopGlow;
        ctx.fillRect(sx - 2, sy - 5, p.w + 4, 5);

        // Bottom darker edge
        ctx.fillStyle = th.platBottom;
        ctx.fillRect(sx, sy + p.h - 4, p.w, 4);

        // Bright side borders — 4px thick
        ctx.fillStyle = th.platSide;
        ctx.fillRect(sx, sy, 4, p.h);
        ctx.fillRect(sx + p.w - 4, sy, 4, p.h);

        // Surface texture dots
        ctx.fillStyle = th.platTexture;
        for (let rx = TILE / 2; rx < p.w; rx += TILE) {
            ctx.fillRect(sx + rx - 2, sy + 9, 4, 4);
            if (p.h > TILE) ctx.fillRect(sx + rx - 2, sy + p.h - 11, 4, 4);
        }

        // Grid lines
        ctx.strokeStyle = th.platGrid;
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
    const th = getTheme();
    for (const w of walls) {
        const sx = w.x - camera.x;
        const sy = w.y - camera.y;
        if (sx + w.w < 0 || sx > canvasW || sy + w.h < 0 || sy > canvasH) continue;

        // Big outer glow
        ctx.fillStyle = th.wallGlow;
        ctx.fillRect(sx - 6, sy - 3, w.w + 12, w.h + 6);

        // Main body
        ctx.fillStyle = th.wallBody;
        ctx.fillRect(sx, sy, w.w, w.h);

        // Thick bright side edges — 5px + glow
        ctx.fillStyle = th.wallEdge;
        ctx.fillRect(sx, sy, 5, w.h);
        ctx.fillRect(sx + w.w - 5, sy, 5, w.h);
        // Side glow
        ctx.fillStyle = th.wallGlow;
        ctx.fillRect(sx - 4, sy, 4, w.h);
        ctx.fillRect(sx + w.w, sy, 4, w.h);

        // Top/bottom caps
        ctx.fillStyle = th.wallCap;
        ctx.fillRect(sx, sy, w.w, 4);
        ctx.fillRect(sx, sy + w.h - 4, w.w, 4);

        // Rivets
        ctx.fillStyle = th.wallRivet;
        for (let ry = TILE / 2; ry < w.h; ry += TILE) {
            ctx.fillRect(sx + w.w / 2 - 3, sy + ry - 3, 6, 6);
        }
        ctx.strokeStyle = th.wallGridStroke;
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
    const pulseAlpha = Math.sin(Date.now() * 0.005) * 0.2 + 0.35;
    for (const s of spikes) {
        const sx = s.x - camera.x;
        const sy = s.y - camera.y;
        if (sx + s.w < 0 || sx > canvasW || sy + s.h < 0 || sy > canvasH) continue;

        // Strong pulsing glow behind spikes
        ctx.fillStyle = `rgba(255, 40, 40, ${pulseAlpha * 0.5})`;
        ctx.fillRect(sx - 2, sy - 4, s.w + 4, s.h + 8);

        // Spike triangles
        const spikeW = 12;
        for (let i = 0; i < s.w; i += spikeW) {
            ctx.fillStyle = '#ff3333';
            ctx.beginPath();
            ctx.moveTo(sx + i, sy + s.h);
            ctx.lineTo(sx + i + spikeW / 2, sy + 2);
            ctx.lineTo(sx + i + spikeW, sy + s.h);
            ctx.fill();
            // Bright white tip
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(sx + i + spikeW / 2 - 2, sy + 1, 4, 4);
        }
    }
}

function drawMovingPlatforms() {
    const th = getTheme();
    for (const mp of movingPlatforms) {
        const sx = mp.x - camera.x;
        const sy = mp.y - camera.y;
        if (sx + mp.w < -50 || sx > canvasW + 50 || sy + mp.h < -50 || sy > canvasH + 50) continue;

        // Glow trail
        for (let t = 0; t < mp.trail.length; t++) {
            const tr = mp.trail[t];
            const alpha = (t + 1) / (mp.trail.length + 1) * 0.2;
            ctx.fillStyle = `rgba(${th.movTrail[0]}, ${th.movTrail[1]}, ${th.movTrail[2]}, ${alpha})`;
            ctx.fillRect(tr.x - camera.x, tr.y - camera.y, mp.w, mp.h);
        }

        // Big outer glow
        ctx.fillStyle = th.movTopGlow;
        ctx.fillRect(sx - 6, sy - 6, mp.w + 12, mp.h + 12);

        ctx.fillStyle = th.movBody;
        ctx.fillRect(sx, sy, mp.w, mp.h);
        // Bright top edge — 6px
        ctx.fillStyle = th.movTop;
        ctx.fillRect(sx, sy, mp.w, 6);
        ctx.fillStyle = th.movTopGlow;
        ctx.fillRect(sx - 2, sy - 4, mp.w + 4, 4);
        // Side edges — 4px
        ctx.fillStyle = th.movSide;
        ctx.fillRect(sx, sy, 4, mp.h);
        ctx.fillRect(sx + mp.w - 4, sy, 4, mp.h);

        // Path guide
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = th.movPath;
        ctx.lineWidth = 2;
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
    const th = getTheme();
    for (const fp of fallingPlatforms) {
        if (fp.fallen) continue;
        const sx = fp.x - camera.x;
        const sy = fp.y - camera.y;
        if (sx + fp.w < 0 || sx > canvasW || sy + fp.h < 0 || sy > canvasH) continue;

        // Big outer glow
        ctx.fillStyle = th.fallTopGlow;
        ctx.fillRect(sx - 6, sy - 6, fp.w + 12, fp.h + 12);

        if (fp.triggered && fp.fallTimer < 30) {
            ctx.fillStyle = fp.fallTimer % 6 < 3 ? '#bb5540' : '#995530';
        } else {
            ctx.fillStyle = th.fallBody;
        }
        ctx.fillRect(sx, sy, fp.w, fp.h);
        // Bright top edge — 6px
        ctx.fillStyle = th.fallTop;
        ctx.fillRect(sx, sy, fp.w, 6);
        ctx.fillStyle = th.fallTopGlow;
        ctx.fillRect(sx - 2, sy - 4, fp.w + 4, 4);
        // Side edges — 4px
        ctx.fillStyle = th.fallSide;
        ctx.fillRect(sx, sy, 4, fp.h);
        ctx.fillRect(sx + fp.w - 4, sy, 4, fp.h);

        // Progressive crack lines
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.lineWidth = 2;
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

        // Outer glow for boost pads too
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.fillRect(sx - 4, sy - 4, bp.w + 8, bp.h + 8);

        ctx.globalAlpha = pulse;
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(sx, sy, bp.w, bp.h);
        ctx.globalAlpha = 1;

        // Bright border
        ctx.strokeStyle = '#ffee44';
        ctx.lineWidth = 2;
        ctx.strokeRect(sx, sy, bp.w, bp.h);

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

// ---------- REPLAY SYSTEM ----------
function startReplayMode(levelIndex) {
    const run = bestRuns[levelIndex];
    if (!run || !run.replay || run.replay.length === 0) return;

    replayLevelIndex = levelIndex;
    replayData = run.replay;
    replayFrame = 0;
    replayTimer = 0;
    replayTotalTime = run.time;
    replayPlayerFacing = 1;
    replayDistTraveled = 0;
    replayPlayerState = 'idle';

    // Load level geometry
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

    currentLevel = levelIndex;
    LEVELS[levelIndex]();

    // Reset moving platform timers
    for (const mp of movingPlatforms) {
        mp.t = 0;
        mp.x = mp.startX;
        mp.y = mp.startY;
        mp.trail = [];
    }

    // Set initial player position
    player.x = replayData[0].x;
    player.y = replayData[0].y;
    player.w = PLAYER_W;
    player.h = PLAYER_H;
    camera.x = player.x - canvasW / 2;
    camera.y = player.y - canvasH / 2;

    // Show game screen
    showScreen('game');
    gameState = 'replay';

    // Hide normal HUD, show replay HUD
    const hud = document.getElementById('hud');
    if (hud) hud.style.display = 'none';
    const replayHud = document.getElementById('replay-hud');
    if (replayHud) replayHud.classList.remove('hidden');
    const replayHudUser = document.getElementById('replay-hud-user');
    if (replayHudUser) replayHudUser.textContent = run.username || 'COMPUTER';
    const replayHudTimer = document.getElementById('replay-hud-timer');
    if (replayHudTimer) replayHudTimer.textContent = '0.00s';
    const replayHudInfo = document.getElementById('replay-hud-info');
    if (replayHudInfo) replayHudInfo.textContent = 'BEST RUN - Level ' + (levelIndex + 1);

    // Hide other overlays
    document.getElementById('pause-overlay').classList.add('hidden');
    document.getElementById('complete-overlay').classList.add('hidden');
    document.getElementById('death-overlay').classList.add('hidden');
    document.getElementById('replay-overlay').classList.add('hidden');

    // Hide tutorial hint
    const tutEl = document.getElementById('tutorial-hint');
    if (tutEl) tutEl.classList.remove('visible');
}

function showReplayComplete() {
    gameState = 'replay_done';
    const run = bestRuns[replayLevelIndex];
    const overlay = document.getElementById('replay-overlay');
    const title = document.getElementById('replay-title');
    const info = document.getElementById('replay-info');

    if (title) title.textContent = 'RUN COMPLETE';
    if (info) info.textContent = (run ? run.username : 'COMPUTER') + ' - ' + (run ? run.time.toFixed(2) : replayTimer.toFixed(2)) + 's';
    if (overlay) overlay.classList.remove('hidden');
}

function exitReplayMode() {
    gameState = 'menu';

    // Restore normal HUD
    const hud = document.getElementById('hud');
    if (hud) hud.style.display = '';
    const replayHud = document.getElementById('replay-hud');
    if (replayHud) replayHud.classList.add('hidden');
    document.getElementById('replay-overlay').classList.add('hidden');

    // Go back to best run list
    populateBestRunGrid();
    showScreen('bestrun');
}

function drawReplayPlayer() {
    const p = player;
    const sx = p.x - camera.x;
    const sy = p.y - camera.y;
    const state = replayPlayerState;
    const facing = replayPlayerFacing;
    const currentH = state === 'sliding' ? PLAYER_H_SLIDE : PLAYER_H;
    const centerX = sx + PLAYER_W / 2;
    const bottomY = sy + currentH;
    const th = getTheme();

    ctx.save();
    ctx.translate(centerX, bottomY);
    ctx.scale(facing, 1);

    if (state === 'sliding') {
        ctx.fillStyle = th.playerArms;
        ctx.fillRect(-10, -PLAYER_H_SLIDE, 20, PLAYER_H_SLIDE);
        ctx.fillStyle = th.playerHead;
        ctx.fillRect(-4, -PLAYER_H_SLIDE, 8, 6);
        ctx.fillStyle = '#fff';
        ctx.fillRect(1, -PLAYER_H_SLIDE + 2, 2, 2);
    } else {
        let bodyColor = th.playerBody;
        if (state === 'dashing') bodyColor = '#ff4081';
        else if (state === 'jumping' || state === 'falling') bodyColor = th.playerHead;
        else if (state === 'wall_sliding') bodyColor = th.playerArms;

        // Head
        ctx.fillStyle = bodyColor;
        ctx.fillRect(-4, -PLAYER_H, 8, 8);
        // Eyes
        ctx.fillStyle = '#fff';
        ctx.fillRect(1, -PLAYER_H + 3, 2, 2);
        // Torso
        const breathOffset = state === 'idle' ? Math.sin(Date.now() * 0.003) * 0.5 : 0;
        ctx.fillStyle = bodyColor;
        ctx.fillRect(-6, -PLAYER_H + 8 + breathOffset, 12, 10);

        // Arms
        const animCycle = Math.floor(replayDistTraveled / 12) % 4;
        let leftArmY = -PLAYER_H + 9;
        let rightArmY = -PLAYER_H + 9;
        if (state === 'running') {
            const offsets = [0, -3, 0, 3];
            leftArmY += offsets[animCycle];
            rightArmY += offsets[(animCycle + 2) % 4];
        } else if (state === 'jumping') {
            leftArmY -= 4; rightArmY -= 4;
        } else if (state === 'falling') {
            leftArmY -= 2; rightArmY -= 2;
        } else if (state === 'dashing') {
            leftArmY += 2; rightArmY += 2;
        }
        ctx.fillRect(-10, leftArmY, 4, 8);
        ctx.fillRect(6, rightArmY, 4, 8);

        // Legs
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
            leftLegY += 3; rightLegY += 3;
            leftLegX -= 1; rightLegX += 1;
        } else if (state === 'falling') {
            leftLegX -= 2; rightLegX += 2;
        } else if (state === 'wall_sliding') {
            leftLegX = -3; rightLegX = -1;
        }
        ctx.fillRect(leftLegX, leftLegY, 4, 10);
        ctx.fillRect(rightLegX, rightLegY, 4, 10);
    }

    ctx.restore();
}

function populateBestRunGrid() {
    const grid = document.getElementById('bestrun-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 0; i < LEVELS.length; i++) {
        const tile = document.createElement('div');
        tile.className = 'level-tile';
        const run = bestRuns[i];
        const runnerName = run ? run.username : 'COMPUTER';
        const runTime = run ? run.time.toFixed(2) + 's' : '---';

        tile.innerHTML =
            '<span class="level-num">' + (i + 1) + '</span>' +
            '<span class="level-best">' + runTime + '</span>' +
            '<span class="level-runner">' + runnerName + '</span>';

        tile.addEventListener('click', ((lvl) => () => {
            initAudio();
            playSound('click');
            doScreenWipe(() => startReplayMode(lvl));
        })(i));

        grid.appendChild(tile);
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

    // Draw character based on state — themed
    const th = getTheme();
    if (state === 'sliding') {
        ctx.fillStyle = th.playerArms;
        ctx.fillRect(-10, -PLAYER_H_SLIDE, 20, PLAYER_H_SLIDE);
        ctx.fillStyle = th.playerHead;
        ctx.fillRect(-4, -PLAYER_H_SLIDE, 8, 6);
        ctx.fillStyle = '#fff';
        ctx.fillRect(1, -PLAYER_H_SLIDE + 2, 2, 2);
    } else {
        let bodyColor = th.playerBody;
        if (state === 'dashing') bodyColor = '#ff4081';
        else if (state === 'jumping' || state === 'falling') bodyColor = th.playerHead;
        else if (state === 'wall_sliding') bodyColor = th.playerArms;

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
    if (currentScreen === 'menu' || currentScreen === 'level' || currentScreen === 'controls' || currentScreen === 'bestrun') {
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

    // Replay mode update
    if (gameState === 'replay') {
        replayTimer += dt / 1000;
        // Calculate which frame to show based on elapsed time vs total run time
        const progress = Math.min(replayTimer / replayTotalTime, 1);
        const newFrame = Math.min(Math.floor(progress * replayData.length), replayData.length - 1);
        if (newFrame < replayData.length && progress < 1) {
            const frame = replayData[newFrame];
            const prevX = player.x;
            player.x = frame.x;
            player.y = frame.y;
            replayPlayerState = frame.state || 'running';
            // Track facing direction from movement
            if (frame.x > prevX + 0.5) replayPlayerFacing = 1;
            else if (frame.x < prevX - 0.5) replayPlayerFacing = -1;
            // Track distance for animation
            replayDistTraveled += Math.abs(frame.x - prevX);
            replayFrame = newFrame;
            // Update camera to follow
            updateCamera(dtScale);
            // Update replay HUD timer
            const replayHudTimer = document.getElementById('replay-hud-timer');
            if (replayHudTimer) replayHudTimer.textContent = replayTimer.toFixed(2) + 's';
            // Update moving platforms for visual fidelity
            updateMovingPlatforms(dtScale);
        } else {
            // Replay complete
            showReplayComplete();
        }
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
        if (gameState !== 'replay') {
            drawGhost();
        }
        drawGoal();
        drawCheckpoints();
        drawPlatforms();
        drawWalls();
        drawSpikes();
        drawMovingPlatforms();
        drawFallingPlatforms();
        drawBoostPads();
        if (gameState === 'replay') {
            drawReplayPlayer();
        } else {
            drawPlayer();
        }
        drawParticles();
        if (gameState !== 'replay') {
            drawSpeedLines();
        }
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
        if (gameState === 'replay' || gameState === 'replay_done') {
            exitReplayMode();
        } else if (gameState === 'playing') {
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
    try {
        const savedDiff = localStorage.getItem('parkour_difficulty');
        if (savedDiff && DIFFICULTIES[savedDiff]) difficulty = savedDiff;
    } catch(e) {}
    loadBestRuns();
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
        pendingAction = 'play';
        showScreen('difficulty');
    });

    document.getElementById('btn-levels').addEventListener('click', () => {
        playSound('click');
        pendingAction = 'levels';
        showScreen('difficulty');
    });

    document.getElementById('btn-best-runs').addEventListener('click', () => {
        playSound('click');
        populateBestRunGrid();
        showScreen('bestrun');
    });

    document.getElementById('btn-back-bestrun').addEventListener('click', () => {
        playSound('click');
        showScreen('menu');
    });

    document.getElementById('btn-back-replay').addEventListener('click', () => {
        playSound('click');
        exitReplayMode();
    });

    document.getElementById('btn-editor').addEventListener('click', () => {
        playSound('click');
        showScreen('editor');
    });

    // Difficulty select buttons
    let pendingAction = 'play';
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            initAudio();
            playSound('click');
            difficulty = btn.dataset.diff;
            try { localStorage.setItem('parkour_difficulty', difficulty); } catch(e) {}
            // Highlight selected
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            if (pendingAction === 'play') {
                doScreenWipe(() => startLevel(0));
            } else {
                populateLevelGrid();
                showScreen('level');
            }
        });
    });

    document.getElementById('btn-back-diff').addEventListener('click', () => {
        playSound('click');
        showScreen('menu');
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

    // Cheat mode
    const cheatInput = document.getElementById('cheat-input');
    const cheatStatus = document.getElementById('cheat-status');
    const btnCheat = document.getElementById('btn-cheat');
    if (btnCheat && cheatInput && cheatStatus) {
        const activateCheat = () => {
            const code = cheatInput.value.trim().toLowerCase();
            if (code === 'srg2') {
                cheatMode = true;
                cheatStatus.textContent = 'ACTIVE';
                cheatStatus.className = 'cheat-status active';
                cheatInput.value = '';
                playSound('checkpoint');
            } else if (code === '') {
                // do nothing
            } else {
                cheatMode = false;
                cheatStatus.textContent = 'WRONG';
                cheatStatus.className = 'cheat-status wrong';
                setTimeout(() => {
                    if (!cheatMode) {
                        cheatStatus.textContent = '';
                        cheatStatus.className = 'cheat-status';
                    }
                }, 1500);
            }
        };
        btnCheat.addEventListener('click', () => {
            playSound('click');
            activateCheat();
        });
        cheatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') activateCheat();
            e.stopPropagation(); // prevent game keys from firing
        });
        cheatInput.addEventListener('keyup', (e) => e.stopPropagation());
    }
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
    generateBackground();
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
