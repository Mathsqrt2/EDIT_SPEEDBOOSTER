class EffectInstance {
    constructor(origin = null, effectName = null, effectProperties = []) {
        this.origin = origin;
        this.name = effectName;
        this.properties = effectProperties;
        this.effectBars = null;
    }
    createEffectBar = () => {
        const effectBody = this.nItem(this.origin, "div", "effectBody");
        const effectHeader = this.nItem(effectBody, "div", "effectHeader");
        const effectNameBox = this.nItem(effectHeader, ["p", this.name.toUpperCase()], "effectNameBox");
        const buttonsCollector = this.nItem(effectHeader, "div", "buttonsCollector");
        const effectExecute = this.nItem(buttonsCollector, ["input", "button", "EXECUTE"], "effectButton", "executeEffectButton");
        effectExecute.addEventListener("click", this.processEffects);
        const effectShowHide = this.nItem(buttonsCollector, ["input", "button", "SHOW"], "effectButton", "showHideEffectButton");
        effectShowHide.addEventListener("click", this.togglePropsVisibility);
        const effectContent = this.nItem(effectBody, "div", ["effectConent", "hidden"]);

        const bar = {
            body: effectBody,
            header: {
                origin: effectHeader,
                name: effectNameBox,
                buttons: {
                    origin: buttonsCollector,
                    execute: effectExecute,
                    display: effectShowHide
                }
            },
            content: {
                origin: effectContent,
            }
        }
        this.effectBar = bar;

        for (let newProperty of this.properties) {
            const box = this.nItem(effectContent, "div", "effectBox");
            if (newProperty.type != "alert") {
                this.drawEffectPropertyLabel(box, newProperty);
            }
            this.drawEffectValues(box, newProperty);
            this.nItem(box, "div", "propertySeparator");
        }

        return bar;
    }
    togglePropsVisibility = (event) => {
        if (event.target.value == "SHOW") {
            event.target.value = "HIDE";
            this.effectBar.content.origin.classList.remove("hidden");
        } else {
            event.target.value = "SHOW";
            this.effectBar.content.origin.classList.add("hidden");
        }
    }
    processEffects = () => {
        const dataset = {
            name: this.name,
            props: this.properties,
        }

        const configValues = {
            applyFor: document.getElementById("applyFor").selectedIndex,
        }

        cs.evalScript(`$.processEffects.saveConfigValues('${JSON.stringify(configValues)}')`);
        cs.evalScript(`$.processEffects.implementEffect('${JSON.stringify(dataset)}')`);
    }
    drawEffectPropertyLabel = (origin, property) => {
        return this.nItem(origin, ["p", property.name], "effectPropertyLabel");
    }
    drawEffectValues = (origin, property) => {
        if (property.type == "alert") {
            const alertBox = this.nItem(origin, "div", "alertBox");
            this.nItem(alertBox, ["p", property.value], "noEditablePropertiesWarning");
            return alertBox;
        }

        if (property.type == "array") {
            const inputsBox = this.nItem(origin, "div", "inputsBox");
            for (let dimension of prop.value) {
                this.nItem(inputsBox, ["input", property.type, dimension], 'arraySubPropertyInput');
            }

        } else {
            return this.nItem(origin, ["input", property.type, property.value], 'subPropertyInput');
        }
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