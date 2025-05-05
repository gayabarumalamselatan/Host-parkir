import { Fragment, useState } from "react";
import ContentHeader from "../Layout/ContentHeader";
import Select from "react-select";
import MemberService from "../Services/memberService";
import Swal from "sweetalert2";
import PageLoading from "../Layout/PageLoading";
import StrukService from "../Services/strukService";
import { LogoutExp } from "../Services/expiredToken";

const Perpanjang = () => {

  const initialData = {
    id: 0,
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
  };

  const [isPrinted, setIsPrinted] = useState(false);
  const [perpanjangData, setPerpanjangData] = useState(initialData);
  const [nopolOption, setNopolOption] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const requiredFields = [
    {key: 'nomor_polisi', label: 'Nomor Polisi'},
    {key: 'jangka_waktu', label: 'Jangka Waktu'},
    {key: 'jumlah_pembayaran', label: 'Jumlah Pembayaran'},
  ]

  const fetchData = async () => {
    try {
      const response = await MemberService.fetchMemberService();

      if(response.status === 200){
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
      } else {
        throw response;
      }
    } catch (error) {
      console.error(error)
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

  const autofillMember = (e) => {
    console.log(e)
    if(e){
      setPerpanjangData({
        ...perpanjangData,
        id: e.id,
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

  const handlePerpanjang = async () => {
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
      setErrors({});
      setIsLoading(true);
      
      const memberDataToUpdate = {
        id: perpanjangData.id,
        tanggal_kadaluarsa: perpanjangData.kadaluarsa_berikutnya,
        keterangan: perpanjangData.keterangan,
      }
      const strukData = {
        nomor_polisi: perpanjangData.nomor_polisi,
        nama_pemilik: perpanjangData.nama_pemilik,
        tanggal_masuk: perpanjangData.tanggal_masuk,
        kadaluarsa_sebelumnya : perpanjangData.tanggal_kadaluarsa,
        kadaluarsa_berikutnya: perpanjangData.kadaluarsa_berikutnya,
        tarif_bulanan: perpanjangData.tarif_bulanan,
        tanggal_bayar: perpanjangData.tanggal_bayar,
        jangka_waktu: perpanjangData.jangka_waktu,
        jumlah_pembayaran: perpanjangData.jumlah_pembayaran,
        keterangan  : perpanjangData.keterangan,
        member_id: perpanjangData.id
      }

      try {
        const [updateMember, createStruk] = await Promise.all([
          await MemberService.updateMemberService(memberDataToUpdate),
          await StrukService.createNewStruk(strukData)
        ])
        console.log("gor",MemberService, createStruk);
        if(updateMember.status === 200 && createStruk.status === 201){
          Swal.fire({
            title: "Yes, Berhasil!",
            text: "Member berhasil diperpanjang.",
            icon: 'success',
            confirmButtonText: "OK"
          }).then(() => {
            setPerpanjangData(initialData);
            setIsPrinted(false)
          })
        } else {
          throw {updateMember, createStruk}
        }
      } catch (error) {
        console.error("Error adding member",error);
        if(error.updateMember.response.data.message==="Token is expired" || error.createStruk.response.data.message==="Token is expired"){
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
    }
  }

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
                      {errors.nomor_polisi && <p className="text-danger mt-1 mb-0">{errors.nomor_polisi}</p>}
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                      {errors.jangka_waktu && <p className="text-danger mt-1 mb-0">{errors.jangka_waktu}</p>}
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
                      {errors.jumlah_pembayaran && <p className="text-danger mt-1 mb-0">{errors.jumlah_pembayaran}</p>}
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
                        disabled
                        onChange={handleChange}
                        value={perpanjangData.kadaluarsa_berikutnya}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-3">
                    <button 
                      className="btn btn-primary primary-button-custom rounded-4 border border-0 px-4" 
                      onClick={async () => {
                        const newErrors = {};
                        if(!perpanjangData.nomor_polisi, !perpanjangData.jangka_waktu, !perpanjangData.jumlah_pembayaran){
                          const req = await Swal.fire({
                            title: "Peringatan!",
                            text: "Semua field harus diisi.",
                            icon: 'warning',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'OK'
                          });
                          if(req.isConfirmed){
                            requiredFields.forEach(field => {
                              if (!perpanjangData[field.key]) {
                                newErrors[field.key] = `${field.label} harus diisi.`;
                              }
                            });
                            if (Object.keys(newErrors).length > 0) {
                              setErrors(newErrors);
                            }
                            return
                          }
                        }
                        setErrors({});
                        setIsPrinted(true);
                      }}
                    >
                      Cetak Struk
                    </button>
                  </div>
                  </div>
                    </div>
                  </section>
                </>
              ) : (
                <>
                  {
                    isLoading && <PageLoading/>
                  }

                  <section className="mt-4">
                    <div className="card rounded-custom border border-0 custom-shadow">

                      <div className="card-header primary-button-custom p-3 text-white fw-bold border border-0">
                        <p className="m-0 ms-2">Rincian Struk</p>
                      </div>

                      <div className="mx-4 mt-3">
                        <div className="card-body table-responsive">
                          <table className="table table-hover text-start table-striped" style={{minWidth: 'max-content'}}>
                            <thead>
                              <tr>
                                <th>No. Polisi</th>
                                <th>Nama Pemilik</th>
                                <th>Tanggal Masuk</th>
                                <th>Tanggal Kadaluarsa</th>
                                <th>Biaya Bulanan</th>
                                <th>Tanggal Bayar</th>
                                <th>Jangka Waktu</th>
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
                                <td>{perpanjangData.jangka_waktu} bulan</td>
                                <td>{perpanjangData.jumlah_pembayaran}</td>
                                <td>{perpanjangData.keterangan}</td>
                                <td>{perpanjangData.kadaluarsa_berikutnya}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between px-2 m-4">
                        <button 
                          className="btn btn-primary primary-button-custom rounded-4 border border-0 px-4"
                          onClick={()=>setIsPrinted(false)}
                        >
                          Back
                        </button>
                        <button 
                          className="btn btn-primary primary-button-custom rounded-4 border border-0 px-4"
                          onClick={handlePerpanjang}
                        >
                          Cetak Struk
                        </button>
                      </div>

                    </div>
                  </section>
                </>
              )}
      </div>
    </Fragment>
  );
};

export default Perpanjang;
