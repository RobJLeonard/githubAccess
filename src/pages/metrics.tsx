import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, Route, Switch } from 'react-router-dom'

import MetricsIndexPage from './metrics/index'
import ShowMetricsPage from './metrics/show'


import { ApplicationState, ConnectedReduxProps } from '../store'

// Separate state props + dispatch props to their own interfaces.
interface PropsFromState {
  loading: boolean
  username: string
  errors: string
  data: any
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = PropsFromState & RouteComponentProps<{}> & ConnectedReduxProps

class MetricsPage extends React.Component<AllProps> {
  public render() {
    const { match } = this.props

    return (
      <Switch>
        <Route exact path={match.path + '/'} component={MetricsIndexPage} />
        <Route path={match.path + '/:name'} component={ShowMetricsPage} />
      </Switch>
    )
  }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ metrics }: ApplicationState) => ({
  loading: metrics.loading,
  errors: metrics.errors,
  username: metrics.username,
  data: metrics.data
})

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(mapStateToProps)(MetricsPage)
