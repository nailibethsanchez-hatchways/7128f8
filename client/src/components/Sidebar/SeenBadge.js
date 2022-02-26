import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#3F92FF',
    color: '#FFFFFF',
    height: 20,
    fontSize: 10,
    borderRadius: 10,
    paddingRight: 7,
    paddingLeft: 7,
    marginRight: '6.67%',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'grab',
    },
  },
  hidden: {
    display: 'none',
  },
}));

const SeenBadge = ({ messagesToSee, isSeen }) => {
  const classes = useStyles();
  return (
    <div className={!isSeen ? classes.root : classes.hidden}>
      <p>{messagesToSee}</p>
    </div>
  );
};

export default SeenBadge;
