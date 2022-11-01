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
	const protocol = 'GET_DASH_STREAMING_SESSION_URL'//GET_HLS_STREAMING_SESSION_URL
	const res = kinesisVideo.getDataEndpoint({
		StreamName,
		APIName: protocol
	}, (err, res)=>{
		const endpoint = res.DataEndpoint

		kinesisVideoArchivedContent.endpoint = new AWS.Endpoint(endpoint);

		const PlaybackMode = "LIVE" // LIVE_REPLAY, ON_DEMAND
		const FragmentSelectorType = "SERVER_TIMESTAMP" //PRODUCER_TIMESTAMP
		const DisplayFragmentTimestamp = "ALWAYS" //"NEVER"
		const DisplayFragmentNumber = "ALWAYS" //"NEVER"
		const MaxManifestFragmentResults = undefined
		const Expires: number = 300


		const res2 = kinesisVideoArchivedContent.getDASHStreamingSessionURL({
			StreamName: StreamName,
			PlaybackMode,
			DASHFragmentSelector: {
				FragmentSelectorType,
				TimestampRange: PlaybackMode === "LIVE" ? undefined : {
					StartTimestamp: new Date(),
					EndTimestamp: new Date()
				}
			},
			DisplayFragmentTimestamp,
			DisplayFragmentNumber,
			MaxManifestFragmentResults,
			Expires
		}, (err, response)=>{
			if(err) console.log(err)
			console.log('DASH Streaming Session URL: ' + response);
			console.log(response)
		})


	})
})()
