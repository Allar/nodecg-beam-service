module.exports = function (nodecg) {

    return {
        MessageNames: {
            dashboard: {
                updateRequest: 'dashboard-update-request'
            },
            channel: {
                online: 'beam-channel-online',
                offline: 'beam-channel-offline',
                followed: 'beam-channel-followed',
                unfollowed: 'beam-channel-unfollowed',
            }
        },
        ReplicantData: {
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
                typeId: nodecg.Replicant('ChannelDescription', {defaultValue: "Unknown"}),
                interactive: nodecg.Replicant('ChannelInteractive', {defaultValue: false}),
                interactiveGameId: nodecg.Replicant('ChannelInteractiveGameId', {defaultValue: 0})
            }
        }
    };
}