import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { API, graphqlOperation, I18n } from 'aws-amplify';
import { useHistory } from 'react-router-dom'
import { Theme, Accordion, AccordionDetails, AccordionSummary, makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { onCreateSensorValues } from '../../graphql/subscriptions';
import { ISensor, GetSensors, GetSensorStatusColor } from '../../api/Sensors';

import settings from '../../settings.json';

Auth.currentAuthenticatedUser()
    .then(user => {
        return Auth.changePassword(user, 'oldPassword', 'newPassword');
    })
    .then(data => console.log(data))
    .catch(err => console.log(err));

const useStyles = makeStyles((theme: Theme) => ({
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
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
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

const SettingsPage: React.FC = () => {
  
  const history = useHistory();
  const classes = useStyles();

  const [sensors, setSensors] = useState<Array<ISensor>>([]);
  const [readyToSubscribe, setReadyToSubscribe] = useState(false);
  
  const [list, setList] = useState([]);
  const [columns, setColumns] = useState([]);

  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

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

  Auth.currentAuthenticatedUser()
    .then(user => {
        return Auth.changePassword(user, 'oldPassword', 'newPassword');
    })
    .then(data => console.log(data))
    .catch(err => console.log(err));

  return (
    <Container className={classes.dashboardContainer} maxWidth="lg">
      <div className={classes.title}>
        <Typography variant="h5" align="left" >
          {I18n.get('settings')}
        </Typography>
        </div>
        <div className={classes.root}>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>{I18n.get('general')}</Typography>
          <Typography className={classes.secondaryHeading}>{I18n.get('general_settings')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
            maximus est, id dignissim quam.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography className={classes.heading}>{I18n.get('account')}</Typography>
          <Typography className={classes.secondaryHeading}>
            {I18n.get('account_settings')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros,
            vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography className={classes.heading}>{I18n.get('advanced')}</Typography>
          <Typography className={classes.secondaryHeading}>
          {I18n.get('advanced_settings')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros,
            vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography className={classes.heading}>{I18n.get('system')}</Typography>
          <Typography className={classes.secondaryHeading}>
          {I18n.get('system_settings')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros,
            vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
    </Container>
  );
}

export default SettingsPage;
