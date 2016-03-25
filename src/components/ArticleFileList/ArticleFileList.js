// Libraries
import React, { Component, PropTypes } from 'react';

// Styles
import './_ArticleFileList.css';


const MimeTypeMap = [
  {
    type: 'image',
    icon: 'fa-file-picture-o'
  },
  {
    type: 'audio',
    icon: 'fa-file-audio-o'
  },
  {
    type: 'video',
    icon: 'fa-file-video-o'
  },
  {
    type: 'pdf',
    icon: 'fa-file-pdf-o'
  },
  {
    type: 'msword',
    icon: 'fa-file-word-o'
  },
  {
    type: 'excel',
    icon: 'fa-file-excel-o'
  },
  {
    type: 'zip',
    icon: 'fa-file-archive-o'
  },
  {
    type: 'compressed',
    icon: 'fa-file-archive-o'
  }
];

class ArticleFileList extends Component {

  onRemoveClick(file, index) {
    const { onRemove } = this.props;
    if (onRemove) {
      onRemove(file, index);
    }
  }

  getMimeTypeIcon(mimeType) {
    // default icon
    let icon = 'fa-file-code-o';

    MimeTypeMap.forEach( item => {
      if (mimeType.search(item.type) !== -1) {
        icon = item.icon;
      }
    });
    return icon;
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
                <i className={`fa ${this.getMimeTypeIcon(file.type)}`} />
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
