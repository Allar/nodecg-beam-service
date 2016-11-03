'use strict';
var Constellation = require('constellation-client');
var request = require('request');

module.exports = function (nodecg) {

    var RepsAndNames = require('./reps-and-names.js')(nodecg);

    function UpdateChannelFromRestAPIDelayed() {
        //@TODO: Use debounce
        setTimeout(UpdateChannelFromRestAPI, 6000);
    }

    function UpdateChannelFromRestAPI()
    {
        request(`https://beam.pro/api/v1/channels/${nodecg.bundleConfig.channel}`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                Object.keys(data).forEach(function(key,index) {
                    if (RepsAndNames.ReplicantData.channel.hasOwnProperty(key)) {
                        RepsAndNames.ReplicantData.channel[key].value = data[key];
                    }
                });
            }
        });
    }

    UpdateChannelFromRestAPI();

    const channelId = nodecg.bundleConfig.channel;
    const userId = nodecg.bundleConfig.user;

    const constellation = new Constellation();
    constellation.on(`user:${userId}:update`, data => {
        Object.keys(data).forEach(function(key,index) {
            if (RepsAndNames.ReplicantData.user.hasOwnProperty(key)) {
                RepsAndNames.ReplicantData.user[key].value = data[key];
            }
        });
    });

    constellation.on(`channel:${channelId}:followed`, data => {
        if (data.following) {
            nodecg.sendMessage(RepsAndNames.MessageNames.channel.followed, data);
            RepsAndNames.ReplicantData.channel.followers.total.value = ReplicantData.channel.followers.total.value + 1;
        }
        else {
            nodecg.sendMessage(RepsAndNames.MessageNames.channel.unfollowed, data);
            RepsAndNames.ReplicantData.channel.followers.total.value = ReplicantData.channel.followers.total.value - 1;
        }
    });

    constellation.on(`channel:${channelId}:status`, data => {
        //nodecg.sendMessage('beam-channel-status', data);
    });

    constellation.on(`channel:${channelId}:update`, data => {
        Object.keys(data).forEach(function(key,index) {
            if (RepsAndNames.ReplicantData.channel.hasOwnProperty(key)) {
                RepsAndNames.ReplicantData.channel[key].value = data[key];
            }
        });
    });

    nodecg.listenFor(RepsAndNames.MessageNames.dashboard.updateRequest, function(message) {
        UpdateChannelFromRestAPI();
    });

};
