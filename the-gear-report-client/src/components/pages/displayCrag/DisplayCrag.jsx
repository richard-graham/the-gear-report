import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { updateSearchLocation } from '../../../redux/actions/tcActions'
import Beta from './Beta'
import ChildTable from './ChildTable'
//Mui
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

export class DisplayCrag extends Component {

  componentDidUpdate = () => {
    const { location, match, country, loading } = this.props
    //if the location is the standard result go get the data for 
    if('parent' in country && location.id !== match.params.locationID && !loading) {
      console.log();
      this.props.updateSearchLocation(match.params.locationID, country)
    }
  }

  handleRowClick = (child) => {
    this.props.updateSearchLocation(child.id, this.props.country)
  }

  render() {
    const { location, classes, match, country, loading } = this.props

    return location.additionalInfo ? (
      <div className={classes.container}>
        <Typography
          gutterBottom
          variant={'h3'}
          className={classes.title}
        >{location.name}</Typography>

        <Grid container spacing={32}>
          <Grid item sm={12} xs={12}>
            {location.beta && <Beta locationBeta={location.beta} />}
          </Grid>
          <Grid item sm={12} xs={12}>
            {location.children && <ChildTable children={location.children} handleClick={this.handleRowClick} />}
          </Grid>
        </Grid>
      </div>
    ) : (''
      //add spinner here
    )
  }
}

const styles = {
  container: {
    padding: 10
  },
  title: {
    padding: 10
  }
}

const mapStateToProps = (state) => ({
  location: state.UI.location,
  country: state.UI.country,
  loading: state.UI.location.loading
})

const mapDispatchToProps = {
  updateSearchLocation
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DisplayCrag))
