import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

export const styles = theme => ({
  /* Styles applied to the `Button` component. */
  button: {
    margin: 8,
    color: theme.palette.text.secondary,
    backgroundColor: emphasize(theme.palette.background.default, 0.12),
    '&:hover': {
      backgroundColor: emphasize(theme.palette.background.default, 0.15),
    },
    transition: `${theme.transitions.create('transform', {
      duration: theme.transitions.duration.shorter,
    })}, opacity 0.8s`,
    opacity: 1,
  },
  /* Styles applied to the `Button` component if `open={false}`. */
  buttonClosed: {
    opacity: 0,
    transform: 'scale(0)',
  },
});

class SpeedDialAction extends React.Component {
  constructor(props) {
    super();
    this.state = {
      tooltipOpen: props.tooltipOpen,
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    if (!props.open && state.tooltipOpen) {
      return { tooltipOpen: false };
    }
    return null;
  };

  handleTooltipClose = () => {
    if (this.props.tooltipOpen) return;
    this.setState({ tooltipOpen: false });
  };

  handleTooltipOpen = () => {
    if (this.props.tooltipOpen) return;
    this.setState({ tooltipOpen: true });
  };

  componentDidUpdate = prevProps => {
    if (!this.props.tooltipOpen || prevProps.open === this.props.open) return;
    if (!this.state.tooltipOpen) {
      this.timeout = setTimeout(() => this.setState({ tooltipOpen: true }), this.props.delay + 100);
    }
  };

  componentWillUnmount = () => clearTimeout(this.timeout);

  render() {
    const {
      ButtonProps,
      classes,
      className,
      delay,
      icon,
      id,
      onClick,
      onKeyDown,
      open,
      tooltipTitle,
      tooltipPlacement,
      tooltipOpen,
      ...other
    } = this.props;

    let clickProp = { onClick };
    if (typeof document !== 'undefined' && 'ontouchstart' in document.documentElement) {
      let startTime;
      clickProp = {
        onTouchStart: () => {
          startTime = new Date();
        },
        onTouchEnd: () => {
          // only perform action if the touch is a tap, i.e. not long press
          if (new Date() - startTime < 500) {
            onClick();
          }
        },
      };
    }

    return (
      <Tooltip
        id={id}
        title={tooltipTitle}
        placement={tooltipPlacement}
        onClose={this.handleTooltipClose}
        onOpen={this.handleTooltipOpen}
        open={open && this.state.tooltipOpen}
        {...other}
      >
        <Fab
          size="small"
          className={classNames(className, classes.button, !open && classes.buttonClosed)}
          style={{ transitionDelay: `${delay}ms` }}
          tabIndex={-1}
          role="menuitem"
          onKeyDown={onKeyDown}
          {...ButtonProps}
          {...clickProp}
        >
          {icon}
        </Fab>
      </Tooltip>
    );
  }
}

SpeedDialAction.propTypes = {
  /**
   * Properties applied to the [`Button`](/api/button/) component.
   */
  ButtonProps: PropTypes.object,
  /**
   * Useful to extend the style applied to components.
   */
  classes: PropTypes.object.isRequired,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * Adds a transition delay, to allow a series of SpeedDialActions to be animated.
   */
  delay: PropTypes.number,
  /**
   * The Icon to display in the SpeedDial Floating Action Button.
   */
  icon: PropTypes.node.isRequired,
  /**
   * @ignore
   */
  id: PropTypes.string,
  /**
   * @ignore
   */
  onClick: PropTypes.func,
  /**
   * @ignore
   */
  onKeyDown: PropTypes.func,
  /**
   * @ignore
   */
  open: PropTypes.bool,
  /**
   * Make the tooltip always visible when the SpeedDial is open.
   */
  tooltipOpen: PropTypes.bool,
  /**
   * Placement of the tooltip.
   */
  tooltipPlacement: PropTypes.oneOf([
    'bottom-end',
    'bottom-start',
    'bottom',
    'left-end',
    'left-start',
    'left',
    'right-end',
    'right-start',
    'right',
    'top-end',
    'top-start',
    'top',
  ]),
  /**
   * Label to display in the tooltip.
   */
  tooltipTitle: PropTypes.node.isRequired,
};

SpeedDialAction.defaultProps = {
  delay: 0,
  open: false,
  tooltipPlacement: 'left',
  tooltipOpen: false,
};

export default withStyles(styles, { name: 'MuiSpeedDialAction' })(SpeedDialAction);
