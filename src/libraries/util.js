import moment from 'moment';

const isValidNumber = (value, conf) => {
  const min = conf.min || undefined;
  const max = conf.max || undefined;
  value = +value;
  let hasMin = typeof min==='number' && min>=-Infinity;
  let hasMax = typeof max==='number' && max<=Infinity;
  let b = false;
  if (hasMin && hasMax) {
    b = value>=min && value<=max;
  } else if (hasMin) {
    b = value>=min;
  } else if (hasMax) {
    b = value<=max;
  } else {
    b = typeof value==='number' && value>=-Infinity && value<=Infinity;
  }
  return b;
};

const isValidDate = (value, formatType='') => {
  const MAPPING_REGEXP = {
    DOT: /^(\d{4}\.\d{2}\.\d{2})$/gi,
    NOTHING: /^(\d{4}\d{2}\d{2})$/gi
  };
  const REG = MAPPING_REGEXP[formatType] || /^(\d{4}-\d{2}-\d{2})$/gi;
  return REG.test(value);
};

export const convertToUtcTimeStamp = (date, time) => {
	// 2016-04-05T16:00:00+00:00
	let utcDate = moment(date).format().split('T')[0],
	    utcTime = moment(time).format().split('T')[1],
		utcDateTime = utcDate + 'T' + utcTime;

    return moment(utcDateTime).format('x');
};

export default {
  isValidNumber,
  isValidDate
};
