import React from "react";
import get from "lodash.get";
import { Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, makeStyles, MenuItem, Select, TextField } from "@material-ui/core";
import UnknownComponent from "./UnknownComponent";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  textArea: {
    minWidth: 500
  },
  checkbox: {
    paddingLeft: theme.spacing(1),
  }
}));

function FormField(props) {
  const classes = useStyles();
  const [selectBoxValue, setSelectBoxValue] = React.useState('');

  let field = get(props, "field", null);

  let fieldComponent;

  if (field._system.type._system.codename === "base_form_field") {

    const isTextArea = get(field, "type[0]._system.codename") === "textarea";
    const isCheckbox = get(field, "type[0]._system.codename") === "checkbox";
    if (isCheckbox) {
      fieldComponent = (
        <FormGroup className={classes.checkbox}>
          <FormControlLabel
            control={<Checkbox name={get(field, "name", null)} />}
            label={get(field, "label", null)}
          />
        </FormGroup>

      );
    }
    else {
      fieldComponent = (
        <TextField
          type={get(field, "type[0]._system.codename")}
          multiline={isTextArea ? true : false}
          rows={isTextArea ? 4 : undefined}
          label={get(field, "label", null)}
          placeholder={get(field, "defaultValue", null)}
          required={get(field, "configuration", []).some(config => config._system.codename === "required")}
          name={get(field, "name", null)}
          className={`${classes.formControl} ${isTextArea ? classes.textArea : null}`}
        />

      );
    }
  }
  else if (field._system.type._system.codename === "select_form_field") {
    const handleChange = (event) => {
      setSelectBoxValue(event.target.value);
    };

    fieldComponent = (
      <FormControl
        className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">{get(field, "label")}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={handleChange}
          value={selectBoxValue}
        >
          {get(field, "options.items", []).map(option => (
            <MenuItem key={get(option, "value")} value={get(option, "value")}>{get(option, "label")}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
  else {
    fieldComponent = (
      <UnknownComponent>
        Unknown form component
      </UnknownComponent>
    );
  }

  return (
    <div>
      {fieldComponent}
    </div>
  );
}

export default FormField;
