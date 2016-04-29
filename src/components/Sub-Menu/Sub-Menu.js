// Styles
import './_Sub-Menu.css';

// Libraries
import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/lib/text-field';
import { Link } from 'react-router';
import { ROOT_URL } from '../../constants/app';

import SearchSection from '../SearchSection/SearchSection';

class SubMenu extends Component {
	render () {
		const { data, headerTitle } = this.props;
    const { 
      searchKeyword,
      pagesize,
      searchTimerId,
      setupSearchOnKeyworkChangeAWhile,
      searchArticle
      } = this.props;//<--- form state.search only

		let linkHtml = data.map(({ name, url }, i) => {
			url = url ? url : ROOT_URL;
			return (
				<span className="mdl-navigation__link" key={`submenu-${i}`}>
				    <Link
					    className="mdl-navigation__link__tag"
						activeClassName="mdl-navigation__link__tag--active"
						to={url}
						key={i}
						onlyActiveOnIndex={url.split('/').length <= 3}>
						    {name}
					</Link>
				</span>
			);
		});

    const searchBoxResultStyle = {};
    if (!searchKeyword) {
      searchBoxResultStyle.opacity = 0;
    }
    
		return (
			<header className="mdl-layout__header mdl-layout__header--level2">
			    <div className="mdl-layout__header-row">
					<span className="mdl-layout-title">{headerTitle}</span>
					<nav className="mdl-navigation">
			            {linkHtml}
					</nav>


          <div className="search-box">
            <TextField
              onChange={(evt)=>{
                let val = evt.target.value;
                if (!val) {
                  return;
                }
                //might no need val!=='' && changeSearchKeyword(val);

                searchTimerId && clearTimeout(searchTimerId);
                setupSearchOnKeyworkChangeAWhile(()=>{
                  searchArticle(val, pagesize, 0);
                });
              }}
              hintText="Search..." />
            <i className="material-icons" title="Search" onClick={()=>{
              searchArticle(searchKeyword, pagesize, 0);
            }}>search</i>
            <div className="search-box__result" style={searchBoxResultStyle}>
              <SearchSection {...this.props} />
            </div>
          </div>


			    </div>{/*END of <div className="mdl-layout__header-row"*/}
			</header>
		);
	}
}

SubMenu.propTypes = {
	data       : PropTypes.array.isRequired,
	headerTitle: PropTypes.string,

  searchKeyword: PropTypes.string,
  pagesize: PropTypes.number,
  searchTimerId: PropTypes.number,
  setupSearchOnKeyworkChangeAWhile: PropTypes.func,
  searchArticle: PropTypes.func
};

SubMenu.defaultProps = {
	headerTitle: ''
};

export default SubMenu;
