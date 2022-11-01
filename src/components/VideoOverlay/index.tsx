import React, { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Controller from './Controller';
import ArrowLeft from '../../assets/images/PagingLeft.png';
import ArrowRight from '../../assets/images/PagingRight.png';
import Out from '../../assets/images/out.png';

type VideoOverlayProps = {
  streams: Array<string>,
  statusColor: string,
  visible: boolean,

  wind: number | null,
  temperature : number | null,
  pressure : number | null,
  accel : number | null,

  onSwitch: Function,
  requestShow: Function,
  requestHide: Function
};

const useStyles = makeStyles((theme: Theme) => ({
  overlay: {
    position: 'absolute',
    display: 'flex',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    padding: 12,
    flexDirection: 'column',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      padding: 0
    },
  },
  topControllerContainer: {
    position: 'relative',
    backgroundColor: '#c4c4c4',
    borderRadius: 8,
    [theme.breakpoints.down('sm')]: {
      marginTop: -130
    },
  },
  topControllerWrapper: {
    padding: '16px 0',
    display: 'flex',
    height: 122
  },
  arrowButtons: {
    position: 'absolute',
    width: '100%',
    left: 0,
    top: 0
  },
  bottomControllerWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      marginBottom: -56
    },
  },
  buttonBottom: {
    display: 'block',
    width: 47,
    height: 48,
    borderRadius: 8,
    backdropFilter: 'blur(40px)',
    background: 'rgba(255,255,255,0.6)',
    marginRight: 9,
    padding: 6,
    cursor: 'pointer'
  },
  buttonBottomTextSmall: {
    fontSize: 12,
    textAlign: 'center',
    color: 'rgba(0,0,0,0.6)',
    fontWeight: 'bold'
  },
  buttonBottomTextLarge: {
    fontSize: 18,
    textAlign: 'center',
    color: 'rgba(0,0,0,0.6)',
    fontWeight: 'bold'
  },
}));

const VideoOverlay: React.FC<VideoOverlayProps> = ({
  streams,
  statusColor,
  
  wind,
  temperature,
  pressure,
  accel,
  
  visible,
  onSwitch,
  requestShow,
  requestHide
}) => {
  const classes = useStyles();
  const [offset, setOffset] = useState(0);
  
  const slicedStreams = streams.slice(offset, offset + 6);

  return(
    <Box className={classes.overlay} onClick={() => {
      if(!visible){
        requestShow();
      }
    }}>
      <Box className={classes.topControllerContainer} style={{display: visible ? 'block' : 'none'}}>
        <Box className={classes.topControllerWrapper}>
          {
            slicedStreams.map((el: any, key: number) => (
              <Controller
                key={key}
                stream={el}
                onClick={() => onSwitch(el)}
              />
            ))
          }
        </Box>
        <Box className={classes.arrowButtons}>
          {offset > 0 &&
            <img
              src={ArrowLeft}
              style={{
                position: 'absolute',
                left: 38,
                top: 50,
              }}
              onClick={() => setOffset(offset - 1)}
            />
          }
          {offset < streams.length - 6 &&
            <img
              src={ArrowRight}
              style={{
                position: 'absolute',
                right: 38,
                top: 50,
              }}
              onClick={() => setOffset(offset + 1)}
            />
          }
        </Box>
      </Box>
      <Box className={classes.bottomControllerWrapper} style={{display: visible ? 'flex' : 'none'}}>
        <Box display="flex">
          <a className={classes.buttonBottom} style={{background: statusColor}}></a>
          <a className={classes.buttonBottom}>
            <div className={classes.buttonBottomTextSmall}>Wind</div>
            <div className={classes.buttonBottomTextLarge}>{wind}</div>
          </a>
          <a className={classes.buttonBottom}>
            <div className={classes.buttonBottomTextSmall}>Temp</div>
            <div className={classes.buttonBottomTextLarge}>{temperature}</div>
          </a>
          <a className={classes.buttonBottom}>
            <div className={classes.buttonBottomTextSmall}>Hmd</div>
            <div className={classes.buttonBottomTextLarge}>{pressure}</div>
          </a>
          <a className={classes.buttonBottom}>
            <div className={classes.buttonBottomTextSmall}>Tilt</div>
            <div className={classes.buttonBottomTextLarge}>{accel}</div>
          </a>
        </Box>
        <Box>
          <a
            className={classes.buttonBottom}
            style={{margin: 0, padding: 12}}
            onClick={() => requestHide()}
          >
            <img src={Out} />
          </a>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoOverlay;