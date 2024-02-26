class EffectInstance {
    constructor(origin = null, effectName = null, effectid = null, effectProperties = []) {
        this.origin = origin;
        this.name = effectName;
        this.properties = effectProperties;
        this.effectBars = null;
        this.id = effectid;
    }
    createEffectBar = () => {
        const effectBody = this.nItem(this.origin, "div", "effectBody");
        const effectHeader = this.nItem(effectBody, "div", "effectHeader");
        const effectNameBox = this.nItem(effectHeader, ["p", this.name.toUpperCase()], "effectNameBox");
        effectNameBox.addEventListener("click", this.togglePropsVisibility)
        const buttonsCollector = this.nItem(effectHeader, "div", "buttonsCollector");
        const effectExecute = this.nItem(buttonsCollector, ["input", "button", "EXECUTE"], ["effectButton", "executeEffectButton"]);
        effectExecute.addEventListener("click", this.processEffects);
        const effectShowHide = this.nItem(buttonsCollector, ["input", "button", "SHOW"], ["effectButton", "showHideEffectButton"]);
        effectShowHide.addEventListener("click", this.togglePropsVisibility);
        const effectContent = this.nItem(effectBody, "div", ["effectContent", "hidden"]);

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
            this.nItem(effectContent, "div", "propertySeparator");
            const box = this.nItem(effectContent, "div", "effectBox");
            if (newProperty.type != "alert") {
                this.drawEffectPropertyLabel(box, newProperty);
            }
            this.drawEffectValues(box, newProperty);
        }

        return bar;
    }
    togglePropsVisibility = () => {
        this.effectBar.content.origin.classList.toggle("hidden");
        this.effectBar.header.buttons.display;
        btn.value == "SHOW" ? btn.value = "HIDE" : btn.value = "SHOW";
    }
    processEffects = () => {
        const trackIndexSelector = document.getElementById("trackIndexSelector") == "" ? 0 : document.getElementById("trackIndexSelector");
        const applyFor = document.getElementById("applyFor").selectedIndex;

        const dataset = JSON.stringify({
            name: this.name,
            id: this.id,
            props: this.properties
        });

        const config = JSON.stringify({
            applyFor: applyFor,
            track: applyFor == 1 ? Number(trackIndexSelector.value) : null
        });

        cs.evalScript(`$.processEffects.saveConfigValues('${dataset}','${config}')`);
        cs.evalScript(`$.processEffects.implementEffect('${dataset}')`);
    }
    drawEffectPropertyLabel = (origin, property) => {
        if (property.unit) {
            return this.nItem(origin, ["p", `${property.name} ${property.unit}`], "effectPropertyLabel");
        } else {
            return this.nItem(origin, ["p", property.name], "effectPropertyLabel");
        }

    }
    drawEffectValues = (origin, property) => {
        if (property.type == "alert") {
            const alertBox = this.nItem(origin, "div", "alertBox");
            this.nItem(alertBox, ["p", property.value], "noEditablePropertiesWarning");
            return alertBox;
        }

        else if (property.type == "switch") {
            const switchBox = this.nItem(origin, "div","mainSwitchBox");
            const selector = this.nItem(switchBox, "select", "switchSelector");
            const optionsHTML = [];
            for (let option of property.options) {
                this.nItem(selector, ["option", option], "options");
                if (option == "custom") {
                    const switchInput = this.nItem(switchBox, ["input", "text"], ["customSwitchOption", "hidden"]);
                    if(!property.options.includes(property.value)){
                        switchInput.classList.remove("hidden");
                        switchInput.value = property.value;
                    } else {
                        switchInput.value = "new custom value";
                    }
                    switchInput.addEventListener("change", e => {
                        let newVal = e.target.value;
                        this.properties[property.subpropID].value = newVal;
                    })
                    optionsHTML.push(switchInput);
                }
            }
            if(property.options.includes(property.value)){
                selector.value = property.value;
            } else{
                this.properties[property.subpropID].value = property.value;
                selector.value = "custom";
            }
            selector.addEventListener("change", e => {
                this.properties[property.subpropID].value = e.target.value;
            })

            selector.addEventListener("change", e => {
                optionsHTML.forEach(element => {
                    if (element.classList.contains("customSwitchOption")) {
                        if (e.target.value == "custom") {
                            element.classList.remove("hidden");
                        } else {
                            element.classList.add("hidden");
                        }
                    }
                })
            })

            return switchBox
        } else if (property.type == "number") {
            if (property.min != undefined && property.max != undefined) {
                const box = this.nItem(origin, "div", "rangeSelectorBox");
                const rangeLabelBox = this.nItem(box, "div", "rangeLabel");
                this.nItem(rangeLabelBox, ["p", `value:`], "rangeInputName");
                const numberField = this.nItem(rangeLabelBox, ["input", "number", property.value], ["rangeInputValue", "rangeNumber"]);
                numberField.max = property.max;
                numberField.min = property.min;
                numberField.step = 0.1;
                numberField.addEventListener("input", e => {
                    let newVal = Number(e.target.value).toFixed(1);
                    e.target.parentNode.parentNode.childNodes[1].childNodes[1].value = newVal;
                    this.properties[property.subpropID].value = newVal;
                })
                const rangeContent = this.nItem(box, "div", "rangeContent");
                this.nItem(rangeContent, ["p", `${property.min} min`], "rangeScale");
                const rangeInput = this.nItem(rangeContent, ["input", "range", property.value], "rangeSelector");
                rangeInput.max = property.max;
                rangeInput.min = property.min;
                rangeInput.step = 0.1;
                rangeInput.addEventListener("input", e => {
                    let newVal = Number(e.target.value).toFixed(1);
                    e.target.parentNode.parentNode.childNodes[0].childNodes[1].value = newVal;
                    this.properties[property.subpropID].value = newVal;
                })
                this.nItem(rangeContent, ["p", `${property.max} max`], "rangeScale");

                return box;
            } else {
                return this.nItem(origin, ["input", property.type, property.value], "subPropertyInput");
            }
        }


        else if (property.type == "array") {
            const inputsBox = this.nItem(origin, "div", "inputsBox");
            for (let dimension of prop.value) {
                this.nItem(inputsBox, ["input", property.type, dimension], "arraySubPropertyInput");
            }

        } else {
            return this.nItem(origin, ["input", property.type, property.value], "subPropertyInput");
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