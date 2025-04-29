import { Fragment, useEffect, useState } from "react";
import ContentHeader from "../Layout/ContentHeader";
import MemberService from "../Services/memberService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons/faCaretRight";

const LihatMember = () => {

  const [memberData, setMemberData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [paginationDisplay, setPaginationDisplay] = useState({
    start: 0,
    end: 0,
    startingIndex: 0,
  })
  // const [isLoading, setIsLoading] = useState(false);
  
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

  const fetchMember = async () => {
    const params = "limit=10&page=2"
    try {
      const response = await MemberService.fetchMemberService(params);
      // eslint-disable-next-line no-unused-vars
      const formattedMemberData = response.data.data.map(({id, is_active, is_black_list, ...rest}) => rest)
      setMemberData(formattedMemberData);
      setPaginationData(response.data.pagination);
      calculateDisplayRange(response.data.pagination.current_page, response.data.pagination.limit, response.data.pagination.total_members);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMember();
  },[]);

  // Table thing
  const headers = memberData.length > 0 ? Object.keys(memberData[0]) : [];

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
                  />
                </div>
                <div className="col-md-6 text-end">
                  <button className="btn btn-primary w-25 px-4 my-auto primary-button-custom rounded-4">Cari</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Table Data */}
        <section className="mt-4">
          <div className="card rounded-custom border border-0 custom-shadow">
            <div className="card-header primary-button-custom p-3 text-white fw-bold border border-0">   
              <p className="m-0 ms-2">Data Pemilik</p>
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

                  <button className="btn btn-primary">
                    <FontAwesomeIcon icon={faCaretLeft}/>
                  </button>

                  {paginationData && paginationData.total_pages > 0 && (
                    Array.from({ length: paginationData.total_pages }, (_, index) => (
                      <button className="btn btn-primary" key={index + 1} >
                        {index + 1}
                      </button>
                    ))
                  )}

                  <button className="btn btn-primary">
                    <FontAwesomeIcon icon={faCaretRight}/>
                  </button>

                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
      <div style={{height: '20px'}}></div>
    </Fragment>
  );
};

export default LihatMember;
