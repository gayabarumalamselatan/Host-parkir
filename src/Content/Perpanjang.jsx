import { Fragment, useState } from "react";
import ContentHeader from "../Layout/ContentHeader";
import Select from "react-select";
import MemberService from "../Services/memberService";

const Perpanjang = () => {

  const initialData = {
    nomor_polisi: "",
    nama_pemilik: "",
    tanggal_masuk: new Date().toISOString().split('T')[0],
    tanggal_kadaluarsa: new Date().toISOString().split('T')[0],
    tarif_bulanan: 0,
    tanggal_bayar: new Date().toISOString().split('T')[0],
    jangka_waktu: 0,
    jumlah_pembayaran: 0,
    keterangan: "",
    kadaluarsa_berikutnya: new Date().toISOString().split('T')[0]
  }

  const [isPrinted, setIsPrinted] = useState(false);
  const [perpanjangData, setPerpanjangData] = useState(initialData);
  const [nopolOption, setNopolOption] = useState([]);

  const fetchData = async () => {
    try {
      const response = await MemberService.fetchMemberService();

      const mappedOption = response.data.data.map(item => ({
        id: item.id,
        value: item.nomor_polisi,
        label: item.nomor_polisi,
        nama_pemilik: item.nama_pemilik,
        tanggal_masuk: item.tanggal_masuk,
        tanggal_kadaluarsa: item.tanggal_kadaluarsa,
        tarif_bulanan: item.tarif_bulanan,
        keterangan: item.keterangan
      }))

      setNopolOption(mappedOption)
    } catch (error) {
      console.error(error)
    }
  }

  const autofillMember = (e) => {
    console.log(e)
    if(e){
      setPerpanjangData({
        ...perpanjangData,
        nomor_polisi: e.value,
        nama_pemilik: e.nama_pemilik,
        tanggal_masuk: e.tanggal_masuk,
        tanggal_kadaluarsa: e.tanggal_kadaluarsa,
        tarif_bulanan: e.tarif_bulanan,
        keterangan: e.keterangan,
      })
    } else {
      setPerpanjangData(initialData)
    }
  }

  useState(() => {
    fetchData()
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerpanjangData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrint = () => {
    setIsPrinted(true);
  };

  console.log(perpanjangData)

  return (
    <Fragment>
      <div className="m-4">
        <section className="content-header">
          <ContentHeader title={isPrinted ? "Cetak Struk" : "Perpanjang"} />
        </section>

        {!isPrinted ? (
        <>
        <section className="mt-4">
          <div className="card custom-shadow border border-0 rounded-custom">
            <div className="card-body p-4">

                  {/* FORM INPUT */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold primary-text-color">
                        Nomor Polisi
                      </label>
                      <Select
                        options={nopolOption}
                        value={nopolOption.find(option => option.value === perpanjangData.nomor_polisi)}
                        onChange={(e) => autofillMember(e)}
                        isClearable
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
                        value={perpanjangData.nama_pemilik}
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
                        value={perpanjangData.tanggal_masuk}
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
                        value={perpanjangData.tanggal_kadaluarsa}
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
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d.-]/g, '');
                          const parsedValue = value ? parseInt(value, 10) : 0;
                          if(parsedValue <= 999999999) {
                            setPerpanjangData({
                              ...perpanjangData,
                              tarif_bulanan: parsedValue
                            })
                          }
                        }}
                        value={(perpanjangData.tarif_bulanan || 0).toLocaleString('en-US')}
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
                        onChange={(e) => {
                          const value = e.target.value;
                          setPerpanjangData({
                            ...perpanjangData,
                            tanggal_bayar: value 
                          })
                        }}
                        value={perpanjangData.tanggal_bayar}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold primary-text-color">
                        Jangka Waktu
                      </label>
                      <div className="d-flex flex-row gap-3 w-50">
                        <p className="my-auto">Untuk: </p>
                        <input
                          type="text"
                          name="untuk"
                          className="form-control"
                          onChange={(e)=>{
                            const value = e.target.value;
                            const parsedValue = value ? parseInt(value, 10) : 0
                            const tanggalKadaluarsa = new Date(perpanjangData.tanggal_kadaluarsa);
                            tanggalKadaluarsa.setMonth(tanggalKadaluarsa.getMonth() + parsedValue);
                            if(value === '' || !isNaN(parsedValue)){
                              setPerpanjangData({
                                ...perpanjangData,
                                jangka_waktu: parsedValue,
                                kadaluarsa_berikutnya: tanggalKadaluarsa.toISOString().split('T')[0]
                              })
                            }
                          }}
                          value={perpanjangData.jangka_waktu}
                        />
                        <p className="my-auto">Bulan</p>
                      </div>
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
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d.-]/g, '');
                          const parsedValue = value ? parseInt(value, 10) : 0;
                          if(parsedValue <= 999999999) {
                            setPerpanjangData({
                              ...perpanjangData,
                              jumlah_pembayaran: parsedValue
                            })
                          }
                        }}
                        value={(perpanjangData.jumlah_pembayaran || 0).toLocaleString('en-US')}
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
                        value={perpanjangData.keterangan}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold primary-text-color">
                        Kadaluarsa Berikutnya
                      </label>
                      <input
                        type="date"
                        name="kadaluarsaBerikutnya"
                        className="form-control"
                        placeholder="Kadaluarsa Berikutnya"
                        onChange={handleChange}
                        value={perpanjangData.kadaluarsa_berikutnya}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-primary" onClick={handlePrint}>
                      Cetak Struk
                    </button>
                  </div>
                  </div>
                    </div>
                  </section>
                </>
              ) : (
                <>
                  {/* STRUK */}

                  <section className="mt-4">
                    <div className="card rounded-custom border border-0 custom-shadow">

                      <div className="card-header primary-button-custom p-3 text-white fw-bold border border-0">
                        <p className="m-0 ms-2">Rincian Struk</p>
                      </div>

                      <div className="card-body table-responsive p-4">
                        <table className="table table-hover text-start">
                          <thead>
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
                              <td>{perpanjangData.nomor_polisi}</td>
                              <td>{perpanjangData.nama_pemilik}</td>
                              <td>{perpanjangData.tanggal_masuk}</td>
                              <td>{perpanjangData.tanggal_kadaluarsa}</td>
                              <td>{perpanjangData.tarif_bulanan}</td>
                              <td>{perpanjangData.tanggal_bayar}</td>
                              <td>{perpanjangData.jangka_waktu}</td>
                              <td>{perpanjangData.jumlah_pembayaran}</td>
                              <td>{perpanjangData.keterangan}</td>
                              <td>{perpanjangData.kadaluarsa_berikutnya}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                      <button className="btn btn-primary">Cetak Struk</button>
                    </div>

                  </section>
                </>
              )}
      </div>
    </Fragment>
  );
};

export default Perpanjang;
