import React, { Component, Fragment } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { submitPledge } from '../../../../../redux/actions/workPlanActions'
//Mui
import { withStyles } from '@material-ui/core/styles'
import Slider from '@material-ui/lab/Slider';
import Green from '@material-ui/core/colors/green'
import Red from '@material-ui/core/colors/red'
import Indigo from '@material-ui/core/colors/indigo'
import Avatar from '@material-ui/core/Avatar'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Button from '@material-ui/core/Button'
//Mui Icons
import AttachMoney from '@material-ui/icons/AttachMoneyOutlined'
import { Typography } from '@material-ui/core';


export class WorkPlan extends Component {

  state = {
    pledged: 0
  };

  handleChange = (event, pledged) => {
    this.setState({ pledged });
  };

  handlePledgeSubmit = (id) => {
    this.props.submitPledge(this.state.pledged, id)
  }

  planStatus = (completed, completionDate) => {
    let expired = !moment(completionDate).add('2', 'd').isAfter(new Date())
    let status
    if (completed) {
      status = 'Completed'
    } else if (expired) {
      status = 'Expired'
    } else {
      status = 'Current'
    }
    return status
  }

  render() {
    const { workPlans, classes } = this.props
    const { pledged } = this.state;
    const defaultPic = "https://firebasestorage.googleapis.com/v0/b/the-gear-report-a2ce8.appspot.com/o/no-image.png?alt=media"


    return (
      <Fragment>
        {workPlans.map((workPlan, i) => {
          const { 
            userImage, 
            userHandle, 
            allowSponsors, 
            completed, 
            completionDate, 
            estimatedCost, 
            plan, 
            totalPledged, 
            userAvatarLetters,
            id
          } = workPlan
          const status = this.planStatus(completed, completionDate)
          const expired = status === 'Expired' ? true : false
          console.log(status);
          return (
              <ExpansionPanel key={i}>
                <ExpansionPanelSummary 
                  className={classNames(
                    classes.header, {
                      [classes.green]: status === 'Completed',
                      [classes.red]: status === 'Expired',
                      [classes.indigo]: status === 'Current'
                    }
                  )}
                >
                    <div className={classes.myAvatarContainer}>
                      <Link to={`/profile/${userHandle}`} style={{ textDecoration: 'none' }}>
                        {userImage === defaultPic ? (
                        <Avatar aria-label='User' className={classes.myAvatar}>
                          {userAvatarLetters}
                        </Avatar>
                        ) : (
                          <img src={userImage} className={classes.userImage} alt='user' />
                        )}
                      </Link>
                    </div>
                    <div className={classes.myCardHeaderContent}>
                        <span className={classes.myCardTitle} >
                          Completion Date
                        </span>
                      <Typography variant='body2' className={classes.myCardDate} >
                        {moment(completionDate).format('Do MMMM YYYY')}
                      </Typography>
                    </div>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                <div className={classes.contentContainer} >
                  <div className={classes.content}>
                    <div className={classes.planContainer}>
                      <Typography>Status: {status}</Typography>
                      <Typography 
                        variant={'body2'}
                        className={classes.plan}
                      >"{plan}"</Typography>
                      <Typography variant='subtitle2'>
                        <Link 
                          to={`/profile/${userHandle}`} 
                          style={{ textDecoration: 'none', color: '#212121'}}
                        >-{userHandle}</Link>
                      </Typography>
                    </div>
                    
                    {allowSponsors &&
                    <div className={classes.pledgeContainer}> 
                      <div className={classes.calculationContainer}>
                      <Typography variant='h6'>Pledge</Typography>
                        <div className={classes.calculation}>
                          <Typography>Estimated Cost:</Typography>
                          <Typography variant='h6'>${estimatedCost}</Typography>
                        </div>
                        <div className={classes.calculation}>
                          <Typography>Total Pledged:</Typography>
                          <Typography variant='h6'>${totalPledged + pledged}</Typography>
                        </div>
                        <div className={classes.calculation}>
                          <Typography>Your Contribution:</Typography>
                          <Typography variant='h6'>${pledged}</Typography>
                        </div>
          
                        <Slider
                          value={pledged}
                          aria-labelledby="slider-image"
                          onChange={this.handleChange}
                          min={0}
                          max={expired ? 0 : Number(estimatedCost)}
                          step={5}
                          classes={{
                            container: classes.slider,
                            thumbIconWrapper: classes.thumbIconWrapper,
                          }}
                          thumb={
                            <AttachMoney className={classes.dollar} />
                          }
                        />
                        {expired && <Typography color='secondary' style={{ textAlign: 'center' }}>This plan has expired</Typography>}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <Button
                            color='primary'
                            variant='contained'
                            size='small'
                            className={classes.submitButton}
                            onClick={() => this.handlePledgeSubmit(id)}
                          >Submit</Button>
                          <Typography style={{ textAlign: 'center' }}>New to pledging? Learn more <Link to='/'>here</Link>.</Typography>
                        </div>
                      </div>
                    </div>}
                  </div>
                </div>

                </ExpansionPanelDetails>
              </ExpansionPanel>
          )
        })}
      </Fragment>
    )
  }
}

const styles = theme => ({
  ...theme,
  root: {
    width: 300,
  },
  dollar: {
    color: Green[500], 
    height: 36, 
    width: 36, 
    borderRadius: '50%',
    backgroundColor: Indigo[50]
  },
  slider: {
    padding: '22px 0px',
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  thumbIcon: {
    borderRadius: '50%',
  },
  thumbIconWrapper: {
    height: 36,
    width: 36
  },
  tooltip: {
    backgroundColor: '#fff',
  },
  plan: {
    marginTop: 5
  },
  planContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%'
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  content: {
    margin: 13
  },
  pledgeContainer: {
    marginTop: 20,
    minWidth: '100%',
    height: '100%',
  },
  myAvatarContainer: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    marginRight: 16
  },
  header: {
    display: 'flex',
    alignItems: 'center'
  },
  green: {
    backgroundColor: Green[100]
  },
  red: {
    backgroundColor: Red[100]
  },
  indigo: {
    backgroundColor: Indigo[50]
  },
  userImage: {
    height: 37,
    width: 37,
    borderRadius: '50%'
  },
  myCardHeaderContent: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
    
  },
  myCardTitle: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: '0.875rem',
    'fontFamily': '"Roboto", "Helvetica", "Ariel", sans-serif'
  },
  myCardDate: {
    color: 'rgba(0, 0, 0, 0.54)'
  },
  calculationContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '55%',
    paddingTop: 10,
    [theme.breakpoints.down('md')]: {
      paddingTop: 0,
      maxWidth: '100%'
    }

  },
  calculation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  submitButton: {
    marginTop: 15,
    maxWidth: 'fit-content',
    alignSelf: 'center',
    marginBottom: 15
  }
})

const mapDispatchToProps = {
  submitPledge
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(WorkPlan))
