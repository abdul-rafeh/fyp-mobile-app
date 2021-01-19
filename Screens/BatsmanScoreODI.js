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
  SafeAreaView,
} from 'react-native';
import Header from './Header';
import {Teams, Venue} from '../Helpers/Teams';
import Config from '../Config';
import DropDownPicker from 'react-native-dropdown-picker';
import {BarChart, LineChart, PieChart} from 'react-native-chart-kit';
import {post} from '../Request';
import {getFlagImages} from '../Helpers/Flags';
import {Players} from '../Helpers/Players';
import {Card, Avatar, Text as TextElement} from 'react-native-elements';
import {DataTable} from 'react-native-paper';
export default class BatsmanScoreODI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: [],

      // city: "Sharjah",
      // month: "October",
      // match_type: "ODI",
      // bat_team: "Pakistan",
      // bowling_team: "India",
      // batsman: "Mohammad Hafeez",
      // venue: "Sharjah Cricket Stadium",
    };
  }
  handleSubmit = async (
    overs,
    balls,
    venue,
    bowling_team,
    totalSixesbyStriker,
    totalScoreByTeam,
    totalFoursbyStriker,
    striker,
    scoreByStriker,
    bating_team,
  ) => {
    const values = {
      over: overs + '.' + balls,
      venue: venue,
      bowling_team: bowling_team,
      total_singles_by_striker_till_now:
        scoreByStriker - (totalFoursbyStriker * 4 + totalSixesbyStriker * 6),
      striker: striker,
      total_batting_team_score_till_now: totalScoreByTeam,
      total_sixes_by_striker_till_now: totalSixesbyStriker,
      total_fours_by_striker_till_now: totalFoursbyStriker,
      score_by_striker_till_now: scoreByStriker,
      balls: balls,
      bating_team: bating_team,
    };
    this.setState({isLoading: true});
    let batsmanScores = await post(
      Config.URL.PREDICTION.PREDICT_BATSMAN_WITH_TARGET_ODI,
      values,
    );
    this.setState({isLoading: false});
    if (batsmanScores) {
      let topPositions = batsmanScores.predictions.top_positions.map(
        (item) => item - 1,
      );
      topPositions.sort();
      this.setState({
        batsmanScores: batsmanScores.predictions,
        topPositions,
        totalByBatsman: batsmanScores.predictions.total,
        foursByBatsman: batsmanScores.predictions.total_fours,
        sixesByBatsman: batsmanScores.predictions.total_sixes,
        isLoading: false,
        predicted: true,
      });
    } else {
      this.setState({error: true, isLoading: false});
    }
  };
  componentDidMount() {
    this.setState({
      balls: 1,
      overs: 10,
      venue: 'Sheikh Zayed Stadium',
      bowling_team: 'India',
      totalSixesbyStriker: 0,
      totalScoreByTeam: 100,
      totalFoursbyStriker: 2,
      striker: 'Azhar Ali',
      scoreByStriker: 16,
      bating_team: 'Pakistan',
    });
  }
  render() {
    const {teamAPrediction, teamBPrediction} = this.state;
    var teamArray = [];
    var venueArray = [];
    var playerArray = [{label: 'Azhar Ali', value: 'Azhar Ali'}];
    Teams.map((team) => {
      teamArray.push({label: team, value: team});
    });
    Venue.map((venue) => {
      venueArray.push({label: venue, value: venue});
    });

    for (let key in Players) {
      if (key === this.state.bating_team) {
        playerArray = [];
        Players[key].batsmen.map((item) =>
          playerArray.push({label: item, value: item}),
        );
      }
    }
    if (this.state.isLoading === false) {
      setTimeout(() => {
        this.scroll.scrollTo({y: 700});
      }, 1000);
    }
    return (
      <View style={styles.container}>
        <Header {...this.props} />
        <ScrollView ref={(node) => (this.scroll = node)}>
          <View style={{marginBottom: 30}}>
            <View style={{zIndex: 4}}>
              <Text style={{padding: 10}}>Select Batting Team</Text>
              <DropDownPicker
                items={teamArray}
                defaultValue="Pakistan"
                containerStyle={{height: 40}}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  backgroundColor: '#fafafa',
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
                // eslint-disable-next-line react-native/no-inline-styles
                dropDownStyle={{
                  backgroundColor: '#fafafa',
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                }}
                onChangeItem={(item) =>
                  this.setState({
                    bating_team: item.value,
                    scroll: false,
                    loading: false,
                  })
                }
              />
            </View>
            <View style={{zIndex: 3}}>
              <Text style={{padding: 10}}>Select Batsman</Text>
              <DropDownPicker
                items={playerArray}
                defaultValue="Azhar Ali"
                containerStyle={{height: 40}}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  backgroundColor: '#fafafa',
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
                // eslint-disable-next-line react-native/no-inline-styles
                dropDownStyle={{
                  backgroundColor: '#fafafa',
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                }}
                onChangeItem={(item) =>
                  this.setState({
                    striker: item.value,
                    scroll: false,
                    loading: false,
                  })
                }
              />
            </View>
            <View style={{zIndex: 2}}>
              <Text style={{padding: 10}}>Bowling team</Text>
              <DropDownPicker
                items={teamArray}
                defaultValue="India"
                containerStyle={{height: 40}}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  backgroundColor: '#fafafa',
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
                // eslint-disable-next-line react-native/no-inline-styles
                dropDownStyle={{
                  backgroundColor: '#fafafa',
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                }}
                onChangeItem={(item) =>
                  this.setState({
                    bowling_team: item.value,
                    scroll: false,
                    loading: false,
                  })
                }
              />
            </View>
            <View style={{zIndex: 1}}>
              <Text style={{padding: 10}}>Venue</Text>
              <DropDownPicker
                items={venueArray}
                style={{
                  backgroundColor: '#fafafa',
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
                // eslint-disable-next-line react-native/no-inline-styles
                dropDownStyle={{
                  backgroundColor: '#fafafa',
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                }}
                defaultValue="Sharjah Cricket Stadium"
                containerStyle={{height: 40}}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  backgroundColor: '#fafafa',
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
                // eslint-disable-next-line react-native/no-inline-styles
                dropDownStyle={{
                  backgroundColor: '#fafafa',
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                }}
                onChangeItem={(item) =>
                  this.setState({
                    venue: item.value,
                    scroll: false,
                    loading: false,
                  })
                }
              />
            </View>
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                marginTop: 10,
              }}>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Overs"
                  placeholderTextColor="#808080"
                  onChangeText={(val) =>
                    this.setState({overs: val, scroll: false, loading: false})
                  }
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Balls"
                  placeholderTextColor="#808080"
                  onChangeText={(val) =>
                    this.setState({balls: val, scroll: false, loading: false})
                  }
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Score by Striker"
                  placeholderTextColor="#808080"
                  onChangeText={(val) =>
                    this.setState({
                      scoreByStriker: val,
                      scroll: false,
                      loading: false,
                    })
                  }
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Total Score by Team"
                  placeholderTextColor="#808080"
                  onChangeText={(val) =>
                    this.setState({
                      totalScoreByTeam: val,
                      scroll: false,
                      loading: false,
                    })
                  }
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Total Fours by Striker"
                  placeholderTextColor="#808080"
                  onChangeText={(val) =>
                    this.setState({
                      totalFoursbyStriker: val,
                      scroll: false,
                      loading: false,
                    })
                  }
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Total Sixes by Striker"
                  placeholderTextColor="#808080"
                  onChangeText={(val) =>
                    this.setState({
                      totalSixesbyStriker: val,
                      scroll: false,
                      loading: false,
                    })
                  }
                />
              </View>
            </View>
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => {
                  // eslint-disable-next-line no-lone-blocks
                  this.handleSubmit(
                    this.state.overs,
                    this.state.balls,
                    this.state.venue,
                    this.state.bowling_team,
                    this.state.totalSixesbyStriker,
                    this.state.totalScoreByTeam,
                    this.state.totalFoursbyStriker,
                    this.state.striker,
                    this.state.scoreByStriker,
                    this.state.bating_team,
                  );
                  this.setState({scroll: true});
                }}>
                <Text style={(styles.loginText, {color: 'white'})}>
                  Predict
                </Text>
              </TouchableOpacity>
              {this.state.isLoading ? (
                <ActivityIndicator />
              ) : this.state.predicted && this.state.scroll ? (
                <>
                  <Card containerStyle={{width: '100%'}}>
                    <Card.Title style={{fontSize: 16}}>
                      Standings Prediction
                    </Card.Title>
                    <Card.Divider />
                    <DataTable style={{width: '100%'}}>
                      <DataTable.Header>
                        <DataTable.Title
                          style={{
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                          }}>
                          Position
                        </DataTable.Title>
                        <DataTable.Title
                          style={{
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                          }}>
                          Score
                        </DataTable.Title>
                      </DataTable.Header>
                      {this.state.topPositions.map((i) => (
                        <DataTable.Row>
                          <DataTable.Cell
                            style={{
                              justifyContent: 'center',
                              alignItems: 'flex-end',
                            }}>
                            {i}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={{
                              justifyContent: 'center',
                              alignItems: 'flex-end',
                            }}>
                            {this.state.totalByBatsman[i]}
                          </DataTable.Cell>
                        </DataTable.Row>
                      ))}
                    </DataTable>
                  </Card>
                  <Card containerStyle={{width: '100%'}}>
                    <Card.Title style={{fontSize: 16}}>
                      Boundaries Prediction
                    </Card.Title>
                    <Card.Divider />
                    <DataTable style={{width: '100%'}}>
                      <DataTable.Header>
                        <DataTable.Title
                          style={{
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                          }}>
                          Position
                        </DataTable.Title>
                        <DataTable.Title
                          style={{
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                          }}>
                          Fours
                        </DataTable.Title>
                        <DataTable.Title
                          style={{
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                          }}>
                          Sixes
                        </DataTable.Title>
                      </DataTable.Header>
                      {this.state.topPositions.map((i) => (
                        <DataTable.Row>
                          <DataTable.Cell
                            style={{
                              justifyContent: 'center',
                              alignItems: 'flex-end',
                            }}>
                            {i}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={{
                              justifyContent: 'center',
                              alignItems: 'flex-end',
                            }}>
                            {this.state.foursByBatsman[i]}
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={{
                              justifyContent: 'center',
                              alignItems: 'flex-end',
                            }}>
                            {this.state.sixesByBatsman[i]}
                          </DataTable.Cell>
                        </DataTable.Row>
                      ))}
                    </DataTable>
                  </Card>
                </>
              ) : null}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 8,
  },
  forgot: {
    color: '#808080',
    fontSize: 11,
  },
  loginBtn: {
    width: '70%',
    backgroundColor: 'steelblue',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%',
    marginBottom: '3%',
  },
  inputView: {
    width: Math.round(Dimensions.get('window').width) / 2.25 - 10,
    backgroundColor: '#D8D8D8',
    borderRadius: 5,
    height: 50,
    margin: 10,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'black',
  },
});
