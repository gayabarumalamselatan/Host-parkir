import { Fragment, useEffect, useState } from "react"
import ContentHeader from "../Layout/ContentHeader"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretLeft, faCaretRight, faEdit, faRefresh, faTrash } from "@fortawesome/free-solid-svg-icons"
import MemberService from "../Services/memberService"
import PageLoading from "../Layout/PageLoading"
import { Modal } from "react-bootstrap"
import Swal from "sweetalert2"
import { LogoutExp } from "../Services/expiredToken"


const ManajemenMember = () => {

  const initialData={
    nomor_polisi: "",
    nama_pemilik: "",
    nomor_hp: "",
    tanggal_masuk: new Date().toISOString().split('T')[0],
    tanggal_kadaluarsa: new Date().toISOString().split('T')[0],
    tarif_bulanan: 0,
    jangka_waktu: 0,
    keterangan: "",
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [memberToEdit, setMemberToEdit] = useState(initialData);
  const [limit, setLimit] = useState(5);
  const [memberData, setMemberData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [isAddFilter, setIsAddFilter] = useState(false)
  const [paginationDisplay, setPaginationDisplay] = useState({
    start: 0,
    end: 0,
    startingIndex: 0,
  })
  const [filterQuery, setFilterQuery] = useState({
    tanggal_masuk: '',
    tanggal_kadaluarsa: '',
    tarif_bulanan: 0
  })

  const calculateDisplayRange = (currentPage, limit, totalMembers ) => {
    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, totalMembers);
    const startingIndex = (currentPage - 1) * limit;
    setPaginationDisplay({
      start,
      end,
      startingIndex
    })
  };

  const fetchMember = async (page = 1, limit = 5, queries) => {
    let params = []
    if(queries){
      console.log(queries.tarif_bulanan)
      if(queries.tarif_bulanan){
        params.push(`tarif_bulanan=${queries.tarif_bulanan}`);
      }
      if(queries.tanggal_masuk){
        params.push(`tanggal_masuk=${queries.tanggal_masuk}`);
      }
      if(queries.tanggal_kadaluarsa){
        params.push(`tanggal_kadaluarsa=${queries.tanggal_kadaluarsa}`);
      }
    }

    setIsLoading(true);
    // params = `limit=${limit}&page=${page}&is_active=true`
    params.push(`limit=${limit}`);
    params.push(`page=${page}`);
    params.push(`is_active=true`);
    const queryString = params.join('&');
    console.log(queryString)
    try {
      const response = await MemberService.fetchMemberService(queryString);
      if(response.status === 200){
        // eslint-disable-next-line no-unused-vars
        const formattedMemberData = response.data.data.map(({is_active, is_black_list, ...rest}) => rest)
        setMemberData(formattedMemberData);
        setPaginationData(response.data.pagination);
        calculateDisplayRange(response.data.pagination.current_page, response.data.pagination.limit, response.data.pagination.total_members);
      } else {
        throw response;
      }
    } catch (error) {
      console.error(error);
      if(error.response.data.message === "Token is expired"){
        LogoutExp();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ada yang salah nih!"
        })
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMember(currentPage, limit);
  },[]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchMember(page, limit);
  };
  
  const headers = memberData.length > 0 ? Object.keys(memberData[0]).filter(header => header !== 'id') : [];

  // Tombol pagination
  const renderPaginationButtons = () => {
    const totalPages = paginationData.total_pages;
    const buttons = [];

    if (totalPages <= 2) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            className={`btn ${currentPage === i ? 'btn-primary primary-button-custom border border-0' : 'btn-light primary-text-color'}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      buttons.push(
        <button
          key={1}
          className={`btn ${currentPage === 1 ? 'btn-primary primary-button-custom border border-0' : 'btn-light primary-text-color'}`}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );

      if (currentPage > 3) {
        buttons.push(<span key="ellipsis1">...</span>);
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <button
            key={i}
            className={`btn ${currentPage === i ? 'btn-primary primary-button-custom border border-0' : 'btn-light primary-text-color'}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 2) {
        buttons.push(<span key="ellipsis2">...</span>);
      }

      if (totalPages > 1) {
        buttons.push(
          <button
            key={totalPages}
            className={`btn ${currentPage === totalPages ? 'btn-primary primary-button-custom border border-0' : 'btn-light primary-text-color'}`}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        );
      }
    }

    return buttons;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberToEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setMemberToEdit(initialData);
  } 

  const handleEditMember = async () => {
    const confirm = await Swal.fire({
      title: "Yakin?",
      text: "Pastikan data sudah terisi dengan benar.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Batal',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Kirim',
      reverseButtons: true
    })
    if(confirm.isConfirmed){
      setIsLoading(true)
      try {
        const response = await MemberService.updateMemberService(memberToEdit);
        if(response.status === 200) {
          setIsLoading(false)
          Swal.fire({
            title: "Yes, Berhasil!",
            text: "Member berhasil di edit.",
            icon: 'success',
            confirmButtonText: "OK"
          }).then(() => {
            setMemberToEdit(initialData);
            setIsEditModalOpen(false);
            fetchMember(1, limit)
          })
        } else {
          throw response;
        }
      } catch (error) {
        console.error("Error adding member",error);
        setIsLoading(false)
        if(error.response.data.message === "Token is expired"){
          LogoutExp();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ada yang salah nih!"
          })
        }
      }
    }
  }

  const handleDeleteMember = async (data) => {
    const confirm = await Swal.fire({
      title: "Yakin?",
      text: `${data.nomor_polisi} akan dinonaktifkan.`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Batal',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Hapus',
      reverseButtons: true
    })
    if(confirm.isConfirmed){
      setIsLoading(true);
      try {
        const response = await MemberService.disableMember(data.id);
        if(response.status === 200){
          setIsLoading(false);
          Swal.fire({
            title: "Yes, Berhasil!",
            text: `${data.nomor_polisi} berhasil dinonaktifkan.`,
            icon: 'success',
            confirmButtonText: "OK"
          }).then(() => {
            fetchMember(1, limit)
          })
        } else {
          throw response;
        }
      } catch (error) {
        console.error("Error deleting member",error);
        setIsLoading(false)
        if(error.response.data.message === "Token is expired"){
          LogoutExp();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ada yang salah nih!"
          })
        }
      }
    }
  }

  return (
    <Fragment>

      {
        isLoading && <PageLoading/>
      }

      <div className="m-4">

        {/* header */}
        <section className="content-header">
          <ContentHeader title="Manajemen Member"/>
        </section>

        {/* Filter */}
        <section className="mt-4">
          <div className="card custom-shadow border border-0 rounded-custom">
            <div className="card-body my-2 mx-3">
              <div className="d-flex align-items-center">
                <div className="col-md-6">
                  <div className="d-flex me-2 gap-2">
                    <p className="m-0 primary-text-color fw-semibold">Baris Per Halaman:</p>
                    <select
                      onClick={(e)=>{
                        const parsedLimit = parseInt(e.target.value, 10);
                        setLimit(parsedLimit);
                        setCurrentPage(1);
                        fetchMember(1, parsedLimit)
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6 text-end justify-content-end d-flex gap-2">
                  <button
                    onClick={() => fetchMember(1, limit)} 
                    className="btn primary-text-color"
                  >
                    <FontAwesomeIcon icon={faRefresh}/>
                  </button>
                  <button 
                    className="btn btn-primary w-25 px-4 my-auto primary-button-custom rounded-4"
                    onClick={() => setIsAddFilter(!isAddFilter)}
                  >{isAddFilter? "Tutup": "Filter"}</button>
                </div>
              </div>

              { isAddFilter &&
                <div className="mt-5">

                  <hr />

                  <div className="mt-3 d-flex justify-content-between gap-4">

                    <div className="w-100">
                      <label className="form-label fw-semibold primary-text-color">Tanggal Masuk</label>
                      <input 
                        type="date" 
                        className="form-control"
                        value={filterQuery.tanggal_masuk}
                        onChange={(e) => {
                          setFilterQuery({
                            ...filterQuery,
                            tanggal_masuk: e.target.value
                          })
                        }}
                      />
                    </div>

                    <div className="w-100">
                      <label className="form-label fw-semibold primary-text-color">Tarif Bulanan</label>
                      <input 
                        className="form-control"
                        type="text"  
                        value={filterQuery.tarif_bulanan}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d.-]/g, '');
                          const parsedValue = value ? parseInt(value, 10) : 0;
                          setFilterQuery({
                            ...filterQuery,
                            tarif_bulanan: parsedValue
                          })
                        }}
                      />
                    </div>

                    <div className="w-100">
                      <label className="form-label fw-semibold primary-text-color">Tanggal Kadaluarsa</label>
                      <input 
                        className="form-control"
                        type="date" 
                        value={filterQuery.tanggal_kadaluarsa}
                        onChange={(e) => {
                          setFilterQuery({
                            ...filterQuery,
                            tanggal_kadaluarsa: e.target.value
                          })
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 d-flex justify-content-end">
                     <button 
                      onClick={() => {
                        setFilterQuery({
                          tanggal_masuk: '',
                          tanggal_kadaluarsa: '',
                          tarif_bulanan: 0
                        })
                      }}    
                      className="btn btn-primary primary-button-custom rounded-4 me-2 px-4"
                    >
                      Clear
                    </button>
                    <button 
                      className="btn btn-primary primary-button-custom rounded-4 px-4"
                      onClick={() => fetchMember(1, limit, filterQuery)}
                    >
                      Search
                    </button>
                  </div>
                 
                </div>
              }

            </div>
          </div>
        </section>

        {/* Table */}

        <section className="mt-4">
          <div className="card rounded-custom border border-0 custom-shadow">
            <div className="card-header primary-button-custom p-3 text-white fw-bold border border-0">   
              <div className="d-flex flex-row justify-content-between">
                <p className="m-0 ms-2">Data Member</p>
              </div>
            </div>
            <div className="card-body table-responsive p-4">
              <table className="table table-striped table-hover text-start">
                <thead>
                  <tr>
                    {
                      memberData.length === 0 ?
                      <>
                        <p>No data</p>
                      </>
                      :
                      !isLoading?
                      <>
                        <th className="px-3">No</th>
                        {headers.map((header) => (
                          <th key={header} className="px-3 py-2">
                            {header.replace(/_/g, ' ').toUpperCase()}
                          </th>
                        ))}
                        <th>Aksi</th>
                      </>
                      :
                      <>
                        <p>
                          Loading...
                        </p>
                      </>
                      
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    memberData ? 
                    memberData.map((row, index) => (
                      <tr key={index}>
                        <td className="px-3">
                        {paginationDisplay.startingIndex + index + 1}
                        </td>
                        {headers.map((header) => (
                          <td key={header} className='px-3 py-2'>
                            {row[header] ?? "-"}
                          </td>
                        ))}
                        <td>
                          <div className="d-flex gap-2">
  
                            <button 
                              className="btn btn-primary primary-button-custom"
                              onClick={() => {
                                setIsEditModalOpen(true)
                                setMemberToEdit(row)
                              }}  
                            >
                              <FontAwesomeIcon icon={faEdit}/>
                            </button>
                            <button 
                              className="btn btn-danger danger-button-custom"
                              onClick={() => {
                                handleDeleteMember(row)
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash}/>
                            </button>
  
                          </div>
                        </td>
                      </tr>
                    ))
                    :
                    <>
                      <p>no</p>
                    </>
                  }
                </tbody>
              </table>

              <div className="d-flex flex-row justify-content-between align-items-center">
                <div className="text-start">
                  <p className="m-0 primary-text-color fw-semibold">
                    Menampilkan {paginationDisplay.start} - {paginationDisplay.end} dari {paginationData.total_members} data.
                  </p>
                </div>
                <div className="text-end d-flex flex-row gap-2">

                  <button 
                    className="btn btn-primary primary-button-custom border border-0" 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                  >
                    <FontAwesomeIcon icon={faCaretLeft} />
                  </button>

                  {renderPaginationButtons()}

                  <button 
                    className="btn btn-primary primary-button-custom border border-0" 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === paginationData.total_pages}
                  >
                    <FontAwesomeIcon icon={faCaretRight} />
                  </button>

                </div>
              </div>

            </div>
          </div>
        </section>

      </div>

      {/* Modals */}

      {/* Edit */}
      <Modal show={isEditModalOpen} size="lg" centered onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">

            <div className="col-md-6">
              <label className="form-label fw-semibold primary-text-color">Nomor Polisi</label>
              <input 
                type="text" 
                name="nomor_polisi"
                className="form-control"
                value={memberToEdit.nomor_polisi}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold primary-text-color">Nama Pemilik</label>
              <input 
                type="text" 
                className="form-control"
                name="nama_pemilik"
                value={memberToEdit.nama_pemilik}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold primary-text-color">Nomor Hp</label>
              <input 
                type="text" 
                name="nomor_hp"
                className="form-control"
                value={memberToEdit.nomor_hp}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold primary-text-color">Tanggal Masuk</label>
              <input 
                type="date" 
                className="form-control"
                name="tanggal_masuk"
                value={memberToEdit.tanggal_masuk}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold primary-text-color">Tanggal Kadaluarsa</label>
              <input 
                type="date" 
                className="form-control"
                name="tanggal_kadaluarsa"
                value={memberToEdit.tanggal_kadaluarsa}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold primary-text-color">Tarif Bulanan</label>
              <input 
                type="text" 
                className="form-control"
                name="tarif_bulanan"
                value={memberToEdit.tarif_bulanan}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold primary-text-color">Keterangan</label>
              <textarea
                type="text" 
                className="form-control"
                name="keterangan"
                value={memberToEdit.keterangan}
                onChange={handleChange}
              />
            </div>

          </div>
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-secondary secondary-button-custom rounded-4 px-4"
            onClick={handleCloseEditModal}
          >
            Batal
          </button>
          <button 
            className="btn btn-primary primary-button-custom rounded-4 px-4"
            onClick={handleEditMember}
          >
            Simpan
          </button>
        </Modal.Footer>
      </Modal>

    </Fragment>
  )
}

export default ManajemenMember