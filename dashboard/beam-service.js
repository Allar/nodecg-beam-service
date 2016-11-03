'use strict';

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

ReplicantData.channel.viewers.current.on('change', function(newValue, oldValue) {
    document.getElementById("Viewers").textContent=newValue;
});

ReplicantData.channel.followers.total.on('change', function(newValue, oldValue) {
    document.getElementById("Followers").textContent=newValue;
});

nodecg.sendMessage('beam-dashboard-update-request', null);