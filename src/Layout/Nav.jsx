import { faBars, faBell, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { useNotification } from "../Context/NotificationProvider";


const Nav = ({ toggleSidebar, show }) => {
  const [notifActionModalOpen, setNotifActionModalOpen] = useState(false)
  const navigate = useNavigate();
  const { notifications} = useNotification();
  const [notiCardOpen, setNotiCardOpen] = useState(false);
  const overlayRef = useRef(null);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const notificationCount = notifications.length > 10 ? '10+' : notifications.length
  console.log(notificationCount)

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        setNotiCardOpen(false); // Close the notification card
      }
    };
    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [overlayRef]);

  const NotificationOverlay = ({ notifications }) => {
    return (
      <div className="position-fixed card z-3 noti-overlay"  ref={overlayRef}>
        <div className="card-body">
          {notifications.length === 0 ? (
            <p className="text-center p-3 mb-0">No notifications</p>
          ) : (
            <ul className="list-group list-group-flush">
              {notifications.map((notif) => (
                <li 
                  key={notif.id}  
                  className={`list-group-item ${notif.is_read ? '' : 'fw-bold'}`}
                  onClick={() => setNotifActionModalOpen(!notifActionModalOpen)}
                  style={{
                    cursor: "pointer"
                  }}
                >
                  <div>Nomor Polisi: {notif.nomor_polisi}</div>
                  <div>Tanggal Masuk: {notif.tanggal_masuk}</div>
                  <div>Jam Masuk: {notif.jam_masuk}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <nav 
        className="navbar-custom navbar navbar-expand bg-body shadow border-0 position-fixed z-2"
        style={{ 
          left: show ? '250px' : '0', 
          width: show ? 'calc(100% - 250px)' : '100%'
        }}
      >
        <div className="container-fluid z-2">
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
            <li className="nav-item me-3">
              <button 
                className="text-white nav-link"
                onClick={() => setNotiCardOpen(!notiCardOpen)}  
              >
                <FontAwesomeIcon icon={faBell}/>
                {notifications.length > 0 && (
                  <span className="top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {notificationCount}
                  </span>
                )}
              </button>
               {notiCardOpen && (
                <NotificationOverlay 
                  notifications={notifications} 
                  onClose={() => setNotiCardOpen(false)} 
                />
              )}
            </li> 
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
      <Modal show={notifActionModalOpen} onHide={() => setNotifActionModalOpen(!notifActionModalOpen)}>
        <Modal.Header>
          TEST
        </Modal.Header>
      </Modal>
    </Fragment>
  );
};

Nav.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  show: PropTypes.bool,
  notifications: PropTypes.array
};

export default Nav;
