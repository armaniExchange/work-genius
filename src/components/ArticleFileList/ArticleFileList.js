// Libraries
import React, { Component, PropTypes } from 'react';

// Styles
import './_ArticleFileList.css';

const MimeTypeIcon = {
  'image/jpeg': 'fa-file-picture-o',
  'video/mp4': 'fa-file-video-o'
};

class ArticleFileList extends Component {

  onRemoveClick(file, index) {
    const { onRemove } = this.props;
    if (onRemove) {
      onRemove(file, index);
    }
  }

  render() {
    const {
      enableRemove,
      files
    } = this.props;
    return (
      <span className="file-list">
        {
          files.map((file, index) => {
            return (
              <span key={index}>
                &nbsp;
                <i className={`fa ${MimeTypeIcon[file.type]}`} />
                &nbsp;
                <a href="#" >{file.name}</a>
                &nbsp;
                {
                  enableRemove ? (
                    <i className="fa fa-remove remove-button"
                      onClick={this.onRemoveClick.bind(this, file, index)} />
                  ) : null
                }

              </span>
            );
          })
        }
      </span>
    );
  }
}


ArticleFileList.propTypes = {
  enableRemove    : PropTypes.bool,
  onRemove        : PropTypes.func,
  files           : PropTypes.array,
};


ArticleFileList.defaultProps = {
  enableRemove    : false,
  files           : []
};

export default ArticleFileList;
