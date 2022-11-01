import React, { useRef, useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import videojs from "video.js";
import emptyStream from '../../assets/images/empty-stream.png';

const useStyles = makeStyles((theme: Theme) => ({
  topController: {
    width: 'calc(100% / 6)',
    height: 90,
    padding: '0 4px',
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% / 2)'
    }
  },
  switch: {
    position: 'relative',
    borderRadius: 6,
    background: '#000',
    cursor: 'pointer',
    height: '100%',
    overflow: 'hidden'
  },
  switchImage: {
    width: '100%',
    height: '100%'
  },
  streamStatus: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -11,
    marginTop: -11
  },
  canvas: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0
  }
}));

const Controller: React.FC<any> = ({ stream, onClick }) => {
  const classes = useStyles();

  return (
    <Box className={classes.topController}>
      <Box
        className={classes.switch}
        style={{cursor: stream !== '' ? 'pointer' : 'not-allowed'}}
        onClick={() => {
          if(stream !== ''){
            onClick(stream);
          }
        }}
      >
        {stream === ''
          ? (
            <img className={classes.streamStatus} src={emptyStream} />
            )
          : (
            <ThumbVideo
              stream={stream}
            />
          )
        }
      </Box>
    </Box>
  );
}

const ThumbVideo: React.FC<any> = ({stream}) => {
  const classes = useStyles();
  const options = {
    fluid: true,
    controls: false,
    autoplay: true,
    muted: true,
    loadingSpinner: false,
    streams: [stream]
  };
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const player = videojs(
      videoRef.current, {
        ...options,
      },
      () => {
        player.src(stream);
      }
    );
      
    const video:any = videoRef.current;
    const canvas:any = canvasRef.current;
    const context:any = canvas.getContext('2d');

    video.onloadeddata = function() {
      const ratio:number = video.videoWidth / video.videoHeight;
      const w:number = video.videoWidth - 100;
      const h:number = w / ratio
      canvas.width = w;
      canvas.height = h;
      setTimeout(() => {
        context.fillRect(0, 0, w, h);
        context.drawImage(video, 0, 0, w, h);
        player.dispose();
      });
    };
  }, []);

  return (
    <div>
      <div data-vjs-player>
        <video ref={videoRef} className="video-js" style={{visibility: 'hidden'}} />
      </div>
      <canvas ref={canvasRef} className={classes.canvas}></canvas>
    </div>
  );
}

export default Controller;