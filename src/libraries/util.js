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

export default {
    isValidNumber,
    isValidDate
};
