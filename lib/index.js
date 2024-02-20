const cs = new CSInterface;
const effectsInstances = [];

const checkSystemInfo = () => {
    const currentOS = {
        path: cs.getSystemPath(SystemPath.EXTENSION),
        os: cs.getOSInformation().toLowerCase(),
    }
    currentOS.index = currentOS.os.indexOf('win') >= 0 ? 0 : 1;

    cs.evalScript(`setOSValue('${JSON.stringify(currentOS)}')`);
}
const isItFirstUse = () => {
    cs.evalScript(`isItFirstUseJSX('${cs.getSystemPath(SystemPath.EXTENSION)}')`, function (res) {
        const data = JSON.parse(res);
        if (data.isItFirstUse) {
            cs.openURLInDefaultBrowser("https://mbugajski.pl/plugins/edit-speedbooster-use-guide");
        }
    })
}
const toggleLayoutMode = () => {
    document.getElementById("appContent").classList.toggle("hidden");
    document.getElementById("appCreatorMode").classList.toggle("hidden");
}
const supportReference = () => {
    cs.openURLInDefaultBrowser("https://mbugajski.pl/plugins/");
}
const loadEffectsList = () => {
    const appContainer = document.getElementById("appContent");

    cs.evalScript("$.processEffects.getEffectsArray()", function (effectsArray) {
        const arrayFromCSInterface = JSON.parse(effectsArray);
        const effectsListBox = document.createElement("div");
        effectsListBox.classList.add("effectsCollector");
        appContainer.append(effectsListBox);

        if (arrayFromCSInterface) {
            for (let effect of arrayFromCSInterface) {
                let newEffect = new EffectInstance(effectsListBox, effect.name, effect.properties);
                effectsInstances.push(newEffect);
                newEffect.createEffectBar();
            }
        } else {
            const errorAlert = document.createElement("div");
            errorAlert.classList.add("alertBox");
            const content = document.createElement("p");
            content.classList.add("alertContent");
            content.innerText = "No effects found";
            content.addEventListener("click", toggleLayoutMode);
            errorAlert.append(content);
            appContainer.append(errorAlert);
        }
    })
}
const toggleClipsCounter = (event) => {
    const trackIndexSelector = document.getElementById("trackIndexSelector");

    if (event.target.value == "on track") {
        trackIndexSelector.classList.remove("hidden");
    } else {
        trackIndexSelector.classList.add("hidden");
    }
}
const attachBodyScripts = () => {
    document.getElementById("supportButton").addEventListener("click", supportReference);
    document.getElementById("applyFor").addEventListener("click", toggleClipsCounter);
}
const loadConfigValues = () => {
    cs.evalScript(`loadConfigurationFile()`, function (configJSON) {
        const config = JSON.parse(configJSON);

        const applyForSelector = document.getElementById("applyFor");
        const trackIndexSelector = document.getElementById("trackIndexSelector");

        if (config.status) {
            if (config.applyFor != undefined && config.applyFor != null) {
                applyForSelector.selectedIndex = config.applyFor;
                if (config.applyFor == 1) {
                    trackIndexSelector.classList.remove("hidden");
                }
            }
        } else {
            return 0;
        }
    })
}

addEventListener("contextmenu", e => e.preventDefault());
addEventListener("load", checkSystemInfo);
addEventListener("load", isItFirstUse);
addEventListener("load", loadConfigValues);
addEventListener("load", loadEffectsList);
addEventListener("load", attachBodyScripts);