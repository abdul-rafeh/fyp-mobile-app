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
      overs: '',
      balls: '',
      scoreByStriker: '',
      totalScoreByTeam: '',
      totalFoursbyStriker: '',
      totalSixesByStiker: '',
      venue: '',
      bowling_team: '',
      striker: '',
    };
  }
  handleSubmit = async (
    overs,
    balls,
    venue,
    bowling_team,
    totalSixesByStiker,
    totalScoreByTeam,
    totalFoursbyStriker,
    striker,
    scoreByStriker,
  ) => {
    const values = {
      over: overs + '.' + balls,
      venue: venue,
      bowling_team: bowling_team,
      total_singles_by_striker_till_now:
        scoreByStriker - (totalFoursbyStriker * 4 + totalSixesByStiker * 6),
      striker: striker,
      total_batting_team_score_till_now: totalScoreByTeam,
      total_sixes_by_striker_till_now: totalSixesByStiker,
      total_fours_by_striker_till_now: totalFoursbyStriker,
      score_by_striker_till_now: scoreByStriker,
    };

    values.total_singles_by_striker_till_now =
      values.score_by_striker_till_now -
      (values.total_fours_by_striker_till_now * 4 +
        values.total_sixes_by_striker_till_now * 6);
    this.setState({isLoading: true});
    let batsmanScores = await post(
      Config.URL.PREDICTION.PREDICT_BATSMAN_WITH_TARGET_ODI,
      values,
    );
    this.setState({isLoading: false});
    if (batsmanScores && batsmanScores.status === 200) {
      this.setState({
        batsmanScores: batsmanScores.data.predictions,
        isLoading: false,
        predicted: true,
      });
    } else {
      this.setState({error: true, isLoading: false});
    }
  };
  componentDidMount() {
    this.setState({bating_team: 'Pakistan', striker: 'Azhar Ali'});
  }
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
      <View style={styles.container}>
        <Header {...this.props} />
        <ScrollView ref={(node) => (this.scroll = node)}>
          <Text style={{padding: 10}}>Bowling team</Text>
          <View>
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
              onChangeItem={(item) => this.setState({bowling_team: item.value})}
            />
          </View>
          <View>
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
                placeholder="Score by Striker"
                placeholderTextColor="#808080"
                onChangeText={(val) => this.setState({scoreByStriker: val})}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="Total Score by Team"
                placeholderTextColor="#808080"
                onChangeText={(val) => this.setState({totalScoreByTeam: val})}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="Total Fours by Striker"
                placeholderTextColor="#808080"
                onChangeText={(val) =>
                  this.setState({totalFoursbyStriker: val})
                }
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="Total Sixes by Striker"
                placeholderTextColor="#808080"
                onChangeText={(val) =>
                  this.setState({totalSixesbyStriker: val})
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
                  this.state.bowling_team,
                  this.state.scoreByStriker,
                  this.state.totalScoreByTeam,
                  this.state.totalFoursbyStriker,
                  this.state.venue,
                  this.state.totalSixesbyStriker,
                );
                this.scroll.scrollTo({y: 1000});
                this.setState({scroll: true});
              }}>
              <Text style={(styles.loginText, {color: 'white'})}>Predict</Text>
            </TouchableOpacity>
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