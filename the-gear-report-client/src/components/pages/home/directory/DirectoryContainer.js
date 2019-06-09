import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Globe from './Globe'
import GlobeNav from './GlobeNav'
//Mui
import { CircularProgress } from '@material-ui/core';
import Hidden from '@material-ui/core/Hidden' 
import Tab from '@material-ui/core/Tab'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs';
import Grid from '@material-ui/core/Grid';
//Redux
import { connect } from 'react-redux'
import { getLocationData } from '../../../../redux/actions/tcActions'


const styles = {
  root: {
    width: '100%',
  },
  nav: {
    display: 'flex',

  },
  tabs: {
    width: '100%'
  },
  tabContainer: {
    padding: 10,
    maxHeight: 340,
    overflowY: 'scroll'
  },
  mapContainer: {
    padding: 10,
    maxHeight: 340,
  },
  navContainerSmall: {
    width: '100%',
    height: 350,
  },
  navCountainerLarge: {
    width: '100%',
    height: '100%',
  },
  paper: {
    height: '100%'
  },
  progress: {
    marginTop: '70%'
  }

}

export class DirectoryContainer extends Component {
  state = {
    value: 0,
    selectedLocation: '11737723'
  }

  componentDidMount = () => {
    if(this.props.UI.country.length === 0){
      this.props.getLocationData(this.state.selectedLocation)
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { 
      classes, 
      user, 
      UI: {
        loading,
        country
      } 
    } = this.props
    const { value, selectedLocation } = this.state
    return (
      <Paper square className={classes.paper}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Hidden smUp implementation="css">
              <Tabs
                centered
                value={this.state.value}
                indicatorColor="primary"
                textColor="primary"
                onChange={this.handleChange}
              >
                <Tab label="Directory" />
                <Tab label="Map" />
              </Tabs>
              <Grid className={value === 0 ? classes.tabContainer : classes.mapContainer} item xs={12}>
                {value === 0 ?
                  loading || !Object.keys(country).length > 0 ?
                  <CircularProgress className={classes.progress} />
                  : <GlobeNav selectLoc={selectedLocation} />
                  : ''}
                {value === 1 
                  && <Globe size={'small'} />}
              </Grid>
            </Hidden> 
            <Hidden xsDown implementation='css'>
              <Grid container spacing={0} className={classes.navContainerSmall} >
                <Grid item align='center' xs={3}>
                  {loading 
                    ? <CircularProgress className={classes.progress} /> 
                    : !Object.keys(country).length > 0
                    ? <CircularProgress className={classes.progress} />
                    : <GlobeNav selectLoc={selectedLocation} /> }
                </Grid>
                <Grid item xs={9}>
                  <Globe user={user} />
                </Grid>
              </Grid>
            </Hidden>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI
})

const mapDispatchToProps = {
  getLocationData
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DirectoryContainer))
