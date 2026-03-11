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
    { gold: 22, silver: 32, bronze: 44 },     // L16: Frost Cavern
    { gold: 20, silver: 30, bronze: 42 },     // L17: Laser Grid
    { gold: 24, silver: 36, bronze: 50 },     // L18: Wind Tunnel
    { gold: 26, silver: 38, bronze: 52 },     // L19: Gravity Shift
    { gold: 40, silver: 55, bronze: 75 },     // L20: The Gauntlet II
    { gold: 35, silver: 50, bronze: 70 },     // L21: Boss - Spike Wall
    { gold: 30, silver: 45, bronze: 60 },     // L22: Boss - Rising Lava
    { gold: 40, silver: 55, bronze: 75 },     // L23: Boss - Laser Drone
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
    "The final rush tests everything. Use checkpoints wisely!",
    "Ice is slippery! Momentum carries you — time your jumps carefully.",
    "Watch the lasers! They cycle on and off — find the pattern.",
    "Wind zones push you around — use conveyors to ride the current.",
    "Gravity zones flip everything! Walk on ceilings to progress.",
    "The ultimate gauntlet — every obstacle, every skill, no mercy.",
    "BOSS: The spike wall is chasing you! Run for your life!",
    "BOSS: The lava is rising! Climb fast or be consumed!",
    "BOSS: A laser drone hunts you. Dodge its beam and reach the exit!"
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
let autoPlay = false;
let autoPlayWallFrames = 0; // frames spent on current wall (for realistic wall-slide delay)
function getDiff() { return DIFFICULTIES[difficulty]; }

// Cheat mode no longer gives heightened abilities — autoplay uses same physics as player
let maxMode = false; // "max" secret mode: teleport to goal / invincible in endless

function getCheatGravity() { return getDiff().gravity; }
function getCheatMaxFall() { return getDiff().maxFall; }
function getCheatJumpForce() { return getDiff().jumpForce; }
function getCheatCoyoteTime() { return getDiff().coyoteTime; }
function getCheatJumpBuffer() { return getDiff().jumpBuffer; }
function getCheatDashDuration() { return getDiff().dashDuration; }
function getCheatDashCooldown() { return getDiff().dashCooldown; }
function getCheatSpikeInset() { return getDiff().spikeInset; }
function getCheatWallSlideMax() { return getDiff().wallSlideMax; }
function getCheatRunSpeed() { return getDiff().runSpeed || RUN_SPEED; }

// ---------- AUTO-PLAY AI ----------
// Physics-based AI using real difficulty physics for human-realistic movement
function updateAutoPlay() {
    const p = player;
    const diff = getDiff();
    const runSpeed = diff.runSpeed || RUN_SPEED;
    const grav = diff.gravity;
    const jForce = diff.jumpForce;

    // Jump arc physics for current difficulty
    const peakTime = Math.abs(jForce) / grav;
    const maxJumpH = (jForce * jForce) / (2 * grav);
    const maxJumpRange = runSpeed * 2 * peakTime;
    const dashDur = diff.dashDuration || DASH_DURATION;
    const dashRange = DASH_SPEED * dashDur;

    // Horizontal jump reach accounting for height difference
    function jumpReach(heightDiff) {
        if (heightDiff >= 0) {
            const fallTime = Math.sqrt(2 * (maxJumpH + heightDiff) / grav);
            return runSpeed * (peakTime + fallTime);
        }
        const need = -heightDiff;
        if (need > maxJumpH) return 0;
        const disc = jForce * jForce + 2 * grav * need;
        if (disc < 0) return 0;
        return runSpeed * (Math.abs(jForce) - Math.sqrt(disc)) / grav;
    }

    // Clear all inputs — AI has full control
    keys['KeyD'] = false; keys['ArrowRight'] = false;
    keys['KeyA'] = false; keys['ArrowLeft'] = false;
    keys['KeyS'] = false; keys['ArrowDown'] = false;
    keys['KeyW'] = false; keys['ArrowUp'] = false;
    keys['ShiftLeft'] = false; keys['ShiftRight'] = false;
    keys['KeyE'] = false;
    keys['touchJump'] = false; keys['touchDash'] = false;
    keys['touchSlide'] = false; keys['touchClimb'] = false;

    let moveDir = 1;
    let doJump = false, doDash = false, doSlide = false, doClimb = false;

    const playerR = p.x + p.w;
    const playerB = p.y + p.h;
    const playerCX = p.x + p.w / 2;

    // --- Collect landable surfaces with metadata ---
    const surfs = [...platforms];
    for (const mp of movingPlatforms) surfs.push({ x: mp.x, y: mp.y, w: mp.w, h: mp.h, _moving: mp });
    for (const fp of fallingPlatforms) {
        if (!fp.fallen) surfs.push({ x: fp.x, y: fp.y, w: fp.w, h: fp.h, _falling: fp });
    }

    // --- Current platform ---
    let standPlat = null;
    if (p.onGround) {
        for (const s of surfs) {
            if (playerR > s.x && p.x < s.x + s.w && Math.abs(playerB - s.y) < 6) {
                standPlat = s; break;
            }
        }
    }

    // --- Falling platform urgency: detect if we're on a triggered falling platform ---
    let onTriggeredFalling = false;
    if (standPlat && standPlat._falling && standPlat._falling.triggered) {
        onTriggeredFalling = true;
    }

    // --- Spike scanning (ground-level and ceiling) ---
    let nearSpike = null, nearSpikeDist = Infinity;
    let spikeAbove = false;
    for (const sp of spikes) {
        const dx = sp.x - p.x;
        if (dx > -TILE && dx < 6 * TILE) {
            // Ground-level spikes (on path or in gaps)
            if (sp.y > p.y - 2 * TILE && sp.y < playerB + TILE) {
                if (dx < nearSpikeDist) { nearSpike = sp; nearSpikeDist = dx; }
            }
            // Ceiling spikes (above player — don't jump into these)
            if (sp.y + sp.h <= p.y && sp.y > p.y - 3 * TILE && dx < 4 * TILE) {
                spikeAbove = true;
            }
        }
    }

    // --- Target platform (smart selection) ---
    // Score platforms by reachability and preference
    let targetPlat = null, targetDist = Infinity;
    let bestScore = -Infinity;
    for (const s of surfs) {
        const d = s.x - playerR;
        if (d > -TILE && s !== standPlat && d < 20 * TILE) {
            if (s.y > p.y - maxJumpH - 4 * TILE && s.y < p.y + 14 * TILE) {
                const heightDiff = s.y - (standPlat ? standPlat.y : playerB);
                const reach = jumpReach(heightDiff);
                const gap = standPlat ? s.x - (standPlat.x + standPlat.w) : d;

                // Skip unreachable platforms (gap > jump + dash range with margin)
                if (gap > reach + dashRange + TILE * 2 && gap > 0) continue;

                // Score: prefer closer, reachable, not-behind-spikes
                let score = 1000 - d;

                // Penalize platforms that require jumping through spike ceilings
                if (spikeAbove && s.y < (standPlat ? standPlat.y : p.y)) score -= 500;

                // Prefer platforms at similar or lower height (natural flow)
                if (heightDiff >= 0) score += 50;

                // Avoid falling platforms if alternatives exist
                if (s._falling) score -= 30;

                if (score > bestScore) {
                    bestScore = score;
                    targetPlat = s;
                    targetDist = d;
                }
            }
        }
    }
    // Fallback: wider search
    if (!targetPlat) {
        for (const s of surfs) {
            const d = s.x - playerR;
            if (d > 0 && s !== standPlat && d < 30 * TILE &&
                s.y > p.y - 10 * TILE && s.y < p.y + 18 * TILE) {
                if (!targetPlat || d < (targetPlat.x - playerR)) { targetPlat = s; targetDist = d; }
            }
        }
    }

    // --- Low ceiling detection (solids + spikes above creating tight passage) ---
    let lowCeiling = false;
    if (p.onGround && standPlat) {
        const allSolids = [...surfs, ...walls];
        for (const s of allSolids) {
            if (s === standPlat) continue;
            const ceilBot = s.y + s.h;
            const gap = standPlat.y - ceilBot;
            // Slightly relaxed tolerance (+2px) for edge cases
            if (gap >= PLAYER_H_SLIDE - 2 && gap < PLAYER_H + 2 &&
                s.x < playerR + 3.5 * TILE && s.x + s.w > p.x) {
                lowCeiling = true; break;
            }
        }
        // Also check spikes above as ceiling hazards (daily mode places spikes at y-1)
        if (!lowCeiling) {
            for (const sp of spikes) {
                const ceilBot = sp.y + sp.h;
                const gap = standPlat.y - ceilBot;
                if (gap >= PLAYER_H_SLIDE - 2 && gap < PLAYER_H + 2 &&
                    sp.x < playerR + 3.5 * TILE && sp.x + sp.w > p.x) {
                    lowCeiling = true; break;
                }
            }
        }
    }

    // --- Platform continuation check (improved: overlapping or adjacent at similar height) ---
    function platContinues(sp) {
        for (const s of surfs) {
            if (s === sp) continue;
            // Adjacent or overlapping horizontally, similar height
            if (s.x < sp.x + sp.w + TILE * 0.5 && s.x + s.w > sp.x + sp.w - TILE * 0.5 &&
                Math.abs(s.y - sp.y) < TILE) return true;
        }
        return false;
    }

    // --- Wall slide timing (track frames on wall for realistic delay) ---
    if (!p.onGround && (p.onWallLeft || p.onWallRight)) {
        autoPlayWallFrames++;
    } else {
        autoPlayWallFrames = 0;
    }

    // ======================
    // 1. WALL SECTION BEHAVIOR
    // ======================
    if (!p.onGround && (p.onWallLeft || p.onWallRight)) {
        // Ledge climb at top of wall section
        if (p.canClimb) {
            doClimb = true;
            moveDir = p.onWallLeft ? -1 : 1;
        } else {
            // Brief wall-slide before jumping (2-4 frames, like a real player)
            const wallDelay = 3;
            if (autoPlayWallFrames >= wallDelay) {
                doJump = true;
            }

            // Direction: move toward opposite wall or platform
            if (p.onWallLeft) {
                moveDir = 1;
                let hasOpposite = false;
                for (const w of walls) {
                    if (w.x > p.x + p.w && w.x < p.x + 6 * TILE &&
                        p.y >= w.y && p.y < w.y + w.h) { hasOpposite = true; break; }
                }
                // No opposite wall — look for platform to land on
                if (!hasOpposite) {
                    let bestPlat = null, bestDist = Infinity;
                    for (const s of surfs) {
                        const d = s.x - playerR;
                        if (d > -TILE && d < 10 * TILE && s.y > p.y - 5 * TILE && s.y < p.y + 3 * TILE) {
                            if (d < bestDist) { bestPlat = s; bestDist = d; }
                        }
                    }
                    if (bestPlat) moveDir = bestPlat.x + bestPlat.w / 2 > playerCX ? 1 : -1;
                    else moveDir = 1;
                }
            } else {
                moveDir = -1;
                let hasOpposite = false;
                for (const w of walls) {
                    if (w.x + w.w < p.x && w.x + w.w > p.x - 6 * TILE &&
                        p.y >= w.y && p.y < w.y + w.h) { hasOpposite = true; break; }
                }
                if (!hasOpposite) {
                    // No left wall — head toward best platform
                    let bestPlat = null, bestDist = Infinity;
                    for (const s of surfs) {
                        const d = s.x - p.x;
                        if (d > -4 * TILE && d < 10 * TILE && s.y > p.y - 5 * TILE && s.y < p.y + 3 * TILE) {
                            if (Math.abs(d) < bestDist) { bestPlat = s; bestDist = Math.abs(d); }
                        }
                    }
                    if (bestPlat) moveDir = bestPlat.x + bestPlat.w / 2 > playerCX ? 1 : -1;
                    else moveDir = 1;
                }
            }
        }
    }

    // ======================
    // 2. ON-GROUND BEHAVIOR
    // ======================
    else if (p.onGround && standPlat) {
        const edgeDist = (standPlat.x + standPlat.w) - playerR;
        const continues = platContinues(standPlat);

        // --- Falling platform urgency: jump off ASAP ---
        if (onTriggeredFalling) {
            // Don't wait for edge — jump immediately to escape
            if (targetPlat) {
                doJump = true;
            } else {
                // No target — just jump and hope
                doJump = true;
            }
        }

        // --- Spike ahead on ground — jump over ---
        else if (nearSpike && nearSpikeDist > 0 && nearSpikeDist < TILE * 2.5) {
            // Don't jump if there are spikes above too (slide instead)
            if (spikeAbove) {
                doSlide = true;
            } else {
                doJump = true;
            }
        }

        // --- Low ceiling — slide under ---
        else if (lowCeiling && !doJump) {
            doSlide = true;
        }

        // --- At platform edge ---
        else if (!continues && edgeDist > 0 && !doSlide) {
            if (targetPlat) {
                const gap = targetPlat.x - (standPlat.x + standPlat.w);
                const heightDiff = targetPlat.y - standPlat.y;
                const reach = jumpReach(heightDiff);

                // DROP-DOWN: if target is below and close, walk off naturally (don't jump)
                if (heightDiff > TILE && gap < TILE * 2 && gap >= -TILE) {
                    // Just keep moving right — player will walk off and fall to the lower platform
                    if (edgeDist < TILE * 0.5) {
                        // Very close to edge — let natural fall happen (no jump)
                    }
                }
                // JUMP: gap exists or target is higher
                else if (edgeDist < TILE * 2) {
                    if (gap > TILE * 0.3 || heightDiff < -TILE * 0.3) {
                        // Adaptive timing: jump later for long gaps (maximize reach)
                        const gapRatio = gap / Math.max(reach, 1);
                        const jumpWindow = gapRatio > 0.6 ? TILE * 1.3 : TILE * 2;
                        if (edgeDist < jumpWindow) {
                            doJump = true;
                        }
                    }
                }
            } else if (edgeDist < TILE * 1.5) {
                // No target but at edge — jump to survive
                doJump = true;
            }
        }

        // --- Higher platform ahead (not at edge yet) ---
        if (!doJump && !doSlide && targetPlat && targetPlat.y < standPlat.y - TILE &&
            targetDist < TILE * 4 && edgeDist > 0 && edgeDist < TILE * 2.5) {
            doJump = true;
        }
    }

    // ======================
    // 3. AIRBORNE BEHAVIOR
    // ======================
    else if (!p.onGround && !p.onWallLeft && !p.onWallRight) {
        // --- Dash when physics require it ---
        if (targetPlat && !p.isDashing && p.dashTimer <= 0 && p.dashCooldown <= 0) {
            const gap = targetPlat.x - playerR;
            const hDiff = targetPlat.y - p.y;

            // Estimate remaining reachable distance from current state
            let remainDist = 0;
            if (hDiff >= 0) {
                const a = 0.5 * grav, b = p.vy, c = -hDiff;
                const disc = b * b - 4 * a * c;
                if (disc >= 0) {
                    const t = (-b + Math.sqrt(disc)) / (2 * a);
                    remainDist = runSpeed * Math.max(0, t);
                }
            } else if (p.vy < 0) {
                const maxMore = (p.vy * p.vy) / (2 * grav);
                if (maxMore >= -hDiff) {
                    const disc = p.vy * p.vy + 2 * grav * hDiff;
                    if (disc >= 0) {
                        const t = (-p.vy - Math.sqrt(disc)) / grav;
                        remainDist = runSpeed * Math.max(0, t);
                    }
                }
            }

            // Dash if gap exceeds remaining reach (with safety margin)
            if (gap > 0 && gap > remainDist * 0.8 && gap < 22 * TILE) {
                // Dash near peak or early descent for maximum horizontal gain
                if (p.vy >= -1.5) {
                    doDash = true;
                }
            }
        }

        // --- Emergency dash: falling fast with nothing below ---
        if (p.vy > 3 && !p.isDashing && p.dashTimer <= 0 && p.dashCooldown <= 0) {
            let groundBelow = false;
            for (const s of surfs) {
                if (playerR > s.x - TILE && p.x < s.x + s.w + TILE &&
                    s.y > playerB && s.y < playerB + 5 * TILE) {
                    groundBelow = true; break;
                }
            }
            if (!groundBelow) {
                for (const s of surfs) {
                    if (s.x > playerR - TILE && s.x < playerR + 14 * TILE &&
                        s.y > p.y - 2 * TILE && s.y < playerB + 10 * TILE) {
                        doDash = true; break;
                    }
                }
            }
        }

        // --- Mid-air spike avoidance: if about to land on spikes, try to dash over ---
        if (p.vy > 0 && !p.isDashing && !doDash) {
            for (const sp of spikes) {
                const dx = sp.x - p.x;
                if (dx > -p.w && dx < p.w + TILE &&
                    sp.y > playerB && sp.y < playerB + 3 * TILE) {
                    // About to land on spikes — dash forward if possible
                    if (p.dashTimer <= 0 && p.dashCooldown <= 0) {
                        doDash = true;
                    }
                    break;
                }
            }
        }

        // --- Double jump: use it if falling and need more height/distance (level 5+) ---
        if (p.vy > 1 && !doubleJumpUsed && getPlayerLevel() >= 5 && !p.isDashing) {
            // Double jump if we're falling and target is above or far
            if (targetPlat) {
                const gap = targetPlat.x - playerR;
                const hDiff = targetPlat.y - p.y;
                // Need more height
                if (hDiff < -TILE && p.vy > 2) {
                    doJump = true;
                }
                // Falling into a gap with no ground below
                else if (p.vy > 4) {
                    let groundBelow = false;
                    for (const s of surfs) {
                        if (playerR > s.x - TILE && p.x < s.x + s.w + TILE &&
                            s.y > playerB && s.y < playerB + 4 * TILE) {
                            groundBelow = true; break;
                        }
                    }
                    if (!groundBelow) doJump = true;
                }
            }
        }

        // --- Air stall/glide: hold jump while descending to slow fall (level 4+) ---
        if (p.vy > 2 && getPlayerLevel() >= 4 && airStallFuel > 15 && !p.isDashing && !groundPoundActive) {
            if (targetPlat) {
                const gap = targetPlat.x - playerR;
                // Glide to extend horizontal reach when gap is moderate
                if (gap > TILE * 3 && gap < TILE * 12) {
                    doJump = true; // holding jump = glide
                }
            }
        }

        // --- Air steering toward target platform ---
        if (targetPlat && !p.isDashing) {
            const tCenter = targetPlat.x + targetPlat.w / 2;
            // Steer toward target center
            if (tCenter < playerCX - TILE) {
                moveDir = -1;
            } else if (tCenter > playerCX + TILE) {
                moveDir = 1;
            }
        }
    }

    // --- General ledge climb (backup) ---
    if (p.canClimb && !p.onGround && (p.onWallLeft || p.onWallRight) && !doClimb) {
        doClimb = true;
    }

    // --- Feature 24: AI handles new blocks ---
    // Avoid lasers (wait for off cycle)
    for (const lb of laserBeams) {
        if (lb.active) {
            const lbBox = { x: lb.x - TILE, y: lb.y, w: lb.w + TILE * 2, h: lb.h };
            if (aabb({ x: p.x, y: p.y, w: p.w, h: p.h + TILE * 3 }, lbBox)) {
                // Near active laser — stop and wait
                moveDir = 0;
                doJump = false;
                doDash = false;
            }
        }
    }
    // Avoid drones: jump away if close
    for (const d of enemyDrones) {
        const ddx = d.x - playerCX;
        const ddy = d.y - (p.y + p.h / 2);
        const ddist = Math.sqrt(ddx * ddx + ddy * ddy);
        if (ddist < 80) {
            if (ddx > 0) moveDir = -1;
            else moveDir = 1;
            if (ddist < 40 && p.onGround) doJump = true;
        }
    }
    // Factor conveyor belt velocity
    for (const cb of conveyorBelts) {
        if (aabb({ x: p.x, y: p.y + p.h, w: p.w, h: 4 }, cb)) {
            // On a conveyor: adjust target slightly
            if (cb.dir < 0 && moveDir > 0) moveDir = 1; // push against conveyor
        }
    }
    // Navigate gravity zones: flip movement
    for (const gz of gravityZones) {
        if (aabb({ x: p.x, y: p.y, w: p.w, h: p.h }, gz)) {
            if (gz.gravMod < 0 && p.vy > 0) doJump = true; // inverted grav: jump when falling "up"
        }
    }
    // Avoid wind zones: lean against wind
    for (const wz of windZones) {
        if (aabb({ x: p.x, y: p.y, w: p.w, h: p.h }, wz)) {
            if (wz.forceX > 0 && moveDir > 0) { /* wind helping, fine */ }
            else if (wz.forceX < 0 && moveDir > 0) { doDash = true; } // dash through headwind
        }
    }
    // Avoid sawblades: jump/dash away
    for (const sb of sawblades) {
        const scx = sb.x + sb.radius;
        const scy = sb.y + sb.radius;
        const dx = scx - playerCX;
        const dy = scy - (p.y + p.h / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < sb.radius + TILE * 2.5) {
            if (dy > 0) doJump = true;
            else if (p.onGround) doDash = true;
            if (dx > 0) moveDir = -1;
            else moveDir = 1;
        }
    }
    // Avoid lava floors: jump if close
    for (const lf of lavaFloors) {
        if (aabb({ x: p.x, y: p.y, w: p.w, h: p.h + TILE * 2 }, { x: lf.x, y: lf.y, w: lf.w, h: lf.h })) {
            doJump = true;
        }
    }

    // --- Realistic imperfections: small random reaction delay ---
    // 5% chance to skip a frame of input (human-like hesitation)
    const humanDelay = Math.random() < 0.05;

    // --- Apply movement ---
    if (moveDir > 0) { keys['KeyD'] = true; keys['ArrowRight'] = true; }
    else if (moveDir < 0) { keys['KeyA'] = true; keys['ArrowLeft'] = true; }

    // Use KeyW for jumps (not Space) to avoid interfering with spacebar toggle
    if (doJump && !humanDelay) { keys['KeyW'] = true; keys['ArrowUp'] = true; }
    if (doDash && !humanDelay) { keys['ShiftLeft'] = true; }
    if (doClimb) { keys['KeyE'] = true; }
    if (doSlide && !humanDelay) { keys['KeyS'] = true; keys['ArrowDown'] = true; }
}

// ---------- MAX MODE (teleport/invincible) ----------
function updateMaxMode() {
    const p = player;

    if (endlessMode) {
        // Endless: use full AI for realistic movement, killPlayer() blocks death
        updateAutoPlay();
    } else {
        // Campaign: teleport to goal
        if (goalZone) {
            p.x = goalZone.x + goalZone.w / 2 - p.w / 2;
            p.y = goalZone.y + goalZone.h / 2 - p.h / 2;
            p.vx = 0;
            p.vy = 0;
        }
    }
}

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
    { id: 'deaths_500', name: 'Immortal Spirit', desc: 'Die 500 times total', icon: '+' },
    // New achievements
    { id: 'combo_30', name: 'Combo God', desc: 'Reach a 30x combo', icon: '!' },
    { id: 'prestige_1', name: 'Prestige I', desc: 'Prestige for the first time', icon: 'P' },
    { id: 'all_stars', name: 'Star Collector', desc: 'Get all 3 stars on any level', icon: '★' },
    { id: 'purist', name: 'Purist', desc: 'Clear any level without dashing', icon: 'N' },
    { id: 'pogo_5', name: 'Pogo Master', desc: '5 bounce pad chain', icon: 'B' },
    { id: 'speedrunner', name: 'Speedrunner', desc: 'Complete all 20 levels', icon: 'R' },
    { id: 'midas', name: 'Midas Touch', desc: 'Collect 500 orbs total', icon: 'J' },
    { id: 'phoenix', name: 'Phoenix', desc: 'Die 1000 times total', icon: 'Q' },
    { id: 'ice_dancer', name: 'Ice Dancer', desc: 'Gold on Frost Cavern', icon: 'I' },
    { id: 'boss_slayer', name: 'Boss Slayer', desc: 'Complete a boss level', icon: 'V' },
    { id: 'mirror_master', name: 'Mirror Master', desc: 'Clear a level in mirror mode', icon: 'Z' },
    { id: 'weekly_warrior', name: 'Weekly Warrior', desc: 'Complete a weekly challenge', icon: 'Y' },
    { id: 'gauntlet_ii', name: 'Gauntlet Returns', desc: 'Complete Level 20', icon: '2' },
    { id: 'veteran', name: 'Veteran', desc: 'Reach XP level 10', icon: 'v' },
    { id: 'true_master', name: 'True Master', desc: 'Earn all mastery badges on any level', icon: 'T' },
    // 30-feature update achievements (50 total)
    { id: 'untouchable', name: 'Untouchable', desc: 'Complete a drone level without drone alert', icon: '!' },
    { id: 'boss_deathless', name: 'Boss Deathless', desc: 'Complete a boss level with 0 deaths', icon: 'b' },
    { id: 'share_the_rush', name: 'Share the Rush', desc: 'Share a run code', icon: '>' },
    { id: 'bullet_time_50', name: 'Time Bender', desc: 'Use slow-motion 50 times', icon: 'Q' },
    { id: 'all_mastery_5', name: 'Mastery V', desc: 'Earn mastery badges on 5 levels', icon: 'm' },
    { id: 'extreme_gold', name: 'Extreme Gold', desc: 'Get gold on extreme difficulty', icon: 'x' },
    { id: 'orbs_1000', name: 'Orb Hoarder', desc: 'Collect 1000 orbs total', icon: 'O' },
    { id: 'streak_10', name: 'Unstoppable X', desc: '10 deathless levels in a row', icon: '=' },
    { id: 'daily_7', name: 'Weekly Devotion', desc: '7-day login streak', icon: '7' },
    { id: 'level20_deathless', name: 'Perfection', desc: 'Complete Level 20 with 0 deaths', icon: '!' },
    // 100-feature update achievements
    { id: 'grapple_master', name: 'Grapple Master', desc: 'Use grapple hook 20 times', icon: 'G', category: 'mechanics', rarity: 'uncommon' },
    { id: 'gravity_flipper', name: 'Gravity Flipper', desc: 'Use gravity flip 10 times', icon: '⇅', category: 'mechanics', rarity: 'rare' },
    { id: 'chain_dasher', name: 'Chain Dasher', desc: '3 chain dashes in one run', icon: '→', category: 'mechanics', rarity: 'rare' },
    { id: 'puzzle_solver', name: 'Puzzle Solver', desc: 'Complete all 5 puzzle levels', icon: '?', category: 'modes', rarity: 'epic' },
    { id: 'speedrun_complete', name: 'Speed Demon II', desc: 'Complete a speedrun', icon: 'S', category: 'modes', rarity: 'rare' },
    { id: 'gauntlet_clear', name: 'Gauntlet Champion', desc: 'Complete gauntlet mode', icon: 'G', category: 'modes', rarity: 'epic' },
    { id: 'boss_rush_clear', name: 'Boss Slayer II', desc: 'Complete boss rush', icon: 'B', category: 'modes', rarity: 'epic' },
    { id: 'zen_explorer', name: 'Zen Explorer', desc: 'Play 5 levels in zen mode', icon: 'Z', category: 'modes', rarity: 'common' },
    { id: 'season_10', name: 'Season Veteran', desc: 'Reach season pass tier 10', icon: 'S', category: 'progression', rarity: 'uncommon' },
    { id: 'season_50', name: 'Season Legend', desc: 'Reach season pass tier 50', icon: 'L', category: 'progression', rarity: 'legendary' },
    { id: 'skill_tree_full', name: 'Fully Skilled', desc: 'Unlock all skill tree upgrades', icon: 'T', category: 'progression', rarity: 'legendary' },
    { id: 'tokens_100', name: 'Token Collector', desc: 'Earn 100 challenge tokens', icon: '$', category: 'progression', rarity: 'rare' },
    { id: 'ng_plus_clear', name: 'NG+ Victor', desc: 'Complete a level in NG+', icon: '+', category: 'modes', rarity: 'epic' },
    { id: 'reverse_clear', name: 'Backwards Runner', desc: 'Complete reverse mode', icon: '←', category: 'modes', rarity: 'rare' },
    { id: 'survival_clear', name: 'Survivor', desc: 'Complete survival mode', icon: '♥', category: 'modes', rarity: 'rare' },
    { id: 'relay_complete', name: 'Team Player', desc: 'Complete relay mode', icon: '2', category: 'modes', rarity: 'rare' },
    { id: 'animated_skin', name: 'Living Color', desc: 'Equip an animated skin', icon: '~', category: 'cosmetics', rarity: 'uncommon' },
    { id: 'cape_equip', name: 'Caped Crusader', desc: 'Equip a cape', icon: 'C', category: 'cosmetics', rarity: 'common' },
    { id: 'custom_color', name: 'Color Artist', desc: 'Customize skin colors', icon: 'P', category: 'cosmetics', rarity: 'common' },
    // Secret achievements (Feature 99)
    ...SECRET_ACHIEVEMENTS,
    // Completionist Supreme (Feature 100)
    { id: 'completionist_supreme', name: 'COMPLETIONIST SUPREME', desc: 'Unlock every other achievement', icon: '★', category: 'legendary', rarity: 'legendary' },
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
    { id: 'rainbow', name: 'Rainbow', cost: 100, body: 'rainbow', head: 'rainbow', arms: 'rainbow', legs: 'rainbow' },
    // New skins
    { id: 'lava', name: 'Lava', cost: 25, body: '#ff3300', head: '#ff5500', arms: '#dd2200', legs: '#cc1100' },
    { id: 'ocean', name: 'Ocean', cost: 25, body: '#0066cc', head: '#0088ee', arms: '#0055aa', legs: '#004499' },
    { id: 'forest', name: 'Forest', cost: 30, body: '#228b22', head: '#33aa33', arms: '#1a7a1a', legs: '#116611' },
    { id: 'galaxy', name: 'Galaxy', cost: 35, body: '#4b0082', head: '#6a0dad', arms: '#3c006e', legs: '#2d0054' },
    { id: 'cherry', name: 'Cherry Blossom', cost: 40, body: '#ffb7c5', head: '#ffc8d6', arms: '#ffa6b4', legs: '#ff95a3' },
    { id: 'stealth', name: 'Stealth', cost: 50, body: '#1a1a1a', head: '#2a2a2a', arms: '#0f0f0f', legs: '#050505' },
    { id: 'retro', name: 'Retro', cost: 60, body: '#00ff00', head: '#33ff33', arms: '#00dd00', legs: '#00bb00' },
    { id: 'diamond', name: 'Diamond', cost: 150, body: '#b9f2ff', head: '#d4f7ff', arms: '#9ee8f5', legs: '#84dde8' },
    // Achievement-locked skins (Feature 14)
    { id: 'void_skin', name: 'Void', cost: 0, body: '#110022', head: '#220044', arms: '#0a0011', legs: '#050008', achievementLock: 'boss_deathless' },
    { id: 'drone_hunter', name: 'Drone Hunter', cost: 0, body: '#ff2200', head: '#ff4422', arms: '#dd1100', legs: '#bb0000', achievementLock: 'untouchable' },
    { id: 'time_lord', name: 'Time Lord', cost: 0, body: '#4444ff', head: '#6666ff', arms: '#3333dd', legs: '#2222bb', achievementLock: 'bullet_time_50' },
    { id: 'prestige_skin', name: 'Prestige', cost: 0, body: '#ffd700', head: '#ffee44', arms: '#ddbb00', legs: '#ccaa00', achievementLock: 'prestige_1' },
];
let currentSkin = 'default';
let unlockedSkins = ['default'];
let totalOrbs = 0;
let orbs = [];
let totalWallJumps = 0;
let totalDashes = 0;

// --- New Block Type Arrays ---
let icePlatforms = [];
let conveyorBelts = [];
let bouncePads = [];
let toggleBlocksA = [];
let toggleBlocksB = [];
let toggleSwitches = [];
let toggleState = false; // A=solid, B=transparent when false; flip when true
let laserBeams = [];
let gravityZones = [];
let teleporterPads = [];
let crumblingWalls = [];
let ziplines = [];
let windZones = [];

// --- XP & Progression ---
let playerXP = 0;
let playerLevel = 0;
let prestigeCount = 0;
let starRatings = {}; // per level: { complete: bool, silverTime: bool, goldNoDeath: bool }
let masteryBadges = {}; // per level: { zeroDeath, noDash, allOrbs, speedRecord }
let dailyLoginStreak = 0;
let lastLoginDate = '';

// XP thresholds per level
const XP_PER_LEVEL = [0, 100, 250, 500, 800, 1200, 1700, 2400, 3200, 4200, 5500];
function getPlayerLevel() {
    let lvl = 0;
    for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
        if (playerXP >= XP_PER_LEVEL[i]) { lvl = i; break; }
    }
    return lvl;
}
function addXP(amount) {
    const prevLvl = getPlayerLevel();
    playerXP += Math.floor(amount * (1 + prestigeCount * 0.05));
    playerLevel = getPlayerLevel();
    if (playerLevel > prevLvl) {
        spawnFloatingText('LEVEL UP! Lv.' + playerLevel, player.x + player.w / 2, player.y - 60, '#00ff88', 22);
        playSound('victory');
        // Feature 17: XP Level-Up Cinematic
        startLevelUpAnim(playerLevel);
    }
    saveProgression();
}

// --- Player Abilities ---
let doubleJumpUsed = false;
let groundPoundActive = false;
let airStallFuel = 60;
const AIR_STALL_MAX = 60;
let speedBurstActive = false;
let speedBurstTimer = 0;
let wallRunTimer = 0;
let wallRunActive = false;

// --- New Game Modes ---
let timeAttackMode = false;
let timeAttackTimer = 0;
let timeAttackDeaths = 0;
let mirrorMode = false;
let challengeMode = false;
let challengeModifiers = { noDash: false, invisiblePlatforms: false, doubleSpeed: false, oneHit: false, tinyPlayer: false };
let weeklyChallenge = false;
let bossMode = false;
let bossState = null; // { type, x, y, hp, phase, timer }

// --- Cosmetics ---
const NEW_SKINS = [
    { id: 'lava', name: 'Lava', cost: 25, body: '#ff3300', head: '#ff5500', arms: '#dd2200', legs: '#cc1100' },
    { id: 'ocean', name: 'Ocean', cost: 25, body: '#0066cc', head: '#0088ee', arms: '#0055aa', legs: '#004499' },
    { id: 'forest', name: 'Forest', cost: 30, body: '#228b22', head: '#33aa33', arms: '#1a7a1a', legs: '#116611' },
    { id: 'galaxy', name: 'Galaxy', cost: 35, body: '#4b0082', head: '#6a0dad', arms: '#3c006e', legs: '#2d0054' },
    { id: 'cherry', name: 'Cherry Blossom', cost: 40, body: '#ffb7c5', head: '#ffc8d6', arms: '#ffa6b4', legs: '#ff95a3' },
    { id: 'stealth', name: 'Stealth', cost: 50, body: '#1a1a1a', head: '#2a2a2a', arms: '#0f0f0f', legs: '#050505' },
    { id: 'retro', name: 'Retro', cost: 60, body: '#00ff00', head: '#33ff33', arms: '#00dd00', legs: '#00bb00' },
    { id: 'diamond', name: 'Diamond', cost: 150, body: '#b9f2ff', head: '#d4f7ff', arms: '#9ee8f5', legs: '#84dde8' },
];

let currentTrail = 'none';
let unlockedTrails = ['none'];
const TRAIL_EFFECTS = [
    { id: 'none', name: 'None', cost: 0, color: null },
    { id: 'flame', name: 'Flame', cost: 20, color: '#ff4400' },
    { id: 'ice_trail', name: 'Ice', cost: 20, color: '#88ddff' },
    { id: 'stars', name: 'Stars', cost: 25, color: '#ffd700' },
    { id: 'glitch', name: 'Glitch', cost: 30, color: '#00ff00' },
    { id: 'rainbow_trail', name: 'Rainbow', cost: 50, color: 'rainbow' },
];

let currentHat = 'none';
let unlockedHats = ['none'];
const PLAYER_HATS = [
    { id: 'none', name: 'None', cost: 0 },
    { id: 'crown', name: 'Crown', cost: 30 },
    { id: 'headband', name: 'Headband', cost: 15 },
    { id: 'antenna', name: 'Antenna', cost: 20 },
    { id: 'horns', name: 'Horns', cost: 25 },
    { id: 'halo', name: 'Halo', cost: 35 },
];

let currentDeathEffect = 'shatter';
let unlockedDeathEffects = ['shatter'];
const DEATH_EFFECTS = [
    { id: 'shatter', name: 'Shatter', cost: 0 },
    { id: 'poof', name: 'Poof', cost: 15 },
    { id: 'glitch_death', name: 'Glitch', cost: 25 },
    { id: 'dissolve', name: 'Dissolve', cost: 30 },
];

let currentCelebration = 'default';
let unlockedCelebrations = ['default'];
const CELEBRATIONS = [
    { id: 'default', name: 'Default', cost: 0 },
    { id: 'backflip', name: 'Backflip', cost: 20 },
    { id: 'fistpump', name: 'Fist Pump', cost: 15 },
    { id: 'fireworks', name: 'Fireworks', cost: 30 },
    { id: 'confetti_cannon', name: 'Confetti Cannon', cost: 25 },
];

// --- QoL State ---
let quickRestart = false;
let inputDisplayEnabled = false;
let photoModeActive = false;
let photoCam = { x: 0, y: 0, zoom: 1 };
let levelDeathCounts = {}; // per level death counter for skip offer
let skippedLevels = {};

// --- Slow-Motion / Bullet-Time (Feature 1) ---
let slowMotionActive = false;
let slowMotionTimer = 0;
let slowMotionCooldown = 0;
const SLOWMO_DURATION = 120; // 2s at 60fps
const SLOWMO_COOLDOWN = 480; // 8s at 60fps
const SLOWMO_SCALE = 0.3;

// --- Enemy Drones (Feature 2) ---
let enemyDrones = [];

// --- Wall Spike Traps (Feature 3) ---
let wallSpikes = [];

// --- Checkpoint Challenge Orbs (Feature 5) ---
let checkpointChallengeOrbs = [];
let perfectSections = 0;

// --- Water/Liquid Pools (Feature 10) ---
let waterPools = [];

// --- Photo Mode (Feature 11) ---
let photoCamera = { x: 0, y: 0, zoom: 1, rotation: 0 };
let photoControlsShown = false;

// --- Run Share Codes (Feature 12) ---
// (uses ghostRecording)

// --- Local Leaderboard (Feature 13) ---
let localLeaderboard = {}; // { levelIndex: [{ time, difficulty, date }] }

// --- Enhanced Daily Login (Feature 15) ---
let dailyLoginPopupShown = false;

// --- XP Level-Up Cinematics (Feature 17) ---
let levelUpAnimState = null; // { timer, level, ability }
const LEVELUP_ANIM_DURATION = 150; // 2.5s at 60fps

// --- Adaptive Music (Feature 18) ---
let musicLayerGains = { bass: null, kick: null, hihat: null, melody: null, pad: null };

// --- Zone Ambient Audio (Feature 19) ---
let zoneAmbientNodes = [];

// --- PB Checkpoint Splits (Feature 26) ---
let pbSplits = {}; // { level: [time1, time2, ...] }
let currentSplitIndex = 0;

// --- One-Hand Mode (Feature 27) ---
let oneHandMode = false;
let autoRunDirection = 1;

// --- Player Emotes (Feature 30) ---
let emoteActive = false;
let emoteType = null;
let emoteFrame = 0;
const EMOTE_DURATION = 30; // frames
const EMOTES = ['wave', 'flex', 'spin', 'sit'];

// --- Level Transition Fanfare (Feature 9) ---
let completeAnimState = null; // { timer, zoomTarget }

// --- Screen-Edge Death Pulse (Feature 8) ---
let deathPulseIntensity = 0;

// --- Trail Particles ---
let trailParticles = [];

// ============================================
// 100 NEW FEATURES - STATE VARIABLES
// ============================================

// --- Feature 93: Remappable Controls ---
let keyBindings = {
    moveLeft: ['KeyA', 'ArrowLeft'],
    moveRight: ['KeyD', 'ArrowRight'],
    jump: ['KeyW', 'ArrowUp', 'Space'],
    dash: ['ShiftLeft', 'ShiftRight'],
    slide: ['KeyS', 'ArrowDown'],
    climb: ['KeyE'],
    slowmo: ['KeyQ'],
    grapple: ['KeyG'],
    restart: ['KeyR'],
    emote1: ['Digit1'], emote2: ['Digit2'], emote3: ['Digit3'], emote4: ['Digit4'],
    pause: ['Escape'],
    photoMode: ['F2'], screenshot: ['F3'], perfOverlay: ['F4'],
    radialMenu: ['Tab']
};
let isRemapping = false;
let remapAction = null;
function isKeyBound(action) {
    return keyBindings[action] && keyBindings[action].some(k => keys[k] || keys['touch' + action.charAt(0).toUpperCase() + action.slice(1)]);
}
function isKeyJustPressed(action) {
    return keyBindings[action] && keyBindings[action].some(k => keys[k] && !prevKeys[k]);
}

// --- Feature 56: Skill Tree ---
const SKILL_TREE = {
    speed: [
        { id: 'speed1', name: 'Quick Start', desc: '+10% run speed', cost: 1 },
        { id: 'speed2', name: 'Momentum Master', desc: '+15% speed from slides', cost: 2 },
        { id: 'speed3', name: 'Rush Hour', desc: '+20% dash speed', cost: 3 },
        { id: 'speed4', name: 'Velocity Cap', desc: '+25% max speed', cost: 4 },
    ],
    air: [
        { id: 'air1', name: 'Feather Fall', desc: '-10% gravity', cost: 1 },
        { id: 'air2', name: 'Extended Glide', desc: '+50% glide duration', cost: 2 },
        { id: 'air3', name: 'Triple Jump', desc: 'Third jump in air', cost: 3 },
        { id: 'air4', name: 'Sky Walker', desc: '+30% wall run time', cost: 4 },
    ],
    defense: [
        { id: 'def1', name: 'Iron Skin', desc: '+0.5s coyote time', cost: 1 },
        { id: 'def2', name: 'Quick Recovery', desc: '-20% dash cooldown', cost: 2 },
        { id: 'def3', name: 'Resilience', desc: 'Survive one hit per level', cost: 3 },
        { id: 'def4', name: 'Immortal Rush', desc: '2s invuln after checkpoint', cost: 4 },
    ]
};
let skillPoints = 0;
let unlockedSkills = {};
function hasSkill(id) { return !!unlockedSkills[id]; }
function getSkillPointsAvailable() {
    const spent = Object.keys(unlockedSkills).length;
    return Math.max(0, Math.floor(getPlayerLevel() / 2) - spent + prestigeCount);
}

// --- Features 16-17: Pressure Plates + Gates ---
let pressurePlates = [];
let gateBlocks = [];

// --- Features 18-30: New Block Arrays ---
let acidPools = [];
let rotatingPlatforms = [];
let laserTurrets = [];
let bubblePlatforms = [];
let flameJets = [];
let gravityOrbs = [];
let shockwaveEmitters = [];
let shadowPlatforms = [];
let timedSwitchBlocks = [];
let electrifiedRails = [];
let phantomWalls = [];
let pistonBlocks = [];
let thornVines = [];

// --- Features 1-15: Gameplay Mechanics State ---
let grappleHook = { active: false, targetX: 0, targetY: 0, length: 0, angle: 0, swingVel: 0, cooldown: 0 };
let wallClingTimer = 0;
const WALL_CLING_MAX = 120; // 2s at 60fps
let wallClingCooldown = 0;
let chargedJumpTimer = 0;
let chargedJumpReady = false;
let airKickActive = false;
let airKickTimer = 0;
let chainDashReady = false;
let ricochetDashActive = false;
let ledgeHang = { active: false, platform: null, side: 'left' };
let slideJumpActive = false;
let gravityFlipActive = false;
let gravityFlipTimer = 0;
let gravityFlipCooldown = 0;
let personalGravityDir = 1; // 1=normal, -1=flipped
let bounceChainCount = 0;
let afterimagePhaseActive = false;
let afterimagePhaseTimer = 0;
let afterimageTrail = [];
let resilienceUsed = false; // Skill tree def3
let invulnTimer = 0; // Skill tree def4

// --- Features 47-55: Game Mode State ---
let speedrunMode = false;
let speedrunTimer = 0;
let speedrunSplits = [];
let speedrunLevel = 0;
let relayMode = false;
let relayPlayer = 1; // 1 or 2
let relayTimes = [0, 0];
let gauntletMode = false;
let gauntletLevels = [];
let gauntletModifiers = [];
let gauntletScore = 0;
let reverseMode = false;
let survivalMode = false;
let survivalHearts = 3;
const SURVIVAL_MAX_HEARTS = 3;
let bossRushMode = false;
let bossRushTimer = 0;
let bossRushLevel = 0;
let zenMode = false;
let ghostRaceMode = false;
let ghostRaceDelta = 0;
let puzzleMode = false;
let puzzleLevelIndex = 0;
let ngPlusMode = false;

// --- Features 56-65: Progression State ---
let seasonPassTier = 0;
let seasonPassXP = 0;
let seasonPassLastReset = '';
const SEASON_PASS_TIERS = 50;
const SEASON_PASS_XP_PER_TIER = 200;
let challengeTokens = 0;
let playerTitle = 'Rookie';
let equippedTitle = 'Rookie';
const TITLES = ['Rookie', 'Runner', 'Dasher', 'Climber', 'Speedster', 'Master', 'Champion', 'Legend', 'Myth', 'Supreme'];
let milestoneBadges = {};
let extendedStreak = 0;
let extendedStreakDay = '';
let orbMultiplierTimer = 0;
let orbMultiplierValue = 1;

// --- Features 66-75: Cosmetics State ---
const ANIMATED_SKINS = [
    { id: 'plasma', name: 'Plasma', cost: 80, type: 'animated', cycle: ['#ff00ff', '#ff44ff', '#ff88ff', '#ff44ff'] },
    { id: 'fire_spirit', name: 'Fire Spirit', cost: 80, type: 'animated', cycle: ['#ff4400', '#ff6600', '#ff8800', '#ff6600'] },
    { id: 'ocean_wave', name: 'Ocean Wave', cost: 80, type: 'animated', cycle: ['#0044ff', '#0066ff', '#0088ff', '#0066ff'] },
    { id: 'void_pulse', name: 'Void Pulse', cost: 80, type: 'animated', cycle: ['#220044', '#440066', '#660088', '#440066'] },
];
let customSkinColors = { body: '#00e5ff', head: '#33eeff', arms: '#00ccdd', legs: '#00aabb' };
let currentCape = 'none';
let unlockedCapes = ['none'];
const CAPES = [
    { id: 'none', name: 'None', cost: 0 },
    { id: 'hero', name: 'Hero', cost: 30, color: '#ff0000' },
    { id: 'royal', name: 'Royal', cost: 40, color: '#4400aa' },
    { id: 'ice_cape', name: 'Ice', cost: 35, color: '#88ddff' },
    { id: 'flame_cape', name: 'Flame', cost: 45, color: '#ff6600' },
];
let capePhysics = [];
let currentJumpEffect = 'dust';
let unlockedJumpEffects = ['dust'];
const JUMP_EFFECTS = [
    { id: 'dust', name: 'Dust', cost: 0, color: '#888888' },
    { id: 'star_burst', name: 'Star Burst', cost: 20, color: '#ffd700' },
    { id: 'electric_spark', name: 'Electric', cost: 25, color: '#00e5ff' },
    { id: 'leaf_scatter', name: 'Leaf', cost: 20, color: '#44aa22' },
    { id: 'pixel_shatter', name: 'Pixel', cost: 30, color: '#ff4081' },
];
let currentLandEffect = 'dust';
let unlockedLandEffects = ['dust'];
const LAND_EFFECTS = [
    { id: 'dust', name: 'Dust', cost: 0 },
    { id: 'shockwave_ring', name: 'Shockwave', cost: 25 },
    { id: 'crater_crack', name: 'Crater', cost: 30 },
    { id: 'water_splash', name: 'Splash', cost: 20 },
    { id: 'fire_stomp', name: 'Fire Stomp', cost: 35 },
];
let currentEyeStyle = 0;
let playerBlinkTimer = 0;
let footprintTrail = [];
const EXTRA_CELEBRATIONS = ['moonwalk', 'breakdance', 'victory_lap', 'air_guitar', 'dab'];
let currentNameplate = 'clean';
let unlockedNameplates = ['clean'];

// --- Features 76-85: UI/UX State ---
let splitTimerData = { sectionStart: 0, pbSectionTime: 0 };
let perfOverlayVisible = false;
let radialMenuOpen = false;
let radialMenuSelection = -1;
const RADIAL_ITEMS = ['Restart', 'Quit', 'Practice', 'Ghost', 'Photo', 'Zen', 'Speed', 'Skip'];
let notificationQueue = [];
let hudToggles = { timer: true, deaths: true, dash: true, combo: true, speed: true, xp: true, distance: true, streak: true };
let levelRatings = {};
let contextHintsShown = {};

// --- Features 86-92: Editor State ---
let editorMultiSelect = { active: false, startX: 0, startY: 0, endX: 0, endY: 0, selected: [] };
let editorGridSnap = 'full'; // 'full', 'half', 'free'
let editorLevelMeta = { name: '', author: '', difficulty: 3, description: '' };
let editorTestSpawn = null;
let editorActiveLayer = 'main'; // 'background', 'main', 'foreground'
let editorLayerVisibility = { background: true, main: true, foreground: true };

// --- Features 93-97: QOL State ---
let dyslexiaFontEnabled = false;
let gameSpeedMultiplier = 1.0; // 0.5 to 1.5
let autoCameraZoom = true;

// --- Features 31-40: Visual Effects State ---
let dynamicLights = [];
let rainActive = false;
let rainDrops = [];
let rainIntensity = 0.5;
let lightningTimer = 0;
let comboAuraColor = null;
let deathFreezeTimer = 0;
let levelIntroPanActive = false;
let levelIntroPanTimer = 0;
let levelIntroPanPhase = 'toGoal'; // 'toGoal', 'toSpawn'

// --- Features 41-46: Audio State ---
let hazardProximityGain = null;
let hazardProximityOsc = null;
let comboMelodyNote = 0;
let bossMusicActive = false;

// --- Feature 98-100: Achievement Categories + Secret + Completionist ---
const ACHIEVEMENT_RARITIES = { common: '#aaaaaa', uncommon: '#44aa44', rare: '#4488ff', epic: '#aa44ff', legendary: '#ffd700' };
const SECRET_ACHIEVEMENTS = [
    { id: 'secret_pacifist', name: 'Pacifist', desc: 'Complete a level touching only 3 platforms', icon: '☮', rarity: 'epic', secret: true },
    { id: 'secret_ceiling', name: 'Ceiling Walker', desc: 'Spend 10s on ceilings in one level', icon: '⇅', rarity: 'rare', secret: true },
    { id: 'secret_ricochet', name: 'Ricochet Master', desc: '5 ricochet dashes in one run', icon: '↗', rarity: 'epic', secret: true },
    { id: 'secret_backwards', name: 'Backwards', desc: 'Reach goal moving left for 50%+ of level', icon: '←', rarity: 'rare', secret: true },
    { id: 'secret_floor_lava', name: 'Floor is Lava', desc: 'Complete a level airborne 80%+ of time', icon: '🔥', rarity: 'legendary', secret: true },
];
let platformsTouched = 0;
let ceilingWalkTime = 0;
let ricochetCount = 0;
let backwardsTime = 0;
let forwardsTime = 0;
let airborneTime = 0;
let groundedTime = 0;

// Editor state
let editorTool = 'platform';
let editorMouseX = 0, editorMouseY = 0;
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
            case 'slowmo': {
                // Slow-mo activation: descending warp
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const filter = audioCtx.createBiquadFilter();
                osc.connect(filter); filter.connect(gain); gain.connect(audioDest());
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(200, now + 0.4);
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(2000, now);
                filter.frequency.exponentialRampToValueAtTime(300, now + 0.4);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                osc.start(now); osc.stop(now + 0.5);
                break;
            }
            case 'drone_detect': {
                // Alarming drone detection beep
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc.type = 'square';
                osc.frequency.setValueAtTime(1200, now);
                osc.frequency.setValueAtTime(800, now + 0.05);
                osc.frequency.setValueAtTime(1200, now + 0.1);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now); osc.stop(now + 0.15);
                break;
            }
            case 'land_stone': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc.type = 'sine';
                osc.frequency.setValueAtTime(90 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(35, now + 0.1);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.start(now); osc.stop(now + 0.12);
                break;
            }
            case 'land_ice': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(2000 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
                gain.gain.setValueAtTime(0.03, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.start(now); osc.stop(now + 0.1);
                break;
            }
            case 'land_metal': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc.type = 'square';
                osc.frequency.setValueAtTime(400 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.start(now); osc.stop(now + 0.1);
                break;
            }
            case 'land_bounce': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
                osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.start(now); osc.stop(now + 0.2);
                break;
            }
            case 'land_conveyor': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(60, now + 0.1);
                gain.gain.setValueAtTime(0.03, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.start(now); osc.stop(now + 0.12);
                break;
            }
            case 'victory_fanfare': {
                // Grand ascending fanfare with harmony
                const melody = [523, 659, 784, 1047, 1319, 1568, 2093];
                for (let i = 0; i < melody.length; i++) {
                    const o = audioCtx.createOscillator();
                    const g = audioCtx.createGain();
                    const o2 = audioCtx.createOscillator();
                    const g2 = audioCtx.createGain();
                    o.connect(g); g.connect(audioDest());
                    o2.connect(g2); g2.connect(audioDest());
                    const t = now + i * 0.1;
                    o.type = 'sine';
                    o.frequency.setValueAtTime(melody[i], t);
                    g.gain.setValueAtTime(0.08, t);
                    g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
                    o2.type = 'triangle';
                    o2.frequency.setValueAtTime(melody[i] * 1.5, t);
                    g2.gain.setValueAtTime(0.03, t);
                    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
                    o.start(t); o.stop(t + 0.6);
                    o2.start(t); o2.stop(t + 0.5);
                }
                break;
            }
            case 'footstep_ice': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc.type = 'triangle';
                osc.frequency.setValueAtTime((1500 + Math.random() * 500) * pitchVar, now);
                gain.gain.setValueAtTime(0.015, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                osc.start(now); osc.stop(now + 0.04);
                break;
            }
            case 'footstep_conveyor': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc.type = 'square';
                osc.frequency.setValueAtTime((200 + Math.random() * 100) * pitchVar, now);
                gain.gain.setValueAtTime(0.02, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                osc.start(now); osc.stop(now + 0.04);
                break;
            }
            case 'emote': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(900, now + 0.1);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now); osc.stop(now + 0.15);
                break;
            }
            case 'splash': {
                // Water splash
                const bufSize = Math.floor(audioCtx.sampleRate * 0.15);
                const buffer = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
                const source = audioCtx.createBufferSource();
                source.buffer = buffer;
                const filter = audioCtx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(1000, now);
                filter.frequency.exponentialRampToValueAtTime(200, now + 0.15);
                const gain = audioCtx.createGain();
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                source.connect(filter); filter.connect(gain); gain.connect(audioDest());
                source.start(now); source.stop(now + 0.15);
                break;
            }
            case 'grapple': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(600 * pitchVar, now + 0.08);
                osc.frequency.exponentialRampToValueAtTime(400 * pitchVar, now + 0.2);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.start(now); osc.stop(now + 0.25);
                break;
            }
            case 'shockwave': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc.type = 'sine';
                osc.frequency.setValueAtTime(80 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
                gain.gain.setValueAtTime(0.07, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc.start(now); osc.stop(now + 0.35);
                break;
            }
            case 'waterSplash': {
                const bufSize = Math.floor(audioCtx.sampleRate * 0.25);
                const buffer2 = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
                const d2 = buffer2.getChannelData(0);
                for (let i = 0; i < bufSize; i++) d2[i] = Math.random() * 2 - 1;
                const src2 = audioCtx.createBufferSource();
                src2.buffer = buffer2;
                const filt2 = audioCtx.createBiquadFilter();
                filt2.type = 'bandpass';
                filt2.frequency.setValueAtTime(600, now);
                filt2.Q.setValueAtTime(1, now);
                const g2 = audioCtx.createGain();
                g2.gain.setValueAtTime(0.06, now);
                g2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                src2.connect(filt2); filt2.connect(g2); g2.connect(audioDest());
                src2.start(now); src2.stop(now + 0.25);
                break;
            }
            case 'laser': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc.type = 'square';
                osc.frequency.setValueAtTime(2000 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(800 * pitchVar, now + 0.1);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now); osc.stop(now + 0.15);
                break;
            }
            case 'flame': {
                const bufSize = Math.floor(audioCtx.sampleRate * 0.2);
                const bufF = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
                const dF = bufF.getChannelData(0);
                for (let i = 0; i < bufSize; i++) dF[i] = Math.random() * 2 - 1;
                const srcF = audioCtx.createBufferSource();
                srcF.buffer = bufF;
                const filtF = audioCtx.createBiquadFilter();
                filtF.type = 'lowpass';
                filtF.frequency.setValueAtTime(500, now);
                const gF = audioCtx.createGain();
                gF.gain.setValueAtTime(0.05, now);
                gF.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                srcF.connect(filtF); filtF.connect(gF); gF.connect(audioDest());
                srcF.start(now); srcF.stop(now + 0.2);
                break;
            }
            case 'gravityFlip': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc.type = 'sine';
                osc.frequency.setValueAtTime(200 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(800 * pitchVar, now + 0.15);
                osc.frequency.exponentialRampToValueAtTime(400 * pitchVar, now + 0.3);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc.start(now); osc.stop(now + 0.35);
                break;
            }
            case 'piston': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc.type = 'square';
                osc.frequency.setValueAtTime(60 * pitchVar, now);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.start(now); osc.stop(now + 0.12);
                break;
            }
            case 'pressurePlate': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(660 * pitchVar, now + 0.1);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now); osc.stop(now + 0.15);
                break;
            }
            case 'gate': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100 * pitchVar, now);
                osc.frequency.linearRampToValueAtTime(80 * pitchVar, now + 0.3);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc.start(now); osc.stop(now + 0.3);
                break;
            }
            case 'electric': {
                const bufSize = Math.floor(audioCtx.sampleRate * 0.1);
                const bufE = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
                const dE = bufE.getChannelData(0);
                for (let i = 0; i < bufSize; i++) dE[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
                const srcE = audioCtx.createBufferSource();
                srcE.buffer = bufE;
                const filtE = audioCtx.createBiquadFilter();
                filtE.type = 'highpass';
                filtE.frequency.setValueAtTime(2000, now);
                const gE = audioCtx.createGain();
                gE.gain.setValueAtTime(0.05, now);
                gE.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                srcE.connect(filtE); filtE.connect(gE); gE.connect(audioDest());
                srcE.start(now); srcE.stop(now + 0.1);
                break;
            }
            case 'ricochet': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(600 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(1200 * pitchVar, now + 0.05);
                osc.frequency.exponentialRampToValueAtTime(300 * pitchVar, now + 0.15);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
                osc.start(now); osc.stop(now + 0.18);
                break;
            }
            case 'ledgeGrab': {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc.type = 'sine';
                osc.frequency.setValueAtTime(350 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(500 * pitchVar, now + 0.08);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.start(now); osc.stop(now + 0.12);
                break;
            }
            case 'chargedJump': {
                const osc = audioCtx.createOscillator();
                const osc2 = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const gain2 = audioCtx.createGain();
                osc.connect(gain); gain.connect(audioDest());
                osc2.connect(gain2); gain2.connect(audioDest());
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300 * pitchVar, now);
                osc.frequency.exponentialRampToValueAtTime(1000 * pitchVar, now + 0.15);
                gain.gain.setValueAtTime(0.07, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc2.type = 'triangle';
                osc2.frequency.setValueAtTime(600 * pitchVar, now);
                osc2.frequency.exponentialRampToValueAtTime(1500 * pitchVar, now + 0.12);
                gain2.gain.setValueAtTime(0.03, now);
                gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now); osc.stop(now + 0.2);
                osc2.start(now); osc2.stop(now + 0.15);
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

        // Feature 18: Adaptive music layers
        // Bass always plays; kick/hihat on running; melody on airborne; pad on slow/idle
        musicInterval = setInterval(() => {
            if (!musicPlaying) { clearInterval(musicInterval); return; }
            const isPlaying = gameState === 'playing';
            const isRunning = isPlaying && Math.abs(player.vx) > 0.5;
            const isAirborne = isPlaying && !player.grounded;
            const isSlow = slowMotionActive;
            // Bass always
            playBassNote();
            // Kick + hihat when running
            if (isRunning || !isPlaying) { playKick(); playHihat(); }
            // Melody when airborne
            if ((isAirborne || musicBeatCount % 2 === 1) && !isSlow) playMelody();
            // Pad on slow-mo or every 4 beats
            if (isSlow || musicBeatCount % 4 === 0) playPad();
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

    // Feature 1: Slow-motion blue vignette
    if (slowMotionActive && gameState === 'playing') {
        const grad = ctx.createRadialGradient(canvasW / 2, canvasH / 2, canvasW * 0.2, canvasW / 2, canvasH / 2, canvasW * 0.7);
        grad.addColorStop(0, 'rgba(0, 50, 200, 0)');
        grad.addColorStop(1, 'rgba(0, 30, 150, 0.3)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvasW, canvasH);
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
    // New achievements
    if (comboCount >= 30) unlockAchievement('combo_30');
    if (prestigeCount >= 1) unlockAchievement('prestige_1');
    if (totalOrbs >= 500) unlockAchievement('midas');
    if (totalDeaths >= 1000) unlockAchievement('phoenix');
    if (getPlayerLevel() >= 10) unlockAchievement('veteran');
    // Level 16 gold
    if (bestGrades[15] === 'gold') unlockAchievement('ice_dancer');
    // Level 20 complete
    if (gameState === 'complete' && currentLevel === 19) unlockAchievement('gauntlet_ii');
    // All 20 levels complete
    let all20 = true;
    for (let i = 0; i < 20 && i < LEVELS.length; i++) { if (!bestTimes[i]) { all20 = false; break; } }
    if (all20) unlockAchievement('speedrunner');
    // Mirror mode clear
    if (mirrorMode && gameState === 'complete') unlockAchievement('mirror_master');
    // Weekly challenge
    if (weeklyChallenge && gameState === 'complete') unlockAchievement('weekly_warrior');
    // Boss slayer
    if (bossMode && gameState === 'complete') unlockAchievement('boss_slayer');
    // Star collector: check if any level has all 3 stars
    for (const lvl in starRatings) {
        const sr = starRatings[lvl];
        if (sr && sr.complete && sr.silverTime && sr.goldNoDeath) unlockAchievement('all_stars');
    }
    // Mastery
    for (const lvl in masteryBadges) {
        const mb = masteryBadges[lvl];
        if (mb && mb.zeroDeath && mb.noDash && mb.allOrbs && mb.speedRecord) unlockAchievement('true_master');
    }
    // Mastery V: 5 levels with mastery badges
    let masteryCount = 0;
    for (const lvl in masteryBadges) {
        const mb = masteryBadges[lvl];
        if (mb && mb.zeroDeath && mb.noDash && mb.allOrbs && mb.speedRecord) masteryCount++;
    }
    if (masteryCount >= 5) unlockAchievement('all_mastery_5');
    // New 30-feature achievements
    if (!droneAlertTriggered && bossMode && gameState === 'complete' && enemyDrones.length > 0) unlockAchievement('untouchable');
    if (bossMode && gameState === 'complete' && deathCount === 0) unlockAchievement('boss_deathless');
    if (totalSlowMoUses >= 50) unlockAchievement('bullet_time_50');
    if (difficulty === 'extreme' && gameState === 'complete' && currentLevel >= 0 && currentLevel < GRADE_THRESHOLDS.length && levelTimer <= GRADE_THRESHOLDS[currentLevel].gold) unlockAchievement('extreme_gold');
    if (totalOrbs >= 1000) unlockAchievement('orbs_1000');
    if (currentStreak >= 10) unlockAchievement('streak_10');
    if (dailyLoginStreak >= 7) unlockAchievement('daily_7');
    if (gameState === 'complete' && currentLevel === 19 && deathCount === 0) unlockAchievement('level20_deathless');
    // 100-feature achievements
    if (seasonPassTier >= 10) unlockAchievement('season_10');
    if (seasonPassTier >= 50) unlockAchievement('season_50');
    if (Object.keys(unlockedSkills).length >= 12) unlockAchievement('skill_tree_full');
    if (challengeTokens >= 100) unlockAchievement('tokens_100');
    if (ngPlusMode && gameState === 'complete') unlockAchievement('ng_plus_clear');
    if (reverseMode && gameState === 'complete') unlockAchievement('reverse_clear');
    if (survivalMode && gameState === 'complete') unlockAchievement('survival_clear');
    if (relayMode && gameState === 'complete') unlockAchievement('relay_complete');
    if (speedrunMode && speedrunLevel >= LEVELS.length) unlockAchievement('speedrun_complete');
    if (bossRushMode && bossRushLevel >= 3) unlockAchievement('boss_rush_clear');
    // Secret achievements
    if (platformsTouched <= 3 && gameState === 'complete') unlockAchievement('secret_pacifist');
    if (ceilingWalkTime >= 600) unlockAchievement('secret_ceiling');
    if (ricochetCount >= 5) unlockAchievement('secret_ricochet');
    if (backwardsTime > forwardsTime && gameState === 'complete') unlockAchievement('secret_backwards');
    if (airborneTime > groundedTime * 4 && gameState === 'complete') unlockAchievement('secret_floor_lava');
    // Completionist supreme: check all others
    const totalAch = ACHIEVEMENTS.length - 1; // exclude completionist itself
    const unlockedCount = Object.keys(unlockedAchievements).length;
    if (unlockedCount >= totalAch) unlockAchievement('completionist_supreme');
}

function populateAchievements() {
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (const ach of ACHIEVEMENTS) {
        const card = document.createElement('div');
        const isUnlocked = unlockedAchievements[ach.id];
        const isSecret = ach.secret && !isUnlocked;
        const rarity = ach.rarity || 'common';
        const rarityColor = ACHIEVEMENT_RARITIES[rarity] || '#aaa';
        card.className = 'achievement-card ' + (isUnlocked ? 'unlocked' : 'locked');
        if (isUnlocked && rarity) card.style.borderColor = rarityColor;
        card.innerHTML =
            '<div class="achievement-icon" style="' + (isUnlocked ? 'border-color:' + rarityColor : '') + '">' + (isSecret ? '?' : ach.icon) + '</div>' +
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
        // Feature 14: Achievement-locked skins
        const achLock = skin.achievementLock;
        const achUnlocked = achLock ? unlockedAchievements[achLock] : true;
        const achName = achLock ? (ACHIEVEMENTS.find(a => a.id === achLock) || {}).name || achLock : '';
        card.innerHTML =
            '<div class="skin-preview" style="background:' + previewColor + '"></div>' +
            '<div class="skin-name">' + skin.name + '</div>' +
            (achLock && !achUnlocked ? '<div class="skin-cost" style="color:#ff8800">🔒 ' + achName + '</div>' :
            owned ? (equipped ? '<div class="skin-status">EQUIPPED</div>' : '<div class="skin-status" style="color:#00e5ff">EQUIP</div>') :
            '<div class="skin-cost">' + skin.cost + ' orbs</div>');
        card.addEventListener('click', () => {
            // Feature 14: Block purchase if achievement-locked
            if (achLock && !achUnlocked) { playSound('death'); return; }
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
        // New block types in daily
        if (rng() > 0.8) icePlatforms.push(icePlat(cx, y, w, 1));
        if (rng() > 0.85) bouncePads.push(bouncePad(cx + 1, y, 2, 1, -13 - Math.floor(rng() * 3)));
        if (rng() > 0.9) conveyorBelts.push(conveyor(cx, y, w, 1, rng() > 0.5 ? 1 : -1, 2));
        if (rng() > 0.92) windZones.push(windZoneObj(cx, y - 6, w, 6, (rng() - 0.5) * 4, 0));
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
    icePlatforms = []; conveyorBelts = []; bouncePads = []; toggleBlocksA = []; toggleBlocksB = [];
    toggleSwitches = []; laserBeams = []; gravityZones = []; teleporterPads = [];
    crumblingWalls = []; ziplines = []; windZones = []; toggleState = false;
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
    icePlatforms = []; conveyorBelts = []; bouncePads = []; toggleBlocksA = []; toggleBlocksB = [];
    toggleSwitches = []; laserBeams = []; gravityZones = []; teleporterPads = [];
    crumblingWalls = []; ziplines = []; windZones = []; toggleState = false;
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
    // New block types in endless
    if (diffScale > 0.2 && rng() > 0.85) icePlatforms.push(icePlat(startX, y, w, 1));
    if (diffScale > 0.3 && rng() > 0.88) bouncePads.push(bouncePad(startX + 1, y, 2, 1, -13));
    if (diffScale > 0.4 && rng() > 0.9) conveyorBelts.push(conveyor(startX, y, w, 1, rng() > 0.5 ? 1 : -1, 2 + diffScale));
    if (diffScale > 0.5 && rng() > 0.92) windZones.push(windZoneObj(startX, y - 5, w, 5, (rng() - 0.5) * 4, 0));
    if (diffScale > 0.6 && rng() > 0.95) laserBeams.push(laser(startX + Math.floor(w / 2), y - 6, 1, 6, 50, 50));
    // Feature 2: Enemy drones at 300m+ in endless
    if (dist > 300 && rng() > 0.92) enemyDrones.push(enemyDrone(startX + Math.floor(w / 2), y - 4, startX, startX + w, y - 4));
    // Feature 3: Wall spikes in endless at 200m+
    if (dist > 200 && rng() > 0.93) wallSpikes.push(wallSpike(startX, y - 2, 2, rng() > 0.5 ? 1 : -1, 30, 90));
    // Feature 10: Water pools in endless at 150m+
    if (dist > 150 && rng() > 0.94) waterPools.push(waterPool(startX, y + 1, w, 2));
    // New blocks in endless
    if (dist > 250 && rng() > 0.93) trampolines.push(trampoline(startX + 1, y, 2));
    if (dist > 350 && rng() > 0.94) disappearingPlatforms.push(disappearPlat(startX, y, w, 1, 80, 50));
    if (dist > 400 && rng() > 0.95) sawblades.push(sawblade(startX + Math.floor(w / 2), y - 3, 1, startX + Math.floor(w / 2), y - 3, 0.04));
    if (dist > 200 && rng() > 0.94) speedPads.push(speedPad(startX, y - 0.3, Math.min(w, 3), 10));
    if (dist > 450 && rng() > 0.95) lavaFloors.push(lavaFloor(startX, y + 2, w, 1, 0));
    if (dist > 300 && rng() > 0.95) magnetPlatforms.push(magnetPlat(startX, y - 3, w, 1, 4));
    // 100-feature update: new blocks in endless
    if (dist > 500 && rng() > 0.96) acidPools.push(acidPool(startX, y + 1, w, 2));
    if (dist > 400 && rng() > 0.95) laserTurrets.push(laserTurret(startX, y - 3, rng() > 0.5 ? 1 : -1, 40, 60));
    if (dist > 350 && rng() > 0.95) bubblePlatforms.push(bubblePlat(startX + Math.floor(w / 2), y - 4));
    if (dist > 450 && rng() > 0.96) flameJets.push(flameJet(startX + 1, y, 'up', 40, 60));
    if (dist > 500 && rng() > 0.97) shockwaveEmitters.push(shockwaveEmitter(startX + Math.floor(w / 2), y - 2, 120));
    if (dist > 550 && rng() > 0.96) shadowPlatforms.push(shadowPlat(startX, y, w, 1, 4));
    if (dist > 600 && rng() > 0.97) electrifiedRails.push(electrifiedRail(startX, y, w, 60, 90));
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
    // Feature 26: PB checkpoint splits — green/red vs personal best
    if (!pbSplits[currentLevel]) pbSplits[currentLevel] = [];
    const pbTime = pbSplits[currentLevel][checkpointIndex];
    if (pbTime !== undefined) {
        const delta = levelTimer - pbTime;
        const sign = delta > 0 ? '+' : '';
        const color = delta > 0 ? '#ff4444' : '#4caf50';
        spawnFloatingText(sign + delta.toFixed(2) + 's', player.x + player.w / 2, player.y - 50, color, 16);
    } else {
        spawnFloatingText('+' + split.toFixed(2) + 's', player.x + player.w / 2, player.y - 40, '#00e5ff', 14);
    }
    if (pbTime === undefined || levelTimer < pbTime) {
        pbSplits[currentLevel][checkpointIndex] = levelTimer;
        try { localStorage.setItem('parkour_pb_splits', JSON.stringify(pbSplits)); } catch(e) {}
    }
    currentSplitIndex++;
    // Feature 5: Spawn checkpoint challenge orbs
    const cp = checkpoints[checkpointIndex];
    if (cp) spawnCheckpointChallengeOrbs(cp);
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

// --- New Block Constructors ---
function icePlat(tx, ty, tw, th) {
    return { x: tx * TILE, y: ty * TILE, w: tw * TILE, h: (th || 1) * TILE, isIce: true };
}

function conveyor(tx, ty, tw, dir, speed) {
    return { x: tx * TILE, y: ty * TILE, w: tw * TILE, h: TILE, dir: dir || 1, speed: speed || 2, animOffset: 0 };
}

function bouncePad(tx, ty, tw) {
    return { x: tx * TILE, y: ty * TILE, w: (tw || 2) * TILE, h: TILE * 0.5, force: -14, animTimer: 0 };
}

function toggleBlock(tx, ty, tw, th, group) {
    return { x: tx * TILE, y: ty * TILE, w: tw * TILE, h: (th || 1) * TILE, group: group || 'A' };
}

function toggleSwitch(tx, ty) {
    return { x: tx * TILE, y: ty * TILE, w: TILE, h: TILE, hit: false };
}

function laser(tx, ty, tw, th, onTime, offTime) {
    return { x: tx * TILE, y: ty * TILE, w: (tw || 1) * TILE, h: (th || 1) * TILE, onTime: onTime || 60, offTime: offTime || 40, timer: 0, active: true };
}

function gravZone(tx, ty, tw, th, grav) {
    return { x: tx * TILE, y: ty * TILE, w: tw * TILE, h: th * TILE, gravMod: grav || -1 };
}

function teleporter(tx1, ty1, tx2, ty2) {
    return { x1: tx1 * TILE, y1: ty1 * TILE, x2: tx2 * TILE, y2: ty2 * TILE, w: TILE, h: TILE * 2, cooldown: 0 };
}

function crumbleWall(tx, ty, th) {
    return { x: tx * TILE, y: ty * TILE, w: TILE, h: (th || 3) * TILE, hits: 0, maxHits: 2, broken: false, shakeTimer: 0 };
}

function ziplineObj(tx1, ty1, tx2, ty2) {
    return { x1: tx1 * TILE, y1: ty1 * TILE, x2: tx2 * TILE, y2: ty2 * TILE, speed: 4 };
}

function windZoneObj(tx, ty, tw, th, fx, fy) {
    return { x: tx * TILE, y: ty * TILE, w: tw * TILE, h: th * TILE, forceX: fx || 0, forceY: fy || 0, particles: [] };
}

// --- Wall Spike Constructor (Feature 3) ---
function wallSpike(tx, ty, th, dir, onTime, offTime) {
    return { x: tx * TILE, y: ty * TILE, w: TILE * 0.4, h: (th || 2) * TILE, dir: dir || 1, onTime: onTime || 30, offTime: offTime || 90, timer: 0, extended: false };
}

// --- Water Pool Constructor (Feature 10) ---
function waterPool(tx, ty, tw, th) {
    return { x: tx * TILE, y: ty * TILE, w: tw * TILE, h: (th || 2) * TILE, wavePhase: Math.random() * Math.PI * 2 };
}

// --- Enemy Drone Constructor (Feature 2) ---
function enemyDrone(tx, ty, patrolX1, patrolX2, patrolY) {
    return { x: tx * TILE, y: ty * TILE, w: 14, h: 14, patrolX1: patrolX1 * TILE, patrolX2: patrolX2 * TILE, patrolY: (patrolY || ty) * TILE, speed: 1.5, chaseRange: 60, alertTimer: 0, dir: 1, glowPhase: Math.random() * Math.PI * 2 };
}

// --- New Block Types ---
let magnetPlatforms = [];
let trampolines = [];
let disappearingPlatforms = [];
let sawblades = [];
let springWalls = [];
let lavaFloors = [];
let portalBeams = [];
let speedPads = [];

function magnetPlat(tx, ty, tw, th, range) {
    return { x: tx * TILE, y: ty * TILE, w: tw * TILE, h: (th || 1) * TILE, range: (range || 4) * TILE, pullForce: 0.3 };
}

function trampoline(tx, ty, tw) {
    return { x: tx * TILE, y: ty * TILE, w: (tw || 2) * TILE, h: TILE * 0.4, force: -18, animTimer: 0, compressed: false };
}

function disappearPlat(tx, ty, tw, th, onTime, offTime) {
    return { x: tx * TILE, y: ty * TILE, w: tw * TILE, h: (th || 1) * TILE, onTime: onTime || 90, offTime: offTime || 60, timer: 0, visible: true };
}

function sawblade(tx, ty, radius, cx, cy, speed) {
    return { x: tx * TILE, y: ty * TILE, radius: (radius || 1) * TILE * 0.5, cx: (cx || tx) * TILE, cy: (cy || ty) * TILE, orbitRadius: 0, speed: speed || 0.03, angle: 0 };
}

function springWall(tx, ty, th, dir) {
    return { x: tx * TILE, y: ty * TILE, w: TILE, h: (th || 3) * TILE, dir: dir || 1, bounceForce: 10, animTimer: 0 };
}

function lavaFloor(tx, ty, tw, th, riseSpeed) {
    return { x: tx * TILE, y: ty * TILE, w: tw * TILE, h: (th || 2) * TILE, riseSpeed: riseSpeed || 0, baseY: ty * TILE, wavePhase: 0 };
}

function portalBeam(tx, ty, tw, destTx, destTy) {
    return { x: tx * TILE, y: ty * TILE, w: tw * TILE, h: TILE * 0.5, destX: destTx * TILE, destY: destTy * TILE, cooldown: 0, glowPhase: 0 };
}

function speedPad(tx, ty, tw, boost) {
    return { x: tx * TILE, y: ty * TILE, w: (tw || 2) * TILE, h: TILE * 0.3, boost: boost || 12, duration: 60, animOffset: 0 };
}

// ============================================
// NEW BLOCK CONSTRUCTORS (Features 16-30)
// ============================================

function pressurePlate(tx, ty, tw, linkedIds) {
    return { x: tx * TILE, y: ty * TILE, w: (tw || 2) * TILE, h: TILE * 0.3, linkedIds: linkedIds || [], activated: false, pressTimer: 0, requiredTime: 60 };
}

function gateBlock(tx, ty, tw, th, gateId) {
    return { x: tx * TILE, y: ty * TILE, w: (tw || 1) * TILE, h: (th || 3) * TILE, gateId: gateId || 'A', open: false, openProgress: 0, origY: ty * TILE };
}

function acidPool(tx, ty, tw, th) {
    return { x: tx * TILE, y: ty * TILE, w: tw * TILE, h: (th || 2) * TILE, bubblePhase: Math.random() * Math.PI * 2 };
}

function rotatingPlat(tx, ty, tw, pivotTx, pivotTy, speed) {
    const px = tx * TILE, py = ty * TILE;
    const pvx = (pivotTx || tx) * TILE, pvy = (pivotTy || ty) * TILE;
    const radius = Math.sqrt((px - pvx) ** 2 + (py - pvy) ** 2) || TILE * 3;
    return { x: px, y: py, w: (tw || 3) * TILE, h: TILE, pivotX: pvx, pivotY: pvy, radius: radius, angle: Math.atan2(py - pvy, px - pvx), speed: speed || 0.02 };
}

function laserTurret(tx, ty, dir, onTime, offTime) {
    return { x: tx * TILE, y: ty * TILE, w: TILE, h: TILE, dir: dir || 1, warmUp: 30, onTime: onTime || 40, offTime: offTime || 60, timer: 0, phase: 'off', beamLength: 12 * TILE };
}

function bubblePlat(tx, ty) {
    return { x: tx * TILE, y: ty * TILE, w: TILE * 1.5, h: TILE * 1.5, radius: TILE * 0.75, contactTimer: 0, popped: false, regenTimer: 0, driftSpeed: -0.3, origY: ty * TILE };
}

function flameJet(tx, ty, dir, onTime, offTime) {
    return { x: tx * TILE, y: ty * TILE, w: TILE, h: TILE, dir: dir || 'up', onTime: onTime || 40, offTime: offTime || 60, timer: 0, active: false, flameLength: 4 * TILE, warningTimer: 0 };
}

function gravityOrbPickup(tx, ty) {
    return { x: tx * TILE + TILE / 2, y: ty * TILE + TILE / 2, radius: 10, collected: false, respawnTimer: 0, bobPhase: Math.random() * Math.PI * 2 };
}

function shockwaveEmitter(tx, ty, interval) {
    return { x: tx * TILE + TILE / 2, y: ty * TILE + TILE / 2, interval: interval || 120, timer: 0, waveRadius: 0, waveActive: false, pushForce: 5 };
}

function shadowPlat(tx, ty, tw, th, revealRadius) {
    return { x: tx * TILE, y: ty * TILE, w: tw * TILE, h: (th || 1) * TILE, revealRadius: (revealRadius || 4) * TILE, visibility: 0 };
}

function timedSwitchBlock(tx, ty, tw, th, duration) {
    return { x: tx * TILE, y: ty * TILE, w: tw * TILE, h: (th || 1) * TILE, duration: duration || 120, timer: 0, solid: false };
}

function electrifiedRail(tx, ty, tw, onTime, offTime) {
    return { x: tx * TILE, y: ty * TILE, w: tw * TILE, h: TILE * 0.4, onTime: onTime || 60, offTime: offTime || 90, timer: 0, electrified: false, sparkPhase: 0 };
}

function phantomWall(tx, ty, tw, th, passDir) {
    return { x: tx * TILE, y: ty * TILE, w: (tw || 1) * TILE, h: (th || 3) * TILE, passableDir: passDir || 'right' };
}

function pistonBlock(tx, ty, tw, th, dir, extendDist, speed) {
    return { x: tx * TILE, y: ty * TILE, w: (tw || 1) * TILE, h: (th || 1) * TILE, dir: dir || 'right', extendDist: (extendDist || 3) * TILE, speed: speed || 2, extended: 0, extending: true, origX: tx * TILE, origY: ty * TILE };
}

function thornVine(tx, ty, th, wallSide) {
    const segs = [];
    for (let i = 0; i < (th || 4); i++) segs.push({ x: tx * TILE, y: (ty + i) * TILE, phase: Math.random() * Math.PI * 2 });
    return { x: tx * TILE, y: ty * TILE, h: (th || 4) * TILE, side: wallSide || 'left', segments: segs, growPhase: 0, grown: true, growTimer: 0, onTime: 120, offTime: 60 };
}

// ============================================
// PUZZLE MODE LEVELS (Feature 55)
// ============================================
const PUZZLE_LEVELS = [
    function() { // Puzzle 1: Pressure Plate Bridge
        platforms.push(plat(0, 18, 8, 2)); platforms.push(plat(20, 18, 8, 2)); platforms.push(plat(40, 18, 8, 2));
        pressurePlates.push(pressurePlate(3, 17.7, 2, ['bridgeA']));
        gateBlocks.push(gateBlock(10, 15, 8, 1, 'bridgeA'));
        pressurePlates.push(pressurePlate(23, 17.7, 2, ['bridgeB']));
        gateBlocks.push(gateBlock(30, 15, 8, 1, 'bridgeB'));
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = { x: 44 * TILE, y: 16 * TILE, w: TILE * 2, h: TILE * 2 };
    },
    function() { // Puzzle 2: Gravity Orb Maze
        platforms.push(plat(0, 18, 10, 2)); platforms.push(plat(0, 5, 10, 1));
        platforms.push(plat(15, 18, 10, 2)); platforms.push(plat(15, 5, 10, 1));
        platforms.push(plat(30, 18, 10, 2));
        gravityOrbs.push(gravityOrbPickup(12, 16)); gravityOrbs.push(gravityOrbPickup(27, 7));
        spikes.push(spike(10, 18, 5, 1));
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = { x: 34 * TILE, y: 16 * TILE, w: TILE * 2, h: TILE * 2 };
    },
    function() { // Puzzle 3: Piston Pathway
        platforms.push(plat(0, 18, 6, 2)); platforms.push(plat(24, 18, 6, 2)); platforms.push(plat(48, 18, 6, 2));
        pistonBlocks.push(pistonBlock(8, 17, 2, 1, 'right', 6, 1.5));
        pistonBlocks.push(pistonBlock(18, 14, 2, 1, 'right', 6, 1.5));
        pistonBlocks.push(pistonBlock(32, 17, 2, 1, 'right', 6, 1.5));
        pistonBlocks.push(pistonBlock(42, 14, 2, 1, 'right', 6, 1.5));
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = { x: 50 * TILE, y: 16 * TILE, w: TILE * 2, h: TILE * 2 };
    },
    function() { // Puzzle 4: Shadow Platform Trust
        platforms.push(plat(0, 18, 6, 2));
        for (let i = 0; i < 8; i++) shadowPlatforms.push(shadowPlat(8 + i * 5, 16 - (i % 3) * 2, 3, 1, 3));
        platforms.push(plat(50, 18, 6, 2));
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = { x: 52 * TILE, y: 16 * TILE, w: TILE * 2, h: TILE * 2 };
    },
    function() { // Puzzle 5: Timed Switch Race
        platforms.push(plat(0, 18, 6, 2)); platforms.push(plat(15, 18, 4, 2)); platforms.push(plat(25, 18, 4, 2));
        platforms.push(plat(35, 18, 4, 2)); platforms.push(plat(50, 18, 6, 2));
        timedSwitchBlocks.push(timedSwitchBlock(10, 17, 4, 1, 180));
        timedSwitchBlocks.push(timedSwitchBlock(20, 17, 4, 1, 150));
        timedSwitchBlocks.push(timedSwitchBlock(30, 17, 4, 1, 120));
        timedSwitchBlocks.push(timedSwitchBlock(40, 17, 4, 1, 100));
        boostPads.push(boost(2, 17, 3, 1));
        spawnPoint = { x: 1 * TILE, y: 16 * TILE };
        goalZone = { x: 52 * TILE, y: 16 * TILE, w: TILE * 2, h: TILE * 2 };
    },
];

// ============================================
// NEW UPDATE FUNCTIONS (Features 16-30 blocks)
// ============================================

function updateNewBlocks3(dt) {
    const p = player;
    const s = dt;

    // Pressure Plates (Feature 16)
    for (const pp of pressurePlates) {
        const footBox = { x: p.x, y: p.y + p.h - 2, w: p.w, h: 4 };
        const ppBox = { x: pp.x, y: pp.y, w: pp.w, h: TILE };
        if (aabb(footBox, ppBox) && p.onGround) {
            pp.pressTimer += s;
            if (pp.pressTimer >= pp.requiredTime && !pp.activated) {
                pp.activated = true;
                playSound('click');
                spawnFloatingText('ACTIVATED!', pp.x + pp.w / 2, pp.y - 20, '#00ff88', 16);
                for (const gate of gateBlocks) {
                    if (pp.linkedIds.includes(gate.gateId)) gate.open = true;
                }
            }
        } else {
            pp.pressTimer = Math.max(0, pp.pressTimer - s * 0.5);
        }
    }

    // Gate Blocks (Feature 17)
    for (const gate of gateBlocks) {
        if (gate.open && gate.openProgress < 1) {
            gate.openProgress = Math.min(1, gate.openProgress + 0.02 * s);
            gate.y = gate.origY + gate.h * gate.openProgress;
        }
    }

    // Acid Pools (Feature 18) - kill on contact
    for (const ap of acidPools) {
        ap.bubblePhase += 0.05 * s;
        const pBox = { x: p.x, y: p.y, w: p.w, h: p.h };
        if (aabb(pBox, ap)) killPlayer();
    }

    // Rotating Platforms (Feature 19)
    for (const rp of rotatingPlatforms) {
        rp.angle += rp.speed * s;
        rp.x = rp.pivotX + Math.cos(rp.angle) * rp.radius;
        rp.y = rp.pivotY + Math.sin(rp.angle) * rp.radius;
    }

    // Laser Turrets (Feature 20)
    for (const lt of laserTurrets) {
        lt.timer += s;
        if (lt.phase === 'off' && lt.timer >= lt.offTime) { lt.phase = 'warmup'; lt.timer = 0; }
        else if (lt.phase === 'warmup' && lt.timer >= lt.warmUp) { lt.phase = 'on'; lt.timer = 0; playSound('laser'); }
        else if (lt.phase === 'on' && lt.timer >= lt.onTime) { lt.phase = 'off'; lt.timer = 0; }
        if (lt.phase === 'on') {
            let bx = lt.x, by = lt.y + TILE / 2, bw, bh = 4;
            if (lt.dir === 1) { bx = lt.x + TILE; bw = lt.beamLength; }
            else { bx = lt.x - lt.beamLength; bw = lt.beamLength; }
            if (aabb({ x: p.x, y: p.y, w: p.w, h: p.h }, { x: bx, y: by - 2, w: bw, h: bh })) killPlayer();
        }
    }

    // Bubble Platforms (Feature 21)
    for (const bp of bubblePlatforms) {
        if (bp.popped) {
            bp.regenTimer += s;
            if (bp.regenTimer >= 300) { bp.popped = false; bp.regenTimer = 0; bp.y = bp.origY; bp.contactTimer = 0; }
            continue;
        }
        bp.y += bp.driftSpeed * s * 0.1;
        const footBox = { x: p.x, y: p.y + p.h, w: p.w, h: 4 };
        if (aabb(footBox, { x: bp.x, y: bp.y, w: bp.w, h: bp.h })) {
            bp.contactTimer += s;
            if (bp.contactTimer >= 90) {
                bp.popped = true;
                spawnParticles(bp.x + bp.w / 2, bp.y + bp.h / 2, 8, '#aaddff', 4, 1);
                playSound('waterSplash');
            }
        }
    }

    // Flame Jets (Feature 22)
    for (const fj of flameJets) {
        fj.timer += s;
        if (!fj.active && fj.timer >= fj.offTime) {
            fj.warningTimer = 30;
            fj.timer = 0;
            fj.active = true;
        } else if (fj.active && fj.timer >= fj.onTime) {
            fj.timer = 0;
            fj.active = false;
        }
        if (fj.warningTimer > 0) fj.warningTimer -= s;
        if (fj.active) {
            let fx, fy, fw, fh;
            if (fj.dir === 'up') { fx = fj.x; fy = fj.y - fj.flameLength; fw = TILE; fh = fj.flameLength; }
            else if (fj.dir === 'down') { fx = fj.x; fy = fj.y + TILE; fw = TILE; fh = fj.flameLength; }
            else if (fj.dir === 'left') { fx = fj.x - fj.flameLength; fy = fj.y; fw = fj.flameLength; fh = TILE; }
            else { fx = fj.x + TILE; fy = fj.y; fw = fj.flameLength; fh = TILE; }
            if (aabb({ x: p.x, y: p.y, w: p.w, h: p.h }, { x: fx, y: fy, w: fw, h: fh })) killPlayer();
        }
    }

    // Gravity Orbs (Feature 23)
    for (const go of gravityOrbs) {
        if (go.collected) { go.respawnTimer += s; if (go.respawnTimer >= 600) { go.collected = false; go.respawnTimer = 0; } continue; }
        go.bobPhase += 0.05 * s;
        const dx = (p.x + p.w / 2) - go.x;
        const dy = (p.y + p.h / 2) - go.y;
        if (Math.sqrt(dx * dx + dy * dy) < go.radius + 12) {
            go.collected = true;
            personalGravityDir *= -1;
            gravityFlipActive = true;
            gravityFlipTimer = 180;
            playSound('boost');
            spawnFloatingText('GRAVITY FLIP!', p.x + p.w / 2, p.y - 30, '#9933ff', 18);
        }
    }

    // Shockwave Emitters (Feature 24)
    for (const se of shockwaveEmitters) {
        se.timer += s;
        if (se.timer >= se.interval) {
            se.timer = 0;
            se.waveActive = true;
            se.waveRadius = 0;
            playSound('shockwave');
        }
        if (se.waveActive) {
            se.waveRadius += 3 * s;
            if (se.waveRadius > 6 * TILE) se.waveActive = false;
            const dx = (p.x + p.w / 2) - se.x;
            const dy = (p.y + p.h / 2) - se.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (Math.abs(dist - se.waveRadius) < 10) {
                const nx = dx / dist, ny = dy / dist;
                p.vx += nx * se.pushForce * s;
                p.vy += ny * se.pushForce * s;
            }
        }
    }

    // Shadow Platforms (Feature 25)
    for (const sp of shadowPlatforms) {
        const dx = (p.x + p.w / 2) - (sp.x + sp.w / 2);
        const dy = (p.y + p.h / 2) - (sp.y + sp.h / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        sp.visibility = Math.max(0, 1 - dist / sp.revealRadius);
    }

    // Timed Switch Blocks (Feature 26)
    for (const tsb of timedSwitchBlocks) {
        if (tsb.solid) {
            tsb.timer -= s;
            if (tsb.timer <= 0) tsb.solid = false;
        }
    }

    // Electrified Rails (Feature 27)
    for (const er of electrifiedRails) {
        er.timer += s;
        er.sparkPhase += 0.1 * s;
        const totalCycle = er.onTime + er.offTime;
        const cyclePos = er.timer % totalCycle;
        const wasElectrified = er.electrified;
        er.electrified = cyclePos < er.onTime;
        if (er.electrified && !wasElectrified) playSound('laser');
        const footBox = { x: p.x, y: p.y + p.h, w: p.w, h: 4 };
        if (aabb(footBox, er) && er.electrified) killPlayer();
    }

    // Phantom Walls (Feature 28)
    // Collision handled in getAllSolids with direction check

    // Piston Blocks (Feature 29)
    for (const pb of pistonBlocks) {
        if (pb.extending) {
            pb.extended = Math.min(pb.extendDist, pb.extended + pb.speed * s);
            if (pb.extended >= pb.extendDist) pb.extending = false;
        } else {
            pb.extended = Math.max(0, pb.extended - pb.speed * s);
            if (pb.extended <= 0) pb.extending = true;
        }
        if (pb.dir === 'right') pb.x = pb.origX + pb.extended;
        else if (pb.dir === 'left') pb.x = pb.origX - pb.extended;
        else if (pb.dir === 'up') pb.y = pb.origY - pb.extended;
        else pb.y = pb.origY + pb.extended;
        // Push player
        const pbBox = { x: pb.x, y: pb.y, w: pb.w, h: pb.h };
        if (aabb({ x: p.x, y: p.y, w: p.w, h: p.h }, pbBox)) {
            if (pb.dir === 'right' && pb.extending) p.x = pb.x + pb.w;
            else if (pb.dir === 'left' && pb.extending) p.x = pb.x - p.w;
            else if (pb.dir === 'up' && pb.extending) p.y = pb.y - p.h;
            else if (pb.dir === 'down' && pb.extending) p.y = pb.y + pb.h;
        }
    }

    // Thorn Vines (Feature 30)
    for (const tv of thornVines) {
        tv.growPhase += 0.03 * s;
        tv.growTimer += s;
        const totalCycle = tv.onTime + tv.offTime;
        const cyclePos = tv.growTimer % totalCycle;
        tv.grown = cyclePos < tv.onTime;
        if (tv.grown) {
            for (const seg of tv.segments) {
                const thorns = { x: seg.x - 4, y: seg.y, w: TILE + 8, h: TILE };
                if (aabb({ x: p.x, y: p.y, w: p.w, h: p.h }, thorns)) killPlayer();
            }
        }
    }

    // Gravity flip timer
    if (gravityFlipActive) {
        gravityFlipTimer -= s;
        if (gravityFlipTimer <= 0) { gravityFlipActive = false; personalGravityDir = 1; }
    }

    // Orb multiplier timer
    if (orbMultiplierTimer > 0) { orbMultiplierTimer -= s; if (orbMultiplierTimer <= 0) orbMultiplierValue = 1; }

    // Invulnerability timer (skill tree)
    if (invulnTimer > 0) invulnTimer -= s;

    // Bounce chain reset on ground
    if (p.onGround) bounceChainCount = 0;

    // Afterimage phase
    if (afterimagePhaseActive) {
        afterimagePhaseTimer -= s;
        if (afterimagePhaseTimer <= 0) afterimagePhaseActive = false;
        afterimageTrail.push({ x: p.x, y: p.y, w: p.w, h: p.h, alpha: 0.5 });
        if (afterimageTrail.length > 8) afterimageTrail.shift();
    } else {
        afterimageTrail = [];
    }

    // Track secret achievements
    if (!p.onGround) airborneTime += s; else groundedTime += s;
    if (p.vx < -0.5) backwardsTime += s;
    else if (p.vx > 0.5) forwardsTime += s;
    if (personalGravityDir === -1) ceilingWalkTime += s;
}

// ============================================
// NEW DRAW FUNCTIONS (Features 16-30 blocks)
// ============================================

function drawNewBlocks3() {
    // Pressure Plates
    for (const pp of pressurePlates) {
        const sx = pp.x - camera.x, sy = pp.y - camera.y;
        ctx.fillStyle = pp.activated ? '#00ff88' : '#887744';
        ctx.fillRect(sx, sy, pp.w, TILE * 0.3);
        if (pp.pressTimer > 0 && !pp.activated) {
            ctx.fillStyle = '#00ff88';
            ctx.fillRect(sx, sy, pp.w * (pp.pressTimer / pp.requiredTime), TILE * 0.3);
        }
    }

    // Gate Blocks
    for (const gate of gateBlocks) {
        if (gate.openProgress >= 1) continue;
        const sx = gate.x - camera.x, sy = gate.origY + gate.h * gate.openProgress - camera.y;
        ctx.fillStyle = '#666688';
        ctx.fillRect(sx, sy, gate.w, gate.h * (1 - gate.openProgress));
        ctx.strokeStyle = '#8888aa';
        ctx.strokeRect(sx, sy, gate.w, gate.h * (1 - gate.openProgress));
    }

    // Acid Pools
    for (const ap of acidPools) {
        const sx = ap.x - camera.x, sy = ap.y - camera.y;
        ctx.fillStyle = '#33cc00';
        ctx.globalAlpha = 0.7;
        ctx.fillRect(sx, sy, ap.w, ap.h);
        // Bubbles
        ctx.fillStyle = '#66ff33';
        for (let i = 0; i < 3; i++) {
            const bx = sx + (ap.w * 0.2) + (i * ap.w * 0.3);
            const by = sy + Math.sin(ap.bubblePhase + i * 2) * 4;
            ctx.beginPath(); ctx.arc(bx, by, 3, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
        // Glow
        const grd = ctx.createLinearGradient(sx, sy - 10, sx, sy);
        grd.addColorStop(0, 'rgba(51,204,0,0)'); grd.addColorStop(1, 'rgba(51,204,0,0.3)');
        ctx.fillStyle = grd; ctx.fillRect(sx, sy - 10, ap.w, 10);
    }

    // Rotating Platforms
    for (const rp of rotatingPlatforms) {
        const sx = rp.x - camera.x, sy = rp.y - camera.y;
        ctx.fillStyle = '#5566aa';
        ctx.fillRect(sx, sy, rp.w, rp.h);
        ctx.strokeStyle = '#7788cc'; ctx.strokeRect(sx, sy, rp.w, rp.h);
    }

    // Laser Turrets
    for (const lt of laserTurrets) {
        const sx = lt.x - camera.x, sy = lt.y - camera.y;
        ctx.fillStyle = '#554444';
        ctx.fillRect(sx, sy, TILE, TILE);
        if (lt.phase === 'warmup') {
            ctx.fillStyle = `rgba(255,0,0,${0.3 + 0.3 * Math.sin(lt.timer * 0.3)})`;
            ctx.fillRect(sx, sy, TILE, TILE);
        }
        if (lt.phase === 'on') {
            const bx = lt.dir === 1 ? sx + TILE : sx - lt.beamLength;
            ctx.fillStyle = 'rgba(255,0,0,0.8)';
            ctx.fillRect(bx, sy + TILE / 2 - 2, lt.beamLength, 4);
            ctx.fillStyle = 'rgba(255,100,100,0.4)';
            ctx.fillRect(bx, sy + TILE / 2 - 6, lt.beamLength, 12);
        }
    }

    // Bubble Platforms
    for (const bp of bubblePlatforms) {
        if (bp.popped) continue;
        const cx = bp.x + bp.w / 2 - camera.x, cy = bp.y + bp.h / 2 - camera.y;
        ctx.beginPath(); ctx.arc(cx, cy, bp.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(150,200,255,0.25)'; ctx.fill();
        ctx.strokeStyle = 'rgba(200,230,255,0.6)'; ctx.lineWidth = 2; ctx.stroke(); ctx.lineWidth = 1;
    }

    // Flame Jets
    for (const fj of flameJets) {
        const sx = fj.x - camera.x, sy = fj.y - camera.y;
        ctx.fillStyle = '#553322'; ctx.fillRect(sx, sy, TILE, TILE);
        if (fj.active) {
            let fx, fy, fw, fh;
            if (fj.dir === 'up') { fx = sx + 4; fy = sy - fj.flameLength; fw = TILE - 8; fh = fj.flameLength; }
            else if (fj.dir === 'down') { fx = sx + 4; fy = sy + TILE; fw = TILE - 8; fh = fj.flameLength; }
            else if (fj.dir === 'left') { fx = sx - fj.flameLength; fy = sy + 4; fw = fj.flameLength; fh = TILE - 8; }
            else { fx = sx + TILE; fy = sy + 4; fw = fj.flameLength; fh = TILE - 8; }
            const grad = ctx.createLinearGradient(fx, fy, fx + fw, fy + fh);
            grad.addColorStop(0, 'rgba(255,200,0,0.9)'); grad.addColorStop(0.5, 'rgba(255,80,0,0.7)'); grad.addColorStop(1, 'rgba(255,0,0,0.3)');
            ctx.fillStyle = grad; ctx.fillRect(fx, fy, fw, fh);
        }
        if (fj.warningTimer > 0) {
            ctx.fillStyle = `rgba(255,165,0,${0.3 * Math.sin(fj.warningTimer * 0.5)})`;
            ctx.fillRect(sx, sy, TILE, TILE);
        }
    }

    // Gravity Orbs
    for (const go of gravityOrbs) {
        if (go.collected) continue;
        const gx = go.x - camera.x, gy = go.y + Math.sin(go.bobPhase) * 4 - camera.y;
        ctx.beginPath(); ctx.arc(gx, gy, go.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#9933ff'; ctx.fill();
        ctx.strokeStyle = '#cc66ff'; ctx.lineWidth = 2; ctx.stroke(); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(gx, gy, go.radius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(153,51,255,0.3)'; ctx.stroke();
    }

    // Shockwave Emitters
    for (const se of shockwaveEmitters) {
        const sx = se.x - camera.x, sy = se.y - camera.y;
        ctx.beginPath(); ctx.arc(sx, sy, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ff8800'; ctx.fill();
        if (se.waveActive) {
            ctx.beginPath(); ctx.arc(sx, sy, se.waveRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255,136,0,${0.5 * (1 - se.waveRadius / (6 * TILE))})`;
            ctx.lineWidth = 3; ctx.stroke(); ctx.lineWidth = 1;
        }
    }

    // Shadow Platforms
    for (const sp of shadowPlatforms) {
        if (sp.visibility <= 0.02) continue;
        const sx = sp.x - camera.x, sy = sp.y - camera.y;
        ctx.globalAlpha = sp.visibility;
        ctx.fillStyle = '#334455';
        ctx.fillRect(sx, sy, sp.w, sp.h);
        ctx.strokeStyle = '#5566aa';
        ctx.strokeRect(sx, sy, sp.w, sp.h);
        ctx.globalAlpha = 1;
    }

    // Timed Switch Blocks
    for (const tsb of timedSwitchBlocks) {
        const sx = tsb.x - camera.x, sy = tsb.y - camera.y;
        ctx.globalAlpha = tsb.solid ? 1 : 0.2;
        ctx.fillStyle = tsb.solid ? '#4488aa' : '#223344';
        ctx.fillRect(sx, sy, tsb.w, tsb.h);
        if (tsb.solid) {
            ctx.fillStyle = '#66bbdd';
            ctx.fillRect(sx, sy, tsb.w * (tsb.timer / tsb.duration), 3);
        }
        ctx.globalAlpha = 1;
    }

    // Electrified Rails
    for (const er of electrifiedRails) {
        const sx = er.x - camera.x, sy = er.y - camera.y;
        ctx.fillStyle = er.electrified ? '#ffff00' : '#666666';
        ctx.fillRect(sx, sy, er.w, er.h);
        if (er.electrified) {
            ctx.strokeStyle = `rgba(255,255,0,${0.5 + 0.3 * Math.sin(er.sparkPhase)})`;
            for (let i = 0; i < 3; i++) {
                const lx = sx + Math.random() * er.w;
                ctx.beginPath(); ctx.moveTo(lx, sy - 4); ctx.lineTo(lx + 3, sy + 2); ctx.lineTo(lx - 2, sy + er.h + 4); ctx.stroke();
            }
        }
    }

    // Phantom Walls
    for (const pw of phantomWalls) {
        const sx = pw.x - camera.x, sy = pw.y - camera.y;
        ctx.fillStyle = 'rgba(100,100,120,0.6)';
        ctx.fillRect(sx, sy, pw.w, pw.h);
        // Shimmer on passable side
        const shimmerX = pw.passableDir === 'right' ? sx + pw.w - 3 : sx;
        ctx.fillStyle = `rgba(150,150,200,${0.3 + 0.2 * Math.sin(performance.now() * 0.003)})`;
        ctx.fillRect(shimmerX, sy, 3, pw.h);
    }

    // Piston Blocks
    for (const pb of pistonBlocks) {
        const sx = pb.x - camera.x, sy = pb.y - camera.y;
        ctx.fillStyle = '#776655';
        ctx.fillRect(sx, sy, pb.w, pb.h);
        ctx.strokeStyle = '#998877'; ctx.strokeRect(sx, sy, pb.w, pb.h);
    }

    // Thorn Vines
    for (const tv of thornVines) {
        if (!tv.grown) continue;
        ctx.strokeStyle = '#228822';
        ctx.lineWidth = 3;
        for (let i = 0; i < tv.segments.length - 1; i++) {
            const a = tv.segments[i], b = tv.segments[i + 1];
            const ax = a.x + TILE / 2 - camera.x + Math.sin(a.phase + tv.growPhase) * 3;
            const ay = a.y + TILE / 2 - camera.y;
            const bx = b.x + TILE / 2 - camera.x + Math.sin(b.phase + tv.growPhase) * 3;
            const by = b.y + TILE / 2 - camera.y;
            ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
            // Thorns
            ctx.fillStyle = '#cc2222';
            ctx.beginPath(); ctx.arc(ax + 6, ay, 3, 0, Math.PI * 2); ctx.fill();
        }
        ctx.lineWidth = 1;
    }
}

// ============================================
// GAMEPLAY MECHANICS (Features 1-15)
// ============================================

function updateGameplayMechanics(dt) {
    const p = player;
    const s = dt;

    // Feature 1: Grapple Hook (G key, Lv.9)
    if (grappleHook.cooldown > 0) grappleHook.cooldown -= s;
    if (getPlayerLevel() >= 9 && isKeyJustPressed('grapple') && !grappleHook.active && grappleHook.cooldown <= 0) {
        // Find nearest surface
        let nearestDist = 8 * TILE, nearestPoint = null;
        const allSurfs = [...platforms, ...walls, ...icePlatforms];
        for (const surf of allSurfs) {
            const cx = surf.x + surf.w / 2, cy = surf.y;
            const dx = cx - (p.x + p.w / 2), dy = cy - (p.y + p.h / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < nearestDist && dy < 0) { nearestDist = dist; nearestPoint = { x: cx, y: cy }; }
        }
        if (nearestPoint) {
            grappleHook.active = true;
            grappleHook.targetX = nearestPoint.x;
            grappleHook.targetY = nearestPoint.y;
            grappleHook.length = nearestDist;
            grappleHook.angle = Math.atan2(p.y - nearestPoint.y, p.x - nearestPoint.x);
            grappleHook.swingVel = p.vx * 0.02;
            playSound('grapple');
        }
    }
    if (grappleHook.active) {
        grappleHook.swingVel += Math.cos(grappleHook.angle) * 0.003 * s;
        grappleHook.angle += grappleHook.swingVel * s;
        p.x = grappleHook.targetX + Math.cos(grappleHook.angle) * grappleHook.length - p.w / 2;
        p.y = grappleHook.targetY + Math.sin(grappleHook.angle) * grappleHook.length - p.h / 2;
        p.vx = -Math.sin(grappleHook.angle) * grappleHook.swingVel * grappleHook.length;
        p.vy = Math.cos(grappleHook.angle) * grappleHook.swingVel * grappleHook.length;
        // Release on jump
        if (isKeyJustPressed('jump')) {
            grappleHook.active = false;
            grappleHook.cooldown = 60;
            p.vy = Math.min(-8, p.vy - 5);
            triggerCombo();
        }
        // Auto-release after 3s
        grappleHook.length -= 0.1 * s;
        if (grappleHook.length < TILE) { grappleHook.active = false; grappleHook.cooldown = 60; }
    }

    // Feature 2: Wall Cling Timer (Shift on wall)
    if ((p.onWallLeft || p.onWallRight) && (keys['ShiftLeft'] || keys['ShiftRight']) && wallClingCooldown <= 0) {
        if (wallClingTimer < WALL_CLING_MAX) {
            wallClingTimer += s;
            p.vy = 0; // Hold position
            p.vx = 0;
        }
    } else if (p.onGround) {
        wallClingTimer = 0; wallClingCooldown = 0;
    }
    if (wallClingTimer >= WALL_CLING_MAX) wallClingCooldown = 60;
    if (wallClingCooldown > 0) wallClingCooldown -= s;

    // Feature 3: Momentum Preservation
    if (p.wasOnGround && !p.onGround) {
        // Takeoff — no change needed
    } else if (!p.wasOnGround && p.onGround && Math.abs(p.vx) > getCheatRunSpeed() * 1.2) {
        // Landing at speed: burst
        const burst = Math.min(3, (Math.abs(p.vx) - getCheatRunSpeed()) * 0.4);
        p.vx += burst * Math.sign(p.vx);
        if (gameSettings.particles) spawnParticles(p.x + p.w / 2, p.y + p.h, 4, '#ffaa00', 3, 1);
    }

    // Feature 4: Charged Jump
    if (p.onGround && (keys['KeyW'] || keys['ArrowUp'] || keys['Space'])) {
        chargedJumpTimer += s;
        if (chargedJumpTimer >= 30 && !chargedJumpReady) {
            chargedJumpReady = true;
            spawnParticles(p.x + p.w / 2, p.y + p.h, 3, '#ffdd00', 2, 0.5);
        }
    } else {
        if (chargedJumpReady && (isKeyJustPressed('jump'))) {
            // Applied in jump logic below
        }
        chargedJumpTimer = 0;
        chargedJumpReady = false;
    }

    // Feature 5: Air Kick
    if (!p.onGround && !p.isDashing && !airKickActive &&
        (keys['ShiftLeft'] || keys['ShiftRight']) && (keys['KeyA'] || keys['KeyD'] || keys['ArrowLeft'] || keys['ArrowRight'])) {
        // Only if dash is on cooldown (so it doesn't conflict)
        if (p.dashCooldown > 0 && p.dashTimer <= 0) {
            airKickActive = true;
            airKickTimer = 12;
            p.vx = p.facing * 8;
            p.vy = 0;
            triggerCombo();
            playSound('dash');
        }
    }
    if (airKickActive) {
        airKickTimer -= s;
        if (airKickTimer <= 0) { airKickActive = false; }
    }
    if (p.onGround) airKickActive = false;

    // Feature 6: Chain Dash — destroying during dash resets cooldown
    // (Checked in crumbling wall hit and drone deflect)

    // Feature 8: Ricochet Dash
    if (p.isDashing) {
        const solids = getAllSolids();
        for (const sol of solids) {
            if (aabb({ x: p.x + p.vx, y: p.y, w: p.w, h: p.h }, sol)) {
                if (Math.abs(p.vx) >= DASH_SPEED * 0.8) {
                    p.vx = -p.vx * 0.7;
                    p.vy = -6;
                    p.facing = -p.facing;
                    ricochetCount++;
                    spawnFloatingText('RICOCHET!', p.x + p.w / 2, p.y - 20, '#ff4081', 16);
                    triggerCombo();
                    break;
                }
            }
        }
    }

    // Feature 9: Ledge Hang
    if (!p.onGround && p.vy > 0 && !ledgeHang.active && !p.isDashing) {
        const solids = getAllSolids();
        for (const sol of solids) {
            // Check if player's top aligns with platform top
            if (p.y + p.h > sol.y && p.y + p.h < sol.y + TILE * 0.5 &&
                p.x + p.w > sol.x && p.x < sol.x + sol.w) {
                // Check that above is clear
                if (p.y < sol.y) {
                    ledgeHang.active = true;
                    ledgeHang.platform = sol;
                    p.vy = 0; p.vx = 0;
                    p.y = sol.y - p.h + 2;
                    break;
                }
            }
        }
    }
    if (ledgeHang.active) {
        p.vy = 0; p.vx = 0;
        if (keys['KeyW'] || keys['ArrowUp'] || keys['Space']) {
            // Pull up
            p.y = ledgeHang.platform.y - p.h;
            p.vy = -3;
            ledgeHang.active = false;
            triggerCombo();
        } else if (keys['KeyS'] || keys['ArrowDown']) {
            // Drop
            ledgeHang.active = false;
            p.vy = 2;
        } else if (keys['KeyA'] || keys['ArrowLeft']) {
            p.x -= 1;
        } else if (keys['KeyD'] || keys['ArrowRight']) {
            p.x += 1;
        }
    }

    // Feature 10: Slide Jump
    if (p.isSliding && isKeyJustPressed('jump')) {
        slideJumpActive = true;
        p.vy = getCheatJumpForce() * 0.8;
        p.vx = p.facing * getCheatRunSpeed() * 1.6;
        p.isSliding = false;
        triggerCombo();
    }

    // Feature 12: Gravity Flip Ability (G at Lv.10)
    if (getPlayerLevel() >= 10 && isKeyJustPressed('grapple') && !grappleHook.active && gravityFlipCooldown <= 0 && !gravityFlipActive) {
        gravityFlipActive = true;
        gravityFlipTimer = 180;
        gravityFlipCooldown = 720;
        personalGravityDir *= -1;
        playSound('boost');
        spawnFloatingText('GRAVITY FLIP!', p.x + p.w / 2, p.y - 30, '#9933ff', 18);
    }
    if (gravityFlipCooldown > 0) gravityFlipCooldown -= s;

    // Feature 13: Speed Vault
    if (p.onGround && Math.abs(p.vx) >= getCheatRunSpeed() * 0.95) {
        const ahead = { x: p.x + p.facing * p.w, y: p.y, w: TILE, h: TILE };
        const above = { x: p.x + p.facing * p.w, y: p.y - TILE, w: TILE, h: TILE };
        const solids = getAllSolids();
        let obstacleBelow = false, clearAbove = true;
        for (const sol of solids) {
            if (aabb(ahead, sol) && sol.h <= TILE * 1.5) obstacleBelow = true;
            if (aabb(above, sol)) clearAbove = false;
        }
        if (obstacleBelow && clearAbove) {
            p.y -= TILE * 1.2;
            p.vy = -3;
            triggerCombo();
            spawnFloatingText('VAULT!', p.x + p.w / 2, p.y - 20, '#00e5ff', 14);
        }
    }

    // Feature 14: Bounce Chain Multiplier
    // (Applied in bounce pad collision - bounceChainCount incremented there)

    // Feature 15: Afterimage Phase (15+ combo)
    if (comboCount >= 15 && !afterimagePhaseActive && afterimagePhaseTimer <= -300) {
        afterimagePhaseActive = true;
        afterimagePhaseTimer = 60;
        spawnFloatingText('PHASE!', p.x + p.w / 2, p.y - 40, '#aa66ff', 18);
    }

    // Cape physics
    if (currentCape !== 'none') {
        capePhysics.push({ x: p.x + p.w / 2, y: p.y + 4 });
        if (capePhysics.length > 8) capePhysics.shift();
    }

    // Footprint trails (Feature 72)
    if (p.onGround && Math.abs(p.vx) > 1) {
        if (Math.random() < 0.05) {
            footprintTrail.push({ x: p.x + p.w / 2, y: p.y + p.h, life: 180, onIce: false });
        }
    }
    footprintTrail = footprintTrail.filter(f => { f.life -= s; return f.life > 0; });

    // Player blink (Feature 71)
    playerBlinkTimer += s;
    if (playerBlinkTimer > 200 + Math.random() * 100) playerBlinkTimer = -6;
}

function drawGameplayMechanics() {
    const p = player;

    // Grapple Hook line
    if (grappleHook.active) {
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x + p.w / 2 - camera.x, p.y + p.h / 2 - camera.y);
        ctx.lineTo(grappleHook.targetX - camera.x, grappleHook.targetY - camera.y);
        ctx.stroke();
        ctx.lineWidth = 1;
        // Hook point
        ctx.fillStyle = '#ffdd00';
        ctx.beginPath();
        ctx.arc(grappleHook.targetX - camera.x, grappleHook.targetY - camera.y, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    // Wall Cling Timer HUD ring
    if (wallClingTimer > 0 && (p.onWallLeft || p.onWallRight)) {
        const cx = p.x + p.w / 2 - camera.x, cy = p.y - 10 - camera.y;
        const pct = wallClingTimer / WALL_CLING_MAX;
        ctx.strokeStyle = pct > 0.7 ? '#ff4444' : '#44ff44';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 8, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
        ctx.stroke();
        ctx.lineWidth = 1;
    }

    // Charged Jump bar
    if (chargedJumpTimer > 5 && p.onGround) {
        const sx = p.x - camera.x, sy = p.y + p.h + 4 - camera.y;
        const pct = Math.min(1, chargedJumpTimer / 30);
        ctx.fillStyle = '#333';
        ctx.fillRect(sx - 2, sy, p.w + 4, 4);
        ctx.fillStyle = pct >= 1 ? '#ffdd00' : '#888';
        ctx.fillRect(sx - 2, sy, (p.w + 4) * pct, 4);
    }

    // Gravity flip indicator
    if (gravityFlipActive) {
        const cx = p.x + p.w / 2 - camera.x, cy = p.y + p.h / 2 - camera.y;
        ctx.strokeStyle = `rgba(153,51,255,${0.4 + 0.2 * Math.sin(performance.now() * 0.005)})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2); ctx.stroke();
        ctx.lineWidth = 1;
    }

    // Afterimage trail
    for (const ai of afterimageTrail) {
        ctx.globalAlpha = ai.alpha * 0.3;
        ctx.fillStyle = '#aa66ff';
        ctx.fillRect(ai.x - camera.x, ai.y - camera.y, ai.w, ai.h);
    }
    ctx.globalAlpha = 1;

    // Cape drawing (Feature 68)
    if (currentCape !== 'none' && capePhysics.length > 1) {
        const cape = CAPES.find(c => c.id === currentCape);
        if (cape && cape.color) {
            ctx.strokeStyle = cape.color;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(p.x + p.w / 2 - camera.x, p.y + 4 - camera.y);
            for (let i = capePhysics.length - 1; i >= 0; i--) {
                ctx.lineTo(capePhysics[i].x - camera.x - p.facing * 3, capePhysics[i].y - camera.y + (capePhysics.length - i) * 2);
            }
            ctx.stroke();
            ctx.lineWidth = 1;
        }
    }

    // Footprint trails (Feature 72)
    for (const fp of footprintTrail) {
        ctx.globalAlpha = fp.life / 180 * 0.3;
        ctx.fillStyle = '#555';
        ctx.fillRect(fp.x - 2 - camera.x, fp.y - 1 - camera.y, 4, 2);
    }
    ctx.globalAlpha = 1;

    // Player eyes (Feature 71)
    if (!deathAnim.active && gameState !== 'dead') {
        const sx = p.x - camera.x, sy = p.y - camera.y;
        const eyeY = sy + 6;
        const eyeOffsetX = p.facing * 2;
        const blinking = playerBlinkTimer < 0;
        if (!blinking) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(sx + p.w / 2 - 3 + eyeOffsetX, eyeY, 2, 2);
            ctx.fillRect(sx + p.w / 2 + 1 + eyeOffsetX, eyeY, 2, 2);
            ctx.fillStyle = '#000';
            ctx.fillRect(sx + p.w / 2 - 2 + eyeOffsetX + p.facing, eyeY, 1, 2);
            ctx.fillRect(sx + p.w / 2 + 2 + eyeOffsetX + p.facing, eyeY, 1, 2);
        } else {
            ctx.fillStyle = '#fff';
            ctx.fillRect(sx + p.w / 2 - 3 + eyeOffsetX, eyeY + 1, 2, 1);
            ctx.fillRect(sx + p.w / 2 + 1 + eyeOffsetX, eyeY + 1, 2, 1);
        }
    }
}

// ============================================
// GAME MODES (Features 47-55, 65)
// ============================================

function startSpeedrunMode() {
    speedrunMode = true; speedrunTimer = 0; speedrunSplits = []; speedrunLevel = 0;
    loadLevel(0); startCountdown(() => {}); gameState = 'playing';
    showScreen('game');
    spawnFloatingText('SPEEDRUN START!', player.x + player.w / 2, player.y - 40, '#ff4081', 20);
}

function startRelayMode() {
    relayMode = true; relayPlayer = 1; relayTimes = [0, 0];
    loadLevel(0); startCountdown(() => {}); gameState = 'playing';
    showScreen('game');
    spawnFloatingText('RELAY MODE - P1 GO!', player.x + player.w / 2, player.y - 40, '#00e5ff', 18);
}

function startGauntletMode() {
    gauntletMode = true; gauntletScore = 0;
    gauntletLevels = []; gauntletModifiers = [];
    for (let i = 0; i < 5; i++) {
        gauntletLevels.push(Math.floor(Math.random() * Math.min(LEVELS.length, 20)));
        gauntletModifiers.push(['normal', 'noDash', 'doubleSpeed', 'tinyPlayer'][Math.floor(Math.random() * 4)]);
    }
    loadLevel(gauntletLevels[0]); startCountdown(() => {}); gameState = 'playing';
    showScreen('game');
}

function startReverseMode(levelIdx) {
    reverseMode = true;
    loadLevel(levelIdx);
    // Swap spawn and goal
    const temp = { ...spawnPoint };
    spawnPoint = { x: goalZone.x, y: goalZone.y };
    goalZone = { x: temp.x, y: temp.y, w: TILE * 2, h: TILE * 2 };
    // Flip boost/conveyor directions
    for (const bp of boostPads) bp.dir *= -1;
    for (const cb of conveyorBelts) cb.dir *= -1;
    resetPlayer(); camera.x = player.x - canvasW / 2; camera.y = player.y - canvasH / 2;
    startCountdown(() => {}); gameState = 'playing';
    showScreen('game');
}

function startSurvivalMode(levelIdx) {
    survivalMode = true; survivalHearts = SURVIVAL_MAX_HEARTS;
    loadLevel(levelIdx); startCountdown(() => {}); gameState = 'playing';
    showScreen('game');
}

function startBossRush() {
    bossRushMode = true; bossRushTimer = 0; bossRushLevel = 0;
    const bossLevels = [20, 21, 22]; // Boss levels
    loadLevel(bossLevels[0]); startCountdown(() => {}); gameState = 'playing';
    showScreen('game');
}

function startZenMode(levelIdx) {
    zenMode = true;
    loadLevel(levelIdx);
    spikes = []; enemyDrones = []; laserBeams = []; sawblades = []; lavaFloors = [];
    wallSpikes = []; acidPools = []; flameJets = []; laserTurrets = []; thornVines = [];
    startCountdown(() => {}); gameState = 'playing';
    showScreen('game');
    spawnFloatingText('ZEN MODE', player.x + player.w / 2, player.y - 40, '#88ddff', 22);
}

function startGhostRace(levelIdx) {
    ghostRaceMode = true; ghostRaceDelta = 0;
    loadLevel(levelIdx); startCountdown(() => {}); gameState = 'playing';
    showScreen('game');
}

function startPuzzleMode(puzzleIdx) {
    puzzleMode = true; puzzleLevelIndex = puzzleIdx;
    // Reset level arrays
    platforms = []; spikes = []; movingPlatforms = []; fallingPlatforms = [];
    boostPads = []; walls = []; goalZone = null; checkpoints = [];
    pressurePlates = []; gateBlocks = []; gravityOrbs = []; pistonBlocks = [];
    shadowPlatforms = []; timedSwitchBlocks = [];
    particleCount = 0; orbs = [];
    PUZZLE_LEVELS[puzzleIdx]();
    resetPlayer(); levelTimer = 0; deathCount = 0; timerStarted = false;
    camera.x = player.x - canvasW / 2; camera.y = player.y - canvasH / 2;
    startCountdown(() => {}); gameState = 'playing';
    showScreen('game');
}

function startNGPlus() {
    ngPlusMode = true;
    loadLevel(0);
    // Double hazards: add extra spikes
    const extraSpikes = spikes.map(s => ({ ...s, x: s.x + TILE, y: s.y }));
    spikes.push(...extraSpikes);
    startCountdown(() => {}); gameState = 'playing';
    showScreen('game');
}

// ============================================
// VISUAL EFFECTS (Features 31-40)
// ============================================

function updateVisualEffects(dt) {
    const s = dt;
    // Feature 33: Rain
    if (rainActive) {
        rainIntensity = Math.min(1, rainIntensity + 0.01 * s);
        for (let i = rainDrops.length; i < 100 * rainIntensity; i++) {
            rainDrops.push({ x: camera.x + Math.random() * canvasW, y: camera.y - 10, vy: 8 + Math.random() * 4, life: 1 });
        }
        for (let i = rainDrops.length - 1; i >= 0; i--) {
            rainDrops[i].y += rainDrops[i].vy * s;
            rainDrops[i].x += 1 * s;
            if (rainDrops[i].y > camera.y + canvasH + 10) rainDrops.splice(i, 1);
        }
        lightningTimer -= s;
        if (lightningTimer <= 0 && Math.random() < 0.002) {
            lightningTimer = 30;
            triggerScreenFlash('#ffffff', 0.15, 0.2);
        }
    }

    // Feature 37: Combo Aura
    if (comboCount >= 5) {
        if (comboCount >= 20) comboAuraColor = 'rainbow';
        else if (comboCount >= 15) comboAuraColor = '#ffd700';
        else if (comboCount >= 10) comboAuraColor = '#aa44ff';
        else comboAuraColor = '#4488ff';
    } else { comboAuraColor = null; }

    // Feature 38: Death Freeze
    if (deathFreezeTimer > 0) deathFreezeTimer -= s;

    // Feature 40: Level Intro Pan
    if (levelIntroPanActive) {
        levelIntroPanTimer -= s;
        if (levelIntroPanPhase === 'toGoal') {
            if (goalZone) {
                camera.x += (goalZone.x - canvasW / 2 - camera.x) * 0.05;
                camera.y += (goalZone.y - canvasH / 2 - camera.y) * 0.05;
            }
            if (levelIntroPanTimer <= 60) { levelIntroPanPhase = 'toSpawn'; }
        } else {
            camera.x += (player.x - canvasW / 2 - camera.x) * 0.08;
            camera.y += (player.y - canvasH / 2 - camera.y) * 0.08;
            if (levelIntroPanTimer <= 0) { levelIntroPanActive = false; }
        }
    }
}

function drawVisualEffects() {
    const p = player;

    // Feature 31: Dynamic Lighting
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // Orb glow
    for (const orb of orbs) {
        if (orb.collected) continue;
        const ox = orb.x - camera.x, oy = orb.y - camera.y;
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, 40);
        grad.addColorStop(0, 'rgba(255,215,0,0.15)'); grad.addColorStop(1, 'rgba(255,215,0,0)');
        ctx.fillStyle = grad; ctx.fillRect(ox - 40, oy - 40, 80, 80);
    }
    // Goal glow
    if (goalZone) {
        const gx = goalZone.x + goalZone.w / 2 - camera.x, gy = goalZone.y + goalZone.h / 2 - camera.y;
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, 80);
        grad.addColorStop(0, 'rgba(255,64,129,0.15)'); grad.addColorStop(1, 'rgba(255,64,129,0)');
        ctx.fillStyle = grad; ctx.fillRect(gx - 80, gy - 80, 160, 160);
    }
    // Lava glow
    for (const lf of lavaFloors) {
        const lx = lf.x + lf.w / 2 - camera.x, ly = lf.y - camera.y;
        const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, lf.w);
        grad.addColorStop(0, 'rgba(255,68,0,0.1)'); grad.addColorStop(1, 'rgba(255,68,0,0)');
        ctx.fillStyle = grad; ctx.fillRect(lx - lf.w, ly - 30, lf.w * 2, 60);
    }
    ctx.restore();

    // Feature 32: Heat Distortion (subtle sine displacement near lava)
    // (Canvas limitation — using visual trick of wavy line above lava)
    for (const lf of lavaFloors) {
        const lx = lf.x - camera.x, ly = lf.y - camera.y;
        ctx.strokeStyle = 'rgba(255,100,0,0.15)';
        ctx.beginPath();
        for (let x = 0; x < lf.w; x += 3) {
            const wx = lx + x;
            const wy = ly - 8 + Math.sin((x + performance.now() * 0.005) * 0.15) * 3;
            if (x === 0) ctx.moveTo(wx, wy); else ctx.lineTo(wx, wy);
        }
        ctx.stroke();
    }

    // Feature 33: Rain rendering
    if (rainActive && rainDrops.length > 0) {
        ctx.strokeStyle = 'rgba(150,180,255,0.4)';
        ctx.lineWidth = 1;
        for (const drop of rainDrops) {
            const dx = drop.x - camera.x, dy = drop.y - camera.y;
            ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(dx + 1, dy + 6); ctx.stroke();
        }
        ctx.lineWidth = 1;
    }

    // Feature 34: Hazard Speedlines
    const absVx = Math.abs(p.vx);
    if (absVx > 7) {
        for (const sp of spikes) {
            const dx = sp.x - p.x, dy = sp.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80 && dist > 10) {
                ctx.strokeStyle = `rgba(255,68,68,${0.3 * (1 - dist / 80)})`;
                const sx = sp.x + TILE / 2 - camera.x, sy = sp.y + TILE / 2 - camera.y;
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(sx - (dx / dist) * 20, sy - (dy / dist) * 20);
                ctx.stroke();
            }
        }
    }

    // Feature 35: Chromatic Aberration near hazards
    let chromatic = 0;
    for (const sp of spikes) {
        const dx = (p.x + p.w / 2) - (sp.x + TILE / 2);
        const dy = (p.y + p.h / 2) - (sp.y + TILE / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 30) chromatic = Math.max(chromatic, (30 - dist) / 10);
    }
    if (chromatic > 0.5) {
        // Draw subtle red/blue offset rectangles around player
        const sx = p.x - camera.x, sy = p.y - camera.y;
        ctx.globalAlpha = 0.15 * chromatic;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(sx - chromatic, sy, p.w, p.h);
        ctx.fillStyle = '#0000ff';
        ctx.fillRect(sx + chromatic, sy, p.w, p.h);
        ctx.globalAlpha = 1;
    }

    // Feature 36: Parallax Foreground (dust motes)
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#aaaacc';
    for (let i = 0; i < 5; i++) {
        const fx = (performance.now() * 0.03 + i * 200) % canvasW;
        const fy = (performance.now() * 0.01 + i * 150) % canvasH;
        ctx.beginPath(); ctx.arc(fx, fy, 1.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Feature 37: Combo Aura
    if (comboAuraColor && !deathAnim.active) {
        const cx = p.x + p.w / 2 - camera.x, cy = p.y + p.h / 2 - camera.y;
        const radius = 18 + comboCount * 0.5;
        if (comboAuraColor === 'rainbow') {
            const hue = (performance.now() * 0.3) % 360;
            ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 0.4)`;
        } else {
            ctx.strokeStyle = comboAuraColor + '66';
        }
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, cy, radius + Math.sin(performance.now() * 0.008) * 3, 0, Math.PI * 2); ctx.stroke();
        ctx.lineWidth = 1;
    }

    // Feature 39: Checkpoint Burst (drawn on activation — handled in checkpoint collision)
}

// ============================================
// AUDIO FEATURES (Features 41-46)
// ============================================

function updateAudioFeatures() {
    if (!audioCtx) return;

    // Feature 41: Hazard Proximity Tone
    let minHazardDist = Infinity;
    for (const sp of spikes) {
        const dx = (player.x + player.w / 2) - (sp.x + TILE / 2);
        const dy = (player.y + player.h / 2) - (sp.y + TILE / 2);
        minHazardDist = Math.min(minHazardDist, Math.sqrt(dx * dx + dy * dy));
    }
    if (minHazardDist < 60 && !hazardProximityOsc) {
        try {
            hazardProximityOsc = audioCtx.createOscillator();
            hazardProximityGain = audioCtx.createGain();
            hazardProximityOsc.type = 'sine';
            hazardProximityOsc.connect(hazardProximityGain);
            hazardProximityGain.connect(audioDest());
            hazardProximityGain.gain.value = 0;
            hazardProximityOsc.start();
        } catch(e) {}
    }
    if (hazardProximityOsc && hazardProximityGain) {
        if (minHazardDist < 60) {
            const intensity = 1 - (minHazardDist / 60);
            hazardProximityOsc.frequency.value = 400 + intensity * 600;
            hazardProximityGain.gain.value = Math.min(0.05, intensity * 0.05) * (gameSettings.volume / 100);
        } else {
            hazardProximityGain.gain.value = 0;
        }
    }
}

function playComboMelody(comboNum) {
    // Feature 42: Combo Melody Escalation
    if (!audioCtx || !soundEnabled) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const octave = Math.floor(comboNum / 5);
        const noteInScale = comboNum % 8;
        const scale = [261, 293, 329, 349, 392, 440, 493, 523]; // C major
        osc.frequency.value = scale[noteInScale] * Math.pow(2, octave);
        osc.type = 'triangle';
        gain.gain.value = 0.08 * (gameSettings.volume / 100);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        osc.connect(gain); gain.connect(audioDest());
        osc.start(); osc.stop(audioCtx.currentTime + 0.2);
    } catch(e) {}
}

function playAchievementJingle(rarity) {
    // Feature 46: Achievement Jingle Variation
    if (!audioCtx || !soundEnabled) return;
    try {
        const noteCount = rarity === 'legendary' ? 6 : rarity === 'epic' ? 5 : rarity === 'rare' ? 4 : rarity === 'uncommon' ? 3 : 2;
        const baseFreq = 523;
        for (let i = 0; i < noteCount; i++) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.frequency.value = baseFreq * (1 + i * 0.15);
            osc.type = 'triangle';
            gain.gain.value = 0.1 * (gameSettings.volume / 100);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1 * (i + 1) + 0.3);
            osc.connect(gain); gain.connect(audioDest());
            osc.start(audioCtx.currentTime + 0.1 * i);
            osc.stop(audioCtx.currentTime + 0.1 * (i + 1) + 0.3);
        }
    } catch(e) {}
}

// ============================================
// PROGRESSION FEATURES (Features 57-65)
// ============================================

function updateSeasonPass(xpGain) {
    seasonPassXP += xpGain;
    while (seasonPassXP >= SEASON_PASS_XP_PER_TIER && seasonPassTier < SEASON_PASS_TIERS) {
        seasonPassXP -= SEASON_PASS_XP_PER_TIER;
        seasonPassTier++;
        spawnFloatingText('SEASON TIER ' + seasonPassTier + '!', player.x + player.w / 2, player.y - 60, '#ffd700', 18);
        // Rewards every 10 tiers
        if (seasonPassTier % 10 === 0) { totalOrbs += 20; }
        else if (seasonPassTier % 5 === 0) { totalOrbs += 10; }
        else { totalOrbs += 3; }
    }
}

function checkMilestoneBadges() {
    if (totalWallJumps >= 100 && !milestoneBadges.wallJumps100) { milestoneBadges.wallJumps100 = true; spawnFloatingText('BADGE: 100 Wall Jumps!', player.x + player.w / 2, player.y - 50, '#ffd700', 16); }
    if (totalDashes >= 500 && !milestoneBadges.dashes500) { milestoneBadges.dashes500 = true; spawnFloatingText('BADGE: 500 Dashes!', player.x + player.w / 2, player.y - 50, '#ffd700', 16); }
    if (totalCompletions >= 50 && !milestoneBadges.completions50) { milestoneBadges.completions50 = true; spawnFloatingText('BADGE: 50 Levels!', player.x + player.w / 2, player.y - 50, '#ffd700', 16); }
}

// Feature 76: Split Screen Timer
function drawSplitScreenTimer() {
    if (!timerStarted || !bestTimes[currentLevel]) return;
    const delta = levelTimer - bestTimes[currentLevel];
    const text = (delta > 0 ? '+' : '') + delta.toFixed(2) + 's';
    const color = delta > 0 ? '#ff4444' : '#4caf50';
    ctx.save();
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = color;
    ctx.fillText(text, canvasW / 2, 48);
    ctx.restore();
}

// Feature 78: Performance Overlay
function drawPerformanceOverlay() {
    if (!perfOverlayVisible) return;
    ctx.save();
    ctx.font = '10px monospace';
    ctx.fillStyle = '#00ff00';
    ctx.textAlign = 'left';
    const fps = fpsHistory.length > 0 ? Math.round(fpsHistory.reduce((a, b) => a + b) / fpsHistory.length) : 0;
    ctx.fillText('FPS: ' + fps, 10, canvasH - 80);
    ctx.fillText('Particles: ' + particleCount, 10, canvasH - 66);
    ctx.fillText('Platforms: ' + platforms.length, 10, canvasH - 52);
    ctx.fillText('Spikes: ' + spikes.length, 10, canvasH - 38);
    ctx.fillText('DT Scale: ' + dtScale.toFixed(2), 10, canvasH - 24);
    ctx.fillText('Player: ' + Math.round(player.x) + ',' + Math.round(player.y), 10, canvasH - 10);
    ctx.restore();
}

// Feature 79: Radial Quick Menu
function drawRadialMenu() {
    if (!radialMenuOpen) return;
    ctx.save();
    const cx = canvasW / 2, cy = canvasH / 2;
    ctx.fillStyle = 'rgba(10,10,15,0.85)';
    ctx.fillRect(0, 0, canvasW, canvasH);
    for (let i = 0; i < RADIAL_ITEMS.length; i++) {
        const angle = (i / RADIAL_ITEMS.length) * Math.PI * 2 - Math.PI / 2;
        const ix = cx + Math.cos(angle) * 100;
        const iy = cy + Math.sin(angle) * 100;
        const selected = i === radialMenuSelection;
        ctx.beginPath(); ctx.arc(ix, iy, 30, 0, Math.PI * 2);
        ctx.fillStyle = selected ? '#00e5ff33' : '#1a1a2e';
        ctx.fill();
        ctx.strokeStyle = selected ? '#00e5ff' : '#333';
        ctx.lineWidth = 2; ctx.stroke();
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = selected ? '#00e5ff' : '#888';
        ctx.fillText(RADIAL_ITEMS[i], ix, iy);
    }
    ctx.lineWidth = 1;
    ctx.restore();
}

// Feature 80: Damage Numbers
function spawnDamageNumber(text, x, y) {
    spawnFloatingText(text, x, y, '#ffaa00', 14);
}

// Feature 82: Notification Queue
function queueNotification(text, color) {
    notificationQueue.push({ text, color: color || '#fff', life: 180 });
    if (notificationQueue.length > 5) notificationQueue.shift();
}

function drawNotificationQueue() {
    let y = 70;
    for (let i = 0; i < notificationQueue.length; i++) {
        const n = notificationQueue[i];
        n.life--;
        if (n.life <= 0) { notificationQueue.splice(i, 1); i--; continue; }
        ctx.save();
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.globalAlpha = Math.min(1, n.life / 30);
        ctx.fillStyle = n.color;
        ctx.fillText(n.text, canvasW / 2, y);
        ctx.restore();
        y += 18;
    }
}

// ============================================
// UPDATED getAllSolids with new blocks
// ============================================
function getAllSolids2() {
    const solids = [];
    // Rotating platforms
    for (const rp of rotatingPlatforms) solids.push(rp);
    // Bubble platforms (if not popped)
    for (const bp of bubblePlatforms) { if (!bp.popped) solids.push({ x: bp.x, y: bp.y, w: bp.w, h: bp.h }); }
    // Gate blocks (if not open)
    for (const gate of gateBlocks) { if (gate.openProgress < 0.9) solids.push({ x: gate.x, y: gate.origY, w: gate.w, h: gate.h * (1 - gate.openProgress) }); }
    // Shadow platforms (if visible enough)
    for (const sp of shadowPlatforms) { if (sp.visibility > 0.3) solids.push(sp); }
    // Timed switch blocks (if solid)
    for (const tsb of timedSwitchBlocks) { if (tsb.solid) solids.push(tsb); }
    // Electrified rails (always solid, just deadly when on)
    for (const er of electrifiedRails) solids.push(er);
    // Piston blocks
    for (const pb of pistonBlocks) solids.push({ x: pb.x, y: pb.y, w: pb.w, h: pb.h });
    // Phantom walls (solid from non-passable side)
    for (const pw of phantomWalls) {
        const px = player.x + player.w / 2;
        if (pw.passableDir === 'right' && px < pw.x + pw.w / 2) solids.push(pw);
        else if (pw.passableDir === 'left' && px > pw.x + pw.w / 2) solids.push(pw);
    }
    return solids;
}

// --- Update functions for new blocks ---
function updateNewBlocks2(dt) {
    const p = player;
    const s = dt;

    // Magnetic platforms: pull player toward surface when nearby
    for (const mp of magnetPlatforms) {
        const pcx = p.x + p.w / 2;
        const pcy = p.y + p.h / 2;
        const mcx = mp.x + mp.w / 2;
        const mcy = mp.y;
        const dx = mcx - pcx;
        const dy = mcy - (p.y + p.h);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mp.range && dist > 0 && dy < 0) {
            // Pull toward platform surface
            p.vy += (dy / dist) * mp.pullForce * s;
            if (Math.abs(dx) > p.w) p.vx += (dx / dist) * mp.pullForce * 0.5 * s;
        }
    }

    // Trampolines: super high bounce
    for (const tr of trampolines) {
        tr.animTimer = Math.max(0, tr.animTimer - s);
        if (aabb({ x: p.x, y: p.y + p.h - 4, w: p.w, h: 8 }, tr) && p.vy > 0) {
            p.vy = tr.force;
            tr.animTimer = 12;
            tr.compressed = true;
            playSound('bounce');
            spawnParticles(p.x + p.w / 2, tr.y, 8, '#ff66ff', 4, 1.5);
            setTimeout(() => { tr.compressed = false; }, 200);
        }
    }

    // Disappearing platforms: phase in/out on timer
    for (const dp of disappearingPlatforms) {
        dp.timer += s;
        const cycle = dp.onTime + dp.offTime;
        const phase = dp.timer % cycle;
        dp.visible = phase < dp.onTime;
    }

    // Sawblades: rotate and kill on contact
    for (const sb of sawblades) {
        sb.angle += sb.speed * s;
        if (sb.orbitRadius > 0) {
            sb.x = sb.cx + Math.cos(sb.angle) * sb.orbitRadius;
            sb.y = sb.cy + Math.sin(sb.angle) * sb.orbitRadius;
        }
        // Collision with player
        const scx = sb.x + sb.radius;
        const scy = sb.y + sb.radius;
        const pcx = p.x + p.w / 2;
        const pcy = p.y + p.h / 2;
        const dx = scx - pcx;
        const dy = scy - pcy;
        if (Math.sqrt(dx * dx + dy * dy) < sb.radius + Math.min(p.w, p.h) / 2) {
            killPlayer();
            return;
        }
    }

    // Spring walls: bounce player horizontally on contact
    for (const sw of springWalls) {
        sw.animTimer = Math.max(0, sw.animTimer - s);
        if (aabb({ x: p.x, y: p.y, w: p.w, h: p.h }, sw)) {
            p.vx = sw.bounceForce * sw.dir;
            p.vy = Math.min(p.vy, -4);
            sw.animTimer = 10;
            playSound('bounce');
            spawnParticles(sw.x + (sw.dir > 0 ? sw.w : 0), p.y + p.h / 2, 6, '#44ff44', 3, 1);
        }
    }

    // Lava floors: kill on contact, animate
    for (const lf of lavaFloors) {
        lf.wavePhase += 0.05 * s;
        if (lf.riseSpeed) {
            lf.y -= lf.riseSpeed * s;
        }
        if (aabb({ x: p.x, y: p.y, w: p.w, h: p.h }, { x: lf.x, y: lf.y + 4, w: lf.w, h: lf.h - 4 })) {
            killPlayer();
            return;
        }
    }

    // Portal beams: teleport player horizontally
    for (const pb of portalBeams) {
        pb.glowPhase += 0.08 * s;
        pb.cooldown = Math.max(0, pb.cooldown - s);
        if (pb.cooldown <= 0 && aabb({ x: p.x, y: p.y + p.h - 8, w: p.w, h: 12 }, pb)) {
            p.x = pb.destX;
            p.y = pb.destY;
            pb.cooldown = 60;
            playSound('checkpoint');
            spawnParticles(pb.destX + pb.w / 2, pb.destY, 10, '#ff00ff', 4, 1.5);
        }
    }

    // Speed pads: boost running speed temporarily
    for (const sp of speedPads) {
        sp.animOffset += 0.1 * s;
        if (aabb({ x: p.x, y: p.y + p.h - 4, w: p.w, h: 8 }, sp)) {
            p.vx = sp.boost * p.facing;
            playSound('boost');
        }
    }
}

// --- Draw functions for new blocks ---
function drawNewBlocks2() {
    // Magnetic platforms
    for (const mp of magnetPlatforms) {
        const sx = mp.x - camera.x;
        const sy = mp.y - camera.y;
        if (sx + mp.w < 0 || sx > canvasW) continue;
        // Magnetic field glow
        ctx.globalAlpha = 0.1 + Math.sin(Date.now() * 0.004) * 0.05;
        ctx.fillStyle = '#8844ff';
        ctx.fillRect(sx - 8, sy - mp.range, mp.w + 16, mp.range + 4);
        ctx.globalAlpha = 1;
        // Platform
        ctx.fillStyle = '#6633cc';
        ctx.fillRect(sx, sy, mp.w, mp.h);
        ctx.fillStyle = '#9966ff';
        ctx.fillRect(sx, sy, mp.w, 3);
        // Magnetic symbol
        ctx.fillStyle = '#ccaaff';
        ctx.font = '10px monospace';
        ctx.fillText('M', sx + mp.w / 2 - 3, sy + mp.h - 4);
    }

    // Trampolines
    for (const tr of trampolines) {
        const sx = tr.x - camera.x;
        const sy = tr.y - camera.y;
        if (sx + tr.w < 0 || sx > canvasW) continue;
        const squash = tr.compressed ? 4 : 0;
        ctx.fillStyle = '#ff44ff';
        ctx.fillRect(sx, sy + squash, tr.w, tr.h - squash);
        ctx.fillStyle = '#ff88ff';
        ctx.fillRect(sx + 2, sy + squash, tr.w - 4, 3);
        // Spring coils
        ctx.strokeStyle = '#ffaaff';
        ctx.lineWidth = 2;
        for (let x = sx + 6; x < sx + tr.w - 4; x += 10) {
            ctx.beginPath();
            ctx.moveTo(x, sy + tr.h);
            ctx.lineTo(x + 4, sy + squash + 2);
            ctx.stroke();
        }
    }

    // Disappearing platforms
    for (const dp of disappearingPlatforms) {
        if (!dp.visible) continue;
        const sx = dp.x - camera.x;
        const sy = dp.y - camera.y;
        if (sx + dp.w < 0 || sx > canvasW) continue;
        const cycle = dp.onTime + dp.offTime;
        const phase = dp.timer % cycle;
        const fadeOut = phase > dp.onTime * 0.7;
        ctx.globalAlpha = fadeOut ? 0.3 + 0.7 * (1 - (phase - dp.onTime * 0.7) / (dp.onTime * 0.3)) : 0.8;
        ctx.fillStyle = '#44aacc';
        ctx.fillRect(sx, sy, dp.w, dp.h);
        ctx.fillStyle = '#66ccee';
        ctx.fillRect(sx, sy, dp.w, 3);
        ctx.globalAlpha = 1;
    }

    // Sawblades
    for (const sb of sawblades) {
        const sx = sb.x - camera.x;
        const sy = sb.y - camera.y;
        if (sx + sb.radius * 2 < 0 || sx > canvasW) continue;
        const cx = sx + sb.radius;
        const cy = sy + sb.radius;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(sb.angle);
        // Blade circle
        ctx.fillStyle = '#aaaaaa';
        ctx.beginPath();
        ctx.arc(0, 0, sb.radius, 0, Math.PI * 2);
        ctx.fill();
        // Teeth
        ctx.fillStyle = '#cccccc';
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * sb.radius * 0.6, Math.sin(a) * sb.radius * 0.6);
            ctx.lineTo(Math.cos(a + 0.15) * sb.radius * 1.1, Math.sin(a + 0.15) * sb.radius * 1.1);
            ctx.lineTo(Math.cos(a - 0.15) * sb.radius * 1.1, Math.sin(a - 0.15) * sb.radius * 1.1);
            ctx.fill();
        }
        // Center
        ctx.fillStyle = '#666';
        ctx.beginPath();
        ctx.arc(0, 0, sb.radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Spring walls
    for (const sw of springWalls) {
        const sx = sw.x - camera.x;
        const sy = sw.y - camera.y;
        if (sx + sw.w < 0 || sx > canvasW) continue;
        const stretch = sw.animTimer > 0 ? 4 * sw.dir : 0;
        ctx.fillStyle = '#22cc44';
        ctx.fillRect(sx + (sw.dir > 0 ? 0 : -stretch), sy, sw.w + Math.abs(stretch), sw.h);
        // Spring coils horizontal
        ctx.strokeStyle = '#44ff66';
        ctx.lineWidth = 2;
        const springX = sx + (sw.dir > 0 ? sw.w : 0) + stretch;
        for (let y = sy + 6; y < sy + sw.h - 4; y += 8) {
            ctx.beginPath();
            ctx.moveTo(springX, y);
            ctx.lineTo(springX + 6 * sw.dir, y + 4);
            ctx.stroke();
        }
    }

    // Lava floors
    for (const lf of lavaFloors) {
        const sx = lf.x - camera.x;
        const sy = lf.y - camera.y;
        if (sx + lf.w < 0 || sx > canvasW || sy > canvasH) continue;
        // Lava body
        ctx.fillStyle = '#ff4400';
        ctx.fillRect(sx, sy + 4, lf.w, lf.h);
        // Surface wave
        ctx.fillStyle = '#ff6622';
        for (let x = 0; x < lf.w; x += 4) {
            const waveY = Math.sin((x + lf.wavePhase * 10) * 0.08) * 3;
            ctx.fillRect(sx + x, sy + waveY, 4, 6);
        }
        // Bubbles
        ctx.fillStyle = '#ffaa44';
        for (let i = 0; i < 3; i++) {
            const bx = sx + (lf.w * (i + 0.5) / 3) + Math.sin(Date.now() * 0.002 + i * 2) * 8;
            const by = sy + 6 + Math.sin(Date.now() * 0.003 + i) * 3;
            ctx.beginPath();
            ctx.arc(bx, by, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Portal beams
    for (const pb of portalBeams) {
        const sx = pb.x - camera.x;
        const sy = pb.y - camera.y;
        if (sx + pb.w < 0 || sx > canvasW) continue;
        const glow = 0.5 + Math.sin(pb.glowPhase) * 0.3;
        ctx.globalAlpha = glow;
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(sx, sy, pb.w, pb.h);
        ctx.fillStyle = '#ff88ff';
        ctx.fillRect(sx, sy + 1, pb.w, 2);
        ctx.globalAlpha = 1;
        // Destination marker
        const dx = pb.destX - camera.x;
        const dy = pb.destY - camera.y;
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(dx - 4, dy - 4, 8, 8);
        ctx.globalAlpha = 1;
    }

    // Speed pads
    for (const sp of speedPads) {
        const sx = sp.x - camera.x;
        const sy = sp.y - camera.y;
        if (sx + sp.w < 0 || sx > canvasW) continue;
        ctx.fillStyle = '#00ff88';
        ctx.fillRect(sx, sy, sp.w, sp.h);
        // Animated arrows
        ctx.fillStyle = '#88ffcc';
        const offset = (sp.animOffset * 20) % 12;
        for (let x = offset; x < sp.w; x += 12) {
            ctx.beginPath();
            ctx.moveTo(sx + x, sy + sp.h / 2);
            ctx.lineTo(sx + x + 5, sy);
            ctx.lineTo(sx + x + 10, sy + sp.h / 2);
            ctx.fill();
        }
    }
}

// ---------- FEATURE: SLOW-MOTION / BULLET-TIME (Feature 1) ----------
let totalSlowMoUses = 0;

function activateSlowMotion() {
    if (slowMotionCooldown > 0 || slowMotionActive) return;
    if (getPlayerLevel() < 6) return; // requires XP level 6
    slowMotionActive = true;
    slowMotionTimer = SLOWMO_DURATION;
    playSound('slowmo');
    totalSlowMoUses++;
    try { localStorage.setItem('parkour_slowmo_uses', totalSlowMoUses); } catch(e) {}
    spawnFloatingText('SLOW-MO!', player.x + player.w / 2, player.y - 40, '#4488ff', 20);
}

function updateSlowMotion(dt) {
    if (slowMotionActive) {
        slowMotionTimer -= 1; // real-time frames, not scaled
        if (slowMotionTimer <= 0) {
            slowMotionActive = false;
            slowMotionCooldown = SLOWMO_COOLDOWN;
        }
    }
    if (slowMotionCooldown > 0) {
        slowMotionCooldown -= 1;
    }
}

// ---------- FEATURE: ENEMY DRONES (Feature 2) ----------
let droneAlertTriggered = false;

function updateEnemyDrones(dt) {
    const px = player.x + player.w / 2;
    const py = player.y + player.h / 2;
    for (const d of enemyDrones) {
        // Patrol movement
        d.x += d.speed * d.dir * dt;
        if (d.x <= d.patrolX1 || d.x >= d.patrolX2) d.dir *= -1;
        d.glowPhase += 0.05 * dt;
        // Chase player within range
        const dx = px - d.x;
        const dy = py - d.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < d.chaseRange * 2) {
            d.x += (dx / dist) * d.speed * 0.8 * dt;
            d.y += (dy / dist) * d.speed * 0.5 * dt;
            if (d.alertTimer <= 0) {
                d.alertTimer = 60;
                playSound('drone_detect');
                droneAlertTriggered = true;
            }
        }
        d.alertTimer = Math.max(0, d.alertTimer - dt);
        // Kill on contact
        if (dist < 18 && gameState === 'playing') {
            killPlayer();
            return;
        }
    }
}

function drawEnemyDrones() {
    for (const d of enemyDrones) {
        const sx = d.x - camera.x;
        const sy = d.y - camera.y;
        if (sx < -30 || sx > canvasW + 30 || sy < -30 || sy > canvasH + 30) continue;
        // Pulsing red glow
        const pulse = 0.3 + Math.sin(d.glowPhase) * 0.2;
        ctx.globalAlpha = pulse;
        ctx.fillStyle = '#ff0000';
        ctx.beginPath(); ctx.arc(sx, sy, 18, 0, Math.PI * 2); ctx.fill();
        // Body
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ff2222';
        ctx.beginPath(); ctx.arc(sx, sy, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ff6666';
        ctx.beginPath(); ctx.arc(sx - 2, sy - 2, 3, 0, Math.PI * 2); ctx.fill();
        // Alert indicator
        if (d.alertTimer > 0) {
            ctx.font = 'bold 14px monospace';
            ctx.fillStyle = '#ff0000';
            ctx.textAlign = 'center';
            ctx.fillText('!', sx, sy - 16);
        }
    }
    ctx.globalAlpha = 1;
}

// ---------- FEATURE: WALL SPIKE TRAPS (Feature 3) ----------
function updateWallSpikes(dt) {
    for (const ws of wallSpikes) {
        ws.timer += dt;
        const cycle = ws.onTime + ws.offTime;
        const phase = ws.timer % cycle;
        ws.extended = phase < ws.onTime;
        // Kill player when extended
        if (ws.extended && gameState === 'playing') {
            const spikeBox = ws.dir === 1 ?
                { x: ws.x, y: ws.y, w: ws.w + 8, h: ws.h } :
                { x: ws.x - 8, y: ws.y, w: ws.w + 8, h: ws.h };
            if (aabb({ x: player.x, y: player.y, w: player.w, h: player.h }, spikeBox)) {
                killPlayer();
            }
        }
    }
}

function drawWallSpikes() {
    for (const ws of wallSpikes) {
        const sx = ws.x - camera.x;
        const sy = ws.y - camera.y;
        if (sx < -40 || sx > canvasW + 40 || sy + ws.h < 0 || sy > canvasH) continue;
        const ext = ws.extended ? 1 : 0.2;
        ctx.fillStyle = '#aa3333';
        if (ws.dir === 1) {
            ctx.fillRect(sx, sy, ws.w * ext + 8 * ext, ws.h);
            // Spike tips
            for (let i = 0; i < ws.h; i += 8) {
                ctx.fillStyle = '#ff4444';
                ctx.beginPath();
                ctx.moveTo(sx + ws.w * ext + 8 * ext, sy + i);
                ctx.lineTo(sx + ws.w * ext + 8 * ext + 6 * ext, sy + i + 4);
                ctx.lineTo(sx + ws.w * ext + 8 * ext, sy + i + 8);
                ctx.fill();
            }
        } else {
            ctx.fillRect(sx - 8 * ext, sy, ws.w * ext + 8 * ext, ws.h);
            for (let i = 0; i < ws.h; i += 8) {
                ctx.fillStyle = '#ff4444';
                ctx.beginPath();
                ctx.moveTo(sx - 8 * ext, sy + i);
                ctx.lineTo(sx - 8 * ext - 6 * ext, sy + i + 4);
                ctx.lineTo(sx - 8 * ext, sy + i + 8);
                ctx.fill();
            }
        }
        // Colorblind symbol
        if (gameSettings.colorblind && ws.extended) {
            ctx.font = 'bold 10px monospace';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText('!', sx + ws.w / 2, sy + ws.h / 2 + 4);
        }
    }
}

// ---------- FEATURE: WATER/LIQUID POOLS (Feature 10) ----------
let playerInWater = false;

function updateWaterPools(dt) {
    playerInWater = false;
    const pBox = { x: player.x, y: player.y, w: player.w, h: player.h };
    for (const wp of waterPools) {
        wp.wavePhase += 0.03 * dt;
        if (aabb(pBox, wp)) {
            playerInWater = true;
        }
    }
}

function drawWaterPools() {
    for (const wp of waterPools) {
        const sx = wp.x - camera.x;
        const sy = wp.y - camera.y;
        if (sx + wp.w < 0 || sx > canvasW || sy + wp.h < 0 || sy > canvasH) continue;
        // Water body
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = '#2266cc';
        ctx.fillRect(sx, sy, wp.w, wp.h);
        // Animated sin-wave surface
        ctx.globalAlpha = 0.6;
        ctx.strokeStyle = '#44aaff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x <= wp.w; x += 4) {
            const waveY = Math.sin(wp.wavePhase + x * 0.08) * 3;
            if (x === 0) ctx.moveTo(sx + x, sy + waveY);
            else ctx.lineTo(sx + x, sy + waveY);
        }
        ctx.stroke();
        // Bubbles
        ctx.fillStyle = '#88ccff';
        for (let i = 0; i < 3; i++) {
            const bx = sx + (wp.w * (i + 1)) / 4;
            const by = sy + wp.h * 0.5 + Math.sin(wp.wavePhase * 2 + i) * wp.h * 0.3;
            ctx.beginPath(); ctx.arc(bx, by, 2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
}

// ---------- FEATURE: CHECKPOINT CHALLENGE ORBS (Feature 5) ----------
function spawnCheckpointChallengeOrbs(cp) {
    const baseX = cp.x + cp.w / 2;
    const baseY = cp.y - TILE * 2;
    for (let i = 0; i < 3; i++) {
        checkpointChallengeOrbs.push({
            x: baseX + (i - 1) * TILE * 1.5,
            y: baseY,
            r: 6,
            collected: false,
            checkpointX: cp.x,
            bobPhase: Math.random() * Math.PI * 2
        });
    }
}

function drawCheckpointChallengeOrbs() {
    for (const o of checkpointChallengeOrbs) {
        if (o.collected) continue;
        const sx = o.x - camera.x;
        const sy = o.y - camera.y + Math.sin(Date.now() * 0.005 + o.bobPhase) * 3;
        // Gold glow
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#ffd700';
        ctx.beginPath(); ctx.arc(sx, sy, 10, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath(); ctx.arc(sx, sy, o.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(sx - 1, sy - 1, 2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function checkChallengeOrbCollision() {
    let allCollected = true;
    let anyHere = false;
    for (const o of checkpointChallengeOrbs) {
        if (o.collected) continue;
        anyHere = true;
        const dx = (player.x + player.w / 2) - o.x;
        const dy = (player.y + player.h / 2) - o.y;
        if (Math.sqrt(dx * dx + dy * dy) < o.r + 12) {
            o.collected = true;
            playSound('orb');
            spawnParticles(o.x, o.y, 6, '#ffd700', 3, 1);
        } else {
            allCollected = false;
        }
    }
    if (anyHere && allCollected && checkpointChallengeOrbs.length > 0) {
        perfectSections++;
        spawnFloatingText('PERFECT SECTION! +50 XP +20 orbs', player.x + player.w / 2, player.y - 60, '#ffd700', 18);
        addXP(50);
        totalOrbs += 20;
        try { localStorage.setItem('parkour_total_orbs', totalOrbs); } catch(e) {}
    }
}

// ---------- FEATURE: SCREEN-EDGE DEATH PULSE (Feature 8) ----------
function updateDeathPulse() {
    let minDist = Infinity;
    const px = player.x + player.w / 2;
    const py = player.y + player.h / 2;
    for (const sp of spikes) {
        const dx = Math.abs(px - (sp.x + sp.w / 2));
        const dy = Math.abs(py - (sp.y + sp.h / 2));
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < minDist) minDist = d;
    }
    for (const lb of laserBeams) {
        if (lb.active) {
            const dx = Math.abs(px - (lb.x + lb.w / 2));
            const dy = Math.abs(py - (lb.y + lb.h / 2));
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < minDist) minDist = d;
        }
    }
    for (const d of enemyDrones) {
        const dd = Math.sqrt((px - d.x) ** 2 + (py - d.y) ** 2);
        if (dd < minDist) minDist = dd;
    }
    deathPulseIntensity = minDist < 60 ? (1 - minDist / 60) : 0;
}

function drawDeathPulse() {
    if (deathPulseIntensity <= 0 || gameState !== 'playing') return;
    const freq = 2 + deathPulseIntensity * 6;
    const pulse = (Math.sin(Date.now() * 0.001 * freq) * 0.5 + 0.5) * deathPulseIntensity;
    const grad = ctx.createRadialGradient(canvasW / 2, canvasH / 2, canvasW * 0.3, canvasW / 2, canvasH / 2, canvasW * 0.7);
    grad.addColorStop(0, 'rgba(255, 0, 0, 0)');
    grad.addColorStop(1, 'rgba(255, 0, 0, ' + (pulse * 0.25) + ')');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasW, canvasH);
}

// ---------- FEATURE: LEVEL TRANSITION FANFARE (Feature 9) ----------
function startCompleteAnim() {
    completeAnimState = { timer: 60, zoomStart: cameraZoom }; // 1s at 60fps
    playSound('victory_fanfare');
}

function updateCompleteAnim(dt) {
    if (!completeAnimState) return false;
    completeAnimState.timer -= dt;
    if (completeAnimState.timer <= 0) {
        completeAnimState = null;
        return true; // done
    }
    // Zoom toward goal
    const progress = 1 - completeAnimState.timer / 60;
    cameraZoom = completeAnimState.zoomStart + progress * 0.15;
    // Spawn confetti
    if (Math.random() < 0.3 * dt) {
        spawnParticles(
            player.x + (Math.random() - 0.5) * 100,
            player.y - 40 + Math.random() * 20,
            2, ['#ffd700', '#ff4081', '#00e5ff'][Math.floor(Math.random() * 3)], 4, 1
        );
    }
    return false;
}

// ---------- FEATURE: PHOTO MODE (Feature 11) ----------
function enterPhotoMode() {
    if (gameState !== 'playing' && gameState !== 'paused') return;
    gameState = 'photo';
    photoCamera = { x: camera.x, y: camera.y, zoom: cameraZoom, rotation: 0 };
    photoControlsShown = true;
    stopMusic(true);
}

function exitPhotoMode() {
    gameState = 'playing';
    photoControlsShown = false;
    camera.x = photoCamera.x;
    camera.y = photoCamera.y;
    startMusic();
}

function updatePhotoMode() {
    const speed = 5;
    if (keys['ArrowLeft'] || keys['KeyA']) photoCamera.x -= speed;
    if (keys['ArrowRight'] || keys['KeyD']) photoCamera.x += speed;
    if (keys['ArrowUp'] || keys['KeyW']) photoCamera.y -= speed;
    if (keys['ArrowDown'] || keys['KeyS']) photoCamera.y += speed;
    if (keys['Equal'] || keys['NumpadAdd']) photoCamera.zoom = Math.min(3, photoCamera.zoom + 0.02);
    if (keys['Minus'] || keys['NumpadSubtract']) photoCamera.zoom = Math.max(0.3, photoCamera.zoom - 0.02);
    if (keys['BracketLeft']) photoCamera.rotation -= 0.02;
    if (keys['BracketRight']) photoCamera.rotation += 0.02;
}

function drawPhotoModeUI() {
    if (!photoControlsShown) return;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(10, 10, 220, 130);
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#00e5ff';
    ctx.textAlign = 'left';
    ctx.fillText('PHOTO MODE', 20, 30);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ccc';
    ctx.fillText('Arrows/WASD: Pan', 20, 48);
    ctx.fillText('+/-: Zoom', 20, 62);
    ctx.fillText('[/]: Rotate', 20, 76);
    ctx.fillText('F3: Save Screenshot', 20, 90);
    ctx.fillText('F2/ESC: Exit', 20, 104);
    ctx.fillText('Zoom: ' + photoCamera.zoom.toFixed(2) + 'x', 20, 124);
    ctx.restore();
}

function saveScreenshot() {
    const link = document.createElement('a');
    link.download = 'parkour_rush_' + Date.now() + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    spawnFloatingText('SCREENSHOT SAVED!', canvasW / 2, 60, '#00e5ff', 18);
}

// ---------- FEATURE: RUN SHARE CODES (Feature 12) ----------
function encodeRunShareCode(levelIndex) {
    if (!ghostRecording || ghostRecording.length === 0) return null;
    // Delta-compress: store first frame absolute, then deltas
    const frames = ghostRecording;
    const deltas = [{ x: Math.round(frames[0].x), y: Math.round(frames[0].y) }];
    for (let i = 1; i < frames.length; i++) {
        deltas.push({
            dx: Math.round(frames[i].x - frames[i - 1].x),
            dy: Math.round(frames[i].y - frames[i - 1].y)
        });
    }
    const json = JSON.stringify(deltas);
    const code = 'PR:L' + levelIndex + ':V1:' + btoa(json);
    return code;
}

function decodeRunShareCode(code) {
    try {
        const parts = code.split(':');
        if (parts[0] !== 'PR') return null;
        const levelIndex = parseInt(parts[1].replace('L', ''));
        const data = JSON.parse(atob(parts[3]));
        // Reconstruct frames
        const frames = [{ x: data[0].x, y: data[0].y }];
        for (let i = 1; i < data.length; i++) {
            frames.push({
                x: frames[i - 1].x + (data[i].dx || 0),
                y: frames[i - 1].y + (data[i].dy || 0)
            });
        }
        return { level: levelIndex, replay: frames };
    } catch (e) {
        return null;
    }
}

function copyShareCode() {
    const code = encodeRunShareCode(currentLevel);
    if (!code) { spawnFloatingText('No run to share!', canvasW / 2, 60, '#ff4444', 16); return; }
    navigator.clipboard.writeText(code).then(() => {
        spawnFloatingText('SHARE CODE COPIED!', player.x + player.w / 2, player.y - 50, '#00e5ff', 18);
        unlockAchievement('share_the_rush');
    }).catch(() => {
        spawnFloatingText('Copy failed', canvasW / 2, 60, '#ff4444', 16);
    });
}

// ---------- FEATURE: LOCAL LEADERBOARD (Feature 13) ----------
function addLeaderboardEntry(levelIndex, time) {
    if (!localLeaderboard[levelIndex]) localLeaderboard[levelIndex] = [];
    localLeaderboard[levelIndex].push({ time, difficulty, date: new Date().toISOString().split('T')[0] });
    localLeaderboard[levelIndex].sort((a, b) => a.time - b.time);
    if (localLeaderboard[levelIndex].length > 5) localLeaderboard[levelIndex] = localLeaderboard[levelIndex].slice(0, 5);
    try { localStorage.setItem('parkour_leaderboard', JSON.stringify(localLeaderboard)); } catch(e) {}
}

// ---------- FEATURE: PRESTIGE COSMETICS (Feature 16) ----------
function getPrestigeEffects() {
    return {
        goldenOutline: prestigeCount >= 1,
        rainbowTrail: prestigeCount >= 2,
        halo: prestigeCount >= 3,
        voidSkin: prestigeCount >= 5
    };
}

function drawPrestigeEffects() {
    const effects = getPrestigeEffects();
    const sx = player.x - camera.x + player.w / 2;
    const sy = player.y - camera.y;
    if (effects.goldenOutline) {
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6 + Math.sin(Date.now() * 0.003) * 0.2;
        ctx.strokeRect(player.x - camera.x - 2, sy - 2, player.w + 4, player.h + 4);
        ctx.globalAlpha = 1;
    }
    if (effects.halo) {
        ctx.globalAlpha = 0.4 + Math.sin(Date.now() * 0.004) * 0.2;
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(sx, sy - 6, 10, 4, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
}

// ---------- FEATURE: XP LEVEL-UP CINEMATICS (Feature 17) ----------
function startLevelUpAnim(newLevel) {
    levelUpAnimState = { timer: LEVELUP_ANIM_DURATION, level: newLevel, ability: null };
    // Check if new ability unlocked
    const abilities = { 3: 'Double Jump', 5: 'Ground Pound', 6: 'Slow-Motion', 7: 'Speed Burst', 8: 'Wall Run', 9: 'Air Stall' };
    if (abilities[newLevel]) levelUpAnimState.ability = abilities[newLevel];
}

function updateLevelUpAnim(dt) {
    if (!levelUpAnimState) return;
    levelUpAnimState.timer -= dt;
    if (levelUpAnimState.timer <= 0) levelUpAnimState = null;
}

function drawLevelUpAnim() {
    if (!levelUpAnimState) return;
    const progress = 1 - levelUpAnimState.timer / LEVELUP_ANIM_DURATION;
    // Fullscreen flash
    if (progress < 0.1) {
        ctx.globalAlpha = (1 - progress / 0.1) * 0.5;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasW, canvasH);
    }
    // Scale-in text
    const scale = progress < 0.2 ? progress / 0.2 * 1.2 : progress < 0.3 ? 1.2 - (progress - 0.2) / 0.1 * 0.2 : 1;
    ctx.save();
    ctx.translate(canvasW / 2, canvasH / 2 - 20);
    ctx.scale(scale, scale);
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#00ff88';
    ctx.globalAlpha = Math.min(1, progress * 5) * (levelUpAnimState.timer > 20 ? 1 : levelUpAnimState.timer / 20);
    ctx.fillText('LEVEL ' + levelUpAnimState.level, 0, 0);
    if (levelUpAnimState.ability) {
        ctx.font = 'bold 20px monospace';
        ctx.fillStyle = '#ffd700';
        ctx.fillText('NEW: ' + levelUpAnimState.ability.toUpperCase(), 0, 40);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    // Confetti
    if (Math.random() < 0.2) {
        spawnParticles(Math.random() * canvasW + camera.x, Math.random() * canvasH * 0.5 + camera.y, 1, ['#ffd700', '#ff4081', '#00e5ff', '#00ff88'][Math.floor(Math.random() * 4)], 4, 1);
    }
}

// ---------- FEATURE: ENHANCED DAILY LOGIN POPUP (Feature 15) ----------
function showDailyLoginPopup(streak, reward) {
    dailyLoginPopupShown = true;
    const overlay = document.createElement('div');
    overlay.id = 'daily-login-popup';
    overlay.className = 'overlay';
    overlay.style.zIndex = '250';
    overlay.innerHTML =
        '<h2 style="color:#ffd700">DAILY LOGIN</h2>' +
        '<p style="font-size:2rem">Day ' + streak + '</p>' +
        '<p style="color:#ffd700;font-size:1.2rem">+' + reward + ' Orbs</p>' +
        (streak >= 7 ? '<p style="color:#ff4081">GOLD STAR BADGE!</p>' : '') +
        (streak >= 3 ? '<p style="color:#00e5ff">STREAK BONUS!</p>' : '') +
        '<button class="menu-btn primary" id="btn-claim-daily" style="margin-top:16px">CLAIM</button>';
    document.body.appendChild(overlay);
    document.getElementById('btn-claim-daily').addEventListener('click', () => {
        playSound('orb');
        overlay.remove();
        if (streak >= 3) unlockAchievement('daily_7'); // Day 3 achievement
        if (streak >= 7) unlockAchievement('daily_7');
    });
}

// ---------- FEATURE: PRACTICE REWIND (Feature 25) ----------
function practiceRewind() {
    if (!practiceMode || deathReplayBuffer.length < 2) return;
    // Go back ~1 second (60 frames)
    const rewindFrames = Math.min(60, deathReplayBuffer.length - 1);
    const targetFrame = deathReplayBuffer[deathReplayBuffer.length - 1 - rewindFrames];
    if (targetFrame) {
        player.x = targetFrame.x;
        player.y = targetFrame.y;
        player.vx = 0;
        player.vy = 0;
        player.onGround = false;
        // Trim buffer
        deathReplayBuffer = deathReplayBuffer.slice(0, deathReplayBuffer.length - rewindFrames);
        spawnFloatingText('REWIND!', player.x + player.w / 2, player.y - 30, '#ff8800', 16);
        playSound('click');
    }
}

// ---------- FEATURE: PB CHECKPOINT SPLITS (Feature 26) ----------
// (Enhanced in existing recordSplit function)

// ---------- FEATURE: ONE-HAND MODE (Feature 27) ----------
function updateOneHandMode() {
    if (!oneHandMode) return;
    // Auto-run right
    keys['KeyD'] = true;
    keys['ArrowRight'] = true;
}

// ---------- FEATURE: COLORBLIND HAZARD SYMBOLS (Feature 28) ----------
function drawColorblindSymbols() {
    if (!gameSettings.colorblind) return;
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Spikes: !
    for (const sp of spikes) {
        const sx = sp.x + sp.w / 2 - camera.x;
        const sy = sp.y + sp.h / 2 - camera.y;
        if (sx > -20 && sx < canvasW + 20 && sy > -20 && sy < canvasH + 20) {
            ctx.fillText('!', sx, sy);
        }
    }
    // Lasers: X
    for (const lb of laserBeams) {
        if (lb.active) {
            const sx = lb.x + lb.w / 2 - camera.x;
            const sy = lb.y + lb.h / 2 - camera.y;
            if (sx > -20 && sx < canvasW + 20 && sy > -20 && sy < canvasH + 20) {
                ctx.fillText('X', sx, sy);
            }
        }
    }
    // Wind: ~
    for (const wz of windZones) {
        const sx = wz.x + wz.w / 2 - camera.x;
        const sy = wz.y + wz.h / 2 - camera.y;
        if (sx > -20 && sx < canvasW + 20 && sy > -20 && sy < canvasH + 20) {
            ctx.fillText('~', sx, sy);
        }
    }
    // Drones: *
    for (const d of enemyDrones) {
        const sx = d.x - camera.x;
        const sy = d.y - camera.y;
        if (sx > -20 && sx < canvasW + 20 && sy > -20 && sy < canvasH + 20) {
            ctx.fillText('*', sx, sy);
        }
    }
}

// ---------- FEATURE: PLAYER EMOTES (Feature 30) ----------
function startEmote(type) {
    if (gameState !== 'playing' || !player.onGround || Math.abs(player.vx) > 0.5) return;
    if (emoteActive) return;
    emoteActive = true;
    emoteType = type;
    emoteFrame = 0;
    playSound('emote');
}

function updateEmote(dt) {
    if (!emoteActive) return;
    emoteFrame += dt;
    if (emoteFrame >= EMOTE_DURATION) {
        emoteActive = false;
        emoteType = null;
        emoteFrame = 0;
    }
}

function drawEmote() {
    if (!emoteActive || !emoteType) return;
    const sx = player.x - camera.x + player.w / 2;
    const sy = player.y - camera.y - 20;
    const progress = emoteFrame / EMOTE_DURATION;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.globalAlpha = progress < 0.8 ? 1 : (1 - progress) / 0.2;
    if (emoteType === 'wave') {
        const angle = Math.sin(progress * Math.PI * 4) * 0.3;
        ctx.rotate(angle);
        ctx.fillStyle = '#ffd700';
        ctx.fillText('o/', 0, 0);
    } else if (emoteType === 'flex') {
        const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.2;
        ctx.scale(scale, scale);
        ctx.fillStyle = '#ff4081';
        ctx.fillText('FLEX', 0, 0);
    } else if (emoteType === 'spin') {
        ctx.rotate(progress * Math.PI * 4);
        ctx.fillStyle = '#00e5ff';
        ctx.fillText('*', 0, 0);
    } else if (emoteType === 'sit') {
        ctx.fillStyle = '#88ff88';
        ctx.fillText('~', 0, 0);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
}

// ---------- FEATURE: EDITOR LEVEL SHARING (Feature 23) ----------
function exportEditorLevel() {
    const data = { v: 1, spawn: editorSpawn, goal: editorGoal, objects: editorObjects };
    const json = JSON.stringify(data);
    navigator.clipboard.writeText(json).then(() => {
        spawnFloatingText('LEVEL COPIED TO CLIPBOARD!', canvasW / 2, 60, '#00e5ff', 16);
    }).catch(() => {
        // Fallback: show in prompt
        prompt('Copy this level code:', json);
    });
}

function importEditorLevel(code) {
    try {
        const data = JSON.parse(code);
        if (data.spawn && data.goal && data.objects) {
            editorSpawn = data.spawn;
            editorGoal = data.goal;
            editorObjects = data.objects;
            playSound('checkpoint');
            return true;
        }
    } catch (e) {}
    return false;
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
        // Feature 3: Wall spike traps in level 6+
        wallSpikes = [
            wallSpike(40, 15, 3, 1, 30, 90),
            wallSpike(80, 15, 3, -1, 30, 90),
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
        // Feature 3: Wall spike traps
        wallSpikes = [
            wallSpike(12, 12, 2, 1, 30, 90),
            wallSpike(15, 12, 2, -1, 30, 90),
            wallSpike(40, 12, 2, 1, 25, 80),
            wallSpike(43, 12, 2, -1, 25, 80),
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
        // Feature 2: Enemy drones in level 8+
        enemyDrones = [
            enemyDrone(35, 12, 30, 42, 12),
            enemyDrone(87, 14, 82, 94, 14),
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
        // Feature 2: Enemy drones
        enemyDrones = [
            enemyDrone(25, 12, 20, 35, 12),
            enemyDrone(75, 10, 68, 82, 10),
        ];
        // Feature 3: Wall spikes
        wallSpikes = [
            wallSpike(10, 14, 3, 1, 25, 80),
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
        // Feature 2: Enemy drones
        enemyDrones = [
            enemyDrone(40, 10, 35, 50, 10),
            enemyDrone(80, 8, 74, 88, 8),
            enemyDrone(115, 12, 108, 122, 12),
        ];
        // Feature 3: Wall spikes
        wallSpikes = [
            wallSpike(49, 12, 3, 1, 20, 70),
            wallSpike(52, 12, 3, -1, 20, 70),
            wallSpike(86, 12, 3, 1, 20, 70),
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
        // New block types
        speedPads = [
            speedPad(2, 17, 2, 10),
            speedPad(42, 13, 2, 10),
        ];
        sawblades = [
            sawblade(55, 12, 1, 55, 12, 0.04),
            sawblade(90, 12, 1, 90, 12, 0.04),
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
        // New block types: trampolines + spring walls
        trampolines = [
            trampoline(20, 18, 2),
            trampoline(44, 18, 2),
        ];
        springWalls = [
            springWall(27, 10, 4, 1),
            springWall(41, 10, 4, -1),
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
        // New block types: disappearing platforms + magnetic
        disappearingPlatforms = [
            disappearPlat(38, 16, 4, 1, 80, 50),
            disappearPlat(70, 16, 4, 1, 80, 50),
        ];
        magnetPlatforms = [
            magnetPlat(100, 12, 5, 1, 5),
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
        enemyDrones = [
            enemyDrone(45, 10, 38, 55, 10),
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

    // ----- LEVEL 16: Frost Cavern (ice platforms + bounce pads) -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(160, 17);
        platforms = [
            plat(0, 18, 10, 2),
            plat(50, 18, 6, 2),
            plat(90, 18, 8, 2),
            plat(130, 18, 6, 2),
            plat(145, 18, 20, 2),
        ];
        icePlatforms = [
            icePlat(14, 17, 8, 1),
            icePlat(28, 15, 6, 1),
            icePlat(40, 16, 6, 1),
            icePlat(60, 14, 5, 1),
            icePlat(72, 15, 6, 1),
            icePlat(100, 13, 5, 1),
            icePlat(112, 14, 6, 1),
            icePlat(124, 15, 4, 1),
        ];
        bouncePads = [
            bouncePad(18, 17, 2, 1, -14),
            bouncePad(46, 17, 2, 1, -13),
            bouncePad(78, 17, 2, 1, -15),
            bouncePad(108, 17, 2, 1, -14),
            bouncePad(138, 17, 2, 1, -12),
        ];
        spikes = [
            spike(22, 19, 6, 1),
            spike(56, 19, 12, 1),
            spike(84, 19, 4, 1),
            spike(118, 19, 10, 1),
        ];
        walls = [];
        movingPlatforms = [];
        fallingPlatforms = [];
        boostPads = [];
        checkpoints = [checkpoint(50, 16), checkpoint(90, 16)];
        enemyDrones = [
            enemyDrone(60, 10, 54, 70, 10),
            enemyDrone(110, 8, 105, 120, 8),
        ];
    },

    // ----- LEVEL 17: Laser Grid (lasers + toggle block puzzles) -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(150, 17);
        platforms = [
            plat(0, 18, 10, 2),
            plat(20, 18, 8, 2),
            plat(40, 18, 8, 2),
            plat(60, 18, 6, 2),
            plat(80, 18, 8, 2),
            plat(100, 18, 6, 2),
            plat(120, 18, 6, 2),
            plat(135, 18, 20, 2),
        ];
        laserBeams = [
            laser(15, 10, 1, 8, 60, 40),
            laser(35, 12, 1, 6, 50, 50),
            laser(55, 10, 1, 8, 45, 55),
            laser(75, 11, 1, 7, 55, 45),
            laser(95, 10, 1, 8, 40, 60),
            laser(115, 12, 1, 6, 50, 50),
        ];
        toggleBlocksA = [
            toggleBlock(30, 15, 4, 1, 'A'),
            toggleBlock(70, 14, 3, 1, 'A'),
            toggleBlock(110, 15, 4, 1, 'A'),
        ];
        toggleBlocksB = [
            toggleBlock(50, 15, 4, 1, 'B'),
            toggleBlock(90, 14, 3, 1, 'B'),
            toggleBlock(130, 15, 3, 1, 'B'),
        ];
        toggleSwitches = [
            toggleSwitch(25, 17, 2, 1),
            toggleSwitch(65, 17, 2, 1),
            toggleSwitch(105, 17, 2, 1),
        ];
        spikes = [
            spike(12, 19, 6, 1),
            spike(48, 19, 10, 1),
            spike(92, 19, 6, 1),
        ];
        walls = [wall(18, 10, 8), wall(58, 10, 8), wall(98, 10, 8)];
        movingPlatforms = [];
        fallingPlatforms = [];
        boostPads = [];
        checkpoints = [checkpoint(40, 16), checkpoint(80, 16), checkpoint(120, 16)];
    },

    // ----- LEVEL 18: Wind Tunnel (wind zones + conveyors) -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(170, 17);
        platforms = [
            plat(0, 18, 10, 2),
            plat(30, 18, 6, 2),
            plat(55, 18, 8, 2),
            plat(85, 18, 6, 2),
            plat(110, 18, 8, 2),
            plat(140, 18, 6, 2),
            plat(155, 18, 20, 2),
        ];
        conveyorBelts = [
            conveyor(12, 17, 8, 1, 1, 2),
            conveyor(38, 17, 6, 1, 1, 3),
            conveyor(65, 17, 8, 1, -1, 2),
            conveyor(95, 17, 6, 1, 1, 2.5),
            conveyor(120, 17, 8, 1, -1, 3),
            conveyor(148, 17, 5, 1, 1, 2),
        ];
        windZones = [
            windZoneObj(20, 5, 8, 13, 3, 0),
            windZoneObj(48, 5, 5, 13, -2, -1),
            windZoneObj(75, 5, 8, 13, 4, 0),
            windZoneObj(105, 5, 4, 13, -3, 0),
            windZoneObj(130, 5, 8, 13, 2, -1),
        ];
        spikes = [
            spike(18, 19, 10, 1),
            spike(50, 19, 4, 1),
            spike(78, 19, 6, 1),
            spike(100, 19, 8, 1),
            spike(135, 19, 4, 1),
        ];
        walls = [];
        movingPlatforms = [moving(42, 14, 4, 1, 0, 1, 0.6, 3)];
        fallingPlatforms = [falling(70, 16, 4, 1)];
        boostPads = [];
        checkpoints = [checkpoint(55, 16), checkpoint(110, 16)];
        enemyDrones = [
            enemyDrone(30, 10, 25, 40, 10),
            enemyDrone(80, 8, 72, 88, 8),
            enemyDrone(125, 10, 118, 135, 10),
        ];
    },

    // ----- LEVEL 19: Gravity Shift (gravity flip zones, ceiling running) -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(160, 17);
        platforms = [
            plat(0, 18, 10, 2),
            plat(0, 0, 200, 1), // ceiling to walk on
            plat(25, 18, 6, 2),
            plat(50, 18, 8, 2),
            plat(80, 18, 6, 2),
            plat(100, 18, 8, 2),
            plat(130, 18, 6, 2),
            plat(145, 18, 20, 2),
        ];
        gravityZones = [
            gravZone(14, 2, 8, 16, -1),
            gravZone(35, 2, 10, 16, -1),
            gravZone(62, 2, 12, 16, -1),
            gravZone(90, 2, 8, 16, -1),
            gravZone(112, 2, 14, 16, 0.3),
            gravZone(138, 2, 5, 16, -1),
        ];
        spikes = [
            spike(20, 19, 4, 1),
            spike(44, 19, 4, 1),
            spike(74, 19, 4, 1),
            spike(96, 1, 3, 1),
            spike(108, 19, 4, 1),
            spike(126, 1, 3, 1),
        ];
        walls = [wall(48, 5, 13), wall(76, 5, 13)];
        movingPlatforms = [];
        fallingPlatforms = [falling(30, 16, 3, 1), falling(88, 16, 3, 1)];
        boostPads = [];
        checkpoints = [checkpoint(50, 16), checkpoint(100, 16)];
    },

    // ----- LEVEL 20: The Gauntlet II (all new + old obstacles combined) -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(190, 17);
        platforms = [
            plat(0, 18, 8, 2),
            plat(20, 18, 6, 2),
            plat(45, 18, 6, 2),
            plat(70, 18, 8, 2),
            plat(100, 18, 6, 2),
            plat(125, 18, 6, 2),
            plat(150, 18, 8, 2),
            plat(175, 18, 20, 2),
        ];
        icePlatforms = [
            icePlat(30, 15, 5, 1),
            icePlat(110, 14, 4, 1),
            icePlat(160, 15, 5, 1),
        ];
        conveyorBelts = [
            conveyor(22, 17, 5, 1, 1, 3),
            conveyor(130, 17, 4, 1, -1, 2),
        ];
        bouncePads = [
            bouncePad(12, 17, 2, 1, -14),
            bouncePad(55, 17, 2, 1, -15),
            bouncePad(140, 17, 2, 1, -13),
        ];
        laserBeams = [
            laser(38, 10, 1, 8, 50, 50),
            laser(88, 12, 1, 6, 45, 45),
            laser(145, 10, 1, 8, 55, 45),
        ];
        gravityZones = [
            gravZone(60, 2, 8, 16, -1),
            gravZone(115, 2, 8, 16, 0.3),
        ];
        windZones = [
            windZoneObj(80, 5, 8, 13, 3, 0),
            windZoneObj(135, 5, 6, 13, -2, 0),
        ];
        toggleBlocksA = [toggleBlock(52, 14, 3, 1, 'A'), toggleBlock(120, 14, 3, 1, 'A')];
        toggleBlocksB = [toggleBlock(75, 14, 3, 1, 'B'), toggleBlock(155, 14, 3, 1, 'B')];
        toggleSwitches = [toggleSwitch(48, 17, 2, 1), toggleSwitch(105, 17, 2, 1)];
        spikes = [
            spike(10, 19, 180, 1),
            spike(35, 17, 4, 1),
            spike(65, 19, 4, 1),
            spike(95, 19, 4, 1),
            spike(138, 17, 3, 1),
        ];
        walls = [wall(15, 10, 8), wall(58, 10, 8), wall(98, 10, 8), wall(148, 10, 8)];
        movingPlatforms = [
            moving(40, 14, 4, 1, 0, 1, 0.7, 3),
            moving(82, 13, 5, 1, 1, 0, 0.8, 4),
            moving(165, 14, 4, 1, 0, 1, 0.6, 3),
        ];
        fallingPlatforms = [falling(92, 16, 3, 1), falling(128, 15, 3, 1)];
        boostPads = [boost(25, 17, 2, 1), boost(105, 17, 2, 1), boost(170, 17, 2, 1)];
        checkpoints = [checkpoint(45, 16), checkpoint(100, 16), checkpoint(150, 16)];
        enemyDrones = [
            enemyDrone(35, 8, 28, 45, 8),
            enemyDrone(70, 6, 62, 80, 6),
            enemyDrone(120, 8, 112, 130, 8),
            enemyDrone(160, 6, 152, 170, 6),
        ];
    },

    // ----- LEVEL 21: BOSS - Spike Wall Chase -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(180, 17);
        bossMode = true;
        bossState = { type: 'spike_wall', x: -2 * TILE, y: 0, w: 3 * TILE, h: WORLD_H * TILE, hp: 1, phase: 0, timer: 0 };
        platforms = [
            plat(0, 18, 10, 2), plat(15, 18, 6, 2), plat(25, 16, 5, 1),
            plat(35, 18, 6, 2), plat(45, 14, 4, 1), plat(55, 18, 8, 2),
            plat(68, 16, 5, 1), plat(78, 18, 6, 2), plat(90, 14, 5, 1),
            plat(100, 18, 8, 2), plat(115, 16, 5, 1), plat(125, 18, 6, 2),
            plat(138, 14, 4, 1), plat(148, 18, 8, 2), plat(163, 16, 5, 1),
            plat(173, 18, 12, 2),
        ];
        spikes = [spike(12, 19, 170, 1)];
        walls = [wall(22, 10, 8), wall(62, 10, 8), wall(112, 10, 8), wall(158, 10, 8)];
        boostPads = [boost(40, 17, 2, 1), boost(85, 17, 2, 1), boost(130, 17, 2, 1)];
        checkpoints = [checkpoint(55, 16), checkpoint(100, 16), checkpoint(150, 16)];
        movingPlatforms = [];
        fallingPlatforms = [];
    },

    // ----- LEVEL 22: BOSS - Rising Lava -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(50, 2);
        bossMode = true;
        bossState = { type: 'rising_lava', x: 0, y: WORLD_H * TILE, w: WORLD_W * TILE, hp: 1, phase: 0, timer: 0 };
        platforms = [
            plat(0, 18, 10, 2), plat(5, 14, 4, 1), plat(15, 16, 4, 1),
            plat(12, 12, 5, 1), plat(22, 14, 4, 1), plat(20, 10, 5, 1),
            plat(30, 12, 4, 1), plat(28, 8, 5, 1), plat(35, 6, 4, 1),
            plat(40, 10, 4, 1), plat(38, 4, 6, 1), plat(45, 2, 10, 2),
        ];
        walls = [wall(10, 6, 12), wall(13, 6, 12), wall(25, 4, 14), wall(28, 4, 14), wall(37, 2, 8), wall(40, 2, 8)];
        spikes = [spike(15, 11, 3, 1), spike(30, 7, 3, 1)];
        bouncePads = [bouncePad(8, 17, 2)];
        checkpoints = [checkpoint(20, 9), checkpoint(35, 5)];
        movingPlatforms = [];
        fallingPlatforms = [falling(18, 13, 3, 1), falling(32, 9, 3, 1)];
        boostPads = [];
    },

    // ----- LEVEL 23: BOSS - Laser Drone Arena -----
    function() {
        spawnPoint = { x: 2 * TILE, y: 16 * TILE };
        goalZone = goal(120, 17);
        bossMode = true;
        bossState = { type: 'laser_drone', x: 60 * TILE, y: 4 * TILE, w: 16, h: 16, hp: 1, phase: 0, timer: 0 };
        platforms = [
            plat(0, 18, 12, 2), plat(20, 18, 6, 2), plat(30, 14, 4, 1),
            plat(38, 18, 8, 2), plat(52, 16, 5, 1), plat(62, 18, 8, 2),
            plat(76, 14, 4, 1), plat(85, 18, 8, 2), plat(100, 16, 5, 1),
            plat(110, 18, 15, 2),
        ];
        spikes = [spike(14, 19, 100, 1), spike(48, 17, 3, 1), spike(72, 17, 3, 1)];
        walls = [wall(17, 10, 8), wall(58, 10, 8), wall(95, 10, 8)];
        bouncePads = [bouncePad(25, 17, 2), bouncePad(70, 17, 2)];
        enemyDrones = [enemyDrone(45, 8, 40, 55, 8), enemyDrone(80, 6, 75, 90, 6)];
        checkpoints = [checkpoint(38, 16), checkpoint(85, 16)];
        movingPlatforms = [moving(48, 12, 4, 1, 0, 1, 0.6, 3)];
        fallingPlatforms = [];
        boostPads = [];
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
    // Reset new block arrays
    icePlatforms = [];
    conveyorBelts = [];
    bouncePads = [];
    toggleBlocksA = [];
    toggleBlocksB = [];
    toggleSwitches = [];
    toggleState = false;
    laserBeams = [];
    gravityZones = [];
    teleporterPads = [];
    crumblingWalls = [];
    ziplines = [];
    windZones = [];
    // Reset new feature arrays
    enemyDrones = [];
    wallSpikes = [];
    waterPools = [];
    magnetPlatforms = [];
    trampolines = [];
    disappearingPlatforms = [];
    sawblades = [];
    springWalls = [];
    lavaFloors = [];
    portalBeams = [];
    speedPads = [];
    checkpointChallengeOrbs = [];
    perfectSections = 0;
    droneAlertTriggered = false;
    currentSplitIndex = 0;
    slowMotionActive = false;
    slowMotionTimer = 0;
    slowMotionCooldown = 0;
    emoteActive = false;
    emoteType = null;
    emoteFrame = 0;
    completeAnimState = null;
    levelUpAnimState = null;
    playerInWater = false;
    deathPulseIntensity = 0;
    // Reset new 100-feature arrays
    pressurePlates = []; gateBlocks = []; acidPools = []; rotatingPlatforms = [];
    laserTurrets = []; bubblePlatforms = []; flameJets = []; gravityOrbs = [];
    shockwaveEmitters = []; shadowPlatforms = []; timedSwitchBlocks = [];
    electrifiedRails = []; phantomWalls = []; pistonBlocks = []; thornVines = [];
    // Reset gameplay mechanics state
    grappleHook = { active: false, targetX: 0, targetY: 0, length: 0, angle: 0, swingVel: 0, cooldown: 0 };
    wallClingTimer = 0; wallClingCooldown = 0; chargedJumpTimer = 0; chargedJumpReady = false;
    airKickActive = false; airKickTimer = 0; ledgeHang = { active: false, platform: null, side: 'left' };
    slideJumpActive = false; gravityFlipActive = false; gravityFlipTimer = 0;
    personalGravityDir = 1; bounceChainCount = 0;
    afterimagePhaseActive = false; afterimagePhaseTimer = -600; afterimageTrail = [];
    resilienceUsed = false; invulnTimer = 0;
    capePhysics = []; footprintTrail = []; playerBlinkTimer = 0;
    rainDrops = []; lightningTimer = 0; comboAuraColor = null; deathFreezeTimer = 0;
    levelIntroPanActive = false;
    platformsTouched = 0; ceilingWalkTime = 0; ricochetCount = 0;
    backwardsTime = 0; forwardsTime = 0; airborneTime = 0; groundedTime = 0;
    orbMultiplierTimer = 0; orbMultiplierValue = 1;
    notificationQueue = [];
    // Mode-specific resets
    if (survivalMode) survivalHearts = SURVIVAL_MAX_HEARTS;
    if (zenMode) { rainActive = true; } else { rainActive = currentLevel >= 15; }
    // Reset abilities
    doubleJumpUsed = false;
    groundPoundActive = false;
    airStallFuel = AIR_STALL_MAX;
    speedBurstActive = false;
    speedBurstTimer = 0;
    wallRunTimer = 0;
    wallRunActive = false;
    bossState = null;

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

    // Apply mirror mode
    if (mirrorMode) applyMirrorMode();

    // Challenge mode modifiers
    if (challengeMode && challengeModifiers.tinyPlayer) {
        player.w = 12;
        player.h = 20;
    }

    // Reset shockwaves and trail
    shockwaves = [];
    trailParticles = [];

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

    // Load ghost — use computer-generated optimal run as default,
    // only use player's saved ghost if they beat the computer time
    const computerRun = generateComputerRun(index);
    ghostPlayback = computerRun.replay || [];
    try {
        const saved = localStorage.getItem('parkour_ghost_' + index);
        if (saved) {
            const playerGhost = JSON.parse(saved);
            // Player's ghost is faster if it has fewer frames (recorded every 3rd frame)
            if (playerGhost.length > 0 && playerGhost.length < ghostPlayback.length) {
                ghostPlayback = playerGhost;
            }
        }
    } catch (e) {}

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
    const solids = [...platforms, ...walls, ...icePlatforms, ...conveyorBelts];
    for (const mp of movingPlatforms) {
        solids.push(mp);
    }
    for (const fp of fallingPlatforms) {
        if (!fp.fallen) solids.push(fp);
    }
    // Toggle blocks: A solid when !toggleState, B solid when toggleState
    for (const tb of toggleBlocksA) {
        if (!toggleState) solids.push(tb);
    }
    for (const tb of toggleBlocksB) {
        if (toggleState) solids.push(tb);
    }
    // Crumbling walls that aren't broken
    for (const cw of crumblingWalls) {
        if (!cw.broken) solids.push(cw);
    }
    // Magnetic platforms are solid
    for (const mp of magnetPlatforms) solids.push(mp);
    // Disappearing platforms only when visible
    for (const dp of disappearingPlatforms) {
        if (dp.visible) solids.push(dp);
    }
    // Spring walls are solid
    for (const sw of springWalls) solids.push(sw);
    // New blocks from 100-feature update
    const extra = getAllSolids2();
    for (const s of extra) solids.push(s);
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

    // --- Ice platform friction ---
    let onIce = false;
    if (p.onGround) {
        const footBox = { x: p.x, y: p.y + p.h, w: p.w, h: 2 };
        for (const ip of icePlatforms) {
            if (aabb(footBox, ip)) { onIce = true; break; }
        }
    }

    if (!p.isDashing && !p.isSliding && !p.isBoosted && p.climbTimer <= 0) {
        if (onIce) {
            // Slippery: blend toward target velocity instead of instant
            const target = inputX * getCheatRunSpeed();
            p.vx += (target - p.vx) * 0.05;
            if (inputX !== 0) p.facing = inputX;
        } else {
            p.vx = inputX * getCheatRunSpeed();
            if (inputX !== 0) p.facing = inputX;
        }
    }
    p.isBoosted = false;

    // --- Speed Burst (10x combo → 2x speed for 3 seconds) ---
    if (speedBurstActive) {
        speedBurstTimer -= s;
        if (speedBurstTimer <= 0) {
            speedBurstActive = false;
        } else {
            p.vx *= 1.5;
            if (Math.random() < 0.3) spawnParticles(p.x + p.w / 2, p.y + p.h, 1, '#ffd700', 3, 0.5);
        }
    }
    if (!speedBurstActive && comboCount >= 10 && getPlayerLevel() >= 7) {
        speedBurstActive = true;
        speedBurstTimer = 180; // 3 seconds at 60fps
        spawnFloatingText('SPEED BURST!', p.x + p.w / 2, p.y - 50, '#ffd700', 20);
        playSound('boost');
    }

    // Track distance for run animation
    playerDistTraveled += Math.abs(p.vx) * s;

    // Footstep sounds (Feature 6, 20: surface-specific)
    if (p.onGround && Math.abs(p.vx) > 1) {
        footstepDist += Math.abs(p.vx) * s;
        if (footstepDist >= 12) {
            footstepDist = 0;
            // Detect surface type for sound variation
            const footBox = { x: p.x, y: p.y + p.h, w: p.w, h: 2 };
            let surfaceSound = 'footstep';
            for (const ip of icePlatforms) { if (aabb(footBox, ip)) { surfaceSound = 'footstep_ice'; break; } }
            for (const cb of conveyorBelts) { if (aabb(footBox, cb)) { surfaceSound = 'footstep_conveyor'; break; } }
            playSound(surfaceSound);
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

    // ---- Gravity (difficulty + cheat scaled + gravity flip) ----
    const diff = getDiff();
    let cGravity = getCheatGravity() * personalGravityDir;
    if (hasSkill('air1')) cGravity *= 0.9; // Skill tree: Feather Fall
    const cMaxFall = getCheatMaxFall();
    const cJumpForce = getCheatJumpForce();
    let cCoyoteTime = getCheatCoyoteTime();
    if (hasSkill('def1')) cCoyoteTime += 30; // Skill tree: Iron Skin
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
        } else if (jumpPressed && !doubleJumpUsed && getPlayerLevel() >= 5) {
            // ---- Double Jump (unlocked at XP level 5) ----
            p.vy = cJumpForce * 0.85;
            doubleJumpUsed = true;
            p.jumpBuffer = 0;
            jumpSquashTimer = 4;
            playSound('jump');
            spawnParticles(p.x + p.w / 2, p.y + p.h, 10, '#cc66ff', 3, 1.2);
            triggerCombo();
        }
    }

    // Reset double jump on ground
    if (p.onGround) doubleJumpUsed = false;

    // ---- Ground Pound (down + dash while airborne, level 3) ----
    const downHeld = keys['KeyS'] || keys['ArrowDown'] || keys['touchSlide'];
    if (downHeld && !p.onGround && !p.isDashing && !groundPoundActive && getPlayerLevel() >= 3 &&
        (keys['ShiftLeft'] || keys['ShiftRight'] || keys['touchDash']) &&
        !(prevKeys['ShiftLeft'] || prevKeys['ShiftRight'] || prevKeys['touchDash'])) {
        groundPoundActive = true;
        p.vx = 0;
        p.vy = cMaxFall * 1.5;
        playSound('dash');
        spawnParticles(p.x + p.w / 2, p.y, 8, '#ff6600', 4, 1);
    }
    if (groundPoundActive && p.onGround) {
        groundPoundActive = false;
        if (gameSettings.shake) screenShake = Math.max(screenShake, 10);
        spawnParticles(p.x + p.w / 2, p.y + p.h, 15, '#ff6600', 5, 2);
        // Break falling platforms under player
        for (const fp of fallingPlatforms) {
            if (!fp.fallen && aabb({ x: p.x - 4, y: p.y + p.h, w: p.w + 8, h: 4 }, fp)) {
                fp.triggered = true;
                fp.fallTimer = 0;
                fp.fallen = true;
            }
        }
    }

    // ---- Air Stall / Hover (hold jump while falling, level 4) ----
    if (!p.onGround && p.vy > 0 && !p.isDashing && !groundPoundActive && getPlayerLevel() >= 4 &&
        (keys['KeyW'] || keys['Space'] || keys['ArrowUp'] || keys['touchJump']) && airStallFuel > 0) {
        p.vy *= 0.5;
        airStallFuel -= s;
        if (Math.random() < 0.3) spawnParticles(p.x + p.w / 2, p.y + p.h, 1, '#aaddff', 2, 0.3);
    }
    if (p.onGround) airStallFuel = AIR_STALL_MAX;

    // ---- Wall Run (high speed + wall touch, level 8) ----
    if (!p.onGround && (p.onWallLeft || p.onWallRight) && Math.abs(p.vx) > RUN_SPEED * 1.3 &&
        getPlayerLevel() >= 8 && !wallRunActive && wallRunTimer <= 0) {
        wallRunActive = true;
        wallRunTimer = 20;
    }
    if (wallRunActive) {
        wallRunTimer -= s;
        p.vy = -4; // run upward along wall
        if (Math.random() < 0.4) {
            const wx = p.onWallLeft ? p.x : p.x + p.w;
            spawnParticles(wx, p.y + p.h, 1, '#ffaa00', 2, 0.5);
        }
        if (wallRunTimer <= 0 || p.onGround || (!p.onWallLeft && !p.onWallRight)) {
            wallRunActive = false;
        }
    }
    if (p.onGround) wallRunTimer = 0;

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

    // Safety: if player is already overlapping a solid (e.g. from height change),
    // resolve vertically first to prevent horizontal collision from teleporting
    // the player to the platform edge
    const preBox = { x: p.x, y: p.y, w: p.w, h: p.h };
    for (const sol of solids) {
        if (aabb(preBox, sol)) {
            // Push player up out of the solid
            p.y = sol.y - p.h;
            preBox.y = p.y;
        }
    }

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
                // Landing effects (Feature 6: per-surface landing sounds)
                if (!p.wasOnGround) {
                    let landSound = 'land_stone';
                    const landBox = { x: p.x, y: p.y + p.h, w: p.w, h: 2 };
                    for (const ip of icePlatforms) { if (aabb(landBox, ip)) { landSound = 'land_ice'; break; } }
                    for (const cb of conveyorBelts) { if (aabb(landBox, cb)) { landSound = 'land_conveyor'; break; } }
                    for (const bp of bouncePads) { if (aabb(landBox, bp)) { landSound = 'land_bounce'; break; } }
                    playSound(landSound);
                    if (p.vy > 3) {
                        const impactForce = Math.min(p.vy / MAX_FALL, 1);
                        const particleCount = 6 + Math.floor(impactForce * 8);
                        spawnParticles(p.x + p.w / 2, p.y + p.h, particleCount, '#fff', 3 + impactForce * 2, 0.8 + impactForce * 0.5);
                        landTimer = 4 + Math.floor(impactForce * 3);
                        if (impactForce > 0.5) spawnShockwave(p.x + p.w / 2, p.y + p.h);
                        if (impactForce > 0.7 && gameSettings.shake) screenShake = Math.max(screenShake, 3 + impactForce * 4);
                    }
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
        // Combo sound escalation
        playComboSound(comboCount);
        // Feature 42: Combo melody escalation
        playComboMelody(comboCount);
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

// ---------- NEW BLOCK UPDATE FUNCTIONS ----------
function updateNewBlocks(dt) {
    const p = player;
    const pBox = { x: p.x, y: p.y, w: p.w, h: p.h };

    // --- Ice: handled in player physics (friction override) ---

    // --- Conveyor Belts: push player while standing ---
    for (const cb of conveyorBelts) {
        cb.animOffset = (cb.animOffset + cb.speed * cb.dir * 0.05 * dt) % TILE;
        const standBox = { x: p.x, y: p.y + p.h, w: p.w, h: 2 };
        if (p.onGround && aabb(standBox, cb)) {
            p.x += cb.speed * cb.dir * dt;
        }
    }

    // --- Bounce Pads: launch player upward ---
    let hitBounce = false;
    for (const bp of bouncePads) {
        if (bp.animTimer > 0) bp.animTimer -= dt;
        if (p.vy > 0 && aabb(pBox, bp)) {
            const landSpeed = Math.abs(p.vy);
            p.vy = bp.force - landSpeed * 0.3;
            p.onGround = false;
            bp.animTimer = 10;
            playSound('boost');
            spawnParticles(bp.x + bp.w / 2, bp.y, 10, '#00ff88', 4, 1.5);
            if (gameSettings.shake) screenShake = Math.max(screenShake, 5);
            triggerCombo();
            hitBounce = true;
            if (!p._bounceChain) p._bounceChain = 0;
            p._bounceChain++;
            if (p._bounceChain >= 5) unlockAchievement('pogo_5');
        }
    }
    if (p.onGround && !hitBounce) p._bounceChain = 0;

    // --- Toggle Switches ---
    for (const ts of toggleSwitches) {
        if (!ts.hit && aabb(pBox, ts)) {
            ts.hit = true;
            toggleState = !toggleState;
            playSound('checkpoint');
            spawnParticles(ts.x + ts.w / 2, ts.y + ts.h / 2, 8, '#ff00ff', 3, 1);
            setTimeout(() => { ts.hit = false; }, 500);
        }
    }

    // --- Laser Beams: timed on/off ---
    for (const lb of laserBeams) {
        lb.timer += dt;
        const period = lb.onTime + lb.offTime;
        const phase = lb.timer % period;
        lb.active = phase < lb.onTime;
        if (lb.active && aabb({ x: p.x + 2, y: p.y + 2, w: p.w - 4, h: p.h - 4 }, lb)) {
            killPlayer();
            return;
        }
    }

    // --- Gravity Zones ---
    for (const gz of gravityZones) {
        if (aabb(pBox, gz)) {
            if (gz.gravMod < 0) {
                // Reverse gravity
                p.vy -= getCheatGravity() * dt * 2; // counteract normal + apply reverse
            } else {
                // Low gravity - already applied normal, reduce it
                p.vy -= getCheatGravity() * dt * (1 - gz.gravMod);
            }
        }
    }

    // --- Teleporter Pads ---
    for (const tp of teleporterPads) {
        if (tp.cooldown > 0) { tp.cooldown -= dt; continue; }
        const pad1 = { x: tp.x1, y: tp.y1, w: tp.w, h: tp.h };
        const pad2 = { x: tp.x2, y: tp.y2, w: tp.w, h: tp.h };
        if (aabb(pBox, pad1)) {
            p.x = tp.x2 + tp.w / 2 - p.w / 2;
            p.y = tp.y2;
            tp.cooldown = 30;
            playSound('checkpoint');
            spawnParticles(tp.x1 + tp.w / 2, tp.y1, 12, '#cc00ff', 4, 1.5);
            spawnParticles(tp.x2 + tp.w / 2, tp.y2, 12, '#cc00ff', 4, 1.5);
        } else if (aabb(pBox, pad2)) {
            p.x = tp.x1 + tp.w / 2 - p.w / 2;
            p.y = tp.y1;
            tp.cooldown = 30;
            playSound('checkpoint');
            spawnParticles(tp.x2 + tp.w / 2, tp.y2, 12, '#cc00ff', 4, 1.5);
            spawnParticles(tp.x1 + tp.w / 2, tp.y1, 12, '#cc00ff', 4, 1.5);
        }
    }

    // --- Crumbling Walls: break after wall jumps ---
    for (const cw of crumblingWalls) {
        if (cw.broken) continue;
        if (cw.shakeTimer > 0) cw.shakeTimer -= dt;
        if ((p.onWallLeft || p.onWallRight) && !p.onGround) {
            const wallBox = { x: cw.x, y: cw.y, w: cw.w, h: cw.h };
            const touchBox = { x: p.x - 2, y: p.y, w: p.w + 4, h: p.h };
            if (aabb(touchBox, wallBox)) {
                // Count wall jump hits
                if ((keys['KeyW'] || keys['Space'] || keys['ArrowUp'] || keys['touchJump']) &&
                    !(prevKeys['KeyW'] || prevKeys['Space'] || prevKeys['ArrowUp'] || prevKeys['touchJump'])) {
                    cw.hits++;
                    cw.shakeTimer = 8;
                    spawnParticles(cw.x + cw.w / 2, p.y, 4, '#8a6a4a', 3, 1);
                    if (cw.hits >= cw.maxHits) {
                        cw.broken = true;
                        spawnParticles(cw.x + cw.w / 2, cw.y + cw.h / 2, 15, '#6a4a2a', 5, 2);
                        if (gameSettings.shake) screenShake = Math.max(screenShake, 6);
                        playSound('land');
                    }
                }
            }
        }
    }

    // --- Wind Zones: apply force ---
    for (const wz of windZones) {
        if (aabb(pBox, wz)) {
            p.vx += wz.forceX * dt * 0.1;
            p.vy += wz.forceY * dt * 0.1;
        }
        // Visual wind streaks
        if (Math.random() < 0.15 * dt) {
            wz.particles.push({
                x: wz.x + Math.random() * wz.w,
                y: wz.y + Math.random() * wz.h,
                life: 20
            });
        }
        for (let i = wz.particles.length - 1; i >= 0; i--) {
            const wp = wz.particles[i];
            wp.x += wz.forceX * 2 * dt;
            wp.y += wz.forceY * 2 * dt;
            wp.life -= dt;
            if (wp.life <= 0) wz.particles.splice(i, 1);
        }
    }

    // --- Ziplines: grab and slide ---
    for (const zl of ziplines) {
        if (p._onZipline === zl) {
            // Slide along zipline
            const dx = zl.x2 - zl.x1;
            const dy = zl.y2 - zl.y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            const nx = dx / len;
            const ny = dy / len;
            p.x += nx * zl.speed * dt;
            p.y += ny * zl.speed * dt;
            p.vy = 0;
            p.vx = nx * zl.speed;
            p.onGround = false;
            // Check if reached end
            const endDist = Math.sqrt(Math.pow(p.x - zl.x2, 2) + Math.pow(p.y - zl.y2, 2));
            if (endDist < TILE) {
                p._onZipline = null;
                p.vx = nx * zl.speed;
                p.vy = ny * zl.speed * 0.5;
            }
            // Jump to detach
            if ((keys['KeyW'] || keys['Space'] || keys['ArrowUp'] || keys['touchJump']) &&
                !(prevKeys['KeyW'] || prevKeys['Space'] || prevKeys['ArrowUp'] || prevKeys['touchJump'])) {
                p._onZipline = null;
                p.vy = getCheatJumpForce() * 0.7;
                p.vx = nx * zl.speed * 1.2;
                playSound('jump');
            }
        } else if (!p.onGround && p.vy > 0 && !p._onZipline) {
            // Check for zipline grab
            const lineBox = { x: Math.min(zl.x1, zl.x2), y: Math.min(zl.y1, zl.y2), w: Math.abs(zl.x2 - zl.x1) || TILE, h: Math.abs(zl.y2 - zl.y1) || TILE };
            if (aabb(pBox, lineBox)) {
                p._onZipline = zl;
                p.vy = 0;
                playSound('walljump');
                triggerCombo();
            }
        }
    }

    // --- Boss Updates ---
    if (bossState) {
        updateBoss(dt);
    }
}

function updateBoss(dt) {
    const b = bossState;
    b.timer += dt;
    if (b.type === 'spike_wall') {
        // Spike wall chasing from left
        b.x += (1.5 + b.timer * 0.005) * dt;
        if (player.x < b.x + b.w) {
            killPlayer();
            return;
        }
    } else if (b.type === 'rising_lava') {
        // Rising lava from below
        b.y -= (0.8 + b.timer * 0.003) * dt;
        if (player.y + player.h > b.y) {
            killPlayer();
            return;
        }
    } else if (b.type === 'laser_drone') {
        // Tracking laser drone
        const targetX = player.x + player.w / 2;
        const targetY = player.y - 80;
        b.x += (targetX - b.x) * 0.02 * dt;
        b.y += (targetY - b.y) * 0.015 * dt;
        // Fire laser every 120 frames
        if (Math.floor(b.timer) % 120 < 3) {
            const laserBox = { x: b.x - 2, y: b.y, w: 4, h: WORLD_H * TILE - b.y };
            if (aabb({ x: player.x, y: player.y, w: player.w, h: player.h }, laserBox)) {
                killPlayer();
                return;
            }
        }
    }
}

// ---------- DRAW NEW BLOCKS ----------
function drawNewBlocks() {
    const th = getTheme();

    // --- Ice Platforms ---
    for (const ip of icePlatforms) {
        const sx = ip.x - camera.x;
        const sy = ip.y - camera.y;
        if (sx + ip.w < 0 || sx > canvasW || sy + ip.h < 0 || sy > canvasH) continue;
        ctx.fillStyle = 'rgba(136, 220, 255, 0.15)';
        ctx.fillRect(sx - 4, sy - 4, ip.w + 8, ip.h + 8);
        ctx.fillStyle = '#88ddff';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(sx, sy, ip.w, ip.h);
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#aaeeff';
        ctx.fillRect(sx, sy, ip.w, 4);
        // Shimmer
        const shimmer = Math.sin(Date.now() * 0.003 + sx * 0.01) * 0.2 + 0.3;
        ctx.globalAlpha = shimmer;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(sx + 4, sy + 2, ip.w * 0.3, 2);
        ctx.fillRect(sx + ip.w * 0.5, sy + 2, ip.w * 0.2, 2);
        ctx.globalAlpha = 1;
    }

    // --- Conveyor Belts ---
    for (const cb of conveyorBelts) {
        const sx = cb.x - camera.x;
        const sy = cb.y - camera.y;
        if (sx + cb.w < 0 || sx > canvasW) continue;
        ctx.fillStyle = '#555566';
        ctx.fillRect(sx, sy, cb.w, cb.h);
        ctx.fillStyle = '#888899';
        ctx.fillRect(sx, sy, cb.w, 3);
        // Animated arrows
        ctx.fillStyle = '#ffcc00';
        const arrowSpacing = 20;
        for (let ax = cb.animOffset; ax < cb.w; ax += arrowSpacing) {
            const arrowX = sx + (ax % cb.w);
            ctx.beginPath();
            if (cb.dir > 0) {
                ctx.moveTo(arrowX, sy + cb.h / 2 - 4);
                ctx.lineTo(arrowX + 6, sy + cb.h / 2);
                ctx.lineTo(arrowX, sy + cb.h / 2 + 4);
            } else {
                ctx.moveTo(arrowX + 6, sy + cb.h / 2 - 4);
                ctx.lineTo(arrowX, sy + cb.h / 2);
                ctx.lineTo(arrowX + 6, sy + cb.h / 2 + 4);
            }
            ctx.fill();
        }
    }

    // --- Bounce Pads ---
    for (const bp of bouncePads) {
        const sx = bp.x - camera.x;
        const sy = bp.y - camera.y;
        if (sx + bp.w < 0 || sx > canvasW) continue;
        const squash = bp.animTimer > 0 ? 0.7 : 1;
        ctx.fillStyle = 'rgba(0, 255, 136, 0.3)';
        ctx.fillRect(sx - 3, sy - 3, bp.w + 6, bp.h * squash + 6);
        ctx.fillStyle = '#00ff88';
        ctx.fillRect(sx, sy, bp.w, bp.h * squash);
        ctx.fillStyle = '#44ffaa';
        ctx.fillRect(sx, sy, bp.w, 3);
        // Spring coils
        ctx.strokeStyle = '#00cc66';
        ctx.lineWidth = 2;
        for (let cx = sx + 4; cx < sx + bp.w - 4; cx += 8) {
            ctx.beginPath();
            ctx.moveTo(cx, sy + bp.h * squash);
            ctx.lineTo(cx + 4, sy + bp.h * squash - 4);
            ctx.lineTo(cx + 8, sy + bp.h * squash);
            ctx.stroke();
        }
    }

    // --- Toggle Blocks ---
    const tbAlpha = 0.3 + Math.sin(Date.now() * 0.005) * 0.1;
    for (const tb of toggleBlocksA) {
        const sx = tb.x - camera.x;
        const sy = tb.y - camera.y;
        if (sx + tb.w < 0 || sx > canvasW) continue;
        ctx.globalAlpha = toggleState ? 0.2 : 0.9;
        ctx.fillStyle = '#ff6688';
        ctx.fillRect(sx, sy, tb.w, tb.h);
        if (!toggleState) {
            ctx.fillStyle = '#ff88aa';
            ctx.fillRect(sx, sy, tb.w, 4);
        }
        ctx.globalAlpha = 1;
    }
    for (const tb of toggleBlocksB) {
        const sx = tb.x - camera.x;
        const sy = tb.y - camera.y;
        if (sx + tb.w < 0 || sx > canvasW) continue;
        ctx.globalAlpha = toggleState ? 0.9 : 0.2;
        ctx.fillStyle = '#6688ff';
        ctx.fillRect(sx, sy, tb.w, tb.h);
        if (toggleState) {
            ctx.fillStyle = '#88aaff';
            ctx.fillRect(sx, sy, tb.w, 4);
        }
        ctx.globalAlpha = 1;
    }

    // --- Toggle Switches ---
    for (const ts of toggleSwitches) {
        const sx = ts.x - camera.x;
        const sy = ts.y - camera.y;
        ctx.fillStyle = toggleState ? '#6688ff' : '#ff6688';
        ctx.fillRect(sx, sy, ts.w, ts.h);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(toggleState ? 'B' : 'A', sx + ts.w / 2, sy + ts.h / 2 + 3);
        ctx.textAlign = 'left';
    }

    // --- Laser Beams ---
    for (const lb of laserBeams) {
        const sx = lb.x - camera.x;
        const sy = lb.y - camera.y;
        if (sx + lb.w < 0 || sx > canvasW) continue;
        if (lb.active) {
            const flicker = 0.7 + Math.random() * 0.3;
            ctx.globalAlpha = flicker;
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(sx, sy, lb.w, lb.h);
            ctx.fillStyle = '#ff6666';
            ctx.globalAlpha = flicker * 0.5;
            ctx.fillRect(sx - 2, sy - 2, lb.w + 4, lb.h + 4);
            ctx.globalAlpha = 1;
        } else {
            ctx.globalAlpha = 0.15;
            ctx.fillStyle = '#ff0000';
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 1;
            ctx.strokeRect(sx, sy, lb.w, lb.h);
            ctx.setLineDash([]);
            ctx.globalAlpha = 1;
        }
    }

    // --- Gravity Zones ---
    for (const gz of gravityZones) {
        const sx = gz.x - camera.x;
        const sy = gz.y - camera.y;
        if (sx + gz.w < 0 || sx > canvasW) continue;
        const pulse = Math.sin(Date.now() * 0.003) * 0.05 + 0.1;
        ctx.globalAlpha = pulse;
        ctx.fillStyle = gz.gravMod < 0 ? '#cc00ff' : '#00ccff';
        ctx.fillRect(sx, sy, gz.w, gz.h);
        // Arrow indicators
        ctx.globalAlpha = 0.3;
        const arrowDir = gz.gravMod < 0 ? -1 : 1;
        for (let ay = 10; ay < gz.h; ay += 30) {
            for (let ax = 10; ax < gz.w; ax += 30) {
                ctx.beginPath();
                ctx.moveTo(sx + ax, sy + ay + 5 * arrowDir);
                ctx.lineTo(sx + ax - 3, sy + ay - 5 * arrowDir);
                ctx.lineTo(sx + ax + 3, sy + ay - 5 * arrowDir);
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;
    }

    // --- Teleporter Pads ---
    for (const tp of teleporterPads) {
        for (const pos of [{ x: tp.x1, y: tp.y1 }, { x: tp.x2, y: tp.y2 }]) {
            const sx = pos.x - camera.x;
            const sy = pos.y - camera.y;
            const pulse = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
            ctx.fillStyle = `rgba(204, 0, 255, ${pulse * 0.3})`;
            ctx.fillRect(sx - 4, sy - 4, tp.w + 8, tp.h + 8);
            ctx.fillStyle = '#cc00ff';
            ctx.globalAlpha = pulse;
            ctx.fillRect(sx, sy, tp.w, tp.h);
            // Swirl
            ctx.strokeStyle = '#ff66ff';
            ctx.lineWidth = 2;
            const angle = Date.now() * 0.003;
            ctx.beginPath();
            ctx.arc(sx + tp.w / 2, sy + tp.h / 2, 8, angle, angle + Math.PI * 1.5);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }

    // --- Crumbling Walls ---
    for (const cw of crumblingWalls) {
        if (cw.broken) continue;
        const sx = cw.x - camera.x + (cw.shakeTimer > 0 ? (Math.random() - 0.5) * 3 : 0);
        const sy = cw.y - camera.y;
        const crackAlpha = cw.hits / cw.maxHits;
        ctx.fillStyle = '#7a5a3a';
        ctx.fillRect(sx, sy, cw.w, cw.h);
        ctx.fillStyle = '#9a7a5a';
        ctx.fillRect(sx, sy, 3, cw.h);
        ctx.fillRect(sx + cw.w - 3, sy, 3, cw.h);
        // Cracks
        if (cw.hits > 0) {
            ctx.strokeStyle = `rgba(0,0,0,${0.3 + crackAlpha * 0.4})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(sx + cw.w * 0.3, sy);
            ctx.lineTo(sx + cw.w * 0.6, sy + cw.h);
            ctx.stroke();
        }
    }

    // --- Ziplines ---
    for (const zl of ziplines) {
        const sx1 = zl.x1 - camera.x;
        const sy1 = zl.y1 - camera.y;
        const sx2 = zl.x2 - camera.x;
        const sy2 = zl.y2 - camera.y;
        ctx.strokeStyle = '#aaaaaa';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(sx1, sy1);
        ctx.lineTo(sx2, sy2);
        ctx.stroke();
        // Endpoints
        ctx.fillStyle = '#cccccc';
        ctx.beginPath(); ctx.arc(sx1, sy1, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(sx2, sy2, 4, 0, Math.PI * 2); ctx.fill();
        // Handle on zipline
        if (player._onZipline === zl) {
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath(); ctx.arc(player.x + player.w / 2 - camera.x, player.y - camera.y, 5, 0, Math.PI * 2); ctx.fill();
        }
    }

    // --- Wind Zones ---
    for (const wz of windZones) {
        const sx = wz.x - camera.x;
        const sy = wz.y - camera.y;
        // Semi-transparent zone
        ctx.globalAlpha = 0.05;
        ctx.fillStyle = '#aaddff';
        ctx.fillRect(sx, sy, wz.w, wz.h);
        ctx.globalAlpha = 1;
        // Wind streaks
        ctx.strokeStyle = 'rgba(170, 221, 255, 0.3)';
        ctx.lineWidth = 1;
        for (const wp of wz.particles) {
            const wpx = wp.x - camera.x;
            const wpy = wp.y - camera.y;
            ctx.globalAlpha = wp.life / 20;
            ctx.beginPath();
            ctx.moveTo(wpx, wpy);
            ctx.lineTo(wpx - wz.forceX * 8, wpy - wz.forceY * 8);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }

    // --- Boss Drawing ---
    if (bossState) drawBoss();
}

function drawBoss() {
    const b = bossState;
    if (b.type === 'spike_wall') {
        const sx = b.x - camera.x;
        ctx.fillStyle = '#ff2222';
        ctx.fillRect(sx, 0, b.w, canvasH);
        ctx.fillStyle = '#ff4444';
        for (let y = 0; y < canvasH; y += 24) {
            ctx.beginPath();
            ctx.moveTo(sx + b.w, y);
            ctx.lineTo(sx + b.w + 12, y + 12);
            ctx.lineTo(sx + b.w, y + 24);
            ctx.fill();
        }
    } else if (b.type === 'rising_lava') {
        const sy = b.y - camera.y;
        const pulse = Math.sin(Date.now() * 0.005) * 5;
        ctx.fillStyle = '#ff4400';
        ctx.fillRect(0, sy + pulse, canvasW, canvasH - sy);
        ctx.fillStyle = '#ff6622';
        ctx.fillRect(0, sy + pulse, canvasW, 8);
        // Bubbles
        ctx.fillStyle = '#ffaa00';
        for (let bx = 0; bx < canvasW; bx += 40) {
            const by = sy + pulse + Math.sin(Date.now() * 0.003 + bx) * 3;
            ctx.beginPath(); ctx.arc(bx, by + 4, 3, 0, Math.PI * 2); ctx.fill();
        }
    } else if (b.type === 'laser_drone') {
        const sx = b.x - camera.x;
        const sy = b.y - camera.y;
        // Drone body
        ctx.fillStyle = '#444466';
        ctx.fillRect(sx - 15, sy - 8, 30, 16);
        ctx.fillStyle = '#ff0000';
        ctx.beginPath(); ctx.arc(sx, sy, 4, 0, Math.PI * 2); ctx.fill();
        // Laser
        if (Math.floor(b.timer) % 120 < 3) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
            ctx.fillRect(sx - 2, sy, 4, canvasH - sy);
        } else if (Math.floor(b.timer) % 120 > 100) {
            // Warning
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(sx - 1, sy, 2, canvasH - sy);
            ctx.globalAlpha = 1;
        }
    }
    // Boss HP Bar in HUD
    const barW = 200, barH = 12;
    const barX = (canvasW - barW) / 2;
    const barY = canvasH - 40;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(barX - 2, barY - 2, barW + 4, barH + 4);
    ctx.fillStyle = '#ff2222';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#fff';
    ctx.font = '10px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('BOSS', canvasW / 2, barY - 5);
    ctx.textAlign = 'left';
}

// ---------- PLAYER TRAIL EFFECTS ----------
function updateTrailEffect() {
    if (currentTrail === 'none' || gameState !== 'playing') return;
    if (Math.abs(player.vx) > 1 || Math.abs(player.vy) > 1) {
        let color;
        if (currentTrail === 'flame') color = Math.random() > 0.5 ? '#ff4400' : '#ff8800';
        else if (currentTrail === 'ice_trail') color = Math.random() > 0.5 ? '#88ddff' : '#aaeeff';
        else if (currentTrail === 'stars') color = '#ffd700';
        else if (currentTrail === 'glitch') color = `rgb(${Math.random()*255|0},${Math.random()*255|0},${Math.random()*255|0})`;
        else if (currentTrail === 'rainbow_trail') {
            const t = Date.now() * 0.01;
            color = `hsl(${t % 360}, 100%, 60%)`;
        }
        if (color) {
            trailParticles.push({
                x: player.x + player.w / 2 + (Math.random() - 0.5) * 6,
                y: player.y + player.h - 2,
                color: color,
                life: 15,
                size: 2 + Math.random() * 2
            });
        }
    }
    for (let i = trailParticles.length - 1; i >= 0; i--) {
        trailParticles[i].life -= 1;
        if (trailParticles[i].life <= 0) trailParticles.splice(i, 1);
    }
    if (trailParticles.length > 100) trailParticles.splice(0, trailParticles.length - 100);
}

function drawTrailEffect() {
    for (const tp of trailParticles) {
        ctx.globalAlpha = tp.life / 15;
        ctx.fillStyle = tp.color;
        ctx.fillRect(tp.x - camera.x - tp.size / 2, tp.y - camera.y - tp.size / 2, tp.size, tp.size);
    }
    ctx.globalAlpha = 1;
}

// ---------- PLAYER HAT DRAWING ----------
function drawPlayerHat(sx, sy) {
    if (currentHat === 'none') return;
    const hatY = sy - 6;
    const cx = sx + PLAYER_W / 2;
    if (currentHat === 'crown') {
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.moveTo(cx - 6, hatY);
        ctx.lineTo(cx - 8, hatY - 8);
        ctx.lineTo(cx - 3, hatY - 4);
        ctx.lineTo(cx, hatY - 10);
        ctx.lineTo(cx + 3, hatY - 4);
        ctx.lineTo(cx + 8, hatY - 8);
        ctx.lineTo(cx + 6, hatY);
        ctx.fill();
    } else if (currentHat === 'headband') {
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(cx - 7, hatY, 14, 3);
        ctx.fillRect(cx + 5, hatY - 4, 2, 6);
    } else if (currentHat === 'antenna') {
        ctx.strokeStyle = '#aaaaaa';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, hatY);
        ctx.lineTo(cx, hatY - 12);
        ctx.stroke();
        ctx.fillStyle = '#ff0000';
        ctx.beginPath(); ctx.arc(cx, hatY - 12, 3, 0, Math.PI * 2); ctx.fill();
    } else if (currentHat === 'horns') {
        ctx.fillStyle = '#cc3333';
        ctx.beginPath();
        ctx.moveTo(cx - 5, hatY);
        ctx.lineTo(cx - 8, hatY - 10);
        ctx.lineTo(cx - 2, hatY);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + 5, hatY);
        ctx.lineTo(cx + 8, hatY - 10);
        ctx.lineTo(cx + 2, hatY);
        ctx.fill();
    } else if (currentHat === 'halo') {
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7 + Math.sin(Date.now() * 0.005) * 0.3;
        ctx.beginPath();
        ctx.ellipse(cx, hatY - 6, 8, 3, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
}

// ---------- SAVE/LOAD PROGRESSION ----------
function saveProgression() {
    try {
        localStorage.setItem('parkour_xp', playerXP);
        localStorage.setItem('parkour_prestige', prestigeCount);
        localStorage.setItem('parkour_star_ratings', JSON.stringify(starRatings));
        localStorage.setItem('parkour_mastery', JSON.stringify(masteryBadges));
        localStorage.setItem('parkour_trail', currentTrail);
        localStorage.setItem('parkour_unlocked_trails', JSON.stringify(unlockedTrails));
        localStorage.setItem('parkour_hat', currentHat);
        localStorage.setItem('parkour_unlocked_hats', JSON.stringify(unlockedHats));
        localStorage.setItem('parkour_death_effect', currentDeathEffect);
        localStorage.setItem('parkour_unlocked_death_effects', JSON.stringify(unlockedDeathEffects));
        localStorage.setItem('parkour_celebration', currentCelebration);
        localStorage.setItem('parkour_unlocked_celebrations', JSON.stringify(unlockedCelebrations));
        localStorage.setItem('parkour_login_streak', dailyLoginStreak);
        localStorage.setItem('parkour_last_login', lastLoginDate);
        localStorage.setItem('parkour_quick_restart', quickRestart);
        localStorage.setItem('parkour_skipped_levels', JSON.stringify(skippedLevels));
        localStorage.setItem('parkour_slowmo_uses', totalSlowMoUses);
        localStorage.setItem('parkour_leaderboard', JSON.stringify(localLeaderboard));
        localStorage.setItem('parkour_pb_splits', JSON.stringify(pbSplits));
        localStorage.setItem('parkour_one_hand', oneHandMode);
        // 100-feature update saves
        localStorage.setItem('parkour_skill_tree', JSON.stringify(unlockedSkills));
        localStorage.setItem('parkour_key_bindings', JSON.stringify(keyBindings));
        localStorage.setItem('parkour_season_tier', seasonPassTier);
        localStorage.setItem('parkour_season_xp', seasonPassXP);
        localStorage.setItem('parkour_season_reset', seasonPassLastReset);
        localStorage.setItem('parkour_challenge_tokens', challengeTokens);
        localStorage.setItem('parkour_title', equippedTitle);
        localStorage.setItem('parkour_milestones', JSON.stringify(milestoneBadges));
        localStorage.setItem('parkour_extended_streak', extendedStreak);
        localStorage.setItem('parkour_extended_streak_day', extendedStreakDay);
        localStorage.setItem('parkour_cape', currentCape);
        localStorage.setItem('parkour_unlocked_capes', JSON.stringify(unlockedCapes));
        localStorage.setItem('parkour_jump_effect', currentJumpEffect);
        localStorage.setItem('parkour_unlocked_jump_effects', JSON.stringify(unlockedJumpEffects));
        localStorage.setItem('parkour_land_effect', currentLandEffect);
        localStorage.setItem('parkour_unlocked_land_effects', JSON.stringify(unlockedLandEffects));
        localStorage.setItem('parkour_eye_style', currentEyeStyle);
        localStorage.setItem('parkour_nameplate', currentNameplate);
        localStorage.setItem('parkour_unlocked_nameplates', JSON.stringify(unlockedNameplates));
        localStorage.setItem('parkour_custom_skin', JSON.stringify(customSkinColors));
        localStorage.setItem('parkour_hud_toggles', JSON.stringify(hudToggles));
        localStorage.setItem('parkour_level_ratings', JSON.stringify(levelRatings));
        localStorage.setItem('parkour_dyslexia_font', dyslexiaFontEnabled);
        localStorage.setItem('parkour_game_speed', gameSpeedMultiplier);
    } catch(e) {}
}

function loadProgression() {
    try {
        playerXP = parseInt(localStorage.getItem('parkour_xp') || '0');
        prestigeCount = parseInt(localStorage.getItem('parkour_prestige') || '0');
        playerLevel = getPlayerLevel();
        const sr = localStorage.getItem('parkour_star_ratings');
        if (sr) starRatings = JSON.parse(sr);
        const mb = localStorage.getItem('parkour_mastery');
        if (mb) masteryBadges = JSON.parse(mb);
        currentTrail = localStorage.getItem('parkour_trail') || 'none';
        const ut = localStorage.getItem('parkour_unlocked_trails');
        if (ut) unlockedTrails = JSON.parse(ut);
        currentHat = localStorage.getItem('parkour_hat') || 'none';
        const uh = localStorage.getItem('parkour_unlocked_hats');
        if (uh) unlockedHats = JSON.parse(uh);
        currentDeathEffect = localStorage.getItem('parkour_death_effect') || 'shatter';
        const ude = localStorage.getItem('parkour_unlocked_death_effects');
        if (ude) unlockedDeathEffects = JSON.parse(ude);
        currentCelebration = localStorage.getItem('parkour_celebration') || 'default';
        const uc = localStorage.getItem('parkour_unlocked_celebrations');
        if (uc) unlockedCelebrations = JSON.parse(uc);
        dailyLoginStreak = parseInt(localStorage.getItem('parkour_login_streak') || '0');
        lastLoginDate = localStorage.getItem('parkour_last_login') || '';
        quickRestart = localStorage.getItem('parkour_quick_restart') === 'true';
        const sl = localStorage.getItem('parkour_skipped_levels');
        if (sl) skippedLevels = JSON.parse(sl);
        totalSlowMoUses = parseInt(localStorage.getItem('parkour_slowmo_uses') || '0');
        const lb = localStorage.getItem('parkour_leaderboard');
        if (lb) localLeaderboard = JSON.parse(lb);
        const pbs = localStorage.getItem('parkour_pb_splits');
        if (pbs) pbSplits = JSON.parse(pbs);
        oneHandMode = localStorage.getItem('parkour_one_hand') === 'true';
        // 100-feature update loads
        const sk = localStorage.getItem('parkour_skill_tree'); if (sk) unlockedSkills = JSON.parse(sk);
        const kb = localStorage.getItem('parkour_key_bindings'); if (kb) keyBindings = JSON.parse(kb);
        seasonPassTier = parseInt(localStorage.getItem('parkour_season_tier') || '0');
        seasonPassXP = parseInt(localStorage.getItem('parkour_season_xp') || '0');
        seasonPassLastReset = localStorage.getItem('parkour_season_reset') || '';
        challengeTokens = parseInt(localStorage.getItem('parkour_challenge_tokens') || '0');
        equippedTitle = localStorage.getItem('parkour_title') || 'Rookie';
        const ms = localStorage.getItem('parkour_milestones'); if (ms) milestoneBadges = JSON.parse(ms);
        extendedStreak = parseInt(localStorage.getItem('parkour_extended_streak') || '0');
        extendedStreakDay = localStorage.getItem('parkour_extended_streak_day') || '';
        currentCape = localStorage.getItem('parkour_cape') || 'none';
        const ucap = localStorage.getItem('parkour_unlocked_capes'); if (ucap) unlockedCapes = JSON.parse(ucap);
        currentJumpEffect = localStorage.getItem('parkour_jump_effect') || 'dust';
        const uje = localStorage.getItem('parkour_unlocked_jump_effects'); if (uje) unlockedJumpEffects = JSON.parse(uje);
        currentLandEffect = localStorage.getItem('parkour_land_effect') || 'dust';
        const ule = localStorage.getItem('parkour_unlocked_land_effects'); if (ule) unlockedLandEffects = JSON.parse(ule);
        currentEyeStyle = parseInt(localStorage.getItem('parkour_eye_style') || '0');
        currentNameplate = localStorage.getItem('parkour_nameplate') || 'clean';
        const unp = localStorage.getItem('parkour_unlocked_nameplates'); if (unp) unlockedNameplates = JSON.parse(unp);
        const csc = localStorage.getItem('parkour_custom_skin'); if (csc) customSkinColors = JSON.parse(csc);
        const ht = localStorage.getItem('parkour_hud_toggles'); if (ht) hudToggles = JSON.parse(ht);
        const lr = localStorage.getItem('parkour_level_ratings'); if (lr) levelRatings = JSON.parse(lr);
        dyslexiaFontEnabled = localStorage.getItem('parkour_dyslexia_font') === 'true';
        gameSpeedMultiplier = parseFloat(localStorage.getItem('parkour_game_speed') || '1');
    } catch(e) {}
    // Daily login streak
    checkDailyLogin();
}

function checkDailyLogin() {
    const today = getDailyDate();
    if (lastLoginDate === today) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    if (lastLoginDate === yesterdayStr) {
        dailyLoginStreak++;
    } else if (lastLoginDate !== '') {
        dailyLoginStreak = 1;
    } else {
        dailyLoginStreak = 1;
    }
    lastLoginDate = today;
    // Rewards
    const streakOrbs = Math.min(dailyLoginStreak * 2, 20);
    totalOrbs += streakOrbs;
    try { localStorage.setItem('parkour_total_orbs', totalOrbs); } catch(e) {}
    saveProgression();
    // Show enhanced daily login popup (Feature 15)
    setTimeout(() => showDailyLoginPopup(dailyLoginStreak, streakOrbs), 500);
}

// ---------- COSMETICS SHOP ----------
function populateShop() {
    const orbEl = document.getElementById('shop-orb-count');
    if (orbEl) orbEl.textContent = 'Orbs: ' + totalOrbs;

    // Helper to populate a cosmetic grid
    function fillGrid(gridId, items, currentId, unlockedList, setFn) {
        const grid = document.getElementById(gridId);
        if (!grid) return;
        grid.innerHTML = '';
        for (const item of items) {
            const card = document.createElement('div');
            const owned = unlockedList.includes(item.id);
            const equipped = currentId === item.id;
            card.className = 'skin-card' + (equipped ? ' equipped' : '') + (!owned ? ' locked' : '');
            card.innerHTML =
                '<div class="skin-name">' + item.name + '</div>' +
                (owned ? (equipped ? '<div class="skin-status">EQUIPPED</div>' : '<div class="skin-status" style="color:#00e5ff">EQUIP</div>') :
                '<div class="skin-cost">' + item.cost + ' orbs</div>');
            card.addEventListener('click', () => {
                if (owned) {
                    setFn(item.id);
                    populateShop();
                    playSound('click');
                } else if (totalOrbs >= item.cost) {
                    totalOrbs -= item.cost;
                    unlockedList.push(item.id);
                    setFn(item.id);
                    try { localStorage.setItem('parkour_total_orbs', totalOrbs); } catch(e) {}
                    saveProgression();
                    populateShop();
                    playSound('complete');
                } else {
                    playSound('death');
                }
            });
            grid.appendChild(card);
        }
    }

    fillGrid('trails-grid', TRAIL_EFFECTS, currentTrail, unlockedTrails, (id) => { currentTrail = id; saveProgression(); });
    fillGrid('hats-grid', PLAYER_HATS, currentHat, unlockedHats, (id) => { currentHat = id; saveProgression(); });
    fillGrid('death-effects-grid', DEATH_EFFECTS, currentDeathEffect, unlockedDeathEffects, (id) => { currentDeathEffect = id; saveProgression(); });
    fillGrid('celebrations-grid', CELEBRATIONS, currentCelebration, unlockedCelebrations, (id) => { currentCelebration = id; saveProgression(); });
}

// ---------- TIME ATTACK MODE ----------
function startTimeAttack() {
    timeAttackMode = true;
    timeAttackTimer = 0;
    timeAttackDeaths = 0;
    startLevel(0);
}
function timeAttackNextLevel() {
    if (currentLevel + 1 < LEVELS.length) {
        startLevel(currentLevel + 1);
    } else {
        timeAttackMode = false;
        spawnFloatingText('TIME ATTACK COMPLETE: ' + timeAttackTimer.toFixed(2) + 's', player.x + player.w / 2, player.y - 60, '#ffd700', 24);
    }
}

// ---------- MIRROR MODE ----------
function applyMirrorMode() {
    if (!mirrorMode) return;
    // Flip all x positions
    const worldW = WORLD_W * TILE;
    const flipX = (obj) => { obj.x = worldW - obj.x - obj.w; };
    platforms.forEach(flipX);
    walls.forEach(flipX);
    spikes.forEach(flipX);
    movingPlatforms.forEach(mp => { flipX(mp); mp.startX = worldW - mp.startX - mp.w; mp.dx = -mp.dx; mp.vx = -mp.vx; });
    fallingPlatforms.forEach(flipX);
    boostPads.forEach(bp => { flipX(bp); bp.dir = -bp.dir; });
    checkpoints.forEach(flipX);
    orbs.forEach(flipX);
    icePlatforms.forEach(flipX);
    conveyorBelts.forEach(cb => { flipX(cb); cb.dir = -cb.dir; });
    bouncePads.forEach(flipX);
    if (goalZone) flipX(goalZone);
    if (spawnPoint) spawnPoint.x = worldW - spawnPoint.x - PLAYER_W;
}

// ---------- CHALLENGE MODE ----------
function startChallengeMode(levelIdx, modifiers) {
    challengeMode = true;
    challengeModifiers = modifiers;
    startLevel(levelIdx);
}

// ---------- WEEKLY CHALLENGE ----------
function getWeeklyDate() {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day;
    const weekStart = new Date(now.setDate(diff));
    return weekStart.toISOString().split('T')[0];
}

function startWeeklyChallenge() {
    weeklyChallenge = true;
    const weekStr = getWeeklyDate();
    const rng = seededRandom('weekly_' + weekStr);
    // Generate a longer level
    showScreen('game');
    platforms = [plat(0, 18, 8, 2)]; spikes = []; movingPlatforms = []; fallingPlatforms = [];
    boostPads = []; walls = []; goalZone = null; particleCount = 0;
    checkpoints = []; lastCheckpoint = null; ghostRecording = []; orbs = [];
    icePlatforms = []; conveyorBelts = []; bouncePads = []; toggleBlocksA = []; toggleBlocksB = [];
    toggleSwitches = []; laserBeams = []; gravityZones = []; teleporterPads = [];
    crumblingWalls = []; ziplines = []; windZones = []; toggleState = false;
    currentLevel = -4;
    spawnPoint = { x: 2 * TILE, y: 16 * TILE };
    let cx = 12;
    const segments = 15 + Math.floor(rng() * 8);
    for (let i = 0; i < segments; i++) {
        const type = Math.floor(rng() * 6);
        const w = 3 + Math.floor(rng() * 5);
        const y = 13 + Math.floor(rng() * 5);
        if (type === 0) platforms.push(plat(cx, y, w, 1));
        else if (type === 1) movingPlatforms.push(moving(cx, y, w, 1, rng() > 0.5 ? 1 : 0, rng() > 0.5 ? 1 : 0, 0.5 + rng(), 2 + Math.floor(rng() * 3)));
        else if (type === 2) fallingPlatforms.push(falling(cx, y, w, 1));
        else if (type === 3) { platforms.push(plat(cx, y, w, 1)); icePlatforms.push(icePlat(cx, y, w, 1)); }
        else if (type === 4) { platforms.push(plat(cx, y, w, 1)); bouncePads.push(bouncePad(cx + 1, y, 2, 1, -13)); }
        else { platforms.push(plat(cx, y, w, 1)); conveyorBelts.push(conveyor(cx, y, w, 1, rng() > 0.5 ? 1 : -1, 2)); }
        if (rng() > 0.5) spikes.push(spike(cx + 1, y - 1, Math.min(w - 2, 2), 1));
        if (rng() > 0.5) orbs.push(orbHelper(cx + Math.floor(w / 2), y - 2));
        if (i % 5 === 4) checkpoints.push(checkpoint(cx + 2, y - 2));
        cx += w + 3 + Math.floor(rng() * 5);
    }
    platforms.push(plat(cx, 18, 6, 2));
    goalZone = goal(cx + 3, 17);
    resetPlayer();
    levelTimer = 0; timerStarted = false; deathCount = 0;
    camera.x = player.x - canvasW / 2; camera.y = player.y - canvasH / 2;
    comboCount = 0; comboTimer = 0; ghostPlayback = [];
    const hudLevel = document.getElementById('hud-level');
    if (hudLevel) hudLevel.textContent = 'WEEKLY [' + getDiff().label + ']';
    gameState = 'playing';
    startMusic(); startWind(); initWeather();
    scarfTrail = []; deathReplayBuffer = [];
    document.getElementById('pause-overlay').classList.add('hidden');
    document.getElementById('complete-overlay').classList.add('hidden');
    document.getElementById('death-overlay').classList.add('hidden');
}

// ---------- PRESTIGE SYSTEM ----------
function doPrestige() {
    if (unlockedLevel < LEVELS.length - 1) return; // must clear all levels
    prestigeCount++;
    // Reset progress but keep cosmetics
    bestTimes = {};
    bestGrades = {};
    unlockedLevel = 0;
    starRatings = {};
    masteryBadges = {};
    try {
        localStorage.setItem('parkour_best', '{}');
        localStorage.setItem('parkour_grades', '{}');
        localStorage.setItem('parkour_unlocked', '0');
    } catch(e) {}
    saveProgression();
    spawnFloatingText('PRESTIGE ' + prestigeCount + '! +5% Speed Bonus', player.x + player.w / 2, player.y - 60, '#ffd700', 22);
    checkAchievements();
}

// ---------- QoL: INPUT DISPLAY ----------
function drawInputDisplay() {
    if (!inputDisplayEnabled) return;
    const keyNames = ['←', '→', '↑', '↓', 'DASH', 'JUMP'];
    const keyStates = [
        keys['KeyA'] || keys['ArrowLeft'],
        keys['KeyD'] || keys['ArrowRight'],
        keys['KeyW'] || keys['ArrowUp'],
        keys['KeyS'] || keys['ArrowDown'],
        keys['ShiftLeft'] || keys['ShiftRight'],
        keys['Space']
    ];
    const startX = 10;
    const startY = canvasH - 40;
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i < keyNames.length; i++) {
        const x = startX + i * 35 + 15;
        ctx.fillStyle = keyStates[i] ? 'rgba(0, 229, 255, 0.8)' : 'rgba(100, 100, 100, 0.4)';
        ctx.fillRect(x - 14, startY, 28, 24);
        ctx.fillStyle = keyStates[i] ? '#ffffff' : '#888888';
        ctx.fillText(keyNames[i], x, startY + 16);
    }
}

// ---------- QoL: LEVEL SKIP ----------
function offerLevelSkip() {
    if (!levelDeathCounts[currentLevel]) levelDeathCounts[currentLevel] = 0;
    levelDeathCounts[currentLevel]++;
    if (levelDeathCounts[currentLevel] >= 20 && !skippedLevels[currentLevel]) {
        const skipEl = document.getElementById('death-skip-btn');
        if (skipEl) skipEl.style.display = '';
    }
}
function skipLevel() {
    skippedLevels[currentLevel] = true;
    saveProgression();
    if (currentLevel + 1 < LEVELS.length) {
        if (currentLevel + 1 > unlockedLevel) {
            unlockedLevel = currentLevel + 1;
            try { localStorage.setItem('parkour_unlocked', unlockedLevel); } catch(e) {}
        }
        startLevel(currentLevel + 1);
    }
}

// ---------- VISUAL: IMPACT SHOCKWAVE ----------
let shockwaves = [];
function spawnShockwave(x, y) {
    shockwaves.push({ x, y, radius: 5, maxRadius: 80, life: 1 });
}
function updateShockwaves(dt) {
    for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 3 * dt;
        sw.life -= 0.03 * dt;
        if (sw.life <= 0 || sw.radius >= sw.maxRadius) shockwaves.splice(i, 1);
    }
}
function drawShockwaves() {
    for (const sw of shockwaves) {
        const sx = sw.x - camera.x;
        const sy = sw.y - camera.y;
        ctx.strokeStyle = `rgba(0, 229, 255, ${sw.life * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sx, sy, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// ---------- VISUAL: NEAR-DEATH DISTORTION ----------
function drawNearDeathDistortion() {
    let minDist = Infinity;
    for (const sp of spikes) {
        const dx = player.x + player.w / 2 - (sp.x + sp.w / 2);
        const dy = player.y + player.h / 2 - (sp.y + sp.h / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) minDist = dist;
    }
    for (const lb of laserBeams) {
        if (!lb.active) continue;
        const dx = player.x + player.w / 2 - (lb.x + lb.w / 2);
        const dy = player.y + player.h / 2 - (lb.y + lb.h / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) minDist = dist;
    }
    if (minDist < 60) {
        const intensity = (1 - minDist / 60) * 0.15;
        // Red tint overlay
        ctx.fillStyle = `rgba(255, 0, 0, ${intensity})`;
        ctx.fillRect(0, 0, canvasW, canvasH);
    }
}

// ---------- VISUAL: ENHANCED PARALLAX ----------
let parallaxLayers = [];
function initParallax() {
    parallaxLayers = [];
    // Mountains
    for (let i = 0; i < 8; i++) {
        parallaxLayers.push({ type: 'mountain', x: i * 300, h: 80 + Math.random() * 60, speed: 0.02 });
    }
    // Buildings
    for (let i = 0; i < 12; i++) {
        parallaxLayers.push({ type: 'building', x: i * 200, w: 30 + Math.random() * 40, h: 40 + Math.random() * 80, speed: 0.05 });
    }
}
function drawParallax() {
    for (const layer of parallaxLayers) {
        const sx = ((layer.x - camera.x * layer.speed) % 3000 + 3000) % 3000 - 500;
        const sy = canvasH - layer.h;
        if (layer.type === 'mountain') {
            ctx.fillStyle = 'rgba(30, 40, 60, 0.4)';
            ctx.beginPath();
            ctx.moveTo(sx - 80, canvasH);
            ctx.lineTo(sx, sy);
            ctx.lineTo(sx + 80, canvasH);
            ctx.fill();
        } else {
            ctx.fillStyle = 'rgba(20, 30, 50, 0.5)';
            ctx.fillRect(sx, sy, layer.w || 40, layer.h);
            // Windows
            ctx.fillStyle = 'rgba(255, 200, 100, 0.15)';
            for (let wy = sy + 8; wy < canvasH - 10; wy += 15) {
                for (let wx = sx + 5; wx < sx + (layer.w || 40) - 5; wx += 10) {
                    ctx.fillRect(wx, wy, 4, 4);
                }
            }
        }
    }
}

// ---------- AUDIO: COMBO SOUND ESCALATION ----------
function playComboSound(comboNum) {
    if (!audioCtx || !masterGainNode) return;
    // Rising pitch chromatic scale
    const baseFreq = 440;
    const semitone = Math.pow(2, 1 / 12);
    const freq = baseFreq * Math.pow(semitone, (comboNum - 1) % 12);
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = comboNum % 5 === 0 ? 'triangle' : 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0.08;
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(masterGainNode);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
    // Chord at milestones (5, 10, 15...)
    if (comboNum % 5 === 0) {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.value = freq * 1.5;
        gain2.gain.value = 0.06;
        gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        osc2.connect(gain2);
        gain2.connect(masterGainNode);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.25);
    }
}

function killPlayer() {
    // Max mode: don't die
    if (maxMode) {
        // Find nearest platform to respawn on
        let bestPlat = null, bestDist = Infinity;
        const allSurfs = [...platforms, ...movingPlatforms];
        for (const fp of fallingPlatforms) { if (!fp.fallen) allSurfs.push(fp); }
        for (const s of allSurfs) {
            const dx = (s.x + s.w / 2) - player.x;
            const dy = s.y - player.y;
            const dist = Math.abs(dx) + Math.abs(dy);
            if (dist < bestDist && s.y < player.y + 200) {
                bestDist = dist;
                bestPlat = s;
            }
        }
        if (bestPlat) {
            player.x = bestPlat.x + bestPlat.w / 2 - player.w / 2;
            player.y = bestPlat.y - player.h;
        }
        player.vy = -6;
        player.vx = 3;
        return;
    }
    // Feature 15: Afterimage phase invulnerability
    if (afterimagePhaseActive) return;
    // Skill tree def3: Resilience (survive one hit)
    if (hasSkill('def3') && !resilienceUsed) {
        resilienceUsed = true;
        player.vy = -8;
        invulnTimer = 60;
        spawnFloatingText('RESILIENCE!', player.x + player.w / 2, player.y - 30, '#44ff44', 18);
        return;
    }
    // Invulnerability timer
    if (invulnTimer > 0) return;
    // Survival mode: lose heart instead of dying
    if (survivalMode && survivalHearts > 1) {
        survivalHearts--;
        player.vy = -8;
        invulnTimer = 90;
        spawnFloatingText('♥ ' + survivalHearts, player.x + player.w / 2, player.y - 30, '#ff4444', 20);
        playSound('death');
        spawnParticles(player.x + player.w / 2, player.y + player.h / 2, 10, '#ff4444', 4, 1);
        return;
    }
    // Zen mode: no death
    if (zenMode) {
        player.vy = -8; player.x = spawnPoint.x; player.y = spawnPoint.y;
        return;
    }
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

    // Level skip offer
    offerLevelSkip();

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
    // Feature 9: Level transition fanfare
    startCompleteAnim();
    // Feature 13: Local leaderboard
    if (currentLevel >= 0) addLeaderboardEntry(currentLevel, levelTimer);

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

    // --- XP Rewards ---
    let xpGain = 50; // base completion XP
    if (grade === 'gold') xpGain += 100;
    else if (grade === 'silver') xpGain += 50;
    else if (grade === 'bronze') xpGain += 25;
    if (deathCount === 0) xpGain += 75;
    xpGain += comboCount * 2;
    addXP(xpGain);
    spawnFloatingText('+' + xpGain + ' XP', player.x + player.w / 2, player.y - 100, '#88ff88', 16);

    // --- 3-Star Rating ---
    if (currentLevel >= 0) {
        if (!starRatings[currentLevel]) starRatings[currentLevel] = {};
        starRatings[currentLevel].complete = true;
        if (currentLevel < GRADE_THRESHOLDS.length) {
            if (time <= GRADE_THRESHOLDS[currentLevel].silver) starRatings[currentLevel].silverTime = true;
            if (time <= GRADE_THRESHOLDS[currentLevel].gold && deathCount === 0) starRatings[currentLevel].goldNoDeath = true;
        }
        // --- Mastery Badges ---
        if (!masteryBadges[currentLevel]) masteryBadges[currentLevel] = {};
        if (deathCount === 0) masteryBadges[currentLevel].zeroDeath = true;
        if (totalDashes === 0 || (typeof levelDashes !== 'undefined' && levelDashes === 0)) {
            masteryBadges[currentLevel].noDash = true;
            unlockAchievement('purist');
        }
        if (currentLevel < GRADE_THRESHOLDS.length && time <= GRADE_THRESHOLDS[currentLevel].gold) {
            masteryBadges[currentLevel].speedRecord = true;
        }
        saveProgression();
    }

    // Check achievements
    checkAchievements();

    // Season pass XP (Feature 57)
    updateSeasonPass(xpGain);
    // Challenge tokens from challenge/weekly/gauntlet modes
    if (challengeMode || weeklyChallenge || gauntletMode) {
        const tokens = Math.floor(xpGain / 10);
        challengeTokens += tokens;
        spawnFloatingText('+' + tokens + ' Tokens', player.x + player.w / 2, player.y - 120, '#ff4081', 14);
    }

    // Time Attack: auto-advance to next level
    if (timeAttackMode) {
        timeAttackTimer += time;
        timeAttackDeaths += deathCount;
        setTimeout(() => { timeAttackNextLevel(); }, 1000);
    }
    // Speedrun mode: advance to next level
    if (speedrunMode) {
        speedrunSplits.push(levelTimer);
        speedrunTimer += levelTimer;
        speedrunLevel++;
        if (speedrunLevel < LEVELS.length) {
            setTimeout(() => { loadLevel(speedrunLevel); gameState = 'playing'; }, 500);
        } else {
            spawnFloatingText('SPEEDRUN COMPLETE! ' + speedrunTimer.toFixed(2) + 's', player.x + player.w / 2, player.y - 60, '#ffd700', 22);
            try { const pb = parseFloat(localStorage.getItem('parkour_speedrun_pb') || '999999'); if (speedrunTimer < pb) localStorage.setItem('parkour_speedrun_pb', speedrunTimer.toFixed(3)); } catch(e) {}
            speedrunMode = false;
        }
    }
    // Gauntlet mode
    if (gauntletMode) {
        gauntletScore += Math.max(0, 1000 - Math.floor(levelTimer * 10) - deathCount * 50);
        const nextIdx = gauntletLevels.indexOf(currentLevel) + 1;
        if (nextIdx < gauntletLevels.length) {
            setTimeout(() => { loadLevel(gauntletLevels[nextIdx]); gameState = 'playing'; }, 500);
        } else {
            spawnFloatingText('GAUNTLET COMPLETE! Score: ' + gauntletScore, player.x + player.w / 2, player.y - 60, '#ffd700', 20);
            gauntletMode = false;
        }
    }
    // Boss Rush mode
    if (bossRushMode) {
        const bossLevels = [20, 21, 22];
        bossRushTimer += levelTimer;
        bossRushLevel++;
        if (bossRushLevel < bossLevels.length) {
            setTimeout(() => { loadLevel(bossLevels[bossRushLevel]); gameState = 'playing'; }, 500);
        } else {
            spawnFloatingText('BOSS RUSH COMPLETE! ' + bossRushTimer.toFixed(2) + 's', player.x + player.w / 2, player.y - 60, '#ffd700', 22);
            bossRushMode = false;
        }
    }

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

    // Reset player fully (prevents NaN camera from undefined vx/vy)
    resetPlayer();

    // Override position with replay data
    player.x = replayData[0].x;
    player.y = replayData[0].y;
    player.w = PLAYER_W;
    player.h = PLAYER_H;

    // Reset camera zoom and position
    cameraZoom = 1;
    camera.x = player.x - canvasW / 2;
    camera.y = player.y - canvasH / 2;

    // Initialize weather for visual fidelity
    initWeather();

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

    // Draw hat
    if (currentHat !== 'none') {
        drawPlayerHat(sx + p.w / 2, sy);
    }

    // Speed burst glow
    if (speedBurstActive) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
        ctx.beginPath();
        ctx.arc(sx + p.w / 2, sy + p.h / 2, 25, 0, Math.PI * 2);
        ctx.fill();
    }

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
    let txt = '\u2605 ' + totalStars + '/' + maxStars + ' [' + bar + '] ' + pct + '%';
    // Feature 16: Prestige badge on menu
    if (prestigeCount > 0) txt += '  P' + prestigeCount;
    el.textContent = txt;
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
        { label: 'XP LEVEL', value: 'Lv.' + getPlayerLevel() + ' (' + playerXP + ' XP)', color: '#88ff88' },
        { label: 'PRESTIGE', value: prestigeCount > 0 ? 'P' + prestigeCount : 'NONE', color: '#ffd700' },
        { label: 'LOGIN STREAK', value: dailyLoginStreak + ' days', color: '#ff8c00' },
        { label: 'TRAILS', value: unlockedTrails.length + '/' + TRAIL_EFFECTS.length, color: '#ff4400' },
        { label: 'HATS', value: unlockedHats.length + '/' + PLAYER_HATS.length, color: '#cc99ff' },
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
    // Feature 1: Slow-motion time scale
    if (slowMotionActive && gameState === 'playing') dtScale *= SLOWMO_SCALE;
    // Feature 95: Game speed adjustment
    if (gameSpeedMultiplier !== 1) dtScale *= gameSpeedMultiplier;

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

    // Photo mode (Feature 11)
    if (gameState === 'photo') {
        updatePhotoMode();
        camera.x = photoCamera.x;
        camera.y = photoCamera.y;
        cameraZoom = photoCamera.zoom;
    }

    // Countdown state — render level but don't update player
    if (gameState === 'countdown') {
        updateCountdown(dt);
        updateWeather(dtScale);
        updateClouds(dtScale);
        updateCamera(dtScale);
    }

    if (gameState === 'playing') {
        // Auto-play toggle (spacebar when cheat mode active)
        if (cheatMode) {
            if (keys['Space'] && !prevKeys['Space']) {
                autoPlay = !autoPlay;
                keys['Space'] = false;
                if (!autoPlay) {
                    // Clear all keys so player regains full control immediately
                    for (const k in keys) keys[k] = false;
                    // When turning off autoplay, also disable max mode
                    maxMode = false;
                }
                spawnFloatingText(autoPlay ? 'AUTO-PLAY ON' : 'AUTO-PLAY OFF',
                    player.x + player.w / 2, player.y - 30, autoPlay ? '#00ff88' : '#ff4444', 18);
            }
            if (autoPlay) {
                if (maxMode) {
                    updateMaxMode();
                } else {
                    updateAutoPlay();
                }
            }
        }

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
        updateNewBlocks(dtScale);
        updateTrailEffect();
        updateShockwaves(dtScale);
        updateCamera(dtScale);
        updateCombo(dtScale);
        updateSplitTimer();
        updateStreakHUD();
        updateWeather(dtScale);
        updateClouds(dtScale);
        updateConfetti(dtScale);
        updateDeathAnim(dtScale);
        updateScarfTrail();
        // New feature updates
        updateSlowMotion(dtScale);
        updateEnemyDrones(dtScale);
        updateWallSpikes(dtScale);
        updateWaterPools(dtScale);
        updateDeathPulse();
        updateEmote(dtScale);
        updateLevelUpAnim(dtScale);
        checkChallengeOrbCollision();
        if (completeAnimState) updateCompleteAnim(dtScale);
        if (playerInWater) { player.vx *= 0.6; player.vy *= 0.8; }
        if (oneHandMode) updateOneHandMode();
        updateNewBlocks2(dtScale);
        updateNewBlocks3(dtScale);
        updateGameplayMechanics(dtScale);
        updateVisualEffects(dtScale);
        updateAudioFeatures();
        checkMilestoneBadges();

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
        if (ghostPlayback.length > 0 && timerStarted) {
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
        // Update XP HUD
        const xpEl = document.getElementById('hud-xp');
        if (xpEl) xpEl.textContent = 'Lv.' + getPlayerLevel();
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
        drawParallax();
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
        drawNewBlocks();
        drawEnemyDrones();
        drawWallSpikes();
        drawWaterPools();
        drawNewBlocks2();
        drawNewBlocks3();
        drawCheckpointChallengeOrbs();
        drawOrbs();
        drawTrailEffect();
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
        drawShockwaves();
        drawNearDeathDistortion();
        drawDeathPulse();
        drawVignette();
        drawScreenFlash();
        drawPostProcessing();
        drawColorblindSymbols();
        drawPrestigeEffects();
        drawEmote();
        drawLevelUpAnim();
        drawGameplayMechanics();
        drawVisualEffects();

        ctx.restore();

        // Draw minimap and progress bar outside zoom transform
        if (gameSettings.minimap && gameState !== 'replay') {
            drawMinimap();
        }
        if (gameState === 'playing') {
            drawProgressBar();
            drawInputDisplay();
            drawSplitScreenTimer();
            drawPerformanceOverlay();
            drawNotificationQueue();
            drawRadialMenu();
            // Survival hearts HUD
            if (survivalMode) {
                ctx.save(); ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#ff4444'; ctx.textAlign = 'left';
                let heartsStr = '';
                for (let i = 0; i < SURVIVAL_MAX_HEARTS; i++) heartsStr += i < survivalHearts ? '♥' : '♡';
                ctx.fillText(heartsStr, 20, canvasH - 20);
                ctx.restore();
            }
            // Ghost Race delta
            if (ghostRaceMode && ghostPlayback.length > 0 && ghostFrame < ghostPlayback.length) {
                const gf = ghostPlayback[ghostFrame];
                if (gf) {
                    ghostRaceDelta = player.x - gf.x;
                    ctx.save(); ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center';
                    ctx.fillStyle = ghostRaceDelta > 0 ? '#4caf50' : '#ff4444';
                    ctx.fillText((ghostRaceDelta > 0 ? '+' : '') + Math.round(ghostRaceDelta) + 'px', canvasW / 2, 62);
                    ctx.restore();
                }
            }
            // Speedrun splits
            if (speedrunMode) {
                ctx.save(); ctx.font = 'bold 11px monospace'; ctx.fillStyle = '#ff4081'; ctx.textAlign = 'right';
                ctx.fillText('SPEEDRUN Lv.' + (speedrunLevel + 1) + '/' + LEVELS.length, canvasW - 20, canvasH - 20);
                ctx.fillText('Total: ' + speedrunTimer.toFixed(2) + 's', canvasW - 20, canvasH - 6);
                ctx.restore();
            }
        }
        if (gameState === 'photo') drawPhotoModeUI();
        // Feature 1: Slow-mo cooldown ring HUD
        if (gameState === 'playing' && getPlayerLevel() >= 6) {
            const hudX = canvasW - 40;
            const hudY = canvasH - 40;
            const cdPct = slowMotionActive ? slowMotionTimer / SLOWMO_DURATION : (slowMotionCooldown > 0 ? 1 - slowMotionCooldown / SLOWMO_COOLDOWN : 1);
            ctx.save();
            ctx.strokeStyle = slowMotionActive ? '#4488ff' : (slowMotionCooldown > 0 ? '#444' : '#4488ff');
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(hudX, hudY, 14, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * cdPct);
            ctx.stroke();
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = slowMotionActive ? '#4488ff' : (slowMotionCooldown > 0 ? '#666' : '#4488ff');
            ctx.fillText('Q', hudX, hudY);
            ctx.restore();
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

        // Auto-play indicator
        if (autoPlay && gameState === 'playing') {
            ctx.save();
            ctx.font = 'bold 13px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            const pulse = 0.6 + 0.4 * Math.sin(Date.now() * 0.004);
            ctx.globalAlpha = pulse;
            ctx.fillStyle = '#00ff88';
            ctx.fillText('AUTO-PLAY', canvasW / 2, canvasH - 8);
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

    // Feature 1: Slow-motion (Q key)
    if (e.code === 'KeyQ' && gameState === 'playing') {
        activateSlowMotion();
    }

    // Feature 25: Practice rewind (Z key)
    if (e.code === 'KeyZ' && gameState === 'playing' && practiceMode) {
        practiceRewind();
    }

    // Feature 11: Photo mode (F2)
    if (e.code === 'F2' && (gameState === 'playing' || gameState === 'paused')) {
        e.preventDefault();
        enterPhotoMode();
    }
    if (e.code === 'F2' && gameState === 'photo') {
        e.preventDefault();
        exitPhotoMode();
    }
    if (e.code === 'F3' && gameState === 'photo') {
        e.preventDefault();
        saveScreenshot();
    }

    // Feature 30: Player emotes (1-4 while idle)
    if (e.code === 'Digit1' && gameState === 'playing') startEmote('wave');
    if (e.code === 'Digit2' && gameState === 'playing') startEmote('flex');
    if (e.code === 'Digit3' && gameState === 'playing') startEmote('spin');
    if (e.code === 'Digit4' && gameState === 'playing') startEmote('sit');

    if (e.code === 'Escape') {
        if (gameState === 'photo') {
            exitPhotoMode();
        } else if (gameState === 'replay' || gameState === 'replay_done') {
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

    // Load new progression data
    loadProgression();
    checkDailyLogin();
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
        if (skippedLevels[i]) tile.classList.add('skipped');

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
        // Feature 22: Track mouse for ghost preview
        editorMouseX = e.offsetX;
        editorMouseY = e.offsetY;
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
        wall: '#2a3a2a',
        checkpoint: '#00ffaa',
        orb: '#ffd700',
        gravity: '#9933ff',
        teleporter: '#ff00ff',
        crumble: '#8B4513',
        zipline: '#cccc00',
        drone: '#ff2200',
        water: '#2288ff',
        wallspike: '#ff6633',
        magnet: '#6633cc',
        trampoline: '#ff44ff',
        disappear: '#44aacc',
        sawblade: '#aaaaaa',
        springwall: '#22cc44',
        lavafloor: '#ff4400',
        portalbeam: '#ff00ff',
        speedpad: '#00ff88',
        // 100-feature update
        pressureplate: '#887744',
        gate: '#666688',
        acid: '#33cc00',
        rotating: '#5566aa',
        laserturret: '#554444',
        bubble: '#88bbff',
        flamejet: '#ff6600',
        gravityorb: '#9933ff',
        shockwave: '#ff8800',
        shadow: '#334455',
        timedswitch: '#4488aa',
        erail: '#ffff00',
        phantom: '#666688',
        piston: '#776655',
        thornvine: '#228822'
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

    // Feature 22: Editor ghost preview at mouse position
    if (editorMouseX > 0 && editorMouseY > 0) {
        const gmx = editorMouseX + editorCamera.x;
        const gmy = editorMouseY + editorCamera.y;
        const gtx = Math.floor(gmx / (TILE * 0.5)) * (TILE * 0.5); // snap to half-tile
        const gty = Math.floor(gmy / (TILE * 0.5)) * (TILE * 0.5);
        const gsx = gtx - editorCamera.x;
        const gsy = gty - editorCamera.y;
        ectx.globalAlpha = 0.35;
        ectx.fillStyle = colors[editorTool] || '#555';
        ectx.fillRect(gsx, gsy, TILE, TILE);
        ectx.strokeStyle = '#ffffff';
        ectx.strokeRect(gsx, gsy, TILE, TILE);
        ectx.globalAlpha = 1;
        ectx.fillStyle = '#fff';
        ectx.font = '9px monospace';
        ectx.fillText(editorTool, gsx + 2, gsy - 3);
    }

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
            case 'ice':
                icePlatforms.push({ x: px, y: py, w: pw, h: ph });
                break;
            case 'conveyor':
                conveyorBelts.push({ x: px, y: py, w: pw, h: ph, dir: 1, speed: 2, animOffset: 0 });
                break;
            case 'bouncepad':
                bouncePads.push({ x: px, y: py, w: pw, h: ph, force: -14, animTimer: 0 });
                break;
            case 'laser':
                laserBeams.push({ x: px, y: py, w: TILE, h: ph, onTime: 60, offTime: 40, timer: 0, active: true });
                break;
            case 'wind':
                windZones.push({ x: px, y: py, w: pw, h: ph, forceX: 3, forceY: 0, particles: [] });
                break;
            // Feature 21: Missing editor tools
            case 'checkpoint':
                checkpoints.push({ x: px, y: py, w: TILE, h: TILE * 2, activated: false });
                break;
            case 'orb':
                orbs.push({ x: px + TILE / 2, y: py + TILE / 2, r: 8, collected: false, bobPhase: Math.random() * Math.PI * 2 });
                break;
            case 'gravity':
                gravityZones.push({ x: px, y: py, w: pw, h: ph, gravMod: -1 });
                break;
            case 'teleporter':
                teleporterPads.push({ x1: px, y1: py, x2: px + 5 * TILE, y2: py, w: TILE, h: TILE * 2, cooldown: 0 });
                break;
            case 'crumble':
                crumblingWalls.push({ x: px, y: py, w: TILE, h: ph, hits: 0, maxHits: 2, broken: false, shakeTimer: 0 });
                break;
            case 'zipline':
                ziplines.push({ x1: px, y1: py, x2: px + 5 * TILE, y2: py - 2 * TILE, speed: 4 });
                break;
            case 'drone':
                enemyDrones.push({ x: px, y: py, w: 14, h: 14, patrolX1: px - 3 * TILE, patrolX2: px + 3 * TILE, patrolY: py, speed: 1.5, chaseRange: 60, alertTimer: 0, dir: 1, glowPhase: 0 });
                break;
            case 'water':
                waterPools.push({ x: px, y: py, w: pw, h: ph, wavePhase: 0 });
                break;
            case 'wallspike':
                wallSpikes.push({ x: px, y: py, w: TILE * 0.4, h: ph, dir: 1, onTime: 30, offTime: 90, timer: 0, extended: false });
                break;
            case 'magnet':
                magnetPlatforms.push({ x: px, y: py, w: pw, h: ph, range: 4 * TILE, pullForce: 0.3 });
                break;
            case 'trampoline':
                trampolines.push({ x: px, y: py, w: pw, h: TILE * 0.4, force: -18, animTimer: 0, compressed: false });
                break;
            case 'disappear':
                disappearingPlatforms.push({ x: px, y: py, w: pw, h: ph, onTime: 90, offTime: 60, timer: 0, visible: true });
                break;
            case 'sawblade':
                sawblades.push({ x: px, y: py, radius: TILE * 0.5, cx: px, cy: py, orbitRadius: 0, speed: 0.04, angle: 0 });
                break;
            case 'springwall':
                springWalls.push({ x: px, y: py, w: TILE, h: ph, dir: 1, bounceForce: 10, animTimer: 0 });
                break;
            case 'lavafloor':
                lavaFloors.push({ x: px, y: py, w: pw, h: ph, riseSpeed: 0, baseY: py, wavePhase: 0 });
                break;
            case 'portalbeam':
                portalBeams.push({ x: px, y: py, w: pw, h: TILE * 0.5, destX: px + 10 * TILE, destY: py, cooldown: 0, glowPhase: 0 });
                break;
            case 'speedpad':
                speedPads.push({ x: px, y: py, w: pw, h: TILE * 0.3, boost: 12, duration: 60, animOffset: 0 });
                break;
            // 100-feature update editor blocks
            case 'pressureplate':
                pressurePlates.push({ x: px, y: py, w: pw, h: TILE * 0.3, linkedIds: ['A'], activated: false, pressTimer: 0, requiredTime: 60 });
                break;
            case 'gate':
                gateBlocks.push({ x: px, y: py, w: pw, h: ph, gateId: 'A', open: false, openProgress: 0, origY: py });
                break;
            case 'acid':
                acidPools.push({ x: px, y: py, w: pw, h: ph, bubblePhase: 0 });
                break;
            case 'rotating':
                rotatingPlatforms.push({ x: px, y: py, w: pw, h: TILE, pivotX: px, pivotY: py - 3 * TILE, radius: 3 * TILE, angle: 0, speed: 0.02 });
                break;
            case 'laserturret':
                laserTurrets.push({ x: px, y: py, w: TILE, h: TILE, dir: 1, warmUp: 30, onTime: 40, offTime: 60, timer: 0, phase: 'off', beamLength: 12 * TILE });
                break;
            case 'bubble':
                bubblePlatforms.push({ x: px, y: py, w: TILE * 1.5, h: TILE * 1.5, radius: TILE * 0.75, contactTimer: 0, popped: false, regenTimer: 0, driftSpeed: -0.3, origY: py });
                break;
            case 'flamejet':
                flameJets.push({ x: px, y: py, w: TILE, h: TILE, dir: 'up', onTime: 40, offTime: 60, timer: 0, active: false, flameLength: 4 * TILE, warningTimer: 0 });
                break;
            case 'gravityorb':
                gravityOrbs.push({ x: px + TILE / 2, y: py + TILE / 2, radius: 10, collected: false, respawnTimer: 0, bobPhase: 0 });
                break;
            case 'shockwave':
                shockwaveEmitters.push({ x: px + TILE / 2, y: py + TILE / 2, interval: 120, timer: 0, waveRadius: 0, waveActive: false, pushForce: 5 });
                break;
            case 'shadow':
                shadowPlatforms.push({ x: px, y: py, w: pw, h: ph, revealRadius: 4 * TILE, visibility: 0 });
                break;
            case 'timedswitch':
                timedSwitchBlocks.push({ x: px, y: py, w: pw, h: ph, duration: 120, timer: 0, solid: false });
                break;
            case 'erail':
                electrifiedRails.push({ x: px, y: py, w: pw, h: TILE * 0.4, onTime: 60, offTime: 90, timer: 0, electrified: false, sparkPhase: 0 });
                break;
            case 'phantom':
                phantomWalls.push({ x: px, y: py, w: pw, h: ph, passableDir: 'right' });
                break;
            case 'piston':
                pistonBlocks.push({ x: px, y: py, w: pw, h: ph, dir: 'right', extendDist: 3 * TILE, speed: 2, extended: 0, extending: true, origX: px, origY: py });
                break;
            case 'thornvine':
                const segs = []; for (let i = 0; i < Math.max(1, Math.floor(ph / TILE)); i++) segs.push({ x: px, y: py + i * TILE, phase: Math.random() * Math.PI * 2 });
                thornVines.push({ x: px, y: py, h: ph, side: 'left', segments: segs, growPhase: 0, grown: true, growTimer: 0, onTime: 120, offTime: 60 });
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
            } else if (pendingAction === 'time_attack') {
                doScreenWipe(() => startTimeAttack(), 'TIME ATTACK');
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

    // Block types screen navigation
    document.getElementById('btn-block-types').addEventListener('click', () => {
        playSound('click');
        showScreen('blocktypes');
    });
    document.getElementById('btn-back-blocktypes').addEventListener('click', () => {
        playSound('click');
        showScreen('controls');
    });

    // Guide screen (saavan code)
    document.getElementById('btn-guide').addEventListener('click', () => {
        playSound('click');
        showScreen('guide');
    });
    document.getElementById('btn-back-guide').addEventListener('click', () => {
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

    // Audio mute toggle
    let audioMuted = false;
    let preMuteVolume = gameSettings.volume;
    const muteBtn = document.getElementById('btn-mute');
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            audioMuted = !audioMuted;
            if (audioMuted) {
                preMuteVolume = gameSettings.volume;
                gameSettings.volume = 0;
            } else {
                gameSettings.volume = preMuteVolume || 100;
            }
            if (masterGainNode) masterGainNode.gain.value = gameSettings.volume / 100;
            muteBtn.textContent = audioMuted ? 'AUDIO: MUTED' : 'AUDIO: ON';
            try { localStorage.setItem('parkour_settings', JSON.stringify(gameSettings)); } catch(e) {}
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

    // --- New Mode Buttons ---
    document.getElementById('btn-time-attack').addEventListener('click', () => {
        initAudio(); playSound('click');
        pendingAction = 'time_attack';
        showScreen('difficulty');
    });

    document.getElementById('btn-weekly').addEventListener('click', () => {
        initAudio(); playSound('click');
        doScreenWipe(() => startWeeklyChallenge(), 'WEEKLY');
    });

    // Mirror mode toggle
    const mirrorBtn = document.getElementById('btn-mirror-toggle');
    if (mirrorBtn) {
        mirrorBtn.addEventListener('click', () => {
            playSound('click');
            mirrorMode = !mirrorMode;
            mirrorBtn.textContent = 'MIRROR: ' + (mirrorMode ? 'ON' : 'OFF');
        });
    }

    // Challenge mode
    const challengeBtn = document.getElementById('btn-challenge-mode');
    if (challengeBtn) {
        challengeBtn.addEventListener('click', () => {
            playSound('click');
            showScreen('challenge');
        });
    }
    const challengeToggles = ['challenge-nodash', 'challenge-invisible', 'challenge-speed', 'challenge-onehit', 'challenge-tiny'];
    const challengeKeys = ['noDash', 'invisiblePlatforms', 'doubleSpeed', 'oneHit', 'tinyPlayer'];
    challengeToggles.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => {
            playSound('click');
            challengeModifiers[challengeKeys[i]] = !challengeModifiers[challengeKeys[i]];
            el.textContent = challengeModifiers[challengeKeys[i]] ? 'ON' : 'OFF';
        });
    });
    const startChallengeBtn = document.getElementById('btn-start-challenge');
    if (startChallengeBtn) {
        startChallengeBtn.addEventListener('click', () => {
            playSound('click');
            startChallengeMode(0, challengeModifiers);
        });
    }
    const backChallengeBtn = document.getElementById('btn-back-challenge');
    if (backChallengeBtn) {
        backChallengeBtn.addEventListener('click', () => {
            playSound('click'); showScreen('difficulty');
        });
    }

    // Shop button
    document.getElementById('btn-shop').addEventListener('click', () => {
        playSound('click');
        populateShop();
        showScreen('shop');
    });
    const backShopBtn = document.getElementById('btn-back-shop');
    if (backShopBtn) {
        backShopBtn.addEventListener('click', () => {
            playSound('click'); showScreen('menu');
        });
    }

    // Skip level button
    const skipBtn = document.getElementById('death-skip-btn');
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            playSound('click');
            document.getElementById('death-overlay').classList.add('hidden');
            skipLevel();
        });
    }

    // QoL settings
    const qrBtn = document.getElementById('settings-quickrestart');
    if (qrBtn) {
        qrBtn.addEventListener('click', () => {
            playSound('click');
            quickRestart = !quickRestart;
            qrBtn.textContent = quickRestart ? 'ON' : 'OFF';
        });
    }
    const idBtn = document.getElementById('settings-inputdisplay');
    if (idBtn) {
        idBtn.addEventListener('click', () => {
            playSound('click');
            inputDisplayEnabled = !inputDisplayEnabled;
            idBtn.textContent = inputDisplayEnabled ? 'ON' : 'OFF';
        });
    }

    // Feature 27: One-hand mode
    const ohBtn = document.getElementById('settings-onehand');
    if (ohBtn) {
        ohBtn.textContent = oneHandMode ? 'ON' : 'OFF';
        ohBtn.addEventListener('click', () => {
            playSound('click');
            oneHandMode = !oneHandMode;
            ohBtn.textContent = oneHandMode ? 'ON' : 'OFF';
            saveProgression();
        });
    }

    // Feature 23: Editor export/import
    const exportBtn = document.getElementById('btn-export-level');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            playSound('click');
            exportEditorLevel();
        });
    }
    const importBtn = document.getElementById('btn-import-level');
    if (importBtn) {
        importBtn.addEventListener('click', () => {
            playSound('click');
            const code = prompt('Paste level code:');
            if (code && importEditorLevel(code)) {
                spawnFloatingText('LEVEL IMPORTED!', canvasW / 2, 60, '#00e5ff', 16);
            } else if (code) {
                alert('Invalid level code.');
            }
        });
    }

    // Cheat mode
    const cheatInput = document.getElementById('cheat-input');
    const cheatStatus = document.getElementById('cheat-status');
    const btnCheat = document.getElementById('btn-cheat');
    const maxFooter = document.getElementById('max-mode-footer');
    const maxInput = document.getElementById('max-input');
    const maxStatus = document.getElementById('max-status');
    const btnMax = document.getElementById('btn-max');
    if (btnCheat && cheatInput && cheatStatus) {
        const activateCheat = () => {
            const code = cheatInput.value.trim().toLowerCase();
            if (code === 'srg2') {
                cheatMode = true;
                autoPlay = true;
                maxMode = false;
                cheatStatus.textContent = 'VERIFIED';
                cheatStatus.className = 'cheat-status active';
                cheatInput.value = '';
                playSound('checkpoint');
                // Show max mode input
                if (maxFooter) maxFooter.style.display = '';
            } else if (code === 'saavan') {
                cheatInput.value = '';
                cheatStatus.textContent = '';
                cheatStatus.className = 'cheat-status';
                const gf = document.getElementById('guide-footer');
                if (gf) gf.style.display = '';
                playSound('checkpoint');
            } else if (code === '') {
                // do nothing
            } else {
                cheatMode = false;
                autoPlay = false;
                maxMode = false;
                cheatStatus.textContent = 'INVALID';
                cheatStatus.className = 'cheat-status wrong';
                if (maxFooter) maxFooter.style.display = 'none';
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
            e.stopPropagation();
        });
        cheatInput.addEventListener('keyup', (e) => e.stopPropagation());
    }
    // Max mode activation
    if (btnMax && maxInput && maxStatus) {
        const activateMax = () => {
            const code = maxInput.value.trim().toLowerCase();
            if (code === 'max' && cheatMode) {
                maxMode = true;
                autoPlay = true;
                maxStatus.textContent = 'MAX ON';
                maxStatus.className = 'cheat-status active';
                maxInput.value = '';
                playSound('checkpoint');
            } else if (code === 'off') {
                maxMode = false;
                maxStatus.textContent = 'MAX OFF';
                maxStatus.className = 'cheat-status';
                maxInput.value = '';
                setTimeout(() => { maxStatus.textContent = ''; }, 1500);
            } else if (code !== '') {
                maxStatus.textContent = 'INVALID';
                maxStatus.className = 'cheat-status wrong';
                setTimeout(() => { maxStatus.textContent = ''; maxStatus.className = 'cheat-status'; }, 1500);
            }
        };
        btnMax.addEventListener('click', () => {
            playSound('click');
            activateMax();
        });
        maxInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') activateMax();
            e.stopPropagation();
        });
        maxInput.addEventListener('keyup', (e) => e.stopPropagation());
    }

    // ============================================
    // NEW FEATURE EVENT LISTENERS (100 Features)
    // ============================================

    // --- Game Mode Buttons ---
    const modeBtn = (id, fn) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => { initAudio(); playSound('click'); fn(); });
    };

    modeBtn('btn-speedrun', () => { doScreenWipe(() => startSpeedrunMode(), 'SPEEDRUN'); });
    modeBtn('btn-gauntlet', () => { doScreenWipe(() => startGauntletMode(), 'GAUNTLET'); });
    modeBtn('btn-bossrush', () => { doScreenWipe(() => startBossRush(), 'BOSS RUSH'); });
    modeBtn('btn-zen', () => { doScreenWipe(() => startZenMode(0), 'ZEN MODE'); });
    modeBtn('btn-reverse', () => { doScreenWipe(() => startReverseMode(0), 'REVERSE'); });
    modeBtn('btn-relay', () => { showScreen('relay'); });
    modeBtn('btn-ghostrace', () => { doScreenWipe(() => startGhostRace(0), 'GHOST RACE'); });
    modeBtn('btn-ngplus', () => { doScreenWipe(() => startNGPlus(), 'NEW GAME+'); });
    modeBtn('btn-survival', () => { doScreenWipe(() => startSurvivalMode(0), 'SURVIVAL'); });

    // Puzzle mode
    const puzzleBtn = document.getElementById('btn-puzzle');
    if (puzzleBtn) {
        puzzleBtn.addEventListener('click', () => {
            playSound('click');
            populatePuzzleGrid();
            showScreen('puzzle');
        });
    }
    const backPuzzle = document.getElementById('btn-back-puzzle');
    if (backPuzzle) backPuzzle.addEventListener('click', () => { playSound('click'); showScreen('menu'); });

    // Relay start
    const startRelayBtn = document.getElementById('btn-start-relay');
    if (startRelayBtn) startRelayBtn.addEventListener('click', () => {
        initAudio(); playSound('click');
        doScreenWipe(() => startRelayMode(), 'RELAY');
    });
    const backRelay = document.getElementById('btn-back-relay');
    if (backRelay) backRelay.addEventListener('click', () => { playSound('click'); showScreen('menu'); });

    // --- Skill Tree Screen ---
    const skillTreeBtn = document.getElementById('btn-skilltree');
    if (skillTreeBtn) {
        skillTreeBtn.addEventListener('click', () => {
            playSound('click');
            populateSkillTree();
            showScreen('skilltree');
        });
    }
    const backSkillTree = document.getElementById('btn-back-skilltree');
    if (backSkillTree) backSkillTree.addEventListener('click', () => { playSound('click'); showScreen('menu'); });

    // Skill node clicks
    document.querySelectorAll('.skill-node').forEach(node => {
        node.addEventListener('click', () => {
            const skillId = node.dataset.skill;
            if (!skillId) return;
            if (unlockedSkills.includes(skillId)) return;
            if (getSkillPointsAvailable() <= 0) {
                spawnFloatingText('No skill points!', canvasW / 2, 80, '#ff4444', 14);
                return;
            }
            // Check branch prerequisites
            const branch = SKILL_TREE.find(b => b.skills.some(s => s.id === skillId));
            if (branch) {
                const idx = branch.skills.findIndex(s => s.id === skillId);
                if (idx > 0 && !unlockedSkills.includes(branch.skills[idx - 1].id)) {
                    spawnFloatingText('Unlock previous skill first!', canvasW / 2, 80, '#ffaa00', 14);
                    return;
                }
            }
            unlockedSkills.push(skillId);
            playSound('checkpoint');
            saveProgression();
            populateSkillTree();
        });
    });

    // --- Season Pass Screen ---
    const seasonBtn = document.getElementById('btn-seasonpass');
    if (seasonBtn) {
        seasonBtn.addEventListener('click', () => {
            playSound('click');
            populateSeasonPass();
            showScreen('seasonpass');
        });
    }
    const backSeason = document.getElementById('btn-back-seasonpass');
    if (backSeason) backSeason.addEventListener('click', () => { playSound('click'); showScreen('menu'); });

    // --- Keybindings Screen ---
    const keybindBtn = document.getElementById('btn-keybindings');
    if (keybindBtn) {
        keybindBtn.addEventListener('click', () => {
            playSound('click');
            populateKeybindings();
            showScreen('keybindings');
        });
    }
    const backKeybind = document.getElementById('btn-back-keybindings');
    if (backKeybind) backKeybind.addEventListener('click', () => { playSound('click'); showScreen('menu'); });

    const resetKeybind = document.getElementById('btn-reset-keybindings');
    if (resetKeybind) {
        resetKeybind.addEventListener('click', () => {
            playSound('click');
            // Reset to defaults
            keyBindings.left = ['a', 'ArrowLeft'];
            keyBindings.right = ['d', 'ArrowRight'];
            keyBindings.jump = ['w', 'ArrowUp', ' '];
            keyBindings.dash = ['Shift'];
            keyBindings.slide = ['s', 'ArrowDown'];
            keyBindings.climb = ['e'];
            keyBindings.slowmo = ['q'];
            keyBindings.grapple = ['g'];
            keyBindings.gravityFlip = ['g'];
            keyBindings.restart = ['r'];
            keyBindings.pause = ['Escape'];
            saveProgression();
            populateKeybindings();
        });
    }

    // --- New Settings Toggles ---
    const dyslexiaBtn = document.getElementById('settings-dyslexia');
    if (dyslexiaBtn) {
        dyslexiaBtn.textContent = dyslexiaFontEnabled ? 'ON' : 'OFF';
        dyslexiaBtn.addEventListener('click', () => {
            playSound('click');
            dyslexiaFontEnabled = !dyslexiaFontEnabled;
            dyslexiaBtn.textContent = dyslexiaFontEnabled ? 'ON' : 'OFF';
            document.body.classList.toggle('dyslexia-font', dyslexiaFontEnabled);
            saveProgression();
        });
    }

    const speedSlider = document.getElementById('settings-gamespeed');
    const speedLabel = document.getElementById('gamespeed-label');
    if (speedSlider) {
        speedSlider.value = Math.round(gameSpeedMultiplier * 100);
        if (speedLabel) speedLabel.textContent = Math.round(gameSpeedMultiplier * 100) + '%';
        speedSlider.addEventListener('input', () => {
            gameSpeedMultiplier = parseInt(speedSlider.value) / 100;
            if (speedLabel) speedLabel.textContent = speedSlider.value + '%';
            saveProgression();
        });
    }

    const autozoomBtn = document.getElementById('settings-autozoom');
    if (autozoomBtn) {
        autozoomBtn.textContent = autoCameraZoom ? 'ON' : 'OFF';
        autozoomBtn.addEventListener('click', () => {
            playSound('click');
            autoCameraZoom = !autoCameraZoom;
            autozoomBtn.textContent = autoCameraZoom ? 'ON' : 'OFF';
            saveProgression();
        });
    }

    // HUD toggles
    const hudToggleIds = ['timer', 'deaths', 'combo', 'dash'];
    hudToggleIds.forEach(key => {
        const btn = document.getElementById('hud-toggle-' + key);
        if (btn) {
            btn.textContent = hudToggles[key] !== false ? 'ON' : 'OFF';
            btn.addEventListener('click', () => {
                playSound('click');
                hudToggles[key] = !hudToggles[key];
                btn.textContent = hudToggles[key] ? 'ON' : 'OFF';
                // Apply visibility
                const el = document.getElementById('hud-' + key);
                if (el) el.style.display = hudToggles[key] ? '' : 'none';
                saveProgression();
            });
        }
    });

    // Custom skin screen
    const customSkinBtn = document.getElementById('btn-customskin');
    if (customSkinBtn) {
        customSkinBtn.addEventListener('click', () => {
            playSound('click');
            showScreen('customskin');
        });
    }
    const backCustomSkin = document.getElementById('btn-back-customskin');
    if (backCustomSkin) backCustomSkin.addEventListener('click', () => { playSound('click'); showScreen('shop'); });

    const saveCustomSkin = document.getElementById('btn-save-customskin');
    if (saveCustomSkin) {
        saveCustomSkin.addEventListener('click', () => {
            playSound('checkpoint');
            const bh = document.getElementById('skin-body-h');
            const bs = document.getElementById('skin-body-s');
            const bl = document.getElementById('skin-body-l');
            const hh = document.getElementById('skin-head-h');
            const hs = document.getElementById('skin-head-s');
            const hl = document.getElementById('skin-head-l');
            if (bh && bs && bl && hh && hs && hl) {
                customSkinColors.body = `hsl(${bh.value},${bs.value}%,${bl.value}%)`;
                customSkinColors.head = `hsl(${hh.value},${hs.value}%,${hl.value}%)`;
                customSkinColors.arm = customSkinColors.body;
                customSkinColors.leg = customSkinColors.body;
            }
            saveProgression();
            showScreen('shop');
        });
    }
}

// ---------- POPULATE NEW SCREENS ----------
function populateSkillTree() {
    const ptDisplay = document.getElementById('skill-points-display');
    if (ptDisplay) ptDisplay.textContent = 'Skill Points: ' + getSkillPointsAvailable();
    document.querySelectorAll('.skill-node').forEach(node => {
        const skillId = node.dataset.skill;
        node.classList.remove('unlocked', 'locked');
        if (unlockedSkills.includes(skillId)) {
            node.classList.add('unlocked');
        } else {
            // Check if prereq is met
            const branch = SKILL_TREE.find(b => b.skills.some(s => s.id === skillId));
            if (branch) {
                const idx = branch.skills.findIndex(s => s.id === skillId);
                if (idx > 0 && !unlockedSkills.includes(branch.skills[idx - 1].id)) {
                    node.classList.add('locked');
                }
            }
        }
    });
}

function populateSeasonPass() {
    const display = document.getElementById('season-xp-display');
    if (display) display.textContent = 'Season XP: ' + seasonPassXP + ' | Tier: ' + seasonPassTier + '/50';
    const track = document.getElementById('season-track');
    if (!track) return;
    track.innerHTML = '';
    const rewards = ['10 Orbs','Trail','20 Orbs','Hat','30 Orbs','Cape','40 Orbs','Jump FX','50 Orbs','Skin',
                     '15 Orbs','Land FX','25 Orbs','Eye Style','35 Orbs','Nameplate','45 Orbs','Title','55 Orbs','Death FX',
                     '20 Orbs','Trail','30 Orbs','Hat','40 Orbs','Cape','50 Orbs','Jump FX','60 Orbs','Skin',
                     '25 Orbs','Land FX','35 Orbs','Eye Style','45 Orbs','Nameplate','55 Orbs','Title','65 Orbs','Death FX',
                     '30 Orbs','Trail','40 Orbs','Hat','50 Orbs','Cape','60 Orbs','Jump FX','75 Orbs','LEGENDARY SKIN'];
    for (let i = 0; i < 50; i++) {
        const tier = document.createElement('div');
        tier.className = 'season-tier';
        if (i < seasonPassTier) tier.classList.add('claimed');
        if (i === seasonPassTier) tier.classList.add('current');
        tier.innerHTML = `<div class="season-tier-num">${i + 1}</div><div class="season-tier-reward">${rewards[i] || 'Reward'}</div>`;
        track.appendChild(tier);
    }
}

function populateKeybindings() {
    const list = document.getElementById('keybindings-list');
    if (!list) return;
    list.innerHTML = '';
    const actions = Object.keys(keyBindings);
    let listeningRow = null;
    actions.forEach(action => {
        const row = document.createElement('div');
        row.className = 'keybind-row';
        const label = document.createElement('span');
        label.className = 'keybind-action';
        label.textContent = action;
        const keyEl = document.createElement('span');
        keyEl.className = 'keybind-key';
        keyEl.textContent = keyBindings[action].map(k => k === ' ' ? 'SPACE' : k.toUpperCase()).join(' / ');
        keyEl.addEventListener('click', () => {
            if (listeningRow) {
                listeningRow.classList.remove('listening');
            }
            keyEl.classList.add('listening');
            listeningRow = keyEl;
            const handler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                keyBindings[action] = [e.key];
                keyEl.textContent = e.key === ' ' ? 'SPACE' : e.key.toUpperCase();
                keyEl.classList.remove('listening');
                listeningRow = null;
                document.removeEventListener('keydown', handler, true);
                saveProgression();
            };
            document.addEventListener('keydown', handler, true);
        });
        row.appendChild(label);
        row.appendChild(keyEl);
        list.appendChild(row);
    });
}

function populatePuzzleGrid() {
    const grid = document.getElementById('puzzle-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 0; i < PUZZLE_LEVELS.length; i++) {
        const btn = document.createElement('button');
        btn.className = 'level-btn';
        btn.textContent = 'Puzzle ' + (i + 1);
        btn.addEventListener('click', () => {
            initAudio(); playSound('click');
            doScreenWipe(() => startPuzzleMode(i), 'PUZZLE ' + (i + 1));
        });
        grid.appendChild(btn);
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
    initParallax();
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
