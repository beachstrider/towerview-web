import React, { useState, useEffect } from 'react';
import { API, graphqlOperation, I18n } from 'aws-amplify';
import { useHistory, Link } from 'react-router-dom'
import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import { DataGrid, ColDef } from '@material-ui/data-grid';

import { onCreateSensorValues } from '../../graphql/subscriptions';
import { ISensor, GetSensors, GetSensorStatusColor } from '../../api/Sensors';
import { GetSensor } from '../../api/Sensors';

import StatsWidget from '../../components/StatsWidget/StatsWidget';

import settings from '../../settings.json';
import { Greetings, SignOut } from 'aws-amplify-react';
import classes from '*.module.css';

const useStyles = makeStyles(() => ({
  dashboardContainer: {
    marginTop:100
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
  },
  paper: {
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  table: {
    minWidth: 650,
  },
  more: {
    color: '#fff',
  },
  gridLink: {
    color: '#fff'
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

const Dashboard: React.FC = () => {
  const history = useHistory();
  const classes = useStyles();

  var activeSites, inactiveSites, activeUsers, totalUsers;

  const [sensors, setSensors] = useState<Array<ISensor>>([]);
  const [readyToSubscribe, setReadyToSubscribe] = useState(false);

  //fetch initial list of sensors and display current state
  useEffect(() => {
    const initSensors = async () => {
      console.log('fetching sensors');
      try {
        const response = await GetSensors();
        if (response) {
          setSensors(response);
          console.log('sensors retrived', response);
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
            for (let item of newSensors) {
              if (item.sensorId === response.value.data.onCreateSensorValues.sensorId){
                item.status = response.value.data.onCreateSensorValues.status;
                break;
              }
            }
            console.log('sensors updated');
            setSensors(newSensors);
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

  // FIXME
  activeSites = sensors.length;
  inactiveSites = 2;
  activeUsers = 1;
  totalUsers = 2;

  const columns: ColDef[] = [
    {
      field: 'name',
      headerName: I18n.get('site_name'),
      sortable: false,
      renderCell: (cells) => <Link to={`/sensor/${cells.getValue('sensorId')}`} className={classes.gridLink}>{cells.getValue('name')}</Link>,
      width: 240
    },
    {
      field: 'sensorId',
      headerName: I18n.get('sensor_id'),
      sortable: false,
      renderCell: (cells) => <Link to={`/sensor/${cells.getValue('sensorId')}`} className={classes.gridLink}>{cells.getValue('sensorId')}</Link>,
      width: 360
    },
    {
      field: 'enabled',
      headerName: I18n.get('enabled'),
      sortable: false,
      renderCell: (cells) => <Link to={`/sensor/${cells.getValue('sensorId')}`} className={classes.gridLink}>{cells.getValue('enabled') ? 'True' : 'False'}</Link>,
      width: 110
    },
    {
      field: 'status',
      headerName: I18n.get('status'),
      sortable: false,
      renderCell: (cells) => <Link to={`/sensor/${cells.getValue('sensorId')}`} className={classes.gridLink}>{cells.getValue('status')}</Link>,
      width: 110
    },
  ];

  const rows = sensors.map((el, key) => ({
    id: key,
    enabled: el.enabled,
    name: el.name,
    sensorId: el.sensorId,
    status: el.status
  }));

  console.log('rows', rows);

  return (
    <Container className={classes.dashboardContainer} maxWidth="lg">
      <div className={classes.title}>
        <Typography variant="h5" align="left" >
          {I18n.get('dashboard')}
        </Typography>
      </div>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
        <StatsWidget 
          title={I18n.get('active_sites')}
          value={activeSites}
        />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <StatsWidget 
            title={I18n.get('inactive_sites')}
            value={inactiveSites}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <StatsWidget 
            title={I18n.get('active_users')}
            value={activeUsers}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <StatsWidget 
            title={I18n.get('total_users')}
            value={totalUsers}
          />
        </Grid>
        <Grid item xs={12}>
          <DataGrid
            rows={rows}
            columns={columns.map((column) => ({
              ...column,
              disableClickEventBubbling: true
            }))}
            pageSize={5}
            autoHeight
            density="compact"
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
