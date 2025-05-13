import PropTypes from "prop-types";
import { Fragment, useEffect, useState } from "react";
import { AdminMenu, OperatorMenu } from "../Config/MenuList";
import { Link } from "react-router-dom";

const Sidebar = ({ show }) => {
  const [sidebarMenuList, setSidebarMenuList] = useState([]);
  const role = sessionStorage.getItem('Role_id');

  useEffect(() => {
    if(role === '1') {
      setSidebarMenuList(AdminMenu);
    } else if(role === '2'){
      setSidebarMenuList(OperatorMenu)
    } else {
      setSidebarMenuList([])
    }
  }, []);

  const renderSidebarMenu = (sidebarMenuList) => {
    return sidebarMenuList.map(item => {
      return(
        <li className="nav-item mb-2" key={item.menuLink}>
          <Link to={item.menuLink} className="nav-link mx-4 align-items-center">
            <p className="mb-0 py-1 sidebar-text">{item.menuName}</p>
          </Link>
        </li>
      )
    })
  }

  console.log('menu', sidebarMenuList)

  return (
    <Fragment>
      <aside
        className={`h-100 sidebar-custom shadow ${show ? "" : "d-none"}`}
        style={{ overflowY: "hidden" }}
      >
        
          <div className="d-flex justify-content-center align-items-center border-bottom" style={{height: '56px'}}>
            <p className="sidebar-logo fs-3 text my-0" >Parkirin Dong!</p>
          </div>

          {/* Menu */}
          <nav className="mt-4">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item mb-2" key="home">
                <Link to="/" className="nav-link mx-4 align-items-center">
                  <p className="mb-0 py-1 sidebar-text">Beranda</p>
                </Link>
              </li>
              {
                renderSidebarMenu(sidebarMenuList)
              }
            </ul>
          </nav>
        
      </aside>
    </Fragment>
  );
};

Sidebar.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default Sidebar;
