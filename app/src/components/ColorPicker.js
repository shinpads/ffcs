import React from 'react';
import { createUseStyles } from 'react-jss';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import colors from '../colors';

const styles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  previewContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: '4px',
  },
  hexInput: {
    width: '40%',
    border: '1px solid white',
    borderRadius: '5px',
    background: colors.background,
    color: colors.white,
    marginLeft: 8,
  },
  colorPreview: ({ color }) => ({
    background: color,
    width: '30px',
    height: '30px',
    marginLeft: 'auto',
    marginRight: 16,
    borderRadius: '5px',
  }),
});

const ColorPicker = (props) => {
  const { color, onChange } = props;
  const classes = styles({ color });

  return (
    <div className={classes.container}>
      <HexColorPicker color={color} onChange={onChange} />
      <div className={classes.previewContainer}>
        <HexColorInput color={color} onChange={onChange} className={classes.hexInput} />
        <div className={classes.colorPreview} />
      </div>
    </div>
  );
};

export default ColorPicker;
