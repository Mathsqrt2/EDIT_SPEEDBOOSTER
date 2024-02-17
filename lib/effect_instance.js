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
        const effectContent = this.nItem(effectBody, "div", ["effecConent", "hidden"]);
        for(let property in this.effectProperties){
            this.typeFieldHandling(property);
        }

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
    typeFieldHandling = (prop) => {
        let newInput = document.createElement("div");
        newInput.classList.add("inputHolder");
        if (prop.type == "array") {
            for(let dimension of prop.value){
                this.nItem(this.effectBar.content.origin,["input",prop.type,dimension],'subPropertyInput');
            }
        } else {
            this.nItem(newInput,["input",prop.type,prop.value],'subPropertyInput');
        }
        return newInput;
    }
    appendEffectContent = () => {
    }
    appendEffectProperties = () => {

    }
    processEffects = () => {
        const dataset = {
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