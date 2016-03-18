// Libraries
import React, { Component, PropTypes } from 'react';

// Styles
import './_ArticleFileList.css';

class ArticleFileList extends Component {
  render() {
    const MimeTypeIcon = {
      'image/jpeg': 'fa-file-picture-o',
      'video/mp4': 'fa-file-video-o'
    };
    return (
      <span>
        {
          this.props.files.map((file, index) => {
            return (
              <span key={index}>
                &nbsp;
                <i className={`fa ${MimeTypeIcon[file.type]}`} />
                &nbsp;
                <a href="#" >{file.name}</a>
              </span>
            );
          })
        }
      </span>
    );
  }
}


ArticleFileList.propTypes = {
  files           : PropTypes.array,
};


ArticleFileList.defaultProps = {
  files           : []
};

export default ArticleFileList;
