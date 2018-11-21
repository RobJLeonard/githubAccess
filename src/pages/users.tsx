import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, Route, Switch } from 'react-router-dom'

import UsersIndexPage from './users/index'
import ShowUsersPage from './users/show'

import { ApplicationState, ConnectedReduxProps } from '../store'
import { User, Friend } from '../store/users/types'

// Separate state props + dispatch props to their own interfaces.
interface PropsFromState {
  loading: boolean
  user: User
  errors: string
  authenticated: string
  OAuthToken: string
  friends: Friend[]
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = PropsFromState & RouteComponentProps<{}> & ConnectedReduxProps

class UsersPage extends React.Component<AllProps> {
  public render() {
    const { match } = this.props

    return (
      <Switch>
        <Route exact path={match.path + '/'} component={UsersIndexPage} />
        <Route path={match.path + '/:name'} component={ShowUsersPage} />
      </Switch>
    )
  }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ users }: ApplicationState) => ({
  loading: users.loading,
  errors: users.errors,
  user: users.user,
  OAuthToken: users.OAuthToken,
  authenticated: users.authenticated,
  friends: users.friends
})

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(mapStateToProps)(UsersPage)
