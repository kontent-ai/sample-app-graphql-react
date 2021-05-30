import React from "react";
import PropTypes, { object } from "prop-types";
import MuiInputLabel from "@material-ui/core/InputLabel";
import MuiSelect from "@material-ui/core/Select";
import { useHistory } from 'react-router-dom';
import { makeStyles, MenuItem } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function Filter(props) {
  const history = useHistory();
  const classes = useStyles();
  const handleClick = ({target}) => {
    history.push(props.updateLocation(history.location, target.value));
  }

  return (
      <>
        <MuiInputLabel shrink>
          {props.label}
        </MuiInputLabel>
        <MuiSelect
            value={props.getValueFromLocation(history.location)}
            onChange={handleClick}
            className={classes.selectEmpty}
            displayEmpty
            renderValue={value => !value ? <em>{`All ${props.label}s`}</em> : props.options.find(option => option.codename === value).name}
        >
          <MenuItem key={`filter${props.label}ItemNone`} value=""><b>{`All ${props.label}s`}</b></MenuItem>
          {props.options.map((option, index) => <MenuItem key={`filter${props.label}Item${index}`} value={option.codename}>{option.name}</MenuItem>)}
        </MuiSelect>
      </>
  );
}

Filter.propTypes = {
  options: PropTypes.arrayOf(object).isRequired,
};

export default Filter;
