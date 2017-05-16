'use strict';
var Constellation = require('constellation-client');
var request = require('request');

function array_contains(arr, obj) {
    for (var i = 0; i < arr.length; ++i) {
        if (arr[i] === obj){
            return true;
        }
    }
    return false;
}

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
                    if (key == "user") {
                        Object.keys(data.user).forEach(function(user_key, user_index) {
                            if (RepsAndNames.ReplicantData.user.hasOwnProperty(user_key)) {
                                RepsAndNames.ReplicantData.user[user_key].value = data.user[user_key];
                            }
                        });
                    } else {
                        if (RepsAndNames.ReplicantData.channel.hasOwnProperty(key)) {
                            RepsAndNames.ReplicantData.channel[key].value = data[key];
                        }
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
            var refollowing = array_contains(RepsAndNames.ReplicantData.channel.announcedFollowers.value, data.user.username);
            if (RepsAndNames.ReplicantData.dashboard.allowRefollow.value || !refollowing) {
                if (!refollowing) {
                    RepsAndNames.ReplicantData.channel.announcedFollowers.value.push(data.user.username);
                }
                nodecg.sendMessage(RepsAndNames.MessageNames.channel.followed, data.user);
            }
        }
        else {
            nodecg.sendMessage(RepsAndNames.MessageNames.channel.unfollowed, data.user);
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
