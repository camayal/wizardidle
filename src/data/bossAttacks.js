// Wizard Idle v2 - data module: boss attacks and scene spells (art by the artist, approved by the
// author on 2026-11-13; see src/ui/bossAttacks.js).
//
// Each boss has 2-3 attacks: img/bosses/<boss>/anim_<boss>_<attack>.png, found by name through art(), frames of 104 x 80 with the 64 x 64 boss
// resting at (36, 12). scene: a scene spell (img/effects/scene/scene_<spell>.png, 256 x 64 frames over the whole
// scene) that starts on boss frame sceneAt; path: scene px per frame for bosses that travel
// (negative = toward the wizard); wizard: what happens to him and on which frame.

export const bossAttacks = {
    infraespectro: [
        { id: "curse", frames: 10, scene: "curse", sceneAt: 2 },
        { id: "arcane_flare", frames: 10, scene: "arcane_flare", sceneAt: 2 },
        { id: "phase", frames: 11 },
    ],
    doria: [
        { id: "sonic_boom", frames: 10, scene: "sonic_boom", sceneAt: 3 },
        { id: "arcane_rain", frames: 10, scene: "arcane_rain", sceneAt: 2 },
        { id: "rune_circle", frames: 10, scene: "rune_circle", sceneAt: 2 },
    ],
    goro: [
        { id: "flurry", frames: 12 },
        { id: "slam", frames: 11 },
        { id: "charge", frames: 18, path: [0, 0, -20, -39, -59, -79, -98, -118, -118, -118, -114, -98, -79, -59, -39, -20, 0, 0] },
    ],
    kkck: [
        { id: "roll", frames: 22, path: [0, 0, 0, 0, -15, -30, -44, -59, -74, -88, -103, -118, -118, -94, -71, -47, -24, 0, 0, 0, 0, 0] },
        { id: "poison_cloud", frames: 10, scene: "poison_cloud", sceneAt: 2 },
    ],
    protromus: [
        { id: "earth_spikes", frames: 11, scene: "earth_spikes", sceneAt: 6 },
        { id: "ground_punch", frames: 9, scene: "earthquake", sceneAt: 4 },
    ],
    bicaptop: [
        { id: "slam", frames: 11 },
        { id: "charge", frames: 18, path: [0, 0, -20, -39, -59, -79, -98, -118, -118, -118, -114, -98, -79, -59, -39, -20, 0, 0] },
        { id: "roar", frames: 10 },
    ],
    midas: [
        { id: "golden_touch", frames: 10, scene: "golden_touch", sceneAt: 2 },
        { id: "rainbow_orbs", frames: 10, scene: "rainbow_orbs", sceneAt: 3 },
        { id: "golden_rays", frames: 10, scene: "golden_rays", sceneAt: 2 },
    ],
    herbus: [
        { id: "vines", frames: 11, scene: "entangling_vines", sceneAt: 2 },
        { id: "spores", frames: 10, scene: "spore_storm", sceneAt: 2 },
    ],
    cuboq: [
        { id: "spit", frames: 7, scene: "slime_spit", sceneAt: 4 },
        { id: "bounce", frames: 20 },
    ],
    skeleton: [
        { id: "great_slash", frames: 19, path: [0, 0, -19, -37, -56, -75, -93, -112, -112, -114, -114, -112, -93, -75, -56, -37, -19, 0, 0] },
        { id: "curse", frames: 10, scene: "curse", sceneAt: 2 },
        { id: "arcane_rain", frames: 10, scene: "arcane_rain", sceneAt: 2 },
    ],
    rainbow: [
        { id: "blizzard", frames: 10, scene: "blizzard", sceneAt: 2 },
        { id: "ice_spikes", frames: 11, scene: "ice_spikes", sceneAt: 3 },
    ],
    fenix: [
        { id: "wing_flap", frames: 10, scene: "fire_tornado", sceneAt: 3 },
        { id: "fire_breath", frames: 10, scene: "fire_breath", sceneAt: 3 },
        { id: "flame_pillar", frames: 10, scene: "flame_pillar", sceneAt: 3 },
    ],
    medusa: [
        { id: "gaze", frames: 10, scene: "petrify_gaze", sceneAt: 1, wizard: ["petrify", 7] },
        { id: "poison_strike", frames: 7, scene: "poison_dart", sceneAt: 3 },
    ],
    // the beach couple (placeholder strips and scenes until the artist draws them)
    lamia: [
        { id: "maelstrom", frames: 10, scene: "maelstrom", sceneAt: 2 },
        { id: "tidal_wave", frames: 10, scene: "tidal_wave", sceneAt: 2 },
        { id: "serpent_gaze", frames: 10 },
    ],
    greater_naga: [
        { id: "tide_charge", frames: 18, scene: "tide_charge", sceneAt: 2, path: [0, 0, -20, -39, -59, -79, -98, -118, -118, -118, -114, -98, -79, -59, -39, -20, 0, 0] },
        { id: "fury_slaps", frames: 12, hit: 6, path: [0, -30, -80, -118, -118, -118, -118, -118, -118, -90, -45, 0] },      // jumps to the wizard, spins like a tornado
        { id: "coil_crush", frames: 11, hit: 6, path: [0, -30, -70, -118, -118, -118, -118, -118, -80, -40, 0] },      // approaches, flips, stretches the tail
    ],
    arcangel: [
        { id: "lightning", frames: 10, scene: "lightning", sceneAt: 2 },
        { id: "golden_storm", frames: 10, scene: "golden_storm", sceneAt: 2 },
    ],
    etymos: [
        { id: "orb_pulse", frames: 10, scene: "prism_pulse", sceneAt: 1 },
        { id: "colour_burst", frames: 10, scene: "colour_burst", sceneAt: 2 },
    ],
    rojo: [
        { id: "flaming_punch", frames: 7, scene: "fire_fist", sceneAt: 3 },
        { id: "fire_rain", frames: 10, scene: "fire_rain", sceneAt: 2 },
        { id: "slam", frames: 11, scene: "fire_peak", sceneAt: 6 },
    ],
};

// The sounds of the boss moves, at their own moment: "boss.attack" -> [[sound, ms from the first frame, volume], ...]
// (approved by the author, docs/SOUNDS.md). Volume is 0.3 unless given. The landing keeps the spell's own sound.
export const attackSounds = {
    "protromus.ground_punch": [["thud", 400], ["rumble", 400]],
    "kkck.roll": [["rock_roll", 400]],
    "bicaptop.roar": [["roar", 200]], "bicaptop.charge": [["hooves", 200, 1]], "bicaptop.slam": [["rock_smash", 600]],
    "cuboq.bounce": [["bounce", 0]],
    "infraespectro.curse": [["curse", 200, 1]],
    "doria.sonic_boom": [["sonic_boom", 0]], "doria.rune_circle": [["rune_circle", 0]],
    "midas.rainbow_orbs": [["midas_orbs", 0]], "midas.golden_rays": [["midas_rays", 0]], "midas.golden_touch": [["midas_touch", 0]],
    "rojo.slam": [["rojo_slam", 0]], "rojo.flaming_punch": [["rojo_punch", 0]], "rojo.fire_rain": [["rojo_fire_rain", 0]],
    "cuboq.spit": [["cuboq_spit", 0]],
    "skeleton.great_slash": [["skeleton_slash", 740]], "skeleton.curse": [["skeleton_curse", -1140]],
    "rainbow.ice_spikes": [["ice_spikes", 0]], "rainbow.blizzard": [["blizzard", 0]],
    "fenix.fire_breath": [["fire_breath", 0]], "fenix.wing_flap": [["wing_flap", 0]], "fenix.flame_pillar": [["flame_pillar", 0]],
    "protromus.earth_spikes": [["earth_spikes", 0, 0.82]],
    "goro.flurry": [["goro_flurry", 0]], "goro.slam": [["thud", 0]], "goro.charge": [["goro_charge", 0]],
    "infraespectro.arcane_flare": [["arcane_flare", 0]], "infraespectro.phase": [["phase", 0]],
    "herbus.vines": [["vines", 0]], "herbus.spores": [["spores", -360]],
    "arcangel.lightning": [["lightning", 0]],
    "etymos.orb_pulse": [["prism_pulse", 0]], "etymos.colour_burst": [["colour_burst", 250]],
};

// Moves whose landing spell stays silent (the author muted its school sound while approving the move's own).
export const mutedLanding = new Set(["midas.golden_rays", "skeleton.curse"]);

// Frames of each scene spell (256 x 64 each). Some are not used by bosses yet (story, powers).
export const sceneSpells = {
    frost_breath: 16,
    earth_spikes: 16, ice_spikes: 16, arcane_flare: 16, sonic_boom: 14,
    rune_circle: 16, poison_cloud: 16, golden_touch: 18, rainbow_orbs: 18,
    golden_rays: 18, spore_storm: 16, slime_spit: 14, curse: 22,
    fire_tornado: 18, fire_breath: 16, petrify_gaze: 18, poison_dart: 15,
    golden_storm: 16, prism_pulse: 18, colour_burst: 16, fire_fist: 14,
    maelstrom: 16, tidal_wave: 16, tide_charge: 16, fire_peak: 14, fire_rain: 16, arcane_rain: 16, poison_rain: 16,
    lightning: 14, blizzard: 16, flame_pillar: 15, meteor_shower: 20,
    earthquake: 16, divine_light: 16, eclipse: 18, sandstorm: 16,
    whirlwind: 18, healing_rain: 18, entangling_vines: 16,
};
