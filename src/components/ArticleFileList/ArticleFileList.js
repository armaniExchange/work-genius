// Libraries
import React, { Component, PropTypes } from 'react';
import LinearProgress from 'material-ui/lib/linear-progress';

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
      if (mimeType.includes(item.type)) {
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
    const savedFiles = files.filter((file) => {
      return !file.isUploading;
    });
    const uploadingFiles = files.filter((file) => {
      return file.isUploading;
    });
    return (
      <div className="file-list">
        {
          savedFiles.map((file, index) => {
            return (
              <span key={`savedFiles${index}`}>
                &nbsp;
                <i className={`fa ${this.getMimeTypeIcon(file.type)}`} />
                &nbsp;
                <a href={`${file.url}?token=${localStorage.token}`} >{file.name}</a>
                &nbsp;
                {
                  enableRemove && !file.uploading && (
                    <i className="fa fa-remove remove-button"
                      onClick={this.onRemoveClick.bind(this, file, index)} />
                  )
                }
              </span>
            );
          })
        }
        {
          uploadingFiles.map((file, index) => {
            const completed = Math.round(file.loaded * 100 /file.total) || 0;
            return (
              <div key={`uploadingFile${index}`}>
                &nbsp;
                <i className={`fa ${this.getMimeTypeIcon(file.type)}`} />
                &nbsp;
                <a href="#" >{file.name}</a>
                &nbsp;
                <div style={{
                  width: 200,
                  display: 'inline-block',
                  position: 'relative',
                  top: -2
                }}>
                  <LinearProgress mode="determinate" value={completed}/>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}

ArticleFileList.propTypes = {
  enableRemove    : PropTypes.bool,
  onRemove        : PropTypes.func,
  files           : PropTypes.array
};

ArticleFileList.defaultProps = {
  enableRemove    : false,
  files           : []
};

export default ArticleFileList;
