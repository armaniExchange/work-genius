import React, { Component, PropTypes } from 'react';

// Material-UI
import DatePickerBase from 'material-ui/lib/date-picker/date-picker';


const formatDate = (objDate, format) => {
  let m = objDate.getMonth()+1,
      d = objDate.getDate(),
      ret = (format||'YYYY-MM-DD').toUpperCase()
              .replace('YYYY', objDate.getFullYear())
              .replace('MM', m<10 ? '0' + m : m)
              .replace('DD', d<10 ? '0' + d : d);
  return ret;
};


class DatePicker extends Component {
    render() {
        let { format, defaultDate, placeholder, disabled, onChange } = this.props;
        defaultDate = defaultDate && typeof(defaultDate) === 'string' ? new Date(defaultDate) : defaultDate;
        return (<DatePickerBase 
                  hintText={placeholder}
                  defaultDate={defaultDate}
                  disabled={disabled} 
                  formatDate={(obj) => formatDate(obj, format)} 
                  onChange={(e, objDate)=>{ // e is `null` by material-ui document of <DatePicker />.
                    onChange(formatDate(objDate));
                  }} />);
    }
}

DatePicker.propTypes = {
    onChange: PropTypes.func,
    defaultDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    format: PropTypes.string
};
DatePicker.defaultProps = {
  format: '',
  defaultDate: undefined,
  disabled: false,
  placeholder: '',
  onChange: ()=>{}
};

export default DatePicker;