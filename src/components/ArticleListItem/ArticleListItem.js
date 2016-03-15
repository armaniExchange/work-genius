// // Libraries
// import React, { Component, PropTypes } from 'react';
// import Markdown from 'react-markdown';
// import moment from 'moment';

// // Styles
// import './_ArticleListItem.css';
// import 'codemirror/mode/gfm/gfm';
// import 'codemirror/lib/codemirror.css';

// class ArticleListItem extends Component {
//   render() {
//     const {
//       title,
//       author,
//       tags,
//       category,
//       // attachments,
//       content,
//       // createdAt,
//       updatedAt
//     } = this.props;
//     const style = {
//       background: 'white',
//       padding: 15,
//       margin: '15px 0',
//       border: 3,
//       boxShadow: '0 2px lightgray'
//     };
//     return (
//       <div style={style}>
//         <h3 style={{margin: 0}}>{title}</h3>
//         <span style={{color: 'gray'}}>
//           {moment(updatedAt).format('MMM Do YY')}
//         </span>
//         <span>&nbsp;|&nbsp;</span>
//         <span>{author.name}</span>
//         <br/>
//         <Markdown source={content} />
//         {
//           tags.map((tag, index) => {
//             return (
//               <span key={index}>
//                 <i className="fa fa-tag"/>&nbsp;{tag}&nbsp;
//               </span>
//             );
//           })
//         }
//         <p>{category.toString()}</p>
//         <a href="#">
//           >>&nbsp;Read More
//         </a>
//       </div>
//     );
//   }
// }


// ArticleListItem.propTypes = {
//   id              : PropTypes.string,
//   title           : PropTypes.string,
//   author          : PropTypes.shape({id: PropTypes.string, name: PropTypes.string}),
//   tags            : PropTypes.arrayOf(PropTypes.string),
//   category        : PropTypes.array,
//   attachments     : PropTypes.array,
//   comments        : PropTypes.array,
//   content         : PropTypes.string,
//   createdAt       : PropTypes.number,
//   updatedAt       : PropTypes.number
// };


// ArticleListItem.defaultProps = {
//   id              : '',
//   title           : '',
//   author          : {id: '', name: ''},
//   tags            : [],
//   category        : [],
//   attachments     : [],
//   comments        : [],
//   content         : '',
//   createdAt       : 0,
//   updatedAt       : 0
// };

// export default ArticleListItem;
