import React from 'react';
import moment from 'moment';
import { Fade } from 'react-reveal';
import { Line } from 'react-chartjs-2';
import { createUseStyles } from 'react-jss';
import { Paper, Button } from '@material-ui/core';
import colors from '../colors';
import TeamName from './TeamName';


const styles = createUseStyles({
  container: {
    padding: '8px',
    margin: '1rem 4px 1rem 4px',
    backgroundColor: colors.darkGrey,
    borderRadius: '4px',
    flexBasis: '400px',
    boxShadow: `1px 1px 2px ${colors.black}`,
  },
  title: {
    padding: '16px',
  }
});



const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
  elements: {
    point:{
      radius: 0
    }
  },
  plugins: {
    legend: {
      display: false,
        labels: {
          display: false
        }
    }
  }
};

const GoldGraph = ({ timeline, team1Participants, team2Participants, team1, team2 }) => {
  const classes = styles();

  console.log(timeline);
  console.log(team1Participants, team2Participants);
  
  if (!timeline) {
   return null; 
  }

  const labels = timeline.frames.map(frame => {
    const { timestamp } = frame;
    let seconds = timestamp / 1000;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.round(seconds % 60);
    return `${minutes}m`;
  });

  const goldDiffDataSet = [];

  timeline.frames.forEach(frame => {
    let team1Gold = 0;
    let team2Gold = 0;
    team1Participants.forEach(p => {
        team1Gold += frame.participantFrames[p.participantId].totalGold;
    });
    team2Participants.forEach(p => {
        team2Gold += frame.participantFrames[p.participantId].totalGold;
    });

    const goldDiff = team1Gold - team2Gold;
    goldDiffDataSet.push(goldDiff);

  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Gold Diff',
        data: goldDiffDataSet,
        fill: { above: colors.primary, below: colors.red, target: { value: 0 } }
      },
    ],
  };


  return (
    <div className={classes.container}>
      <Line data={data} options={options} />
    </div>
  );
};

export default GoldGraph;
