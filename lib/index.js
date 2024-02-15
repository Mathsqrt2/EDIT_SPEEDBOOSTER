const cs = new CSInterface;

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
    cs.evalScript("$.processEffects.loadExistingValues")
}
const attachBodyScripts = () => {
    document.getElementById("supportButton").addEventListener("click",supportReference);
}

addEventListener("contextmenu", e => e.preventDefault());
addEventListener("load", checkSystemInfo);
addEventListener("load", isItFirstUse);
addEventListener("load", attachBodyScripts);
addEventListener("load", loadEffectsList);