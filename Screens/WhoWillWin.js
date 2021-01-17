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
import {Teams, Venue} from '../Helpers/Teams';
import Config from '../Config';
import DropDownPicker from 'react-native-dropdown-picker';
import {BarChart, LineChart, PieChart} from 'react-native-chart-kit';
import {post} from '../Request';
import {getFlagImages} from '../Helpers/Flags';
import {CardViewWithImage, CardView} from 'react-native-simple-card-view';
import {Rect, Text as TextSVG, Svg} from 'react-native-svg';
const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
};
export default class WhoWillWin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
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
      target: 0,
      teamAPrediction: '',
    };
  }
  componentDidMount() {
    this.setState({
      venue: 'Sharjah Cricket Stadium',
      team_a: 'Pakistan',
      team_b: 'India',
      runs: 100,
      wickets: 3,
      overs: 5,
      balls: 1,
      runs_last_5: 10,
      wickets_last_5: 0,
      fours_till_now: 0,
      sixes_till_now: 1,
      no_balls_till_now: 0,
      wide_balls_till_now: 0,
    });
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
    target,
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
      target: 0,
    };

    this.setState({isLoading: true});
    let teamAPrediction = await post(
      Config.URL.PREDICTION.PREDICT_MATCH_WITH_TARGET_ODI,
      dataA,
    );

    if (teamAPrediction) {
      this.setState({
        teamAPrediction: teamAPrediction,
        predicted: true,
      });
    }

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
      target: teamAPrediction.predictions.total + 1,
    };
    let teamBPrediction = await post(
      Config.URL.PREDICTION.PREDICT_MATCH_WITH_TARGET_ODI,
      dataB,
    );

    if (teamAPrediction && teamBPrediction) {
      this.setState({
        teamAPrediction: teamAPrediction,
        teamBPrediction: teamBPrediction,
        isLoading: false,
        predicted: true,
      });
      this.scroll.scrollTo({y: 1000});
    } else {
      this.setState({error: true, isLoading: false});
    }
  };
  getWinner = () => {
    const {teamAPrediction, teamBPrediction} = this.state;
    if (teamAPrediction.predictions.total > teamBPrediction.predictions.total) {
      return this.state.team_a;
    } else {
      return this.state.team_b;
    }
  };
  render() {
    const {teamAPrediction, teamBPrediction} = this.state;
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
            <View style={{zIndex: 3}}>
              <Text style={{padding: 10}}>Batting team</Text>
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
                onChangeItem={(item) => this.setState({team_a: item.value})}
              />
              <Text style={{padding: 10}}>Bowling team</Text>
              <View style={{zIndex: 2}}>
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
                  onChangeItem={(item) => this.setState({team_b: item.value})}
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
                  this.handleSubmit(
                    this.state.overs,
                    this.state.balls,
                    this.state.team_a,
                    this.state.team_b,
                    this.state.runsTillNow,
                    this.state.wicketsTillNow,
                    this.state.foursTillNow,
                    this.state.sixesTillNow,
                    this.state.wideBallsTillNow,
                    this.state.noBallsTillNow,
                    this.state.runLast5Overs,
                    this.state.wicketsLast5Overs,
                    this.state.venue,
                    this.state.target,
                  );
                  this.scroll.scrollTo({y: 1000});
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
                  <CardViewWithImage
                    width={400}
                    source={getFlagImages(this.getWinner())}
                    title={this.getWinner() + ' will win this match'}
                    imageWidth={100}
                    imageHeight={100}
                    roundedImage={true}
                    roundedImageValue={50}
                    imageMargin={{top: 10}}
                    // style={{shadowOpacity: 0.3}}
                  />
                  <CardView
                    style={{
                      width: '100%',
                      height: 200,
                      shadowOpacity: 0.3,
                      shadowColor: `'#808080'`,
                      // shadowRadius: 1,
                      borderRadius: 30,
                    }}>
                    <Text
                      style={{
                        marginLeft: 15,
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      TOTAL PREDCITED SCORE:
                    </Text>
                    <Text
                      style={{
                        marginLeft: 150,
                        fontSize: 40,
                        fontWeight: 'bold',
                        padding: 20,
                      }}>
                      {teamAPrediction.predictions.total}
                    </Text>
                  </CardView>
                  <CardView style={{width: '100%', shadowOpacity: 4}}>
                    <BarChart
                      style={{
                        marginVertical: 8,
                        borderRadius: 5,
                      }}
                      data={{
                        labels: ['10', '20', '30', '40', '50'],
                        datasets: [
                          {
                            data: teamAPrediction.predictions.runrates,
                            // data: [20, 45, 28, 80, 99, 43],
                          },
                        ],
                      }}
                      segments={4}
                      width={Dimensions.get('window').width} // from react-native
                      height={220}
                      verticalLabelRotation={0}
                      fromZero={false}
                      chartConfig={{
                        backgroundColor: '#000',
                        backgroundGradientFrom: '#FFF',
                        backgroundGradientTo: '#FFF',
                        decimalPlaces: 1, // optional, defaults to 2dp
                        color: (opacity = 6) => `rgb(205, 92, 92)`,
                        labelColor: (opacity = 1) => `rgb(128, 128, 128)`,
                      }}
                    />
                  </CardView>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <LineChart
                      data={{
                        labels: ['10', '20', '30', '40', '50'],
                        datasets: [
                          {
                            data: teamAPrediction.predictions.runrates,
                            // data: [20, 45, 28, 80, 99, 43],
                          },
                        ],
                      }}
                      width={200} // from react-native
                      height={150}
                      yAxisInterval={1} // optional, defaults to 1
                      withDots={false}
                      withInnerLines={false}
                      withOuterLines={false}
                      withVerticalLines={false}
                      withHorizontalLines={false}
                      withVerticalLabels={false}
                      withHorizontalLabels={false}
                      bezier
                      chartConfig={{
                        backgroundColor: '#e26a00',
                        backgroundGradientFrom: '#fb8c00',
                        backgroundGradientTo: '#ffa726',
                        color: (opacity = 1) =>
                          `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) =>
                          `rgba(255, 255, 255, ${opacity})`,
                      }}
                      style={{
                        borderRadius: 5,
                      }}
                    />
                    <LineChart
                      data={{
                        labels: ['10', '20', '30', '40', '50'],
                        datasets: [
                          {
                            data: teamAPrediction.predictions.runrates,
                            // data: [20, 45, 28, 80, 99, 43],
                          },
                        ],
                      }}
                      width={200} // from react-native
                      height={150}
                      yAxisInterval={1} // optional, defaults to 1
                      withDots={false}
                      withInnerLines={false}
                      withOuterLines={false}
                      withVerticalLines={false}
                      withHorizontalLines={false}
                      withVerticalLabels={false}
                      withHorizontalLabels={false}
                      bezier
                      chartConfig={{
                        backgroundColor: '#33D1FF',
                        backgroundGradientFrom: '#33D1FF',
                        backgroundGradientTo: '#33D1FF',
                        color: (opacity = 1) =>
                          `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) =>
                          `rgba(255, 255, 255, ${opacity})`,
                      }}
                      style={{
                        borderRadius: 5,
                      }}
                    />
                  </View>
                  {/* <CardView
                    style={{width: '100%', height: 200, shadowOpacity: 0.5}}> */}
                  {/* <PieChart
                      data={
                        [
                          {
                            name: 'Total Fours',
                            population: teamAPrediction.predictions.total_fours,
                            color: 'rgba(131, 167, 234, 1)',
                            legendFontColor: '#7F7F7F',
                            legendFontSize: 15,
                          },
                          {
                            name: 'Total Sixes',
                            population: teamAPrediction.predictions.total_sixes,
                            color: '#F00',
                            legendFontColor: '#7F7F7F',
                            legendFontSize: 15,
                          },
                        ]
                        // piedata
                      }
                      width={Dimensions.get('window').width - 16}
                      height={250}
                      chartConfig={chartConfig}
                      accessor={'population'}
                      backgroundColor={'transparent'}
                      paddingLeft={'30'}
                      center={[10, 50]}
                      absolute
                      style={{
                        marginBottom: 10,
                        borderRadius: 16,
                      }}
                      /> */}

                  {/* </CardView> */}
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
