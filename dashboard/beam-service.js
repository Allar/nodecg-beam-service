'use strict';

//@TODO: Make this better and some how use reps-and-names.js
var RepsAndNames = {
    MessageNames: {
        dashboard: {
            updateRequest: 'dashboard-update-request'
        },
        channel: {
            followed: 'channel-followed',
            unfollowed: 'channel-unfollowed'
        }
    },
    ReplicantData: {
        dashboard: {
            allowRefollow: nodecg.Replicant('DashboardAllowRefollow', {defaultValue: false})
        },
        user: {
            sparks: nodecg.Replicant('UserSparks', {defaultValue: 0}),
            experience: nodecg.Replicant('UserExp', {defaultValue: 0})
        },
        channel: {
            online: nodecg.Replicant('ChannelOnline', {defaultValue: "Unknown"}),
            name: nodecg.Replicant('ChannelName', {defaultValue: "Unknown"}),
            audience: nodecg.Replicant('ChannelAudience', {defaultValue: "family"}),
            viewersTotal: nodecg.Replicant('ChannelViewersTotal', {defaultValue: 0}),
            viewersCurrent: nodecg.Replicant('ChannelViewersCurrent', {defaultValue: 0}),
            numFollowers: nodecg.Replicant('ChannelFollowers', {defaultValue: 0}),
            description: nodecg.Replicant('ChannelDescription', {defaultValue: "Unknown"}),
            typeId: nodecg.Replicant('ChannelTypeId', {defaultValue: 0}),
            interactive: nodecg.Replicant('ChannelInteractive', {defaultValue: false}),
            interactiveGameId: nodecg.Replicant('ChannelInteractiveGameId', {defaultValue: 0}),
            announcedFollowers: nodecg.Replicant('ChannelAnnouncedFollowers', {defaultValue: []}),
        }
    }
};

RepsAndNames.ReplicantData.channel.viewersCurrent.on('change', function(newValue, oldValue) {
    document.getElementById("Viewers").textContent = newValue;
});

RepsAndNames.ReplicantData.channel.numFollowers.on('change', function(newValue, oldValue) {
    document.getElementById("Followers").textContent = newValue;
});

RepsAndNames.ReplicantData.user.sparks.on('change', function(newValue, oldValue) {
    document.getElementById("Sparks").textContent = newValue;
});

RepsAndNames.ReplicantData.user.experience.on('change', function(newValue, oldValue) {
    document.getElementById("Experience").textContent = newValue;
});

nodecg.sendMessageToBundle(RepsAndNames.MessageNames.dashboard.updateRequest, 'nodecg-beam-service');