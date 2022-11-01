import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { API, graphqlOperation, I18n } from 'aws-amplify';
import Container from '@material-ui/core/Container';
import { makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { onCreateSensorValue } from '../../graphql/subscriptions';
import { GetSensor, GetSensorStatusColor } from '../../api/Sensors';
import NumericWidget, { WIDGET_MODE } from '../../components/NumericWidget/NumericWidget';
import LineChartWidget from '../../components/LineChartWidget/LineChartWidget';
import {getVideoStreams} from '../../api/Videos';
import VideoPlayerWidget from '../../components/VideoPlayerWidget/VideoPlayerWidget';
import VideoOverlay from '../../components/VideoOverlay/';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme: Theme) => ({
  dashboardContainer: {
    marginTop: 100
  },
  title: {
    marginBottom: 20,
    minHeight: 30
  },
  videoWrapper: {
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      marginTop: 120,
      marginBottom: 80
    }
  },
  videoContent: {
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 693,
    backgroundColor: '#000',
    [theme.breakpoints.down('sm')]: {
      minHeight: 192.94
    },
  },
}));

interface ISensorSubscriptionResponse {
  value: {
    data: {
      onCreateSensorValue: {
        name: string,
        wind: number,
        temperature: number,
        pressure: number,
        accel: number,
        status: number
      }
    }
  }
}

const SensorPage: React.FC = () => {
  const classes = useStyles();
  const {id}: any = useParams();

  const [name, setName] = useState("Fetching sensor data...");
  const [wind, setWind] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [pressure, setPressure] = useState<number | null>(null);
  const [accel, setAccel] = useState<number | null>(null);
  const [statusColor, setStatusColor] = useState<string>('');
  const [readyToSubscribe, setReadyToSubscribe] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);

  const [streams, setStreams] = useState<any>([]);
  const [stream, setStream] = useState<any>(null);
  
  useEffect(() => {
    getVideoStreams(id).then((res) => {
      console.log('streams', res);
      setStreams(res);
      setStream(res[0]);
    }).catch(err => console.log('err', err));
  }, []);

  const switchStream = (str: any) => {
    setStream(str);
  }

  //fetch sensor to get name
  useEffect(() => {
    setReadyToSubscribe(false);
    const initSensor = async () => {
      console.log('fetching sensor');
      try {
        const response = await GetSensor(id || "");
        if (response) {
          setName(response.name);
          console.log('sensor retrived', response);
          setReadyToSubscribe(true);
        }
      }
      catch (error) {
        console.log('error fetching sensor', error);
      }
    };
    initSensor()
  }, [id]);

  //subscribe to changes to the sensor's value
  useEffect(() => {
    if (readyToSubscribe) {
      console.log('start subscription to sensor');
      const subscriber = API.graphql(graphqlOperation(onCreateSensorValue, { sensorId: id })).subscribe({
        next: (response: ISensorSubscriptionResponse) => {
          //update the sensor's status in state
          if (response.value.data.onCreateSensorValue) {
            setWind(response.value.data.onCreateSensorValue.wind);
            setTemperature(response.value.data.onCreateSensorValue.temperature);
            setPressure(response.value.data.onCreateSensorValue.pressure);
            setAccel(response.value.data.onCreateSensorValue.accel);
            setStatusColor(GetSensorStatusColor(response.value.data.onCreateSensorValue.status));
            console.log('sensor value received', response);
          }
        },
        error: (error: any) => {
          console.log('error on sensor subscription', error);
        }
      });
      return () => {
        console.log('terminating subscription to sensor');
        subscriber.unsubscribe();
      }
    }
  }, [id, readyToSubscribe]);

  return (
    <Container className={classes.dashboardContainer} maxWidth="lg">
      <div className={classes.title}>
        <Typography variant="h5" align="left" >
          {name}
        </Typography>
      </div>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box className={classes.videoWrapper}>
            <Box className={classes.videoContent}>
              {stream !== null &&
                <VideoPlayerWidget src={stream} />
              }
            </Box>
            <VideoOverlay
              streams={streams}
              statusColor={statusColor}
              wind={wind}
              temperature={temperature}
              pressure={pressure}
              accel={accel}
              onSwitch={(str: any) => switchStream(str)}
              visible={overlayVisible}
              requestShow={() => setOverlayVisible(true)}
              requestHide={() => setOverlayVisible(false)}
            />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <LineChartWidget
            title={I18n.get('wind')}
            value={wind}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <LineChartWidget
            title={I18n.get('temperature')}
            value={temperature}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <LineChartWidget
            title={I18n.get('pressure')}
            value={pressure}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <LineChartWidget
            title={I18n.get('accel')}
            value={accel}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default SensorPage;
