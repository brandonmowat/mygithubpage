// main.js

var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');
var $ = require('jquery');

// Forcast.io API Key
var apiKey = '151d781924566285d4b596a01f8c0ca0';
var lat;
var long;
var temp = {"currently": {"temperature": "--"}};
var url = "https://api.forecast.io/forecast/"+apiKey+"/"+lat+","+long+"/?units=si";

// variable Getters & Setters
function updateLatitude(coord) {
  lat = coord;
}
function updateLongitude(coord) {
  long = coord;
}
function updateURL() {
  url = "https://api.forecast.io/forecast/"+apiKey+"/"+lat+","+long+"/?units=si";
}
function setLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          updateLatitude(position.coords.latitude);
          updateLongitude(position.coords.longitude);
          updateURL();
          callback();
        });
    } else { 
    }
}
// Update location
// - update location if location has changed (threshold -> 0.1 degrees)
function updateLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          if (Math.abs(lat-position.coords.latitude) >= 0.1) {
            console.log("Updating Latitude: " + lat + " -> " + position.coords.latitude);
            updateLatitude(position.coords.latitude);
            updateURL();
          }
          if (Math.abs(long-position.coords.longitude) >= 0.1) {
            console.log("Updating Longitude: " + long + " -> " + position.coords.longitude);
            updateLongitude(position.coords.longitude);
            updateURL();
          }
        });
    } else { 
    }
}

// Current temperature
var CurrentTemp = React.createClass({
  componentDidMount: function() {

  },
  render: function() {
    console.log("Rendering the current temperature.");
    // If no weather update
    if (typeof(this.props.data.currently) === "undefined") {
      console.log("Still no weather update yet...");
      return(<h1>--</h1>);
    }
    // Weather has been received
    else {
      console.log("Got an update on the temperature!");
      console.log("data: ",this.props.data);
      return (
          <h1 class="">{Math.round(this.props.data.currently.temperature)}</h1>
      );
    }
  }
});

var CurrentWeather = React.createClass({
  getInitialState: function() {
    return {data: {"test": 2}};
  },
  getCurrentTemp: function() {
    updateLocation();
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    setLocation(this.getCurrentTemp);
    setInterval(this.getCurrentTemp, 10000); // get tempupdate every 10s
  },
  render: function() {
    return (
      <CurrentTemp data={this.state.data} />
    );
  }
});

// Date and Time
var DateAndTime = React.createClass({
  render: function() {
    return (
      <div>
        <h1>{moment().format('h:mm')}</h1>
        <h2>{moment().format('dddd')}</h2>
        <h2>{moment().format('MMMM Do')}</h2>
      </div>
    );
  }
});

// Main
ReactDOM.render(
  <CurrentWeather/>, 
  document.getElementById("current")
);
ReactDOM.render(
  <DateAndTime />,
  document.getElementById("date")
);