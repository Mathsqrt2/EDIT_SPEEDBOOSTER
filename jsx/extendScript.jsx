var proj = app.project;
var seq = proj.activeSequence;
var currentOS;
var pluginPath;

$.processEffects = {
    foundClips: [],
    config: {},
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
        this.findElements(this.config.applyFor);
    
    
        return 0;
    },
    saveConfigValues: function(dataset, configValues) {
        var datasetContent = JSON.parse(dataset);
        var configContent = JSON.parse(configValues);
        this.config = configContent;
    
        configContent.status = true;
        
        var configPath = pluginPath + this.fixPath("\\config\\config.json");
        var config = new File(configPath);

        config.open("w");
        config.write(JSON.stringify(configContent));
        config.close();

        var tempValues;
        var effectsPath = pluginPath + this.fixPath("\\config\\effects.json");
        var effects = new File(effectsPath);
        effects.open("r");
        tempValues = JSON.parse(effects.read());
        effects.close();

        tempValues[datasetContent.id].properties = datasetContent.props;
        effects.open("w");
        effects.write(JSON.stringify(tempValues));
        effects.close();
    },
    findElements: function(mode) {
        var tracks = seq.videoTracks;
        this.foundClips = [];
        if (mode == 0) {
            for (var i = 0; i < tracks.length; i++) {
                var currentTrack = tracks[i];
                for (var j = 0; j < currentTrack.clips.length; j++) {
                    var currentClip = currentTrack.clips[j];
                    this.foundClips.push(currentClip);
                }
            }
        } else if (mode == 1) {
            var clipsOnTrackCounter = 0;
            var currentTrack = tracks[this.config.track];
            for (var i = 0; i < currentTrack.clips.length; i++) {
                var currentClip = currentTrack.clips[i];
                this.foundClips.push(currentClip);
                clipsOnTrackCounter++;
            }
            if(!clipsOnTrackCounter){
                alert("This track doesn't contain any clips");
            }
        } else if (mode == 2) {
            var selectedCounter = 0;
            for (var i = 0; i < tracks.length; i++) {
                var currentTrack = tracks[i];
                for (var j = 0; j < currentTrack.clips.length; j++) {
                    var currentClip = currentTrack.clips[j];
                    if (currentClip.isSelected()) {
                        this.foundClips.push(currentClip);
                        selectedCounter++;
                    }
                }
            }
            if (!selectedCounter) {
                alert("Please select clips!");
            }
        }
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