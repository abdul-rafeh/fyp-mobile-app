import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import Header from './Header';
import {Teams, Venue} from '../Helpers/Teams';
import Config from '../Config';
import DropDownPicker from 'react-native-dropdown-picker';
import {LineChart} from 'react-native-chart-kit';
import {post} from '../Request';

export default class T20 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team_a: '',
      team_b: '',
      overs: '',
      balls: '',
      runsTillNow: '',
      wicketsTillNow: '',
      foursTillNow: '',
      sixesTillNow: '',
      wideBallsTillNow: '',
      noBallsTillNow: '',
      runLast5Overs: '',
      wicketsLast5Overs: '',
      venue: '',
    };
  }
  handleSubmit = async (
    overs,
    balls,
    team_a,
    team_b,
    runsTillNow,
    wicketsTillNow,
    foursTillNow,
    sixesTillNow,
    wideBallsTillNow,
    noBallsTillNow,
    runLast5Overs,
    wicketsLast5Overs,
    venue,
  ) => {
    const dataA = {
      venue: venue,
      bat_team: team_a,
      bowl_team: team_b,
      runs: runsTillNow,
      wickets: wicketsTillNow,
      overs: parseFloat(overs + '.' + balls),
      runs_last_5: runLast5Overs,
      wickets_last_5: wicketsLast5Overs,
      fours_till_now: foursTillNow,
      sixes_till_now: sixesTillNow,
      no_balls_till_now: noBallsTillNow,
      wide_balls_till_now: wideBallsTillNow,
    };

    const dataB = {
      venue: venue,
      bowl_team: team_a,
      bat_team: team_b,
      runs: runsTillNow,
      wickets: wicketsTillNow,
      overs: parseFloat(overs + '.' + balls),
      runs_last_5: runLast5Overs,
      wickets_last_5: wicketsLast5Overs,
      fours_till_now: foursTillNow,
      sixes_till_now: sixesTillNow,
      no_balls_till_now: noBallsTillNow,
      wide_balls_till_now: wideBallsTillNow,
    };
    this.setState({isLoading: true});
    console.log(dataA);
    let teamAPrediction = await post(
      Config.URL.PREDICTION.PREDICT_MATCH_T20,
      dataA,
    );
    let teamBPrediction = await post(
      Config.URL.PREDICTION.PREDICT_MATCH_T20,
      dataB,
    );

    if (
      teamAPrediction &&
      teamBPrediction &&
      teamAPrediction.data &&
      teamBPrediction.data
    ) {
      this.setState({
        teamAPrediction: teamAPrediction.data,
        teamBPrediction: teamBPrediction.data,
        isLoading: false,
        predicted: true,
      });
    } else {
      this.setState({error: true, isLoading: false});
    }
  };

  render() {
    var teamArray = [];
    var venueArray = [];
    Teams.map((team) => {
      teamArray.push({label: team, value: team});
    });
    Venue.map((venue) => {
      venueArray.push({label: venue, value: venue});
    });
    return (
      <>
        <View style={styles.container}>
          <Header {...this.props} />
          <ScrollView ref={(node) => (this.scroll = node)}>
            <View>
              <Text style={{padding: 10}}>Batting team</Text>
              <DropDownPicker
                items={teamArray}
                defaultValue="Afghanistan"
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
                onChangeItem={(item) => this.setState({team_a: item.value})}
              />
              <Text style={{padding: 10}}>Bowling team</Text>
              <View style={{paddingBottom: 50}}>
                <DropDownPicker
                  items={teamArray}
                  defaultValue="Australia"
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
                  onChangeItem={(item) => this.setState({team_b: item.value})}
                />
              </View>
              <View style={{paddingBottom: 70}}>
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
                  defaultValue="AMI Stadium"
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
                  onChangeItem={(item) => this.setState({venue: item.value})}
                />
              </View>
            </View>
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                padding: 10,
              }}>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Overs"
                  placeholderTextColor="#808080"
                  onChangeText={(val) => this.setState({overs: val})}
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Balls"
                  placeholderTextColor="#808080"
                  onChangeText={(val) => this.setState({balls: val})}
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Runs Till Now"
                  placeholderTextColor="#808080"
                  onChangeText={(val) => this.setState({runsTillNow: val})}
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Wickets Till Now"
                  placeholderTextColor="#808080"
                  onChangeText={(val) => this.setState({wicketsTillNow: val})}
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Fours Till Now"
                  placeholderTextColor="#808080"
                  onChangeText={(val) => this.setState({foursTillNow: val})}
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Sixes Till Now"
                  placeholderTextColor="#808080"
                  onChangeText={(val) => this.setState({sixesTillNow: val})}
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Wides Till Now"
                  placeholderTextColor="#808080"
                  onChangeText={(val) => this.setState({widesTillNow: val})}
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="No Balls Till Now"
                  placeholderTextColor="#808080"
                  onChangeText={(val) => this.setState({noBallsTillNow: val})}
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Runs Last 5 Overs"
                  placeholderTextColor="#808080"
                  onChangeText={(val) => this.setState({runLast5Overs: val})}
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Wickets Last 5 Overs"
                  placeholderTextColor="#808080"
                  onChangeText={(val) =>
                    this.setState({wicketsLast5Overs: val})
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
                  // {
                  //   loginHandler(data.email, data.password);
                  // }
                  // this.handleSubmit(
                  //   this.state.overs,
                  //   this.state.balls,
                  //   this.state.team_a,
                  //   this.state.team_b,
                  //   this.state.runsTillNow,
                  //   this.state.wicketsTillNow,
                  //   this.state.foursTillNow,
                  //   this.state.sixesTillNow,
                  //   this.state.wideBallsTillNow,
                  //   this.state.noBallsTillNow,
                  //   this.state.runLast5Overs,
                  //   this.state.wicketsLast5Overs,
                  //   this.state.venue,
                  // );

                  this.scroll.scrollTo({y: 1000});
                  this.setState({scroll: true});
                }}>
                <Text style={(styles.loginText, {color: 'white'})}>
                  Predict
                </Text>
              </TouchableOpacity>
              {this.state.scroll ? (
                <>
                  <Text>Bezier Line Chart</Text>
                  <LineChart
                    data={{
                      labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                      ],
                      datasets: [
                        {
                          data: [
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                          ],
                        },
                      ],
                    }}
                    width={Dimensions.get('window').width} // from react-native
                    height={220}
                    yAxisLabel="$"
                    yAxisSuffix="k"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                      backgroundColor: '#e26a00',
                      backgroundGradientFrom: '#fb8c00',
                      backgroundGradientTo: '#ffa726',
                      decimalPlaces: 2, // optional, defaults to 2dp
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      labelColor: (opacity = 1) =>
                        `rgba(255, 255, 255, ${opacity})`,
                      style: {
                        borderRadius: 16,
                      },
                      propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#ffa726',
                      },
                    }}
                    bezier
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                    }}
                  />
                </>
              ) : null}
            </View>
          </ScrollView>
        </View>
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
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
