import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import Page from '../../components/layout/Page'
import Container from '../../components/layout/Container'

import { ApplicationState, ConnectedReduxProps } from '../../store'
import { Repo, Stats } from '../../store/metrics/types'
import { fetchRepoStats } from '../../store/metrics/actions'
import styled, { Theme } from '../../utils/styled'
import LoadingOverlay from '../../components/data/LoadingOverlay'
import LoadingOverlayInner from '../../components/data/LoadingOverlayInner'
import LoadingSpinner from '../../components/data/LoadingSpinner'
import { darken } from 'polished'
import { Themed } from 'react-emotion'

import Chart from '../../components/Chart';

import * as d3 from 'd3';
import { d3Types } from '../../d3Types';
import BarChart from '../../components/d3/BarChart';

// Separate state props + dispatch props to their own interfaces.
interface PropsFromState {
  loading: boolean
  repos: Repo[]
  errors: string
  username: string
  statsLoading: boolean
  stats: Stats
}

// We can use `typeof` here to map our dispatch types to the props, like so.
interface PropsFromDispatch {
  fetchRepoStats: typeof fetchRepoStats
}

interface RouteParams {
  name: string
}


// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = PropsFromState &
  PropsFromDispatch &
  RouteComponentProps<RouteParams> &
  ConnectedReduxProps

class ShowRepoPage extends React.Component<AllProps> {
  ref: SVGSVGElement;

  componentDidMount() {
    d3.select(this.ref)
      .append("circle")
      .attr("r", 50)
      .attr("cx", window.screen.availWidth / 4)
      .attr("cy", window.screen.availHeight / 4)
      .attr("fill", "red");
    //this.props.fetchRepoStats(this.props.username, this.props.match.params.name);
  }

  public render() {
    const { statsLoading, match, repos, stats } = this.props


    const selected = repos.find(Repo => Repo.name === match.params.name)
    const data = {
      all: [4, 3, 5, 6, 7, 3],
      owner: [0, 1, 2, 3, 4, 5]
    }


    return (
      <Page>
        <Container>
          <MetricWrapper>
            {statsLoading && (
              <LoadingOverlay>
                <LoadingOverlayInner>
                  <LoadingSpinner />
                </LoadingOverlayInner>
              </LoadingOverlay>
            )}
            <Chart data={...data.all} />
            {stats !== undefined && stats.length !== 0 && false &&
              (<BarChartWrapper>
                <AllBarChart>
                  <BarChart data={...data.all} color={'#ec0000'} size={[500, 500]} />
                </AllBarChart>
                <OwnerBarChart>
                  <BarChart data={...data.owner} color={'#0000ec'} size={[500, 500]} />
                </OwnerBarChart>
              </BarChartWrapper>
              )}
          </MetricWrapper>
        </Container>
      </Page >
    )
  }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ metrics }: ApplicationState) => ({
  loading: metrics.loading,
  errors: metrics.errors,
  repos: metrics.repos,
  username: metrics.username,
  stats: metrics.stats,
  statsLoading: metrics.statsLoading
})

// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchRepoStats: (username: string, repo_name: string) => { const payload = { username: username, repo_name: repo_name }; dispatch(fetchRepoStats(payload)) }
})

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowRepoPage)

const MetricWrapper = styled('div')`
  position: relative;
  max-width: ${props => props.theme.widths.md};
  margin: 0 auto;
  min-height: 200px;
`

const BarChartWrapper = styled('div')`
  position: relative;
`

const AllBarChart = styled('div')`
  display: flex;
  position: absolute;
  align-items: center;
  opacity: 0.5;
  justify-content: center;
`
const OwnerBarChart = styled('div')`
  display: flex;
  position: absolute;
  align-items: center;
  opacity: 0.5;
  justify-content: center;
`

const UserInfobox = styled('div')`
  position: relative;
  background: rgba(0, 0, 0, 0.9);
  overflow: hidden;
  border-radius: 8px;
  color: ${props => darken(0.25, props.theme.colors.white)};
`

const UserInfoboxBlurBackground = styled('img')`
  position: absolute;
  top: -12.5%;
  left: -12.5%;
  width: 125%;
  height: 125%;
  filter: blur(25px);
  object-fit: cover;
  opacity: 0.35;
  background-repeat: no-repeat;
  z-index: 1;
`

const UserInfoboxInner = styled('div')`
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

const UserInfoboxImage = styled('img')`
  display: block;
  flex-shrink: 0;
  width: 180px;
  height: 192px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 12px 32px;
  object-fit: cover;
  border-radius: 16px;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.3);
  border-image: initial;
`

const UserInfoboxHeading = styled('div')`
  flex: 1 1 100%;
  margin: 1.5rem 0 0;
  text-align: center;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    margin: 0 1.5rem;
    text-align: left;
  }
`

const UserName = styled('h1')`
  margin: 0;
  color: ${props => props.theme.colors.white};
  font-weight: 500;
`

const UserDetails = styled('p')`
  margin: 0.5rem 0 0;
  color: ${props => props.theme.colors.white};
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;

  & span {
    color: ${props => darken(0.25, props.theme.colors.white)};
  }
`

const UserStats = styled('div')`
  display: block;
  max-width: 500px;
  margin: 1.5rem 0 0;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 8px;
  padding: 12px;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    margin: 0;
    flex: 1 0 340px;
  }
`

const UserStatsInner = styled('div')`
  display: flex;
`
