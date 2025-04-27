import { Fragment, useState } from "react";
import ContentHeader from "../Layout/ContentHeader";

const Perpanjang = () => {
  const [isPrinted, setIsPrinted] = useState(false);

  // Simulasi data yang ditampilkan setelah tombol cetak ditekan
  const [formData, setFormData] = useState({
    noPolisi: "D 1234 AEO",
    namaPemilik: "John Doe",
    tanggalMasuk: "01/02/2024",
    tanggalKadaluarsa: "01/02/2024",
    biayaBulanan: "200,000.00",
    tanggalBayar: "01/03/2024",
    untuk: "1 bulan",
    jumlahPembayaran: "200,000.00",
    keterangan: "Lorem Ipsum",
    kadaluarsaBerikutnya: "01/04/2024",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrint = () => {
    setIsPrinted(true);
  };

  return (
    <Fragment>
      <div className="m-4">
        <section className="content-header">
          <ContentHeader title={isPrinted ? "Cetak Struk" : "Perpanjang"} />
        </section>

        <section className="mt-4">
          <div className="card shadow-sm">
            <div className="card-body">
              {!isPrinted ? (
                <>
                  {/* FORM INPUT */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold primary-text-color">
                        Nomor Polisi
                      </label>
                      <input
                        type="text"
                        name="noPolisi"
                        className="form-control"
                        placeholder="Nomor Polisi"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold primary-text-color">
                        Nama Pemilik
                      </label>
                      <input
                        type="text"
                        name="namaPemilik"
                        className="form-control"
                        placeholder="Nama Pemilik"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold primary-text-color">
                        Tanggal Masuk
                      </label>
                      <input
                        type="date"
                        name="tanggalMasuk"
                        className="form-control"
                        placeholder="Tanggal Masuk"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold primary-text-color">
                        Tanggal Kadaluarsa
                      </label>
                      <input
                        type="date"
                        name="tanggalKadaluarsa"
                        className="form-control"
                        placeholder="Tanggal Kadaluarsa"
                        onChange={handleChange}
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
                        name="biayaBulanan"
                        className="form-control"
                        placeholder="Biaya Bulanan"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold primary-text-color">
                        Tanggal Bayar
                      </label>
                      <input
                        type="date"
                        name="tanggalBayar"
                        className="form-control"
                        placeholder="Tanggal Bayar"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold primary-text-color">
                        Untuk
                      </label>
                      <input
                        type="text"
                        name="untuk"
                        className="form-control"
                        placeholder="Untuk"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold primary-text-color">
                        Jumlah Pembayaran
                      </label>
                      <input
                        type="text"
                        name="jumlahPembayaran"
                        className="form-control"
                        placeholder="Jumlah Pembayaran"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold primary-text-color">
                        Keterangan
                      </label>
                      <textarea
                        name="keterangan"
                        className="form-control"
                        rows="3"
                        placeholder="Tambahkan keterangan jika ada"
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold primary-text-color">
                        Kadaluarsa Berikutnya
                      </label>
                      <input
                        type="text"
                        name="kadaluarsaBerikutnya"
                        className="form-control"
                        placeholder="Kadaluarsa Berikutnya"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-primary" onClick={handlePrint}>
                      Cetak Struk
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* STRUK */}
                  <div className="border p-3 bg-light">
                    <div className="card-header bg-primary text-white fw-bold">
                      Rincian Struk
                    </div>
                    <div className="card-body table-responsive">
                      <table className="table table-bordered table-hover align-middle text-center">
                        <thead className="table-primary text-center">
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
                          <tr>
                            <td>{formData.noPolisi}</td>
                            <td>{formData.namaPemilik}</td>
                            <td>{formData.tanggalMasuk}</td>
                            <td>{formData.tanggalKadaluarsa}</td>
                            <td>{formData.biayaBulanan}</td>
                            <td>{formData.tanggalBayar}</td>
                            <td>{formData.untuk}</td>
                            <td>{formData.jumlahPembayaran}</td>
                            <td>{formData.keterangan}</td>
                            <td>{formData.kadaluarsaBerikutnya}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-primary">Cetak Struk</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export default Perpanjang;
