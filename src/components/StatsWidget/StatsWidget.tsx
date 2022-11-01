import React, { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        height: 175
    },
    title: {
        fontSize:20
    },
    value: {
        fontSize:75,
        marginTop:10,
        marginLeft:'auto',
        marginRight:'auto'
    }
}));

interface IProps {
    title: string,
    value: number | null
}

const StatsWidget: React.FC<IProps> = ({title, value}: IProps) => {
  
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
        <div className={classes.title}>
            {title}
        </div>
        <div className={classes.value}>
            { value ||
                <CircularProgress color="secondary" />
            }
        </div>
    </Paper>  
  );
}

export default StatsWidget;
