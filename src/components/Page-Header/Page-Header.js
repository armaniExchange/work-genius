// Styles
import './_Page-Header.scss';

// Libraries
import React, { Component, PropTypes } from 'react';

class PageHeader extends Component {
	render () {
		// const { headerTitle } = this.props;

		return (
			<header id="header" className="clearfix" >
            <ul className="header-inner">
                <li id="menu-trigger"  className="">
                    <div className="line-wrap">
                        <div className="line top"></div>
                        <div className="line center"></div>
                        <div className="line bottom"></div>
                    </div>
                </li>

                <li className="logo hidden-xs">
                    <a href="index.html">Work Genius</a>
                </li>

                <li className="pull-right">
                    <ul className="top-menu">
                        <li id="toggle-width">
                            <div className="toggle-switch">
                                <input id="tw-switch" type="checkbox" hidden="hidden" />
                                <label htmlFor="tw-switch" className="ts-helper"></label>
                            </div>
                        </li>

                        <li id="top-search">
                            <a href=""><i className="tm-icon zmdi zmdi-search"></i></a>
                        </li>

                        <li className="dropdown">
                            <a  href="">
                                <i className="tm-icon zmdi zmdi-email"></i>
                                <i className="tmn-counts">6</i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-lg pull-right">
                                <div className="listview">
                                    <div className="lv-header">
                                        Messages
                                    </div>
                                    <div className="lv-body">
                                        <a className="lv-item" href="">
                                            <div className="media">
                                                <div className="pull-left">
                                                    <img className="lv-img-sm" src="img/profile-pics/1.jpg" alt="" />
                                                </div>
                                                <div className="media-body">
                                                    <div className="lv-title">David Belle</div>
                                                    <small className="lv-small">Cum sociis natoque penatibus et magnis dis parturient montes</small>
                                                </div>
                                            </div>
                                        </a>
                                        <a className="lv-item" href="">
                                            <div className="media">
                                                <div className="pull-left">
                                                    <img className="lv-img-sm" src="img/profile-pics/2.jpg" alt=""/>
                                                </div>
                                                <div className="media-body">
                                                    <div className="lv-title">Jonathan Morris</div>
                                                    <small className="lv-small">Nunc quis diam diamurabitur at dolor elementum, dictum turpis vel</small>
                                                </div>
                                            </div>
                                        </a>
                                        <a className="lv-item" href="">
                                            <div className="media">
                                                <div className="pull-left">
                                                    <img className="lv-img-sm" src="img/profile-pics/3.jpg" alt=""/>
                                                </div>
                                                <div className="media-body">
                                                    <div className="lv-title">Fredric Mitchell Jr.</div>
                                                    <small className="lv-small">Phasellus a ante et est ornare accumsan at vel magnauis blandit turpis at augue ultricies</small>
                                                </div>
                                            </div>
                                        </a>
                                        <a className="lv-item" href="">
                                            <div className="media">
                                                <div className="pull-left">
                                                    <img className="lv-img-sm" src="img/profile-pics/4.jpg" alt=""/>
                                                </div>
                                                <div className="media-body">
                                                    <div className="lv-title">Glenn Jecobs</div>
                                                    <small className="lv-small">Ut vitae lacus sem ellentesque maximus, nunc sit amet varius dignissim, dui est consectetur neque</small>
                                                </div>
                                            </div>
                                        </a>
                                        <a className="lv-item" href="">
                                            <div className="media">
                                                <div className="pull-left">
                                                    <img className="lv-img-sm" src="img/profile-pics/4.jpg" alt=""/>
                                                </div>
                                                <div className="media-body">
                                                    <div className="lv-title">Bill Phillips</div>
                                                    <small className="lv-small">Proin laoreet commodo eros id faucibus. Donec ligula quam, imperdiet vel ante placerat</small>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <a className="lv-footer" href="">View All</a>
                                </div>
                            </div>
                        </li>
                        <li className="dropdown">
                            <a  href="">
                                <i className="tm-icon zmdi zmdi-notifications"></i>
                                <i className="tmn-counts">9</i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-lg pull-right">
                                <div className="listview" id="notifications">
                                    <div className="lv-header">
                                        Notification

                                        <ul className="actions">
                                            <li className="dropdown">
                                                <a href="" >
                                                    <i className="zmdi zmdi-check-all"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="lv-body">
                                        <a className="lv-item" href="">
                                            <div className="media">
                                                <div className="pull-left">
                                                    <img className="lv-img-sm" src="img/profile-pics/1.jpg" alt=""/>
                                                </div>
                                                <div className="media-body">
                                                    <div className="lv-title">David Belle</div>
                                                    <small className="lv-small">Cum sociis natoque penatibus et magnis dis parturient montes</small>
                                                </div>
                                            </div>
                                        </a>
                                        <a className="lv-item" href="">
                                            <div className="media">
                                                <div className="pull-left">
                                                    <img className="lv-img-sm" src="img/profile-pics/2.jpg" alt=""/>
                                                </div>
                                                <div className="media-body">
                                                    <div className="lv-title">Jonathan Morris</div>
                                                    <small className="lv-small">Nunc quis diam diamurabitur at dolor elementum, dictum turpis vel</small>
                                                </div>
                                            </div>
                                        </a>
                                        <a className="lv-item" href="">
                                            <div className="media">
                                                <div className="pull-left">
                                                    <img className="lv-img-sm" src="img/profile-pics/3.jpg" alt=""/>
                                                </div>
                                                <div className="media-body">
                                                    <div className="lv-title">Fredric Mitchell Jr.</div>
                                                    <small className="lv-small">Phasellus a ante et est ornare accumsan at vel magnauis blandit turpis at augue ultricies</small>
                                                </div>
                                            </div>
                                        </a>
                                        <a className="lv-item" href="">
                                            <div className="media">
                                                <div className="pull-left">
                                                    <img className="lv-img-sm" src="img/profile-pics/4.jpg" alt=""/>
                                                </div>
                                                <div className="media-body">
                                                    <div className="lv-title">Glenn Jecobs</div>
                                                    <small className="lv-small">Ut vitae lacus sem ellentesque maximus, nunc sit amet varius dignissim, dui est consectetur neque</small>
                                                </div>
                                            </div>
                                        </a>
                                        <a className="lv-item" href="">
                                            <div className="media">
                                                <div className="pull-left">
                                                    <img className="lv-img-sm" src="img/profile-pics/4.jpg" alt=""/>
                                                </div>
                                                <div className="media-body">
                                                    <div className="lv-title">Bill Phillips</div>
                                                    <small className="lv-small">Proin laoreet commodo eros id faucibus. Donec ligula quam, imperdiet vel ante placerat</small>
                                                </div>
                                            </div>
                                        </a>
                                    </div>

                                    <a className="lv-footer" href="">View Previous</a>
                                </div>

                            </div>
                        </li>
                        <li className="dropdown hidden-xs">
                            <a  href="">
                                <i className="tm-icon zmdi zmdi-view-list-alt"></i>
                                <i className="tmn-counts">2</i>
                            </a>
                            <div className="dropdown-menu pull-right dropdown-menu-lg">
                                <div className="listview">
                                    <div className="lv-header">
                                        Tasks
                                    </div>
                                    <div className="lv-body">
                                        <div className="lv-item">
                                            <div className="lv-title m-b-5">HTML5 Validation Report</div>

                                            <div className="progress">
                                                <div className="progress-bar" role="progressbar" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100" style={{width:' 95%'}}>
                                                    <span className="sr-only">95% Complete (success)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="lv-item">
                                            <div className="lv-title m-b-5">Google Chrome Extension</div>

                                            <div className="progress">
                                                <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style={{width:' 80%'}}>
                                                    <span className="sr-only">80% Complete (success)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="lv-item">
                                            <div className="lv-title m-b-5">Social Intranet Projects</div>

                                            <div className="progress">
                                                <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style={{width:' 20%'}}>
                                                    <span className="sr-only">20% Complete</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="lv-item">
                                            <div className="lv-title m-b-5">Bootstrap Admin Template</div>

                                            <div className="progress">
                                                <div className="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width:' 60%'}}>
                                                    <span className="sr-only">60% Complete (warning)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="lv-item">
                                            <div className="lv-title m-b-5">Youtube Client App</div>

                                            <div className="progress">
                                                <div className="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style={{width:' 80%'}}>
                                                    <span className="sr-only">80% Complete (danger)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <a className="lv-footer" href="">View All</a>
                                </div>
                            </div>
                        </li>
                        <li className="dropdown">
                            <a  href=""><i className="tm-icon zmdi zmdi-more-vert"></i></a>
                            <ul className="dropdown-menu dm-icon pull-right">
                                <li className="skin-switch hidden-xs">
                                    <span className="ss-skin bgm-lightblue" ></span>
                                    <span className="ss-skin bgm-bluegray" ></span>
                                    <span className="ss-skin bgm-cyan" ></span>
                                    <span className="ss-skin bgm-teal" ></span>
                                    <span className="ss-skin bgm-orange" ></span>
                                    <span className="ss-skin bgm-blue" ></span>
                                </li>
                                <li className="divider hidden-xs"></li>
                                <li className="hidden-xs">
                                    <a  href=""><i className="zmdi zmdi-fullscreen"></i> Toggle Fullscreen</a>
                                </li>
                                <li>
                                    <a  href=""><i className="zmdi zmdi-delete"></i> Clear Local Storage</a>
                                </li>
                                <li>
                                    <a href=""><i className="zmdi zmdi-face"></i> Privacy Settings</a>
                                </li>
                                <li>
                                    <a href=""><i className="zmdi zmdi-settings"></i> Other Settings</a>
                                </li>
                            </ul>
                        </li>
                        <li className="hidden-xs" id="chat-trigger" >
                            <a href=""><i className="tm-icon zmdi zmdi-comment-alt-text"></i></a>
                        </li>
                    </ul>
                </li>
            </ul>


            <div id="top-search-wrap">
                <div className="tsw-inner">
                    <i id="top-search-close" className="zmdi zmdi-arrow-left"></i>
                    <input type="text" />
                </div>
            </div>
        </header>
		);
	}
}

PageHeader.propTypes = {
	headerTitle: PropTypes.string
};

PageHeader.defaultProps = {
	headerTitle: ''
};

export default PageHeader;