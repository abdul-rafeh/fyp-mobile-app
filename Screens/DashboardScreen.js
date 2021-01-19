import React, {Component} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  FlatList,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {get} from '../Request.js';
import Header from './Header';
import {Card, ListItem, Avatar, Button, Icon} from 'react-native-elements';
import moment from 'moment';
export default class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      allMatches: [],
    };
  }
  componentDidMount() {
    this.liveMatches();
  }
  liveMatches = () => {
    get('https://dev132-cricket-live-scores-v1.p.rapidapi.com/matches.php', {
      'x-rapidapi-key': 'f893ea82cdmshe13a300c1080d0bp182fbejsnd7bb8eef91d6',
    })
      .then((response) => {
        if (response) {
          this.setState({
            allMatches: response.matchList.matches,
            isLoading: false,
          });
        } else {
          this.setState({allMatches: [], isLoading: false});
        }
      })
      .catch((error) => {
        this.setState({allMatches: [], isLoading: false});
      });
  };
  renderItem({item}) {
    return <Text>{item.status}</Text>;
  }
  render() {
    const {allMatches} = this.state;
    return (
      <SafeAreaView>
        <Header {...this.props} />
        {this.state.isLoading ? (
          <ActivityIndicator />
        ) : (
          // <FlatList
          //   data={allMatches}
          //   renderItem={this.renderItem}
          //   keyExtractor={(item) => item.id}
          //   />
          <ScrollView>
            <Card containerStyle={{padding: 0}}>
              {allMatches.map((u, i) => (
                <ListItem key={i} bottomDivider>
                  <Avatar
                    size="large"
                    title={u.status}
                    rounded
                    onPress={() => console.log('Works!')}
                    activeOpacity={0.7}
                    titleStyle={{fontSize: 10}}
                    containerStyle={{backgroundColor: 'red'}}
                  />
                  <ListItem.Content>
                    <ListItem.Title style={{fontSize: 13}}>
                      {u.series.name}
                    </ListItem.Title>
                    <ListItem.Subtitle style={{fontSize: 12, color: '#808080'}}>
                      {u.status === 'UPCOMING'
                        ? 'Match will started on ' +
                          moment(u.startDateTime).format(
                            'MMMM Do YYYY, h:mm:ss a',
                          )
                        : u.matchSummaryText}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                  {u.status !== 'UPCOMING' ? (
                    <Button
                      // className="mr-2"
                      onPress={() =>
                        this.props.navigation.navigate('LiveMatch', {
                          search: u.id + '/' + u.series.id,
                        })
                      }
                      title="Stream"
                      type="outline"></Button>
                  ) : undefined}
                </ListItem>
              ))}
            </Card>
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }
}
