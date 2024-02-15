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
const supportReference = () => {
    cs.openURLInDefaultBrowser("https://mbugajski.pl/plugins/");
}
const loadEffectsList = () => {
    const appContainer = document.getElementById("appContent");
    cs.evalScript("$.processEffects.getEffectsArray()", function (effectsArray) {
        let effects = JSON.parse(effectsArray);

        if(effects){
            for (let effect of effects) {
                let newEffect = new EffectInstance(appContainer,effect.name,effect.properties);
                effectsInstances.push(newEffect);
                newEffect.createEffectBar();
            }
        } else {
            const errorAlert = document.createElement("div");
            errorAlert.classList.add("alertBox");
            const content = document.createElement("p");
            content.classList.add("alertContent");
            content.innerText = "No effects found";
            errorAlert.append(content);
            appContainer.append(errorAlert);

        }
    })
}
const attachBodyScripts = () => {
    document.getElementById("supportButton").addEventListener("click", supportReference);
}

addEventListener("contextmenu", e => e.preventDefault());
addEventListener("load", checkSystemInfo);
addEventListener("load", isItFirstUse);
addEventListener("load", attachBodyScripts);
addEventListener("load", loadEffectsList);