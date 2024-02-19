var proj = app.project;
var seq = proj.activeSequence;
var currentOS;
var pluginPath;

$.processEffects = {
    getEffectsArray: function() {
        var effectsArray = [];
        var effectsSave = new File(pluginPath + this.fixPath("\\config\\effects.json"));

        if (!effectsSave.exists) {
            return effectsArray;
        }
        effectsSave.open("r");
        effectsArray = effectsSave.read();
        effectsSave.close();

        return effectsArray;
    },
    implementEffect: function(dataset) {
        var data = JSON.parse(dataset);
        alert(data.name);
        return 0;
    },
    saveConfigValues: function(configValues) {

        var configContent = JSON.parse(configValues);
        configContent.status = true;
        var configPath = pluginPath + "\\config\\config.json";
        var config = new File(configPath);

        config.open("w");
        config.write(JSON.stringify(configContent));
        config.close();
    },
    findElements: function() {
        return 0;
    },
    fixPath: function(pathToFix) {
        var newPath = pathToFix;
        if (!currentOS) {
            while (newPath.indexOf("/") > 0) {
                newPath = newPath.replace('/', '\\');
            }
            return newPath;
        } else {
            while (newPath.indexOf("\\") > 0) {
                newPath = newPath.replace("\\", "/");
            }
            return newPath;
        }
    },
}

function setOSValue(csinfo) {
    var obj = JSON.parse(csinfo);
    currentOS = obj.index;
    pluginPath = $.processEffects.fixPath(obj.path);
}

function isItFirstUseJSX(path) {
    var newResponse = {
        isItFirstUse: true,
        actionTime: null,
    };

    var logPath = $.processEffects.fixPath(path) + $.processEffects.fixPath("\\logs\\firstLaunchLog.json");
    var firstLaunchLog = new File(logPath);

    if (firstLaunchLog.exists) {
        newResponse.isItFirstUse = false;
    } else {
        var currentTime = new Date();
        newResponse.actionTime = currentTime.getTime();
        firstLaunchLog.open("w");
        firstLaunchLog.write(JSON.stringify(newResponse));
        firstLaunchLog.close();
    }

    var output = JSON.stringify(newResponse);
    return output;
}

function loadConfigurationFile() {

    var configPath = pluginPath + "\\config\\config.json";
    var config = new File(configPath);

    var configResponse = {
        status: false,
    }

    if (config.exists) {

        config.open("r");
        configResponse = config.read();
        configResponse.status = true;
        config.close();

        return configResponse;
    } else {
        return JSON.stringify(configResponse);
    }

}