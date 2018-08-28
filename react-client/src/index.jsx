import React from 'react';
import ReactDOM from 'react-dom';
import List from './components/List.jsx';
import Search from './components/Search.jsx';
import axios from 'axios';
import styled from 'styled-components';

const InfoStyle = styled.div  `
  float: 'left',
  width: '35%',
  height: '35%',
  borderWidth: '2px',
  textAlign: 'center',
`

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      items: [],
      word: ''
    };
    this.componentDidMount=this.componentDidMount.bind(this);
  }

  escapeDoubleQuotes(str) {
  return str.replace(/\\([\s\S])|(")/, ""); // thanks @slevithan!
  }

  componentDidMount() {
    axios.get('/tweets')
    .then( (response) => {      
      var array = [];
      var objectCount = {};
      for(var i = 0; i<response.data.length; i++){
        var objectTemp = {};
        var score = parseFloat(response.data[i].substring(response.data[i].length - 8));
        var description = this.escapeDoubleQuotes(response.data[i].substring(0,response.data[i].length-8))
        description = description.replace(' ', '').substring(0,description.length-2);
        if(description){
          if(!objectCount[description]){
            objectCount[description] = 1;
          }else{
            objectCount[description]++;
          }
          objectTemp[description] = score; 
        }
        array.push(objectTemp);
      }
      console.log(objectCount);

      var avg = Array.from(array.reduce(
        (acc, obj) => Object.keys(obj).reduce( 
            (acc, key) => typeof obj[key] == "number"
                ? acc.set(key, ( // immediately invoked function:
                        ([sum, count]) => [sum+obj[key], count+1] 
                    )(acc.get(key) || [0, 0])) // pass previous value
                : acc,
        acc),
        new Map()), 
        ([name, [sum, count]]) => ({ name, average: sum/count })
      );

      console.log(avg);
      this.setState({items:avg});
      this.render();
    })
    .catch( (error) => {
      console.log(error);
    });
  }

  updateWordFile(word){
    this.setState({word:word})
    console.log(this.state.word, 'tha word');
    var word1 = this.state.word;
    axios.post('/tweets', {
        word:word
      }
    )
    .then((response) => {
    this.componentDidMount();

    })
    .catch( (error) => {
      console.log(error);
    });
  }

  render () {
    return (
      <InfoStyle>
        <h1>Sentiments for {this.state.word} in Twitter</h1>
        <Search updateWordFile={this.updateWordFile.bind(this)}/>
        <List items={this.state.items}/>
    </InfoStyle>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));