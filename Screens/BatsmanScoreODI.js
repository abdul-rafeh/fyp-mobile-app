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
    };
  }
  handleSubmit = async (values) => {
    values.over = values.over + '.' + values.balls;
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
    return (
      <View style={styles.container}>
        <Header {...this.props} />
        <ScrollView ref={(node) => (this.scroll = node)}></ScrollView>
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
