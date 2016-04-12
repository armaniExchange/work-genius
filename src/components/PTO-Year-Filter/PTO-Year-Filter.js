// Library
import React from 'react';
// Components
import RaisedButton from 'material-ui/lib/raised-button';

export default function ({ selectedYear, goToPreviousYear, goToNextYear }) {
    let style = {'minWidth':'25px', 'minHeight':'25px', height:'25px', 'lineHeight':1};
    return (
        <div className="pto-year-filter">
            <RaisedButton label="<" style={style} onClick={goToPreviousYear} />
            <span style={{margin:'0 6px', display:'inline-block'}}>{selectedYear}</span>
            <RaisedButton label=">" style={style} onClick={goToNextYear} />
        </div>
    );
};
