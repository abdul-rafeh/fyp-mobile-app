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
import LinearGradient from 'react-native-linear-gradient';
import {Card, Avatar, Text as TextElement} from 'react-native-elements';
export default class T20 extends Component {
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
      Config.URL.PREDICTION.PREDICT_MATCH_WITH_TARGET_T20,
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
      Config.URL.PREDICTION.PREDICT_MATCH_WITH_TARGET_T20,
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
    if (this.state.isLoading === false) {
      setTimeout(() => {
        this.scroll.scrollTo({y: 700});
      }, 1000);
    }
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
                marginTop: 10,
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
                    <LinearGradient
                      colors={['#00ff59', '#89ff89', '#ffffff']}
                      start={{x: 0.0, y: 0.5}}
                      end={{x: 0.5, y: 1.0}}
                      locations={[0.75, 0.5, 0.1]}
                      // useAngle: true, angle: 45
                    >
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
                    </LinearGradient>
                  </Card>
                  <Card containerStyle={{width: '100%'}}>
                    <Card.Title style={{fontSize: 16}}>
                      Run Rate Prediction
                    </Card.Title>
                    <Card.Divider />
                    <BarChart
                      style={{
                        marginVertical: 8,
                        borderRadius: 5,
                      }}
                      data={{
                        labels: ['4', '8', '12', '16', '20'],
                        datasets: [
                          {
                            data: teamAPrediction.predictions.runrates,
                            // data: [20, 45, 28, 80, 99, 43],
                          },
                        ],
                      }}
                      segments={4}
                      width={375} // from react-native
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
                  </Card>

                  <Card containerStyle={{width: '100%'}}>
                    <Card.Title style={{fontSize: 16}}>
                      Predicted Boundries
                    </Card.Title>
                    <Card.Divider />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                      }}>
                      <Card containerStyle={{width: '50%'}}>
                        <Card.Title style={{fontSize: 12}}>
                          Predicted Fours
                        </Card.Title>
                        <Card.Divider />
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <TextElement h1>
                            {teamAPrediction.predictions.total_fours}
                          </TextElement>
                        </View>
                      </Card>
                      <Card containerStyle={{width: '50%'}}>
                        <Card.Title style={{fontSize: 12}}>
                          Predicted Sixes
                        </Card.Title>
                        <Card.Divider />
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <TextElement h1>
                            {teamAPrediction.predictions.total_sixes}
                          </TextElement>
                        </View>
                      </Card>
                    </View>
                  </Card>
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
