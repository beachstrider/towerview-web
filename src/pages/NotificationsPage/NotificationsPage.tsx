import React, { useState, useEffect } from 'react';
import { API, graphqlOperation, I18n } from 'aws-amplify';
import { useHistory } from 'react-router-dom'
import { Theme, makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { onCreateSensorValues } from '../../graphql/subscriptions';
import { ISensor, GetSensors, GetSensorStatusColor } from '../../api/Sensors';


import settings from '../../settings.json';

const useStyles = makeStyles((theme: Theme) => ({
  dashboardContainer: {
    marginTop:100
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  title: {
    marginBottom: 20,
    minHeight:30
  },
  navStyle: {
    position: "absolute",
    top: 36,
    right: 0,
    padding: "10px"
  }
}));

interface IViewPort {
  latitude: number,
  longitude: number,
  zoom: number,
  bearing: number,
  pitch: number
}

interface ISensorsSubscriptionResponse {
  value: {
    data: {
      onCreateSensorValues: {
        sensorId: string,
        status: number
      }
    }
  }
}

const NotificationsPage: React.FC = () => {
  
  const history = useHistory();
  const classes = useStyles();

  const [sensors, setSensors] = useState<Array<ISensor>>([]);
  const [readyToSubscribe, setReadyToSubscribe] = useState(false);
  
  const [list, setList] = useState([]);
  const [columns, setColumns] = useState([]);

  // const columnWidth : Array<number> = [90, 90, 120, 240, 560]

  //fetch initial list of sensors and display current state
  useEffect(() => {

    const initSensors = async () => {
      
      console.log('fetching sensors');

      try {

        const response = await GetSensors();

        if (response) {
          setSensors(response);
          console.log('sensors retrived');
          setReadyToSubscribe(true);
        }
      }
      catch (error) {
        console.log('error fetching sensors', error);
      }
    };

    initSensors()

  }, []);

  //subscribe to changes in sensor values
  useEffect(() => {



    if (readyToSubscribe){

      console.log('start subscription to sensors');
      
      const subscriber = API.graphql(graphqlOperation(onCreateSensorValues)).subscribe({
        next: (response: ISensorsSubscriptionResponse) => {

          //update the sensor's status in state
          if (response.value.data.onCreateSensorValues) {
            
            var newSensors = [...sensors];

            let tempColumns: any = [];
            let cnt: number = 0;

            for (let item of newSensors) {
              if (item.sensorId === response.value.data.onCreateSensorValues.sensorId){
                item.status = response.value.data.onCreateSensorValues.status;
                tempColumns.push({ field: item.sensorId, headerName: item })
                cnt++
                break;
              }
            }

            console.log('sensors updated');
            setSensors(newSensors);
            setColumns(list);
          }
        },
        error: (error: any) => {
          console.log('error on sensors subscription', error);
        }
      });

      return () => {
        console.log('terminating subscription to sensors');
        subscriber.unsubscribe();
      }
    }

  // eslint-disable-next-line 
  }, [readyToSubscribe]);

  return (
    <Container className={classes.dashboardContainer} maxWidth="lg">
      <div className={classes.title}>
        <Typography variant="h5" align="left" >
          {I18n.get('notifications')}
        </Typography>
      </div>

      <div className={classes.root}>
      {/* FIXME https://material-ui.com/components/alert/#transition to collapse with x */}
      
      <Alert onClose={() => {}} severity="error">This is an error alert — check it out!</Alert>
      <Alert onClose={() => {}} severity="warning">This is a warning alert — check it out!</Alert>
      <Alert onClose={() => {}} severity="info">This is an info alert — check it out!</Alert>
      <Alert onClose={() => {}} severity="success">This is a success alert — check it out!</Alert>
      <Alert onClose={() => {}} severity="error">This is an error alert — check it out!</Alert>
      <Alert onClose={() => {}} severity="warning">This is a warning alert — check it out!</Alert>
      <Alert onClose={() => {}} severity="info">This is an info alert — check it out!</Alert>
      <Alert onClose={() => {}} severity="success">This is a success alert — check it out!</Alert>
    </div>

    </Container>
  );
}

export default NotificationsPage;
