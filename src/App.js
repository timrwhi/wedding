import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import Hammer from 'react-hammerjs';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  databaseURL: process.env.REACT_APP_DB_URL,
};

const f = firebase.initializeApp(config);
const database = f.database();

const images = [
  {
    small: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-1_preview.jpeg',
    full: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-1-min.jpg'
  },
  {
    small: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-138_preview.jpeg',
    full: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-138-min.jpg',
  },
  {
    small: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-61_preview.jpeg',
    full: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-61-min.jpg',
  },
  {
    small: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-33_preview.jpeg',
    full: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-33-min.jpg',
  },
  {
    small: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-91_preview.jpeg',
    full: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-91-min.jpg',
  },
  {
    small: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-67_preview.jpeg',
    full: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-67-min.jpg',  
  },
  {
    small: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-153_preview.jpeg',
    full: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-153-min.jpg',
  },
  {
    small: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-72_preview.jpeg',
    full: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-72-min.jpg',
  },
  {
    small: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-90_preview.jpeg',
    full: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-90-min.jpg',
  },
  
  {
    small: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-98_preview.jpeg',
    full: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-98-min.jpg',
  },
  {
    small: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-129_preview.jpeg',
    full: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-129-min.jpg',
  },
  {
    small: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-6_preview.jpeg',
    full: 'https://s3.amazonaws.com/kelseyandtim.com/kelsey-tim-6-min.jpg'
  },
]

async function fetchIsSiteOpen() {
  return new Promise((resolve, reject) => {
    database.ref('opensite').once('value', x => resolve(x.val()));
  });
}

async function fetchInvitation(code, cb) {
  return new Promise((resolve, reject) => {
    database.ref(code).once('value', x => resolve(x.val()));
  });
}

function saveResponse(code, isComing) {
  database.ref(code).update({ isComing });
}

function saveMessage(code, message) {
  database.ref(`${code}/messages`).push(message);
}

class App extends Component {
  state = {
    bigImageIndex: 0,
    showDetails: false,
    guests: []
  };

  async componentDidMount() {
    const openSite = await fetchIsSiteOpen();
    this.setState({ openSite }, this.scrollToDetails)
    
    const rsvpCode = window.localStorage.getItem('rsvpCode')
    if (!rsvpCode) {
      return;
    }
    const invitation = await fetchInvitation(rsvpCode);
    if (invitation) {
      this.setState({ ...invitation, rsvpCode }, this.scrollToDetails)
    }
  }

  handleKeyUp = async e => {
    if (e.key === 'Enter') {
      const invitation = await fetchInvitation(this.state.attemptedRsvpCode);
      if (invitation) {
        this.input.blur();
        window.localStorage.setItem('rsvpCode', this.state.attemptedRsvpCode);
        this.setState({ ...invitation, rsvpCode: this.state.attemptedRsvpCode }, this.scrollToDetails)
      }
    }
  }

  handleChangeInput = e => {
    this.setState({ attemptedRsvpCode: e.target.value.toLowerCase() });
  }

  scrollToDetails = () => {
    const node = ReactDOM.findDOMNode(this.details);
    if (!node) {
      return;
    }
    setTimeout(() => {
      node.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200);
  }

  renderHero() {
    return (
      <div className="container">
        <div className="overlay" />
        <div id="img" />
        <div className="content">
          <div className="names">Kelsey + Tim</div>
          <div className="title">We&apos;re Getting Married</div>
          <div className="date">July 7, 2018 / Chicago</div>
          {!this.state.openSite && !this.state.showInput && !this.state.rsvpCode &&
            <div className="button" onClick={() => this.setState({ showInput: true })}>RSVP</div>
          }
          {!this.state.openSite && (this.state.showInput || this.state.rsvpCode) &&
            <input
              autoFocus={!this.state.rsvpCode}
              value={this.state.attemptedRsvpCode || this.state.rsvpCode || ''}
              type="text"
              onKeyUp={this.handleKeyUp}
              onChange={this.handleChangeInput}
              placeholder="enter your code"
              ref={input => this.input = input}
            />
          }
        </div>
      </div>
    );
  }

  openImage(i) {
    this.setState({
      bigImageIndex: i,
      viewingImage: images[i].full,
      placeholder: images[i].small,
    });
  }

  handleRSVP = isComing => {
    saveResponse(this.state.rsvpCode, isComing);
    this.setState({ isComing, hasResponded: true });
  }

  handleOpenSendMessage = () => {
    this.setState({ messageBoxOpen: true });
  }

  sendMessage = () => {
    saveMessage(this.state.rsvpCode, this.state.messageText);
    this.setState({ sendingMessage: true });
    setTimeout(() => {
      this.setState({ sendingMessage: false, sentMessage: true });
      setTimeout(() => {
        this.setState({ messageBoxOpen: false });
        setTimeout(() => {
          this.setState({ sentMessage: false });
        }, 200);
      }, 300);
    }, 500);
  }

  getSendMessageButtonText = () => {
    if (this.state.sendingMessage) return 'Sending...'
    if (this.state.sentMessage) return 'Sent!'
    return 'Send';
  }

  updateBigImageIndex(increment) {
    let newIndex = this.state.bigImageIndex + increment;
    if (newIndex === images.length) {
      this.setState({ bigImageIndex: 0 })
      this.openImage(0)
      return;
    }

    if (newIndex < 0) {
      this.setState({ bigImageIndex: images.length - 1 });
      this.openImage(images.length - 1)
      return;
    }

    this.setState({ bigImageIndex: newIndex })
    this.openImage(newIndex)
  }

  renderDetails() {
    return (
      <div
        id="details"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
        ref={details => {this.details = details}}
      >
        {this.state.viewingImage &&
          <BigImage
            handleShowPrev={() => this.updateBigImageIndex(-1)}
            handleShowNext={() => this.updateBigImageIndex(1)}
            handleClose={() => this.setState({viewingImage: ''})}
            placeholder={this.state.placeholder}
            src={this.state.viewingImage}
          />
        }
        {this.state.rsvpCode &&
        <section>
          <div>
            <h1 style={{marginTop: 16}}>
              {!this.state.message ?
                `Hey ${this.state.guests[0]} and ${this.state.guests[1]}! Will you be joining us?` :
                `${this.state.message}`
              }
            </h1>
            <div
              style={{
                overflow: 'hidden',
                position: 'absolute',
                zIndex: 9,
                background: 'white',
                width: 'calc(100% - 34px)',
                maxWidth: 600,
                height: this.state.messageBoxOpen ? 130 : 0,
                transition: 'height 200ms ease-in 100ms'
              }}
            >
              <textarea placeholder="Send us a message..." onChange={e => this.setState({messageText: e.target.value})} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div 
                  style={{
                    flex: 1,
                    fontSize: '0.75em',
                    background: '#c1c1c1',
                    borderRadius: 25,
                    padding: '4px 16px',
                    color: 'white',
                    cursor: 'pointer',
                    maxWidth: 200,
                  }}
                  onClick={this.sendMessage}
                >{this.getSendMessageButtonText()}</div>
                <div style={{
                  fontSize: '0.75em',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }} onClick={() => this.setState({ messageBoxOpen: false })}>cancel</div>
              </div>
            </div>
            <RSVP
              handleOpenSendMessage={this.handleOpenSendMessage}
              handleChange={this.handleRSVP}
              handleClearResponse={() => this.setState({ isComing: undefined })}
              isComing={this.state.isComing}
              yesText={this.state.buttons && this.state.buttons[0]}
              noText={this.state.buttons && this.state.buttons[1]}
              hasResponded={typeof this.state.isComing === 'boolean'}
            />
          </div>
        </section>
        }
        <section>
          <div>
            <h2>Wedding Weekend Details</h2>
            <h3>Welcome Dinner</h3>
            <p>Friday July 6th, 7:00p - 10:00p, Pizzeria Serio (<a target="_blank"
            rel="noopener noreferrer" href="https://www.google.com/maps/place/Pizzeria+Serio/@41.9397599,-87.6715078,15z/data=!4m5!3m4!1s0x0:0xbd348b70e925331a!8m2!3d41.9397599!4d-87.6715078">map</a>)</p>
            <p>We'll be hosting a welcome dinner for all guests on Friday night at one of our favorite pizza places in Chicago!</p>
            <h3>Ceremony and Reception</h3>
            <p>Saturday July 7th, 6:00p - 11:00p, Little Goat Diner (<a target="_blank"
            rel="noopener noreferrer" href="https://www.google.com/maps/place/Little+Goat+Diner/@41.8846919,-87.6506006,17z/data=!3m1!4b1!4m5!3m4!1s0x880e2cdab5b63bfb:0xddee29d79059dec7!8m2!3d41.8846919!4d-87.6484066">map</a>)</p>
            <p>The ceremony will be on the Little Goat Diner rooftop in the West Loop, where we had our first Valentine's day together. Following the ceremony we'll have music, drinks, and food (including plenty of gluten-free and vegetarian options) catered by The Girl &amp; the Goat and Little Goat Diner.</p>
          </div>
        </section>
        <section>
          <div>
            <h2>Accommodations</h2>
            <p>We reserved a block of rooms at the Crowne Plaza Hotel in Chicago's West Loop.</p>
            <p><a target="_blank" rel="noopener noreferrer" href="https://www.crowneplaza.com/redirect?path=asearch&brandCode=CP&localeCode=en&regionCode=1&hotelCode=CHISH&checkInDate=06&checkInMonthYear=062018&checkOutDate=08&checkOutMonthYear=062018&rateCode=6CBARC&_PMID=99801505&GPC=h2w&viewfullsite=true">Book a room online</a> or call 312.829.5000 and mention group code H2W.</p>
            <p>If you're driving and need parking, check out <a target="_blank" href="http://www.parkwhiz.com" rel="noopener noreferrer">ParkWhiz</a> to reserve a spot at a reasonable rate.</p>
            <p>Also check out <a href="https://www.airbnb.com/s/West-Loop--Chicago--IL--United-States/homes?place_id=ChIJ3baIM9osDogRVpFwiwqSLJQ&query=West%20Loop%2C%20Chicago%2C%20IL%2C%20United%20States&refinement_paths%5B%5D=%2Fhomes&allow_override%5B%5D=&s_tag=xtWgQWh7" target="_blank" rel="noopener noreferrer">AirBnB</a> and <a href="https://www.vrbo.com/results?pets=false&q=West+Loop%2C+Chicago%2C+IL%2C+USA&to-date=07%2F08%2F2018&children=0&from-date=07%2F06%2F2018&adults=2&uuid=" target="_blank" rel="noopener noreferrer">VRBO</a> because you'll probably find something cheaper and cozier.</p>
          </div>
        </section>
        <section>
          <div>
            <h2>Our Story</h2>
            <p>Tim White and Kelsey Hoehn met at a New Year's Eve celebration in Chicago. We bonded over a balloon drop malfunction that resulted in the two of us collecting lots of fallen balloons, and we haven't looked back since.</p>
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
            <h2 style={{ marginBottom: 0 }}>Photos</h2>
            <div style={{ marginBottom: '2em', fontSize: '.75em' }}>
              <span style={{marginRight: 4}}>by</span><a href="https://www.instagram.com/alishatova/">@alishiatova</a>
            </div>
            <div style={{
              width: '100%',
              maxWidth: 1000,
              display: 'flex',
              flexFlow: 'row wrap',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {images.map((img, i) => (
                <div
                  key={i}
                  className="image"
                  style={{
                    backgroundImage: `url(${img.small})`,
                    backgroundSize: 'cover',
                    backgroundPosition: '50%',
                    // width: '100%',
                    margin: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => this.openImage(i)}
                />
              ))}
            </div>
          </div>
        </section>
        <section>
          <div>
            <h2>Registry</h2>
            <div style={{ display: 'flex' }}>
              <a
                href="https://www.crateandbarrel.com/gift-registry/kelsey-hoehn/r5779172"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  margin: 2,
                }}
              >
                <img alt='crate &amp; barrel' src="https://static1.squarespace.com/static/57884b13e6f2e11d7ccf73d8/58cb48de3e00be7918cd2b44/58cb4ab5be65946ee838572f/1489718396797/cb-logo.png" style={{ width: 150 }} />
              </a>
              <a
                href="https://www.zola.com/registry/timandkelsey2018/edit"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  alignItems: 'center',
                  background: 'black',
                  display: 'flex',
                  height: 150,
                  justifyContent: 'center',
                  margin: 2,
                  width: 150,
                }}
              >
                <img
                  alt="Zola"
                  src="https://s3.amazonaws.com/kelseyandtim.com/logo-zola.png"
                  style={{ width: 112 }}
                />
              </a>
            </div>
          </div>
        </section>
      </div>
    )
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        {this.renderHero()}
        {(this.state.openSite || this.state.rsvpCode) &&
          this.renderDetails()
        }
      </div>
    )
  }
}

const style = {
  changer: {
    fontFamily: 'monospace',
    fontWeight: 100,
    fontSize: '6em',
    position: 'absolute',
    cursor: 'pointer',
    color: 'white',
    opacity: 0.5,
    top: 'calc(50% - 50px)',
  }
}

class BigImage extends React.Component {
  state = {
    loading: true
  };

  componentWillMount() {
    document.addEventListener('keyup', this.handleChangeImage)
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleChangeImage);
  }

  handleShowNext = () => {
    this.setState({ loading: true });
    this.props.handleShowNext();
  }

  handleShowPrev = () => {
    this.setState({ loading: true });
    this.props.handleShowPrev();
  }

  handleChangeImage = e => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      this.handleClose();
    }

    if (e.key === 'ArrowLeft' || e.key === 'Left') {
      this.handleShowPrev();
    }

    if (e.key === 'ArrowRight' || e.key === 'Right') {
      this.handleShowNext();
    }
  }

  handleClose = () => {
    this.setState({ loading: true });
    this.props.handleClose();
  }

  handleSwipe = e => {
    if (e.direction === 4) {
      this.handleShowPrev();
    }

    if (e.direction === 2) {
      this.handleShowNext();
    }
  }

  handleClickOutside = e => {
    if (e.target === this.overlay) {
      this.handleClose();
    }
  }

  render() {
    return (
      <div
        ref={overlay => { this.overlay = overlay }}
        onClick={this.handleClickOutside}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.82)'
        }}
      >
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
          cursor: 'pointer',
          zIndex: 900,
        }}
        onClick={this.handleClose}>&times;</div>
        <div
          style={{
            ...style.changer,
            left: 10
          }}
          onClick={this.handleShowPrev}
        >
          &lsaquo;
        </div>
        {this.state.loading &&
          <Hammer onSwipe={this.handleSwipe}>
            <img
              className="big-image placeholder"
              alt=''
              src={this.props.placeholder}
            />
          </Hammer>
        }
        <Hammer onSwipe={this.handleSwipe} >
          <img
            className="big-image"
            alt=''
            src={this.props.src}
            style={{ display: this.state.loading ? 'none' : 'block' }}
            onLoad={() => this.setState({ loading: false })}
          />
        </Hammer>
        <div
          style={{
            ...style.changer,
            right: 10,
          }}
          onClick={this.handleShowNext}
        >&rsaquo;</div>
      </div>
    );
  }
}

const cbs = {
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    border: '1px solid gray',
    cursor: 'pointer',
    flexDirection: 'row',
  },
  x: {
    borderTop: '1px solid',
    transform: 'rotate(45deg)',
    width: '100%',
    position: 'absolute',
    top: 18,
  },
}

class Checkbox extends React.Component {
  state = {
    hovered: false,
  };

  render() {
    const hovered = this.state.hovered || this.props.checked;
    return (
      <div
        className="cb-group"
        style={{
          ...cbs.checkbox,
          background: hovered ? '#c1c1c1' : 'transparent',
          borderColor: hovered ? '#c1c1c1' : 'gray',
          color: hovered ? 'white' : '#333',
        }}
        onClick={this.props.handleChange}
        onMouseOver={() => this.setState({ hovered: true })}
        onMouseOut={() => this.setState({ hovered: false })}
      >
        {this.props.checked &&
          <Checkmark style={{ marginRight: 8 }} />
        }
        <div>{this.props.label}</div>
      </div>
    );
  }
}

const DelayedFloater = props => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: props.active ? 1 : 0,
    transform: `translateY(${props.active ? -5 : 0}px)`,
    transition: props.delay && `500ms ease-in ${props.delay || 0}ms`,
    position: 'absolute',
    zIndex: props.active ? 1 : 0,
    fontSize: '1.5em',
    height: '100%',
    width: '100%',
  }}>{props.children}</div>
)

const RSVP = props => (
  <div style={{position: 'relative', minHeight: 130}}>
    <DelayedFloater active={props.hasResponded && props.isComing} delay={props.hasResponded && 1000}>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div><span role="img" aria-label="party">🎉</span> See you there!</div>
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
              fontSize: '0.65em',
              background: '#c1c1c1',
              borderRadius: 25,
              marginTop: '0.75em',
              marginRight: 16,
              padding: '4px 16px',
              color: 'white',
              cursor: 'pointer'
            }} onClick={props.handleOpenSendMessage}>send us a message</div>
            <div style={{
              fontSize: '0.65em',
              textDecoration: 'underline',
              marginTop: '0.75em',
              cursor: 'pointer'
            }} onClick={props.handleClearResponse}>change rsvp</div>
        </div>
      </div>
    </DelayedFloater>
    <DelayedFloater active={props.hasResponded && !props.isComing} delay={props.hasResponded && 1000}>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div><span role="img" aria-label="sad face">😢</span> We'll miss you!</div>
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
              fontSize: '0.65em',
              background: '#c1c1c1',
              borderRadius: 25,
              marginTop: '0.75em',
              marginRight: 16,
              padding: '4px 16px',
              color: 'white',
              cursor: 'pointer'
            }} onClick={props.handleOpenSendMessage}>send us a message</div>
            <div style={{
              fontSize: '0.65em',
              textDecoration: 'underline',
              marginTop: '0.75em',
              cursor: 'pointer'
            }} onClick={props.handleClearResponse}>change rsvp</div>
        </div>
      </div>
    </DelayedFloater>
    <div style={{
      display: 'flex',  flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', position: 'relative', }}>
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          opacity: !props.hasResponded ? 1 : 0,
          transition: `opacity 300ms ease-out ${!props.hasResponded ? 1 : 7}00ms, ${props.hasResponded && 'height 500ms ease-out 800ms'}`,
          height: props.hasResponded ? 0 : 100
        }}
      >
        <Checkbox
          checked={props.hasResponded && props.isComing === true}
          label={props.yesText || "Accept with pleasure."}
          handleChange={() => props.handleChange(true)}
        />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          opacity: !props.hasResponded ? 1 : 0,
          transition: `opacity 300ms ease-out ${!props.hasResponded ? 1 : 7}00ms, ${props.hasResponded && 'height 500ms ease-out 800ms'}`,
          height: props.hasResponded ? 0 : 100
        }}
      >
        <Checkbox
          checked={props.isComing === false}
          label={props.noText || "Decline with regret."}
          handleChange={() => props.handleChange(false)}
        />
      </div>
    </div>
  </div>
);

const Checkmark = ({ size = 20, color = '#fff', style }) => (
    <svg
      style={{ ...style }}
      xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={color} version="1.1"
      y="0px" enableBackground="new 0 0 100 100"
      viewBox="0 0 100 100" x="0px"
    >
      <g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M39.363,79L16,55.49l11.347-11.419L39.694,56.49L72.983,23L84,34.085L39.363,79z"
        />
      </g>
    </svg>
)

export default App;
