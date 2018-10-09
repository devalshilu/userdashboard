import React, { Component } from 'react';
import './App.css';
import { AreaChart } from 'react-d3-components';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userNames: [],
      user: {}
    };
  }
  selectedText(e) {
    console.log(e.target.value);
    axios.get('/api/user/' + e.target.value, {
      headers: { Authorization: "Bearer " + this.state.token }
    }).then(res => {
      console.log(res.data.data)
      this.setState({
        user: res.data.data,
      })
    })
      .catch(err => console.error(err));
  }
  componentDidMount() {
    axios.get('/auth').then(res => {
      this.setState({
        token: res.data.token,
      })
      axios.get("/api/userName", {
        headers: { Authorization: "Bearer " + res.data.token }
      })
        .then(response => {
          console.log(response.data.data)
          this.setState({
            userNames: response.data.data,
          })          
        })
        .catch(err => console.error(err));
    });
  }
  render() {
    let userNames = this.state.userNames;
    let optionItems = userNames.map((userName) =>
      <option key={userName} >{userName}</option>
    );

    return (
      <div>
        <div className="col-md-12">
          <select onChange={this.selectedText.bind(this)}>
            {optionItems}
          </select>
        </div>

        <div className="col-md-12 d-flex">
          <div className="col-md-6">
            <AreaChart
              data={this.state.user.weight}
              width={400}
              height={400}
              margin={{ top: 10, bottom: 50, left: 50, right: 10 }} />
          </div>
          <div className="col-md-6">
            <div className="user-detail">
              name : {this.state.user.name}
            </div>
            <div className="user-detail">
              age : {this.state.user.age}
            </div>
            <div className="user-detail">
              gender : {this.state.user.gender}
            </div>
            <div className="user-detail">
              company : {this.state.user.company}
            </div>
            <div className="user-detail">
              email : {this.state.user.email}
            </div>
            <div className="user-detail">
              phone : {this.state.user.phone}
            </div>
            <div className="user-detail">
              about : {this.state.user.about}
            </div>
          </div>
        </div>
      </div>

    );

  }
}

export default App;
