import { Fragment, useState } from "react";
import ContentHeader from "../Layout/ContentHeader";

const TambahMember = () => {

  const inittialMember = {
    nomor_polisi: "",
    nama_pemilik: "",
    nomor_hp: "",
    tanggal_masuk: new Date().toISOString().split('T')[0],
    tanggal_kaaluarsa: new Date().toISOString().split('T')[0],
    tarif_bulanan: 0,
    keterangan: "",
  }

  const [memberToCreate, setMemberToCreate] = useState(inittialMember)

  console.log('member', memberToCreate)

  return (
    <Fragment>
      <div className="m-4">
        <section className="content-header">
          <ContentHeader title="Tambah Member" />
        </section>

        <section className="mt-4">
          <div className="card custom-shadow border border-0 rounded-5">
            <div className="card-body p-4">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold primary-text-color">
                    Nomor Polisi
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Masukkan nomor polisi"
                    value={memberToCreate.nomor_polisi}
                    onChange={(e)=> {
                      setMemberToCreate({
                        ...memberToCreate,
                        nomor_polisi: e.target.value
                      })
                    }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold primary-text-color">
                    Nama Pemilik
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Masukkan nama pemilik"
                    value={memberToCreate.nama_pemilik}
                    onChange={(e) => {
                      setMemberToCreate({
                        ...memberToCreate,
                        nama_pemilik: e.target.value
                      })
                    }}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold primary-text-color">
                    Nomor Hp
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Masukkan nomor HP"
                    value={memberToCreate.nomor_hp}
                    onChange={(e) => {
                      setMemberToCreate({
                        ...memberToCreate,
                        nomor_hp: e.target.value
                      })
                    }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold primary-text-color">
                    Tanggal Masuk
                  </label>
                  <input 
                    type="date" 
                    className="form-control"
                    value={memberToCreate.tanggal_masuk}
                    onChange={(e) => {
                      setMemberToCreate({
                        ...memberToCreate,
                        tanggal_masuk: e.target.value
                      })
                    }} 
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold primary-text-color">
                    Biaya Bulanan
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Masukkan biaya bulanan"
                    value={memberToCreate.tarif_bulanan.toLocaleString('en-US')}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold primary-text-color">
                    Keterangan
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Tambahkan keterangan jika ada"
                  ></textarea>
                </div>
              </div>

              <div className="d-flex justify-content-end mt-">
                <button className="btn btn-primary primary-button-custom rounded-4">Tambah Member</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export default TambahMember;
