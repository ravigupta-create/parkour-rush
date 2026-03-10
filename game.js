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
const DASH_SPEED = 10;
const DASH_DURATION = 8;
const DASH_COOLDOWN = 30;
const SLIDE_SPEED = RUN_SPEED + 1;
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
    { gold: 10, silver: 16, bronze: 24 },     // L1: Tutorial
    { gold: 12, silver: 18, bronze: 26 },     // L2: Wall Jump
    { gold: 14, silver: 20, bronze: 28 },     // L3: Dash
    { gold: 14, silver: 20, bronze: 28 },     // L4: Slide
    { gold: 16, silver: 24, bronze: 34 },     // L5: Moving
    { gold: 14, silver: 20, bronze: 28 },     // L6: Falling
    { gold: 18, silver: 26, bronze: 36 },     // L7: Wall Climb
    { gold: 16, silver: 24, bronze: 34 },     // L8: Boost Rush
    { gold: 20, silver: 30, bronze: 42 },     // L9: Gauntlet
    { gold: 28, silver: 40, bronze: 55 },     // L10: Master
    { gold: 22, silver: 32, bronze: 44 },     // L11: Sky Highway
    { gold: 16, silver: 24, bronze: 34 },     // L12: The Pit
    { gold: 18, silver: 26, bronze: 36 },     // L13: Mirror Run
    { gold: 20, silver: 30, bronze: 42 },     // L14: Momentum
    { gold: 35, silver: 50, bronze: 70 },     // L15: Final Rush
];

// ---------- TUTORIAL HINTS ----------
const TUTORIAL_HINTS = [
    "Use A/D or Arrow Keys to move. Jump with W or SPACE.",
    "Jump between walls! Press JUMP while touching a wall to wall-jump.",
    "Press SHIFT in midair to DASH across big gaps!",
    "Press S or DOWN while running to SLIDE under low ceilings.",
    "Time your jumps! Moving platforms follow set patterns.",
    "Crumbling floors fall fast — keep moving!",
    "Wall-jump up narrow shafts by bouncing left and right.",
    "Boost pads launch you forward — hit them at full speed!",
    "Mix everything! Wall-jumps, dashes, slides — use them all.",
    "Master level! You'll need every skill to survive this.",
    "Moving platforms can be tricky — watch the patterns.",
    "Descending through walls? Control your fall with wall slides.",
    "Slide under low ceilings where spikes block the top path.",
    "Boost chain! Hit each pad and jump at peak speed.",
    "The final rush tests everything. Use checkpoints wisely!"
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
        coyoteTime: 2,
        jumpBuffer: 2,
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

// Helper to darken a hex color by a factor (0-1)
function darkenColor(hex, factor) {
    hex = hex.replace('#', '');
    const r = Math.max(0, Math.floor(parseInt(hex.substring(0, 2), 16) * factor));
    const g = Math.max(0, Math.floor(parseInt(hex.substring(2, 4), 16) * factor));
    const b = Math.max(0, Math.floor(parseInt(hex.substring(4, 6), 16) * factor));
    return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
}

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
let timerStarted = false; // timer doesn't tick until player moves
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
// Particle object pool — pre-allocated, zero GC pressure
const PARTICLE_POOL_SIZE = 500;
let particlePool = [];
let particleCount = 0;
for (let _pi = 0; _pi < PARTICLE_POOL_SIZE; _pi++) {
    particlePool.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, size: 0, color: '' });
}
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
let ghostPlaybackCounter = 0;
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

// Floating text popups (2A)
let floatingTexts = [];

// Screen flash (2B)
let screenFlash = { active: false, color: '#fff', alpha: 0, decay: 0 };

// Streak system (2G)
let currentStreak = 0;
let bestStreak = 0;

// Auto-restart countdown (2E)
let autoRestartTimer = 0;
let autoRestartActive = false;

// Stats tracking
let totalTimePlayed = 0;
let totalCompletions = 0;

// FPS tracking
let fpsHistory = [];
let lowFpsMode = false;

// --- New Systems State (v3.0) ---
let footstepDist = 0;
let wallSlideNode = null;
let wallSlideGainNode = null;
let isWallSlideSounding = false;
let windNode = null;
let windGainNode = null;
let windFilterNode = null;
let deathAnim = { active: false, pieces: [], frame: 0 };
let confetti = [];
let confettiTimer = 0;
let weatherParticles = [];
let scarfTrail = [];
let deathZoom = 0;
let deathReplayBuffer = [];
let deathReplayActive = false;
let deathReplayFrame = 0;
let cameraZoom = 1;
let practiceMode = false;
let endlessMode = false;
let endlessDistance = 0;
let endlessBest = 0;
let endlessSegments = [];
let endlessLastX = 0;
let musicBeatCount = 0;
let masterGainNode = null;
let gameSettings = { volume: 100, particles: true, shake: true, minimap: true, colorblind: false, highContrast: false, hints: true, autoRestart: true };
let countdownTimer = 0; // 3-2-1-GO countdown
let countdownActive = false;
let bgClouds = []; // parallax cloud layer
let editorHistory = []; // undo stack
let editorRedoStack = []; // redo stack
let endlessRuns = 0;
let endlessTotalDist = 0;
let starAnimTimer = 0; // animated star count-up on completion
let gamepadConnected = false; // gamepad support
let gamepadDeadzone = 0.15;
let prevGamepadButtons = {}; // edge detection for gamepad
let dashReadyNotified = true; // dash cooldown notification flag
let goalProximityNotified = false; // "ALMOST THERE" flag
// Achievements
const ACHIEVEMENTS = [
    { id: 'first_clear', name: 'First Steps', desc: 'Complete any level', icon: '1' },
    { id: 'all_clear', name: 'Completionist', desc: 'Complete all 15 levels', icon: 'A' },
    { id: 'gold_run', name: 'Gold Standard', desc: 'Get a gold grade', icon: 'G' },
    { id: 'all_gold', name: 'Perfect Runner', desc: 'Gold on every level', icon: '*' },
    { id: 'no_death', name: 'Deathless', desc: 'Complete a level with 0 deaths', icon: '0' },
    { id: 'speed_demon', name: 'Speed Demon', desc: 'Beat gold time by 2+ seconds', icon: 'S' },
    { id: 'combo_5', name: 'Combo Starter', desc: 'Reach a 5x combo', icon: '5' },
    { id: 'combo_10', name: 'Combo Master', desc: 'Reach a 10x combo', icon: 'X' },
    { id: 'streak_3', name: 'On a Roll', desc: '3 deathless levels in a row', icon: '3' },
    { id: 'streak_5', name: 'Unstoppable', desc: '5 deathless levels in a row', icon: '!' },
    { id: 'deaths_100', name: 'Persistent', desc: 'Die 100 times total', icon: 'D' },
    { id: 'wall_master', name: 'Wall Master', desc: '50 wall jumps total', icon: 'W' },
    { id: 'dash_master', name: 'Dash Master', desc: '50 dashes total', icon: '-' },
    { id: 'collector', name: 'Collector', desc: 'Collect 50 orbs', icon: 'O' },
    { id: 'daily_first', name: 'Daily Runner', desc: 'Complete a daily challenge', icon: 'C' },
    { id: 'hard_clear', name: 'Firewalker', desc: 'Complete a level on hard', icon: 'F' },
    { id: 'extreme_clear', name: 'Extremist', desc: 'Complete a level on extreme', icon: 'E' },
    { id: 'editor_test', name: 'Creator', desc: 'Test a custom level', icon: 'T' },
    { id: 'all_skins', name: 'Fashionista', desc: 'Unlock all skins', icon: 'K' },
    { id: 'time_1h', name: 'Dedicated', desc: 'Play for 1 hour total', icon: 'H' },
    { id: 'endless_100', name: 'Marathoner', desc: 'Reach 100m in endless mode', icon: 'M' },
    { id: 'endless_500', name: 'Ultra Runner', desc: 'Reach 500m in endless mode', icon: 'U' },
    { id: 'combo_20', name: 'Combo Legend', desc: 'Reach a 20x combo', icon: 'L' },
    { id: 'orbs_200', name: 'Treasure Hunter', desc: 'Collect 200 orbs total', icon: '$' },
    { id: 'deaths_500', name: 'Immortal Spirit', desc: 'Die 500 times total', icon: '+' }
];
let unlockedAchievements = {};
let achievementPopup = null;
let achievementPopupTimer = 0;
// Skins
const SKINS = [
    { id: 'default', name: 'Default', cost: 0, body: null, head: null, arms: null, legs: null },
    { id: 'neon_green', name: 'Neon Green', cost: 10, body: '#00ff66', head: '#33ff88', arms: '#00dd44', legs: '#00bb33' },
    { id: 'sunset', name: 'Sunset', cost: 15, body: '#ff6633', head: '#ff8855', arms: '#ee5522', legs: '#dd4411' },
    { id: 'ice', name: 'Ice', cost: 20, body: '#88ddff', head: '#aaeeff', arms: '#66ccee', legs: '#44bbdd' },
    { id: 'gold_skin', name: 'Gold', cost: 30, body: '#ffd700', head: '#ffee44', arms: '#ddbb00', legs: '#ccaa00' },
    { id: 'shadow', name: 'Shadow', cost: 40, body: '#333344', head: '#444455', arms: '#222233', legs: '#111122' },
    { id: 'bubblegum', name: 'Bubblegum', cost: 50, body: '#ff66aa', head: '#ff88cc', arms: '#ff4488', legs: '#ee3377' },
    { id: 'rainbow', name: 'Rainbow', cost: 100, body: 'rainbow', head: 'rainbow', arms: 'rainbow', legs: 'rainbow' }
];
let currentSkin = 'default';
let unlockedSkins = ['default'];
let totalOrbs = 0;
let orbs = [];
let totalWallJumps = 0;
let totalDashes = 0;

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
        masterGainNode = audioCtx.createGain();
        masterGainNode.gain.value = gameSettings.volume / 100;
        masterGainNode.connect(audioCtx['destination']);
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function audioDest() {
    return masterGainNode || audioCtx.destination;
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
                osc.connect(gain); gain.connect(audioDest());
                osc2.connect(gain2); gain2.connect(audioDest());
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
                osc.connect(gain); gain.connect(audioDest());
                osc2.connect(gain2); gain2.connect(audioDest());
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
                osc.connect(gain); gain.connect(audioDest());
                osc2.connect(gain2); gain2.connect(audioDest());
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
                osc.connect(filter); filter.connect(gain); gain.connect(audioDest());
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
                osc.connect(gain); gain.connect(audioDest());
                osc2.connect(gain2); gain2.connect(audioDest());
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
                osc.connect(filter); filter.connect(gain); gain.connect(audioDest());
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
                    o.connect(g); g.connect(audioDest());
                    o2.connect(g2); g2.connect(audioDest());
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
                osc.connect(gain); gain.connect(audioDest());
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
                    o.connect(g); g.connect(audioDest());
                    const t = now + i * 0.1;
                    o.type = 'sine';
                    o.frequency.setValueAtTime(notes[i] * pitchVar, t);
                    g.gain.setValueAtTime(0.06, t);
                    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
                    o.start(t); o.stop(t + 0.3);
                }
                break;
            }
            case 'footstep': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const filter = audioCtx.createBiquadFilter();
                osc.connect(filter); filter.connect(gain); gain.connect(audioDest());
                osc.type = 'triangle';
                osc.frequency.setValueAtTime((60 + Math.random() * 40) * pitchVar, now);
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(300, now);
                gain.gain.setValueAtTime(0.025, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
                osc.start(now); osc.stop(now + 0.06);
                break;
            }
            case 'land': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const filter = audioCtx.createBiquadFilter();
                osc.connect(filter); filter.connect(gain); gain.connect(audioDest());
                osc.type = 'sine';
                osc.frequency.setValueAtTime(80 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(30, now + 0.12);
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(400, now);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.start(now); osc.stop(now + 0.12);
                break;
            }
            case 'orb': {
                // Satisfying coin-like cha-ching
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const osc2 = audioCtx.createOscillator();
                const gain2 = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc2.connect(gain2); gain2.connect(audioDest());
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(1760 * pitchVar, now + 0.08);
                gain.gain.setValueAtTime(0.07, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc2.type = 'triangle';
                osc2.frequency.setValueAtTime(1320 * pitchVar, now + 0.05);
                osc2.frequency.exponentialRampToValueAtTime(1760 * pitchVar, now + 0.12);
                gain2.gain.setValueAtTime(0, now);
                gain2.gain.setValueAtTime(0.05, now + 0.05);
                gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
                osc.start(now); osc.stop(now + 0.15);
                osc2.start(now + 0.05); osc2.stop(now + 0.18);
                break;
            }
            case 'victory': {
                // Triumphant ascending fanfare — distinct from 'complete'
                const melody = [523, 659, 784, 1047, 1319, 1568];
                for (let i = 0; i < melody.length; i++) {
                    const o = audioCtx.createOscillator();
                    const g = audioCtx.createGain();
                    const o2 = audioCtx.createOscillator();
                    const g2 = audioCtx.createGain();
                    o.connect(g); g.connect(audioDest());
                    o2.connect(g2); g2.connect(audioDest());
                    const t = now + i * 0.12;
                    o.type = 'sine';
                    o.frequency.setValueAtTime(melody[i], t);
                    g.gain.setValueAtTime(0.07, t);
                    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
                    o2.type = 'triangle';
                    o2.frequency.setValueAtTime(melody[i] * 0.5, t);
                    g2.gain.setValueAtTime(0.03, t);
                    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
                    o.start(t); o.stop(t + 0.5);
                    o2.start(t); o2.stop(t + 0.4);
                }
                break;
            }
            case 'countdown': {
                const freq = arguments[1] === 'go' ? 880 : 440;
                const dur = arguments[1] === 'go' ? 0.3 : 0.15;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
                osc.start(now); osc.stop(now + dur);
                break;
            }
            case 'milestone': {
                // Brief ascending chime for endless milestones
                const notes = [660, 880, 1100];
                for (let i = 0; i < 3; i++) {
                    const o = audioCtx.createOscillator();
                    const g = audioCtx.createGain();
                    o.connect(g); g.connect(audioDest());
                    const t = now + i * 0.08;
                    o.type = 'sine';
                    o.frequency.setValueAtTime(notes[i], t);
                    g.gain.setValueAtTime(0.06, t);
                    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
                    o.start(t); o.stop(t + 0.2);
                }
                break;
            }
        }
    } catch (e) {
        // Audio errors are non-critical
    }
}

// ---------- WALL-SLIDE SOUND ----------
function startWallSlideSound() {
    if (isWallSlideSounding || !soundEnabled || !audioCtx) return;
    try {
        isWallSlideSounding = true;
        const bufSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
        wallSlideNode = audioCtx.createBufferSource();
        wallSlideNode.buffer = buffer;
        wallSlideNode.loop = true;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1500, audioCtx.currentTime);
        filter.Q.setValueAtTime(2, audioCtx.currentTime);
        wallSlideGainNode = audioCtx.createGain();
        wallSlideGainNode.gain.setValueAtTime(0.015, audioCtx.currentTime);
        wallSlideNode.connect(filter);
        filter.connect(wallSlideGainNode);
        wallSlideGainNode.connect(audioDest());
        wallSlideNode.start();
    } catch(e) {}
}

function stopWallSlideSound() {
    if (!isWallSlideSounding) return;
    isWallSlideSounding = false;
    try {
        if (wallSlideNode) { wallSlideNode.stop(); wallSlideNode = null; }
        wallSlideGainNode = null;
    } catch(e) {}
}

// ---------- AMBIENT WIND ----------
function startWind() {
    if (windNode || !soundEnabled || !audioCtx) return;
    try {
        const bufSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
        windNode = audioCtx.createBufferSource();
        windNode.buffer = buffer;
        windNode.loop = true;
        windFilterNode = audioCtx.createBiquadFilter();
        windFilterNode.type = 'lowpass';
        windFilterNode.frequency.setValueAtTime(400, audioCtx.currentTime);
        windGainNode = audioCtx.createGain();
        windGainNode.gain.setValueAtTime(0.008, audioCtx.currentTime);
        windNode.connect(windFilterNode);
        windFilterNode.connect(windGainNode);
        windGainNode.connect(audioDest());
        windNode.start();
    } catch(e) {}
}

function stopWind() {
    try {
        if (windNode) { windNode.stop(); windNode = null; }
        windGainNode = null;
        windFilterNode = null;
    } catch(e) {}
}

// ---------- BACKGROUND MUSIC ----------
function getThemeMusicNotes() {
    if (difficulty === 'hard') return { bass: [46, 55, 61, 69], melody: [174, 207, 233, 261, 311], pad: [110, 138, 165] };
    if (difficulty === 'extreme') return { bass: [41, 49, 55, 61], melody: [165, 196, 220, 247, 294], pad: [98, 123, 147] };
    return { bass: [55, 65, 73, 82], melody: [196, 220, 247, 294, 330], pad: [130, 164, 196] };
}

function startMusic() {
    if (musicPlaying || !soundEnabled || !audioCtx) return;
    musicPlaying = true;
    musicBeatCount = 0;
    try {
        const tmNotes = getThemeMusicNotes();
        const bassNotes = tmNotes.bass;
        let noteIndex = 0;
        const bpm = 120;
        const beatTime = 60 / bpm;

        // Bass line
        function playBassNote() {
            if (!musicPlaying || !audioCtx) return;
            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
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
                osc.connect(gain); gain.connect(audioDest());
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

        // Melody lead line
        function playMelody() {
            if (!musicPlaying || !audioCtx) return;
            try {
                const melNotes = tmNotes.melody;
                const note = melNotes[Math.floor(Math.random() * melNotes.length)];
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const filter = audioCtx.createBiquadFilter();
                osc.connect(filter); filter.connect(gain); gain.connect(audioDest());
                osc.type = 'sine';
                osc.frequency.setValueAtTime(note, audioCtx.currentTime);
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + beatTime * 0.7);
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + beatTime * 0.7);
                musicNodes.push({ osc, gain });
            } catch(e) {}
        }

        // Pad chord
        function playPad() {
            if (!musicPlaying || !audioCtx) return;
            try {
                const freqs = tmNotes.pad;
                for (const f of freqs) {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    const filter = audioCtx.createBiquadFilter();
                    osc.connect(filter); filter.connect(gain); gain.connect(audioDest());
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

        // Hi-hat
        function playHihat() {
            if (!musicPlaying || !audioCtx) return;
            try {
                const bufSize = Math.floor(audioCtx.sampleRate * 0.05);
                const buffer = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
                const source = audioCtx.createBufferSource();
                source.buffer = buffer;
                const filter = audioCtx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(8000, audioCtx.currentTime);
                filter.Q.setValueAtTime(1, audioCtx.currentTime);
                const gain = audioCtx.createGain();
                gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
                source.connect(filter);
                filter.connect(gain);
                gain.connect(audioDest());
                source.start(audioCtx.currentTime);
                source.stop(audioCtx.currentTime + 0.05);
                musicNodes.push({ osc: source, gain });
            } catch(e) {}
        }

        musicInterval = setInterval(() => {
            if (!musicPlaying) { clearInterval(musicInterval); return; }
            playBassNote();
            playKick();
            playHihat();
            if (musicBeatCount % 4 === 0) playPad();
            if (musicBeatCount % 2 === 1) playMelody();
            musicBeatCount++;
        }, beatTime * 1000);
    } catch (e) {}
}

function stopMusic(fadeOut) {
    musicPlaying = false;
    if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
    if (fadeOut && masterGainNode && audioCtx) {
        // Fade out over 300ms
        const now = audioCtx.currentTime;
        masterGainNode.gain.setValueAtTime(masterGainNode.gain.value, now);
        masterGainNode.gain.linearRampToValueAtTime(0, now + 0.3);
        setTimeout(() => {
            for (const node of musicNodes) {
                try { node.osc.stop(); } catch(e) {}
            }
            musicNodes = [];
            if (masterGainNode) masterGainNode.gain.value = gameSettings.volume / 100;
        }, 350);
    } else {
        for (const node of musicNodes) {
            try { node.osc.stop(); } catch(e) {}
        }
        musicNodes = [];
    }
    stopWallSlideSound();
    stopWind();
}

// ---------- PARTICLE SYSTEM (Object Pool) ----------
function spawnParticles(x, y, count, color, spread, speedMul) {
    for (let i = 0; i < count; i++) {
        if (particleCount >= PARTICLE_POOL_SIZE) break;
        const p = particlePool[particleCount];
        p.x = x;
        p.y = y;
        p.vx = (Math.random() - 0.5) * spread * (speedMul || 1);
        p.vy = (Math.random() - 0.8) * spread * (speedMul || 1);
        p.life = 15 + Math.random() * 15;
        p.maxLife = 30;
        p.size = 2 + Math.random() * 3;
        p.color = color;
        particleCount++;
    }
}

function updateParticles(dt) {
    const s = dt;
    for (let i = particleCount - 1; i >= 0; i--) {
        const p = particlePool[i];
        p.x += p.vx * s;
        p.y += p.vy * s;
        p.vy += 0.1 * s;
        p.life -= s;
        if (p.life <= 0) {
            particleCount--;
            if (i < particleCount) {
                const tmp = particlePool[i];
                particlePool[i] = particlePool[particleCount];
                particlePool[particleCount] = tmp;
            }
        }
    }
}

function drawParticles() {
    for (let i = 0; i < particleCount; i++) {
        const p = particlePool[i];
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

// ---------- WEATHER EFFECTS ----------
function initWeather() {
    weatherParticles = [];
    const count = lowFpsMode ? 20 : 60;
    for (let i = 0; i < count; i++) {
        weatherParticles.push({
            x: Math.random() * canvasW,
            y: Math.random() * canvasH,
            vx: 0, vy: 0,
            size: 1 + Math.random() * 2,
            alpha: 0.2 + Math.random() * 0.4
        });
    }
}

function updateWeather(dt) {
    for (const p of weatherParticles) {
        if (difficulty === 'easy') {
            // Gentle floating blue motes (upward)
            p.vy = -0.5 - Math.random() * 0.3;
            p.vx = Math.sin(Date.now() * 0.001 + p.x * 0.01) * 0.5;
        } else if (difficulty === 'medium') {
            // Rain streaks (fast downward)
            p.vy = 4 + Math.random() * 2;
            p.vx = -0.5;
        } else if (difficulty === 'hard') {
            // Fire embers (upward, orange)
            p.vy = -1 - Math.random() * 1.5;
            p.vx = Math.sin(Date.now() * 0.002 + p.y * 0.02) * 0.8;
        } else {
            // Blood drips (downward, red)
            p.vy = 1.5 + Math.random() * 1;
            p.vx = Math.sin(Date.now() * 0.001 + p.x * 0.005) * 0.3;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.y < -10) p.y = canvasH + 10;
        if (p.y > canvasH + 10) p.y = -10;
        if (p.x < -10) p.x = canvasW + 10;
        if (p.x > canvasW + 10) p.x = -10;
    }
}

function drawWeather() {
    for (const p of weatherParticles) {
        ctx.globalAlpha = p.alpha;
        if (difficulty === 'easy') {
            ctx.fillStyle = '#88ccff';
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        } else if (difficulty === 'medium') {
            ctx.strokeStyle = '#aabbdd';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - 1, p.y + 8); ctx.stroke();
        } else if (difficulty === 'hard') {
            ctx.fillStyle = Math.random() > 0.5 ? '#ff8833' : '#ffcc44';
            ctx.fillRect(p.x, p.y, p.size, p.size);
        } else {
            ctx.fillStyle = '#cc2222';
            ctx.fillRect(p.x, p.y, 1.5, p.size + 2);
        }
    }
    ctx.globalAlpha = 1;
}

// ---------- CONFETTI SYSTEM ----------
function spawnConfetti() {
    confetti = [];
    for (let i = 0; i < 80; i++) {
        confetti.push({
            x: Math.random() * canvasW,
            y: -Math.random() * canvasH,
            vx: (Math.random() - 0.5) * 3,
            vy: 1 + Math.random() * 3,
            w: 4 + Math.random() * 6,
            h: 2 + Math.random() * 4,
            rot: Math.random() * Math.PI * 2,
            rotV: (Math.random() - 0.5) * 0.2,
            color: ['#00e5ff', '#ff4081', '#ffd700', '#4caf50', '#cc99ff'][Math.floor(Math.random() * 5)]
        });
    }
    confettiTimer = 180; // 3 seconds at 60fps
}

function updateConfetti(dt) {
    if (confettiTimer <= 0) return;
    confettiTimer -= dt;
    for (const c of confetti) {
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.vy += 0.02 * dt;
        c.vx += (Math.random() - 0.5) * 0.1;
        c.rot += c.rotV * dt;
        if (c.y > canvasH + 20) { c.y = -20; c.x = Math.random() * canvasW; }
    }
}

function drawConfetti() {
    if (confettiTimer <= 0) return;
    const alpha = Math.min(1, confettiTimer / 30);
    for (const c of confetti) {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
    }
    ctx.globalAlpha = 1;
}

// ---------- DEATH ANIMATION ----------
function startDeathAnim(px, py) {
    deathAnim.active = true;
    deathAnim.frame = 0;
    const th = getTheme();
    const skinColors = getSkinColors(th);
    deathAnim.pieces = [
        { x: px, y: py - 24, vx: -2 + Math.random() * 4, vy: -4 - Math.random() * 3, w: 8, h: 8, rot: 0, rv: 0.2, color: skinColors.head },
        { x: px, y: py - 14, vx: -1 + Math.random() * 2, vy: -3 - Math.random() * 2, w: 12, h: 10, rot: 0, rv: -0.15, color: skinColors.body },
        { x: px - 6, y: py - 14, vx: -3 - Math.random() * 2, vy: -2 - Math.random() * 2, w: 4, h: 8, rot: 0, rv: 0.3, color: skinColors.arms },
        { x: px + 6, y: py - 14, vx: 3 + Math.random() * 2, vy: -2 - Math.random() * 2, w: 4, h: 8, rot: 0, rv: -0.3, color: skinColors.arms },
        { x: px - 3, y: py - 4, vx: -2 - Math.random(), vy: -1 - Math.random() * 2, w: 4, h: 10, rot: 0, rv: 0.25, color: skinColors.legs },
        { x: px + 3, y: py - 4, vx: 2 + Math.random(), vy: -1 - Math.random() * 2, w: 4, h: 10, rot: 0, rv: -0.25, color: skinColors.legs }
    ];
}

function updateDeathAnim(dt) {
    if (!deathAnim.active) return;
    deathAnim.frame += dt;
    if (deathAnim.frame > 24) { deathAnim.active = false; return; }
    for (const p of deathAnim.pieces) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 0.3 * dt;
        p.rot += p.rv * dt;
    }
}

function drawDeathAnim() {
    if (!deathAnim.active) return;
    const alpha = Math.max(0, 1 - deathAnim.frame / 24);
    for (const p of deathAnim.pieces) {
        ctx.save();
        ctx.translate(p.x - camera.x, p.y - camera.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
    }
    ctx.globalAlpha = 1;
}

// ---------- SCARF / CAPE TRAIL ----------
function updateScarfTrail() {
    if (gameState !== 'playing') return;
    const neckX = player.x + player.w / 2 - player.facing * 3;
    const neckY = player.y + 4;
    scarfTrail.unshift({ x: neckX, y: neckY });
    // Longer scarf at higher speed
    const maxLen = Math.min(14, 8 + Math.floor(Math.abs(player.vx) / 3));
    while (scarfTrail.length > maxLen) scarfTrail.pop();
}

function drawScarfTrail() {
    if (scarfTrail.length < 2) return;
    const skinC = getSkinColors(getTheme());
    const scarfColor = skinC.body || '#ff4081';
    const isDashing = player.isDashing;
    for (let i = 1; i < scarfTrail.length; i++) {
        const alpha = (1 - i / scarfTrail.length) * (isDashing ? 0.8 : 0.6);
        ctx.strokeStyle = isDashing ? '#ff4081' : scarfColor;
        ctx.lineWidth = (isDashing ? 4 : 3) - i * 0.25;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(scarfTrail[i - 1].x - camera.x, scarfTrail[i - 1].y - camera.y);
        ctx.lineTo(scarfTrail[i].x - camera.x, scarfTrail[i].y - camera.y);
        ctx.stroke();
    }
    // Glow during dash
    if (isDashing && scarfTrail.length > 1) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.15;
        ctx.strokeStyle = '#ff4081';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(scarfTrail[0].x - camera.x, scarfTrail[0].y - camera.y);
        for (let i = 1; i < Math.min(4, scarfTrail.length); i++) {
            ctx.lineTo(scarfTrail[i].x - camera.x, scarfTrail[i].y - camera.y);
        }
        ctx.stroke();
        ctx.restore();
    }
    ctx.globalAlpha = 1;
}

// ---------- PLAYER GLOW / AURA ----------
function drawPlayerGlow() {
    if (gameState !== 'playing' && gameState !== 'dead') return;
    const th = getTheme();
    const skinColors = getSkinColors(th);
    const pulse = Math.sin(Date.now() * 0.004) * 0.08 + 0.12;
    const sx = player.x - camera.x;
    const sy = player.y - camera.y;
    ctx.globalAlpha = pulse;
    ctx.fillStyle = skinColors.body;
    ctx.fillRect(sx - 4, sy - 4, player.w + 8, player.h + 8);
    ctx.globalAlpha = pulse * 0.5;
    ctx.fillRect(sx - 8, sy - 8, player.w + 16, player.h + 16);
    ctx.globalAlpha = 1;
}

// ---------- SKIN COLOR HELPER ----------
function getSkinColors(theme) {
    const skin = SKINS.find(s => s.id === currentSkin);
    if (!skin || skin.id === 'default' || !skin.body) return {
        body: theme.playerBody, head: theme.playerHead, arms: theme.playerArms, legs: theme.playerLegs
    };
    if (skin.body === 'rainbow') {
        const t = Date.now() * 0.003;
        const r = Math.floor(Math.sin(t) * 127 + 128);
        const g = Math.floor(Math.sin(t + 2) * 127 + 128);
        const b = Math.floor(Math.sin(t + 4) * 127 + 128);
        const c = '#' + r.toString(16).padStart(2,'0') + g.toString(16).padStart(2,'0') + b.toString(16).padStart(2,'0');
        return { body: c, head: c, arms: c, legs: c };
    }
    return { body: skin.body, head: skin.head, arms: skin.arms, legs: skin.legs };
}

// ---------- MINIMAP ----------
function drawMinimap() {
    if (!gameSettings.minimap || !goalZone) return;
    const mw = 120, mh = 40;
    const mx = canvasW - mw - 10;
    const my = canvasH - mh - 10;
    let minX = spawnPoint.x, maxX = goalZone.x + goalZone.w;
    let minY = 0, maxY = WORLD_H * TILE;
    const scaleX = mw / (maxX - minX);
    const scaleY = mh / (maxY - minY);
    const scale = Math.min(scaleX, scaleY);
    // Background
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#000';
    ctx.fillRect(mx - 1, my - 1, mw + 2, mh + 2);
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.strokeRect(mx - 1, my - 1, mw + 2, mh + 2);
    // Platforms
    ctx.fillStyle = '#666';
    for (const p of platforms) {
        const px = mx + (p.x - minX) * scale;
        const py = my + (p.y - minY) * scale;
        ctx.fillRect(px, py, Math.max(1, p.w * scale), Math.max(1, p.h * scale));
    }
    // Spikes (red dots)
    ctx.fillStyle = '#ff3333';
    for (const s of spikes) {
        const sx2 = mx + (s.x - minX) * scale;
        const sy2 = my + (s.y - minY) * scale;
        ctx.fillRect(sx2, sy2, Math.max(1, s.w * scale), 1);
    }
    // Checkpoints (green dots)
    ctx.fillStyle = '#00ffaa';
    for (const cp of checkpoints) {
        if (cp.activated) {
            const cx2 = mx + (cp.x - minX) * scale;
            const cy2 = my + (cp.y - minY) * scale;
            ctx.fillRect(cx2, cy2, 2, 2);
        }
    }
    // Orbs (gold dots)
    ctx.fillStyle = '#ffd700';
    for (const o of orbs) {
        if (!o.collected) {
            const ox = mx + (o.x - minX) * scale;
            const oy = my + (o.y - minY) * scale;
            ctx.fillRect(ox, oy, 2, 2);
        }
    }
    // Goal
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = '#00e5ff';
    const gx = mx + (goalZone.x - minX) * scale;
    const gy = my + (goalZone.y - minY) * scale;
    ctx.fillRect(gx - 1, gy - 1, 4, 4);
    // Player
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#ff4081';
    const ppx = mx + (player.x - minX) * scale;
    const ppy = my + (player.y - minY) * scale;
    ctx.fillRect(ppx - 1, ppy - 1, 3, 3);
    ctx.globalAlpha = 1;
}

// ---------- PROGRESS BAR ----------
function drawProgressBar() {
    if (!goalZone || endlessMode) return;
    const barW = canvasW * 0.35;
    const barH = 2;
    const barX = (canvasW - barW) / 2;
    const barY = canvasH - 3;
    const progress = Math.max(0, Math.min(1, player.x / goalZone.x));
    // Background
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barW, barH);
    // Fill — very subtle
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(barX, barY, barW * progress, barH);
    // Player dot
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#ff4081';
    ctx.fillRect(barX + barW * progress - 1, barY - 1, 3, barH + 2);
    ctx.globalAlpha = 1;
}

// ---------- POST-PROCESSING ----------
function drawPostProcessing() {
    // Per-theme color overlay
    let overlayColor;
    if (difficulty === 'easy') overlayColor = 'rgba(50, 100, 200, 0.03)';
    else if (difficulty === 'medium') overlayColor = 'rgba(100, 50, 200, 0.03)';
    else if (difficulty === 'hard') overlayColor = 'rgba(200, 100, 50, 0.04)';
    else overlayColor = 'rgba(200, 30, 30, 0.05)';
    ctx.fillStyle = overlayColor;
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Fake bloom around player
    if (gameState === 'playing' || gameState === 'dead') {
        const px = player.x - camera.x + player.w / 2;
        const py = player.y - camera.y + player.h / 2;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.04;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 40, 0, Math.PI * 2);
        ctx.fill();

        // Bloom around goal zone when close
        if (goalZone) {
            const gx = goalZone.x - camera.x + goalZone.w / 2;
            const gy = goalZone.y - camera.y + goalZone.h / 2;
            const distToGoal = Math.sqrt(Math.pow(px - gx, 2) + Math.pow(py - gy, 2));
            if (distToGoal < 250) {
                const bloomAlpha = (1 - distToGoal / 250) * 0.06;
                ctx.globalAlpha = bloomAlpha;
                ctx.fillStyle = '#00e5ff';
                ctx.beginPath();
                ctx.arc(gx, gy, 50, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();
    }

    // Dash chromatic aberration
    if (player.isDashing && gameState === 'playing') {
        ctx.save();
        ctx.globalAlpha = 0.03;
        ctx.drawImage(canvas, 2, 0, canvasW, canvasH, 0, 0, canvasW, canvasH);
        ctx.drawImage(canvas, -2, 0, canvasW, canvasH, 0, 0, canvasW, canvasH);
        ctx.restore();
    }
}

// ---------- ORB SYSTEM ----------
function orbHelper(tx, ty) {
    return { x: tx * TILE + TILE / 2, y: ty * TILE + TILE / 2, r: 8, collected: false, bobPhase: Math.random() * Math.PI * 2 };
}

function drawOrbs() {
    const px = player.x + player.w / 2;
    const py = player.y + player.h / 2;
    for (const o of orbs) {
        if (o.collected) continue;
        // Magnet effect: orbs drift toward player when close
        const mdx = px - o.x;
        const mdy = py - o.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 80 && mdist > 15) {
            const pull = 0.02 * (1 - mdist / 80);
            o.x += mdx * pull;
            o.y += mdy * pull;
        }
        const sx = o.x - camera.x;
        const sy = o.y - camera.y + Math.sin(Date.now() * 0.004 + o.bobPhase) * 4;
        if (sx < -20 || sx > canvasW + 20) continue;
        // Scale up when player is near
        const scaleFactor = mdist < 60 ? 1 + 0.4 * (1 - mdist / 60) : 1;
        const drawR = o.r * scaleFactor;
        // Glow
        ctx.globalAlpha = 0.2 + Math.sin(Date.now() * 0.005 + o.bobPhase) * 0.1;
        ctx.fillStyle = '#ffd700';
        ctx.beginPath(); ctx.arc(sx, sy, drawR + 6, 0, Math.PI * 2); ctx.fill();
        // Body
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffd700';
        ctx.beginPath(); ctx.arc(sx, sy, drawR, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(sx - 2, sy - 2, 3 * scaleFactor, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function checkOrbCollision() {
    for (const o of orbs) {
        if (o.collected) continue;
        const dx = (player.x + player.w / 2) - o.x;
        const dy = (player.y + player.h / 2) - o.y;
        if (Math.sqrt(dx * dx + dy * dy) < o.r + 12) {
            o.collected = true;
            const mult = getComboMultiplier();
            totalOrbs += mult;
            try { localStorage.setItem('parkour_total_orbs', totalOrbs); } catch(e) {}
            playSound('orb');
            spawnParticles(o.x, o.y, 8, '#ffd700', 3, 1);
            spawnFloatingText('+' + mult, o.x, o.y - 15, mult > 1 ? '#ff4081' : '#ffd700', mult > 1 ? 20 : 16);
            triggerCombo();
            checkAchievements();
        }
    }
}

// ---------- ACHIEVEMENTS SYSTEM ----------
function loadAchievements() {
    try {
        const saved = localStorage.getItem('parkour_achievements');
        if (saved) unlockedAchievements = JSON.parse(saved);
    } catch(e) { unlockedAchievements = {}; }
    try { totalOrbs = parseInt(localStorage.getItem('parkour_total_orbs') || '0'); } catch(e) {}
    try { totalWallJumps = parseInt(localStorage.getItem('parkour_wall_jumps') || '0'); } catch(e) {}
    try { totalDashes = parseInt(localStorage.getItem('parkour_dashes') || '0'); } catch(e) {}
    try {
        const sk = localStorage.getItem('parkour_unlocked_skins');
        if (sk) unlockedSkins = JSON.parse(sk);
    } catch(e) {}
    try {
        const cs = localStorage.getItem('parkour_skin');
        if (cs) currentSkin = cs;
    } catch(e) {}
    try {
        const gs = localStorage.getItem('parkour_settings');
        if (gs) gameSettings = { ...gameSettings, ...JSON.parse(gs) };
    } catch(e) {}
}

function unlockAchievement(id) {
    if (unlockedAchievements[id]) return;
    unlockedAchievements[id] = true;
    try { localStorage.setItem('parkour_achievements', JSON.stringify(unlockedAchievements)); } catch(e) {}
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return;
    // Show popup
    const el = document.getElementById('achievement-popup');
    if (el) {
        el.textContent = '[' + ach.icon + '] ' + ach.name;
        el.classList.remove('hidden', 'fading');
        achievementPopupTimer = 3; // 3 seconds
    }
    playSound('checkpoint');
}

function checkAchievements() {
    // First clear
    if (totalCompletions > 0) unlockAchievement('first_clear');
    // All clear
    let allDone = true;
    for (let i = 0; i < LEVELS.length; i++) { if (!bestTimes[i]) { allDone = false; break; } }
    if (allDone) unlockAchievement('all_clear');
    // Gold
    for (let i = 0; i < LEVELS.length; i++) { if (bestGrades[i] === 'gold') { unlockAchievement('gold_run'); break; } }
    // All gold
    let allGold = true;
    for (let i = 0; i < LEVELS.length; i++) { if (bestGrades[i] !== 'gold') { allGold = false; break; } }
    if (allGold && LEVELS.length > 0) unlockAchievement('all_gold');
    // No death
    if (gameState === 'complete' && deathCount === 0) unlockAchievement('no_death');
    // Speed demon
    if (gameState === 'complete' && currentLevel >= 0 && currentLevel < GRADE_THRESHOLDS.length) {
        if (levelTimer <= GRADE_THRESHOLDS[currentLevel].gold - 2) unlockAchievement('speed_demon');
    }
    // Combo
    if (comboCount >= 5) unlockAchievement('combo_5');
    if (comboCount >= 10) unlockAchievement('combo_10');
    // Streak
    if (currentStreak >= 3) unlockAchievement('streak_3');
    if (currentStreak >= 5) unlockAchievement('streak_5');
    // Deaths
    if (totalDeaths >= 100) unlockAchievement('deaths_100');
    // Wall jumps / dashes
    if (totalWallJumps >= 50) unlockAchievement('wall_master');
    if (totalDashes >= 50) unlockAchievement('dash_master');
    // Collector
    if (totalOrbs >= 50) unlockAchievement('collector');
    // Difficulty clears
    if (difficulty === 'hard' && gameState === 'complete') unlockAchievement('hard_clear');
    if (difficulty === 'extreme' && gameState === 'complete') unlockAchievement('extreme_clear');
    // Daily
    if (currentLevel === -2 && gameState === 'complete') unlockAchievement('daily_first');
    // Time
    if (totalTimePlayed >= 3600) unlockAchievement('time_1h');
    // All skins
    if (unlockedSkins.length >= SKINS.length) unlockAchievement('all_skins');
    // Endless milestones
    if (endlessBest >= 100) unlockAchievement('endless_100');
    if (endlessBest >= 500) unlockAchievement('endless_500');
    // Advanced combo
    if (comboCount >= 20) unlockAchievement('combo_20');
    // Orb milestones
    if (totalOrbs >= 200) unlockAchievement('orbs_200');
    // Death milestones
    if (totalDeaths >= 500) unlockAchievement('deaths_500');
}

function populateAchievements() {
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (const ach of ACHIEVEMENTS) {
        const card = document.createElement('div');
        const isUnlocked = unlockedAchievements[ach.id];
        card.className = 'achievement-card ' + (isUnlocked ? 'unlocked' : 'locked');
        card.innerHTML =
            '<div class="achievement-icon">' + ach.icon + '</div>' +
            '<div class="achievement-info">' +
            '<div class="achievement-name">' + ach.name + '</div>' +
            '<div class="achievement-desc">' + ach.desc + '</div>' +
            '</div>';
        grid.appendChild(card);
    }
}

// ---------- SKINS SYSTEM ----------
function populateSkins() {
    const grid = document.getElementById('skins-grid');
    const orbEl = document.getElementById('orb-count');
    if (!grid) return;
    if (orbEl) orbEl.textContent = 'Orbs: ' + totalOrbs;
    grid.innerHTML = '';
    for (const skin of SKINS) {
        const card = document.createElement('div');
        const owned = unlockedSkins.includes(skin.id);
        const equipped = currentSkin === skin.id;
        card.className = 'skin-card' + (equipped ? ' equipped' : '') + (!owned ? ' locked' : '');
        const previewColor = skin.body && skin.body !== 'rainbow' ? skin.body : (skin.body === 'rainbow' ? '#ff0000' : '#00e5ff');
        card.innerHTML =
            '<div class="skin-preview" style="background:' + previewColor + '"></div>' +
            '<div class="skin-name">' + skin.name + '</div>' +
            (owned ? (equipped ? '<div class="skin-status">EQUIPPED</div>' : '<div class="skin-status" style="color:#00e5ff">EQUIP</div>') :
            '<div class="skin-cost">' + skin.cost + ' orbs</div>');
        card.addEventListener('click', () => {
            if (owned) {
                currentSkin = skin.id;
                try { localStorage.setItem('parkour_skin', currentSkin); } catch(e) {}
                populateSkins();
                playSound('click');
            } else if (totalOrbs >= skin.cost) {
                totalOrbs -= skin.cost;
                unlockedSkins.push(skin.id);
                currentSkin = skin.id;
                try {
                    localStorage.setItem('parkour_total_orbs', totalOrbs);
                    localStorage.setItem('parkour_unlocked_skins', JSON.stringify(unlockedSkins));
                    localStorage.setItem('parkour_skin', currentSkin);
                } catch(e) {}
                populateSkins();
                playSound('complete');
                checkAchievements();
            } else {
                playSound('death');
            }
        });
        grid.appendChild(card);
    }
}

// ---------- DAILY CHALLENGE ----------
function getDailyDate() {
    return new Date().toISOString().split('T')[0];
}

function seededRandom(seed) {
    let s = 0;
    for (let i = 0; i < seed.length; i++) s = ((s << 5) - s + seed.charCodeAt(i)) | 0;
    return function() {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        return s / 0x7fffffff;
    };
}

function generateDailyLevel() {
    const dateStr = getDailyDate();
    const rng = seededRandom(dateStr);
    spawnPoint = { x: 2 * TILE, y: 16 * TILE };
    platforms = [plat(0, 18, 8, 2)];
    spikes = [];
    movingPlatforms = [];
    fallingPlatforms = [];
    boostPads = [];
    walls = [];
    checkpoints = [];
    orbs = [];
    let cx = 12;
    const segments = 8 + Math.floor(rng() * 6);
    for (let i = 0; i < segments; i++) {
        const type = Math.floor(rng() * 4);
        const w = 3 + Math.floor(rng() * 4);
        const y = 14 + Math.floor(rng() * 5);
        if (type === 0) {
            platforms.push(plat(cx, y, w, 1));
        } else if (type === 1) {
            platforms.push(plat(cx, y, w, 1));
            if (rng() > 0.5) spikes.push(spike(cx + 1, y - 1, Math.min(w - 2, 2), 1));
        } else if (type === 2) {
            movingPlatforms.push(moving(cx, y, w, 1, rng() > 0.5 ? 1 : 0, rng() > 0.5 ? 1 : 0, 0.5 + rng(), 2 + Math.floor(rng() * 3)));
        } else {
            fallingPlatforms.push(falling(cx, y, w, 1));
        }
        if (rng() > 0.6) orbs.push(orbHelper(cx + Math.floor(w / 2), y - 2));
        cx += w + 3 + Math.floor(rng() * 4);
    }
    platforms.push(plat(cx, 18, 6, 2));
    goalZone = goal(cx + 3, 17);
}

function startDailyChallenge() {
    showScreen('game');
    platforms = []; spikes = []; movingPlatforms = []; fallingPlatforms = [];
    boostPads = []; walls = []; goalZone = null; particleCount = 0;
    checkpoints = []; lastCheckpoint = null; ghostRecording = [];
    ghostFrame = 0; ghostRecordFrame = 0; deathCount = 0; orbs = [];
    currentLevel = -2; // Special index for daily
    generateDailyLevel();
    resetPlayer();
    levelTimer = 0;
    timerStarted = false;
    camera.x = player.x - canvasW / 2;
    camera.y = player.y - canvasH / 2;
    comboCount = 0; comboTimer = 0;
    ghostPlayback = [];
    const hudLevel = document.getElementById('hud-level');
    if (hudLevel) hudLevel.textContent = 'DAILY [' + getDiff().label + ']';
    const hudBest = document.getElementById('hud-best');
    const dailyBest = getDailyBest();
    if (hudBest) hudBest.textContent = dailyBest ? 'Best: ' + dailyBest.toFixed(2) + 's' : 'Best: --';
    const hudDeaths = document.getElementById('hud-deaths');
    if (hudDeaths) hudDeaths.textContent = 'Deaths: 0';
    gameState = 'playing';
    startMusic();
    startWind();
    initWeather();
    scarfTrail = [];
    deathReplayBuffer = [];
    document.getElementById('pause-overlay').classList.add('hidden');
    document.getElementById('complete-overlay').classList.add('hidden');
    document.getElementById('death-overlay').classList.add('hidden');
}

function getDailyBest() {
    try {
        const saved = localStorage.getItem('parkour_daily_' + getDailyDate());
        return saved ? parseFloat(saved) : null;
    } catch(e) { return null; }
}

// ---------- ENDLESS MODE ----------
function startEndlessMode() {
    endlessMode = true;
    endlessDistance = 0;
    try { endlessBest = parseFloat(localStorage.getItem('parkour_endless_best') || '0'); } catch(e) { endlessBest = 0; }
    showScreen('game');
    platforms = [plat(0, 18, 10, 2)];
    spikes = []; movingPlatforms = []; fallingPlatforms = [];
    boostPads = []; walls = []; goalZone = null; particleCount = 0;
    checkpoints = []; lastCheckpoint = null; orbs = [];
    currentLevel = -3;
    endlessLastX = 10 * TILE;
    for (let i = 0; i < 10; i++) generateEndlessSegment();
    spawnPoint = { x: 2 * TILE, y: 16 * TILE };
    resetPlayer();
    levelTimer = 0;
    timerStarted = false;
    camera.x = player.x - canvasW / 2;
    camera.y = player.y - canvasH / 2;
    comboCount = 0; comboTimer = 0;
    ghostPlayback = []; ghostRecording = [];
    const hudLevel = document.getElementById('hud-level');
    if (hudLevel) hudLevel.textContent = 'ENDLESS';
    const hudBest = document.getElementById('hud-best');
    if (hudBest) hudBest.textContent = endlessBest > 0 ? 'Best: ' + Math.floor(endlessBest) + 'm' : 'Best: --';
    const hudDeaths = document.getElementById('hud-deaths');
    if (hudDeaths) hudDeaths.textContent = 'Deaths: 0';
    const distEl = document.getElementById('hud-distance');
    if (distEl) { distEl.style.display = ''; distEl.textContent = '0m'; }
    deathCount = 0;
    gameState = 'playing';
    startMusic();
    startWind();
    initWeather();
    scarfTrail = [];
    deathReplayBuffer = [];
    document.getElementById('pause-overlay').classList.add('hidden');
    document.getElementById('complete-overlay').classList.add('hidden');
    document.getElementById('death-overlay').classList.add('hidden');
}

function generateEndlessSegment() {
    const rng = Math.random;
    const cx = endlessLastX / TILE;
    // Difficulty scales with distance: platforms shrink, gaps grow, more hazards
    const dist = Math.max(0, endlessDistance);
    const diffScale = Math.min(1, dist / 300); // maxes out at 300m
    const gap = 3 + Math.floor(rng() * (3 + diffScale * 3));
    const w = Math.max(2, Math.floor((5 - diffScale * 2) + rng() * (4 - diffScale * 2)));
    const y = 14 + Math.floor(rng() * 5);
    const type = Math.floor(rng() * (3 + (diffScale > 0.5 ? 1 : 0))); // more falling/moving at distance
    const startX = cx + gap;
    if (type === 0) {
        platforms.push(plat(startX, y, w, 1));
    } else if (type === 1) {
        movingPlatforms.push(moving(startX, y, w, 1, rng() > 0.5 ? 1 : 0, rng() > 0.5 ? 1 : 0, 0.5 + rng() * (1 + diffScale), 2 + Math.floor(diffScale * 2)));
    } else {
        fallingPlatforms.push(falling(startX, y, w, 1));
    }
    // More spikes as distance increases
    if (rng() > (0.7 - diffScale * 0.3)) spikes.push(spike(startX + Math.floor(w / 2), 19, 2, 1));
    if (rng() > 0.5) orbs.push(orbHelper(startX + Math.floor(w / 2), y - 2));
    endlessLastX = (startX + w) * TILE;
}

function updateEndless() {
    if (!endlessMode) return;
    endlessDistance = Math.max(endlessDistance, (player.x - 2 * TILE) / TILE);
    const distEl = document.getElementById('hud-distance');
    if (distEl) distEl.textContent = Math.floor(endlessDistance) + 'm';
    // Generate new segments as player approaches edge
    while (player.x > endlessLastX - canvasW * 2) {
        generateEndlessSegment();
    }
}

// ---------- DEATH REPLAY ----------
function recordDeathReplayFrame() {
    if (gameState !== 'playing') return;
    deathReplayBuffer.push({ x: player.x, y: player.y, state: getPlayerState(), facing: player.facing });
    if (deathReplayBuffer.length > 60) deathReplayBuffer.shift();
}

// ---------- PARALLAX CLOUDS ----------
function generateClouds() {
    bgClouds = [];
    for (let i = 0; i < 15; i++) {
        bgClouds.push({
            x: Math.random() * 5000,
            y: 20 + Math.random() * 200,
            w: 60 + Math.random() * 120,
            h: 15 + Math.random() * 25,
            speed: 0.1 + Math.random() * 0.2,
            alpha: 0.03 + Math.random() * 0.05
        });
    }
}

function drawClouds() {
    for (const c of bgClouds) {
        const sx = ((c.x - camera.x * 0.03) % 5000 + 5000) % 5000 - 500;
        const sy = c.y - camera.y * 0.01;
        ctx.globalAlpha = c.alpha;
        ctx.fillStyle = gameSettings.colorblind ? '#ffffff' : '#aabbcc';
        ctx.beginPath();
        ctx.ellipse(sx, sy, c.w / 2, c.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(sx - c.w * 0.25, sy + 3, c.w * 0.3, c.h * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(sx + c.w * 0.25, sy + 2, c.w * 0.35, c.h * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function updateClouds(dt) {
    for (const c of bgClouds) {
        c.x += c.speed * dt;
        if (c.x > 5500) c.x = -200;
    }
}

// ---------- COUNTDOWN SYSTEM ----------
function startCountdown(callback) {
    countdownActive = true;
    countdownTimer = 3.5;
    countdownLastSec = 4; // track which second we last beeped
    gameState = 'countdown';
    window._countdownCallback = callback;
}

let countdownLastSec = 4;

function updateCountdown(dt) {
    if (!countdownActive) return;
    const prevSec = Math.ceil(countdownTimer - 0.5);
    countdownTimer -= dt / 1000;
    const curSec = Math.ceil(countdownTimer - 0.5);
    // Beep on each new second (3, 2, 1)
    if (curSec < prevSec && curSec >= 1 && curSec <= 3) {
        playSound('countdown');
    }
    // "GO" beep
    if (prevSec >= 1 && curSec < 1 && countdownTimer > 0) {
        playSound('countdown', 'go');
    }
    if (countdownTimer <= 0) {
        countdownActive = false;
        gameState = 'playing';
        if (window._countdownCallback) {
            window._countdownCallback();
            window._countdownCallback = null;
        }
    }
}

function drawCountdown() {
    if (!countdownActive) return;
    const sec = Math.ceil(countdownTimer - 0.5);
    const text = sec >= 1 ? '' + sec : 'GO!';
    const scale = 1 + (countdownTimer % 1) * 0.3;
    ctx.save();
    ctx.translate(canvasW / 2, canvasH / 2);
    ctx.scale(scale, scale);
    ctx.font = 'bold 80px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = sec >= 1 ? '#ffffff' : '#00ff88';
    ctx.globalAlpha = 0.9;
    ctx.shadowColor = sec >= 1 ? '#00e5ff' : '#00ff88';
    ctx.shadowBlur = 20;
    ctx.fillText(text, 0, 0);
    ctx.shadowBlur = 0;
    ctx.restore();
    ctx.globalAlpha = 1;
}

// ---------- COLORBLIND / HIGH CONTRAST MODE ----------
function getColorblindColor(color) {
    if (!gameSettings.colorblind) return color;
    // Remap problematic colors: red→orange, green→blue, keep yellow/cyan
    const map = {
        '#ff4444': '#ff8800', '#ff0000': '#ff8800', // red → orange
        '#ff4081': '#ff8800', // pink → orange
        '#4caf50': '#4488ff', '#00ff88': '#4488ff', '#00ff66': '#4488ff', // green → blue
        '#00e5ff': '#00e5ff', '#ffd700': '#ffd700', // keep cyan and gold
    };
    return map[color] || color;
}

// ---------- ENDLESS MILESTONES ----------
let lastEndlessMilestone = 0;

function checkEndlessMilestones() {
    if (!endlessMode) return;
    const dist = Math.floor(endlessDistance);
    const milestone = Math.floor(dist / 50) * 50;
    if (milestone > 0 && milestone > lastEndlessMilestone) {
        lastEndlessMilestone = milestone;
        spawnFloatingText(milestone + 'm!', player.x + player.w / 2, player.y - 50, '#ffd700', 22);
        playSound('milestone');
        // Check for new best
        if (dist > endlessBest) {
            spawnFloatingText('NEW BEST!', player.x + player.w / 2, player.y - 80, '#ff4081', 18);
        }
    }
}

// ---------- SPLIT TIMER ----------
let splitTimes = [];
let lastCheckpointTime = 0;

function recordSplit(checkpointIndex) {
    const split = levelTimer - lastCheckpointTime;
    splitTimes.push({ cp: checkpointIndex, time: levelTimer, split: split });
    lastCheckpointTime = levelTimer;
    spawnFloatingText('+' + split.toFixed(2) + 's', player.x + player.w / 2, player.y - 40, '#00e5ff', 14);
}

// ---------- ANIMATED STAR REVEAL ----------
function animateStarReveal(grade) {
    const gradeEl = document.getElementById('complete-grade');
    if (!gradeEl) return;
    const starCount = grade === 'gold' ? 3 : grade === 'silver' ? 2 : grade === 'bronze' ? 1 : 0;
    gradeEl.innerHTML = '';
    const starClass = grade !== 'none' ? 'star-' + grade : 'star-none';
    for (let i = 0; i < starCount; i++) {
        setTimeout(() => {
            const span = document.createElement('span');
            span.className = starClass + ' star-reveal';
            span.textContent = '\u2605';
            span.style.animationDelay = '0s';
            gradeEl.appendChild(span);
            playSound('orb');
        }, (i + 1) * 350);
    }
    if (starCount === 0) {
        const span = document.createElement('span');
        span.className = 'star-none';
        span.textContent = '\u2606';
        gradeEl.appendChild(span);
    }
}

// ---------- SAVE EXPORT / IMPORT ----------
function exportSave() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('parkour_')) {
            keys.push({ key, value: localStorage.getItem(key) });
        }
    }
    const json = JSON.stringify(keys, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parkour-rush-save.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importSave(file) {
    if (!confirm('This will overwrite your current progress. Continue?')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            for (const item of data) {
                localStorage.setItem(item.key, item.value);
            }
            location.reload();
        } catch(err) {
            alert('Invalid save file.');
        }
    };
    reader.readAsText(file);
}

// ---------- ANIMATED TITLE ----------
function animateTitle() {
    const el = document.getElementById('animated-title');
    if (!el) return;
    const text1 = 'PARKOUR';
    const text2 = 'RUSH';
    let html = '';
    let delay = 0;
    for (let i = 0; i < text1.length; i++) {
        html += '<span class="title-letter" style="animation-delay:' + (delay * 0.06) + 's">' + text1[i] + '</span>';
        delay++;
    }
    html += '<span>';
    for (let i = 0; i < text2.length; i++) {
        html += '<span class="title-letter" style="animation-delay:' + (delay * 0.06) + 's">' + text2[i] + '</span>';
        delay++;
    }
    html += '</span>';
    el.innerHTML = html;
}

// ---------- PARALLAX CITYSCAPE ----------
// Background stars — generated once
let bgStars = [];
let bgBuildings1 = [];  // far layer, parallax 0.02
let bgBuildings2 = [];  // near layer, parallax 0.05

function generateBackground() {
    generateClouds();
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

    // Generate parallax buildings
    bgBuildings1 = [];
    bgBuildings2 = [];
    let x1 = 0;
    while (x1 < 4000) {
        const w = 30 + Math.random() * 60;
        const h = 40 + Math.random() * 120;
        bgBuildings1.push({ x: x1, w, h });
        x1 += w + Math.random() * 20;
    }
    let x2 = 0;
    while (x2 < 4000) {
        const w = 40 + Math.random() * 80;
        const h = 60 + Math.random() * 160;
        const windows = [];
        for (let wy = 8; wy < h - 10; wy += 12) {
            for (let wx = 6; wx < w - 6; wx += 10) {
                if (Math.random() < 0.4) {
                    windows.push({ x: wx, y: wy });
                }
            }
        }
        bgBuildings2.push({ x: x2, w, h, windows });
        x2 += w + Math.random() * 30;
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
        isBoosted: false, wasBoosted: false,
        wasOnGround: false,
        ridingPlatform: null
    };
    playerAnimFrame = 0;
    playerDistTraveled = 0;
    landTimer = 0;
    jumpSquashTimer = 0;
    dashTrail = [];
    scarfTrail = [];
    footstepDist = 0;
    deathReplayBuffer = [];
    deathAnim = { active: false, pieces: [], frame: 0 };
    deathZoom = 0;
    orbs = [];
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
    // ----- LEVEL 1: Tutorial Run (learn to move & jump) -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(95, 17);
        platforms = [
            plat(0, 18, 18, 2),
            plat(22, 18, 8, 2),
            plat(34, 18, 8, 2),
            plat(46, 16, 6, 1),
            plat(56, 18, 10, 2),
            plat(70, 17, 6, 1),
            plat(80, 18, 18, 2),
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
        goalZone = goal(90, 17);
        platforms = [
            plat(0, 18, 12, 2),
            plat(20, 18, 6, 2),    // landing after wall jump
            plat(20, 12, 6, 1),    // top of wall section
            plat(32, 18, 8, 2),
            plat(48, 18, 6, 2),
            plat(48, 12, 6, 1),
            plat(60, 18, 8, 2),
            plat(75, 18, 18, 2),
        ];
        walls = [
            wall(14, 10, 8),
            wall(17, 10, 8),
            wall(42, 10, 8),
            wall(45, 10, 8),
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
        goalZone = goal(105, 17);
        platforms = [
            plat(0, 18, 12, 2),
            plat(20, 18, 5, 2),
            plat(33, 18, 5, 2),
            plat(46, 18, 5, 2),
            plat(59, 16, 5, 1),
            plat(72, 18, 5, 2),
            plat(85, 18, 5, 2),
            plat(96, 18, 14, 2),
        ];
        boostPads = [
            boost(98, 17, 3, 1),
        ];
        spikes = [
            spike(14, 19, 4, 1),
            spike(27, 19, 4, 1),
            spike(40, 19, 4, 1),
            spike(53, 19, 4, 1),
        ];
        walls = [];
        movingPlatforms = [];
        fallingPlatforms = [];
        checkpoints = [];
    },

    // ----- LEVEL 4: Slide & Spikes -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(105, 17);
        platforms = [
            plat(0, 18, 22, 2),
            plat(8, 15, 12, 1),      // low ceiling to slide under
            plat(26, 18, 12, 2),
            plat(26, 14, 12, 1),      // another low ceiling
            plat(42, 18, 10, 2),
            plat(56, 18, 8, 2),
            plat(56, 15, 8, 1),
            plat(68, 18, 10, 2),
            plat(82, 18, 8, 2),
            plat(82, 15, 8, 1),
            plat(94, 18, 16, 2),
        ];
        spikes = [
            spike(10, 17, 8, 1),
            spike(28, 17, 8, 1),
            spike(58, 17, 4, 1),
            spike(84, 17, 4, 1),
        ];
        walls = [];
        movingPlatforms = [];
        fallingPlatforms = [];
        boostPads = [
            boost(43, 17, 3, 1),
            boost(69, 17, 3, 1),
        ];
        checkpoints = [
            checkpoint(44, 16),
        ];
    },

    // ----- LEVEL 5: Moving Platforms -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(100, 17);
        platforms = [
            plat(0, 18, 10, 2),
            plat(30, 16, 5, 1),     // rest stop
            plat(58, 16, 5, 1),     // rest stop
            plat(88, 18, 16, 2),    // final platform
        ];
        movingPlatforms = [
            moving(14, 17, 5, 1, 1, 0, 0.8, 4),
            moving(36, 16, 5, 1, 0, 1, 0.6, 3),
            moving(46, 14, 5, 1, 1, 0, 0.7, 4),
            moving(64, 16, 5, 1, 0, 1, 0.5, 3),
            moving(74, 15, 5, 1, 1, 0, 0.8, 4),
        ];
        spikes = [
            spike(10, 19, 78, 1),
        ];
        walls = [];
        fallingPlatforms = [];
        boostPads = [];
        checkpoints = [
            checkpoint(32, 14),
        ];
    },

    // ----- LEVEL 6: Falling Floor -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(90, 17);
        platforms = [
            plat(0, 18, 8, 2),
            plat(40, 18, 6, 2),    // safe landing midway
            plat(80, 18, 14, 2),   // final platform
        ];
        fallingPlatforms = [
            falling(10, 18, 4, 1),
            falling(16, 18, 4, 1),
            falling(22, 18, 4, 1),
            falling(28, 17, 4, 1),
            falling(34, 18, 4, 1),
            falling(48, 18, 4, 1),
            falling(54, 17, 4, 1),
            falling(60, 18, 4, 1),
            falling(66, 17, 4, 1),
            falling(72, 18, 4, 1),
        ];
        spikes = [
            spike(8, 19, 72, 1),
        ];
        walls = [];
        movingPlatforms = [];
        boostPads = [];
        checkpoints = [
            checkpoint(42, 16),
        ];
    },

    // ----- LEVEL 7: Wall Climb Challenge -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(100, 17);
        platforms = [
            plat(0, 18, 10, 2),
            plat(18, 18, 5, 2),    // landing between wall pairs
            plat(18, 10, 5, 1),    // top ledge
            plat(32, 18, 5, 2),
            plat(32, 10, 5, 1),
            plat(46, 18, 5, 2),
            plat(46, 10, 5, 1),
            plat(60, 18, 5, 2),
            plat(60, 10, 5, 1),
            plat(74, 18, 8, 2),
            plat(88, 18, 16, 2),
        ];
        walls = [
            wall(12, 8, 10),
            wall(15, 8, 10),
            wall(26, 8, 10),
            wall(29, 8, 10),
            wall(40, 8, 10),
            wall(43, 8, 10),
            wall(54, 8, 10),
            wall(57, 8, 10),
        ];
        spikes = [
            spike(10, 19, 5, 1),
            spike(24, 19, 5, 1),
            spike(38, 19, 5, 1),
            spike(52, 19, 5, 1),
        ];
        movingPlatforms = [];
        fallingPlatforms = [];
        boostPads = [];
        checkpoints = [
            checkpoint(34, 16),
        ];
    },

    // ----- LEVEL 8: Boost Rush -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(120, 17);
        platforms = [
            plat(0, 18, 12, 2),
            plat(18, 18, 8, 2),
            plat(32, 16, 5, 1),
            plat(43, 18, 8, 2),
            plat(57, 14, 5, 1),
            plat(68, 18, 10, 2),
            plat(84, 16, 5, 1),
            plat(95, 18, 8, 2),
            plat(109, 18, 16, 2),
        ];
        boostPads = [
            boost(4, 17, 3, 1),
            boost(20, 17, 3, 1),
            boost(44, 17, 3, 1),
            boost(70, 17, 3, 1),
            boost(96, 17, 3, 1),
        ];
        spikes = [
            spike(14, 19, 3, 1),
            spike(29, 19, 2, 1),
            spike(40, 19, 2, 1),
            spike(65, 19, 2, 1),
            spike(80, 19, 3, 1),
            spike(92, 19, 2, 1),
            spike(106, 19, 2, 1),
        ];
        walls = [];
        movingPlatforms = [];
        fallingPlatforms = [];
        checkpoints = [
            checkpoint(45, 16),
        ];
    },

    // ----- LEVEL 9: The Gauntlet -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(120, 17);
        platforms = [
            plat(0, 18, 8, 2),
            plat(16, 18, 5, 2),
            plat(16, 10, 5, 1),
            plat(30, 18, 5, 2),
            plat(42, 14, 5, 1),
            plat(55, 18, 5, 2),
            plat(68, 18, 5, 2),
            plat(68, 10, 5, 1),
            plat(82, 18, 5, 2),
            plat(95, 16, 5, 1),
            plat(108, 18, 16, 2),
        ];
        walls = [
            wall(10, 8, 10),
            wall(13, 8, 10),
            wall(62, 8, 10),
            wall(65, 8, 10),
        ];
        movingPlatforms = [
            moving(24, 16, 4, 1, 1, 0, 0.8, 3),
            moving(48, 14, 4, 1, 0, 1, 0.6, 3),
            moving(76, 14, 4, 1, 1, 0, 0.7, 3),
            moving(88, 16, 4, 1, 0, 1, 0.8, 4),
        ];
        fallingPlatforms = [
            falling(36, 16, 4, 1),
            falling(100, 14, 4, 1),
        ];
        spikes = [
            spike(8, 19, 100, 1),
            spike(44, 13, 2, 1),
        ];
        boostPads = [
            boost(17, 17, 2, 1),
            boost(56, 17, 2, 1),
        ];
        checkpoints = [
            checkpoint(56, 16),
        ];
    },

    // ----- LEVEL 10: Parkour Master -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(140, 17);
        platforms = [
            plat(0, 18, 8, 2),
            plat(16, 18, 5, 2),
            plat(16, 10, 5, 1),
            plat(28, 18, 5, 2),
            plat(42, 16, 5, 1),
            plat(55, 18, 5, 2),
            plat(55, 10, 5, 1),
            plat(68, 18, 5, 2),
            plat(80, 14, 5, 1),
            plat(92, 18, 5, 2),
            plat(92, 10, 5, 1),
            plat(106, 18, 5, 2),
            plat(118, 16, 5, 1),
            plat(130, 18, 16, 2),
        ];
        walls = [
            wall(10, 8, 10),
            wall(13, 8, 10),
            wall(49, 8, 10),
            wall(52, 8, 10),
            wall(86, 8, 10),
            wall(89, 8, 10),
        ];
        movingPlatforms = [
            moving(22, 16, 4, 1, 1, 0, 1, 3),
            moving(62, 14, 4, 1, 0, 1, 0.8, 3),
            moving(100, 14, 4, 1, 1, 0, 0.9, 3),
            moving(124, 14, 4, 1, 0, 1, 0.7, 4),
        ];
        fallingPlatforms = [
            falling(36, 16, 4, 1),
            falling(74, 16, 4, 1),
            falling(112, 16, 4, 1),
        ];
        spikes = [
            spike(0, 19, 150, 1),
            spike(44, 15, 2, 1),
            spike(82, 13, 1, 1),
        ];
        boostPads = [
            boost(29, 17, 2, 1),
            boost(69, 17, 2, 1),
            boost(107, 17, 2, 1),
        ];
        checkpoints = [
            checkpoint(56, 16),
            checkpoint(93, 16),
        ];
    },

    // ----- LEVEL 11: Sky Highway -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(120, 17);
        platforms = [
            plat(0, 18, 8, 2),
            plat(40, 14, 5, 1),    // mid rest
            plat(78, 14, 5, 1),    // mid rest
            plat(108, 18, 16, 2),
        ];
        movingPlatforms = [
            moving(10, 17, 5, 1, 1, 0, 0.8, 4),
            moving(22, 16, 5, 1, 0, 1, 0.6, 3),
            moving(32, 14, 5, 1, 1, 0, 0.7, 3),
            moving(48, 14, 5, 1, 0, 1, 0.5, 3),
            moving(58, 15, 5, 1, 1, 0, 0.8, 4),
            moving(68, 14, 5, 1, 0, 1, 0.6, 3),
            moving(86, 14, 5, 1, 1, 0, 0.7, 4),
            moving(96, 16, 5, 1, 0, 1, 0.6, 3),
        ];
        boostPads = [
            boost(2, 17, 3, 1),
        ];
        spikes = [
            spike(8, 19, 100, 1),
        ];
        walls = [];
        fallingPlatforms = [];
        checkpoints = [
            checkpoint(42, 12),
            checkpoint(80, 12),
        ];
    },

    // ----- LEVEL 12: The Pit -----
    function() {
        spawnPoint = { x: 3 * TILE, y: 2 * TILE };
        goalZone = goal(75, 17);
        platforms = [
            plat(0, 4, 10, 1),
            plat(18, 18, 5, 2),
            plat(32, 18, 5, 2),
            plat(46, 18, 5, 2),
            plat(60, 18, 20, 2),
        ];
        walls = [
            wall(12, 2, 8),
            wall(15, 2, 8),
            wall(24, 6, 8),
            wall(27, 6, 8),
            wall(38, 2, 8),
            wall(41, 2, 8),
            wall(52, 6, 8),
            wall(55, 6, 8),
        ];
        spikes = [
            spike(16, 19, 2, 1),
            spike(30, 19, 2, 1),
            spike(44, 19, 2, 1),
        ];
        movingPlatforms = [];
        fallingPlatforms = [];
        boostPads = [];
        checkpoints = [
            checkpoint(34, 16),
        ];
    },

    // ----- LEVEL 13: Mirror Run -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(120, 17);
        platforms = [
            plat(0, 18, 10, 2),
            plat(14, 18, 14, 2),
            plat(14, 15, 14, 1),    // low ceiling
            plat(32, 18, 8, 2),
            plat(44, 18, 16, 2),
            plat(44, 14, 16, 1),    // low ceiling
            plat(64, 18, 8, 2),
            plat(76, 18, 12, 2),
            plat(76, 15, 12, 1),    // low ceiling
            plat(92, 18, 8, 2),
            plat(104, 18, 20, 2),
        ];
        spikes = [
            spike(16, 17, 10, 1),
            spike(46, 17, 12, 1),
            spike(78, 17, 8, 1),
        ];
        boostPads = [
            boost(33, 17, 3, 1),
            boost(65, 17, 3, 1),
            boost(93, 17, 3, 1),
        ];
        walls = [];
        movingPlatforms = [];
        fallingPlatforms = [];
        checkpoints = [
            checkpoint(46, 16),
            checkpoint(78, 16),
        ];
    },

    // ----- LEVEL 14: Momentum -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(135, 17);
        platforms = [
            plat(0, 18, 8, 2),
            plat(16, 18, 4, 1),
            plat(27, 16, 4, 1),
            plat(38, 14, 4, 1),
            plat(49, 16, 4, 1),
            plat(60, 18, 6, 2),
            plat(74, 18, 4, 1),
            plat(85, 16, 4, 1),
            plat(96, 14, 4, 1),
            plat(107, 16, 4, 1),
            plat(118, 18, 22, 2),
        ];
        boostPads = [
            boost(2, 17, 3, 1),
            boost(17, 17, 2, 1),
            boost(28, 15, 2, 1),
            boost(62, 17, 3, 1),
            boost(75, 17, 2, 1),
            boost(86, 15, 2, 1),
            boost(97, 13, 2, 1),
        ];
        spikes = [
            spike(10, 19, 50, 1),
            spike(68, 19, 50, 1),
        ];
        walls = [];
        movingPlatforms = [];
        fallingPlatforms = [];
        checkpoints = [
            checkpoint(62, 16),
        ];
    },

    // ----- LEVEL 15: Final Rush -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(180, 17);
        platforms = [
            plat(0, 18, 8, 2),
            // Wall section 1
            plat(18, 18, 5, 2),
            plat(18, 10, 5, 1),
            // Dash gap
            plat(32, 18, 5, 2),
            // Moving section
            plat(54, 16, 5, 1),
            // Wall section 2
            plat(68, 18, 5, 2),
            plat(68, 10, 5, 1),
            // Falling section
            plat(82, 18, 5, 2),
            // Slide section
            plat(104, 18, 14, 2),
            plat(104, 15, 14, 1),
            // Boost rush
            plat(122, 18, 6, 2),
            plat(135, 16, 4, 1),
            plat(146, 18, 6, 2),
            // Final stretch
            plat(160, 18, 24, 2),
        ];
        walls = [
            wall(12, 8, 10),
            wall(15, 8, 10),
            wall(62, 8, 10),
            wall(65, 8, 10),
        ];
        movingPlatforms = [
            moving(38, 16, 5, 1, 1, 0, 0.8, 3),
            moving(46, 14, 5, 1, 0, 1, 0.7, 3),
            moving(152, 16, 4, 1, 0, 1, 0.6, 3),
        ];
        fallingPlatforms = [
            falling(88, 16, 4, 1),
            falling(94, 17, 4, 1),
            falling(100, 16, 4, 1),
        ];
        boostPads = [
            boost(33, 17, 2, 1),
            boost(83, 17, 2, 1),
            boost(123, 17, 3, 1),
            boost(147, 17, 3, 1),
        ];
        spikes = [
            spike(8, 19, 160, 1),
            spike(106, 17, 10, 1),
            spike(132, 19, 2, 1),
            spike(143, 19, 2, 1),
        ];
        checkpoints = [
            checkpoint(34, 16),
            checkpoint(83, 16),
            checkpoint(123, 16),
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
    // Auto-generate a computer run from the level's platform layout
    // This creates a path that runs across all platforms toward the goal
    const T = TILE;

    // Temporarily load the level to get geometry
    const savedPlats = [...platforms];
    const savedWalls = [...walls];
    const savedSpawn = spawnPoint ? { ...spawnPoint } : null;
    const savedGoal = goalZone ? { ...goalZone } : null;
    const savedSpikes = [...spikes];
    const savedMoving = [...movingPlatforms];
    const savedFalling = [...fallingPlatforms];
    const savedBoosts = [...boostPads];
    const savedCheckpoints = [...checkpoints];
    const savedOrbs = [...orbs];

    if (levelIndex < 0 || levelIndex >= LEVELS.length) {
        return { time: 30, username: 'COMPUTER', replay: [] };
    }

    // Load the level to get its platforms
    platforms = []; spikes = []; movingPlatforms = []; fallingPlatforms = [];
    boostPads = []; walls = []; checkpoints = []; orbs = [];
    LEVELS[levelIndex]();

    // Collect platform surfaces as waypoints
    const allPlats = [...platforms, ...movingPlatforms.map(mp => ({ x: mp.startX, y: mp.startY, w: mp.w, h: mp.h }))];
    allPlats.sort((a, b) => a.x - b.x);

    const waypoints = [];
    const startX = spawnPoint ? spawnPoint.x : 2 * T;
    const startY = spawnPoint ? spawnPoint.y : 16 * T;
    const endX = goalZone ? goalZone.x : 100 * T;
    const endY = goalZone ? goalZone.y : 16 * T;

    waypoints.push({ x: startX, y: startY, state: 'idle', frame: 0 });

    let frame = 0;
    let lastX = startX;
    let lastY = startY;

    // Visit each platform
    for (const p of allPlats) {
        const px = p.x + p.w / 2;
        const py = p.y - PLAYER_H;
        if (px <= lastX + T) continue; // skip if behind us

        const dist = Math.abs(px - lastX) / T;
        const yDiff = Math.abs(py - lastY) / T;
        const frameStep = Math.max(8, Math.round(dist * 2 + yDiff * 1.5));
        frame += frameStep;

        // Determine state based on movement
        let state = 'running';
        if (py < lastY - 2 * T) state = 'jumping';
        else if (py > lastY + 2 * T) state = 'falling';
        else if (dist > 6) state = 'dashing';

        waypoints.push({ x: px, y: py, state: state, frame: frame });
        lastX = px;
        lastY = py;
    }

    // Add goal
    const finalDist = Math.abs(endX - lastX) / T;
    frame += Math.max(6, Math.round(finalDist * 2));
    waypoints.push({ x: endX, y: endY, state: 'running', frame: frame });
    frame += 4;
    waypoints.push({ x: endX, y: endY, state: 'idle', frame: frame });

    const totalFrames = frame;
    const totalTime = +(totalFrames / 20).toFixed(1);

    // Restore level state
    platforms = savedPlats; walls = savedWalls; spawnPoint = savedSpawn;
    goalZone = savedGoal; spikes = savedSpikes; movingPlatforms = savedMoving;
    fallingPlatforms = savedFalling; boostPads = savedBoosts;
    checkpoints = savedCheckpoints; orbs = savedOrbs;

    const replay = buildReplayPath(waypoints, totalFrames);
    return { time: totalTime, username: 'COMPUTER', replay: replay };
}

function generateComputerRunLegacy(levelIndex) {
    // Legacy manual waypoints - kept as fallback
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
    // Scale thresholds by difficulty: easier = more lenient, harder = stricter
    const scale = difficulty === 'easy' ? 1.3 : difficulty === 'hard' ? 0.85 : difficulty === 'extreme' ? 0.7 : 1.0;
    if (time <= t.gold * scale) return 'gold';
    if (time <= t.silver * scale) return 'silver';
    if (time <= t.bronze * scale) return 'bronze';
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
    particleCount = 0;
    checkpoints = [];
    lastCheckpoint = null;
    ghostRecording = [];
    ghostFrame = 0;
    ghostPlaybackCounter = 0;
    ghostRecordFrame = 0;
    deathCount = 0;

    timerStarted = false;
    goalProximityNotified = false;
    dashReadyNotified = true;
    currentLevel = index;
    orbs = [];
    LEVELS[index]();

    // Add orbs to levels (3-5 per level)
    if (index >= 0 && index < LEVELS.length) {
        const orbPositions = [];
        // Place orbs above platforms at intervals
        const sortedPlats = [...platforms].sort((a, b) => a.x - b.x);
        const step = Math.max(1, Math.floor(sortedPlats.length / 5));
        for (let i = step; i < sortedPlats.length && orbPositions.length < 5; i += step) {
            const pl = sortedPlats[i];
            orbPositions.push(orbHelper(Math.floor(pl.x / TILE) + Math.floor(pl.w / TILE / 2), Math.floor(pl.y / TILE) - 3));
        }
        orbs = orbPositions;
    }

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
    confetti = [];
    confettiTimer = 0;
    initWeather();
    startWind();

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

    if (gameSettings.hints !== false && level < TUTORIAL_HINTS.length && !tutorialShown[level]) {
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

    if (!p.isDashing && !p.isSliding && !p.isBoosted && p.climbTimer <= 0) {
        p.vx = inputX * getCheatRunSpeed();
        if (inputX !== 0) p.facing = inputX;
    }
    p.isBoosted = false;

    // Track distance for run animation
    playerDistTraveled += Math.abs(p.vx) * s;

    // Footstep sounds
    if (p.onGround && Math.abs(p.vx) > 1) {
        footstepDist += Math.abs(p.vx) * s;
        if (footstepDist >= 12) {
            footstepDist = 0;
            playSound('footstep');
            // Running dust particles (every ~8px)
            if (gameSettings.particles) {
                spawnParticles(p.x + p.w / 2, p.y + p.h, 1, '#888', 2, 0.3);
            }
        }
    } else {
        footstepDist = 0;
    }

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
        totalDashes++;
        try { localStorage.setItem('parkour_dashes', totalDashes); } catch(e) {}
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

    // Update dash HUD with visual cooldown bar
    const dashBarFill = document.getElementById('dash-bar-fill');
    if (dashBarFill) {
        const maxCd = getDiff().dashCooldown || DASH_COOLDOWN;
        const pct = p.dashCooldown > 0 ? Math.max(0, 1 - p.dashCooldown / maxCd) * 100 : 100;
        dashBarFill.style.width = pct + '%';
        dashBarFill.style.background = pct >= 100 ? '#00e5ff' : '#ff8800';
        // Dash ready notification
        if (pct >= 100 && !dashReadyNotified) {
            dashReadyNotified = true;
            dashBarFill.classList.add('dash-ready-pulse');
            setTimeout(() => dashBarFill.classList.remove('dash-ready-pulse'), 400);
        }
        if (pct < 100) dashReadyNotified = false;
    }

    // ---- Slide ----
    const slideHeld = keys['KeyS'] || keys['ArrowDown'] || keys['touchSlide'];
    // Start slide when key first pressed while moving on ground
    if (slideHeld && !p.isSliding && p.onGround && Math.abs(p.vx) > 1) {
        p.isSliding = true;
        p.slideDir = Math.sign(p.vx);
        p.y += PLAYER_H - PLAYER_H_SLIDE;
        p.h = PLAYER_H_SLIDE;
        playSound('slide');
        triggerCombo();
    }

    if (p.isSliding) {
        // Continue sliding while key is held
        if (slideHeld) {
            p.vx = SLIDE_SPEED * (p.slideDir || p.facing);
            if (p.onGround) {
                spawnParticles(p.x + p.w / 2, p.y + p.h, 1, '#00e5ff', 2, 0.3);
            }
        } else {
            // Key released — try to stand up
            p.isSliding = false;
            const testY = p.y - (PLAYER_H - PLAYER_H_SLIDE);
            const testBox = { x: p.x, y: testY, w: p.w, h: PLAYER_H };
            let blocked = false;
            for (const sol of getAllSolids()) {
                if (aabb(testBox, sol)) { blocked = true; break; }
            }
            if (!blocked) {
                p.y = testY;
                p.h = PLAYER_H;
            } else {
                // Can't stand up — stay sliding until there's room
                p.isSliding = true;
                p.vx = SLIDE_SPEED * (p.slideDir || p.facing);
            }
        }
    }

    // ---- Ledge Climb ----
    if ((keys['KeyE'] || keys['touchClimb']) && p.canClimb && p.climbTimer <= 0 && !p.onGround) {
        p.climbTimer = 10;
        p.vy = -6;
        p.vx = p.facing * 3;
        playSound('walljump');
        spawnParticles(p.x + p.w / 2, p.y, 4, '#ffd700', 2, 0.8);
        triggerCombo();
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

    const jumpPressed = (keys['KeyW'] || keys['Space'] || keys['ArrowUp'] || keys['touchJump']) &&
        !(prevKeys['KeyW'] || prevKeys['Space'] || prevKeys['ArrowUp'] || prevKeys['touchJump']);
    if (jumpPressed) {
        p.jumpBuffer = cJumpBuffer;
    }
    if (p.jumpBuffer > 0) p.jumpBuffer -= s;

    // ---- Jump (immediate on press frame if possible, otherwise buffered) ----
    if ((jumpPressed || p.jumpBuffer > 0) && p.coyoteTimer > 0 && !p.isDashing) {
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
            totalWallJumps++;
            try { localStorage.setItem('parkour_wall_jumps', totalWallJumps); } catch(e) {}
        } else if (p.onWallRight) {
            p.vx = -WALL_JUMP_X;
            p.vy = WALL_JUMP_Y;
            p.facing = -1;
            p.jumpBuffer = 0;
            jumpSquashTimer = 4;
            playSound('walljump');
            spawnParticles(p.x + p.w, p.y + p.h / 2, 8, '#00ff88', 3, 1);
            triggerCombo();
            totalWallJumps++;
            try { localStorage.setItem('parkour_wall_jumps', totalWallJumps); } catch(e) {}
        }
    }

    // ---- Wall slide ----
    if (!p.onGround && (p.onWallLeft || p.onWallRight) && p.vy > 1 && !p.isDashing) {
        p.vy = Math.min(p.vy, getCheatWallSlideMax());
        if (Math.random() < 0.3) {
            const wx = p.onWallLeft ? p.x : p.x + p.w;
            spawnParticles(wx, p.y + p.h / 2, 1, '#aaa', 1, 0.3);
        }
        // Wall-slide sparks (gold/orange)
        if (gameSettings.particles && Math.random() < 0.4) {
            const wx = p.onWallLeft ? p.x : p.x + p.w;
            const sparkColors = ['#ffd700', '#ff8c00', '#ffaa33'];
            spawnParticles(wx, p.y + p.h * 0.7, 1, sparkColors[Math.floor(Math.random() * 3)], 2, 0.5);
        }
        startWallSlideSound();
    } else {
        stopWallSlideSound();
    }

    // ---- Squash & stretch timers ----
    if (jumpSquashTimer > 0) jumpSquashTimer -= s;
    if (landTimer > 0) landTimer -= s;

    // ---- Boost pads (before collision so velocity is used this frame) ----
    for (const bp of boostPads) {
        if (aabb({ x: p.x, y: p.y, w: p.w, h: p.h }, bp)) {
            p.vx = DASH_SPEED * bp.dir;
            p.facing = bp.dir;
            p.isBoosted = true;
            if (!p.wasBoosted) {
                playSound('boost');
                spawnParticles(bp.x + bp.w / 2, bp.y, 8, '#ffd700', 4, 1);
                triggerCombo();
            }
        }
    }
    p.wasBoosted = p.isBoosted;

    // ---- Move & collide ----
    const solids = getAllSolids();

    // Horizontal — substep to prevent tunneling through thin walls
    const hMove = p.vx * s;
    const hSteps = Math.max(1, Math.ceil(Math.abs(hMove) / (TILE * 0.5)));
    const hStep = hMove / hSteps;
    p.onWallLeft = false;
    p.onWallRight = false;
    p.canClimb = false;

    for (let hsi = 0; hsi < hSteps; hsi++) {
        p.x += hStep;
        const pBox = { x: p.x, y: p.y, w: p.w, h: p.h };
        let hitWall = false;
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
                if (p.isSliding) {
                    p.isSliding = false;
                    p.slideTimer = 0;
                    p.y -= (PLAYER_H - PLAYER_H_SLIDE);
                    p.h = PLAYER_H;
                }
                p.vx = 0;
                hitWall = true;
                break;
            }
        }
        if (hitWall) break;
    }
    const pBox = { x: p.x, y: p.y, w: p.w, h: p.h };

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
                    const impactForce = Math.min(p.vy / MAX_FALL, 1);
                    const particleCount = 6 + Math.floor(impactForce * 8);
                    spawnParticles(p.x + p.w / 2, p.y + p.h, particleCount, '#fff', 3 + impactForce * 2, 0.8 + impactForce * 0.5);
                    landTimer = 4 + Math.floor(impactForce * 3);
                    if (impactForce > 0.7 && gameSettings.shake) screenShake = Math.max(screenShake, 3 + impactForce * 4);
                    playSound('land');
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

    // ---- Checkpoint collision ----
    for (let cpIdx = 0; cpIdx < checkpoints.length; cpIdx++) {
        const cp = checkpoints[cpIdx];
        if (!cp.activated && aabb({ x: p.x, y: p.y, w: p.w, h: p.h }, cp)) {
            cp.activated = true;
            lastCheckpoint = { x: cp.x, y: cp.y - PLAYER_H + TILE };
            playSound('checkpoint');
            spawnParticles(cp.x + cp.w / 2, cp.y, 12, '#00ffaa', 4, 1.5);
            recordSplit(cpIdx);
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

    // ---- Orb collision ----
    checkOrbCollision();

    // ---- Death replay recording ----
    recordDeathReplayFrame();

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
        // Pop animation
        hudCombo.classList.remove('pop');
        void hudCombo.offsetWidth; // force reflow
        hudCombo.classList.add('pop');
        setTimeout(() => hudCombo.classList.remove('pop'), 200);
        // Floating text for combo milestones
        if (comboCount % 5 === 0) {
            spawnFloatingText('COMBO x' + comboCount + '!', player.x + player.w / 2, player.y - 30, '#ffd700', 18);
            playSound('milestone');
        }
    }
}

// Combo orb multiplier: higher combos earn bonus orbs
function getComboMultiplier() {
    if (comboCount >= 10) return 3;
    if (comboCount >= 5) return 2;
    return 1;
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
        // Use smooth sine interpolation (unchanged)
        mp.t += mp.speed * 0.02 * dt;
        const targetX = mp.startX + Math.sin(mp.t) * mp.range * mp.dx;
        const targetY = mp.startY + Math.sin(mp.t) * mp.range * mp.dy;
        // Smooth lerp to target to avoid jerk at direction changes
        mp.x += (targetX - mp.x) * 0.4;
        mp.y += (targetY - mp.y) * 0.4;

        // Trail
        mp.trail.push({ x: mp.x, y: mp.y });
        if (mp.trail.length > 5) mp.trail.shift();

        // Carry player riding this platform
        if (player.ridingPlatform === mp) {
            const dx = mp.x - prevX;
            const dy = mp.y - prevY;
            player.x += dx;
            player.y += dy;
            // After carrying, resolve any overlap with static platforms
            const pBox = { x: player.x, y: player.y, w: player.w, h: player.h };
            for (const plat of platforms) {
                if (aabb(pBox, plat)) {
                    // Push player out of static platform
                    if (dy > 0) {
                        player.y = plat.y - player.h;
                    } else if (dy < 0) {
                        player.y = plat.y + plat.h;
                    }
                    if (dx > 0) {
                        player.x = plat.x - player.w;
                    } else if (dx < 0) {
                        player.x = plat.x + plat.w;
                    }
                    pBox.x = player.x;
                    pBox.y = player.y;
                }
            }
            for (const w of walls) {
                if (aabb(pBox, w)) {
                    if (dx > 0) player.x = w.x - player.w;
                    else if (dx < 0) player.x = w.x + w.w;
                    pBox.x = player.x;
                }
            }
        }

        // Store velocity for arrow indicator
        mp.vx = mp.x - prevX;
        mp.vy = mp.y - prevY;
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
                    spawnParticles(fp.x + fp.w / 2, fp.y + fp.h / 2, 10, '#7a5a3a', 4, 1.5);
                    spawnParticles(fp.x + fp.w * 0.2, fp.y, 4, '#8a6a4a', 3, 1);
                    spawnParticles(fp.x + fp.w * 0.8, fp.y, 4, '#6a4a2a', 3, 1);
                    if (gameSettings.shake) screenShake = Math.max(screenShake, 4);
                    playSound('land');
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
    saveStats();
    if (gameSettings.shake) screenShake = 12;
    playSound('death');
    spawnParticles(player.x + player.w / 2, player.y + player.h / 2, 20, '#ff4444', 6, 2);
    triggerScreenFlash('#ff0000', 0.4, 0.3);
    stopWallSlideSound();

    // Death animation
    startDeathAnim(player.x + player.w / 2, player.y + player.h / 2);
    deathZoom = 20; // zoom effect frames

    // Break streak
    if (currentStreak >= 2) {
        spawnFloatingText('STREAK BROKEN!', player.x + player.w / 2, player.y - 20, '#ff4444', 18);
    }
    currentStreak = 0;
    saveStreaks();
    updateStreakHUD();

    const hudDeaths = document.getElementById('hud-deaths');
    if (hudDeaths) hudDeaths.textContent = 'Deaths: ' + deathCount;

    // Endless mode death
    if (endlessMode) {
        const dist = Math.floor(endlessDistance);
        if (dist > endlessBest) {
            endlessBest = dist;
            try { localStorage.setItem('parkour_endless_best', endlessBest); } catch(e) {}
        }
    }

    // Editor test mode: auto-respawn (can't use loadLevel for custom levels)
    if (currentLevel === -1) {
        setTimeout(() => {
            if (gameState === 'dead') {
                buildEditorLevel();
                resetPlayer();
                camera.x = player.x - canvasW / 2;
                camera.y = player.y - canvasH / 2;
                gameState = 'playing';
            }
        }, 500);
        return;
    }

    // Practice mode: auto-respawn quickly
    if (practiceMode) {
        setTimeout(() => {
            if (gameState === 'dead') {
                loadLevel(currentLevel);
                gameState = 'playing';
            }
        }, 300);
        return;
    }

    // If we have a checkpoint, auto-retry from there
    if (lastCheckpoint) {
        setTimeout(() => {
            if (gameState === 'dead') {
                respawnAtCheckpoint();
            }
        }, 600);
    } else {
        // Near-miss death indicator / endless score
        const deathProgress = document.getElementById('death-progress');
        if (deathProgress) {
            if (endlessMode) {
                const dist = Math.floor(endlessDistance);
                const isNewBest = dist > endlessBest;
                endlessRuns++;
                endlessTotalDist += dist;
                const lines = [];
                lines.push('DISTANCE: ' + dist + 'm');
                if (isNewBest) lines.push('NEW BEST!');
                else if (endlessBest > 0) lines.push('Best: ' + endlessBest + 'm');
                lines.push('Time: ' + levelTimer.toFixed(1) + 's');
                lines.push('Deaths this session: ' + deathCount);
                if (endlessRuns > 1) lines.push('Avg: ' + Math.round(endlessTotalDist / endlessRuns) + 'm/run');
                deathProgress.innerHTML = lines.join('<br>');
                deathProgress.className = 'death-progress pulse';
            } else if (goalZone) {
                const progress = Math.min(100, Math.max(0, Math.round(player.x / goalZone.x * 100)));
                let progressText = '';
                if (progress > 70) {
                    progressText = progress + '% COMPLETE - SO CLOSE!';
                    deathProgress.className = 'death-progress pulse';
                } else if (progress > 30) {
                    progressText = progress + '% COMPLETE';
                    deathProgress.className = 'death-progress';
                } else {
                    deathProgress.className = 'death-progress';
                }
                // Show time comparison to best
                const best = bestTimes[currentLevel];
                if (best && levelTimer > 0) {
                    const behind = levelTimer - best;
                    if (behind > 0) progressText += (progressText ? ' | ' : '') + behind.toFixed(1) + 's behind best';
                }
                deathProgress.textContent = progressText;
            }
        }

        document.getElementById('death-overlay').classList.remove('hidden');

        // Auto-restart countdown (respects settings)
        autoRestartTimer = 1.5;
        autoRestartActive = gameSettings.autoRestart !== false;
        const autoEl = document.getElementById('death-auto-restart');
        if (autoEl) autoEl.textContent = 'Auto-restart in 1.5s...';
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
    playSound('victory');
    stopMusic(true);

    const time = levelTimer;
    const prevBest = bestTimes[currentLevel];
    const isNewRecord = !prevBest || time < prevBest;

    // Track stats
    totalTimePlayed += time;
    totalCompletions++;
    saveStats();

    // Streak
    if (deathCount === 0) {
        currentStreak++;
        if (currentStreak > bestStreak) bestStreak = currentStreak;
        saveStreaks();
        if (currentStreak >= 2) {
            spawnFloatingText('STREAK: ' + currentStreak + '!', player.x + player.w / 2, player.y - 40, '#ff4081', 20);
        }
    } else {
        currentStreak = 0;
        saveStreaks();
    }

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

    // Update complete overlay with count-up animation
    const completeTimeEl = document.getElementById('complete-time');
    if (completeTimeEl) {
        let countUp = 0;
        const countUpInterval = setInterval(() => {
            countUp += time / 30; // 30 steps over ~500ms
            if (countUp >= time) {
                countUp = time;
                clearInterval(countUpInterval);
            }
            completeTimeEl.textContent = 'Time: ' + countUp.toFixed(2) + 's';
        }, 16);
    }
    const displayBest = currentLevel === -2 ? getDailyBest() : bestTimes[currentLevel];
    document.getElementById('complete-best').textContent = displayBest ? 'Best: ' + displayBest.toFixed(2) + 's' : '';

    const deathEl = document.getElementById('death-count');
    if (deathEl) deathEl.textContent = deathCount > 0 ? 'Deaths: ' + deathCount : '';

    // Grade display — animated star reveal
    animateStarReveal(grade);

    const newRecordEl = document.getElementById('complete-new-record');
    if (isNewRecord) {
        newRecordEl.classList.remove('hidden');
        triggerScreenFlash('#ffd700', 0.5, 0.5);
        spawnFloatingText('NEW RECORD!', player.x + player.w / 2, player.y - 60, '#ffd700', 22);
        // Show time delta
        if (prevBest) {
            const delta = time - prevBest;
            spawnFloatingText(delta.toFixed(2) + 's', player.x + player.w / 2, player.y - 30, '#4caf50', 16);
        }
    } else {
        newRecordEl.classList.add('hidden');
        triggerScreenFlash('#ffffff', 0.3, 0.4);
        if (prevBest) {
            const delta = time - prevBest;
            const sign = delta > 0 ? '+' : '';
            const col = delta > 0 ? '#ff4444' : '#4caf50';
            spawnFloatingText(sign + delta.toFixed(2) + 's', player.x + player.w / 2, player.y - 30, col, 16);
        }
    }

    // Floating text for grade
    if (grade === 'gold') spawnFloatingText('GOLD!', player.x + player.w / 2, player.y - 80, '#ffd700', 24);
    else if (grade === 'silver') spawnFloatingText('SILVER!', player.x + player.w / 2, player.y - 80, '#c0c0c0', 20);
    else if (grade === 'bronze') spawnFloatingText('BRONZE!', player.x + player.w / 2, player.y - 80, '#cd7f32', 18);

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

    // Daily challenge handling
    if (endlessMode) {
        // Endless mode doesn't really "complete" — this shouldn't fire
        return;
    }

    // Daily best time saving
    if (currentLevel === -2) {
        const dailyBest = getDailyBest();
        if (!dailyBest || time < dailyBest) {
            try { localStorage.setItem('parkour_daily_' + getDailyDate(), time.toFixed(3)); } catch(e) {}
        }
    }

    // Check achievements
    checkAchievements();

    document.getElementById('btn-next').style.display =
        (currentLevel < 0 || currentLevel + 1 >= LEVELS.length) ? 'none' : '';

    document.getElementById('complete-overlay').classList.remove('hidden');

    // Victory confetti
    spawnConfetti();

    // Victory particles + firework bursts
    for (let i = 0; i < 40; i++) {
        const colors = ['#00e5ff', '#ff4081', '#ffd700', '#4caf50'];
        spawnParticles(
            player.x + player.w / 2 + (Math.random() - 0.5) * 100,
            player.y + (Math.random() - 0.5) * 100,
            1, colors[Math.floor(Math.random() * colors.length)], 5, 2
        );
    }
    // Firework bursts
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const fx = player.x + (Math.random() - 0.5) * 200;
            const fy = player.y - 50 - Math.random() * 100;
            spawnParticles(fx, fy, 20, ['#ffd700', '#ff4081', '#00e5ff'][i], 5, 2);
            playSound('boost');
        }, i * 400);
    }
}

// ---------- CAMERA ----------
function updateCamera(dt) {
    // Camera look-ahead: bias in direction of movement
    const lookAhead = player.vx * 8; // look ahead ~8px per vx unit
    const targetX = player.x - canvasW / 2 + player.w / 2 + lookAhead;
    // Bias camera toward lower third — player at 40% from top, not centered
    const targetY = player.y - canvasH * 0.4 + player.h / 2;
    const smooth = 1 - Math.pow(1 - CAM_SMOOTH, dt);
    camera.x += (targetX - camera.x) * smooth;
    // Use slower vertical smoothing to reduce jitter on jumps
    const vSmooth = 1 - Math.pow(1 - CAM_SMOOTH * 0.6, dt);
    camera.y += (targetY - camera.y) * vSmooth;

    // Clamp bottom — ensure the full floor is always visible
    if (camera.y > WORLD_H * TILE - canvasH) {
        camera.y = WORLD_H * TILE - canvasH;
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

    if (bgGenerated) {
        // Stars with parallax and twinkle — colored by theme
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

        // Far buildings (parallax 0.02)
        const farColor = darkenColor(th.bgBot, 0.6);
        ctx.fillStyle = farColor;
        for (const b of bgBuildings1) {
            const bx = ((b.x - camera.x * 0.02) % 4000 + 4000) % 4000 - 200;
            const by = canvasH - b.h;
            if (bx + b.w < 0 || bx > canvasW) continue;
            ctx.fillRect(bx, by, b.w, b.h);
        }

        // Near buildings (parallax 0.05) with window lights
        const nearColor = darkenColor(th.bgBot, 0.4);
        for (const b of bgBuildings2) {
            const bx = ((b.x - camera.x * 0.05) % 4000 + 4000) % 4000 - 200;
            const by = canvasH - b.h;
            if (bx + b.w < 0 || bx > canvasW) continue;
            ctx.fillStyle = nearColor;
            ctx.fillRect(bx, by, b.w, b.h);
            ctx.fillStyle = 'rgba(255, 220, 150, 0.25)';
            for (const win of b.windows) {
                ctx.fillRect(bx + win.x, by + win.y, 4, 4);
            }
        }
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
    const heartbeat = Math.sin(Date.now() * 0.008) * 0.5 + 0.5; // slow heartbeat pulse
    const px = player.x + player.w / 2;
    const py = player.y + player.h / 2;
    for (const s of spikes) {
        const sx = s.x - camera.x;
        const sy = s.y - camera.y;
        if (sx + s.w < 0 || sx > canvasW || sy + s.h < 0 || sy > canvasH) continue;

        // Distance-based danger tint
        const dx = px - (s.x + s.w / 2);
        const dy = py - (s.y + s.h / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const danger = dist < 120 ? (1 - dist / 120) * 0.15 : 0;

        // Heartbeat glow when player is close
        ctx.fillStyle = `rgba(255, 40, 40, ${(pulseAlpha * 0.5) + (danger * heartbeat)})`;
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

        // Danger warning line when very close
        if (danger > 0.05) {
            ctx.save();
            ctx.setLineDash([3, 3]);
            ctx.strokeStyle = `rgba(255, 50, 50, ${danger * 2})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(px - camera.x, py - camera.y);
            ctx.lineTo(sx + s.w / 2, sy + s.h / 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
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

        // Directional arrow on platform surface
        const arrowAlpha = Math.sin(Date.now() * 0.004) * 0.2 + 0.4;
        ctx.globalAlpha = arrowAlpha;
        ctx.fillStyle = th.movTop;
        const acx = sx + mp.w / 2;
        const acy = sy + mp.h / 2;
        if (mp.dx) {
            const dir = mp.vx > 0 ? 1 : -1;
            ctx.beginPath();
            ctx.moveTo(acx + 8 * dir, acy);
            ctx.lineTo(acx - 4 * dir, acy - 4);
            ctx.lineTo(acx - 4 * dir, acy + 4);
            ctx.fill();
        }
        if (mp.dy) {
            const dir = mp.vy > 0 ? 1 : -1;
            ctx.beginPath();
            ctx.moveTo(acx, acy + 8 * dir);
            ctx.lineTo(acx - 4, acy - 4 * dir);
            ctx.lineTo(acx + 4, acy - 4 * dir);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
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
    for (let ci = 0; ci < checkpoints.length; ci++) {
        const cp = checkpoints[ci];
        const sx = cp.x - camera.x;
        const sy = cp.y - camera.y;
        if (sx < -50 || sx > canvasW + 50) continue;

        const pulse = Math.sin(Date.now() * 0.004) * 0.3 + 0.7;

        // Pulsing ring around checkpoint
        if (cp.activated) {
            const ringR = 20 + Math.sin(Date.now() * 0.003) * 4;
            ctx.strokeStyle = `rgba(0, 255, 170, ${pulse * 0.3})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(sx + cp.w / 2, sy + cp.h / 2, ringR, 0, Math.PI * 2);
            ctx.stroke();
        }

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

        // Checkpoint number label
        ctx.fillStyle = cp.activated ? '#00ffaa' : '#777';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText((ci + 1).toString(), sx + cp.w / 2, sy - 6);
        ctx.textAlign = 'left';

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

    // Distance-based intensity boost
    const distToGoal = Math.sqrt(
        Math.pow((player.x + player.w / 2) - (goalZone.x + goalZone.w / 2), 2) +
        Math.pow((player.y + player.h / 2) - (goalZone.y + goalZone.h / 2), 2)
    );
    const proximityBoost = Math.max(0, 1 - distToGoal / 300) * 0.3;

    // Expanding pulse ring when player approaches
    if (distToGoal < 250) {
        const ringPhase = (now % 1500) / 1500;
        const ringRadius = 10 + ringPhase * 40;
        const ringAlpha = (1 - ringPhase) * (0.3 + proximityBoost);
        ctx.strokeStyle = `rgba(0, 229, 255, ${ringAlpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sx + goalZone.w / 2, sy + goalZone.h / 2, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Radial glow (intensifies near player)
    const glowMult = 1 + proximityBoost;
    ctx.fillStyle = `rgba(0, 229, 255, ${0.08 * pulse * glowMult})`;
    ctx.fillRect(sx - 12, sy - 12, goalZone.w + 24, goalZone.h + 24);
    ctx.fillStyle = `rgba(0, 229, 255, ${0.15 * pulse * glowMult})`;
    ctx.fillRect(sx - 4, sy - 4, goalZone.w + 8, goalZone.h + 8);
    ctx.fillStyle = `rgba(0, 229, 255, ${0.3 * pulse * glowMult})`;
    ctx.fillRect(sx, sy, goalZone.w, goalZone.h);

    // Rotating rings (3 concentric)
    const cx = sx + goalZone.w / 2;
    const cy = sy + goalZone.h / 2;
    for (let r = 0; r < 3; r++) {
        const radius = 12 + r * 8;
        const angle = now * (0.002 + r * 0.001) * (r % 2 === 0 ? 1 : -1);
        ctx.strokeStyle = `rgba(0, 229, 255, ${(0.4 - r * 0.1) * glowMult})`;
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

    // Particle fountain (more particles when close)
    const particleChance = distToGoal < 200 ? 0.6 : 0.3;
    if (gameState === 'playing' && Math.random() < particleChance) {
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
    particleCount = 0;
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
    const sx = player.x - camera.x;
    const sy = player.y - camera.y;
    drawPlayerSprite(sx, sy, PLAYER_W, PLAYER_H, replayPlayerFacing, replayPlayerState, replayDistTraveled, getTheme(), 1);
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

// Shared animated sprite drawing for player/ghost/replay
function drawPlayerSprite(screenX, screenY, w, h, facing, state, dist, theme, alpha) {
    const currentH = state === 'sliding' ? PLAYER_H_SLIDE : PLAYER_H;
    const centerX = screenX + w / 2;
    const bottomY = screenY + currentH;
    const skinC = getSkinColors(theme);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(centerX, bottomY);
    ctx.scale(facing, 1);

    if (state === 'sliding') {
        ctx.fillStyle = skinC.playerArms;
        ctx.fillRect(-10, -PLAYER_H_SLIDE, 20, PLAYER_H_SLIDE);
        ctx.fillStyle = skinC.playerHead;
        ctx.fillRect(-4, -PLAYER_H_SLIDE, 8, 6);
        ctx.fillStyle = '#fff';
        ctx.fillRect(1, -PLAYER_H_SLIDE + 2, 2, 2);
    } else {
        let bodyColor = skinC.playerBody;
        if (state === 'dashing') bodyColor = '#ff4081';
        else if (state === 'jumping' || state === 'falling') bodyColor = skinC.playerHead;
        else if (state === 'wall_sliding') bodyColor = skinC.playerArms;

        ctx.fillStyle = bodyColor;
        ctx.fillRect(-4, -PLAYER_H, 8, 8);
        ctx.fillStyle = '#fff';
        ctx.fillRect(1, -PLAYER_H + 3, 2, 2);

        const breathOffset = state === 'idle' ? Math.sin(Date.now() * 0.003) * 1.5 : 0;
        const headBob = state === 'idle' ? Math.sin(Date.now() * 0.002) * 0.5 : 0;
        ctx.fillStyle = bodyColor;
        ctx.fillRect(-6, -PLAYER_H + 8 + breathOffset, 12, 10);

        const animCycle = Math.floor(dist / 12) % 4;
        let leftArmY = -PLAYER_H + 9, rightArmY = -PLAYER_H + 9;
        if (state === 'running') {
            const offsets = [0, -3, 0, 3];
            leftArmY += offsets[animCycle];
            rightArmY += offsets[(animCycle + 2) % 4];
        } else if (state === 'jumping') { leftArmY -= 4; rightArmY -= 4; }
        else if (state === 'falling') { leftArmY -= 2; rightArmY -= 2; }
        else if (state === 'dashing') { leftArmY += 2; rightArmY += 2; }
        ctx.fillRect(-10, leftArmY, 4, 8);
        ctx.fillRect(6, rightArmY, 4, 8);

        let leftLegY = -PLAYER_H + 18, rightLegY = -PLAYER_H + 18;
        let leftLegX = -5, rightLegX = 1;
        if (state === 'running') {
            const lo = [0, -3, 0, 3];
            leftLegY += lo[animCycle]; rightLegY += lo[(animCycle + 2) % 4];
            leftLegX += (animCycle < 2 ? -1 : 1); rightLegX += (animCycle < 2 ? 1 : -1);
        } else if (state === 'jumping') { leftLegY += 3; rightLegY += 3; leftLegX -= 1; rightLegX += 1; }
        else if (state === 'falling') { leftLegX -= 2; rightLegX += 2; }
        else if (state === 'wall_sliding') { leftLegX = -3; rightLegX = -1; }
        ctx.fillRect(leftLegX, leftLegY, 4, 10);
        ctx.fillRect(rightLegX, rightLegY, 4, 10);
    }

    ctx.restore();
}

function drawGhost() {
    if (!ghostEnabled || ghostPlayback.length === 0 || gameState !== 'playing') return;
    const idx = Math.min(ghostFrame, ghostPlayback.length - 1);
    const g = ghostPlayback[idx];
    if (!g) return;

    const gx = g.x - camera.x;
    const gy = g.y - camera.y;
    const prevG = idx > 0 ? ghostPlayback[idx - 1] : null;
    const ghostFacing = prevG ? (g.x > prevG.x ? 1 : g.x < prevG.x ? -1 : 1) : 1;
    drawPlayerSprite(gx, gy, PLAYER_W, PLAYER_H, ghostFacing, g.state || 'running', idx * 3, getTheme(), 0.2);
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

    // Draw character based on state — themed with skins
    const th = getTheme();
    const skinC = getSkinColors(th);
    if (state === 'sliding') {
        ctx.fillStyle = skinC.playerArms;
        ctx.fillRect(-10, -PLAYER_H_SLIDE, 20, PLAYER_H_SLIDE);
        ctx.fillStyle = skinC.playerHead;
        ctx.fillRect(-4, -PLAYER_H_SLIDE, 8, 6);
        ctx.fillStyle = '#fff';
        ctx.fillRect(1, -PLAYER_H_SLIDE + 2, 2, 2);
    } else {
        let bodyColor = skinC.playerBody;
        if (state === 'dashing') bodyColor = '#ff4081';
        else if (state === 'jumping' || state === 'falling') bodyColor = skinC.playerHead;
        else if (state === 'wall_sliding') bodyColor = skinC.playerArms;

        // Head (8x8)
        ctx.fillStyle = bodyColor;
        ctx.fillRect(-4, -PLAYER_H, 8, 8);

        // Eyes (2x2 white dots)
        ctx.fillStyle = '#fff';
        ctx.fillRect(1, -PLAYER_H + 3, 2, 2);

        // Torso (12x10) — enhanced idle breathing
        const breathOffset = state === 'idle' ? Math.sin(Date.now() * 0.003) * 1.5 : 0;
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
    const absVx = Math.abs(player.vx);
    if (absVx < 8) return;
    const alpha = Math.min((absVx - 8) / 10, 0.5);
    // Theme-colored speed lines
    const th = getTheme();
    const lineColor = th.platTop || '#ffffff';
    const r = parseInt(lineColor.slice(1, 3), 16) || 255;
    const g = parseInt(lineColor.slice(3, 5), 16) || 255;
    const b = parseInt(lineColor.slice(5, 7), 16) || 255;
    ctx.lineWidth = 1;
    const dir = player.vx > 0 ? -1 : 1;
    const lineCount = Math.min(12, Math.floor(absVx - 6));
    for (let i = 0; i < lineCount; i++) {
        const lineAlpha = alpha * (0.5 + Math.random() * 0.5);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${lineAlpha})`;
        const y = Math.random() * canvasH;
        const x = dir > 0 ? 0 : canvasW;
        const len = 40 + Math.random() * 80;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + len * dir, y);
        ctx.stroke();
    }

    // Subtle motion blur behind player when very fast
    if (absVx > 12) {
        const px = player.x - camera.x + player.w / 2;
        const py = player.y - camera.y + player.h / 2;
        ctx.save();
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = lineColor;
        for (let i = 1; i <= 3; i++) {
            ctx.fillRect(px - dir * i * 8 - player.w / 2, py - player.h / 2, player.w, player.h);
        }
        ctx.restore();
    }
}

// Vignette (danger-responsive)
function drawVignette() {
    // Check proximity to spikes for danger vignette
    let dangerLevel = 0;
    if (gameState === 'playing') {
        for (const sp of spikes) {
            const dx = (player.x + player.w / 2) - (sp.x + sp.w / 2);
            const dy = (player.y + player.h / 2) - (sp.y + sp.h / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) dangerLevel = Math.max(dangerLevel, 1 - dist / 100);
        }
    }

    const grd = ctx.createRadialGradient(
        canvasW / 2, canvasH / 2, canvasH * 0.3,
        canvasW / 2, canvasH / 2, canvasH * 0.85
    );
    const baseAlpha = 0.4 + dangerLevel * 0.15;
    // Shift vignette red when in danger
    if (dangerLevel > 0.3) {
        grd.addColorStop(0, 'rgba(0,0,0,0)');
        grd.addColorStop(0.7, `rgba(40,0,0,${dangerLevel * 0.1})`);
        grd.addColorStop(1, `rgba(0,0,0,${baseAlpha})`);
    } else {
        grd.addColorStop(0, 'rgba(0,0,0,0)');
        grd.addColorStop(1, `rgba(0,0,0,${baseAlpha})`);
    }
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Death state: darker vignette
    if (gameState === 'dead') {
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(0, 0, canvasW, canvasH);
    }
}

// ---------- FLOATING TEXT POPUPS ----------
function spawnFloatingText(text, x, y, color, size) {
    floatingTexts.push({
        text, x, y, vy: -1.5, life: 90, maxLife: 90,
        color: color || '#fff', size: size || 16
    });
}

function updateFloatingTexts(dt) {
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y += ft.vy * dt;
        ft.life -= dt;
        if (ft.life <= 0) floatingTexts.splice(i, 1);
    }
}

function drawFloatingTexts() {
    for (const ft of floatingTexts) {
        const alpha = Math.max(0, ft.life / ft.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = ft.color;
        ctx.font = 'bold ' + ft.size + 'px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x - camera.x, ft.y - camera.y);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
}

// ---------- SCREEN FLASH ----------
function triggerScreenFlash(color, alpha, duration) {
    screenFlash.active = true;
    screenFlash.color = color;
    screenFlash.alpha = alpha;
    screenFlash.decay = alpha / (duration * 60);
}

function drawScreenFlash() {
    if (!screenFlash.active) return;
    ctx.globalAlpha = screenFlash.alpha;
    ctx.fillStyle = screenFlash.color;
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.globalAlpha = 1;
    screenFlash.alpha -= screenFlash.decay * dtScale;
    if (screenFlash.alpha <= 0) {
        screenFlash.active = false;
        screenFlash.alpha = 0;
    }
}

// ---------- SPLIT TIMER ----------
function updateSplitTimer() {
    if (!ghostEnabled || ghostPlayback.length === 0 || gameState !== 'playing') {
        const hudDelta = document.getElementById('hud-delta');
        if (hudDelta) hudDelta.textContent = '';
        return;
    }
    const idx = Math.min(ghostFrame, ghostPlayback.length - 1);
    const g = ghostPlayback[idx];
    if (!g) return;
    const gap = player.x - g.x;
    const hudDelta = document.getElementById('hud-delta');
    if (hudDelta) {
        if (Math.abs(gap) < 20) {
            hudDelta.textContent = '';
        } else if (gap > 0) {
            hudDelta.textContent = 'AHEAD';
            hudDelta.style.color = '#4caf50';
        } else {
            hudDelta.textContent = 'BEHIND';
            hudDelta.style.color = '#ff4444';
        }
    }
}

// ---------- STREAK SYSTEM ----------
function loadStreaks() {
    try {
        currentStreak = parseInt(localStorage.getItem('parkour_streak') || '0');
        bestStreak = parseInt(localStorage.getItem('parkour_best_streak') || '0');
    } catch(e) { currentStreak = 0; bestStreak = 0; }
}

function saveStreaks() {
    try {
        localStorage.setItem('parkour_streak', currentStreak);
        localStorage.setItem('parkour_best_streak', bestStreak);
    } catch(e) {}
}

function updateStreakHUD() {
    const el = document.getElementById('hud-streak');
    if (!el) return;
    if (currentStreak >= 2 && gameState === 'playing') {
        el.textContent = 'STREAK: ' + currentStreak;
        el.style.display = '';
    } else {
        el.style.display = 'none';
    }
}

// ---------- MENU STARS ----------
function updateMenuStars() {
    const el = document.getElementById('menu-stars');
    if (!el) return;
    let totalStars = 0;
    const maxStars = LEVELS.length * 3;
    for (let i = 0; i < LEVELS.length; i++) {
        const g = bestGrades[i];
        if (g === 'gold') totalStars += 3;
        else if (g === 'silver') totalStars += 2;
        else if (g === 'bronze') totalStars += 1;
    }
    const pct = maxStars > 0 ? Math.round(totalStars / maxStars * 100) : 0;
    const barLen = 10;
    const filled = Math.round(totalStars / maxStars * barLen);
    const bar = '\u2593'.repeat(filled) + '\u2591'.repeat(barLen - filled);
    el.textContent = '\u2605 ' + totalStars + '/' + maxStars + ' [' + bar + '] ' + pct + '%';
}

// ---------- STATS DASHBOARD ----------
function loadStats() {
    try {
        totalTimePlayed = parseFloat(localStorage.getItem('parkour_total_time') || '0');
        totalCompletions = parseInt(localStorage.getItem('parkour_total_completions') || '0');
        totalDeaths = parseInt(localStorage.getItem('parkour_total_deaths') || '0');
    } catch(e) {}
}

function saveStats() {
    try {
        localStorage.setItem('parkour_total_time', totalTimePlayed);
        localStorage.setItem('parkour_total_completions', totalCompletions);
        localStorage.setItem('parkour_total_deaths', totalDeaths);
    } catch(e) {}
}

function formatStatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return h + 'h ' + m + 'm';
    if (m > 0) return m + 'm ' + s + 's';
    return s + 's';
}

function populateStats() {
    const grid = document.getElementById('stats-grid');
    if (!grid) return;
    grid.innerHTML = '';

    let levelsCompleted = 0;
    let goldCount = 0, silverCount = 0, bronzeCount = 0;
    for (let i = 0; i < LEVELS.length; i++) {
        if (bestTimes[i]) levelsCompleted++;
        if (bestGrades[i] === 'gold') goldCount++;
        else if (bestGrades[i] === 'silver') silverCount++;
        else if (bestGrades[i] === 'bronze') bronzeCount++;
    }

    const avgTime = totalCompletions > 0 ? (totalTimePlayed / totalCompletions).toFixed(1) + 's' : '--';

    const achCount = Object.keys(unlockedAchievements).length;

    const stats = [
        { label: 'TOTAL DEATHS', value: totalDeaths, color: '#ff4444' },
        { label: 'TIME PLAYED', value: formatStatTime(totalTimePlayed), color: '#00e5ff' },
        { label: 'LEVELS BEATEN', value: levelsCompleted + '/' + LEVELS.length, color: '#4caf50' },
        { label: 'COMPLETIONS', value: totalCompletions, color: '#cc99ff' },
        { label: 'GOLD MEDALS', value: goldCount, color: '#ffd700' },
        { label: 'SILVER MEDALS', value: silverCount, color: '#c0c0c0' },
        { label: 'BRONZE MEDALS', value: bronzeCount, color: '#cd7f32' },
        { label: 'BEST STREAK', value: bestStreak, color: '#ff4081' },
        { label: 'CURRENT STREAK', value: currentStreak, color: '#ff4081' },
        { label: 'AVG TIME/LEVEL', value: avgTime, color: '#888' },
        { label: 'WALL JUMPS', value: totalWallJumps, color: '#00ff88' },
        { label: 'DASHES', value: totalDashes, color: '#ff4081' },
        { label: 'ORBS COLLECTED', value: totalOrbs, color: '#ffd700' },
        { label: 'ENDLESS BEST', value: endlessBest > 0 ? endlessBest + 'm' : '--', color: '#ff8c00' },
        { label: 'ACHIEVEMENTS', value: achCount + '/' + ACHIEVEMENTS.length, color: '#ffaa00' },
        { label: 'SKINS UNLOCKED', value: unlockedSkins.length + '/' + SKINS.length, color: '#ff66aa' },
        { label: 'DIFFICULTY', value: (difficulty || 'medium').toUpperCase(), color: { easy: '#66aaff', medium: '#bb66ff', hard: '#ff6622', extreme: '#ff2222' }[difficulty] || '#bb66ff' },
        { label: 'GAMEPAD', value: gamepadConnected ? 'CONNECTED' : 'NONE', color: gamepadConnected ? '#4caf50' : '#666' },
    ];

    for (const s of stats) {
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = '<div class="stat-value" style="color:' + s.color + '">' + s.value + '</div>' +
            '<div class="stat-label">' + s.label + '</div>';
        grid.appendChild(card);
    }
}

// ---------- GAMEPAD SUPPORT ----------
function pollGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    let gp = null;
    for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) { gp = gamepads[i]; break; }
    }
    if (!gp) { gamepadConnected = false; return; }
    gamepadConnected = true;

    // Left stick X axis
    const lx = gp.axes[0] || 0;
    if (lx < -gamepadDeadzone) { keys['ArrowLeft'] = true; keys['ArrowRight'] = false; }
    else if (lx > gamepadDeadzone) { keys['ArrowRight'] = true; keys['ArrowLeft'] = false; }
    else { keys['ArrowLeft'] = false; keys['ArrowRight'] = false; }

    // Button mappings (standard gamepad):
    // 0=A (South) = Jump, 1=B (East) = Dash, 2=X (West) = Slide, 3=Y (North) = Climb
    // 9=Start = Pause, 12=DPad Up, 13=DPad Down, 14=DPad Left, 15=DPad Right
    const btns = {};
    for (let i = 0; i < gp.buttons.length; i++) btns[i] = gp.buttons[i].pressed;

    // D-pad
    if (btns[14]) keys['ArrowLeft'] = true;
    if (btns[15]) keys['ArrowRight'] = true;
    if (btns[12]) keys['ArrowUp'] = true; else if (!keys['KeyW']) keys['ArrowUp'] = false;

    // Jump (A button)
    if (btns[0]) { keys['Space'] = true; } else { if (!keys['KeyW'] && !keys['ArrowUp']) keys['Space'] = false; }
    // Dash (B / right bumper)
    if (btns[1] || btns[5]) { keys['ShiftLeft'] = true; } else { if (!keys['ShiftRight']) keys['ShiftLeft'] = false; }
    // Slide (X button)
    if (btns[2]) { keys['KeyS'] = true; } else { if (!keys['ArrowDown']) keys['KeyS'] = false; }
    // Climb (Y button)
    if (btns[3]) { keys['KeyE'] = true; } else { keys['KeyE'] = false; }

    // Start = Pause (edge-triggered)
    if (btns[9] && !prevGamepadButtons[9]) {
        document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
    }
    // Select (8) = Restart
    if (btns[8] && !prevGamepadButtons[8]) {
        document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyR' }));
    }

    prevGamepadButtons = { ...btns };
}

window.addEventListener('gamepadconnected', () => { gamepadConnected = true; });
window.addEventListener('gamepaddisconnected', () => { gamepadConnected = false; });

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

    // Gamepad polling
    pollGamepad();

    // Menu background
    if (currentScreen === 'menu' || currentScreen === 'level' || currentScreen === 'controls' || currentScreen === 'bestrun' || currentScreen === 'difficulty' || currentScreen === 'stats' || currentScreen === 'achievements' || currentScreen === 'settings' || currentScreen === 'skins') {
        drawMenuBackground();
    }

    // Countdown state — render level but don't update player
    if (gameState === 'countdown') {
        updateCountdown(dt);
        updateWeather(dtScale);
        updateClouds(dtScale);
        updateCamera(dtScale);
    }

    if (gameState === 'playing') {
        // Timer starts only when player first moves
        if (!timerStarted) {
            if (keys['KeyA'] || keys['KeyD'] || keys['ArrowLeft'] || keys['ArrowRight'] ||
                keys['KeyW'] || keys['ArrowUp'] || keys['Space'] || keys['ShiftLeft'] || keys['ShiftRight'] ||
                keys['KeyS'] || keys['ArrowDown']) {
                timerStarted = true;
            }
        }
        if (timerStarted) levelTimer += dt / 1000;
        updatePlayer(dtScale);
        updateMovingPlatforms(dtScale);
        updateFallingPlatforms(dtScale);
        updateCamera(dtScale);
        updateCombo(dtScale);
        updateSplitTimer();
        updateStreakHUD();
        updateWeather(dtScale);
        updateClouds(dtScale);
        updateConfetti(dtScale);
        updateDeathAnim(dtScale);
        updateScarfTrail();

        // Endless mode
        if (endlessMode) {
            updateEndless();
            endlessDistance = player.x / TILE;
            const distEl = document.getElementById('hud-distance');
            if (distEl) {
                distEl.style.display = '';
                distEl.textContent = Math.floor(endlessDistance) + 'm';
            }
            checkEndlessMilestones();
        }

        // Speed multiplier HUD
        const speedEl = document.getElementById('hud-speed');
        if (speedEl) {
            const absVx = Math.abs(player.vx);
            if (absVx > RUN_SPEED * 1.2) {
                const mult = (absVx / RUN_SPEED).toFixed(1);
                speedEl.textContent = mult + 'x SPEED';
                speedEl.style.display = '';
                speedEl.style.color = absVx > 10 ? '#ff4081' : '#ffd700';
            } else {
                speedEl.style.display = 'none';
            }
        }

        // Wind modulation by player speed
        if (windGainNode && windFilterNode) {
            const speedFactor = Math.min(1, Math.abs(player.vx) / 12);
            windGainNode.gain.value = 0.008 + speedFactor * 0.012;
            windFilterNode.frequency.value = 400 + speedFactor * 300;
        }

        // Dynamic music intensity (via master gain)
        if (masterGainNode) {
            const speedFactor = Math.min(1, Math.abs(player.vx) / 12);
            let dangerFactor = 0;
            for (const sp of spikes) {
                const dx = player.x - sp.x;
                const dy = player.y - sp.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) { dangerFactor = Math.max(dangerFactor, 1 - dist / 100); }
            }
            const intensity = 0.7 + speedFactor * 0.15 + dangerFactor * 0.15;
            masterGainNode.gain.value = Math.min(1, intensity) * (gameSettings.volume / 100);
        }

        // Camera zoom effects
        const absVx = Math.abs(player.vx);
        let targetZoom = 1.0;
        if (absVx > 10) targetZoom = 0.92;
        else if (absVx > 7) targetZoom = 0.96;
        // Zoom in near spikes
        for (const sp of spikes) {
            const dx = player.x - sp.x;
            const dy = player.y - sp.y;
            if (Math.sqrt(dx * dx + dy * dy) < 80) { targetZoom = Math.max(targetZoom, 1.05); break; }
        }
        cameraZoom += (targetZoom - cameraZoom) * 0.05;

        // Goal proximity notification
        if (goalZone && !endlessMode && !goalProximityNotified) {
            const distToGoal = Math.abs(player.x - goalZone.x);
            if (distToGoal < 150 && player.x > goalZone.x * 0.7) {
                goalProximityNotified = true;
                spawnFloatingText('ALMOST THERE!', player.x + player.w / 2, player.y - 50, '#00e5ff', 20);
            }
        }

        // Tutorial hint timer
        if (tutorialTimer > 0) {
            tutorialTimer -= dtScale;
            if (tutorialTimer <= 0) {
                const el = document.getElementById('tutorial-hint');
                if (el) el.classList.remove('visible');
            }
        }

        // Ghost playback frame — recording saves every 3rd frame, so advance 1 ghost frame per 3 game frames
        if (ghostPlayback.length > 0) {
            ghostPlaybackCounter = (ghostPlaybackCounter || 0) + 1;
            if (ghostPlaybackCounter >= 3) {
                ghostPlaybackCounter = 0;
                ghostFrame++;
                if (ghostFrame >= ghostPlayback.length) ghostFrame = ghostPlayback.length - 1;
            }
        }

        // Achievement popup timer
        if (achievementPopupTimer > 0) {
            achievementPopupTimer -= dt / 1000;
            if (achievementPopupTimer <= 0) {
                const popup = document.getElementById('achievement-popup');
                if (popup) popup.classList.add('hidden');
            }
        }

        // Update HUD timer
        if (!practiceMode) {
            const hudTimer = document.getElementById('hud-timer');
            if (hudTimer) hudTimer.textContent = levelTimer.toFixed(2) + 's';
        } else {
            const hudTimer = document.getElementById('hud-timer');
            if (hudTimer) hudTimer.textContent = 'PRACTICE';
        }
    }

    // Auto-restart countdown when dead
    if (gameState === 'dead' && autoRestartActive && !lastCheckpoint) {
        autoRestartTimer -= dt / 1000;
        const autoEl = document.getElementById('death-auto-restart');
        if (autoEl) autoEl.textContent = 'Auto-restart in ' + Math.max(0, autoRestartTimer).toFixed(1) + 's...';
        if (autoRestartTimer <= 0) {
            autoRestartActive = false;
            document.getElementById('death-overlay').classList.add('hidden');
            if (endlessMode) {
                endlessMode = false;
                startEndlessMode();
            } else if (currentLevel === -2) {
                startDailyChallenge();
            } else if (currentLevel >= 0) {
                loadLevel(currentLevel);
                startCountdown(() => {});
            }
        }
    }

    // Replay mode update — smooth interpolation between sparse frames
    if (gameState === 'replay') {
        replayTimer += dt / 1000;
        const progress = Math.min(replayTimer / replayTotalTime, 1);
        const exactFrame = progress * (replayData.length - 1);
        const frameA = Math.floor(exactFrame);
        const frameB = Math.min(frameA + 1, replayData.length - 1);
        const t = exactFrame - frameA;

        if (frameA < replayData.length && progress < 1) {
            const a = replayData[frameA];
            const b = replayData[frameB];
            const prevX = player.x;
            // Lerp between frames for smooth movement
            player.x = a.x + (b.x - a.x) * t;
            player.y = a.y + (b.y - a.y) * t;
            replayPlayerState = a.state || 'running';
            // Track facing direction from movement
            if (player.x > prevX + 0.3) replayPlayerFacing = 1;
            else if (player.x < prevX - 0.3) replayPlayerFacing = -1;
            // Track distance for animation
            replayDistTraveled += Math.abs(player.x - prevX);
            replayFrame = frameA;
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
    updateFloatingTexts(dtScale);

    // Screen shake decay
    if (screenShake > 0.1) {
        screenShake *= 0.85;
    } else {
        screenShake = 0;
    }

    // Death zoom effect
    if (deathZoom > 0) deathZoom--;

    // Render
    if (currentScreen === 'game') {
        // Apply screen shake + camera zoom
        ctx.save();
        const shakeEnabled = gameSettings.shake;
        if (shakeEnabled && screenShake > 0.5) {
            ctx.translate(
                (Math.random() - 0.5) * screenShake,
                (Math.random() - 0.5) * screenShake
            );
        }

        // Camera zoom transform
        if (cameraZoom !== 1.0 || deathZoom > 0) {
            const zoomVal = deathZoom > 0 ? 1 + 0.08 * (deathZoom / 20) : cameraZoom;
            ctx.translate(canvasW / 2, canvasH / 2);
            ctx.scale(zoomVal, zoomVal);
            ctx.translate(-canvasW / 2, -canvasH / 2);
        }

        drawBackground();
        drawClouds();
        drawWeather();
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
        drawOrbs();
        if (gameState === 'replay') {
            drawReplayPlayer();
        } else if (!deathAnim.active) {
            drawPlayerGlow();
            drawScarfTrail();
            drawPlayer();
        }
        drawDeathAnim();
        drawParticles();
        drawFloatingTexts();
        drawConfetti();
        if (gameState !== 'replay') {
            drawSpeedLines();
        }
        drawVignette();
        drawScreenFlash();
        drawPostProcessing();

        ctx.restore();

        // Draw minimap and progress bar outside zoom transform
        if (gameSettings.minimap && gameState !== 'replay') {
            drawMinimap();
        }
        if (gameState === 'playing') {
            drawProgressBar();
        }
        // Countdown overlay (drawn on top of everything)
        drawCountdown();
        // Difficulty badge
        if ((gameState === 'playing' || gameState === 'countdown') && difficulty) {
            ctx.save();
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            const diffColors = { easy: '#66aaff', medium: '#bb66ff', hard: '#ff6622', extreme: '#ff2222' };
            ctx.fillStyle = diffColors[difficulty] || '#aaa';
            ctx.globalAlpha = 0.7;
            ctx.fillText(difficulty.toUpperCase(), 10, canvasH - 22);
            ctx.globalAlpha = 1;
            ctx.restore();
        }
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

    // Editor undo/redo
    if (currentScreen === 'editor') {
        if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ' && !e.shiftKey) {
            e.preventDefault();
            if (editorHistory.length > 0) {
                editorRedoStack.push(JSON.stringify(editorObjects));
                editorObjects = JSON.parse(editorHistory.pop());
                playSound('click');
            }
            return;
        }
        if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyY' || (e.code === 'KeyZ' && e.shiftKey))) {
            e.preventDefault();
            if (editorRedoStack.length > 0) {
                editorHistory.push(JSON.stringify(editorObjects));
                editorObjects = JSON.parse(editorRedoStack.pop());
                playSound('click');
            }
            return;
        }
    }

    // R key to skip auto-restart or restart when dead
    if (e.code === 'KeyR' && gameState === 'dead') {
        autoRestartActive = false;
        document.getElementById('death-overlay').classList.add('hidden');
        if (endlessMode) {
            endlessMode = false;
            startEndlessMode();
        } else if (currentLevel === -2) {
            startDailyChallenge();
        } else if (currentLevel >= 0) {
            loadLevel(currentLevel);
            startCountdown(() => {});
        }
    }

    if (e.code === 'KeyR' && (gameState === 'playing' || gameState === 'countdown')) {
        const now = performance.now();
        if (now - lastRPressTime < 500) {
            // Double-tap R: restart from Level 1
            lastRPressTime = 0;
            deathCount = 0;
            endlessMode = false;
            doScreenWipe(() => startLevel(0), 'LEVEL 1');
        } else {
            // Single R: restart current level
            lastRPressTime = now;
            if (endlessMode) {
                endlessMode = false;
                startEndlessMode();
            } else if (currentLevel === -2) {
                startDailyChallenge();
            } else if (currentLevel >= 0) {
                loadLevel(currentLevel);
                startCountdown(() => {});
            }
        }
    }

    if (e.code === 'Escape') {
        if (gameState === 'replay' || gameState === 'replay_done') {
            exitReplayMode();
        } else if (gameState === 'playing' || gameState === 'countdown') {
            const wasCountdown = gameState === 'countdown';
            gameState = 'paused';
            if (wasCountdown) countdownActive = false;
            stopMusic();
            document.getElementById('pause-overlay').classList.remove('hidden');
            // Show level info in pause
            const pauseInfo = document.getElementById('pause-level-info');
            if (pauseInfo) {
                let info = '';
                if (endlessMode) info = 'ENDLESS — ' + Math.floor(endlessDistance) + 'm';
                else if (currentLevel === -2) info = 'DAILY CHALLENGE';
                else if (currentLevel === -1) info = 'CUSTOM LEVEL';
                else info = 'LEVEL ' + (currentLevel + 1) + ' — ' + levelTimer.toFixed(1) + 's';
                pauseInfo.textContent = info;
            }
            // Show/hide checkpoint restart button
            const cpBtn = document.getElementById('btn-checkpoint-restart');
            if (cpBtn) cpBtn.classList.toggle('hidden', !lastCheckpoint);
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

// Clear all keys when window loses focus to prevent stuck keys
window.addEventListener('blur', () => {
    for (const k in keys) keys[k] = false;
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
            // Haptic feedback
            if (navigator.vibrate) navigator.vibrate(25);
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
    loadStreaks();
    loadStats();
    loadAchievements();

    // Load skins
    try {
        const savedSkin = localStorage.getItem('parkour_skin');
        if (savedSkin) currentSkin = savedSkin;
        const savedUnlocked = localStorage.getItem('parkour_unlocked_skins');
        if (savedUnlocked) unlockedSkins = JSON.parse(savedUnlocked);
    } catch(e) {}

    // Load total orbs
    try {
        const savedOrbs = localStorage.getItem('parkour_total_orbs');
        if (savedOrbs) totalOrbs = parseInt(savedOrbs);
    } catch(e) {}

    // Load settings
    try {
        const savedSettings = localStorage.getItem('parkour_settings');
        if (savedSettings) Object.assign(gameSettings, JSON.parse(savedSettings));
    } catch(e) {}

    // Load endless best
    try {
        const savedEndless = localStorage.getItem('parkour_endless_best');
        if (savedEndless) endlessBest = parseInt(savedEndless);
    } catch(e) {}

    // Load wall jumps and dashes
    try {
        const wj = localStorage.getItem('parkour_wall_jumps');
        if (wj) totalWallJumps = parseInt(wj);
        const d = localStorage.getItem('parkour_dashes');
        if (d) totalDashes = parseInt(d);
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

function doScreenWipe(callback, label) {
    const wipe = document.getElementById('screen-wipe');
    if (!wipe) { callback(); return; }

    // Show level label during wipe
    const wipeLabel = document.getElementById('wipe-label');
    if (wipeLabel) {
        wipeLabel.textContent = label || '';
    }

    // Remove and re-add class to restart animation
    wipe.classList.remove('active');
    void wipe.offsetWidth; // Force reflow
    wipe.classList.add('active');

    setTimeout(() => {
        callback();
    }, 250);

    setTimeout(() => {
        wipe.classList.remove('active');
        if (wipeLabel) wipeLabel.textContent = '';
    }, 600);
}

function populateLevelGrid() {
    const grid = document.getElementById('level-grid');
    grid.innerHTML = '';
    for (let i = 0; i < LEVELS.length; i++) {
        const tile = document.createElement('div');
        tile.className = 'level-tile';
        tile.setAttribute('role', 'button');
        tile.setAttribute('aria-label', 'Level ' + (i + 1) + (i > unlockedLevel ? ' (locked)' : ''));
        if (i > unlockedLevel) tile.classList.add('locked');
        if (bestTimes[i]) tile.classList.add('completed');
        if (bestGrades[i] === 'gold') tile.classList.add('gold-completed');

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
                doScreenWipe(() => startLevel(lvl), 'LEVEL ' + (lvl + 1));
            })(i));
        }
        grid.appendChild(tile);
    }
}

function startLevel(index) {
    showScreen('game');
    loadLevel(index);
    startMusic();
    startWind();
    splitTimes = [];
    lastCheckpointTime = 0;
    lastEndlessMilestone = 0;
    document.getElementById('pause-overlay').classList.add('hidden');
    document.getElementById('complete-overlay').classList.add('hidden');
    document.getElementById('death-overlay').classList.add('hidden');
    // Hide distance HUD for non-endless
    if (!endlessMode) {
        const distEl = document.getElementById('hud-distance');
        if (distEl) distEl.style.display = 'none';
    }
    // 3-2-1-GO countdown
    startCountdown(() => {});
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
            editorHistory.push(JSON.stringify(editorObjects));
            editorRedoStack = [];
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

            // Save undo state before adding
            editorHistory.push(JSON.stringify(editorObjects));
            editorRedoStack = [];
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
    particleCount = 0;
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

    // Stats button
    document.getElementById('btn-stats').addEventListener('click', () => {
        playSound('click');
        populateStats();
        showScreen('stats');
    });

    document.getElementById('btn-back-stats').addEventListener('click', () => {
        playSound('click');
        showScreen('menu');
    });

    // Difficulty select buttons — highlight saved difficulty
    let pendingAction = 'play';
    document.querySelectorAll('.diff-btn').forEach(btn => {
        if (btn.dataset.diff === difficulty) btn.classList.add('selected');
    });
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            initAudio();
            playSound('click');
            difficulty = btn.dataset.diff;
            try { localStorage.setItem('parkour_difficulty', difficulty); } catch(e) {}
            // Highlight selected
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            if (pendingAction === 'endless') {
                doScreenWipe(() => startEndlessMode(), 'ENDLESS');
            } else if (pendingAction === 'play') {
                doScreenWipe(() => startLevel(0), 'LEVEL 1');
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
    const fsBtn = document.getElementById('btn-fullscreen');
    fsBtn.addEventListener('click', () => {
        playSound('click');
        const el = document.documentElement;
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (el.requestFullscreen) {
                el.requestFullscreen().catch(() => {});
            } else if (el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen();
            }
            fsBtn.textContent = 'EXIT FS';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            fsBtn.textContent = 'FULLSCREEN';
        }
    });
    document.addEventListener('fullscreenchange', () => {
        fsBtn.textContent = document.fullscreenElement ? 'EXIT FS' : 'FULLSCREEN';
    });

    // Settings button
    document.getElementById('btn-settings').addEventListener('click', () => {
        playSound('click');
        // Update settings UI
        const volSlider = document.getElementById('settings-volume');
        if (volSlider) volSlider.value = gameSettings.volume;
        const partBtn = document.getElementById('settings-particles');
        if (partBtn) partBtn.textContent = gameSettings.particles ? 'HIGH' : 'LOW';
        const shakeBtn = document.getElementById('settings-shake');
        if (shakeBtn) shakeBtn.textContent = gameSettings.shake ? 'ON' : 'OFF';
        const minimapBtn = document.getElementById('settings-minimap');
        if (minimapBtn) minimapBtn.textContent = gameSettings.minimap ? 'ON' : 'OFF';
        const cbBtnUI = document.getElementById('settings-colorblind');
        if (cbBtnUI) cbBtnUI.textContent = gameSettings.colorblind ? 'ON' : 'OFF';
        const hcBtnUI = document.getElementById('settings-highcontrast');
        if (hcBtnUI) hcBtnUI.textContent = gameSettings.highContrast ? 'ON' : 'OFF';
        const hintsBtnUI = document.getElementById('settings-hints');
        if (hintsBtnUI) hintsBtnUI.textContent = gameSettings.hints !== false ? 'ON' : 'OFF';
        const arBtnUI = document.getElementById('settings-autorestart');
        if (arBtnUI) arBtnUI.textContent = gameSettings.autoRestart !== false ? 'ON' : 'OFF';
        showScreen('settings');
    });

    document.getElementById('btn-back-settings').addEventListener('click', () => {
        playSound('click');
        showScreen('menu');
    });

    // Settings controls
    const volSlider = document.getElementById('settings-volume');
    if (volSlider) {
        volSlider.addEventListener('input', () => {
            gameSettings.volume = parseInt(volSlider.value);
            if (masterGainNode) masterGainNode.gain.value = gameSettings.volume / 100;
            try { localStorage.setItem('parkour_settings', JSON.stringify(gameSettings)); } catch(e) {}
        });
    }

    const partBtn = document.getElementById('settings-particles');
    if (partBtn) {
        partBtn.addEventListener('click', () => {
            playSound('click');
            gameSettings.particles = !gameSettings.particles;
            partBtn.textContent = gameSettings.particles ? 'HIGH' : 'LOW';
            try { localStorage.setItem('parkour_settings', JSON.stringify(gameSettings)); } catch(e) {}
        });
    }

    const shakeBtn = document.getElementById('settings-shake');
    if (shakeBtn) {
        shakeBtn.addEventListener('click', () => {
            playSound('click');
            gameSettings.shake = !gameSettings.shake;
            shakeBtn.textContent = gameSettings.shake ? 'ON' : 'OFF';
            try { localStorage.setItem('parkour_settings', JSON.stringify(gameSettings)); } catch(e) {}
        });
    }

    const minimapBtn = document.getElementById('settings-minimap');
    if (minimapBtn) {
        minimapBtn.addEventListener('click', () => {
            playSound('click');
            gameSettings.minimap = !gameSettings.minimap;
            minimapBtn.textContent = gameSettings.minimap ? 'ON' : 'OFF';
            try { localStorage.setItem('parkour_settings', JSON.stringify(gameSettings)); } catch(e) {}
        });
    }

    // Colorblind toggle
    const cbBtn = document.getElementById('settings-colorblind');
    if (cbBtn) {
        cbBtn.textContent = gameSettings.colorblind ? 'ON' : 'OFF';
        cbBtn.addEventListener('click', () => {
            playSound('click');
            gameSettings.colorblind = !gameSettings.colorblind;
            cbBtn.textContent = gameSettings.colorblind ? 'ON' : 'OFF';
            document.body.classList.toggle('colorblind-mode', gameSettings.colorblind);
            try { localStorage.setItem('parkour_settings', JSON.stringify(gameSettings)); } catch(e) {}
        });
    }

    // High contrast toggle
    const hcBtn = document.getElementById('settings-highcontrast');
    if (hcBtn) {
        hcBtn.textContent = gameSettings.highContrast ? 'ON' : 'OFF';
        hcBtn.addEventListener('click', () => {
            playSound('click');
            gameSettings.highContrast = !gameSettings.highContrast;
            hcBtn.textContent = gameSettings.highContrast ? 'ON' : 'OFF';
            document.body.classList.toggle('high-contrast-mode', gameSettings.highContrast);
            try { localStorage.setItem('parkour_settings', JSON.stringify(gameSettings)); } catch(e) {}
        });
    }

    // Hints toggle
    const hintsBtn = document.getElementById('settings-hints');
    if (hintsBtn) {
        hintsBtn.textContent = gameSettings.hints !== false ? 'ON' : 'OFF';
        hintsBtn.addEventListener('click', () => {
            playSound('click');
            gameSettings.hints = !gameSettings.hints;
            hintsBtn.textContent = gameSettings.hints ? 'ON' : 'OFF';
            try { localStorage.setItem('parkour_settings', JSON.stringify(gameSettings)); } catch(e) {}
        });
    }

    // Auto restart toggle
    const arBtn = document.getElementById('settings-autorestart');
    if (arBtn) {
        arBtn.textContent = gameSettings.autoRestart !== false ? 'ON' : 'OFF';
        arBtn.addEventListener('click', () => {
            playSound('click');
            gameSettings.autoRestart = !gameSettings.autoRestart;
            arBtn.textContent = gameSettings.autoRestart ? 'ON' : 'OFF';
            try { localStorage.setItem('parkour_settings', JSON.stringify(gameSettings)); } catch(e) {}
        });
    }

    // Export/Import/Reset
    document.getElementById('btn-export-save').addEventListener('click', () => {
        playSound('click');
        exportSave();
    });

    document.getElementById('btn-import-save').addEventListener('click', () => {
        playSound('click');
        document.getElementById('import-file').click();
    });

    document.getElementById('import-file').addEventListener('change', (e) => {
        if (e.target.files[0]) importSave(e.target.files[0]);
    });

    document.getElementById('btn-reset-progress').addEventListener('click', () => {
        playSound('click');
        if (confirm('Are you sure? This will erase ALL progress!')) {
            if (confirm('Really? This cannot be undone!')) {
                const keys = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    if (k && k.startsWith('parkour_')) keys.push(k);
                }
                keys.forEach(k => localStorage.removeItem(k));
                location.reload();
            }
        }
    });

    // Achievements button
    document.getElementById('btn-achievements').addEventListener('click', () => {
        playSound('click');
        populateAchievements();
        showScreen('achievements');
    });

    document.getElementById('btn-back-achievements').addEventListener('click', () => {
        playSound('click');
        showScreen('menu');
    });

    // Skins button
    document.getElementById('btn-skins').addEventListener('click', () => {
        playSound('click');
        populateSkins();
        showScreen('skins');
    });

    document.getElementById('btn-back-skins').addEventListener('click', () => {
        playSound('click');
        showScreen('menu');
    });

    // Daily challenge button
    document.getElementById('btn-daily').addEventListener('click', () => {
        initAudio();
        playSound('click');
        startDailyChallenge();
    });

    // Endless mode button — show difficulty picker first
    document.getElementById('btn-endless').addEventListener('click', () => {
        initAudio();
        playSound('click');
        pendingAction = 'endless';
        showScreen('difficulty');
    });

    // Practice mode toggle (pause menu)
    const practiceBtn = document.getElementById('btn-practice-toggle');
    if (practiceBtn) {
        practiceBtn.addEventListener('click', () => {
            playSound('click');
            practiceMode = !practiceMode;
            practiceBtn.textContent = practiceMode ? 'PRACTICE: ON' : 'PRACTICE: OFF';
            const badge = document.getElementById('practice-badge');
            if (badge) badge.classList.toggle('hidden', !practiceMode);
        });
    }

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
        if (countdownTimer > 0) {
            countdownActive = true;
            gameState = 'countdown';
        } else {
            gameState = 'playing';
        }
        startMusic();
        document.getElementById('pause-overlay').classList.add('hidden');
    });

    // Checkpoint restart from pause
    document.getElementById('btn-checkpoint-restart').addEventListener('click', () => {
        playSound('click');
        document.getElementById('pause-overlay').classList.add('hidden');
        if (lastCheckpoint) {
            respawnAtCheckpoint();
            startMusic();
        }
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
        playSound('click');
        document.getElementById('pause-overlay').classList.add('hidden');
        if (endlessMode) {
            endlessMode = false;
            startEndlessMode();
        } else if (currentLevel === -2) {
            startDailyChallenge();
        } else if (currentLevel >= 0) {
            loadLevel(currentLevel);
            startMusic();
            startCountdown(() => {});
        }
    });

    document.getElementById('btn-quit').addEventListener('click', () => {
        playSound('click');
        document.getElementById('pause-overlay').classList.add('hidden');
        endlessMode = false;
        gameState = 'menu';
        stopMusic();
        showScreen('menu');
        updateMenuStars();
    });

    // Complete overlay
    document.getElementById('btn-next').addEventListener('click', () => {
        playSound('click');
        document.getElementById('complete-overlay').classList.add('hidden');
        if (currentLevel + 1 < LEVELS.length) {
            doScreenWipe(() => startLevel(currentLevel + 1), 'LEVEL ' + (currentLevel + 2));
        }
    });

    document.getElementById('btn-replay').addEventListener('click', () => {
        playSound('click');
        document.getElementById('complete-overlay').classList.add('hidden');
        if (currentLevel === -2) {
            startDailyChallenge();
        } else if (currentLevel >= 0) {
            doScreenWipe(() => startLevel(currentLevel), 'LEVEL ' + (currentLevel + 1));
        }
    });

    document.getElementById('btn-quit2').addEventListener('click', () => {
        playSound('click');
        document.getElementById('complete-overlay').classList.add('hidden');
        endlessMode = false;
        gameState = 'menu';
        stopMusic();
        showScreen('menu');
        updateMenuStars();
    });

    // Death overlay
    document.getElementById('btn-retry').addEventListener('click', () => {
        playSound('click');
        autoRestartActive = false;
        document.getElementById('death-overlay').classList.add('hidden');
        if (endlessMode) {
            endlessMode = false;
            startEndlessMode();
        } else if (currentLevel === -2) {
            startDailyChallenge();
        } else if (currentLevel >= 0) {
            loadLevel(currentLevel);
            startCountdown(() => {});
        }
    });

    document.getElementById('btn-quit3').addEventListener('click', () => {
        playSound('click');
        autoRestartActive = false;
        document.getElementById('death-overlay').classList.add('hidden');
        endlessMode = false;
        gameState = 'menu';
        stopMusic();
        showScreen('menu');
        updateMenuStars();
    });

    // Editor buttons
    document.getElementById('btn-test-level').addEventListener('click', () => {
        initAudio();
        playSound('click');
        // Validate: check for at least one platform
        const hasPlatform = editorObjects.some(o => o.type === 'platform' || o.type === 'moving' || o.type === 'falling');
        if (!hasPlatform) {
            alert('Place at least one platform before testing!');
            return;
        }
        buildEditorLevel();
        resetPlayer();
        levelTimer = 0;
        timerStarted = false;
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
        initWeather();
        startWind();
        document.getElementById('pause-overlay').classList.add('hidden');
        document.getElementById('complete-overlay').classList.add('hidden');
        document.getElementById('death-overlay').classList.add('hidden');
        unlockAchievement('editor_test');
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
    updateMenuStars();
    // Apply saved accessibility modes
    if (gameSettings.colorblind) document.body.classList.add('colorblind-mode');
    if (gameSettings.highContrast) document.body.classList.add('high-contrast-mode');
    animateTitle();
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
