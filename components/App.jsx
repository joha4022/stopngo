class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchedResults: null
    };
  }

  getYelp() {
    var context = this;
    var xmlhttp = new XMLHttpRequest();
    var yelpSearchTerm = document.getElementById("yelpSearchTerm").value;
    var stopToSearch = Number(document.getElementById("stopToSearch").value);
    if (stopToSearch+1 > markers.length-1 || stopToSearch <= 0 || typeof stopToSearch == "undefined") {
      alert("Stop does not exist. Please select another stop.");
    }
    else { 
      var sortVal = document.getElementById("sortBy").value;
      markers[stopToSearch+1].setAnimation(google.maps.Animation.BOUNCE);
      xmlhttp.open("GET","/search?query=" + yelpSearchTerm + "+" + markers[stopToSearch+1].position.lat() + "," + markers[stopToSearch+1].position.lng() + "+" + sortVal, true);
      xmlhttp.onreadystatechange = function () { 
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
          yelpResults = JSON.parse(xmlhttp.responseText);
          context.setState({
            searchedResults: yelpResults.businesses
          });
          console.log('getting here');
          setTimeout(function() {
            markers[stopToSearch+1].setAnimation(null);
          }, 1000);
        }
      }
    xmlhttp.send();
    }
  }

  sortResults() {
    this.setState({
      searchedResults: this.state.searchedResults.sort((a,b) => (b.review_count - a.review_count))
    });
  }

  render() {
    if (this.state.searchedResults !== null) {
      return (
        <div>
          <Input getYelp={this.getYelp.bind(this)} sortResults={this.sortResults.bind(this)}/>
          <Results searchedResults={this.state.searchedResults}/>
        </div>
      )
    } else {
      return (
        <div>
          <Input getYelp={this.getYelp.bind(this)}/>
        </div>
      )
    }
  }
}