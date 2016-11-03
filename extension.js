'use strict';
var Constellation = require('constellation-client');
var request = require('request');

var MessageNames = {
    dashboard: {
        updateRequest: 'beam-dashboard-update-request'
    },
    user: {
        sparks: 'beam-user-sparks',
        exp: 'beam-user-exp'
    },
    channel: {
        online: 'beam-channel-online',
        offline: 'beam-channel-offline',
        followed: 'beam-channel-followed',
        unfollowed: 'beam-channel-unfollowed',
    }
}

module.exports = function (nodecg) {

    if (!nodecg.bundleConfig || !Object.keys(nodecg.bundleConfig).length) {
		throw new Error('Missing config file cfg/nodecg-beam-service.json. Aborting!');
	}

    var ReplicantData = {
        channel: {
            viewers: {
                current: nodecg.Replicant('ChannelCurrentViewers', {defaultValue: 0}),
                total: nodecg.Replicant('ChannelTotalViewers', {defaultValue: 0})
            },
            followers: {
                total: nodecg.Replicant('ChannelTotalFollowers', {defaultValue: 0})
            }
        }
    };

    function UpdateChannelFromRestAPIDelayed() {
        //@TODO: Use debounce
        setTimeout(UpdateChannelFromRestAPI, 6000);
    }

    function UpdateChannelFromRestAPI()
    {
        request(`https://beam.pro/api/v1/channels/${nodecg.bundleConfig.channel}`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                ReplicantData.channel.viewers.current.value = data.viewersCurrent;
                ReplicantData.channel.viewers.total.value = data.viewersTotal;
                ReplicantData.channel.followers.total.value = data.numFollowers;
            }
        });
    }

    setTimeout(UpdateChannelFromRestAPI, 3000);    

    const channelId = nodecg.bundleConfig.channel;
    const userId = nodecg.bundleConfig.user;

    const constellation = new Constellation();
    constellation.on(`user:${userId}:update`, data => {
        //nodecg.sendMessage('beam-user-update', data);
    });

    constellation.on(`channel:${channelId}:followed`, data => {
        if (data.following) {
            nodecg.sendMessage(MessageNames.channel.followed, data);
            ReplicantData.channel.followers.total.value = ReplicantData.channel.followers.total.value + 1;
        }
        else {
            nodecg.sendMessage(MessageNames.channel.unfollowed, data);
            ReplicantData.channel.followers.total.value = ReplicantData.channel.followers.total.value - 1;
        }
    });

    constellation.on(`channel:${channelId}:status`, data => {
        //nodecg.sendMessage('beam-channel-status', data);
    });

    constellation.on(`channel:${channelId}:update`, data => {
        if (data.hasOwnProperty('viewersCurrent'))
        {
            ReplicantData.channel.viewers.current.value = data.viewersCurrent;
        }
        if (data.hasOwnProperty('viewersTotal'))
        {
            ReplicantData.channel.viewers.total.value = data.viewersTotal;
        } 
    });

    nodecg.listenFor(MessageNames.dashboard.updateRequest, function(message) {
        UpdateChannelFromRestAPI();
    });

};
