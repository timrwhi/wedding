import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import Hammer from 'react-hammerjs';

const config = {
  apiKey: "AIzaSyDp-HnXVEhsQuN0I_TqTbtrxAdUKS4r8vk",
  databaseURL: "https://tamnrels.firebaseio.com",
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

async function fetchInvitation(code, cb) {
  return new Promise(resolve => {
    database.ref(code).once('value', x => resolve(x.val()));
  });
}

function saveResponse(code, isComing) {
  database.ref(code).update({ isComing });
}

class App extends Component {
  state = {
    bigImageIndex: 0,
    showDetails: false,
    guests: []
  };

  async componentDidMount() {
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
      const invitation = await fetchInvitation(this.state.rsvpCode);
      if (invitation) {
        this.input.blur();
        window.localStorage.setItem('rsvpCode', this.state.rsvpCode);
        this.setState({ ...invitation }, this.scrollToDetails)
      }
    }
  }

  handleChangeInput = e => {
    this.setState({ rsvpCode: e.target.value.toLowerCase() });
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
          {!this.state.showInput && !this.state.rsvpCode &&
            <div className="button" onClick={() => this.setState({ showInput: true })}>RSVP</div>
          }
          {(this.state.showInput || this.state.rsvpCode) &&
            <input
              autoFocus={!this.state.rsvpCode}
              value={this.state.rsvpCode || ''}
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

  updateBigImageIndex(increment) {
    let newIndex = this.state.bigImageIndex + increment;
    console.log(newIndex)
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
        <section>
          <div>
            <h1 style={{marginTop: 16}}>
              {!this.state.message ?
                `Hey ${this.state.guests[0]} and ${this.state.guests[1]}! Will you be joining us?` :
                `${this.state.message}`
              }
            </h1>
            <RSVP
              handleChange={this.handleRSVP}
              handleClearResponse={() => this.setState({ isComing: undefined })}
              isComing={this.state.isComing}
              yesText={this.state.buttons && this.state.buttons[0]}
              noText={this.state.buttons && this.state.buttons[1]}
              hasResponded={typeof this.state.isComing === 'boolean'}
            />
          </div>
        </section>
        <section>
          <div>
            <h2>Wedding Details</h2>
            <p>We're going to have a casual ceremony on the Little Goat Kitchen rooftop in the West Loop, where we had our first Valentine's day together. Following the ceremony we'll have music, drinks, and food catered by The Girl &amp; the Goat and Little Goat Diner.</p>
            <p>6:00p - 11:00p, Little Goat Kitchen, Chicago IL</p>
          </div>
        </section>
        <section>
          <div>
            <h2>Our Story</h2>
            <p>Tim White and Kelsey Hoehn met at a New Year's Eve celebration in Chicago. We bonded over a balloon drop malfunction that resulted in the two of us collecting lots of fallen balloons, and we haven't looked back since.</p>
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
                    width: '100%',
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
            <a href="https://www.crateandbarrel.com/gift-registry/kelsey-hoehn/r5779172" target="_blank">
              <img alt='crate &amp; barrel' src="https://static1.squarespace.com/static/57884b13e6f2e11d7ccf73d8/58cb48de3e00be7918cd2b44/58cb4ab5be65946ee838572f/1489718396797/cb-logo.png" style={{ width: 150 }} />
            </a>
          </div>
        </section>
      </div>
    )
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        {this.renderHero()}
        {this.state.rsvpCode &&
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
    top: 18,
  },
  changer: {
    fontFamily: 'monospace',
    fontWeight: 100,
    fontSize: '6em',
    position: 'absolute',
    cursor: 'pointer',
    color: 'white',
    opacity: 0.5,
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
    if (e.key === 'Escape') {
      this.handleClose();
    }

    if (e.key === 'ArrowLeft') {
      this.handleShowPrev();
    }

    if (e.key === 'ArrowRight') {
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
              className="big-image"
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
            style={{ display: this.state.loading ? 'none' : 'initial' }}
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

const Checkbox = props => (
  <div className="cb-group" >
    <div style={style.checkbox}>
      <div style={{
        opacity: props.checked ? '1' : '0',
        transition: 'opacity 100ms ease-in-out'
      }}>
        <div style={style.x}/>
        <div style={{...style.x, transform: 'rotate(-45deg)'}}/>
      </div>
    </div>
    <div>{props.label}</div>
  </div>
);

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
    <DelayedFloater active={props.hasResponded && props.isComing} delay={props.hasResponded && 500}>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div><span role="img" aria-label="party">🎉</span> "See you there!</div>
        <div style={{
          fontSize: '0.75em',
          background: '#c1c1c1',
          borderRadius: 25,
          marginTop: '0.75em',
          color: 'white',
          cursor: 'pointer'
        }} onClick={props.handleClearResponse}>change rsvp</div>
      </div>
    </DelayedFloater>
    <DelayedFloater active={props.hasResponded && !props.isComing} delay={props.hasResponded && 500}>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div><span role="img" aria-label="sad face">😢</span> We'll miss you!</div>
        <div style={{
          fontSize: '0.75em',
          background: '#c1c1c1',
          borderRadius: 25,
          marginTop: '0.75em',
          color: 'white',
          cursor: 'pointer'
        }} onClick={props.handleClearResponse}>change rsvp</div>
      </div>
    </DelayedFloater>
    <div style={{ display: 'flex',  flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', position: 'relative', }}>
      <div onClick={() => props.handleChange(true)} style={{
        opacity: !props.hasResponded ? 1 : 0,
        transition: `opacity 300ms ease-out 200ms, ${props.hasResponded && 'height 500ms ease-out 500ms'}`,
        height: props.hasResponded ? 0 : 100
      }}>
        <Checkbox checked={props.isComing === true} label={props.yesText || "Accept with pleasure"} />
      </div>
      <div onClick={() => props.handleChange(false)} style={{
        opacity: !props.hasResponded ? 1 : 0,
        transition: `opacity 300ms ease-out 200ms, ${props.hasResponded && 'height 500ms ease-out 500ms'}`,
        height: props.hasResponded ? 0 : 100
      }}>
        <Checkbox checked={props.isComing === false} label={props.noText || "Decline with regret"} />
      </div>
    </div>
  </div>
);

export default App;
