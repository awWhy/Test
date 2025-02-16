import { assignHotkeys, removeHotkey } from './Hotkeys';
import { getId, getQuery, globalSaveStart, LOCAL_STORAGE_SETTINGS_INDEX, pauseGame } from './Main';
import { deepClone, global, player } from './Player';
import { assignResetInformation } from './Stage';
import type { globalSaveType, hotkeysList } from './Types';
import { format, numbersUpdate, stageUpdate, visualTrueStageUnlocks, visualUpdate } from './Update';

export const globalSave: globalSaveType = {
    intervals: {
        main: 20,
        offline: 40,
        numbers: 80,
        visual: 1000,
        autoSave: 20000
    },
    hotkeys: { //hotkeyFunction: [key, code]
        stage: ['S', 'S'],
        discharge: ['D', 'D'],
        vaporization: ['V', 'V'],
        rank: ['R', 'R'],
        collapse: ['C', 'C'],
        galaxy: ['G', 'G'],
        pause: ['P', 'P'],
        makeAll: ['M', 'M'],
        toggleAll: ['Shift A', 'Shift A'],
        merge: ['Shift M', 'Shift M'],
        universe: ['Shift U', 'Shift U'],
        exitChallenge: ['Shift E', 'Shift E'],
        tabRight: ['Arrow Right', 'Arrow Right'],
        tabLeft: ['Arrow Left', 'Arrow Left'],
        subtabUp: ['Arrow Up', 'Arrow Up'],
        subtabDown: ['Arrow Down', 'Arrow Down'],
        stageRight: ['Shift Arrow Right', 'Shift Arrow Right'],
        stageLeft: ['Shift Arrow Left', 'Shift Arrow Left']
    },
    toggles: [false, false, false, false, false],
    /* Hotkeys type[0], Elements as tab[1], Allow text selection[2], Footer on top[3], Show Strangeness[4] */
    format: ['.', ''], //Point[0], Separator[1]
    theme: null,
    fontSize: 16,
    MDSettings: [false, false], //Status[0], Mouse events[1]
    SRSettings: [false, false, false], //Status[0], Tabindex Upgrades[1], Tabindex primary[2]
    developerMode: false
};

export const saveGlobalSettings = (noSaving = false): string => {
    const hotkeysClone = deepClone(globalSave.hotkeys);
    const encoder = new TextEncoder();
    for (const key in hotkeysClone) {
        const array = hotkeysClone[key as hotkeysList];
        for (let i = 0; i < array.length; i++) {
            array[i] = String.fromCharCode(...encoder.encode(array[i]));
        }
    }
    const clone = { ...globalSave };
    clone.hotkeys = hotkeysClone;
    const save = btoa(JSON.stringify(clone));
    if (!noSaving) { localStorage.setItem(LOCAL_STORAGE_SETTINGS_INDEX, save); }
    return save;
};

export const toggleSpecial = (number: number, type: 'global' | 'mobile' | 'reader', change = false, reload = false) => {
    let toggles;
    if (type === 'mobile') {
        toggles = globalSave.MDSettings;
    } else if (type === 'reader') {
        toggles = globalSave.SRSettings;
    } else {
        toggles = globalSave.toggles;
    }

    if (change) {
        if (reload) {
            return void (async() => {
                if (!await Confirm('Changing this setting will reload game, confirm?\n(Game will not autosave)')) { return; }
                pauseGame();
                toggles[number] = !toggles[number];
                saveGlobalSettings();
                window.location.reload();
                void Alert('Awaiting game reload');
            })();
        } else {
            toggles[number] = !toggles[number];
            saveGlobalSettings();
        }
    }

    let toggleHTML;
    if (type === 'mobile') {
        toggleHTML = getId(`MDToggle${number}`);
    } else if (type === 'reader') {
        toggleHTML = getId(`SRToggle${number}`);
    } else {
        toggleHTML = getId(`globalToggle${number}`);
    }

    if (!toggles[number]) {
        toggleHTML.style.color = '';
        toggleHTML.style.borderColor = '';
        toggleHTML.textContent = 'OFF';
    } else {
        toggleHTML.style.color = 'var(--red-text)';
        toggleHTML.style.borderColor = 'crimson';
        toggleHTML.textContent = 'ON';
    }
};

export const specialHTML = { //Images here are from true vacuum for easier cache
    resetHTML: ['', 'Discharge', 'Vaporization', 'Rank', 'Collapse', 'Merge', ''], //[0] === textContent
    longestBuilding: 7, //+1
    buildingHTML: [ //outerHTML is slow
        [],
        ['Preon.png', 'Quarks.png', 'Particle.png', 'Atom.png', 'Molecule.png'], //[0] === src
        ['Drop.png', 'Puddle.png', 'Pond.png', 'Lake.png', 'Sea.png', 'Ocean.png'],
        ['Cosmic%20dust.png', 'Planetesimal.png', 'Protoplanet.png', 'Natural%20satellite.png', 'Subsatellite.png'],
        ['Brown%20dwarf.png', 'Orange%20dwarf.png', 'Red%20supergiant.png', 'Blue%20hypergiant.png', 'Quasi%20star.png'],
        ['Nebula.png', 'Star%20cluster.png', 'Galaxy.png'],
        ['Universe.png']
    ],
    longestUpgrade: 14,
    upgradeHTML: [
        [], [
            'UpgradeQ1.png',
            'UpgradeQ2.png',
            'UpgradeQ3.png',
            'UpgradeQ4.png',
            'UpgradeQ5.png',
            'UpgradeQ6.png',
            'UpgradeQ7.png',
            'UpgradeQ8.png',
            'UpgradeQ9.png',
            'UpgradeQ10.png',
            'Missing.png'
        ], [
            'UpgradeW1.png',
            'UpgradeW2.png',
            'UpgradeW3.png',
            'UpgradeW4.png',
            'UpgradeW5.png',
            'UpgradeW6.png',
            'UpgradeW7.png',
            'UpgradeW8.png',
            'UpgradeW9.png',
            'Missing.png'
        ], [
            'UpgradeA1.png',
            'UpgradeA2.png',
            'UpgradeA3.png',
            'UpgradeA4.png',
            'UpgradeA5.png',
            'UpgradeA6.png',
            'UpgradeA7.png',
            'UpgradeA8.png',
            'UpgradeA9.png',
            'UpgradeA10.png',
            'UpgradeA11.png',
            'UpgradeA12.png',
            'UpgradeA13.png',
            'Missing.png'
        ], [
            'UpgradeS1.png',
            'UpgradeS2.png',
            'UpgradeS3.png',
            'UpgradeS4.png',
            'UpgradeS5.png'
        ], [
            'UpgradeG1.png',
            'UpgradeG2.png',
            'UpgradeG3.png',
            'UpgradeG4.png'
        ], []
    ],
    longestResearch: 9,
    researchHTML: [
        [], [
            ['ResearchQ1.png', 'stage1borderImage'], //[1] === className
            ['ResearchQ2.png', 'stage1borderImage'],
            ['ResearchQ3.png', 'stage1borderImage'],
            ['ResearchQ4.png', 'stage4borderImage'],
            ['ResearchQ5.png', 'stage4borderImage'],
            ['ResearchQ6.png', 'stage4borderImage']
        ], [
            ['ResearchW1.png', 'stage2borderImage'],
            ['ResearchW2.png', 'stage2borderImage'],
            ['ResearchW3.png', 'stage2borderImage'],
            ['ResearchW4.png', 'stage2borderImage'],
            ['ResearchW5.png', 'stage2borderImage'],
            ['ResearchW6.png', 'stage2borderImage']
        ], [
            ['ResearchA1.png', 'stage3borderImage'],
            ['ResearchA2.png', 'stage2borderImage'],
            ['ResearchA3.png', 'stage3borderImage'],
            ['ResearchA4.png', 'stage3borderImage'],
            ['ResearchA5.png', 'stage3borderImage'],
            ['ResearchA6.png', 'stage3borderImage'],
            ['ResearchA7.png', 'stage1borderImage'],
            ['ResearchA8.png', 'redBorderImage'],
            ['ResearchA9.png', 'stage1borderImage']
        ], [
            ['ResearchS1.png', 'stage5borderImage'],
            ['ResearchS2.png', 'stage5borderImage'],
            ['ResearchS3.png', 'redBorderImage'],
            ['ResearchS4.png', 'stage5borderImage'],
            ['ResearchS5.png', 'stage6borderImage'],
            ['ResearchS6.png', 'stage4borderImage']
        ], [
            ['ResearchG1.png', 'stage1borderImage'],
            ['ResearchG2.png', 'stage6borderImage'],
            ['ResearchG3.png', 'stage6borderImage'],
            ['Missing.png', 'stage4borderImage'] //ResearchG4
        ], []
    ],
    longestResearchExtra: 6,
    researchExtraDivHTML: [
        [],
        ['Energy%20Researches.png', 'stage4borderImage'],
        ['Cloud%20Researches.png', 'stage2borderImage'],
        ['Rank%20Researches.png', 'stage6borderImage'],
        ['Collapse%20Researches.png', 'stage6borderImage'],
        ['Galaxy%20Researches.png', 'stage3borderImage'],
        ['Missing.png', 'redBorderImage']
    ],
    researchExtraHTML: [
        [], [
            ['ResearchEnergy1.png', 'stage1borderImage'],
            ['ResearchEnergy2.png', 'stage5borderImage'],
            ['ResearchEnergy3.png', 'stage3borderImage'],
            ['ResearchEnergy4.png', 'stage1borderImage'],
            ['ResearchEnergy5.png', 'stage6borderImage'],
            ['Missing.png', 'redBorderImage']
        ], [
            ['ResearchClouds1.png', 'stage3borderImage'],
            ['ResearchClouds2.png', 'stage2borderImage'],
            ['ResearchClouds3.png', 'stage4borderImage'],
            ['ResearchClouds4.png', 'stage2borderImage'],
            ['ResearchClouds5.png', 'stage2borderImage']
        ], [
            ['ResearchRank1.png', 'stage3borderImage'],
            ['ResearchRank2.png', 'stage3borderImage'],
            ['ResearchRank3.png', 'stage3borderImage'],
            ['ResearchRank4.png', 'stage2borderImage'],
            ['ResearchRank5.png', 'stage2borderImage'],
            ['Missing.png', 'redBorderImage']
        ], [
            ['ResearchCollapse1.png', 'stage6borderImage'],
            ['ResearchCollapse2.png', 'redBorderImage'],
            ['ResearchCollapse3.png', 'stage1borderImage'],
            ['ResearchCollapse4.png', 'stage6borderImage']
        ], [
            ['ResearchGalaxy1.png', 'stage3borderImage'],
            ['Missing.png', 'stage3borderImage'] //ResearchGalaxy2
        ], []
    ],
    longestFooterStats: 3,
    footerStatsHTML: [
        [], [
            ['Energy%20mass.png', 'stage1borderImage cyanText', 'Mass'], //[2] === textcontent
            ['Energy.png', 'stage4borderImage orangeText', 'Energy']
        ], [
            ['Water.png', 'stage2borderImage blueText', 'Moles'],
            ['Drop.png', 'stage2borderImage blueText', 'Drops'],
            ['Clouds.png', 'stage3borderImage grayText', 'Clouds']
        ], [
            ['Mass.png', 'stage3borderImage grayText', 'Mass']
        ], [
            ['Main_sequence%20mass.png', 'stage1borderImage cyanText', 'Mass'],
            ['Elements.png', 'stage4borderImage orangeText', 'Elements']
        ], [
            ['Main_sequence%20mass.png', 'stage1borderImage cyanText', 'Mass'],
            ['Elements.png', 'stage4borderImage orangeText', 'Elements'],
            ['Stars.png', 'redBorderImage redText', 'Stars']
        ], [
            ['Dark%20matter.png', 'stage3borderImage grayText', 'Matter'],
            ['Cosmon.png', 'stage6borderImage darkvioletText', 'Cosmon']
        ]
    ],
    mobileDevice: { //All browsers that I tested didn't properly detected more than 1 touch
        start: [0, 0] //[X, Y]
    },
    cache: {
        imagesDiv: document.createElement('div'),
        idMap: new Map<string, HTMLElement>(),
        classMap: new Map<string, HTMLCollectionOf<HTMLElement>>(),
        queryMap: new Map<string, HTMLElement>()
    },
    notifications: [] as Array<[string, (instantClose?: boolean) => void]>, //[text, true ? incrementFunc : closeFunc]
    alert: [null, null] as [number | null, (() => void) | null], //[priority, closeFunc]
    bigWindow: null as string | null,
    styleSheet: document.createElement('style') //Secondary
};

export const preventImageUnload = () => {
    const { footerStatsHTML: footer, buildingHTML: build, upgradeHTML: upgrade, researchHTML: research, researchExtraHTML: extra, researchExtraDivHTML: extraDiv } = specialHTML;

    let images = '<img src="Used_art/Red%20giant.png" loading="lazy"><img src="Used_art/White%20dwarf.png" loading="lazy">';
    for (let s = 1; s <= 6; s++) {
        for (let i = 0; i < footer[s].length; i++) {
            if (s === 2) {
                if (i === 2) { continue; } //Drops
            } else if (s === 5 && i < 2) { continue; } //Solar mass and Elements
            images += `<img src="Used_art/${footer[s][i][0]}" loading="lazy">`;
        }
        for (let i = 0; i < build[s].length; i++) {
            images += `<img src="Used_art/${build[s][i]}" loading="lazy">`;
        }
        for (let i = 0; i < upgrade[s].length; i++) {
            images += `<img src="Used_art/${upgrade[s][i]}" loading="lazy">`;
        }
        for (let i = 0; i < research[s].length; i++) {
            images += `<img src="Used_art/${research[s][i][0]}" loading="lazy">`;
        }
        for (let i = 0; i < extra[s].length; i++) {
            images += `<img src="Used_art/${extra[s][i][0]}" loading="lazy">`;
        }
        images += `<img src="Used_art/${extraDiv[s][0]}" loading="lazy">`;
        images += `<img src="Used_art/Stage${s}%20border.png" loading="lazy">`;
    }
    specialHTML.cache.imagesDiv.innerHTML = images; //Saved just in case
};

/** Not providing value for 'theme' will make it use one from globalSave and remove all checks */
export const setTheme = (theme = 'current' as 'current' | number | null) => {
    if (theme !== 'current') {
        if (theme !== null) {
            if (player.stage.true < theme) { theme = null; }
            if (theme === 6 && player.stage.true < 7) { theme = null; }
        }
        getId(`switchTheme${globalSave.theme ?? 0}`).style.textDecoration = '';

        globalSave.theme = theme;
        saveGlobalSettings();
        getId('currentTheme').textContent = theme === null ? 'Default' : global.stageInfo.word[theme];
        getId(`switchTheme${theme ?? 0}`).style.textDecoration = 'underline';
    } else { theme = globalSave.theme; }

    const upgradeTypes = ['upgrade', 'element', 'inflation'];
    const properties = {
        '--background-color': '#030012',
        '--window-color': '#12121c',
        '--window-border': 'cornflowerblue',
        '--footer-color': 'darkblue',
        '--button-color': 'mediumblue',
        '--button-border': 'darkcyan',
        '--button-hover': '#2626ff',
        '--building-afford': '#a90000',
        '--tab-active': '#8b00c5',
        '--tab-elements': '#9f6700',
        '--tab-strangeness': '#00b100',
        '--tab-inflation': '#6c1ad1',
        '--hollow-hover': '#170089',
        '--footerButton-hover': '#181818',
        '--input-border': '#831aa5',
        '--input-text': '#cf71ff',
        '--button-text': '#e3e3e3',
        '--main-text': 'var(--cyan-text)',
        '--white-text': 'white',
        //'--cyan-text': '#03d3d3',
        '--blue-text': 'dodgerblue',
        '--orange-text': 'darkorange',
        '--gray-text': '#8f8f8f',
        '--orchid-text': '#e14bdb',
        '--darkorchid-text': '#bd24ef',
        '--darkviolet-text': '#8b3cec',
        '--red-text': '#eb0000',
        '--green-text': '#00e900',
        '--yellow-text': '#fafa00'
        //'--brown-text': '#9b7346'
    };

    /* Many of these colors will need to be changed in other places (find them with quick search, there are too many of them) */
    switch (theme ?? player.stage.active) {
        case 1:
            for (const text of upgradeTypes) {
                getId(`${text}Text`).style.color = '';
                getId(`${text}Effect`).style.color = '';
                getId(`${text}Cost`).style.color = '';
            }
            properties['--tab-inflation'] = 'var(--tab-active)';
            break;
        case 2:
            for (const text of upgradeTypes) {
                getId(`${text}Text`).style.color = 'var(--white-text)';
                getId(`${text}Effect`).style.color = 'var(--green-text)';
                getId(`${text}Cost`).style.color = 'var(--cyan-text)';
            }
            properties['--background-color'] = '#070026';
            properties['--window-color'] = '#000052';
            properties['--window-border'] = 'blue';
            properties['--footer-color'] = '#0000db';
            properties['--button-color'] = '#0000eb';
            properties['--button-border'] = '#386cc7';
            properties['--button-hover'] = '#2929ff';
            properties['--building-afford'] = '#b30000';
            properties['--tab-active'] = '#990000';
            properties['--hollow-hover'] = '#2400d7';
            properties['--input-border'] = '#4747ff';
            properties['--input-text'] = 'dodgerblue';
            properties['--main-text'] = 'var(--blue-text)';
            properties['--gray-text'] = '#9b9b9b';
            properties['--darkorchid-text'] = '#c71bff';
            properties['--darkviolet-text'] = '#8766ff';
            properties['--green-text'] = '#82cb3b';
            properties['--red-text'] = '#f70000';
            break;
        case 3:
            for (const text of upgradeTypes) {
                getId(`${text}Text`).style.color = 'var(--orange-text)';
                getId(`${text}Effect`).style.color = '';
                getId(`${text}Cost`).style.color = 'var(--green-text)';
            }
            properties['--background-color'] = '#000804';
            properties['--window-color'] = '#2e1200';
            properties['--window-border'] = '#31373e';
            properties['--footer-color'] = '#221a00';
            properties['--button-color'] = '#291344';
            properties['--button-border'] = '#424242';
            properties['--button-hover'] = '#382055';
            properties['--building-afford'] = '#9e0000';
            properties['--tab-active'] = '#8d4c00';
            properties['--tab-elements'] = 'var(--tab-active)';
            properties['--hollow-hover'] = '#5a2100';
            properties['--footerButton-hover'] = '#1a1a1a';
            properties['--input-border'] = '#8b4a00';
            properties['--input-text'] = '#e77e00';
            properties['--main-text'] = 'var(--gray-text)';
            properties['--white-text'] = '#dfdfdf';
            properties['--orange-text'] = '#f58600';
            properties['--green-text'] = '#00db00';
            break;
        case 4:
            for (const text of upgradeTypes) {
                getId(`${text}Text`).style.color = 'var(--blue-text)';
                getId(`${text}Effect`).style.color = 'var(--green-text)';
                getId(`${text}Cost`).style.color = 'var(--cyan-text)';
            }
            properties['--background-color'] = '#140e04';
            properties['--window-color'] = '#4e0000';
            properties['--window-border'] = '#894800';
            properties['--footer-color'] = '#4e0505';
            properties['--button-color'] = '#6a3700';
            properties['--button-border'] = '#a35700';
            properties['--button-hover'] = '#8a4700';
            properties['--building-afford'] = '#007f95';
            properties['--tab-active'] = '#008297';
            properties['--tab-elements'] = 'var(--tab-active)';
            properties['--tab-strangeness'] = '#00a500';
            properties['--hollow-hover'] = '#605100';
            properties['--footerButton-hover'] = '#212121';
            properties['--input-border'] = '#008399';
            properties['--input-text'] = '#05c3c3';
            properties['--button-text'] = '#d9d900';
            properties['--main-text'] = 'var(--orange-text)';
            properties['--white-text'] = '#e5e500';
            properties['--blue-text'] = '#2e96ff';
            properties['--gray-text'] = '#8b8b8b';
            properties['--darkorchid-text'] = '#c71bff';
            properties['--darkviolet-text'] = '#9457ff';
            properties['--red-text'] = 'red';
            properties['--green-text'] = '#00e600';
            properties['--yellow-text'] = 'var(--green-text)';
            break;
        case 5:
            for (const text of upgradeTypes) {
                getId(`${text}Text`).style.color = 'var(--orange-text)';
                getId(`${text}Effect`).style.color = 'var(--green-text)';
                getId(`${text}Cost`).style.color = 'var(--red-text)';
            }
            properties['--background-color'] = '#060010';
            properties['--window-color'] = '#001d42';
            properties['--window-border'] = '#35466e';
            properties['--footer-color'] = '#2f005c';
            properties['--button-color'] = '#4a008f';
            properties['--button-border'] = '#8f004c';
            properties['--button-hover'] = '#6800d6';
            properties['--building-afford'] = '#8603ff';
            properties['--tab-active'] = '#8500ff';
            properties['--tab-inflation'] = 'var(--tab-active)';
            properties['--hollow-hover'] = '#3b0080';
            properties['--footerButton-hover'] = '#1a1a1a';
            properties['--input-border'] = '#3656a1';
            properties['--input-text'] = '#6a88cd';
            properties['--button-text'] = '#fc9cfc';
            properties['--main-text'] = 'var(--darkorchid-text)';
            properties['--white-text'] = '#ff79ff';
            properties['--orchid-text'] = '#ff00f4';
            properties['--darkorchid-text'] = '#c000ff';
            properties['--darkviolet-text'] = '#8861ff';
            properties['--yellow-text'] = 'var(--darkviolet-text)';
            break;
        case 6:
            for (const text of upgradeTypes) {
                getId(`${text}Text`).style.color = 'var(--orchid-text)';
                getId(`${text}Effect`).style.color = 'var(--orange-text)';
                getId(`${text}Cost`).style.color = 'var(--red-text)';
            }
            properties['--background-color'] = 'black';
            properties['--window-color'] = '#01003c';
            properties['--window-border'] = '#7100ff';
            properties['--footer-color'] = '#00007a';
            properties['--button-color'] = '#2b0095';
            properties['--button-border'] = '#6c1ad1';
            properties['--button-hover'] = '#3d00d6';
            properties['--building-afford'] = '#b30000';
            properties['--tab-active'] = '#8d0000';
            properties['--tab-inflation'] = 'var(--tab-active)';
            properties['--hollow-hover'] = '#490070';
            properties['--input-border'] = '#a50000';
            properties['--input-text'] = 'red';
            properties['--button-text'] = '#bfbdff';
            properties['--main-text'] = 'var(--darkviolet-text)';
            properties['--white-text'] = '#aba8ff';
            properties['--gray-text'] = '#9b9b9b';
            properties['--darkviolet-text'] = '#8157ff';
            properties['--red-text'] = 'red';
            properties['--yellow-text'] = 'var(--green-text)';
    }

    const body = document.documentElement.style;
    body.setProperty('--transition-all', '800ms');
    body.setProperty('--transition-buttons', '600ms');
    for (const property in properties) { body.setProperty(property, properties[property as '--main-text']); }

    setTimeout(() => {
        body.setProperty('--transition-all', '0ms');
        body.setProperty('--transition-buttons', '100ms');
    }, 800);
};

export const Alert = async(text: string, priority = 0): Promise<void> => {
    return await new Promise((resolve) => {
        if (specialHTML.alert[0] !== null) {
            if (specialHTML.alert[0] < priority) {
                (specialHTML.alert[1] as () => undefined)();
                Notify(`Alert has been replaced with higher priority one\nOld text: ${getId('alertText').textContent}`);
            } else {
                resolve();
                Notify(`Another Alert is already active\nMissed text: ${text}`);
                return;
            }
        }

        getId('alertText').textContent = text;
        const body = document.body;
        const blocker = getId('alertMain');
        const confirm = getId('alertConfirm');
        blocker.style.display = '';
        body.classList.remove('noTextSelection');
        const oldFocus = document.activeElement as HTMLElement | null;
        confirm.focus();

        const key = async(event: KeyboardEvent) => {
            if (event.metaKey || event.ctrlKey || event.altKey) { return; }
            const code = event.code;
            if (code === 'Escape' || code === 'Enter' || code === 'Space') {
                if (event.shiftKey) { return; }
                event.preventDefault();
                close();
            } else if (code === 'Tab') {
                event.preventDefault();
                confirm.focus();
            }
        };
        const close = () => {
            if (!globalSave.toggles[2]) { body.classList.add('noTextSelection'); }
            blocker.style.display = 'none';
            body.removeEventListener('keydown', key);
            confirm.removeEventListener('click', close);
            specialHTML.alert = [null, null];
            oldFocus?.focus();
            resolve();
        };
        specialHTML.alert = [priority, close];
        body.addEventListener('keydown', key);
        confirm.addEventListener('click', close);
    });
};

export const Confirm = async(text: string, priority = 0): Promise<boolean> => {
    return await new Promise((resolve) => {
        if (specialHTML.alert[0] !== null) {
            if (specialHTML.alert[0] < priority) {
                (specialHTML.alert[1] as () => undefined)();
                Notify(`Alert has been replaced with higher priority one\nOld text: ${getId('alertText').textContent}`);
            } else {
                resolve(false);
                Notify(`Another Alert is already active\nMissed text: ${text}`);
                return;
            }
        }

        getId('alertText').textContent = text;
        const body = document.body;
        const blocker = getId('alertMain');
        const cancel = getId('alertCancel');
        const confirm = getId('alertConfirm');
        blocker.style.display = '';
        cancel.style.display = '';
        body.classList.remove('noTextSelection');
        const oldFocus = document.activeElement as HTMLElement | null;
        confirm.focus();

        let result = false;
        const yes = () => {
            result = true;
            close();
        };
        const key = (event: KeyboardEvent) => {
            if (event.metaKey || event.ctrlKey || event.altKey) { return; }
            const code = event.code;
            if (code === 'Escape') {
                if (event.shiftKey) { return; }
                event.preventDefault();
                close();
            } else if (code === 'Enter' || code === 'Space') {
                if (event.shiftKey || document.activeElement === cancel) { return; }
                event.preventDefault();
                yes();
            } else if (code === 'Tab') {
                event.preventDefault();
                (document.activeElement === cancel ? confirm : cancel).focus();
            }
        };
        const close = () => {
            if (!globalSave.toggles[2]) { body.classList.add('noTextSelection'); }
            blocker.style.display = 'none';
            cancel.style.display = 'none';
            body.removeEventListener('keydown', key);
            confirm.removeEventListener('click', yes);
            cancel.removeEventListener('click', close);
            specialHTML.alert = [null, null];
            oldFocus?.focus();
            resolve(result);
        };
        specialHTML.alert = [priority, close];
        body.addEventListener('keydown', key);
        confirm.addEventListener('click', yes);
        cancel.addEventListener('click', close);
    });
};

export const Prompt = async(text: string, placeholder = '', priority = 0): Promise<string | null> => {
    return await new Promise((resolve) => {
        if (specialHTML.alert[0] !== null) {
            if (specialHTML.alert[0] < priority) {
                (specialHTML.alert[1] as () => undefined)();
                Notify(`Alert has been replaced with higher priority one\nOld text: ${getId('alertText').textContent}`);
            } else {
                resolve(null);
                Notify(`Another Alert is already active\nMissed text: ${text}`);
                return;
            }
        }

        getId('alertText').textContent = text;
        const body = document.body;
        const blocker = getId('alertMain');
        const input = getId('alertInput') as HTMLInputElement;
        const cancel = getId('alertCancel');
        const confirm = getId('alertConfirm');
        blocker.style.display = '';
        cancel.style.display = '';
        input.style.display = '';
        body.classList.remove('noTextSelection');
        input.placeholder = placeholder;
        input.value = '';
        const oldFocus = document.activeElement as HTMLElement | null;
        input.focus();

        let result: null | string = null;
        const yes = () => {
            result = input.value === '' ? input.placeholder : input.value;
            close();
        };
        const key = (event: KeyboardEvent) => {
            if (event.metaKey || event.ctrlKey || event.altKey) { return; }
            const code = event.code;
            if (code === 'Escape') {
                if (event.shiftKey) { return; }
                event.preventDefault();
                close();
            } else if (code === 'Enter' || code === 'Space') {
                const active = document.activeElement;
                if (event.shiftKey || (code === 'Space' && active === input) || active === cancel) { return; }
                event.preventDefault();
                yes();
            } else if (code === 'Tab') {
                if (event.shiftKey && document.activeElement === input) {
                    event.preventDefault();
                    cancel.focus();
                } else if (!event.shiftKey && document.activeElement === cancel) {
                    event.preventDefault();
                    input.focus();
                }
            }
        };
        const close = () => {
            if (!globalSave.toggles[2]) { body.classList.add('noTextSelection'); }
            blocker.style.display = 'none';
            cancel.style.display = 'none';
            input.style.display = 'none';
            body.removeEventListener('keydown', key);
            confirm.removeEventListener('click', yes);
            cancel.removeEventListener('click', close);
            specialHTML.alert = [null, null];
            oldFocus?.focus();
            resolve(result);
        };
        specialHTML.alert = [priority, close];
        body.addEventListener('keydown', key);
        confirm.addEventListener('click', yes);
        cancel.addEventListener('click', close);
    });
};

/** Repeats will make it behave as if X duplicates have been detected */
export const Notify = (text: string, repeats = 0) => {
    const { notifications } = specialHTML;

    let index;
    for (let i = 0; i < notifications.length; i++) {
        if (notifications[i][0] === text) {
            index = i;
            break;
        }
    }

    if (index === undefined) {
        let count = 1 + repeats;
        let timeout: number;

        const html = document.createElement('p');
        html.textContent = `${text}${count > 1 ? ` | x${count}` : ''}`;
        html.style.animation = 'hideX 800ms ease-in-out reverse';
        html.style.pointerEvents = 'none';
        if (globalSave.SRSettings[0]) { html.role = 'alert'; }
        getId('notifications').append(html);

        const pointer = notifications[notifications.push([text, (instantClose = false) => {
            if (instantClose) {
                if (html.style.animation === '') { remove(); }
                return;
            }
            html.textContent = `${text} | x${++count}`;
            if (timeout === undefined) { return; } //Required to make it work properly if call happened too early
            clearTimeout(timeout);
            timeout = setTimeout(remove, 7200);
        }]) - 1];
        const remove = () => {
            notifications.splice(notifications.indexOf(pointer), 1);
            html.removeEventListener('click', remove);
            html.style.animation = 'hideX 800ms ease-in-out forwards';
            html.style.pointerEvents = 'none';
            setTimeout(() => html.remove(), 800);
            clearTimeout(timeout);
        };
        setTimeout(() => {
            html.style.animation = '';
            html.style.pointerEvents = '';
            timeout = setTimeout(remove, 7200);
            html.addEventListener('click', remove);
        }, 800);
    } else { notifications[index][1](); }
};

export const hideFooter = () => {
    const toggleData = getId('hideToggle').dataset;
    if (toggleData.disabled === 'true') { return; }
    const footer = getId('footer');
    const footerArea = getId('footerMain');
    const arrow = getId('hideArrow');

    const animationReset = () => {
        footer.style.animation = '';
        arrow.style.animation = '';
        toggleData.disabled = '';
    };

    global.footer = !global.footer;
    toggleData.disabled = 'true';
    if (global.footer) {
        footerArea.style.display = '';
        arrow.style.transform = '';
        footer.style.animation = 'hideY 800ms reverse';
        arrow.style.animation = 'rotate 800ms reverse';
        getQuery('#hideToggle > p').textContent = 'Hide';
        getId('stageSelect').classList.add('active');
        setTimeout(animationReset, 800);

        visualUpdate();
        numbersUpdate();
    } else {
        footer.style.animation = 'hideY 800ms backwards';
        arrow.style.animation = 'rotate 800ms backwards';
        getQuery('#hideToggle > p').textContent = 'Show';
        getId('stageSelect').classList.remove('active');
        setTimeout(() => {
            footerArea.style.display = 'none';
            arrow.style.transform = 'rotate(180deg)';
            animationReset();
        }, 800);
    }
};

export const changeFontSize = (initial = false) => {
    const input = getId('customFontSize') as HTMLInputElement;
    const size = Math.min(Math.max(initial ? globalSave.fontSize : (input.value === '' ? 16 : Math.floor(Number(input.value) * 100) / 100), 12), 24);
    if (!initial) {
        globalSave.fontSize = size;
        saveGlobalSettings();

        (getId('milestonesMultiline').parentElement as HTMLElement).style.minHeight = '';
    }

    document.documentElement.style.fontSize = size === 16 ? '' : `${size}px`;
    input.value = `${size}`;
    adjustCSSRules(initial);
};
/* Only decent work around media not allowing var() and rem units being bugged */
const adjustCSSRules = (initial: boolean) => {
    const styleSheet = (getId('primaryRules') as HTMLStyleElement).sheet;
    if (styleSheet == null) { //Safari doesn't wait for CSS to load even if script is defered
        if (initial) {
            return getId('primaryRules').addEventListener('load', () => {
                adjustCSSRules(false);
            }, { once: true });
        }
        return Notify(`Due to ${styleSheet} related Error some font size features will not work`);
    }
    const styleLength = styleSheet.cssRules.length - 1;
    const fontRatio = globalSave.fontSize / 16;
    const rule1 = styleSheet.cssRules[styleLength - 1] as CSSMediaRule; //Primary phone size
    const rule2 = styleSheet.cssRules[styleLength] as CSSMediaRule; //Tiny phone size
    styleSheet.deleteRule(styleLength);
    styleSheet.deleteRule(styleLength - 1);
    styleSheet.insertRule(rule1.cssText.replace(rule1.conditionText, `screen and (max-width: ${893 * fontRatio + 32}px)`), styleLength - 1);
    styleSheet.insertRule(rule2.cssText.replace(rule2.conditionText, `screen and (max-width: ${362 * fontRatio + 32}px)`), styleLength);
};

export const changeFormat = (point: boolean) => {
    const htmlInput = (point ? getId('decimalPoint') : getId('thousandSeparator')) as HTMLInputElement;
    let value = htmlInput.value.replace(' ', ' '); //No break space
    const allowed = ['.', '·', ',', ' ', '_', "'", '"', '`', '|'].includes(value);
    if (!allowed || globalSave.format[point ? 1 : 0] === value) {
        if (point && globalSave.format[1] === '.') {
            (getId('thousandSeparator') as HTMLInputElement).value = '';
            globalSave.format[1] = '';
        }
        value = point ? '.' : '';
        htmlInput.value = value;
    }
    globalSave.format[point ? 0 : 1] = value;
    saveGlobalSettings();
};

/** Short is only for hotkeys that can change */
export const SRHotkeysInfo = (short = false) => {
    const index = globalSave.toggles[0] ? 0 : 1;
    const resetName = specialHTML.resetHTML[player.stage.active];
    const resetHotkey = globalSave.hotkeys[resetName.toLowerCase() as hotkeysList];
    const list = [resetHotkey !== undefined ? resetHotkey[index] : ''];
    if (!short) {
        list.push(
            globalSave.hotkeys.tabLeft[index], globalSave.hotkeys.tabRight[index],
            globalSave.hotkeys.subtabDown[index], globalSave.hotkeys.subtabUp[index],
            globalSave.hotkeys.stageLeft[index], globalSave.hotkeys.stageRight[index],
            globalSave.hotkeys.stage[index],
            globalSave.hotkeys.makeAll[index],
            globalSave.hotkeys.toggleAll[index]
        );
    }
    for (let i = 0; i < list.length; i++) {
        if (list[i] == null || list[i] === '') { list[i] = 'None'; }
    }
    getId('reset1Main').ariaLabel = `${resetName} reset, hotkey is ${list[0]}`;
    if (short) { return; }
    getQuery('#footerMain > nav').ariaLabel = `Tab list, hotkeys are ${list[1]} and ${list[2]}`;
    getId('subtabs').ariaLabel = `Subtab list, hotkeys are ${list[3]} and ${list[4]}`;
    getId('stageSelect').ariaLabel = `Active Stages list, hotkeys are ${list[5]} and ${list[6]}`;
    getId('resetStage').ariaLabel = `Stage reset, hotkey is ${list[7]}`;
    getId('makeAllStructures').ariaLabel = `Make all Structures, hotkey is ${list[8]}`;
    getId('toggleBuilding0').ariaLabel = `Toggle all Structures, hotkey is ${list[9]}`;
};

export const MDStrangenessPage = (stageIndex: number) => {
    for (let s = 1; s <= 5; s++) { getId(`strangenessSection${s}`).style.display = 'none'; }
    getId(`strangenessSection${stageIndex}`).style.display = '';
};

export const replayEvent = async() => {
    let last;
    if (player.stage.true >= 6) {
        last = player.event ? 8 : player.stage.resets >= 1 ? 7 : 6;
    } else {
        last = player.stage.true - (player.event ? 0 : 1);
        if (last < 1) { return void Alert('There are no unlocked events'); }
    }

    let text = 'Which event do you want to see again?\nEvent 1: Stage reset';
    if (last >= 2) { text += '\nEvent 2: Clouds softcap'; }
    if (last >= 3) { text += '\nEvent 3: New Rank'; }
    if (last >= 4) { text += '\nEvent 4: New Elements'; }
    if (last >= 5) { text += '\nEvent 5: Intergalactic'; }
    if (last >= 6) { text += '\nEvent 6: True Vacuum'; }
    if (last >= 7) { text += '\nEvent 7: Void unlocked'; }
    if (last >= 8) { text += '\nEvent 8: New Universe'; }

    const event = Number(await Prompt(text, `${last}`));
    if (event > last) { return; }
    playEvent(event);
};

/** Sets player.event to true if replay is false */
export const playEvent = (event: number, replay = true) => {
    if (specialHTML.alert[0] !== null) { return Notify(`Missed Event ${event}, you can replay it from options`); }
    if (!replay) { player.event = true; }

    let text = 'No such event';
    if (event === 1) {
        text = 'New reset tier has been unlocked. It will allow to reach higher tiers of Structures, but for the price of everything else';
    } else if (event === 2) {
        text = `Cloud density is too high... Any new Clouds past ${format(1e4)} will be weaker due to softcap`;
    } else if (event === 3) {
        if (!replay) {
            assignResetInformation.maxRank();
            global.debug.rankUpdated = null;
        }
        text = "Can't gain any more Mass with current Rank. New one has been unlocked, but reaching it will softcap the Mass production";
    } else if (event === 4) {
        text = 'Last explosion not only created first Neutron stars, but also unlocked new Elements through Supernova nucleosynthesis';
    } else if (event === 5) {
        if (!replay) { stageUpdate(false); }
        text = "There are no Structures in Intergalactic yet, but they can be created within previous Stages. Stage resets and exports will now award Strange quarks, '[26] Iron' Element will use new effect to improve reward.\n(Stars in Intergalactic are just Stars from Interstellar)";
    } else if (event === 6) {
        text = 'As Galaxies started to Merge, their combined Gravity pushed Vacuum out of its local minimum into more stable global minimum. New forces and Structures are expected within this new and true Vacuum state';
    } else if (event === 7) {
        text = "With Vacuum decaying remaining matter had rearranged itself in such way that lead to the formation of the 'Void'. Check it out in 'Advanced' subtab";
    } else if (event === 8) {
        if (!replay) { stageUpdate(false); }
        text = "Soon there will be enough matter to create first 'Universe' within 'Abyss' Stage. Doing it will require getting at least 40 Galaxies before Merging them. Creating it will do a Vacuum reset, while also resetting Vacuum state back to false";
    }
    if (!replay) { text += "\n\n(Can be viewed again with 'Events' button in Settings tab)"; }
    return void Alert(text);
};

const buildBigWindow = () => {
    if (getId('closeBigWindow', true) !== null) { return; }
    getId('bigWindow').innerHTML = '<div role="dialog" aria-modal="false"><button type="button" id="closeBigWindow">Close</button></div>';
    specialHTML.styleSheet.textContent += '#bigWindow > div { display: flex; flex-direction: column; align-items: center; width: clamp(20vw, 38em, 80vw); height: clamp(18vh, 36em, 90vh); background-color: var(--window-color); border: 3px solid var(--window-border); border-radius: 12px; padding: 1em 1em 0.8em; row-gap: 1em; }';
    specialHTML.styleSheet.textContent += '#bigWindow > div > button { flex-shrink: 0; border-radius: 4px; width: 6em; font-size: 0.92em; margin-top: auto; } #bigWindow > div > div { width: 100%; overflow-y: auto; overscroll-behavior-y: none; }';
};

export const getVersionInfoHTML = () => {
    if (specialHTML.bigWindow !== null) { return; }
    buildBigWindow();
    if (getId('versionHTML', true) === null) {
        const mainHTML = document.createElement('div');
        mainHTML.innerHTML = `<label>v0.2.2</label><p>- New content (Supervoid)\n- Better Offline calculation and more options related to it\n- Entering Void now saves current game state to load on exit\n<a href="https://docs.google.com/document/d/1x8zHjxB6mPQGwpZT3DV_bAyatFIB3SOlxp9TvzbrUds/edit?usp=sharing" target="_blank" rel="noopener noreferrer">Full changelog</a></p>
        <label>v0.2.1</label><p>- New content (Abyss)\n- Full game rebalance\n- Custom hotkeys\n- Updated supports\n- Many small changes and additions</p>
        <label>v0.2.0</label><p>- Reworked balance for all Stages past first reset cycle\n- Many quality of life additions\n- Most of settings are now saved separate from save file\n- Some more work on Mobile device support</p>
        <label>v0.1.9</label><p>- More true Vacuum balance\n- Reworked time related formats\n- Warp and Offline time usage reworked</p>
        <label>v0.1.8</label><p>- True Vacuum small balance changes\n- Upgrades and Researches merged\n- Added copy to clipboard, load from string save file options</p>
        <label>v0.1.7</label><p>- New content (Void)\n- Further balance changes</p>
        <label>v0.1.6</label><p>- Massive rebalance and reworks for all Stages</p>
        <label>v0.1.5</label><p>- True Vacuum minor balance\n- Images no longer unload\n- Screen reader support reworked</p>
        <label>v0.1.4</label><p>- Custom scrolls\n- Notifications</p>
        <label>v0.1.3</label><p>- True Vacuum balance changes\n- Submerged Stage minor balance\n- Replay event button\n\n- History for Stage resets</p>
        <label>v0.1.2</label><p>- New content (Vacuum)\n- Offline time reworked\n- Added version window (removed change log on game load)\n- Permanently removed text movement</p>
        <label>v0.1.1</label><p>- More balance changes for late game</p>
        <label>v0.1.0</label><p>- New content (Intergalactic)\n- Balance changes for late game</p>
        <label>v0.0.9</label><p>- New content (Milestones)\n- More Interstellar and late game balance</p>
        <label>v0.0.8</label><p>- Minor speed up to all Stages past Microworld</p>
        <label>v0.0.7</label><p>- New content (Strangeness)\n- Microworld Stage rework\n\n- Added stats for Save file name</p>
        <label>v0.0.6</label><p>- Added hotkeys list\n\n- Option to remove text movement\n- Ability to rename save file</p>
        <label>v0.0.5</label><p>- New content (Interstellar)\n- Basic loading screen\n\n- Added hotkeys</p>
        <label>v0.0.4</label><p>- Speed up to all Stages\n- Added events\n\n- Added numbers format</p>
        <label>v0.0.3</label><p>- New content (Accretion)\n- Submerged Stage extended\n- Offline time calculated better</p>
        <label>v0.0.2</label><p>- Stats subtab</p>
        <label>v0.0.1</label><p>- Submerged Stage rework\n- Added change log on game load\n\n- Mobile device support</p>
        <label>v0.0.0</label><p>- First published version\n\n- Submerged Stage placeholder</p>`;
        getQuery('#bigWindow > div').prepend(mainHTML);
        mainHTML.id = 'versionHTML';
        specialHTML.styleSheet.textContent += '#versionHTML label { font-size: 1.18em; } #versionHTML p { line-height: 1.3em; white-space: pre-line; color: var(--white-text); margin-top: 0.2em; margin-bottom: 1.4em; } #versionHTML p:last-of-type { margin-bottom: 0; }';
    }

    specialHTML.bigWindow = 'version';
    const body = document.body;
    const closeButton = getId('closeBigWindow');
    const mainHTML = getId('versionHTML');
    const windowHMTL = getId('bigWindow');
    const key = (event: KeyboardEvent) => {
        if (specialHTML.alert[0] !== null || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) { return; }
        const code = event.code;
        if (code === 'Escape' || code === 'Enter' || code === 'Space') {
            event.preventDefault();
            close();
        }
    };
    const close = () => {
        specialHTML.bigWindow = null;
        windowHMTL.style.display = 'none';
        mainHTML.style.display = 'none';
        body.removeEventListener('keydown', key);
        closeButton.removeEventListener('click', close);
    };
    body.addEventListener('keydown', key);
    closeButton.addEventListener('click', close);
    mainHTML.style.display = '';
    windowHMTL.style.display = '';
    closeButton.focus();
};

export const getHotkeysHTML = () => {
    if (specialHTML.bigWindow !== null) { return; }
    buildBigWindow();
    if (getId('hotkeysHTML', true) === null) {
        const mainHTML = document.createElement('div');
        mainHTML.innerHTML = `<p id="hotkeysMessage" class="bigWord" aria-live="assertive">Some hotkeys can be changed by clicking on them</p>
        ${globalSave.MDSettings[0] ? `<p>Swipe Left or Right ‒ <span class="whiteText">change current tab</span></p>
        <p>Swipe Down or Up ‒ <span class="whiteText">change current subtab</span></p>` : ''}
        <label id="tabRightHotkey"><button></button> ‒ <span class="whiteText">change tab to the next one</span></label>
        <label id="tabLeftHotkey"><button></button> ‒ <span class="whiteText">change tab to the previous one</span></label>
        <label id="subtabUpHotkey"><button></button> ‒ <span class="whiteText">change subtab to the next one</span></label>
        <label id="subtabDownHotkey"><button></button> ‒ <span class="whiteText">change subtab to the previous one</span></label>
        <label id="stageRightHotkey"><button></button> ‒ <span class="whiteText">change active Stage to the next one</span></label>
        <label id="stageLeftHotkey"><button></button> ‒ <span class="whiteText">change active Stage to the previous one</span></label>
        <p>Numbers ‒ <span class="whiteText">make a Structure</span></p>
        <label id="makeAllHotkey">0 <span class="whiteText">or</span> <button></button> ‒ <span class="whiteText">make all Structures</span></label>
        <p>Shift Numbers ‒ <span class="whiteText">toggle auto Structure</span></p>
        <label id="toggleAllHotkey">Shift 0 <span class="whiteText">or</span> <button></button> ‒ <span class="whiteText">toggle all auto Structures</span></label>
        <label id="exitChallengeHotkey"><button></button> ‒ <span class="whiteText">Exit out of current Challenge</span></label>
        <div>
            <label id="stageHotkey" class="stageText"><button></button> ‒ <span class="whiteText">Stage reset</span></label>
            <label id="dischargeHotkey" class="orangeText stage1Include"><button></button> ‒ <span class="whiteText">Discharge</span></label>
            <label id="vaporizationHotkey" class="blueText stage2Include"><button></button> ‒ <span class="whiteText">Vaporization</span></label>
            <label id="rankHotkey" class="darkorchidText stage3Include"><button></button> ‒ <span class="whiteText">Rank</span></label>
            <label id="collapseHotkey" class="orchidText stage4Include"><button></button> ‒ <span class="whiteText">Collapse</span></label>
            <label id="galaxyHotkey" class="grayText stage5Include"><button></button> ‒ <span class="whiteText">Galaxy</span></label>
            <label id="mergeHotkey" class="darkvioletText stage5Include"><button></button> ‒ <span class="whiteText">Merge</span></label>
            <label id="universeHotkey" class="darkvioletText stage6Include"><button></button> ‒ <span class="whiteText">Universe</span></label>
            <label id="pauseHotkey" class="grayText"><button></button> ‒ <span class="whiteText">pause</span></label>
        </div>
        <p>Enter <span class="whiteText">or</span> Space ‒ <span class="whiteText">click selected HTML Element or confirm Alert</span></p>
        <p>Escape ‒ <span class="whiteText">cancel changing hotkey, close Alert or Notification</span></p>
        <p>Tab <span class="whiteText">and</span> Shift Tab ‒ <span class="whiteText">select another HTML Element</span></p>
        <p>Holding Enter on last selected button will repeatedly press it, also works with Mouse and Touch events on some buttons</p>
        <label id="hotkeysToggleLabel" title="Turn ON, if using non QWERTY layout keyboard">Language dependant hotkeys </label>
        <button id="restoreHotkeys" type="button">Restore default hotkeys values</button>`;
        getQuery('#bigWindow > div').prepend(mainHTML);
        mainHTML.id = 'hotkeysHTML';
        const toggle = getId('globalToggle0');
        toggle.className = 'specialToggle';
        toggle.style.display = '';
        getId('hotkeysToggleLabel').append(toggle);
        specialHTML.styleSheet.textContent += '#hotkeysHTML { display: flex; flex-direction: column; align-items: center; row-gap: 0.2em; } #hotkeysHTML > div { display: grid; grid-template-columns: 1fr 1fr 1fr; width: 100%; gap: 0.3em; } #hotkeysHTML > div label { justify-self: center; width: max-content; }';
        specialHTML.styleSheet.textContent += '#hotkeysHTML button:not(.specialToggle) { color: inherit; background-color: unset; border-width: 1px; border-color: inherit; border-right: none; border-left: none; border-top: none; font-size: inherit; height: unset; }';

        const changeHotkey = async(disableFirstUp = false): Promise<string[] | null> => {
            return await new Promise((resolve) => {
                getId('hotkeysMessage').textContent = 'Awaiting new value for the hotkey';
                const body = document.body;
                let result: null | string[] = null;
                const prevent = (event: KeyboardEvent) => {
                    const code = event.code;
                    if (code === 'Tab') { return; }
                    event.preventDefault();
                    if (code === 'Escape' || ((code === 'Enter' || code === 'Space') && document.activeElement === getId('closeBigWindow'))) {
                        finish();
                    }
                };
                const detect = async(event: KeyboardEvent) => {
                    if (disableFirstUp) { return void (disableFirstUp = false); }
                    const { key, code } = event;
                    if (code === 'Tab' || code === 'Escape') { return; }
                    let prefix = event.metaKey ? 'Meta ' : '';
                    if (event.ctrlKey) { prefix += 'Ctrl '; }
                    if (event.shiftKey) { prefix += 'Shift '; }
                    if (event.altKey) { prefix += 'Alt '; }
                    if ((!isNaN(Number(code.replace('Digit', '').replace('Numpad', ''))) && code !== '') ||
                        key === 'Meta' || key === 'Control' || key === 'Shift' || key === 'Alt' || code === 'Enter' || code === 'Space') {
                        getId('hotkeysMessage').textContent = `Value '${prefix}${globalSave.toggles[0] ? key : code}' for hotkeys isn't allowed`;
                        return;
                    }
                    result = [`${prefix}${key.length === 1 ? key.toUpperCase() : key.replace('Arrow', 'Arrow ')}`,
                        `${prefix}${key.length === 1 ? code.replace('Key', '') : code.replace('Arrow', 'Arrow ')}`];
                    finish();
                };
                const finish = () => {
                    body.removeEventListener('keydown', prevent);
                    body.removeEventListener('keyup', detect);
                    body.removeEventListener('click', finish, { capture: true });
                    global.hotkeys.disabled = false;
                    resolve(result);
                };
                global.hotkeys.disabled = true;
                body.addEventListener('keydown', prevent);
                body.addEventListener('keyup', detect);
                body.addEventListener('click', finish, { capture: true });
            });
        };
        const index = globalSave.toggles[0] ? 0 : 1;
        for (const key in globalSaveStart.hotkeys) {
            const button = getQuery(`#${key}Hotkey > button`) as HTMLButtonElement;
            const hotkeyTest = globalSave.hotkeys[key as hotkeysList][index];
            button.textContent = hotkeyTest == null || hotkeyTest === '' ? 'None' : hotkeyTest;
            button.type = 'button';
            button.addEventListener('click', async(event) => {
                const button = getQuery(`#${key}Hotkey > button`);
                button.style.borderBottomStyle = 'dashed';
                const newHotkey = await changeHotkey(event.clientX <= 0); //Check if click was caused by pressing Enter
                if (newHotkey !== null) {
                    const index = globalSave.toggles[0] ? 0 : 1;
                    const removed = removeHotkey(newHotkey[index]);
                    if (removed !== null && removed !== key) { getQuery(`#${removed}Hotkey > button`).textContent = 'None'; }
                    button.textContent = newHotkey[index];
                    globalSave.hotkeys[key as hotkeysList] = newHotkey;
                    assignHotkeys();
                    saveGlobalSettings();
                }
                button.style.borderBottomStyle = '';
                getId('hotkeysMessage').textContent = 'Some hotkeys can be changed by clicking on them';
            });
        }
        getId('restoreHotkeys').addEventListener('click', () => {
            globalSave.hotkeys = deepClone(globalSaveStart.hotkeys);
            const index = globalSave.toggles[0] ? 0 : 1;
            for (const key in globalSave.hotkeys) {
                getQuery(`#${key}Hotkey > button`).textContent = globalSave.hotkeys[key as hotkeysList][index] as string;
            }
            assignHotkeys();
            saveGlobalSettings();
        });
        stageUpdate(false);
        visualTrueStageUnlocks();
    }

    specialHTML.bigWindow = 'hotkeys';
    const body = document.body;
    const closeButton = getId('closeBigWindow');
    const mainHTML = getId('hotkeysHTML');
    const windowHMTL = getId('bigWindow');
    const key = (event: KeyboardEvent) => {
        if (specialHTML.alert[0] !== null || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) { return; }
        const code = event.code;
        if ((!global.hotkeys.disabled && code === 'Escape') || ((code === 'Enter' || code === 'Space') && document.activeElement === closeButton)) {
            event.preventDefault();
            close();
        }
    };
    const close = () => {
        specialHTML.bigWindow = null;
        windowHMTL.style.display = 'none';
        mainHTML.style.display = 'none';
        body.removeEventListener('keydown', key);
        closeButton.removeEventListener('click', close);
    };
    body.addEventListener('keydown', key);
    closeButton.addEventListener('click', close);
    mainHTML.style.display = '';
    windowHMTL.style.display = '';
    getQuery('#tabRightHotkey > button').focus();
};
