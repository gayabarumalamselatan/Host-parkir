import { Fragment, useEffect, useState } from "react";
import ContentHeader from "../Layout/ContentHeader";
import MemberService from "../Services/memberService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons/faCaretRight";
import PageLoading from "../Components/PageLoading";
import { LogoutExp } from "../Services/expiredToken";
import Swal from "sweetalert2";

const LihatMember = () => {

  const [memberData, setMemberData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [nopolSearch, setNopolSearch] = useState("")
  const [paginationDisplay, setPaginationDisplay] = useState({
    start: 0,
    end: 0,
    startingIndex: 0,
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

  const fetchMember = async (page = 1, limit = 5, nopol) => {
    setIsLoading(true);
    let params = [];
    if(nopol){
      params.push(`nomor_polisi=${nopol}`)
    }
    params.push(`limit=${limit}`);
    params.push(`page=${page}`);
    params.push(`is_active=true`);
    const queryString = params.join('&');
    console.log(queryString)
    try {
      const response = await MemberService.fetchMemberService(queryString);
      if(response.status === 200){
        // eslint-disable-next-line no-unused-vars
        const formattedMemberData = response.data.data.map(({id, is_active, is_black_list, ...rest}) => rest)
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

  // Table thing
  const headers = memberData.length > 0 ? Object.keys(memberData[0]) : [];

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

  return (
    <Fragment>
      <div className="m-4">
        <section className="content-header">
          <ContentHeader title="Lihat Member" />
        </section>

        {/* Input Search */}
        <section className="mt-4">
          <div className="card custom-shadow border border-0 rounded-custom">
            <div className="card-body mt-2 mb-3  mx-3">
              <div className="d-flex align-items-center">
                <div className="col-md-6">
                  <label className="form-label fw-semibold primary-text-color">
                    Nomor Polisi
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Masukkan Nomor Polisi"
                    value={nopolSearch}
                    onChange={(e) => setNopolSearch(e.target.value  )}
                  />
                </div>
                <div className="col-md-6 text-end">
                  <button 
                    className="btn btn-primary w-25 px-4 my-auto primary-button-custom rounded-4"
                    onClick={() => {
                      fetchMember(1, limit, nopolSearch)
                    }}
                  >Cari</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Table Data */}
        <section className="mt-4">
          <div className="card rounded-custom border border-0 custom-shadow">
            { isLoading === true ? (
                <PageLoading/>
              ) : (
                <>
                  <div className="card-header primary-button-custom p-3 text-white fw-bold border border-0">   
                    <div className="d-flex flex-row justify-content-between">
                      <p className="m-0 ms-2">Data Pemilik</p>
                      <div className="d-flex me-2 gap-2">
                        <p className="m-0">Limit:</p>
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
                  </div>
                  <div className="card-body table-responsive p-4">
                    <table className="table table-striped table-hover text-start">
                      <thead>
                        <tr>
                          <th className="px-3">No</th>
                          {headers.map((header) => (
                            <th key={header} className="px-3 py-2">
                              {header.replace(/_/g, ' ').toUpperCase()}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {memberData.map((row, index) => (
                          <tr key={index}>
                            <td className="px-3">
                            {paginationDisplay.startingIndex + index + 1}
                            </td>
                            {headers.map((header) => (
                              <td key={header} className='px-3 py-2'>
                                {row[header] ?? "-"}
                              </td>
                            ))}
                          </tr>
                        ))}
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
                </>
              )
            }
          </div>
        </section>

      </div>
      <div style={{height: '20px'}}></div>
    </Fragment>
  );
};

export default LihatMember;
