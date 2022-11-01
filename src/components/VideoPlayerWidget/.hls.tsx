import AWS from "aws-sdk"
import * as dotenv from "dotenv"

(async () => {
	dotenv.config()
	// Step 1: Configure SDK Clients
	var options = {
		accessKeyId: process.env.accessKeyId,
		secretAccessKey: process.env.secretAccessKey,
		sessionToken: process.env.sessionToken,
		region: process.env.region
	}
	const StreamName = process.env.StreamName
	var kinesisVideo = new AWS.KinesisVideo(options);
	var kinesisVideoArchivedContent = new AWS.KinesisVideoArchivedMedia(options);
	const protocol = 'GET_HLS_STREAMING_SESSION_URL'
	const res = kinesisVideo.getDataEndpoint({
		StreamName,
		APIName: protocol
	}, (err, res)=>{
		const endpoint = res.DataEndpoint

		kinesisVideoArchivedContent.endpoint = new AWS.Endpoint(endpoint);

		const PlaybackMode = "LIVE" // LIVE_REPLAY(timestampe range is require), ON_DEMAND((timestampe range is require))
		const FragmentSelectorType = "SERVER_TIMESTAMP" //PRODUCER_TIMESTAMP
		const DisplayFragmentTimestamp = "ALWAYS" //"NEVER"
		const MaxManifestFragmentResults = undefined //300이상이어야함.
		const Expires: number = 300 // 300 (5 minutes) and 43200 (12 hours)
		const TimestampRange = undefined
		const MaxMediaPlaylistFragmentResults = undefined
		const ContainerFormat = "FRAGMENTED_MP4" //,MPEG_TS
		const DiscontinuityMode = "ON_DISCONTINUITY" //ALWAYS, NEVER

		const res2 = kinesisVideoArchivedContent.getHLSStreamingSessionURL({
			StreamName: StreamName,
			PlaybackMode,
			HLSFragmentSelector: {
				FragmentSelectorType,
				TimestampRange
			},
			ContainerFormat,
			DiscontinuityMode,
			DisplayFragmentTimestamp,
			MaxMediaPlaylistFragmentResults,
			Expires
		}, (err, response)=>{
			if(err) console.log(err)
			console.log('HLS Streaming Session URL: ' + response);
			console.log(response)
		})


	})
})()
