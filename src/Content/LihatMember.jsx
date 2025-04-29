import { Fragment, useEffect, useState } from "react";
import ContentHeader from "../Layout/ContentHeader";
import MemberService from "../Services/memberService";

const LihatMember = () => {

  const [memberData, setMemberData] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);


  const fetchMember = async () => {
    try {
      const response = await MemberService.fetchMemberService();
      // eslint-disable-next-line no-unused-vars
      const formattedMemberData = response.data.data.map(({id, is_active, is_black_list, ...rest}) => rest)
      setMemberData(formattedMemberData)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMember();
  },[])

  console.log('memberData', memberData);

  // Table thing
  // const formattedMemberData = memberData.map(({id, is_active, is_black_list, ...rest}) => rest)
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
            <div className="card-body m-2">
              <div className="row align-items-end">
                <div className="col-md-6 mb-3">
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
                  <button className="btn btn-primary px-4 mt-3 primary-button-custom rounded-4">Cari</button>
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
                        {index+1}
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
            </div>
          </div>
        </section>
      </div>
      <div style={{height: '20px'}}></div>
    </Fragment>
  );
};

export default LihatMember;
