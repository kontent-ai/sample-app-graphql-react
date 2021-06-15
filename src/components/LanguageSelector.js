import React from "react";
import MuiSelect from "@material-ui/core/Select";
import { useHistory } from 'react-router-dom';
import { makeStyles, MenuItem } from '@material-ui/core';
import { getLanguage, setLanguage } from '../utils/queryString';

const useStyles = makeStyles((theme) => ({
  selectLanguage: {
    clear: 'both',
    borderBottom: 'none'
  },
}));

export const languages = [{
        name: "EN",
        codename: "default"
    },
    {
        name: "CZ",
        codename: "cz"
    }
];

function LanguageSelector({urlSlugs}) {
  const history = useHistory();
  const classes = useStyles();
  const handleClick = ({target}) => {
    const index = history.location.pathname.lastIndexOf('/');
    const slug = urlSlugs.find(slug => slug.navigationItem.system.language.system.codename === target.value);
    if (!slug){
      history.push(setLanguage(history.location, target.value));
    }
    else {
      history.location.pathname = history.location.pathname.substring(0, index + 1) + slug.navigationItem.slug;
      history.push(setLanguage(history.location, target.value));
    }
  }
  return (
    <MuiSelect
        value={getLanguage(history.location)}
        onChange={handleClick}
        className={classes.selectLanguage}
        displayEmpty
        renderValue={value => !value ? <em>{languages[0].name}</em> : languages.find(language => language.codename === value).name}
    >
      {languages.map((language, index) => <MenuItem key={`languageSelectorItem${index}`} value={language.codename}>{language.name}</MenuItem>)}
    </MuiSelect>
  );
}

export default LanguageSelector;
