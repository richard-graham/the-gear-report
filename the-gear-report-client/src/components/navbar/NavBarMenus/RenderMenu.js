import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { logoutUser, updateUserLocation } from '../../../redux/actions/userActions'
import { Link } from 'react-router-dom'
//Mui
import { withStyles } from '@material-ui/core/styles'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Divider from '@material-ui/core/Divider'

class RenderMenu extends Component {
  handleLogout = () => {
    this.props.logoutTheUser()
    this.props.updateTheUserLocation()
    this.props.handleMenuClose()
  }
  render() {
    const { 
      anchorEl, 
      isMenuOpen, 
      handleMenuClose, 
      classes, 
      user: { authenticated }
    } = this.props
    return (
      <Menu
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <div className={classes.menuMenu}>
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>My account</MenuItem>
          <Divider variant="middle" />
          { authenticated ?
          <MenuItem 
            onClick={this.handleLogout}
          >Logout</MenuItem> :
          <Fragment>
            <MenuItem onClick={handleMenuClose} component={Link} to='/login'>Sign In</MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to='/signup'>Register</MenuItem>
          </Fragment>
          }
        </div>  
      </Menu>
    )
  }
}

const styles = theme => ({
  ...theme
})

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => {
  return {
    logoutTheUser: () => dispatch(logoutUser()),
    updateTheUserLocation: () => dispatch(updateUserLocation())
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RenderMenu))
