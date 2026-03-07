// ============================================
// PARKOUR RUSH - Complete Game Engine
// A fast-paced 2D parkour platformer
// ============================================

// ---------- CONSTANTS ----------
const TILE = 32;                // Grid tile size in pixels
const GRAVITY = 0.55;           // Downward acceleration
const MAX_FALL = 12;            // Terminal velocity
const RUN_SPEED = 5;            // Horizontal run speed
const JUMP_FORCE = -10.5;       // Jump velocity
const WALL_JUMP_X = 7;          // Horizontal wall jump force
const WALL_JUMP_Y = -9;        // Vertical wall jump force
const DASH_SPEED = 14;          // Dash velocity
const DASH_DURATION = 8;        // Dash frames
const DASH_COOLDOWN = 30;       // Frames between dashes
const SLIDE_SPEED = 6;          // Slide velocity
const SLIDE_DURATION = 20;      // Slide frames
const PLAYER_W = 20;            // Player width
const PLAYER_H = 32;            // Player height (normal)
const PLAYER_H_SLIDE = 18;     // Player height (sliding)
const COYOTE_TIME = 6;          // Frames of grace after leaving ground
const JUMP_BUFFER = 6;          // Frames to buffer a jump input
const WORLD_W = 200;            // Level width in tiles
const WORLD_H = 20;             // Level height in tiles
const CAM_SMOOTH = 0.1;         // Camera follow smoothing

// ---------- GAME STATE ----------
let canvas, ctx, editorCanvas, editorCtx;
let currentScreen = 'menu';
let gameState = 'menu'; // menu, playing, paused, dead, complete
let currentLevel = 0;
let levelTimer = 0;
let bestTimes = {};
let unlockedLevel = 0;
let soundEnabled = true;
let keys = {};
let prevKeys = {};

// Player state
let player = {};
let particles = [];
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

// Editor state
let editorTool = 'platform';
let editorCamera = { x: 0, y: 0 };
let editorDragging = false;
let editorObjects = [];
let editorSpawn = { x: 2, y: 16 };
let editorGoal = { x: 190, y: 16 };

// ---------- AUDIO (Web Audio API - free browser synth) ----------
let audioCtx = null;

// Initialize audio context on first user interaction
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Play a simple synthesized sound effect
function playSound(type) {
    if (!soundEnabled || !audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        const now = audioCtx.currentTime;

        switch (type) {
            case 'jump':
                osc.type = 'square';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
            case 'dash':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
            case 'walljump':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
                break;
            case 'slide':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.linearRampToValueAtTime(60, now + 0.2);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
                break;
            case 'boost':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
                gain.gain.setValueAtTime(0.07, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
            case 'death':
                osc.type = 'square';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
                break;
            case 'complete':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523, now);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                osc.start(now);
                osc.stop(now + 0.6);
                // Second note
                const osc2 = audioCtx.createOscillator();
                const gain2 = audioCtx.createGain();
                osc2.connect(gain2);
                gain2.connect(audioCtx.destination);
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(659, now + 0.15);
                gain2.gain.setValueAtTime(0.08, now + 0.15);
                gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
                osc2.start(now + 0.15);
                osc2.stop(now + 0.7);
                // Third note
                const osc3 = audioCtx.createOscillator();
                const gain3 = audioCtx.createGain();
                osc3.connect(gain3);
                gain3.connect(audioCtx.destination);
                osc3.type = 'sine';
                osc3.frequency.setValueAtTime(784, now + 0.3);
                gain3.gain.setValueAtTime(0.1, now + 0.3);
                gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
                osc3.start(now + 0.3);
                osc3.stop(now + 0.9);
                break;
        }
    } catch (e) {
        // Audio errors are non-critical, silently ignore
    }
}

// ---------- PARTICLE SYSTEM ----------
// Lightweight particles for visual flair on jumps, dashes, and landings

function spawnParticles(x, y, count, color, spread, speedMul) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * spread * (speedMul || 1),
            vy: (Math.random() - 0.8) * spread * (speedMul || 1),
            life: 15 + Math.random() * 15,
            maxLife: 30,
            size: 2 + Math.random() * 3,
            color: color
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // slight gravity on particles
        p.life--;
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    for (const p of particles) {
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(
            p.x - camera.x - p.size / 2,
            p.y - camera.y - p.size / 2,
            p.size,
            p.size
        );
    }
    ctx.globalAlpha = 1;
}

// ---------- PLAYER ----------

function resetPlayer() {
    player = {
        x: spawnPoint.x,
        y: spawnPoint.y,
        vx: 0,
        vy: 0,
        w: PLAYER_W,
        h: PLAYER_H,
        onGround: false,
        onWallLeft: false,
        onWallRight: false,
        facing: 1,           // 1 = right, -1 = left
        coyoteTimer: 0,      // frames since leaving ground
        jumpBuffer: 0,       // frames since jump pressed
        dashTimer: 0,        // frames remaining in dash
        dashCooldown: 0,     // frames until dash available
        dashDir: 1,          // dash direction
        slideTimer: 0,       // frames remaining in slide
        canClimb: false,     // near a ledge to climb
        climbTimer: 0,       // climbing animation
        isSliding: false,
        isDashing: false,
        wasOnGround: false,  // for landing detection
        ridingPlatform: null // reference to moving platform player is on
    };
}

// ---------- LEVEL DEFINITIONS ----------
// Each level is a function that populates the global arrays.
// Tile coords: x, y in grid units (multiply by TILE for pixels)
// Platform format: { x, y, w, h } in pixels
// Spike format: { x, y, w, h } in pixels (deadly zone)
// Moving platform: { x, y, w, h, dx, dy, speed, range, t }
// Falling platform: { x, y, w, h, triggered, fallTimer, fallen, origY }
// Boost pad: { x, y, w, h, dir } dir: 1=right, -1=left
// Wall: { x, y, w, h } (wall-jumpable surface)
// Goal: { x, y, w, h }

// Helper: create a platform from tile coordinates
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
        t: 0, startX: tx * TILE, startY: ty * TILE
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

const LEVELS = [
    // ----- LEVEL 1: Tutorial Run -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(58, 17);
        platforms = [
            plat(0, 18, 15, 2),    // starting ground
            plat(17, 18, 6, 2),    // gap jump
            plat(25, 18, 6, 2),    // another jump
            plat(33, 16, 5, 1),    // higher platform
            plat(40, 18, 8, 2),    // landing
            plat(50, 18, 12, 2),   // final stretch
        ];
        spikes = [];
        movingPlatforms = [];
        fallingPlatforms = [];
        boostPads = [];
        walls = [];
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
    },

    // ----- LEVEL 3: Dash Training -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(70, 17);
        platforms = [
            plat(0, 18, 10, 2),
            plat(17, 18, 4, 2),    // need dash to clear gap
            plat(28, 18, 4, 2),
            plat(39, 18, 4, 2),
            plat(50, 16, 4, 1),
            plat(60, 18, 14, 2),
        ];
        boostPads = [
            boost(62, 17, 3, 1),
        ];
        spikes = [
            spike(12, 19, 4, 1),   // pit spikes
            spike(23, 19, 4, 1),
            spike(34, 19, 4, 1),
        ];
        walls = [];
        movingPlatforms = [];
        fallingPlatforms = [];
    },

    // ----- LEVEL 4: Slide & Spikes -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(65, 17);
        platforms = [
            plat(0, 18, 20, 2),
            // Low ceiling section - must slide
            plat(8, 15, 10, 1),    // ceiling
            plat(22, 18, 10, 2),
            plat(22, 14, 10, 1),   // another ceiling
            plat(34, 18, 8, 2),
            plat(44, 18, 6, 2),
            plat(55, 18, 14, 2),
        ];
        spikes = [
            spike(10, 17, 6, 1),  // spikes under ceiling
            spike(24, 17, 6, 1),
            spike(42, 19, 2, 1),
        ];
        walls = [];
        movingPlatforms = [];
        fallingPlatforms = [];
        boostPads = [];
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
            moving(12, 16, 4, 1, 0, 1, 0.8, 3),  // vertical
            moving(22, 14, 4, 1, 1, 0, 1, 4),     // horizontal
            moving(35, 12, 4, 1, 0, 1, 1, 3),     // vertical
            moving(45, 10, 4, 1, 1, 0, 0.6, 5),   // horizontal
        ];
        spikes = [
            spike(0, 19, 80, 1),  // death pit
        ];
        walls = [];
        fallingPlatforms = [];
        boostPads = [];
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
    },
];

// ---------- LEVEL LOADING ----------

function loadLevel(index) {
    // Clear all level data
    platforms = [];
    spikes = [];
    movingPlatforms = [];
    fallingPlatforms = [];
    boostPads = [];
    walls = [];
    goalZone = null;
    particles = [];

    // Reset falling platforms on reload
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
    }

    resetPlayer();
    levelTimer = 0;
    camera.x = player.x - canvas.width / 2;
    camera.y = player.y - canvas.height / 2;

    // Update HUD
    document.getElementById('hud-level').textContent = 'Level ' + (index + 1);
    const best = bestTimes[index];
    document.getElementById('hud-best').textContent = best ? 'Best: ' + best.toFixed(2) + 's' : 'Best: --';
}

// ---------- COLLISION HELPERS ----------

// Axis-Aligned Bounding Box overlap check
function aabb(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
}

// Get all solid rectangles (static + moving + non-fallen falling platforms)
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

function updatePlayer() {
    const p = player;
    const currentH = p.isSliding ? PLAYER_H_SLIDE : PLAYER_H;
    p.h = currentH;

    // Track whether we were on ground last frame (for landing effects)
    p.wasOnGround = p.onGround;

    // ---- Horizontal movement ----
    let inputX = 0;
    if (keys['KeyA'] || keys['ArrowLeft']) inputX = -1;
    if (keys['KeyD'] || keys['ArrowRight']) inputX = 1;

    if (!p.isDashing && !p.isSliding && p.climbTimer <= 0) {
        p.vx = inputX * RUN_SPEED;
        if (inputX !== 0) p.facing = inputX;
    }

    // ---- Dash ----
    if (p.dashCooldown > 0) p.dashCooldown--;

    if ((keys['ShiftLeft'] || keys['ShiftRight']) &&
        !(prevKeys['ShiftLeft'] || prevKeys['ShiftRight']) &&
        !p.onGround && p.dashTimer <= 0 && p.dashCooldown <= 0) {
        p.isDashing = true;
        p.dashTimer = DASH_DURATION;
        p.dashCooldown = DASH_COOLDOWN;
        p.dashDir = p.facing;
        p.vy = 0; // freeze vertical
        playSound('dash');
        spawnParticles(p.x + p.w / 2, p.y + p.h / 2, 12, '#ff4081', 4, 1.5);
    }

    if (p.dashTimer > 0) {
        p.vx = DASH_SPEED * p.dashDir;
        p.vy = 0;
        p.dashTimer--;
        if (p.dashTimer <= 0) {
            p.isDashing = false;
            p.vx = inputX * RUN_SPEED;
        }
        // Dash trail particles
        spawnParticles(p.x + p.w / 2, p.y + p.h / 2, 2, '#ff4081', 2, 0.5);
    }

    // ---- Slide ----
    if ((keys['KeyS'] || keys['ArrowDown']) &&
        !(prevKeys['KeyS'] || prevKeys['ArrowDown']) &&
        p.onGround && !p.isSliding && Math.abs(p.vx) > 1) {
        p.isSliding = true;
        p.slideTimer = SLIDE_DURATION;
        // Adjust position since hitbox shrinks
        p.y += PLAYER_H - PLAYER_H_SLIDE;
        playSound('slide');
    }

    if (p.slideTimer > 0 && p.isSliding) {
        p.vx = SLIDE_SPEED * p.facing;
        p.slideTimer--;
        // Slide particles
        if (p.onGround) {
            spawnParticles(p.x + p.w / 2, p.y + p.h, 1, '#00e5ff', 2, 0.3);
        }
        if (p.slideTimer <= 0) {
            p.isSliding = false;
            // Try to stand up - check if there's room
            const testY = p.y - (PLAYER_H - PLAYER_H_SLIDE);
            const testBox = { x: p.x, y: testY, w: p.w, h: PLAYER_H };
            let blocked = false;
            for (const s of getAllSolids()) {
                if (aabb(testBox, s)) { blocked = true; break; }
            }
            if (!blocked) {
                p.y = testY;
            } else {
                // Stay sliding if can't stand
                p.isSliding = true;
                p.slideTimer = 5;
            }
        }
    }

    // ---- Ledge Climb ----
    if (keys['KeyE'] && p.canClimb && p.climbTimer <= 0 && !p.onGround) {
        p.climbTimer = 10;
        p.vy = -6;
        p.vx = p.facing * 3;
    }
    if (p.climbTimer > 0) {
        p.climbTimer--;
    }

    // ---- Gravity ----
    if (!p.isDashing) {
        p.vy += GRAVITY;
        if (p.vy > MAX_FALL) p.vy = MAX_FALL;
    }

    // ---- Coyote time & jump buffer ----
    if (p.onGround) {
        p.coyoteTimer = COYOTE_TIME;
        p.dashCooldown = 0; // reset dash when touching ground
    } else {
        if (p.coyoteTimer > 0) p.coyoteTimer--;
    }

    if ((keys['KeyW'] || keys['Space'] || keys['ArrowUp']) &&
        !(prevKeys['KeyW'] || prevKeys['Space'] || prevKeys['ArrowUp'])) {
        p.jumpBuffer = JUMP_BUFFER;
    }
    if (p.jumpBuffer > 0) p.jumpBuffer--;

    // ---- Jump ----
    if (p.jumpBuffer > 0 && p.coyoteTimer > 0 && !p.isDashing) {
        p.vy = JUMP_FORCE;
        p.onGround = false;
        p.coyoteTimer = 0;
        p.jumpBuffer = 0;
        // Cancel slide on jump
        if (p.isSliding) {
            p.isSliding = false;
            p.slideTimer = 0;
            p.y -= (PLAYER_H - PLAYER_H_SLIDE);
        }
        playSound('jump');
        spawnParticles(p.x + p.w / 2, p.y + p.h, 8, '#00e5ff', 3, 1);
    }

    // ---- Wall Jump ----
    if (p.jumpBuffer > 0 && !p.onGround && p.coyoteTimer <= 0 && !p.isDashing) {
        if (p.onWallLeft) {
            p.vx = WALL_JUMP_X;
            p.vy = WALL_JUMP_Y;
            p.facing = 1;
            p.jumpBuffer = 0;
            playSound('walljump');
            spawnParticles(p.x, p.y + p.h / 2, 8, '#00ff88', 3, 1);
        } else if (p.onWallRight) {
            p.vx = -WALL_JUMP_X;
            p.vy = WALL_JUMP_Y;
            p.facing = -1;
            p.jumpBuffer = 0;
            playSound('walljump');
            spawnParticles(p.x + p.w, p.y + p.h / 2, 8, '#00ff88', 3, 1);
        }
    }

    // ---- Wall slide (slow fall when touching wall) ----
    if (!p.onGround && (p.onWallLeft || p.onWallRight) && p.vy > 1 && !p.isDashing) {
        p.vy = Math.min(p.vy, 2); // slow descent
        // Wall slide particles
        if (Math.random() < 0.3) {
            const wx = p.onWallLeft ? p.x : p.x + p.w;
            spawnParticles(wx, p.y + p.h / 2, 1, '#aaa', 1, 0.3);
        }
    }

    // ---- Move & collide ----
    const solids = getAllSolids();

    // Horizontal collision
    p.x += p.vx;
    p.onWallLeft = false;
    p.onWallRight = false;
    p.canClimb = false;

    const pBox = { x: p.x, y: p.y, w: p.w, h: p.h };

    for (const s of solids) {
        if (aabb(pBox, s)) {
            if (p.vx > 0) {
                p.x = s.x - p.w;
                p.onWallRight = true;
            } else if (p.vx < 0) {
                p.x = s.x + s.w;
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
        const checkDir = p.onWallLeft ? -1 : 1;
        const wallEdgeX = p.onWallLeft ? p.x - 2 : p.x + p.w + 2;
        // Check if there's empty space above the wall (ledge)
        const aboveBox = { x: wallEdgeX - 4, y: p.y - TILE, w: 8, h: TILE };
        let blockedAbove = false;
        for (const s of solids) {
            if (aabb(aboveBox, s)) { blockedAbove = true; break; }
        }
        if (!blockedAbove && p.vy >= 0) {
            p.canClimb = true;
        }
    }

    // Vertical collision
    p.y += p.vy;
    p.onGround = false;
    p.ridingPlatform = null;
    pBox.x = p.x;
    pBox.y = p.y;

    for (const s of solids) {
        if (aabb(pBox, s)) {
            if (p.vy > 0) {
                p.y = s.y - p.h;
                p.onGround = true;
                // Check if this is a moving platform
                for (const mp of movingPlatforms) {
                    if (mp === s) p.ridingPlatform = mp;
                }
                // Landing particles
                if (!p.wasOnGround && p.vy > 3) {
                    spawnParticles(p.x + p.w / 2, p.y + p.h, 6, '#fff', 3, 0.8);
                }
            } else if (p.vy < 0) {
                p.y = s.y + s.h;
            }
            p.vy = 0;
        }
    }

    // ---- Falling platforms trigger ----
    for (const fp of fallingPlatforms) {
        if (fp.fallen) continue;
        // Check if player is standing on this platform
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
        }
    }

    // ---- Spike collision (death) ----
    for (const s of spikes) {
        if (aabb({ x: p.x + 2, y: p.y + 2, w: p.w - 4, h: p.h - 4 }, s)) {
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
}

// ---- Update moving platforms ----
function updateMovingPlatforms() {
    for (const mp of movingPlatforms) {
        const prevX = mp.x;
        const prevY = mp.y;
        mp.t += mp.speed * 0.02;
        mp.x = mp.startX + Math.sin(mp.t) * mp.range * mp.dx;
        mp.y = mp.startY + Math.sin(mp.t) * mp.range * mp.dy;

        // Move player with platform if riding
        if (player.ridingPlatform === mp) {
            player.x += mp.x - prevX;
            player.y += mp.y - prevY;
        }
    }
}

// ---- Update falling platforms ----
function updateFallingPlatforms() {
    for (const fp of fallingPlatforms) {
        if (fp.fallen) continue;
        if (fp.triggered) {
            fp.fallTimer++;
            // Shake before falling
            if (fp.fallTimer < 30) {
                fp.x = fp.x + (Math.random() - 0.5) * 2;
            } else {
                // Fall
                fp.vy += GRAVITY;
                fp.y += fp.vy;
                if (fp.y > WORLD_H * TILE + 100) {
                    fp.fallen = true;
                }
            }
        }
    }
}

function killPlayer() {
    gameState = 'dead';
    playSound('death');
    spawnParticles(player.x + player.w / 2, player.y + player.h / 2, 20, '#ff4444', 6, 2);
    document.getElementById('death-overlay').classList.remove('hidden');
}

function completeLevel() {
    gameState = 'complete';
    playSound('complete');

    const time = levelTimer / 60; // convert frames to seconds
    const isNewRecord = !bestTimes[currentLevel] || time < bestTimes[currentLevel];

    if (isNewRecord) {
        bestTimes[currentLevel] = time;
        saveBestTimes();
    }

    // Unlock next level
    if (currentLevel + 1 > unlockedLevel && currentLevel + 1 < LEVELS.length) {
        unlockedLevel = currentLevel + 1;
        localStorage.setItem('parkour_unlocked', unlockedLevel);
    }

    document.getElementById('complete-time').textContent = 'Time: ' + time.toFixed(2) + 's';
    document.getElementById('complete-best').textContent = 'Best: ' + bestTimes[currentLevel].toFixed(2) + 's';

    const newRecordEl = document.getElementById('complete-new-record');
    if (isNewRecord) {
        newRecordEl.classList.remove('hidden');
    } else {
        newRecordEl.classList.add('hidden');
    }

    // Hide next button if last level
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

function updateCamera() {
    const targetX = player.x - canvas.width / 2 + player.w / 2;
    const targetY = player.y - canvas.height / 2 + player.h / 2;
    camera.x += (targetX - camera.x) * CAM_SMOOTH;
    camera.y += (targetY - camera.y) * CAM_SMOOTH;

    // Clamp vertical camera
    if (camera.y > (WORLD_H - 2) * TILE - canvas.height) {
        camera.y = (WORLD_H - 2) * TILE - canvas.height;
    }
}

// ---------- RENDERING ----------

function drawBackground() {
    // Dark grid background with parallax
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid
    ctx.strokeStyle = '#151525';
    ctx.lineWidth = 1;
    const gridSize = 64;
    const offsetX = (-camera.x * 0.3) % gridSize;
    const offsetY = (-camera.y * 0.3) % gridSize;

    for (let x = offsetX; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = offsetY; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawPlatforms() {
    // Static platforms
    for (const p of platforms) {
        const sx = p.x - camera.x;
        const sy = p.y - camera.y;
        // Skip if off screen
        if (sx + p.w < 0 || sx > canvas.width || sy + p.h < 0 || sy > canvas.height) continue;

        ctx.fillStyle = '#2a2a4a';
        ctx.fillRect(sx, sy, p.w, p.h);
        // Top edge highlight
        ctx.fillStyle = '#4a4a7a';
        ctx.fillRect(sx, sy, p.w, 3);
        // Pixel grid lines
        ctx.strokeStyle = '#1a1a3a';
        ctx.lineWidth = 1;
        for (let gx = 0; gx < p.w; gx += TILE) {
            ctx.beginPath();
            ctx.moveTo(sx + gx, sy);
            ctx.lineTo(sx + gx, sy + p.h);
            ctx.stroke();
        }
    }
}

function drawWalls() {
    for (const w of walls) {
        const sx = w.x - camera.x;
        const sy = w.y - camera.y;
        if (sx + w.w < 0 || sx > canvas.width || sy + w.h < 0 || sy > canvas.height) continue;

        ctx.fillStyle = '#2a3a2a';
        ctx.fillRect(sx, sy, w.w, w.h);
        // Side highlight
        ctx.fillStyle = '#3a5a3a';
        ctx.fillRect(sx, sy, 3, w.h);
        ctx.fillRect(sx + w.w - 3, sy, 3, w.h);
        // Grid lines
        ctx.strokeStyle = '#1a2a1a';
        ctx.lineWidth = 1;
        for (let gy = 0; gy < w.h; gy += TILE) {
            ctx.beginPath();
            ctx.moveTo(sx, sy + gy);
            ctx.lineTo(sx + w.w, sy + gy);
            ctx.stroke();
        }
    }
}

function drawSpikes() {
    ctx.fillStyle = '#ff4444';
    for (const s of spikes) {
        const sx = s.x - camera.x;
        const sy = s.y - camera.y;
        if (sx + s.w < 0 || sx > canvas.width || sy + s.h < 0 || sy > canvas.height) continue;

        // Draw triangular spikes
        const spikeW = 12;
        for (let i = 0; i < s.w; i += spikeW) {
            ctx.beginPath();
            ctx.moveTo(sx + i, sy + s.h);
            ctx.lineTo(sx + i + spikeW / 2, sy + 2);
            ctx.lineTo(sx + i + spikeW, sy + s.h);
            ctx.fill();
        }
    }
}

function drawMovingPlatforms() {
    for (const mp of movingPlatforms) {
        const sx = mp.x - camera.x;
        const sy = mp.y - camera.y;
        if (sx + mp.w < -50 || sx > canvas.width + 50 || sy + mp.h < -50 || sy > canvas.height + 50) continue;

        ctx.fillStyle = '#4a3a6a';
        ctx.fillRect(sx, sy, mp.w, mp.h);
        ctx.fillStyle = '#7a5aaa';
        ctx.fillRect(sx, sy, mp.w, 3);

        // Dashed line showing path
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#4a3a6a44';
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
        if (sx + fp.w < 0 || sx > canvas.width || sy + fp.h < 0 || sy > canvas.height) continue;

        // Flash red when triggered
        if (fp.triggered && fp.fallTimer < 30) {
            ctx.fillStyle = fp.fallTimer % 6 < 3 ? '#6a3a3a' : '#4a2a2a';
        } else {
            ctx.fillStyle = '#4a3a2a';
        }
        ctx.fillRect(sx, sy, fp.w, fp.h);
        ctx.fillStyle = '#7a5a3a';
        ctx.fillRect(sx, sy, fp.w, 3);
        // Crack lines
        ctx.strokeStyle = '#3a2a1a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx + fp.w * 0.3, sy);
        ctx.lineTo(sx + fp.w * 0.5, sy + fp.h);
        ctx.moveTo(sx + fp.w * 0.7, sy);
        ctx.lineTo(sx + fp.w * 0.4, sy + fp.h);
        ctx.stroke();
    }
}

function drawBoostPads() {
    for (const bp of boostPads) {
        const sx = bp.x - camera.x;
        const sy = bp.y - camera.y;
        if (sx + bp.w < 0 || sx > canvas.width) continue;

        ctx.fillStyle = '#ffd700';
        ctx.fillRect(sx, sy, bp.w, bp.h);
        // Arrow indicator
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

function drawGoal() {
    if (!goalZone) return;
    const sx = goalZone.x - camera.x;
    const sy = goalZone.y - camera.y;

    // Pulsing glow
    const pulse = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(0, 229, 255, ${0.15 * pulse})`;
    ctx.fillRect(sx - 4, sy - 4, goalZone.w + 8, goalZone.h + 8);

    ctx.fillStyle = `rgba(0, 229, 255, ${0.3 * pulse})`;
    ctx.fillRect(sx, sy, goalZone.w, goalZone.h);

    // Flag/marker
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(sx + goalZone.w / 2 - 2, sy, 4, goalZone.h);
    ctx.fillStyle = '#ff4081';
    ctx.beginPath();
    ctx.moveTo(sx + goalZone.w / 2 + 2, sy);
    ctx.lineTo(sx + goalZone.w / 2 + 20, sy + 10);
    ctx.lineTo(sx + goalZone.w / 2 + 2, sy + 20);
    ctx.fill();
}

function drawPlayer() {
    const p = player;
    const sx = p.x - camera.x;
    const sy = p.y - camera.y;

    // Player body (pixel art style)
    if (p.isDashing) {
        ctx.fillStyle = '#ff4081';
    } else if (p.isSliding) {
        ctx.fillStyle = '#00b8d4';
    } else if (!p.onGround) {
        ctx.fillStyle = '#33ecff';
    } else {
        ctx.fillStyle = '#00e5ff';
    }
    ctx.fillRect(sx, sy, p.w, p.h);

    // Eyes
    const eyeY = sy + 6;
    const eyeX = p.facing > 0 ? sx + 12 : sx + 4;
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(eyeX, eyeY, 4, 4);

    // Outline
    ctx.strokeStyle = '#ffffff33';
    ctx.lineWidth = 1;
    ctx.strokeRect(sx, sy, p.w, p.h);

    // Climb indicator
    if (p.canClimb) {
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(sx + p.w / 2 - 3, sy - 8, 6, 4);
    }
}

// ---------- MAIN GAME LOOP ----------

function gameLoop() {
    requestAnimationFrame(gameLoop);

    if (gameState === 'playing') {
        levelTimer++;
        updatePlayer();
        updateMovingPlatforms();
        updateFallingPlatforms();
        updateCamera();

        // Update timer HUD
        document.getElementById('hud-timer').textContent =
            (levelTimer / 60).toFixed(2) + 's';
    }

    updateParticles();

    // Render
    if (currentScreen === 'game') {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        drawBackground();
        drawGoal();
        drawPlatforms();
        drawWalls();
        drawSpikes();
        drawMovingPlatforms();
        drawFallingPlatforms();
        drawBoostPads();
        drawPlayer();
        drawParticles();
    }

    // Store previous keys for edge detection
    prevKeys = { ...keys };
}

// ---------- INPUT HANDLING ----------

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    initAudio(); // ensure audio context on first key

    // Restart
    if (e.code === 'KeyR' && gameState === 'playing') {
        loadLevel(currentLevel);
        gameState = 'playing';
    }

    // Pause
    if (e.code === 'Escape') {
        if (gameState === 'playing') {
            gameState = 'paused';
            document.getElementById('pause-overlay').classList.remove('hidden');
        } else if (gameState === 'paused') {
            gameState = 'playing';
            document.getElementById('pause-overlay').classList.add('hidden');
        }
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Prevent scrolling with game keys
window.addEventListener('keydown', (e) => {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
    }
});

// ---------- SAVE / LOAD ----------

function saveBestTimes() {
    localStorage.setItem('parkour_best', JSON.stringify(bestTimes));
}

function loadBestTimes() {
    try {
        const saved = localStorage.getItem('parkour_best');
        if (saved) bestTimes = JSON.parse(saved);
    } catch (e) {
        bestTimes = {};
    }
    unlockedLevel = parseInt(localStorage.getItem('parkour_unlocked') || '0');
}

// ---------- SCREEN MANAGEMENT ----------

function showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(name + '-screen').classList.add('active');
    currentScreen = name;
}

function populateLevelGrid() {
    const grid = document.getElementById('level-grid');
    grid.innerHTML = '';
    for (let i = 0; i < LEVELS.length; i++) {
        const tile = document.createElement('div');
        tile.className = 'level-tile';
        if (i > unlockedLevel) tile.classList.add('locked');
        if (bestTimes[i]) tile.classList.add('completed');

        tile.innerHTML = `
            <span class="level-num">${i + 1}</span>
            <span class="level-best">${bestTimes[i] ? bestTimes[i].toFixed(2) + 's' : '---'}</span>
        `;

        if (i <= unlockedLevel) {
            tile.addEventListener('click', () => {
                initAudio();
                startLevel(i);
            });
        }
        grid.appendChild(tile);
    }
}

function startLevel(index) {
    showScreen('game');
    loadLevel(index);
    gameState = 'playing';
    // Hide overlays
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
        const rect = editorCanvas.getBoundingClientRect();
        const mx = e.offsetX + editorCamera.x;
        const my = e.offsetY + editorCamera.y;
        const tx = Math.floor(mx / TILE);
        const ty = Math.floor(my / TILE);

        if (e.button === 2) {
            // Right click = pan
            lastRightClick = { x: e.clientX, y: e.clientY };
            return;
        }

        if (editorTool === 'spawn') {
            editorSpawn = { x: tx, y: ty };
        } else if (editorTool === 'goal') {
            editorGoal = { x: tx, y: ty };
        } else if (editorTool === 'erase') {
            // Remove object at this tile
            editorObjects = editorObjects.filter(o => {
                return !(tx >= o.tx && tx < o.tx + (o.tw || 1) &&
                         ty >= o.ty && ty < o.ty + (o.th || 1));
            });
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
            const rect = editorCanvas.getBoundingClientRect();
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
                tx: minX,
                ty: minY,
                tw: maxX - minX + 1,
                th: maxY - minY + 1
            });
        }

        isDrawing = false;
        dragStart = null;
    });

    editorCanvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Tool buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            editorTool = btn.dataset.tool;
        });
    });

    // Start editor render loop
    editorRenderLoop();
}

function editorRenderLoop() {
    if (currentScreen !== 'editor') {
        requestAnimationFrame(editorRenderLoop);
        return;
    }

    editorCanvas.width = editorCanvas.parentElement.clientWidth - 200;
    editorCanvas.height = window.innerHeight;

    const ectx = editorCtx;

    // Background
    ectx.fillStyle = '#0a0a0f';
    ectx.fillRect(0, 0, editorCanvas.width, editorCanvas.height);

    // Grid
    ectx.strokeStyle = '#151525';
    ectx.lineWidth = 1;
    const offX = -editorCamera.x % TILE;
    const offY = -editorCamera.y % TILE;
    for (let x = offX; x < editorCanvas.width; x += TILE) {
        ectx.beginPath();
        ectx.moveTo(x, 0);
        ectx.lineTo(x, editorCanvas.height);
        ectx.stroke();
    }
    for (let y = offY; y < editorCanvas.height; y += TILE) {
        ectx.beginPath();
        ectx.moveTo(0, y);
        ectx.lineTo(editorCanvas.width, y);
        ectx.stroke();
    }

    // Draw objects
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

        // Label
        ectx.fillStyle = '#fff8';
        ectx.font = '10px monospace';
        ectx.fillText(obj.type[0].toUpperCase(), sx + 2, sy + 12);
    }

    // Spawn point
    const spX = editorSpawn.x * TILE - editorCamera.x;
    const spY = editorSpawn.y * TILE - editorCamera.y;
    ectx.fillStyle = '#00e5ff';
    ectx.fillRect(spX + 6, spY, PLAYER_W, PLAYER_H);
    ectx.fillStyle = '#fff';
    ectx.font = '10px monospace';
    ectx.fillText('SPAWN', spX, spY - 4);

    // Goal point
    const gX = editorGoal.x * TILE - editorCamera.x;
    const gY = editorGoal.y * TILE - editorCamera.y;
    ectx.fillStyle = '#ff408177';
    ectx.fillRect(gX, gY - TILE, TILE * 2, TILE * 2);
    ectx.fillStyle = '#fff';
    ectx.fillText('GOAL', gX, gY - TILE - 4);

    requestAnimationFrame(editorRenderLoop);
}

// Build a playable level from editor objects
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
                    t: 0, startX: px, startY: py
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
    localStorage.setItem('parkour_custom_level', json);
    alert('Level saved to browser storage!');
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
    // Menu buttons
    document.getElementById('btn-play').addEventListener('click', () => {
        initAudio();
        startLevel(0);
    });

    document.getElementById('btn-levels').addEventListener('click', () => {
        populateLevelGrid();
        showScreen('level');
    });

    document.getElementById('btn-editor').addEventListener('click', () => {
        showScreen('editor');
    });

    document.getElementById('btn-controls').addEventListener('click', () => {
        showScreen('controls');
    });

    document.getElementById('btn-back-menu').addEventListener('click', () => {
        showScreen('menu');
    });

    document.getElementById('btn-back-controls').addEventListener('click', () => {
        showScreen('menu');
    });

    // Fullscreen
    document.getElementById('btn-fullscreen').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    });

    // Sound toggle
    document.getElementById('btn-sound-toggle').addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        document.getElementById('btn-sound-toggle').textContent =
            soundEnabled ? 'SOUND: ON' : 'SOUND: OFF';
    });

    // Pause overlay
    document.getElementById('btn-resume').addEventListener('click', () => {
        gameState = 'playing';
        document.getElementById('pause-overlay').classList.add('hidden');
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
        document.getElementById('pause-overlay').classList.add('hidden');
        loadLevel(currentLevel);
        gameState = 'playing';
    });

    document.getElementById('btn-quit').addEventListener('click', () => {
        document.getElementById('pause-overlay').classList.add('hidden');
        gameState = 'menu';
        showScreen('menu');
    });

    // Complete overlay
    document.getElementById('btn-next').addEventListener('click', () => {
        document.getElementById('complete-overlay').classList.add('hidden');
        if (currentLevel + 1 < LEVELS.length) {
            startLevel(currentLevel + 1);
        }
    });

    document.getElementById('btn-replay').addEventListener('click', () => {
        document.getElementById('complete-overlay').classList.add('hidden');
        startLevel(currentLevel);
    });

    document.getElementById('btn-quit2').addEventListener('click', () => {
        document.getElementById('complete-overlay').classList.add('hidden');
        gameState = 'menu';
        showScreen('menu');
    });

    // Death overlay
    document.getElementById('btn-retry').addEventListener('click', () => {
        document.getElementById('death-overlay').classList.add('hidden');
        loadLevel(currentLevel);
        gameState = 'playing';
    });

    document.getElementById('btn-quit3').addEventListener('click', () => {
        document.getElementById('death-overlay').classList.add('hidden');
        gameState = 'menu';
        showScreen('menu');
    });

    // Editor buttons
    document.getElementById('btn-test-level').addEventListener('click', () => {
        initAudio();
        buildEditorLevel();
        resetPlayer();
        levelTimer = 0;
        currentLevel = -1; // custom
        camera.x = player.x - canvas.width / 2;
        camera.y = player.y - canvas.height / 2;
        document.getElementById('hud-level').textContent = 'Custom';
        document.getElementById('hud-best').textContent = '';
        showScreen('game');
        gameState = 'playing';
        document.getElementById('pause-overlay').classList.add('hidden');
        document.getElementById('complete-overlay').classList.add('hidden');
        document.getElementById('death-overlay').classList.add('hidden');
    });

    document.getElementById('btn-save-level').addEventListener('click', saveEditorLevel);
    document.getElementById('btn-load-level').addEventListener('click', loadEditorLevel);

    document.getElementById('btn-clear-level').addEventListener('click', () => {
        if (confirm('Clear all editor objects?')) {
            editorObjects = [];
        }
    });

    document.getElementById('btn-back-editor').addEventListener('click', () => {
        showScreen('menu');
    });
}

// ---------- INIT ----------

function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    loadBestTimes();
    initUI();
    initEditor();
    showScreen('menu');
    gameLoop();
}

// Handle resize
window.addEventListener('resize', () => {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
