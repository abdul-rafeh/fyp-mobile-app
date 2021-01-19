import React, {Component} from 'react';
import {Text, View, ActivityIndicator, SafeAreaView} from 'react-native';
import {get} from '../Request';
import {Card, Text as TextElement} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';

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
  renderBatsman = (batsman) => {
    return (
      <>
        <View style={{flexDirection: 'row'}}>
          <TextElement style={{fontWeight: 'bold', fontSize: 15}}>
            Name:{' '}
          </TextElement>
          <TextElement style={{fontSize: 15}}>{batsman.name}</TextElement>
        </View>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <TextElement style={{fontWeight: 'bold', fontSize: 15}}>
            Runs Scored:{' '}
          </TextElement>
          <TextElement style={{}}>{batsman.runs}</TextElement>
        </View>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <TextElement style={{fontWeight: 'bold', fontSize: 15}}>
            Balls Faced:{' '}
          </TextElement>
          <TextElement style={{fontSize: 15}}>{batsman.ballsFaced}</TextElement>
        </View>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <TextElement style={{fontWeight: 'bold', fontSize: 15}}>
            Strike Rate:{' '}
          </TextElement>
          <TextElement style={{fontSize: 15}}>{batsman.strikeRate}</TextElement>
        </View>
      </>
    );
  };
  render() {
    const {match} = this.state;
    return (
      <SafeAreaView>
        {this.state.isLoading ? (
          <ActivityIndicator />
        ) : (
          <>
            <ScrollView>
              <Card containerStyle={{padding: 7}}>
                <View style={{flexDirection: 'row'}}>
                  <TextElement style={{fontWeight: 'bold', fontSize: 15}}>
                    Toss Decision:{' '}
                  </TextElement>
                  <TextElement style={{}}>{match.tossMessage}</TextElement>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <TextElement style={{fontWeight: 'bold', fontSize: 15}}>
                    Match Result:{' '}
                  </TextElement>
                  <TextElement style={{}}>
                    {match.matchSummary.matchSummaryText}
                  </TextElement>
                </View>
              </Card>
              <Card containerStyle={{padding: 7}}>
                <Card.Title>Team Batting</Card.Title>
                <Card.Divider />
                <View style={{flexDirection: 'row'}}>
                  <TextElement style={{fontWeight: 'bold', fontSize: 15}}>
                    Score:{' '}
                  </TextElement>
                  <TextElement style={{fontSize: 15}}>
                    {match.teamBatting.score}
                  </TextElement>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <TextElement style={{fontWeight: 'bold', fontSize: 15}}>
                    Short Name:{' '}
                  </TextElement>
                  <TextElement style={{}}>
                    {match.teamBatting.shortName}
                  </TextElement>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <TextElement style={{fontWeight: 'bold', fontSize: 15}}>
                    Team Name:{' '}
                  </TextElement>
                  <TextElement style={{fontSize: 15}}>
                    {match.teamBatting.name}
                  </TextElement>
                </View>
              </Card>
              <Card containerStyle={{padding: 7}}>
                <Card.Title>Team Bowling</Card.Title>
                <Card.Divider />
                <View style={{flexDirection: 'row'}}>
                  <TextElement style={{fontWeight: 'bold', fontSize: 15}}>
                    Score:{' '}
                  </TextElement>
                  <TextElement style={{fontSize: 15}}>
                    {match.teamBowling.score}
                  </TextElement>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <TextElement style={{fontWeight: 'bold', fontSize: 15}}>
                    Short Name:{' '}
                  </TextElement>
                  <TextElement style={{}}>
                    {match.teamBowling.shortName}
                  </TextElement>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <TextElement style={{fontWeight: 'bold', fontSize: 15}}>
                    Team Name:{' '}
                  </TextElement>
                  <TextElement style={{fontSize: 15}}>
                    {match.teamBowling.name}
                  </TextElement>
                </View>
              </Card>
              <Card containerStyle={{padding: 7}}>
                <Card.Title>Umpires</Card.Title>
                <Card.Divider />
                <View style={{flexDirection: 'row'}}>
                  <TextElement style={{fontWeight: 'bold', fontSize: 15}}>
                    First Umpire:{' '}
                  </TextElement>
                  <TextElement style={{fontSize: 15}}>
                    {match.umpires.firstUmpire.name}
                  </TextElement>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <TextElement style={{fontWeight: 'bold', fontSize: 15}}>
                    Second Umpire:{' '}
                  </TextElement>
                  <TextElement style={{}}>
                    {match.umpires.secondUmpire.name}
                  </TextElement>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <TextElement style={{fontWeight: 'bold', fontSize: 15}}>
                    Third Umpire:{' '}
                  </TextElement>
                  <TextElement style={{fontSize: 15}}>
                    {match.umpires.thirdUmpire.name}
                  </TextElement>
                </View>
              </Card>
              <Card containerStyle={{padding: 7}}>
                <Card.Title>Striker</Card.Title>
                <Card.Divider />
                {match.currentBatters[0].isFacing
                  ? this.renderBatsman(match.currentBatters[1])
                  : this.renderBatsman(match.currentBatters[0])}
              </Card>
              <Card containerStyle={{padding: 7}}>
                <Card.Title>Umpires</Card.Title>
                <Card.Divider />
                <View style={{flexDirection: 'row'}}>
                  <TextElement style={{fontWeight: 'bold', fontSize: 15}}>
                    Name:{' '}
                  </TextElement>
                  <TextElement style={{fontSize: 15}}>
                    {match.bowler.name}
                  </TextElement>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <TextElement style={{fontWeight: 'bold', fontSize: 15}}>
                    Wickets:{' '}
                  </TextElement>
                  <TextElement style={{}}>{match.bowler.wickets}</TextElement>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <TextElement style={{fontWeight: 'bold', fontSize: 15}}>
                    Run Against:{' '}
                  </TextElement>
                  <TextElement style={{}}>
                    {match.bowler.runsAgainst}
                  </TextElement>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <TextElement style={{fontWeight: 'bold', fontSize: 15}}>
                    Bowler Over:{' '}
                  </TextElement>
                  <TextElement style={{fontSize: 15}}>
                    {match.bowler.bowlerOver}
                  </TextElement>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <TextElement style={{fontWeight: 'bold', fontSize: 15}}>
                    Economy:{' '}
                  </TextElement>
                  <TextElement style={{fontSize: 15}}>
                    {match.bowler.economy}
                  </TextElement>
                </View>
              </Card>
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    );
  }
}
