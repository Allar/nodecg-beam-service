# nodecg-beam-service

This is a nodecg bundle that provides access to [Beam.pro](http://beam.pro) channel and user data.

This doesn't provide any graphical elements itself, but allows other bundles to easily grab Beam info and catch Beam events.

# Installation

Navigate to your `bundles` folder of your nodecg site, and run:

```
nodecg install Allar/nodecg-beam-service
```

You must configure the bundle before it can be loaded.

# Configuration

Create file named `cfg/nodecg-beam-service.json` inside your nodecg site. You must provide both a channel and user id.

Example config file:

```
{
  "channel": 329582,
  "user": 468820
}
```

## Getting User and Channel IDs

The easiest way to get your user id is to:

1. Log into Beam.pro
1. Navigate your browser to [http://beam.pro/api/v1/channels/AwesomeAllar]

Replace 'AwesomeAllar' in the url above with your channel's name. You should get a nice piece of JSON data back. The first two fields of this data are what we are interested in.

Example JSON:

```
{
	"id":329582,
	"userId":468820,
	"token":"AwesomeAllar",
	...
}
```

The first field `id` is your channel id.

The second field `userId` is your user id.

# Accessing Beam Data

This service provides Beam data in two ways. Replicants and messages.

## Replicants

### User

* `UserSparks`: Integer, sparks user currently has.
* `UserExp`: Integer, experience user currently has.

### Channel

* `ChannelOnline`: Boolean, whether channel is currently streaming.
* `ChannelName`: String, title of the channel.
* `ChannelAudience`: String, audience of the channel (family, teen, 18+).
* `ChannelViewersTotal`: Number, the number of views the channel has.
* `ChannelViewersCurrent`: Number, the number of viewers currently watching the channel.
* `ChannelFollowers`: Number, the number of users following the channel.
* `ChannelDescription`: String, description for the channel.
* `ChannelTypeId`: Number, id of the channel type.
* `ChannelInteractive`: Boolean, whether channel is interactive.
* `ChannelInteractiveGameId`: Number, id of the interactive game channel is running.

## Messages

### Dashboard

* `dashboard-update-request`: If this bundle receives this message, it will trigger a force update of the channel data using Beam's REST API.

### Channel

* `channel-followed`: Sent when a user follows this channel. Sends Beam [User](https://dev.beam.pro/rest.html#User) of follower.
* `channel-unfollowed`: Sent when a user unfollows this channel. Sends Beam [User](https://dev.beam.pro/rest.html#User) of unfollower.

