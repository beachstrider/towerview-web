import AWS from "aws-sdk";

export const getVideoStreams = (streamName: string) => {
  return new Promise<any>((resolve, reject) => {
    const options = {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_REGION
    }

    const kinesisVideo = new AWS.KinesisVideo(options);
    const kinesisVideoArchivedContent = new AWS.KinesisVideoArchivedMedia(options);
    const params = {
      StreamNameCondition: {
        ComparisonOperator: 'BEGINS_WITH',
        ComparisonValue: streamName // FIXME: use AWS IoT thingName
      }
    };
    
    resolve(new Promise((resolve) => {
      kinesisVideo.listStreams(params, (err, data) => {
        if (err) { 
          reject(err);
        }
        
        const streamInfoList: any = data.StreamInfoList;
        const streamNames: any = [];

        for (const item of streamInfoList) {
          streamNames.push(item.StreamName);
        };
        
        resolve(new Promise((resolve) => {
          const streamList: any = [];
          for (const streamName of streamNames) {
            streamList.push(new Promise((resolve) => {
              kinesisVideo.getDataEndpoint({
                StreamName: streamName,
                APIName: "GET_HLS_STREAMING_SESSION_URL"
              }, (err, response) => {
                if (err) { 
                  reject(err);
                }
                
                if (response.DataEndpoint !== undefined)
                  kinesisVideoArchivedContent.endpoint = new AWS.Endpoint(response.DataEndpoint);
                
                resolve(new Promise((resolve) => {
                  kinesisVideoArchivedContent.getHLSStreamingSessionURL({
                    StreamName: streamName,
                    PlaybackMode: "LIVE",
                    Expires: 43200
                  }, (err, response) => {
                    if (err) { 
                      reject(err);
                    }
                    
                    const HLSStreamingSessionURL = response !== null ? response.HLSStreamingSessionURL : '';
                    resolve(HLSStreamingSessionURL);
                    console.log('HLS Streaming Session URL: ', HLSStreamingSessionURL);
                  });
                }));
              });
            }));
          };

          Promise.all(streamList).then((res) => {
            resolve(res);
          });
        }));
      });
    }));
  });
}