// Libraries
import React, { PropTypes } from 'react';
import { HideShow } from '../Base/';

const STYLE_FOR_INVALID_ERR_MSG = {
  position: 'absolute',
  left: 0,
  top: '38px',
  //3.2
  marginTop: '2px',
  padding: '.3em .6em',
  display: 'inline-block',
  background: '#fe402b',
  fontSize: '75%',
  fontWeight: 'bold',
  lineHeight: '1',
  color: '#fff',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  verticalAlign: 'baseline',
  borderRadius: '.25em'
};
const STYLE_FOR_INVALID_CUSTOM_ERR_MSG = {
  ValidNumber: {},
  ValidCharacter: {}
};


/*class InValidErrMsg extends Component {
  render() {
    let {validType, msg} = this.props;
    return (<div style={()=>{
      let customStyle = validType&&STYLE_FOR_INVALID_CUSTOM_ERR_MSG[validType] || {};
      return Object.assign({}, STYLE_FOR_INVALID_ERR_MSG, customStyle);
    }}>{msg}</div>);
  }
};
InValidErrMsg.propTypes = {
  validType: PropTypes.string.isRequired,
  msg: PropTypes.string.isRequired
};*/
let InValidErrMsgBase = ({validType, msg}) => {
  return (<div style={
    Object.assign({}, STYLE_FOR_INVALID_ERR_MSG, 
      /*customStyle*/
      validType&&STYLE_FOR_INVALID_CUSTOM_ERR_MSG[validType] || {}
      )}>{msg}</div>);
};
InValidErrMsgBase.PropTypes = {
  validType: PropTypes.string,
  msg: PropTypes.string
};

export default HideShow(InValidErrMsgBase);
