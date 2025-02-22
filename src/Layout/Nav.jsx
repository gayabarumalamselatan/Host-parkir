import { faBars, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Nav = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const showLogoutConfirm = () => {
    Swal.fire({
      title: "Confirmation",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "warning",
      cancelButtonColor: "grey",
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
      }
    });
  };

  return (
    <Fragment>
      <nav className="app-header navbar navbar-expand bg-body shadow border-0">
        <div className="container-fluid">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a
                className="nav-link"
                data-widget="pushmenu"
                href="#"
                role="button"
                onClick={toggleSidebar}
              >
                <FontAwesomeIcon className="text-white" icon={faBars} />
              </a>
            </li>
          </ul>
          {/* <ul className='navbar-nav my-auto'>
          <li className='nav-item'>
            <span className='nav-link'>
              <Form.Check
                type="switch"
                id="custom-switch"
                onChange={setDarkmode}
                checked={isDarkmode}
              />
            </span>
          </li>
        </ul> */}
          {/* <ul className='navbar-nav my-auto'>
          <li className='nav-item'>
            
            <Form.Select
              className='py-auto my-auto'
              id='panjangdinamis'
              onChange={handleThemeChange}
            >
              <option value="">Pilih Tema</option>
              <option value="biru">Biru</option>
              <option value="merah">Merah</option>
            </Form.Select>
            
          </li>
        </ul> */}
          <ul className="navbar-nav ml-auto">
            {/* <li className="nav-item">
            <span className="nav-link">
              {userName ? `${userName}` : ''} | Date: {currentBusinessDate}
            </span>
          </li> */}
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                role="button"
                onClick={showLogoutConfirm}
              >
                <FontAwesomeIcon className="text-white" icon={faSignOutAlt} />
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </Fragment>
  );
};

Nav.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Nav;
