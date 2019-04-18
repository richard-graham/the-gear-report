import React, { Component, Fragment } from 'react'

import PropTypes from 'prop-types'
import { getIcon } from '../../util/getIcon'

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';


const styles = theme => ({
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  nested: {
    paddingLeft: theme.spacing.unit * 2,
  },
})

export class DrawerMarkup extends Component {

  state = {
    open: true, 
    mobileOpen: false,
    subsOpen: true
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleMobileDrawerOpen = () => {
    this.setState({ mobileOpen: true });
  };

  handleToggleSubsList = () => {
    this.setState({ subsOpen: !this.state.subsOpen })
  }

  render() {
    const { subsOpen } = this.state;
    const { 
      classes,
      screenSize,
      handleMobileDrawerClose,
      handleDrawerClose,
    } = this.props

    return (
      <Fragment>
        <div className={classes.drawerHeader}>
          <IconButton onClick={screenSize === 'Mobile' ? handleMobileDrawerClose : handleDrawerClose}>
            <ChevronLeftIcon /> 
          </IconButton>
        </div>
        <Divider />
        <List>
          {['Home', 'Alerts', 'Subscriptions'].map((text) => (
            <ListItem button key={text}>
              {getIcon(text)}
            <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['Events', 'Route Finder'].map((text) => (
            <ListItem button key={text}>
              {getIcon(text)}
              <ListItemText primary={text} />
            </ListItem>
          ))}
      
          <ListItem button onClick={this.handleToggleSubsList}>
            {getIcon('My Crags')}
            <ListItemText inset primary="My Crags" />
              {!subsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={subsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested}>
                <ListItemText inset primary="Kawakawa Bay" />
              </ListItem>
              <ListItem button className={classes.nested}>
                <ListItemText inset primary="Froggatt Edge" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button key='Contributors'>
            {getIcon('Contributors')}
            <ListItemText primary='Contributors' />
          </ListItem>
        </List>
        <Divider />

        <List>
          {['About', 'FAQ', 'Donate', 'Send Feedback'].map((text) => (
              <ListItem button key={text}>
                {getIcon(text)}
                <ListItemText primary={text} />
              </ListItem>
            ))}
        </List>
      </Fragment>
    )
  }
}

DrawerMarkup.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(DrawerMarkup)