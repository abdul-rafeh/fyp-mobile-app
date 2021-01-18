import React, {Component} from 'react';
import {Text, View, ActivityIndicator, SafeAreaView} from 'react-native';
import {get} from '../Request';
export default class LiveMatch extends Component {
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
  getMatchDetails = (matchID, seriesID) => {
    get(
      'https://dev132-cricket-live-scores-v1.p.rapidapi.com/matchdetail.php',
      {
        'x-rapidapi-key': 'f893ea82cdmshe13a300c1080d0bp182fbejsnd7bb8eef91d6',
        useQueryString: true,
      },
      {
        seriesid: seriesID,
        matchid: matchID,
      },
    )
      .then((response) => {
        if (response) {
          this.setState({
            match: response.matchDetail,
            isLoading: false,
          });
        } else {
          this.setState({match: '', isLoading: false});
        }
      })
      .catch((error) => {
        this.setState({match: '', isLoading: false});
      });
  };
  mapData = (innings) => {
    let data = [];
    innings.map((item) => {
      item.isDeclared = item.isDeclared ? 'Yes' : 'No';
      data.push(item);
    });
    return innings;
  };
  render() {
    const {match} = this.state;
    return (
      <SafeAreaView>
        <View>
          {this.state.isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text> textInComponent </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }
}
