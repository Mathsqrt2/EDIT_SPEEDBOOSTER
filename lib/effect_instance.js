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
    processEffects = (range) =>{
        cs.evalScript(`test()`);
    }
}