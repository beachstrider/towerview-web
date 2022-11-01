import AWS from 'aws-sdk';

export const getVideoStreams = (streamName: string) => {
  // AWS.config.update({
  //   region: process.env.REACT_APP_REGION,
  //   credentials: AWS.SharedIniFileCredentials()
  // });

  // var kinesisvideomedia = new AWS.KinesisVideoMedia();
  // var params = {
  //   StartSelector: { 
  //     StartSelectorType: "NOW",
  //   },
  //  "StreamARN": "string",
  //  "StreamName": "arn:aws:kinesisvideo:ap-northeast-2:147828110579:stream/9Ql6zMPzJU_0/1614043936488"
  // };
  // kinesisvideomedia.getMedia(params, function (err, data) {
  //   if (err) console.log(err, err.stack); // an error occurred
  //   else     console.log('data?', data);           // successful response
  // });

  // const iam = new AWS.IAM({apiVersion: '2010-05-08'});
  // const myManagedPolicy = {
  //   Version: '2012-10-17',
  //   Statement: [
  //     {
  //       Effect: 'Allow',
  //       Action: ['kinesisvideo:ListStreams'],
  //       Resource: `arn:aws:kinesisvideo:ap-northeast-2:147828110579:stream/${streamName}/1614043936488`
  //     }
  //   ]
  // };
  // const params = {
  //   PolicyDocument: JSON.stringify(myManagedPolicy),
  //   PolicyName: 'myDynamoDBPolicy',
  // };
  // iam.createPolicy(params, function(err, data) {
  //   if (err) {
  //     console.log("IAM create policy error", err);
  //   } else {
  //     console.log("IAM create policy success", data);
  //   }
  // });

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
        console.log('streamInfoList', streamInfoList);
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
                // APIName: 'GET_CLIP'
                APIName: 'GET_HLS_STREAMING_SESSION_URL'
              }, (err, response) => {
                if (err) { 
                  reject(err);
                }
                
                if (response.DataEndpoint !== undefined)
                  kinesisVideoArchivedContent.endpoint = new AWS.Endpoint(response.DataEndpoint);
                
                resolve(new Promise((resolve) => {
                  kinesisVideoArchivedContent.getHLSStreamingSessionURL({
                    StreamName: streamName,
                    PlaybackMode: 'LIVE',
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