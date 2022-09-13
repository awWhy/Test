import { getId } from './Main';
import { global, globalStart, player, playerStart } from './Player';
import { buyBuilding, calculateBuildingsCost, calculateGainedBuildings, calculateResearchCost } from './Stage';

export const switchTab = (tab = 'none') => {
    if (global.tab !== tab) {
        getId('stageTab').style.display = 'none';
        getId('stageTabBtn').style.borderColor = '';
        getId('researchTab').style.display = 'none';
        getId('researchTabBtn').style.borderColor = '';
        getId('settingsTab').style.display = 'none';
        getId('settingsTabBtn').style.borderColor = '';
        const color = ['#e3e3e3', '#a10000'][global.theme.stage - 1];
        const invText = getId('invisibleTab'); //For screen readers, always turned on, to let screen reader user get to settings tab easier
        getId('specialTab').style.display = 'none';

        if (tab !== 'none') {
            global.tab = tab;
        } else {
            global.tab = 'stage';
        }

        getId(`${global.tab}Tab`).style.display = '';
        getId(`${global.tab}TabBtn`).style.borderColor = color;
        invText.textContent = `Current tab: ${global.tab} tab`;
        visualUpdate();
        numbersUpdate();
    }
};

export const invisibleUpdate = () => { //This is only for important or time based info
    const { stage, time, buildings, upgrades, researches, researchesAuto, toggles } = player;
    const { buildingsInfo } = global;

    const passedTime = Date.now() - time.updated;
    let passedSeconds = passedTime / 1000;
    time.updated = Date.now();
    if (passedTime < 0) {
        return console.warn('Negative passed time detected.');
    }
    global.lastSave += passedTime;
    if (passedSeconds > 3600) {
        passedSeconds = 3600;
        console.log('Max offline progress is 1 hour.');
    }

    if (stage.current === 1) {
        const { discharge } = player;
        const { upgradesInfo } = global;

        if (toggles[6] && researchesAuto[1] >= 3) { buyBuilding(buildings, 3, true); }
        buildingsInfo.producing[3] = 0.3 * buildings[3].current * upgradesInfo.effect[3] ** discharge.current;
        if (upgrades[5] === 1) { buildingsInfo.producing[3] *= upgradesInfo.effect[5] ** buildings[3].true; }
        calculateGainedBuildings(2, passedSeconds);

        upgradesInfo.effect[5] = Math.trunc((1.02 + 0.01 * researches[1]) * 100) / 100;
        upgradesInfo.effect[3] = 4 + 1 * researches[3];
        if (upgrades[6] === 1) { calculateGainedBuildings(3, passedSeconds); }

        if (toggles[5] && researchesAuto[1] >= 2) { buyBuilding(buildings, 2, true); }
        buildingsInfo.producing[2] = 0.4 * buildings[2].current * upgradesInfo.effect[3] ** discharge.current;
        if (upgrades[2] === 1) { buildingsInfo.producing[2] *= 5; }
        if (upgrades[5] === 1) { buildingsInfo.producing[2] *= upgradesInfo.effect[5] ** buildings[2].true; }
        calculateGainedBuildings(1, passedSeconds);

        if (toggles[4] && researchesAuto[1] >= 1) { buyBuilding(buildings, 1, true); }
        buildingsInfo.producing[1] = 0.5 * buildings[1].current * upgradesInfo.effect[3] ** discharge.current;
        if (upgrades[1] === 1) { buildingsInfo.producing[1] *= 10; }
        if (upgrades[5] === 1) { buildingsInfo.producing[1] *= upgradesInfo.effect[5] ** buildings[1].true; }
        calculateGainedBuildings(0, passedSeconds);
    } else if (stage.current === 2) {
        //const { upgradesS2Info } = global;

        buildingsInfo.producing[1] = 0.0004 * buildings[1].current;
        calculateGainedBuildings(0, passedSeconds);
    }
};

export const numbersUpdate = () => { //This is for relevant visual info
    const { stage, buildings, upgrades } = player;
    const { tab, buildingsInfo } = global;

    if (global.footer) {
        if (stage.current === 1) {
            getId('quarks').textContent = `Quarks: ${format(buildings[0].current)}`;
            if (player.energy.total >= 9) { getId('energy').textContent = `Energy: ${format(player.energy.current, 0)}`; }
        } else if (stage.current === 2) {
            getId('water').textContent = `Moles: ${format(buildings[0].current, 4)}`;
        }
    }
    if (tab === 'stage') {
        getId('building1Cur').textContent = format(buildings[1].current);
        getId('building1Prod').textContent = format(buildingsInfo.producing[1]);
        if (stage.current === 1) {
            if (buildingsInfo.cost[1] <= buildings[0].current) {
                getId('building1Btn').classList.add('availableBuilding');
                getId('building1Btn').textContent = `Buy for: ${format(buildingsInfo.cost[1])} Quarks`;
            } else {
                getId('building1Btn').classList.remove('availableBuilding');
                getId('building1Btn').textContent = `Need: ${format(buildingsInfo.cost[1])} Quarks`;
            }
            if (buildings[1].total >= 11) {
                getId('building2Cur').textContent = format(buildings[2].current);
                getId('building2Prod').textContent = format(buildingsInfo.producing[2]);
                if (buildingsInfo.cost[2] <= buildings[1].current) {
                    getId('building2Btn').classList.add('availableBuilding');
                    getId('building2Btn').textContent = `Buy for: ${format(buildingsInfo.cost[2])} Particles`;
                } else {
                    getId('building2Btn').classList.remove('availableBuilding');
                    getId('building2Btn').textContent = `Need: ${format(buildingsInfo.cost[2])} Particles`;
                }
            }
            if (buildings[2].total >= 2) {
                getId('building3Cur').textContent = format(buildings[3].current);
                getId('building3Prod').textContent = format(buildingsInfo.producing[3]);
                if (buildingsInfo.cost[3] <= buildings[2].current) {
                    getId('building3Btn').classList.add('availableBuilding');
                    getId('building3Btn').textContent = `Buy for: ${format(buildingsInfo.cost[3])} Atoms`;
                } else {
                    getId('building3Btn').classList.remove('availableBuilding');
                    getId('building3Btn').textContent = `Need: ${format(buildingsInfo.cost[3])} Atoms`;
                }
            }
            if (upgrades[3] === 1) {
                getId('dischargeReset').textContent = `Next goal is ${format(global.dischargeInfo.next, 0)} Energy`;
                getId('dischargeEffect').textContent = String(global.upgradesInfo.effect[3]);
            }
        } else if (stage.current === 2) {
            if (buildingsInfo.cost[1] <= buildings[0].current) {
                getId('building1Btn').classList.add('availableBuilding');
                getId('building1Btn').textContent = `Buy for: ${format(buildingsInfo.cost[1], 4)} Moles`;
            } else {
                getId('building1Btn').classList.remove('availableBuilding');
                getId('building1Btn').textContent = `Need: ${format(buildingsInfo.cost[1], 4)} Moles`;
            }
        }
    } else if (tab === 'settings') {
        if (global.lastSave >= 1000) { getId('isSaved').textContent = `${format(global.lastSave, 0, 'time')} ago`; }
    }
};

export const visualUpdate = () => { //This is everything that can be shown later
    const { stage, buildings, upgrades, researchesAuto } = player;

    /* They are going to be hidden with stageCheck(); */
    if (stage.current === 1) {
        const { energy, discharge } = player;

        getId('energyStat').style.display = energy.total >= 9 ? '' : 'none';
        getId('building2').style.display = buildings[1].total >= 11 ? '' : 'none';
        getId('building3').style.display = buildings[2].total >= 2 ? '' : 'none';
        if (energy.total >= 9) { getId('upgrades').style.display = ''; }
        getId('discharge').style.display = upgrades[3] > 0 ? '' : 'none';
        if (discharge.current >= 1) { getId('resetToggles').style.display = ''; }
        for (let i = 5; i <= 8; i++) {
            if (discharge.current >= 3) {
                getId(`upgrade${i}`).style.display = '';
            } else {
                getId(`upgrade${i}`).style.display = 'none';
            }
        }
        if (discharge.current >= 4) { getId('researchTabBtn').style.display = ''; }
        if (upgrades[7] === 1) { getId('stage').style.display = ''; }
        if (buildings[3].current >= 1e21) { getId('stageReset').textContent = 'Enter next stage'; }
        if (global.screenReader) {
            getId('invisibleGetBuilding2').style.display = buildings[2].total > 0 ? '' : 'none';
            getId('invisibleGetBuilding3').style.display = buildings[3].total > 0 ? '' : 'none';
        }
    }
    for (let i = 1; i < playerStart.buildings.length; i++) {
        if (researchesAuto[1] >= i) {
            getId(`toggle${i + 3}`).style.display = '';
        } else {
            getId(`toggle${i + 3}`).style.display = 'none';
        }
    }
    getId('toggleBuy').style.display = researchesAuto[0] > 0 ? '' : 'none';
};

export const getUpgradeDescription = (index: number, type = 'upgrade' as 'upgrade' | 'research' | 'researchAuto') => {
    const { stage } = player;
    const { stageInfo } = global;

    switch (type) {
        case 'upgrade': {
            const { upgrades } = player;

            if (stage.current === 1) {
                const { upgradesInfo } = global;
                getId('upgradeText').textContent = upgradesInfo.description[index];
                getId('upgradeEffect').textContent = `${upgradesInfo.effectText[index][0]}${upgradesInfo.effect[index]}${upgradesInfo.effectText[index][1]}`;
                getId('upgradeCost').textContent = `${upgrades[index] === 1 ? 0 : upgradesInfo.cost[index]} ${stageInfo.resourceName[stage.current - 1]}.`;
            }
            break;
        }
        case 'research': {
            const { researches } = player;

            if (stage.current === 1) {
                const { researchesInfo } = global;
                getId('researchText').textContent = researchesInfo.description[index];
                getId('researchEffect').textContent = `${researchesInfo.effectText[index][0]}${researchesInfo.effect[index]}${researchesInfo.effectText[index][1]}`;
                getId('researchCost').textContent = `${researches[index] === researchesInfo.max[index] ? 0 : researchesInfo.cost[index]} ${stageInfo.resourceName[stage.current - 1]}.`;
            }
            break;
        }
        case 'researchAuto': {
            const { researchesAuto } = player;
            const { researchesAutoInfo } = global;

            getId('researchText').textContent = researchesAutoInfo.description[index];
            if (index === 1) {
                researchesAutoInfo.effect[1] = global.buildingsInfo.name[Math.min(researchesAuto[1] + 1, global.buildingsInfo.name.length - 1)];
            }
            getId('researchEffect').textContent = `${researchesAutoInfo.effectText[index][0]}${researchesAutoInfo.effect[index]}${researchesAutoInfo.effectText[index][1]}`;
            getId('researchCost').textContent = `${researchesAuto[index] === researchesAutoInfo.max[index] ? 0 : researchesAutoInfo.cost[index]} ${stageInfo.resourceName[stage.current - 1]}.`;
            break;
        }
    }
};

export const format = (input: number, precision = input < 1e3 ? 2 : 0, type = 'number' as 'number' | 'time') => {
    switch (type) {
        case 'number':
            if (player.stage.current === 2 && precision === 4 && input >= 1e3) { precision = 0; } //Temporary solution
            if (precision > 0 && input < 1e6) {
                return String(Math.trunc(input * (10 ** precision)) / (10 ** precision)); //For fake numbers
            } else if (precision <= 0 && input < 1e6) {
                return String(Math.trunc(input));
            } else { //Format instead if number is bigger than 1e6
                const digits = Math.trunc(Math.log10(input));
                return `${Math.trunc((input / 10 ** (digits)) * 100) / 100}e${digits}`;
            }
        case 'time': //I don't fully know how to make hours:minutes:seconds, or if even needed
            if (input >= 172800000) {
                return `${Math.trunc(input / 86400000)} days`;
            } else if (input >= 7200000) {
                return `${Math.trunc(input / 3600000)} hours`;
            } else if (input >= 600000) {
                return `${Math.trunc(input / 60000)} minutes`;
            } else {
                return `${Math.trunc(input / 1000)} seconds`;
            }
    }
};

export const stageCheck = () => {
    const { stage, upgrades, researches, researchesAuto } = player;
    const { stageInfo, buildingsInfo, researchesAutoInfo } = global;
    const body = document.body.style;

    /* Stage specific information */
    getId('upgradeCost').classList.remove('orangeText', 'cyanText'); //First remove all classes from stage specific colors
    getId('researchCost').classList.remove('orangeText', 'cyanText');
    for (let i = 2; i < playerStart.buildings.length; i++) {
        getId(`building${i}`).style.display = 'none'; //Hide all buildings past 1
    }

    if (stage.current === 1) {
        const { upgradesInfo, researchesInfo } = global;

        buildingsInfo.name = ['Quarks', 'Particles', 'Atoms', 'Molecules']; //Assign new constants
        globalStart.buildingsInfo.cost = [0, 3, 24, 3];
        global.dischargeInfo.next = 10 ** player.discharge.current; //Calculate stage specific part's
        getId('upgradeCost').classList.add('orangeText'); //Add colors
        getId('researchCost').classList.add('orangeText');
        for (let i = 0; i < upgradesInfo.cost.length; i++) {
            if (upgrades[i] === 1) {
                getId(`upgrade${[i + 1]}`).style.backgroundColor = 'green';
            } else {
                getId(`upgrade${[i + 1]}`).style.backgroundColor = '';
            }
        }
        for (let i = 0; i < researchesInfo.cost.length; i++) {
            getId(`research${i + 1}Stage1Level`).textContent = String(researches[i]);
            getId(`research${i + 1}Stage1Level`).classList.remove('redText', 'orchidText', 'greenText');
            calculateResearchCost(i, 'researches');
            if (researches[i] === researchesInfo.max[i]) {
                getId(`research${i + 1}Stage1Level`).classList.add('greenText');
            } else if (researches[i] === 0) {
                getId(`research${i + 1}Stage1Level`).classList.add('redText');
            } else {
                getId(`research${i + 1}Stage1Level`).classList.add('orchidText');
            }
        }
        getId('quarkStat').style.display = ''; //Show required parts
        getId('particles').style.display = '';
        getId('atoms').style.display = '';
        getId('molecules').style.display = '';
        getId('dischargeToggleReset').style.display = '';
        for (let i = 1; i <= 4; i++) {
            getId(`upgrade${i}`).style.display = '';
        }
        for (let i = 1; i <= researchesInfo.cost.length; i++) {
            getId(`research${i}Stage1`).style.display = '';
        }
        if (stage.true === 1) { //Overall progress check
            getId('upgrades').style.display = 'none';
            getId('resetToggles').style.display = 'none';
            getId('researchTabBtn').style.display = 'none';
            getId('stage').style.display = 'none';
            getId('stageToggleReset').style.display = 'none';
            getId('themeArea').style.display = 'none';
        }
    } else if (stage.current === 2) {
        buildingsInfo.name = ['Moles of water', 'Drops'];
        globalStart.buildingsInfo.cost = [0, 0.0025];
        getId('upgradeCost').classList.add('cyanText');
        getId('researchCost').classList.add('cyanText');
        getId('waterStat').style.display = '';
        getId('drops').style.display = '';
    }

    for (let i = 1; i < buildingsInfo.name.length; i++) { //Calculate building specific information based of current stage
        getId(`building${i}Name`).textContent = buildingsInfo.name[i];
        calculateBuildingsCost(i);
    }
    researchesAutoInfo.max[1] = buildingsInfo.name.length - 1; //Research for auto buying is always equal to that
    for (let i = 0; i < researchesAutoInfo.cost.length; i++) {
        getId(`researchAuto${i + 1}Level`).textContent = String(researchesAuto[i]);
        getId(`researchAuto${i + 1}Level`).classList.remove('redText', 'orchidText', 'greenText');
        calculateResearchCost(i, 'researchesAuto');
        if (researchesAuto[i] === researchesAutoInfo.max[i]) {
            getId(`researchAuto${i + 1}Level`).classList.add('greenText');
        } else if (researchesAuto[i] === 0) {
            getId(`researchAuto${i + 1}Level`).classList.add('redText');
        } else {
            getId(`researchAuto${i + 1}Level`).classList.add('orchidText');
        }
    }
    getId('researchAuto2Max').textContent = String(researchesAutoInfo.max[1]);

    /* Hide stage specific part's, if stage isn't that one */
    if (stage.current !== 1) {
        getId('quarkStat').style.display = 'none';
        getId('energyStat').style.display = 'none';
        getId('particles').style.display = 'none';
        getId('atoms').style.display = 'none';
        getId('molecules').style.display = 'none';
        getId('discharge').style.display = 'none';
        getId('dischargeToggleReset').style.display = 'none';
        for (let i = 1; i <= global.upgradesInfo.cost.length; i++) {
            getId(`upgrade${i}`).style.display = 'none';
        }
        for (let i = 1; i <= global.researchesInfo.cost.length; i++) {
            getId(`research${i}Stage1`).style.display = 'none';
        }
    }
    if (stage.current !== 2) {
        getId('waterStat').style.display = 'none';
        getId('drops').style.display = 'none';
    }
    if (stage.true > 1) {
        getId('upgrades').style.display = '';
        getId('resetToggles').style.display = '';
        getId('researchTabBtn').style.display = '';
        getId('stage').style.display = '';
        getId('stageToggleReset').style.display = '';
        getId('themeArea').style.display = '';
    }

    /* Visual */
    getId('stageReset').textContent = 'You are not ready';
    getId('stageWord').textContent = stageInfo.word[stage.current - 1];
    if (stage.current === 1) {
        body.removeProperty('--border-image');
        body.removeProperty('--border-stage');
        body.removeProperty('--stage-text-color');
    } else {
        body.setProperty('--border-image', `url(Used_art/Stage${stage.current}%20border.png)`);
        if (stage.current === 2) {
            body.setProperty('--border-stage', '#1460a8');
            body.setProperty('--stage-text-color', 'dodgerblue');
        }
    }
    if (global.screenReader) {
        getId('invisibleBought').textContent = `Current stage is '${stageInfo.word[stage.current - 1]}'`;
        getId('invisibleGetResource1').style.display = stage.current === 1 ? '' : 'none'; //As of now only stage 1 need that button
        for (let i = 2; i < playerStart.buildings.length; i++) {
            getId(`invisibleGetBuilding${i}`).style.display = 'none';
        }
        for (let i = 0; i < buildingsInfo.name.length; i++) {
            getId(`invisibleGetBuilding${i}`).textContent = `Get information for ${buildingsInfo.name[i]}`;
        }
    }
};
