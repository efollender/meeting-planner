import {Component} from 'react';
import ReactDOM from 'react-dom';

export default class DateTime extends Component {
  maxValues = {
    hours: 23,
    minutes: 59,
    seconds: 59,
    milliseconds: 999
  }
  padValues = {
    hours: 1,
    minutes: 2,
    seconds: 2,
    milliseconds: 3
  }
  constructor(props) {
    super(props);
    this.state = this.calculateState(props);
  }
  componentWillReceiveProps(nextProps) {
    this.setState( this.calculateState( nextProps ) );
  }
  renderHeader() {
    if ( !this.props.dateFormat ) return '';

    const date = this.props.selectedDate || this.props.viewDate;
    return ReactDOM.thead({ key: 'h'}, ReactDOM.tr({},
      ReactDOM.th( {className: 'switch', colSpan: 4, onClick: this.props.showView('days')}, date.format( this.props.dateFormat ) )
    ));
  }
  onStartClicking( action, type ) {
    const me = this;

    return function() {
      const update = {};
      update[ type ] = me[ action ]( type );
      me.setState( update );

      me.timer = setTimeout( () => {
        me.increaseTimer = setInterval( () => {
          update[ type ] = me[ action ]( type );
          me.setState( update );
        }, 70);
      }, 500);

      me.mouseUpListener = () => {
        clearTimeout( me.timer );
        clearInterval( me.increaseTimer );
        me.props.setTime( type, me.state[ type ] );
        document.body.removeEventListener('mouseup', me.mouseUpListener);
      };

      document.body.addEventListener('mouseup', me.mouseUpListener);
    };
  }
  increase( type ) {
    let value = parseInt(this.state[ type ], 10) + 1;
    if ( value > this.maxValues[ type ] ) value = 0;
    return this.pad( type, value );
  }
  decrease( type ) {
    let value = parseInt(this.state[ type ], 10) - 1;
    if ( value < 0 ) value = this.maxValues[ type ];
    return this.pad( type, value );
  }
  pad( type, value ) {
    let str = value + '';
    while ( str.length < this.padValues[ type ] ) str = '0' + str;
    return str;
  }
  calculateState(props) {
    const date = props.selectedDate || props.viewDate;
    const  format = props.timeFormat;
    const counters = [];

    if ( format.indexOf('H') !== -1 || format.indexOf('h') !== -1 ) {
      counters.push('hours');
      if ( format.indexOf('m') !== -1 ) {
        counters.push('minutes');
        if ( format.indexOf('s') !== -1 ) {
          counters.push('seconds');
        }
      }
    }

    return {
      hours: date.format('H'),
      minutes: date.format('mm'),
      seconds: date.format('ss'),
      milliseconds: date.format('SSS'),
      counters: counters
    };
  }
  renderCounter(type) {
    return ReactDOM.div({ key: type, className: 'rdtCounter'}, [
      ReactDOM.button({ key:'up', className: 'btn', onMouseDown: this.onStartClicking( 'increase', type ), type: 'button' }, '▲' ),
      ReactDOM.div({ key:'c', className: 'rdtCount' }, this.state[ type ] ),
      ReactDOM.button({ key:'do', className: 'btn', onMouseDown: this.onStartClicking( 'decrease', type ), type: 'button' }, '▼' )
    ]);
  }
  updateMilli( e ) {
    const milli = parseInt( e.target.value, 10 );
    if ( milli === e.target.value && milli >= 0 && milli < 1000 ) {
      this.props.setTime( 'milliseconds', milli );
      this.setState({ milliseconds: milli });
    }
  }
  render() {
    const counters = [];

    this.state.counters.forEach( c => {
      if ( counters.length ) {
        counters.push( ReactDOM.div( {key: 'sep' + counters.length, className: 'rdtCounterSeparator' }, ':' ));
      }
      counters.push( this.renderCounter( c ) );
    });

    if ( this.state.counters.length === 3 && this.props.timeFormat.indexOf('S') !== -1 ) {
      counters.push( DOM.div( {className: 'rdtCounterSeparator', key: 'sep5' }, ':' ));
      counters.push(
        ReactDOM.div( {className: 'rdtCounter rdtMilli', key:'m'},
          ReactDOM.input({ value: this.state.milliseconds, type: 'text', onChange: this.updateMilli })
          )
        );
    }

    return ReactDOM.div( {className: 'rdtTime'},
      ReactDOM.table( {}, [
        this.renderHeader(),
        ReactDOM.tbody({key: 'b'}, ReactDOM.tr({}, ReactDOM.td({},
          ReactDOM.div({ className: 'rdtCounters' }, counters )
        )))
      ])
    );
  }
}
