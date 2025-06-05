import PropTypes from "prop-types";

const NotificationOverlay = ({ 
  notifications, 
  setNotifActionModalOpen, 
  notifActionModalOpen,
  setNotificationData,
  onClose
}) => {
  const handleSelectClick = (notification) => {
    setNotifActionModalOpen(!notifActionModalOpen)
    setNotificationData(notification);
    onClose();
  } 
  return (
  <div className="position-fixed card z-3 noti-overlay">
    <div 
      className="card-body" 
      style={{ 
        maxHeight: "400px", 
        overflowY: "auto"
      }}
    >
      {notifications.length === 0 ? (
        <p className="text-center p-3 mb-0">No notifications</p>
      ) : (
        <ul className="list-group list-group-flush">
          {notifications.map((notif) => (
            <li 
              key={notif.id}  
              className={`list-group-item ${notif.is_read ? '' : 'fw-bold'}`}
              onClick={() => handleSelectClick(notif)}
              style={{ cursor: "pointer" }}
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

NotificationOverlay.propTypes = {
  notifications: PropTypes.array,
  onClose: PropTypes.func,
  setNotifActionModalOpen: PropTypes.func,
  notifActionModalOpen: PropTypes.bool,
  setNotificationData: PropTypes.func,
}

export default NotificationOverlay