import { checkUpgradeReset } from './Check';
import { player, playerStart } from './Player';
import { autoUpgradesSet, calculateBuildingsCost, calculateMaxLevel, calculateResearchCost, calculateStageInformation } from './Stage';
import { numbersUpdate, visualUpdate, visualUpdateUpgrades } from './Update';

export const reset = (type: 'discharge' | 'vaporization' | 'rank' | 'collapse' | 'stage', stageIndex: number[]) => {
    if (type !== 'stage') {
        const { buildings } = player;

        if (type === 'discharge') {
            player.discharge.energyCur = 0;
        } else if (type === 'collapse' && player.strangeness[4][4] < 1) {
            for (let i = 1; i < player.elements.length; i++) {
                player.elements[i] = 0;
                visualUpdateUpgrades(i, 4, 'elements');
            }
        }

        for (const s of stageIndex) {
            //Label here, so we can break out of this block straight into cost calculation section
            noCostReset: {
                buildings[s][0].current = playerStart.buildings[s][0].current;
                buildings[s][0].total = playerStart.buildings[s][0].total;
                for (let i = 1; i < playerStart.buildings[s].length; i++) {
                    buildings[s][i].current = 0;
                    buildings[s][i].true = 0;
                    buildings[s][i].total = 0;
                }

                if (type === 'discharge') { break noCostReset; }

                for (let i = 0; i < playerStart.upgrades[s].length; i++) {
                    if (!checkUpgradeReset(i, s, 'upgrades')) { continue; }

                    player.upgrades[s][i] = 0;
                    visualUpdateUpgrades(i, s, 'upgrades');
                }

                if (type === 'vaporization') { break noCostReset; }

                for (let i = 0; i < playerStart.researches[s].length; i++) {
                    //if (!checkUpgradeReset(i, s, 'researches')) { continue; }

                    player.researches[s][i] = 0;
                    visualUpdateUpgrades(i, s, 'researches');
                }

                if (type === 'rank') { break noCostReset; }

                for (let i = 0; i < playerStart.researchesExtra[s].length; i++) {
                    if (!checkUpgradeReset(i, s, 'researchesExtra')) { continue; }

                    player.researchesExtra[s][i] = 0;
                    visualUpdateUpgrades(i, s, 'researchesExtra');
                }
            }

            //Doing it this way mostly just helps for first building cost being wrong (but can help in future against order bugs)
            for (let i = 1; i < playerStart.buildings[s].length; i++) { calculateBuildingsCost(i, s); }

            if (type === 'discharge') { continue; }

            autoUpgradesSet('upgrades', s);

            if (type === 'vaporization') { continue; }

            for (let i = 0; i < playerStart.researches[s].length; i++) { calculateResearchCost(i, s, 'researches'); }
            autoUpgradesSet('researches', s);

            if (type === 'rank') { continue; }

            for (let i = 0; i < playerStart.researchesExtra[s].length; i++) { calculateResearchCost(i, s, 'researchesExtra'); }
            autoUpgradesSet('researchesExtra', s);
        }

        visualUpdate();
    } else { //Stage reset only
        for (const s of stageIndex) {
            for (let i = 0; i < playerStart.buildings[s].length; i++) {
                player.buildings[s][i] = { ...playerStart.buildings[s][i] };
            }
            player.upgrades[s] = [...playerStart.upgrades[s]];
            player.researches[s] = [...playerStart.researches[s]];
            player.researchesExtra[s] = [...playerStart.researchesExtra[s]];

            if (s === 1) {
                player.discharge.energyCur = 0;
                player.discharge.energyMax = 0;
                player.discharge.current = 0;
            } else if (s === 2) {
                player.vaporization.clouds = 1;
            } else if (s === 3) {
                player.accretion.rank = 0;
                player.buildings[3][0].current = 5.97e27;
            } else if (s === 4) {
                player.collapse.mass = 0.01235;
                player.collapse.stars = [0, 0, 0];
                player.collapse.show = -1;
                player.elements = [...playerStart.elements];
            }

            player.ASR[s] = s !== 5 ? player.strangeness[s][[6, 5, 5, 6][s - 1]] : 0; //Temporary fix
            calculateResearchCost(0, s, 'ASR');

            for (let i = 1; i < playerStart.buildings[s].length; i++) { calculateBuildingsCost(i, s); }
            for (let i = 0; i < playerStart.researches[s].length; i++) { calculateMaxLevel(i, s, 'researches'); }
            for (let i = 0; i < playerStart.researchesExtra[s].length; i++) { calculateMaxLevel(i, s, 'researchesExtra'); }

            autoUpgradesSet('upgrades', s);
            autoUpgradesSet('researches', s); //They need cost updated first
            autoUpgradesSet('researchesExtra', s);
        }
    }

    calculateStageInformation(); //Without it, there will be bugs
    numbersUpdate();
};
