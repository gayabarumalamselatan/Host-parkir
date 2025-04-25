import { Fragment } from "react";
import ContentHeader from "../Layout/ContentHeader";

const LihatMember = () => {
  return (
    <Fragment>
      <div className="m-4">
        <section className="content-header">
          <ContentHeader title="Lihat Member" />
        </section>

        {/* Input Search */}
        <section className="mt-4">
          <div className="card shadow-sm">
            <div className="card-body">
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
                  <button className="btn btn-primary mt-3">Cari</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Table Data */}
        <section className="mt-4">
          <div className="card">
            <div className="card-header bg-primary text-white fw-bold">
              Data Pemilik
            </div>
            <div className="card-body table-responsive">
              <table className="table table-bordered table-hover align-middle text-center">
                <thead className="table-light text-center">
                  <tr>
                    <th>No. Polisi</th>
                    <th>Nama Pemilik</th>
                    <th>Tanggal Masuk</th>
                    <th>Tanggal Kadaluarsa</th>
                    <th>Biaya Bulanan</th>
                    <th>Tanggal Bayar</th>
                    <th>Untuk</th>
                    <th>Jumlah Pembayaran</th>
                    <th>Keterangan</th>
                    <th>Kadaluarsa Berikutnya</th>
                  </tr>
                </thead>
                <tbody>
                  {Array(4)
                    .fill()
                    .map((_, idx) => (
                      <tr key={idx}>
                        <td>D 1234 AEO</td>
                        <td>John Doe</td>
                        <td>01/02/2024</td>
                        <td>01/03/2024</td>
                        <td>200,000.00</td>
                        <td>01/03/2024</td>
                        <td>1 bulan</td>
                        <td>200,000.00</td>
                        <td>Lorem Ipsum</td>
                        <td>01/04/2024</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export default LihatMember;
