import { globalType, playerType } from './Types';

export const player = {} as playerType; //Only for information that need to be saved

export const global: globalType = { //Only some information is saved across
    tab: 'stage',
    stage: {
        word: ['Microworld', 'Submerged'],
        wordColor: ['#03d3d3', 'dodgerblue']
    },
    theme: {
        stage: 1,
        default: true
    },
    footer: true,
    /* Add buildings cost into global, add true levels into player */
    intervals: { //Move into player (?)
        main: 1000, //Min 20 max 1000, default 50
        numbers: 1000,
        visual: 1000, //Min 500 max 10000
        autoSave: 300000 //Min 120000 Max 1800000
    },
    intervalsId: {
        main: 0,
        numbers: 0,
        visual: 0,
        autoSave: 0
    },
    lastSave: 0,
    upgradesInfo: {
        description: [],
        effect: [],
        effectText: [],
        cost: []
    },
    upgradesWInfo: {
        description: [],
        effect: [],
        effectText: [],
        cost: []
    }
};

function AddResource(name: string, current = 0) { //Not a class, because no
    name === 'time' ?
        Object.assign(player, { [name]: { current, lastUpdate: current, started: current } }) :
        Object.assign(player, { [name]: { current, total: current } });
}

function AddMainBuilding(cost: number, type = 'building', current = 0) {
    if (type === 'building') {
        player.buildings.push({ cost, current, true: current, total: current, producing: 0 });
    } else {
        player.buildings.push({ current: cost, total: cost });
    }
}

function AddUpgradeArray(name: keyof playerType, cost: number[], effect: number[], description: string[], effectText: string[][]) {
    Object.assign(player, { [name]: createArray(cost.length) });
    Object.assign(global, { [name + 'Info']: { description, cost, effect, effectText } });
}

const createArray = (amount: number, type = 'number') => {
    const array = [];
    for (let i = 1; i <= amount; i++) {
        if (type === 'number') {
            array.push(0);
        } else {
            array.push(true);
        }
    }
    return array;
};

Object.assign(player, { stage: 1 });
const togglesL = document.getElementsByClassName('toggle').length;
Object.assign(player, { toggles: createArray(togglesL, 'boolean') });
AddResource('energy');
AddResource('time', Date.now());
Object.assign(player, { buildings: [] });
AddMainBuilding(3, 'Resource'); //Quarks
AddMainBuilding(3); //Particles
AddMainBuilding(24); //Atoms
AddMainBuilding(3); //Molecules
AddUpgradeArray('upgrades',
    [9, 12, 16, 500], //Cost
    [10, 10, 5, 2], //Effect, for now only visual
    [
        'Bigger electrons. Particles cost decreased.',
        'Stronger protons. Particles produce more.',
        'More neutrons. Increased particle gain.',
        'Superposition. Allows to spend energy to boost.'
    ], [ //For now this will be [0] + effect + [1]
        ['Particle cost is ', ' times cheaper.'],
        ['Particles produce ', ' times more quarks.'],
        ['Atoms produce ', ' times more particles.'],
        ['Each boost gives ', ' times production for all buildings.']
    ]);
AddUpgradeArray('upgradesW',
    [1e21],
    [4],
    [
        'A single drop of water. Unlocks new building.'
    ], [
        ['Unlocks new building and ', ' new upgrades.']
    ]);
export const playerStart = structuredClone(player);
export const globalStart = structuredClone(global);
