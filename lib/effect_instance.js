class EffectInstance {
    constructor(origin = null, effectName = null, effectProperties = []) {
        this.origin = origin;
        this.name = effectName;
        this.properties = effectProperties;
    }
    createEffectBar = () => {

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
}