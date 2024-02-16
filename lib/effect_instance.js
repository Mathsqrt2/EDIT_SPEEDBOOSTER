class EffectInstance {
    constructor(origin = null, effectName = null, effectProperties = []) {
        this.origin = origin;
        this.name = effectName;
        this.properties = effectProperties;
    }
    createEffectBar = () => {
        const effectBody = this.nItem(this.origin, "div", "effectBody");
        const effectHeader = this.nItem(effectBody, "div", "effectHeader");
        const effectNameBox = this.nItem(effectHeader, ["p", this.name], "effectNameBox");
        const buttonsCollector = this.nItem(effectHeader,"div","buttonsCollector");
        const effectExecute = this.nItem(buttonsCollector,["input","button","execute"],"effectButton","executeEffectButton");
        const effectShowHide = this.nItem(buttonsCollector,["input","button","show"],"effectButton","showHideEffectButton");
        const effectContent = this.nItem(effectBody, "div", ["effecConent", "hidden"]);
    }
    appendEffectContent = () => {
    }
    appendEffectProperties = () => {

    }
    processEffects = (range) => {
        const dataset = {
            range: range,
            name: this.name,
            props: this.properties,
        }

        cs.evalScript(`$.processEffects.implementEffect('${JSON.stringify(dataset)}')`);
    }
    nItem = (origin, element, classes, id) => {
        if (origin && element) {
            let newBody;
            if (typeof (element) == 'object') {
                newBody = document.createElement(element[0]);
                if (element[0] == 'input') {
                    newBody.type = element[1];
                    if (element[2]) {
                        newBody.value = element[2];
                    }
                } else if (element[0] == 'img') {
                    newBody.setAttribute('src', element[1]);
                    newBody.setAttribute('alt', element[2]);
                } else {
                    newBody.innerHTML = element[1];
                }
            } else {
                newBody = document.createElement(element);
            } if (classes) {
                if (typeof (classes) == 'object') {
                    classes.forEach(newClass => {
                        newBody.classList.add(newClass);
                    });
                } else {
                    newBody.classList.add(classes);
                }
            }
            if (id) {
                newBody.setAttribute('id', id);
            }
            origin.append(newBody);
            return newBody;
        }
    }
}