import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'

import styled from '../../utils/styled'
import Page from '../../components/layout/Page'
import Container from '../../components/layout/Container'
import DataTable from '../../components/layout/DataTable'
import LoadingOverlay from '../../components/data/LoadingOverlay'
import LoadingOverlayInner from '../../components/data/LoadingOverlayInner'
import LoadingSpinner from '../../components/data/LoadingSpinner'

import { ApplicationState, ConnectedReduxProps } from '../../store'
//import { Repo } from '../../store/metrics/types'
import { changeUsername, fetchRepos } from '../../store/metrics/actions'

import { darken } from 'polished';

// Separate state props + dispatch props to their own interfaces.
interface PropsFromState {
  loading: boolean
  data: any
  errors: string
  username: string
}

// We can use `typeof` here to map our dispatch types to the props, like so.
interface PropsFromDispatch {
  fetchRepos: typeof fetchRepos
  changeUsername: typeof changeUsername
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = PropsFromState & PropsFromDispatch & ConnectedReduxProps

class MetricsIndexPage extends React.Component<AllProps> {
  public componentDidMount() {


  }

  onChangeUsername = async () => {
    await this.props.changeUsername(this.props.username)
  }

  onSubmitForm = () => {
    console.log('submit');
    this.props.fetchRepos(this.props.username);
  }

  public render() {
    const { loading, username } = this.props;

    return (
      <Page>
        <Container>
          <FormWrapper>
            <Form onSubmit={
              (e: React.FormEvent<HTMLFormElement>) => {
                if (e !== undefined && e.preventDefault) {
                  e.preventDefault();
                }
                console.log('submit inside');
                this.props.fetchRepos(this.props.username);
              }}>
              <label htmlFor="username">
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter a Github Username"
                  value={username}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    this.props.changeUsername(e.target.value)}
                />
              </label>
              <ButtonWrapper>
                <Button
                  type="submit"
                  className="btn btn-primary"
                >
                  Submit
                </Button>
              </ButtonWrapper>
            </Form>
          </FormWrapper>
          {this.props.errors && (<ErrorWrapper>
            There has been a terrible error: {this.props.errors}
          </ErrorWrapper>)}
          <TableWrapper>
            {loading && (
              <LoadingOverlay>
                <LoadingOverlayInner>
                  <LoadingSpinner />
                </LoadingOverlayInner>
              </LoadingOverlay>
            )}
            {this.renderData()}
          </TableWrapper>
        </Container>
      </Page >
    )
  }

  private renderError() {
    const { errors } = this.props
    return (
      <FormWrapper>
        Apologies an error has occurred: {errors}
      </FormWrapper>
    )
  }


  private renderData() {
    const { loading, data } = this.props

    return (
      <DataTable columns={['Repo Name', 'Github Link', 'Size']} widths={['auto', '', '']}>
        {loading &&
          data === undefined && (
            <RepoLoading>
              <td colSpan={3}>Loading...</td>
            </RepoLoading>
          )}
        {data !== undefined && data.map !== undefined &&
          data.map(Repo => (
            <tr key={Repo.id}>
              <RepoDetail>
                <RepoIcon src={Repo.owner.avatar_url} alt={Repo.owner.login} />
                <RepoName>
                  <Link to={`/metrics/${Repo.name}`}>{Repo.name}</Link>
                </RepoName>
              </RepoDetail>
              <td>
                <a href={Repo.html_url}>GitHubLink</a>
              </td>
              <td>
                {Repo.size / 1000 > 1 ? Repo.size / 1000000 > 1 ? Repo.size / 100000 + " GB " : Repo.size / 1000 + " MB" : Repo.size + " KB"}
              </td>
            </tr>
          ))}
      </DataTable>
    )
  }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ metrics }: ApplicationState) => ({
  loading: metrics.loading,
  errors: metrics.errors,
  data: metrics.data,
  username: metrics.username
})

// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeUsername: (username: string) => dispatch(changeUsername(username)),
  fetchRepos: (username: string) => dispatch(fetchRepos(username))
})

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MetricsIndexPage)


const TableWrapper = styled('div')`
  position: relative;
  max-width: ${props => props.theme.widths.md};
  margin: 0 auto;
  min-height: 200px;
`

const Input = styled('input')`
  outline: none;
  padding: 8px;
  border-bottom: 1px #999;
`;

const ButtonWrapper = styled('div')`
border-radius: 8px;
  padding: 10px;
  color: ${props => darken(0.25, props.theme.colors.white)};
`

const Button = styled('button')`
position: relative;
margin: 0 auto;
padding: 8px;
outline: none;
box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 125px inset;
color: ${props => darken(0.25, props.theme.colors.black)};
`

const FormWrapper = styled('div')`
  position: relative;
  background:  ${props => darken(0.25, props.theme.colors.attrs.str)};
  overflow: hidden;
  border-radius: 8px;
  color: ${props => darken(0.25, props.theme.colors.white)};
`

const Form = styled('form')`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 3rem;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 125px inset;
  z-index: 2;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    flex-direction: row;
  }
`

const RepoDetail = styled('td')`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const ErrorWrapper = styled('td')`
display: flex;
flex-direction: row;
align-items: center;
color: rgb(200,0,0);
padding: 10px;
`


const RepoIcon = styled('img')`
  width: 32px;
  height: 32px;
`

const RepoName = styled('div')`
  flex: 1 1 auto;
  height: 100%;
  margin-left: 1rem;

  a {
    color: ${props => props.theme.colors.brand};
  }
`

const RepoLoading = styled('tr')`
  td {
    height: 48px;
    text-align: center;
  }
`
