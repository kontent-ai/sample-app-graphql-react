import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  Link as RouterLink,
  useRouteMatch
} from "react-router-dom";
import MuiLink from "@material-ui/core/Link";
import { getUrlSlug } from '../utils';

function Link(props) {
  const {
    href,
    activeClassName = "active",
    className: classNameProps,
    innerRef,
    naked,
    ...other
  } = props;

  const absoluteLink = getUrlSlug(href);

  let match = useRouteMatch(absoluteLink);

  const className = clsx(classNameProps, {
    [activeClassName]: match && activeClassName,
  });

  if (naked) {
    return <RouterLink className={className} ref={innerRef} to={absoluteLink} {...other}/>;
  }

  return (
    <MuiLink component={RouterLink} className={className} ref={innerRef} to={absoluteLink} {...other}/>
  );
}

Link.propTypes = {
  activeClassName: PropTypes.string,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.string,
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  naked: PropTypes.bool,
  onClick: PropTypes.func,
  prefetch: PropTypes.bool,
};

export default React.forwardRef((props, ref) => <Link {...props} innerRef={ref} />);
