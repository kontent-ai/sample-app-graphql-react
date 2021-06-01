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
  let field = get(props, "field", null);

  let fieldComponent;

  if (field.system.type === "base_form_field") {

    const isTextArea = get(field, "type.value[0].codename") === "textarea";
    const isCheckbox = get(field, "type.value[0].codename") === "checkbox";
    if (isCheckbox) {
      fieldComponent = (
        <FormGroup className={classes.checkbox}>
          <FormControlLabel
            control={<Checkbox name={get(field, "name.value", null)} />}
            label={get(field, "label.value", null)}
          />
        </FormGroup>

      );
    }
    else {
      fieldComponent = (
        <TextField
          type={get(field, "type.value[0].codename")}
          multiline={isTextArea ? true : false}
          rows={isTextArea ? 4 : undefined}
          label={get(field, "label.value", null)}
          placeholder={get(field, "default_value.value", null)}
          required={get(field, "configuration.value", []).some(config => config.codename === "required")}
          name={get(field, "name.value", null)}
          className={`${classes.formControl} ${isTextArea ? classes.textArea : null}`}
        />

      );
    }
  }
  else if (field.system.type === "select_form_field") {
    fieldComponent = (
      <FormControl
        className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">{get(field, "label.value")}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value=''
        >
          {get(field, "options.value", []).map(option => (
            <MenuItem key={get(option, "value.value")} value={get(option, "value.value")}>{get(option, "label.value")}</MenuItem>
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
