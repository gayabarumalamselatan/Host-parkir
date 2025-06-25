import PropTypes from "prop-types"
import { Modal } from "react-bootstrap"
import NotificationService from "../../Services/notificationService"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"

const NotificationModal = ({
  notifActionModalOpen,
  setNotifActionModalOpen,
  notificationData
}) => {

  const navigate = useNavigate();
  
  const handleSetHarian = async () => {
    const logToUpdate = {
      is_harian: true
    }
    const notificationToUpdate = {
      is_read: true
    };
    try {
      const logResponse = await NotificationService.updateLog(notificationData.log_id, logToUpdate);
      const notificationResponse = await NotificationService.updateNotification(notificationData.id, notificationToUpdate);
      if(logResponse.status === 200 && notificationResponse.status === 200){
        Swal.fire({
          title: "Yes, Berhasil!",
          text: "Log berhasil diperbaharui.",
          icon: 'success',
          confirmButtonText: "OK"
        })
      } else {
        throw logResponse, notificationResponse
      } 
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ada yang salah nih!"
      });
    } finally {
      setNotifActionModalOpen(false)
    }
  }

  const directAddMember = () => {
    navigate("/tambah-member", { 
      state: { 
        nomor_polisi: notificationData.nomor_polisi 
      } 
    });
    setNotifActionModalOpen(false)
  }

  return(
    <>
      <Modal show={notifActionModalOpen} onHide={() => setNotifActionModalOpen(!notifActionModalOpen)}>
        <Modal.Header>
          Detail Notifikasi
        </Modal.Header>
        <Modal.Body>
         {notificationData ? (
          <div>
            <p>Nomor Polisi: {notificationData.nomor_polisi}</p>
            <p>Tanggal Masuk: {notificationData.tanggal_masuk}</p>
            <p>Jam Masuk: {notificationData.jam_masuk}</p>
          </div>
        ) : (
          <p>No notification data available.</p>
        )}
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex flex-row gap-2">
            <button 
              className="btn btn-primary secondary-button-custom rounded-4 px-3"
              onClick={handleSetHarian}  
            >
              Harian
            </button>
            <button 
              className="btn btn-primary primary-button-custom rounded-4 px-3"
              onClick={directAddMember}
            >
              Tambah Member
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}

NotificationModal.propTypes = {
  notifActionModalOpen: PropTypes.bool,
  setNotifActionModalOpen: PropTypes.func,
  notificationData: PropTypes.any
}

export default NotificationModal