var mongoose = require('mongoose');

exports.connect = function (callback) {
    mongoose.connect('mongodb://localhost/flashair-compat-server');
    mongoose.connection.on("open", function () {
        exports.Config = mongoose.model("Config", exports.ConfigSchema);

        callback();
    });
}

exports.getConfig = function (callback) {
    exports.Config.find({}, function (err, configs) {
        if (err) {
            callback(err);
            return;
        }

        var config = configs.length > 0 ? configs[0] : new exports.Config();
        callback(null, config);
    });         
}

exports.paramGetter = function (paramName) {
    return function (query, callback) {
        exports.getConfig(function (err, config) {
            if (err) {
                callback(err);
            }

            callback(null, config[paramName]);
        });
    };
}

exports.paramSetter = function (paramName) {
    return function (query, callback) {
        exports.getConfig(function (err, config) {
            if (err) {
                callback(err);
                return;
            }

            var attributes = Object.keys(exports.ConfigSchema.paths);
            if (attributes.indexOf(paramName) == -1) {
                console.log(attributes);
                callback("invalid query string '" + paramName + "'");
                return;
            }

            console.log(config);
            config[paramName] = query.value;

            console.log(config);
            config.save(function (err) {
                if (err) {
                    callback(err);
                    return;
                }

                callback(null, 'success');
            });
        });
    }
}

exports.ConfigSchema = mongoose.Schema({
    APPAUTOTIME: Number,
    APPINFO: String,
    APPMODE: { type: Number, default: 4 },
    APPNAME: { type: String, default: 'myflashair-compat' },
    APPNETWORKKEY: { type: String, default: '12345678' },
    APPSSID: { type: String, default: 'flashair-compat' },
    BRGNETWORKKEY: String,
    BRGSSID: String,
    CID: String,
    CIPATH: String,
    DELCGI: String,
    DNSMODE: Number,
    IFMODE: Number,
    LOCK: Number,
    MASTERCODE: String,
    NOISE_CANCEL: Number,
    PRODUCT: String,
    UPDIR: String,
    UPLOAD: Number,
    VENDOR: { type: String, default: 'MIT Media Lab' },
    VERSION: String,

    APPCHANNEL: { type: Number, min: 0, max: 14, default: 1 },

    BLE_NAME: { type: String, default: 'myble' },
    BLE_SERVICE_UUID: { type: String, default: 'fffffffffffffffffffffffffffffff0' },
    TIME_TO_SLEEP: { type: Number, default: 180000 }
});
