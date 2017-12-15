import React, { Component } from 'react';

const images = [
  {
    small: '/kelsey-tim-1_preview.jpeg',
    full: '/kelsey-tim-6_preview.jpeg'
  },
  {
    small: '/kelsey-tim-6_preview.jpeg',
    full: '/kelsey-tim-6_preview.jpeg'
  },
  {
    small: '/kelsey-tim-14_preview.jpeg',
    full: '/kelsey-tim-14_preview.jpeg',
  },
  {
  small: '/kelsey-tim-55_preview.jpeg',
  full: '/kelsey-tim-55_preview.jpeg',  
  },
  {
    small: '/kelsey-tim-66_preview.jpeg',
    full: '/kelsey-tim-66_preview.jpeg',
  },
  {
    small: '/img.jpeg',
    full: '/img.jpeg',
  }, 
  {
    small: '/img2.jpeg',
    full: '/img2.jpeg',
  }
]

const guests = ['Kate', 'Ian']

class App extends Component {
  state = {
    showDetails: false,
    guests: []
  };

  componentDidMount() {
    const code = window.localStorage.getItem('rsvpCode')
    if (code) {
      this.setState({ guests })
    }
  }

  handleKeyUp = e => {
    if (e.key === 'Enter') {
      this.input.blur();
      this.setState({
        showDetails: true,
        guests
      }, () => {
        document.getElementById('details').scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }

  renderHero() {
    return (
      <div className="container">
        <div className="overlay" />
        <div id="img" />
        <div className="content">
          <div className="names">Kelsey + Tim</div>
          <div className="title">We're Getting Married</div>
          <div className="date">July 7, 2018 / Chicago</div>
          {!this.state.showInput &&
            <div className="button" onClick={() => this.setState({ showInput: true })}>RSVP</div>
          }
          {this.state.showInput &&
            <input
              autoFocus
              type="text"
              onKeyUp={this.handleKeyUp}
              placeholder="enter your code"
              ref={input => this.input = input}
            />
          }
        </div>
      </div>
    );
  }

  updateGuest(guest, isComing) {
    console.log(guest.name, isComing)
    const i = this.state.guests.findIndex(g => g.name === guest.name);
    const updatedGuests = this.state.guests
    this.setState({
      isComing: !this.state.isComing
    })
  }

  openImage(src) {
    this.setState({
      viewingImage: src
    })
  }

  renderDetails() {
    return (
      <div id="details" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
        {this.state.viewingImage &&
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.82)'
          }}>
            <div style={{
              position: 'absolute',
              top: 16,
              right: 16,
              fontSize: '2em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: 3,
              height: 50,
              width: 50,
              cursor: 'pointer'
            }}
            onClick={() => this.setState({viewingImage: ''})}>&times;</div>
            <img src={this.state.viewingImage} style={{width: '100%'}}/>
          </div>
        }
        <section>
          <div>
            <h1 style={{marginTop: 16}}>Show a personalized note right here.</h1>
            {/* <p>We hope to see you at our wedding!</p> */}
            <div>
              <div style={{marginBottom: 16}}>{this.state.guests[0]} and {this.state.guests[1]}, will you be joining us?</div>
              <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                <div className="cb-group">
                  <Checkbox checked={this.state.isComing} handleClick={() => this.setState({ isComing: true })}/>
                  <div>Accept with pleasure</div>
                </div>
                <div className="cb-group">
                  <Checkbox checked={!this.state.isComing} handleClick={() => this.setState({ isComing: false })}/>
                  <div>Decline with regret</div>
                </div>
              </div>
            </div>
            {/* <div style={{width: '100%' }}>
              <textarea placeholder="Send us a note if you want"/>
            </div>
            <div className="button button-secondary">Send</div> */}
          </div>
        </section>
        <section>
          <div>
            <h2>Wedding Details</h2>
            <p>We're going to have a casual ceremony on the rooftop of Little Goat in the west loop, where we had our first Valentine's day together. There's gonna be a bunch of food, vegetarian, etc. and drinks and dancing and it's gonna be great.</p>
            <p>6:00p - 11:00p, Little Goat, Chicago IL</p>
          </div>
        </section>
        <section>
          <div>
            <h2>Our Story</h2>
            <p>Tim White and Kelsey Hoehn met at a New Years party in Chicago. We picked up the balloon drop like ballers and now we're in love. We have a pig and a gato.</p>
          </div>
        </section>
        <section>
          <div>
            <h2>Accomodations</h2>
            <p>We reserved blocks of rooms at Some Hotel in Some Neighborhood. Rates are $100 per night with the discount.</p>
            <p>Also check out AirBnB because you'll probably find something cheaper and cozier.</p>
          </div>
        </section>
        <section>
          <div style={{
            maxWidth: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h2>Photos</h2>
            <div style={{width: '100%', maxWidth: 1000,
            display: 'flex',
            flexFlow: 'row wrap',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
              {images.map((img, i) => (
                <div
                  className="image"
                  style={{
                    backgroundImage: `url(${img.small})`,
                    backgroundSize: 'cover',
                    backgroundPosition: '50%',
                    width: '100%',
                    margin: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => this.openImage(img.full)}
                />
              ))}
            </div>
          </div>
        </section>
        <section>
          <div>
            <h2>Registry</h2>

          </div>
        </section>
      </div>
    )
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        {this.renderHero()}
        {this.state.showDetails &&
          this.renderDetails()
        }
      </div>
    )
  }
}

const style = {
  checkbox: {
    fontSize: 36,
    border: '1px solid gray',
    height: 36,
    width: 36,
    position: 'relative',
    cursor: 'pointer',
    marginRight: 8
  },
  x: {
    borderTop: '1px solid',
    transform: 'rotate(45deg)',
    width: '100%',
    position: 'absolute',
    top: 18
  }
}

class Checkbox extends React.Component {
  state = {
    checked: this.props.checked,
    hovered: false
  };

  toggleChecked = () => {
    this.setState({
      hovered: !this.state.hovered
    })
  }

  render() {
    return (
      <div style={style.checkbox} onClick={this.props.handleClick}>
        <div style={{
          opacity: this.props.checked || this.state.hovered ? '1' : '0',
          transition: 'opacity 100ms ease-in-out'
        }}>
          <div style={style.x}/>
          <div style={{...style.x, transform: 'rotate(-45deg)'}}/>
        </div>
      </div>
    )
  }
}

export default App;
