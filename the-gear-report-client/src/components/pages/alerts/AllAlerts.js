import React from 'react'
import { getAlerts } from '../../../redux/actions/alertActions'
import { setError, clearErrors } from '../../../redux/actions/userActions'
import { connect } from 'react-redux'
import MaterialTable from 'material-table'
import { withStyles } from '@material-ui/core/styles'
import CreateAlert from '../../dialogs/CreateAlert'
import { Redirect } from 'react-router-dom'
import dayjs from 'dayjs'
//Mui
import { AccountCircle } from '@material-ui/icons'

export class AllTickets extends React.Component {
  state = {
    createAlertOpen: false,
    redirect: false,
    user: ''
  }

  componentDidMount = () => {
    if(this.props.alerts.length < 1){
      this.props.getAlerts()
    }
  }

  componentWillUnmount = () => {
    this.props.clearErrors()
  }

  closeCreateAlert = () => {
    this.setState({
     createAlertOpen: false
    })
  }

  handleRowClick = (e, rowData) => {
    this.props.history.push(`/alert/${rowData.alertId}`)
  }

  handleCreateAlert = () => {
    this.props.authenticated ? (
      this.setState({ createAlertOpen: true })
    ) : (
      this.props.setError('You must be signed in to add an Alert')
    )
  }

  render() {
    const { classes, loading } = this.props
    let { alerts } = this.props
    if(alerts.length > 0) alerts.forEach((alert, i) => alerts[i].createdAt = dayjs(alert.createdAt.substring(0, 10)).format('DD/MM/YYYY'))
    if(this.state.redirect){
      return <Redirect push to={`/profile/${this.state.user}`} />
    }

    return (
      <div className={classes.allTicketsContainer}>
        <MaterialTable 
          onRowClick= {(e, rowData) => this.handleRowClick(e, rowData)}
          isLoading={loading}
          columns={[
            { title: 'Title', field: 'title', filtering: false, },
            { title: 'Severity', field: 'severity', type: 'numeric'},
            { title: 'Sponsored', field: 'sponsored', type: 'boolean', },
            { title: 'Resolved', field: 'resolved', type: 'boolean' },
            { title: 'Created By', field: 'userHandle'},
            { title: 'Date Created', field: 'createdAt', type: 'datetime', filtering: false,},
          ]}
          style={{
            maxWidth: '100%'
          }}
          data={alerts}
          title="Alert Directory"
          options={{
            filtering: true,
            pageSize: 10,
            pageSizeOptions: [10, 20, 50],
          }}
          actions={[
            {
              icon: AccountCircle,
              tooltip: 'View Profile',
              onClick: (e, rowData) => {
                this.setState({ redirect: true, user: rowData.userHandle})
                // this.props.history.push(`/profile/${rowData.userHandle}`)
              },
            },
            {
              icon: 'add',
              tooltip: 'Add Alert',
              isFreeAction: true,
              onClick: () => this.handleCreateAlert()
            }
          ]}
        />
        <CreateAlert
          open={this.state.createAlertOpen} 
          closeAllDialogs={this.closeCreateAlert}
        />
      </div>
    )
  }
}

const styles = theme => ({
  ...theme
})

const mapStateToProps = state => ({
  alerts: state.data.allAlerts,
  authenticated: state.user.authenticated,
  loading: state.data.loadingAllAlerts
})

const mapDispatchToProps = {
  getAlerts,
  setError,
  clearErrors
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AllTickets))