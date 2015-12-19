// Style
import './_DashboardPage.scss';
// React & Redux
import React, { Component } from 'react';

class DashboardPage extends Component {
	render() {
		return (
			<section >
            <aside id="sidebar" className="sidebar c-overflow mCustomScrollbar _mCS_1 mCS-autoHide" ><div id="mCSB_1" className="mCustomScrollBox mCS-minimal-dark mCSB_vertical_horizontal mCSB_outside" tabIndex="0"><div id="mCSB_1_container" className="mCSB_container mCS_x_hidden mCS_no_scrollbar_x"  dir="ltr">
                <div className="profile-menu">
                    <a href="">
                        <div className="profile-pic">
                            <img src="img/profile-pics/1.jpg" alt="" className="mCS_img_loaded" />
                        </div>

                        <div className="profile-info">
                            Malinda Hollaway

                            <i className="zmdi zmdi-caret-down"></i>
                        </div>
                    </a>

                    <ul className="main-menu">
                        <li>
                            <a href="profile-about.html"><i className="zmdi zmdi-account"></i> View Profile</a>
                        </li>
                        <li>
                            <a href=""><i className="zmdi zmdi-input-antenna"></i> Privacy Settings</a>
                        </li>
                        <li>
                            <a href=""><i className="zmdi zmdi-settings"></i> Settings</a>
                        </li>
                        <li>
                            <a href=""><i className="zmdi zmdi-time-restore"></i> Logout</a>
                        </li>
                    </ul>
                </div>

                <ul className="main-menu">
                    <li className="active">
                        <a href="index.html"><i className="zmdi zmdi-home"></i> Home</a>
                    </li>
                    <li className="sub-menu">
                        <a href=""><i className="zmdi zmdi-view-compact"></i> Headers</a>

                        <ul>
                            <li><a href="textual-menu.html">Textual menu</a></li>
                            <li><a href="image-logo.html">Image logo</a></li>
                            <li><a href="top-mainmenu.html">Mainmenu on top</a></li>
                        </ul>
                    </li>
                    <li><a href="typography.html"><i className="zmdi zmdi-format-underlined"></i> Typography</a></li>
                    <li className="sub-menu">
                        <a href=""><i className="zmdi zmdi-widgets"></i> Widgets</a>

                        <ul>
                            <li><a href="widget-templates.html">Templates</a></li>
                            <li><a href="widgets.html">Widgets</a></li>
                        </ul>
                    </li>
                    <li className="sub-menu">
                        <a href=""><i className="zmdi zmdi-view-list"></i> Tables</a>

                        <ul>
                            <li><a href="tables.html">Normal Tables</a></li>
                            <li><a href="data-tables.html">Data Tables</a></li>
                        </ul>
                    </li>
                    <li className="sub-menu">
                        <a href=""><i className="zmdi zmdi-collection-text"></i> Forms</a>

                        <ul>
                            <li><a href="form-elements.html">Basic Form Elements</a></li>
                            <li><a href="form-components.html">Form Components</a></li>
                            <li><a href="form-examples.html">Form Examples</a></li>
                            <li><a href="form-validations.html">Form Validation</a></li>
                        </ul>
                    </li>
                    <li className="sub-menu">
                        <a href=""><i className="zmdi zmdi-swap-alt"></i>User Interface</a>
                        <ul>
                            <li><a href="colors.html">Colors</a></li>
                            <li><a href="animations.html">Animations</a></li>
                            <li><a href="box-shadow.html">Box Shadow</a></li>
                            <li><a href="buttons.html">Buttons</a></li>
                            <li><a href="icons.html">Icons</a></li>
                            <li><a href="alerts.html">Alerts</a></li>
                            <li><a href="preloaders.html">Preloaders</a></li>
                            <li><a href="notification-dialog.html">Notifications &amp; Dialogs</a></li>
                            <li><a href="media.html">Media</a></li>
                            <li><a href="components.html">Components</a></li>
                            <li><a href="other-components.html">Others</a></li>
                        </ul>
                    </li>
                    <li className="sub-menu">
                        <a href=""><i className="zmdi zmdi-trending-up"></i>Charts</a>
                        <ul>
                            <li><a href="flot-charts.html">Flot Charts</a></li>
                            <li><a href="other-charts.html">Other Charts</a></li>
                        </ul>
                    </li>
                    <li><a href="calendar.html"><i className="zmdi zmdi-calendar"></i> Calendar</a></li>
                    <li className="sub-menu">
                        <a href=""><i className="zmdi zmdi-image"></i>Photo Gallery</a>
                        <ul>
                            <li><a href="photos.html">Default</a></li>
                            <li><a href="photo-timeline.html">Timeline</a></li>
                        </ul>
                    </li>

                    <li><a href="generic-classNamees.html"><i className="zmdi zmdi-layers"></i> Generic Classes</a></li>
                    <li className="sub-menu">
                        <a href=""><i className="zmdi zmdi-collection-item"></i> Sample Pages</a>
                        <ul>
                            <li><a href="profile-about.html">Profile</a></li>
                            <li><a href="list-view.html">List View</a></li>
                            <li><a href="messages.html">Messages</a></li>
                            <li><a href="pricing-table.html">Pricing Table</a></li>
                            <li><a href="contacts.html">Contacts</a></li>
                            <li><a href="wall.html">Wall</a></li>
                            <li><a href="invoice.html">Invoice</a></li>
                            <li><a href="login.html">Login and Sign Up</a></li>
                            <li><a href="lockscreen.html">Lockscreen</a></li>
                            <li><a href="404.html">Error 404</a></li>
                        </ul>
                    </li>
                    <li className="sub-menu">
                        <a href="form-examples.html"><i className="zmdi zmdi-menu"></i> 3 Level Menu</a>

                        <ul>
                            <li><a href="form-elements.html">Level 2 link</a></li>
                            <li><a href="form-components.html">Another level 2 Link</a></li>
                            <li className="sub-menu">
                                <a href="form-examples.html">I have children too</a>

                                <ul>
                                    <li><a href="">Level 3 link</a></li>
                                    <li><a href="">Another Level 3 link</a></li>
                                    <li><a href="">Third one</a></li>
                                </ul>
                            </li>
                            <li><a href="form-validations.html">One more 2</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="https://wrapbootstrap.com/theme/material-admin-responsive-angularjs-WB011H985"><i className="zmdi zmdi-money"></i> Buy this template</a>
                    </li>
                </ul>
            </div></div><div id="mCSB_1_scrollbar_vertical" className="mCSB_scrollTools mCSB_1_scrollbar mCS-minimal-dark mCSB_scrollTools_vertical" ><div className="mCSB_draggerContainer"><div id="mCSB_1_dragger_vertical" className="mCSB_dragger"  ><div className="mCSB_dragger_bar" ></div></div><div className="mCSB_draggerRail"></div></div></div><div id="mCSB_1_scrollbar_horizontal" className="mCSB_scrollTools mCSB_1_scrollbar mCS-minimal-dark mCSB_scrollTools_horizontal" ><div className="mCSB_draggerContainer"><div id="mCSB_1_dragger_horizontal" className="mCSB_dragger"  ><div className="mCSB_dragger_bar"></div></div><div className="mCSB_draggerRail"></div></div></div></aside>
            
            <aside id="chat" className="sidebar c-overflow mCustomScrollbar _mCS_2 mCS-autoHide" ><div id="mCSB_2" className="mCustomScrollBox mCS-minimal-dark mCSB_vertical_horizontal mCSB_outside" tabIndex="0"><div id="mCSB_2_container" className="mCSB_container mCS_x_hidden mCS_no_scrollbar_x"  dir="ltr">
            
                <div className="chat-search">
                    <div className="fg-line">
                        <input type="text" className="form-control" placeholder="Search People" />
                    </div>
                </div>

                <div className="listview">
                    <a className="lv-item" href="">
                        <div className="media">
                            <div className="pull-left p-relative">
                                <img className="lv-img-sm mCS_img_loaded" src="img/profile-pics/2.jpg" alt="" />
                                <i className="chat-status-busy"></i>
                            </div>
                            <div className="media-body">
                                <div className="lv-title">Jonathan Morris</div>
                                <small className="lv-small">Available</small>
                            </div>
                        </div>
                    </a>

                    <a className="lv-item" href="">
                        <div className="media">
                            <div className="pull-left">
                                <img className="lv-img-sm mCS_img_loaded" src="img/profile-pics/1.jpg" alt="" />
                            </div>
                            <div className="media-body">
                                <div className="lv-title">David Belle</div>
                                <small className="lv-small">Last seen 3 hours ago</small>
                            </div>
                        </div>
                    </a>

                    <a className="lv-item" href="">
                        <div className="media">
                            <div className="pull-left p-relative">
                                <img className="lv-img-sm mCS_img_loaded" src="img/profile-pics/3.jpg" alt="" />
                                <i className="chat-status-online"></i>
                            </div>
                            <div className="media-body">
                                <div className="lv-title">Fredric Mitchell Jr.</div>
                                <small className="lv-small">Availble</small>
                            </div>
                        </div>
                    </a>

                    <a className="lv-item" href="">
                        <div className="media">
                            <div className="pull-left p-relative">
                                <img className="lv-img-sm mCS_img_loaded" src="img/profile-pics/4.jpg" alt="" />
                                <i className="chat-status-online"></i>
                            </div>
                            <div className="media-body">
                                <div className="lv-title">Glenn Jecobs</div>
                                <small className="lv-small">Availble</small>
                            </div>
                        </div>
                    </a>

                    <a className="lv-item" href="">
                        <div className="media">
                            <div className="pull-left">
                                <img className="lv-img-sm mCS_img_loaded" src="img/profile-pics/5.jpg" alt="" />
                            </div>
                            <div className="media-body">
                                <div className="lv-title">Bill Phillips</div>
                                <small className="lv-small">Last seen 3 days ago</small>
                            </div>
                        </div>
                    </a>

                    <a className="lv-item" href="">
                        <div className="media">
                            <div className="pull-left">
                                <img className="lv-img-sm mCS_img_loaded" src="img/profile-pics/6.jpg" alt="" />
                            </div>
                            <div className="media-body">
                                <div className="lv-title">Wendy Mitchell</div>
                                <small className="lv-small">Last seen 2 minutes ago</small>
                            </div>
                        </div>
                    </a>
                    <a className="lv-item" href="">
                        <div className="media">
                            <div className="pull-left p-relative">
                                <img className="lv-img-sm mCS_img_loaded" src="img/profile-pics/7.jpg" alt="" />
                                <i className="chat-status-busy"></i>
                            </div>
                            <div className="media-body">
                                <div className="lv-title">Teena Bell Ann</div>
                                <small className="lv-small">Busy</small>
                            </div>
                        </div>
                    </a>
                </div>
            </div></div><div id="mCSB_2_scrollbar_vertical" className="mCSB_scrollTools mCSB_2_scrollbar mCS-minimal-dark mCSB_scrollTools_vertical" ><div className="mCSB_draggerContainer"><div id="mCSB_2_dragger_vertical" className="mCSB_dragger"  ><div className="mCSB_dragger_bar" ></div></div><div className="mCSB_draggerRail"></div></div></div><div id="mCSB_2_scrollbar_horizontal" className="mCSB_scrollTools mCSB_2_scrollbar mCS-minimal-dark mCSB_scrollTools_horizontal" ><div className="mCSB_draggerContainer"><div id="mCSB_2_dragger_horizontal" className="mCSB_dragger"  ><div className="mCSB_dragger_bar"></div></div><div className="mCSB_draggerRail"></div></div></div></aside>
            
            
            <section id="content">
                <div className="container">
                    <div className="block-header">
                        <h2>Dashboard</h2>
                        
                        <ul className="actions">
                            <li>
                                <a href="">
                                    <i className="zmdi zmdi-trending-up"></i>
                                </a>
                            </li>
                            <li>
                                <a href="">
                                    <i className="zmdi zmdi-check-all"></i>
                                </a>
                            </li>
                            <li className="dropdown">
                                <a href="" >
                                    <i className="zmdi zmdi-more-vert"></i>
                                </a>
                                
                                <ul className="dropdown-menu dropdown-menu-right">
                                    <li>
                                        <a href="">Refresh</a>
                                    </li>
                                    <li>
                                        <a href="">Manage Widgets</a>
                                    </li>
                                    <li>
                                        <a href="">Widgets Settings</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        
                    </div>
                    
                    <div className="card">
                        <div className="card-header">
                            <h2>Sales Statistics <small>Vestibulum purus quam scelerisque, mollis nonummy metus</small></h2>
                            
                            <ul className="actions">
                                <li>
                                    <a href="">
                                        <i className="zmdi zmdi-refresh-alt"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        <i className="zmdi zmdi-download"></i>
                                    </a>
                                </li>
                                <li className="dropdown">
                                    <a href="" >
                                        <i className="zmdi zmdi-more-vert"></i>
                                    </a>
                                    
                                    <ul className="dropdown-menu dropdown-menu-right">
                                        <li>
                                            <a href="">Change Date Range</a>
                                        </li>
                                        <li>
                                            <a href="">Change Graph Type</a>
                                        </li>
                                        <li>
                                            <a href="">Other Settings</a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="card-body">
                            <div className="chart-edge">
                                <div id="curved-line-chart" className="flot-chart " ><canvas className="flot-base" width="1158" height="200" ></canvas><canvas className="flot-overlay" width="1158" height="200" ></canvas></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mini-charts">
                        <div className="row">
                            <div className="col-sm-6 col-md-3">
                                <div className="mini-charts-item bgm-cyan">
                                    <div className="clearfix">
                                        <div className="chart stats-bar"><canvas width="83" height="45" ></canvas></div>
                                        <div className="count">
                                            <small>Website Traffics</small>
                                            <h2>987,459</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-sm-6 col-md-3">
                                <div className="mini-charts-item bgm-lightgreen">
                                    <div className="clearfix">
                                        <div className="chart stats-bar-2"><canvas width="83" height="45" ></canvas></div>
                                        <div className="count">
                                            <small>Website Impressions</small>
                                            <h2>356,785K</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-sm-6 col-md-3">
                                <div className="mini-charts-item bgm-orange">
                                    <div className="clearfix">
                                        <div className="chart stats-line"><canvas width="85" height="45" ></canvas></div>
                                        <div className="count">
                                            <small>Total Sales</small>
                                            <h2>$ 458,778</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-sm-6 col-md-3">
                                <div className="mini-charts-item bgm-bluegray">
                                    <div className="clearfix">
                                        <div className="chart stats-line-2"><canvas width="85" height="45" ></canvas></div>
                                        <div className="count">
                                            <small>Support Tickets</small>
                                            <h2>23,856</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    
                    <div className="dash-widgets">
                        <div className="row">
                            <div className="col-md-3 col-sm-6">
                                <div id="site-visits" className="dash-widget-item bgm-teal">
                                    <div className="dash-widget-header">
                                        <div className="p-20">
                                            <div className="dash-widget-visits"><canvas width="223" height="95" ></canvas></div>
                                        </div>
                                        
                                        <div className="dash-widget-title">For the past 30 days</div>
                                        
                                        <ul className="actions actions-alt">
                                            <li className="dropdown">
                                                <a href="" >
                                                    <i className="zmdi zmdi-more-vert"></i>
                                                </a>
                                                
                                                <ul className="dropdown-menu dropdown-menu-right">
                                                    <li>
                                                        <a href="">Refresh</a>
                                                    </li>
                                                    <li>
                                                        <a href="">Manage Widgets</a>
                                                    </li>
                                                    <li>
                                                        <a href="">Widgets Settings</a>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                    
                                    <div className="p-20">
                                        
                                        <small>Page Views</small>
                                        <h3 className="m-0 f-400">47,896,536</h3>
                                        
                                        <br />
                                        
                                        <small>Site Visitors</small>
                                        <h3 className="m-0 f-400">24,456,799</h3>
                                        
                                        <br />
                                        
                                        <small>Total Clicks</small>
                                        <h3 className="m-0 f-400">13,965</h3>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-md-3 col-sm-6">
                                <div id="pie-charts" className="dash-widget-item">
                                    <div className="bgm-pink">
                                        <div className="dash-widget-header">
                                            <div className="dash-widget-title">Email Statistics</div>
                                        </div>
                                        
                                        <div className="clearfix"></div>
                                        
                                        <div className="text-center p-20 m-t-25">
                                            <div className="easy-pie main-pie" >
                                                <div className="percent">45</div>
                                                <div className="pie-title">Total Emails Sent</div>
                                            <canvas height="148" width="148"></canvas></div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-t-20 p-b-20 text-center">
                                        <div className="easy-pie sub-pie-1" >
                                            <div className="percent">56</div>
                                            <div className="pie-title">Bounce Rate</div>
                                        <canvas height="95" width="95"></canvas></div>
                                        <div className="easy-pie sub-pie-2" >
                                            <div className="percent">84</div>
                                            <div className="pie-title">Total Opened</div>
                                        <canvas height="95" width="95"></canvas></div>
                                    </div>
    
                                </div>
                            </div>
                            
                            <div className="col-md-3 col-sm-6">
                                <div className="dash-widget-item bgm-lime">
                                    <div id="weather-widget"><div className="weather-status">51°F</div><ul className="weather-info"><li>Austin, TX</li><li className="currently">Fair</li></ul><div className="weather-icon wi-33"></div><div className="dash-widget-footer"><div className="weather-list tomorrow"><span className="weather-list-icon wi-39"></span><span>66/52</span><span>Sunny</span></div><div className="weather-list after-tomorrow"><span className="weather-list-icon wi-39"></span><span>71/61</span><span>PM Showers</span></div></div></div>
                                </div>
                            </div>
    
                            <div className="col-md-3 col-sm-6">
                                <div id="best-selling" className="dash-widget-item">
                                    <div className="dash-widget-header">
                                        <div className="dash-widget-title">Best Sellings</div>
                                        <img src="img/widgets/alpha.jpg" alt="" />
                                        <div className="main-item">
                                            <small>Samsung Galaxy Alpha</small>
                                            <h2>$799.99</h2>
                                        </div>
                                    </div>
                                
                                    <div className="listview p-t-5">
                                        <a className="lv-item" href="">
                                            <div className="media">
                                                <div className="pull-left">
                                                    <img className="lv-img-sm" src="img/widgets/note4.jpg" alt="" />
                                                </div>
                                                <div className="media-body">
                                                    <div className="lv-title">Samsung Galaxy Note 4</div>
                                                    <small className="lv-small">$850.00 - $1199.99</small>
                                                </div>
                                            </div>
                                        </a>
                                        <a className="lv-item" href="">
                                            <div className="media">
                                                <div className="pull-left">
                                                    <img className="lv-img-sm" src="img/widgets/mate7.jpg" alt="" />
                                                </div>
                                                <div className="media-body">
                                                    <div className="lv-title">Huawei Ascend Mate</div>
                                                    <small className="lv-small">$649.59 - $749.99</small>
                                                </div>
                                            </div>
                                        </a>
                                        <a className="lv-item" href="">
                                            <div className="media">
                                                <div className="pull-left">
                                                    <img className="lv-img-sm" src="img/widgets/535.jpg" alt="" />
                                                </div>
                                                <div className="media-body">
                                                    <div className="lv-title">Nokia Lumia 535</div>
                                                    <small className="lv-small">$189.99 - $250.00</small>
                                                </div>
                                            </div>
                                        </a>
                                        
                                        <a className="lv-footer" href="">
                                            View All
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="card">
                                <div className="card-header">
                                    <h2>Recent Items <small>Phasellus condimentum ipsum id auctor imperdie</small></h2>
                                    <ul className="actions">
                                        <li className="dropdown">
                                            <a href="" >
                                                <i className="zmdi zmdi-more-vert"></i>
                                            </a>
                                            
                                            <ul className="dropdown-menu dropdown-menu-right">
                                                <li>
                                                    <a href="">Refresh</a>
                                                </li>
                                                <li>
                                                    <a href="">Settings</a>
                                                </li>
                                                <li>
                                                    <a href="">Other Settings</a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                                
                                <div className="card-body m-t-0">
                                    <table className="table table-inner table-vmiddle">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th >Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="f-500 c-cyan">2569</td>
                                                <td>Samsung Galaxy Mega</td>
                                                <td className="f-500 c-cyan">$521</td>
                                            </tr>
                                            <tr>
                                                <td className="f-500 c-cyan">9658</td>
                                                <td>Huawei Ascend P6</td>
                                                <td className="f-500 c-cyan">$440</td>
                                            </tr>
                                            <tr>
                                                <td className="f-500 c-cyan">1101</td>
                                                <td>HTC One M8</td>
                                                <td className="f-500 c-cyan">$680</td>
                                            </tr>
                                            <tr>
                                                <td className="f-500 c-cyan">6598</td>
                                                <td>Samsung Galaxy Alpha</td>
                                                <td className="f-500 c-cyan">$870</td>
                                            </tr>
                                            <tr>
                                                <td className="f-500 c-cyan">4562</td>
                                                <td>LG G3</td>
                                                <td className="f-500 c-cyan">$690</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div id="recent-items-chart" className="flot-chart" ><canvas className="flot-base" width="574" height="150" ></canvas><canvas className="flot-overlay" width="574" height="150" ></canvas></div>
                            </div>
                            
                            <div id="todo-lists">
                                <div className="tl-header">
                                    <h2>Todo Lists</h2>
                                    <small>Add, edit and manage your Todo Lists</small>
                                    
                                    <ul className="actions actions-alt">
                                        <li className="dropdown">
                                            <a href="" >
                                                <i className="zmdi zmdi-more-vert"></i>
                                            </a>
                                            
                                            <ul className="dropdown-menu dropdown-menu-right">
                                                <li>
                                                    <a href="">Refresh</a>
                                                </li>
                                                <li>
                                                    <a href="">Manage Widgets</a>
                                                </li>
                                                <li>
                                                    <a href="">Widgets Settings</a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                                    
                                <div className="clearfix"></div>
                                    
                                <div className="tl-body">
                                    <div id="add-tl-item">
                                        <i className="add-new-item zmdi zmdi-plus"></i>
                                        
                                        <div className="add-tl-body">
                                            <textarea placeholder="What you want to do..."></textarea>
                                            
                                            <div className="add-tl-actions">
                                                <a href="" ><i className="zmdi zmdi-close"></i></a>
                                                <a href="" ><i className="zmdi zmdi-check"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="checkbox media">
                                        <div className="pull-right">
                                            <ul className="actions actions-alt">
                                                <li className="dropdown">
                                                    <a href="" >
                                                        <i className="zmdi zmdi-more-vert"></i>
                                                    </a>
                                                    
                                                    <ul className="dropdown-menu dropdown-menu-right">
                                                        <li><a href="">Delete</a></li>
                                                        <li><a href="">Archive</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="media-body">
                                            <label>
                                                <input type="checkbox" />
                                                <i className="input-helper"></i>
                                                <span>Duis vitae nibh molestie pharetra augue vitae</span>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="checkbox media">
                                        <div className="pull-right">
                                            <ul className="actions actions-alt">
                                                <li className="dropdown">
                                                    <a href="" >
                                                        <i className="zmdi zmdi-more-vert"></i>
                                                    </a>
                                                    
                                                    <ul className="dropdown-menu dropdown-menu-right">
                                                        <li><a href="">Delete</a></li>
                                                        <li><a href="">Archive</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="media-body">
                                            <label>
                                                <input type="checkbox" />
                                                <i className="input-helper"></i>
                                                <span>In vel imperdiet leoorbi mollis leo sit amet quam fringilla varius mauris orci turpis</span>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="checkbox media">
                                        <div className="pull-right">
                                            <ul className="actions actions-alt">
                                                <li className="dropdown">
                                                    <a href="" >
                                                        <i className="zmdi zmdi-more-vert"></i>
                                                    </a>
                                                    
                                                    <ul className="dropdown-menu dropdown-menu-right">
                                                        <li><a href="">Delete</a></li>
                                                        <li><a href="">Archive</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="media-body">
                                            <label>
                                                <input type="checkbox" />
                                                <i className="input-helper"></i>
                                                <span>Suspendisse quis sollicitudin erosvel dictum nunc</span>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="checkbox media">
                                        <div className="pull-right">
                                            <ul className="actions actions-alt">
                                                <li className="dropdown">
                                                    <a href="" >
                                                        <i className="zmdi zmdi-more-vert"></i>
                                                    </a>
                                                    
                                                    <ul className="dropdown-menu dropdown-menu-right">
                                                        <li><a href="">Delete</a></li>
                                                        <li><a href="">Archive</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="media-body">
                                            <label>
                                                <input type="checkbox" />
                                                <i className="input-helper"></i>
                                                <span>Curabitur egestas finibus sapien quis faucibusras bibendum ut justo at sagittis. In hac habitasse platea dictumst</span>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="checkbox media">
                                        <div className="pull-right">
                                            <ul className="actions actions-alt">
                                                <li className="dropdown">
                                                    <a href="" >
                                                        <i className="zmdi zmdi-more-vert"></i>
                                                    </a>
                                                    
                                                    <ul className="dropdown-menu dropdown-menu-right">
                                                        <li><a href="">Delete</a></li>
                                                        <li><a href="">Archive</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="media-body">
                                            <label>
                                                <input type="checkbox" />
                                                <i className="input-helper"></i>
                                                <span>Suspendisse potenti. Cras dolor augue, tincidunt sit amet lorem id, blandit rutrum libero</span>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="checkbox media">
                                        <div className="pull-right">
                                            <ul className="actions actions-alt">
                                                <li className="dropdown">
                                                    <a href="" >
                                                        <i className="zmdi zmdi-more-vert"></i>
                                                    </a>
                                                    
                                                    <ul className="dropdown-menu dropdown-menu-right">
                                                        <li><a href="">Delete</a></li>
                                                        <li><a href="">Archive</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="media-body">
                                            <label>
                                                <input type="checkbox" />
                                                <i className="input-helper"></i>
                                                <span>Proin luctus dictum nisl id auctor. Nullam lobortis condimentum arcu sit amet gravida</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-sm-6">
                            <div id="calendar-widget" className="fc fc-ltr ui-widget"><div className="fc-toolbar"><div className="fc-left"></div><div className="fc-right"></div><div className="fc-center"><button type="button" className="fc-prev-button ui-button ui-state-default ui-corner-left ui-corner-right"><span className="ui-icon ui-icon-circle-triangle-w"></span></button><h2>June 2014</h2><button type="button" className="fc-next-button ui-button ui-state-default ui-corner-left ui-corner-right"><span className="ui-icon ui-icon-circle-triangle-e"></span></button></div><div className="fc-clear"></div></div><div className="fc-view-container" ><div className="fc-view fc-month-view fc-basic-view"><table><thead className="fc-head"><tr><td className="ui-widget-header"><div className="fc-row ui-widget-header"><table><thead><tr><th className="fc-day-header ui-widget-header fc-sun">Sun</th><th className="fc-day-header ui-widget-header fc-mon">Mon</th><th className="fc-day-header ui-widget-header fc-tue">Tue</th><th className="fc-day-header ui-widget-header fc-wed">Wed</th><th className="fc-day-header ui-widget-header fc-thu">Thu</th><th className="fc-day-header ui-widget-header fc-fri">Fri</th><th className="fc-day-header ui-widget-header fc-sat">Sat</th></tr></thead></table></div></td></tr></thead><tbody className="fc-body"><tr><td className="ui-widget-content"><div className="fc-day-grid-container"><div className="fc-day-grid"><div className="fc-row fc-week ui-widget-content"><div className="fc-bg"><table><tbody><tr><td className="fc-day ui-widget-content fc-sun fc-past" ></td><td className="fc-day ui-widget-content fc-mon fc-past" ></td><td className="fc-day ui-widget-content fc-tue fc-past" ></td><td className="fc-day ui-widget-content fc-wed fc-past" ></td><td className="fc-day ui-widget-content fc-thu fc-past" ></td><td className="fc-day ui-widget-content fc-fri fc-past" ></td><td className="fc-day ui-widget-content fc-sat fc-past" ></td></tr></tbody></table></div><div className="fc-content-skeleton"><table><thead><tr><td className="fc-day-number fc-sun fc-past" >1</td><td className="fc-day-number fc-mon fc-past" >2</td><td className="fc-day-number fc-tue fc-past" >3</td><td className="fc-day-number fc-wed fc-past" >4</td><td className="fc-day-number fc-thu fc-past" >5</td><td className="fc-day-number fc-fri fc-past" >6</td><td className="fc-day-number fc-sat fc-past" >7</td></tr></thead><tbody><tr><td className="fc-event-container"><a className="fc-day-grid-event fc-h-event fc-event fc-start fc-end bgm-cyan fc-draggable fc-resizable"><div className="fc-content"> <span className="fc-title">All Day</span></div><div className="fc-resizer fc-end-resizer"></div></a></td><td></td><td></td><td></td><td></td><td></td><td className="fc-event-container"><a className="fc-day-grid-event fc-h-event fc-event fc-start fc-not-end bgm-orange fc-draggable"><div className="fc-content"> <span className="fc-title">Long Event</span></div></a></td></tr></tbody></table></div></div><div className="fc-row fc-week ui-widget-content"><div className="fc-bg"><table><tbody><tr><td className="fc-day ui-widget-content fc-sun fc-past" ></td><td className="fc-day ui-widget-content fc-mon fc-past" ></td><td className="fc-day ui-widget-content fc-tue fc-past" ></td><td className="fc-day ui-widget-content fc-wed fc-past" ></td><td className="fc-day ui-widget-content fc-thu fc-past" ></td><td className="fc-day ui-widget-content fc-fri fc-past" ></td><td className="fc-day ui-widget-content fc-sat fc-past" ></td></tr></tbody></table></div><div className="fc-content-skeleton"><table><thead><tr><td className="fc-day-number fc-sun fc-past" >8</td><td className="fc-day-number fc-mon fc-past" >9</td><td className="fc-day-number fc-tue fc-past" >10</td><td className="fc-day-number fc-wed fc-past" >11</td><td className="fc-day-number fc-thu fc-past" >12</td><td className="fc-day-number fc-fri fc-past" >13</td><td className="fc-day-number fc-sat fc-past" >14</td></tr></thead><tbody><tr><td className="fc-event-container" colSpan="2"><a className="fc-day-grid-event fc-h-event fc-event fc-not-start fc-end bgm-orange fc-draggable fc-resizable"><div className="fc-content"> <span className="fc-title">Long Event</span></div><div className="fc-resizer fc-end-resizer"></div></a></td><td rowSpan="2"></td><td rowSpan="2"></td><td className="fc-event-container"><a className="fc-day-grid-event fc-h-event fc-event fc-start fc-end bgm-cyan fc-draggable fc-resizable"><div className="fc-content"> <span className="fc-title">Lunch</span></div><div className="fc-resizer fc-end-resizer"></div></a></td><td className="fc-event-container" rowSpan="2"><a className="fc-day-grid-event fc-h-event fc-event fc-start fc-end bgm-amber fc-draggable fc-resizable"><div className="fc-content"> <span className="fc-title">Birthday</span></div><div className="fc-resizer fc-end-resizer"></div></a></td><td rowSpan="2"></td></tr><tr><td></td><td className="fc-event-container"><a className="fc-day-grid-event fc-h-event fc-event fc-start fc-end bgm-lightgreen fc-draggable fc-resizable"><div className="fc-content"> <span className="fc-title">Repeat</span></div><div className="fc-resizer fc-end-resizer"></div></a></td><td className="fc-event-container"><a className="fc-day-grid-event fc-h-event fc-event fc-start fc-end bgm-green fc-draggable fc-resizable"><div className="fc-content"> <span className="fc-title">Meet</span></div><div className="fc-resizer fc-end-resizer"></div></a></td></tr></tbody></table></div></div><div className="fc-row fc-week ui-widget-content"><div className="fc-bg"><table><tbody><tr><td className="fc-day ui-widget-content fc-sun fc-past" ></td><td className="fc-day ui-widget-content fc-mon fc-past" ></td><td className="fc-day ui-widget-content fc-tue fc-past" ></td><td className="fc-day ui-widget-content fc-wed fc-past" ></td><td className="fc-day ui-widget-content fc-thu fc-past" ></td><td className="fc-day ui-widget-content fc-fri fc-past" ></td><td className="fc-day ui-widget-content fc-sat fc-past" ></td></tr></tbody></table></div><div className="fc-content-skeleton"><table><thead><tr><td className="fc-day-number fc-sun fc-past" >15</td><td className="fc-day-number fc-mon fc-past" >16</td><td className="fc-day-number fc-tue fc-past" >17</td><td className="fc-day-number fc-wed fc-past" >18</td><td className="fc-day-number fc-thu fc-past" >19</td><td className="fc-day-number fc-fri fc-past" >20</td><td className="fc-day-number fc-sat fc-past" >21</td></tr></thead><tbody><tr><td></td><td className="fc-event-container"><a className="fc-day-grid-event fc-h-event fc-event fc-start fc-end bgm-lightblue fc-draggable fc-resizable"><div className="fc-content"> <span className="fc-title">Repeat</span></div><div className="fc-resizer fc-end-resizer"></div></a></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table></div></div><div className="fc-row fc-week ui-widget-content"><div className="fc-bg"><table><tbody><tr><td className="fc-day ui-widget-content fc-sun fc-past" ></td><td className="fc-day ui-widget-content fc-mon fc-past" ></td><td className="fc-day ui-widget-content fc-tue fc-past" ></td><td className="fc-day ui-widget-content fc-wed fc-past" ></td><td className="fc-day ui-widget-content fc-thu fc-past" ></td><td className="fc-day ui-widget-content fc-fri fc-past" ></td><td className="fc-day ui-widget-content fc-sat fc-past" ></td></tr></tbody></table></div><div className="fc-content-skeleton"><table><thead><tr><td className="fc-day-number fc-sun fc-past" >22</td><td className="fc-day-number fc-mon fc-past" >23</td><td className="fc-day-number fc-tue fc-past" >24</td><td className="fc-day-number fc-wed fc-past" >25</td><td className="fc-day-number fc-thu fc-past" >26</td><td className="fc-day-number fc-fri fc-past" >27</td><td className="fc-day-number fc-sat fc-past" >28</td></tr></thead><tbody><tr><td></td><td></td><td></td><td></td><td></td><td></td><td className="fc-event-container"><a className="fc-day-grid-event fc-h-event fc-event fc-start fc-end bgm-amber fc-draggable fc-resizable" href="http://google.com/"><div className="fc-content"> <span className="fc-title">Google</span></div><div className="fc-resizer fc-end-resizer"></div></a></td></tr></tbody></table></div></div><div className="fc-row fc-week ui-widget-content"><div className="fc-bg"><table><tbody><tr><td className="fc-day ui-widget-content fc-sun fc-past" ></td><td className="fc-day ui-widget-content fc-mon fc-past" ></td><td className="fc-day ui-widget-content fc-tue fc-other-month fc-past" ></td><td className="fc-day ui-widget-content fc-wed fc-other-month fc-past" ></td><td className="fc-day ui-widget-content fc-thu fc-other-month fc-past" ></td><td className="fc-day ui-widget-content fc-fri fc-other-month fc-past" ></td><td className="fc-day ui-widget-content fc-sat fc-other-month fc-past" ></td></tr></tbody></table></div><div className="fc-content-skeleton"><table><thead><tr><td className="fc-day-number fc-sun fc-past" >29</td><td className="fc-day-number fc-mon fc-past" >30</td><td className="fc-day-number fc-tue fc-other-month fc-past" >1</td><td className="fc-day-number fc-wed fc-other-month fc-past" >2</td><td className="fc-day-number fc-thu fc-other-month fc-past" >3</td><td className="fc-day-number fc-fri fc-other-month fc-past" >4</td><td className="fc-day-number fc-sat fc-other-month fc-past" >5</td></tr></thead><tbody><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table></div></div><div className="fc-row fc-week ui-widget-content"><div className="fc-bg"><table><tbody><tr><td className="fc-day ui-widget-content fc-sun fc-other-month fc-past" ></td><td className="fc-day ui-widget-content fc-mon fc-other-month fc-past" ></td><td className="fc-day ui-widget-content fc-tue fc-other-month fc-past" ></td><td className="fc-day ui-widget-content fc-wed fc-other-month fc-past" ></td><td className="fc-day ui-widget-content fc-thu fc-other-month fc-past" ></td><td className="fc-day ui-widget-content fc-fri fc-other-month fc-past" ></td><td className="fc-day ui-widget-content fc-sat fc-other-month fc-past" ></td></tr></tbody></table></div><div className="fc-content-skeleton"><table><thead><tr><td className="fc-day-number fc-sun fc-other-month fc-past" >6</td><td className="fc-day-number fc-mon fc-other-month fc-past" >7</td><td className="fc-day-number fc-tue fc-other-month fc-past" >8</td><td className="fc-day-number fc-wed fc-other-month fc-past" >9</td><td className="fc-day-number fc-thu fc-other-month fc-past" >10</td><td className="fc-day-number fc-fri fc-other-month fc-past" >11</td><td className="fc-day-number fc-sat fc-other-month fc-past" >12</td></tr></thead><tbody><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table></div></div></div></div></td></tr></tbody></table></div></div></div>

                            <div className="card">
                                <div className="card-header ch-alt m-b-20">
                                    <h2>Recent Posts <small>Phasellus condimentum ipsum id auctor imperdie</small></h2>
                                    <ul className="actions">
                                        <li>
                                            <a href="">
                                                <i className="zmdi zmdi-refresh-alt"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="">
                                                <i className="zmdi zmdi-download"></i>
                                            </a>
                                        </li>
                                        <li className="dropdown">
                                            <a href="" >
                                                <i className="zmdi zmdi-more-vert"></i>
                                            </a>
                                            
                                            <ul className="dropdown-menu dropdown-menu-right">
                                                <li>
                                                    <a href="">Change Date Range</a>
                                                </li>
                                                <li>
                                                    <a href="">Change Graph Type</a>
                                                </li>
                                                <li>
                                                    <a href="">Other Settings</a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                    
                                    <button className="btn bgm-cyan btn-float waves-effect waves-circle waves-float"><i className="zmdi zmdi-plus"></i></button>
                                </div>
                                
                                <div className="card-body">
                                    <div className="listview">
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
                                                    <img className="lv-img-sm" src="img/profile-pics/2.jpg" alt="" />
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
                                                    <img className="lv-img-sm" src="img/profile-pics/3.jpg" alt="" />
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
                                                    <img className="lv-img-sm" src="img/profile-pics/4.jpg" alt="" />
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
                                                    <img className="lv-img-sm" src="img/profile-pics/4.jpg" alt="" />
                                                </div>
                                                <div className="media-body">
                                                    <div className="lv-title">Bill Phillips</div>
                                                    <small className="lv-small">Proin laoreet commodo eros id faucibus. Donec ligula quam, imperdiet vel ante placerat</small>
                                                </div>
                                            </div>
                                        </a>
                                        <a className="lv-footer" href="">View All</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>
		);
	}
}

export default DashboardPage;
