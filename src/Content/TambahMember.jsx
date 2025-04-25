import { Fragment } from "react";
import ContentHeader from "../Layout/ContentHeader";

const TambahMember = () => {
  return (
    <Fragment>
      <div className="m-4">
        <section className="content-header">
          <ContentHeader title="Tambah Member" />
        </section>

        <section className="mt-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold primary-text-color">
                    Nomor Polisi
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Masukkan nomor polisi"
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
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold primary-text-color">
                    Nomor Hp
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Masukkan nomor HP"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold primary-text-color">
                    Tanggal Masuk
                  </label>
                  <input type="date" className="form-control" />
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

              <div className="d-flex justify-content-end">
                <button className="btn btn-primary">Tambah Member</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export default TambahMember;
