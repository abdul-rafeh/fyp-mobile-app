import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import Header from './Header';
import {ODI_TEAMS as Teams, VENUE_ODI as Venue} from '../Helpers/Teams';
import Config from '../Config';
import DropDownPicker from 'react-native-dropdown-picker';
import {BarChart, LineChart, PieChart} from 'react-native-chart-kit';
import {post, get} from '../Request';
import {getFlagImages} from '../Helpers/Flags';
import {Card, Avatar, Text as TextElement} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
export default class LiveMatchPrediction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      match: '',
    };
  }

  componentDidMount() {
    let search = this.props.route.params.search;
    search = search.split('/');
    let matchID = search[0].replace('?', '');
    let seriesID = search[1];
    this.getMatchDetails(matchID, seriesID);
  }
  handleSubmit = async (values) => {
    this.setState({isLoading: true});

    let teamAPrediction = await post(
      Config.URL.PREDICTION.PREDICT_MATCH_WITH_TARGET_ODI,
      values,
    );
    let dataB = {
      venue: 'Shere Bangla National Stadium',
      bat_team: values.bat_team,
      bowl_team: values.bowl_team,
      runs: 0,
      wickets: 0,
      overs: 0.1,
      runs_last_5: 0,
      wickets_last_5: 0,
      fours_till_now: 0,
      sixes_till_now: 0,
      no_balls_till_now: 0,
      wide_balls_till_now: 0,
      target: 0,
    };

    let teamBPrediction = await post(
      Config.URL.PREDICTION.PREDICT_MATCH_WITH_TARGET_ODI,
      dataB,
    );

    if (teamAPrediction && teamBPrediction) {
      this.setState({
        teamAPrediction: teamAPrediction,
        teamBPrediction: teamBPrediction,
        team_a: values.bat_team,
        team_b: values.bowl_team,
      });
    } else {
      this.setState({error: true, isLoading: false});
    }
  };
  handleSubmitSecondIteration = async (values) => {
    this.setState({isLoading: true});
    let teamAPrediction = await post(
      Config.URL.PREDICTION.PREDICT_MATCH_WITH_TARGET_ODI,
      values,
    );

    let dataB = {
      venue: 'Shere Bangla National Stadium',
      bat_team: values.bowl_team,
      bowl_team: values.bat_team,
      runs: 0,
      wickets: 0,
      overs: 0.1,
      runs_last_5: 0,
      wickets_last_5: 0,
      fours_till_now: 0,
      sixes_till_now: 0,
      no_balls_till_now: 0,
      wide_balls_till_now: 0,
      target: teamAPrediction.predictions.total + 1,
    };

    let teamBPrediction = await post(
      Config.URL.PREDICTION.PREDICT_MATCH_WITH_TARGET_ODI,
      dataB,
    );

    if (teamAPrediction && teamBPrediction) {
      this.setState({
        teamAPredictionSecondIteration: teamAPrediction,
        teamBPredictionSecondIteration: teamBPrediction,
        team_a_second_iteration: values.bat_team,
        team_b_second_iteration: values.bowl_team,
        isLoading: false,
        predicted: true,
      });
    } else {
      this.setState({error: true, isLoading: false});
    }
  };
  getMatchDetails = (matchID, seriesID) => {
    get(
      'https://dev132-cricket-live-scores-v1.p.rapidapi.com/matchdetail.php',
      {
        'x-rapidapi-key': 'f893ea82cdmshe13a300c1080d0bp182fbejsnd7bb8eef91d6',
        useQueryString: true,
        'Access-Control-Allow-Origin': '*',
      },
      {
        seriesid: seriesID,
        matchid: matchID,
      },
    )
      .then((response) => {
        if (response) {
          get(
            'https://dev132-cricket-live-scores-v1.p.rapidapi.com/match.php',
            {
              'x-rapidapi-key':
                'f893ea82cdmshe13a300c1080d0bp182fbejsnd7bb8eef91d6',
              useQueryString: true,
              'Access-Control-Allow-Origin': '*',
            },
            {
              seriesid: response.matchDetail.matchSummary.series.id,
              matchid: response.matchDetail.matchSummary.id,
            },
          )
            .then((matchResponse) => {
              let match = matchResponse.match;
              let teamA = match.awayTeam.name;
              let teamB = match.homeTeam.name;
              teamA = teamA.substring(0, teamA.length - 4);
              teamB = teamB.substring(0, teamB.length - 4);

              // if (match.status === "UPCOMING") {
              let values = {
                venue: 'Shere Bangla National Stadium',
                bat_team: teamA,
                bowl_team: teamB,
                runs: 0,
                wickets: 0,
                overs: 0.1,
                runs_last_5: 0,
                wickets_last_5: 0,
                fours_till_now: 0,
                sixes_till_now: 0,
                no_balls_till_now: 0,
                wide_balls_till_now: 0,
                target: 0,
              };
              this.handleSubmit(values);
              let valuesSecondIteration = {
                venue: 'Shere Bangla National Stadium',
                bat_team: teamB,
                bowl_team: teamA,
                runs: 0,
                wickets: 0,
                overs: 0.1,
                runs_last_5: 0,
                wickets_last_5: 0,
                fours_till_now: 0,
                sixes_till_now: 0,
                no_balls_till_now: 0,
                wide_balls_till_now: 0,
                target: 0,
              };

              //   this.handleSubmitSecondIteration(valuesSecondIteration);

              // }
            })
            .catch((error) => {
              console.log(error);
              console.log(error);
              console.log(error);
              console.log(error);
            });
        } else {
          this.setState({match: '', isLoading: false});
        }
      })
      .catch((error) => {
        this.setState({match: '', isLoading: false});
      });
  };
  getWinner = () => {
    const {teamAPrediction, teamBPrediction} = this.state;
    if (teamAPrediction.predictions.total > teamBPrediction.predictions.total) {
      return this.state.team_a;
    } else {
      return this.state.team_b;
    }
  };
  getWinnerSecond = () => {
    const {
      teamAPredictionSecondIteration,
      teamBPredictionSecondIteration,
    } = this.state;
    if (
      teamAPredictionSecondIteration.predictions.total >
      teamBPredictionSecondIteration.predictions.total
    ) {
      return this.state.team_a_second_iteration;
    } else {
      return this.state.team_b_second_iteration;
    }
  };

  render() {
    const {teamAPrediction, teamAPredictionSecondIteration} = this.state;
    return (
      <ScrollView ref={(node) => (this.scroll = node)}>
        {this.state.isLoading ? (
          <ActivityIndicator />
        ) : this.state.predicted ? (
          <>
            <TextElement h3>
              Stats if {this.state.team_a} bats first
            </TextElement>
            <Card containerStyle={{width: '100%'}}>
              <Card.Title style={{fontSize: 16}}>
                Winner Team Prediction
              </Card.Title>
              <Card.Divider />
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Avatar
                  size="large"
                  source={getFlagImages(this.getWinner())}
                  overlayContainerStyle={{backgroundColor: 'white'}}
                  activeOpacity={0.7}
                />
                <TextElement style={{marginTop: 20, fontWeight: 'bold'}}>
                  {this.getWinner()}
                </TextElement>
              </View>
            </Card>
            <Card
              containerStyle={{
                width: '100%',
              }}>
              <Card.Title style={{fontSize: 16}}>
                Batting Team Predicted Score
              </Card.Title>
              <Card.Divider />

              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 40,
                    fontWeight: 'bold',
                    padding: 20,
                    color: '#808080',
                  }}>
                  {teamAPrediction.predictions.total}
                </Text>
              </View>
            </Card>
          </>
        ) : null}
      </ScrollView>
    );
  }
}
