import { Fragment, useState } from "react";
import ContentHeader from "../Layout/ContentHeader";
import Select from "react-select";
import MemberService from "../Services/memberService";
import Swal from "sweetalert2";
import PageLoading from "../Components/PageLoading";
import StrukService from "../Services/strukService";
import { LogoutExp } from "../Services/expiredToken";
import { Modal } from "react-bootstrap";

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
    kadaluarsa_berikutnya: new Date().toISOString().split('T')[0],
    kode_kupon: "",
    potongan_harga: 0,
    kadaluarsa_kupon: "",
    total_pembayaran: 0
  };

  const [isPrinted, setIsPrinted] = useState(false);
  const [perpanjangData, setPerpanjangData] = useState(initialData);
  const [nopolOption, setNopolOption] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false); 
  const [beriDiskonModal, setBeriDiskonModal] = useState(false);
  const [kuponToCheck, setKuponTocheck] = useState("");
  const [kuponStatusMessage, setKuponStatusMessage] = useState("");
  const [kuponData, setKuponData] = useState({});
  const requiredFields = [
    {key: 'nomor_polisi', label: 'Nomor Polisi'},
    {key: 'jangka_waktu', label: 'Jangka Waktu'},
    {key: 'jumlah_pembayaran', label: 'Jumlah Pembayaran'},
  ]

  const generateToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 12;
    let result = '';
    for(let i = 0; i < length; i++){
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const checkKupon = async (data) => {
    try {
      const response = await StrukService.cekKupon(data);
      if(response.status === 200){
        setKuponStatusMessage("Kupon Berhasil Digunakan");
        const potonganHarga = parseInt(response.data.data[0].potongan_harga, 10) || 0
        perpanjangData.total_pembayaran = parseInt(perpanjangData.tarif_bulanan - ((potonganHarga / 100) * perpanjangData.tarif_bulanan))
        console.log(perpanjangData.total_pembayaran, perpanjangData.tarif_bulanan, response.data.data[0].potongan_harga)
        setKuponData(response.data.data[0])
      } else if (response.data.message === "Kupon has expired"){
        setKuponStatusMessage("Kupon telah expired")
      } else {
        throw response.data
      }
    } catch (error) {
      console.error(error)
      setKuponStatusMessage("Kupon tidak tersedia")
    }
  }

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

      const kadaluarsaKupon = new Date()
      kadaluarsaKupon.setMonth(kadaluarsaKupon.getMonth() + perpanjangData.kadaluarsa_kupon)

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
        member_id: perpanjangData.id,
        kode_kupon: perpanjangData.potongan_harga && perpanjangData.kadaluarsa_kupon ?generateToken() : "",
        potongan_harga: perpanjangData.potongan_harga || 0,
        kadaluarsa_kupon: kadaluarsaKupon.toISOString().split('T')[0]
      }

      perpanjangData.kode_kupon = strukData.kode_kupon

      try {
        const [updateMember, createStruk, editStruk] = await Promise.all([
          await MemberService.updateMemberService(memberDataToUpdate),
          await StrukService.createNewStruk(strukData),
          await StrukService.editStruk(kuponData.id, {is_kupon_used: true})
        ])
        console.log("gor",MemberService, createStruk);
        if(updateMember.status === 200 && createStruk.status === 201 && editStruk.status === 200){
          Swal.fire({
            title: "Yes, Berhasil!",
            text: "Member berhasil diperpanjang.",
            icon: 'success',
            confirmButtonText: "Cetak Struk"
          }).then((result) => {
            if(result.isConfirmed){
              setShowReceiptModal(true)
            }
            // setPerpanjangData(initialData);
            // setIsPrinted(false)
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

  const handlePrint = () => {
    const printContent = document.getElementById("receipt").innerHTML;
    const originalContent = document.body.innerHTML;

    // Replace body content with receipt
    document.body.innerHTML = printContent;

    window.print();

    // Restore original content after printing
    document.body.innerHTML = originalContent;

    // Reload scripts and styles if needed
    window.location.reload();
  };

  

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
                {
                  isLoading ? (
                    <PageLoading/>
                  ) : (
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

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold primary-text-color">Kode Kupon</label>
                          <div className="d-flex gap-2">
                            <input
                              className="form-control"
                              onChange={(e) => setKuponTocheck(e.target.value)}
                              value={kuponToCheck}
                            />
                            <button
                              className="btn btn-primary primary-button-custom rounded-2 border border-0 px-4"
                              onClick={() => checkKupon({kode_kupon: kuponToCheck, nomor_polisi: perpanjangData.nomor_polisi})}
                              disabled = {!(kuponToCheck && perpanjangData.nomor_polisi)}
                             >
                              Gunakan
                            </button>
                          </div>
                          { kuponStatusMessage &&
                            <p className="text-success">{kuponStatusMessage}</p>
                          }
                        </div>
                        <div className="col-md-6">
                          <div className="border rounded p-3 bg-light">
                            <label className="form-label fw-semibold primary-text-color mb-3">
                              Rincian Pembayaran
                            </label>
                            <div className="d-flex justify-content-between mb-2">
                              <div>Biaya Bulanan:</div>
                              <div>{perpanjangData.tarif_bulanan}</div>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <div>Diskon:</div>
                              <div>{kuponData.potongan_harga ? kuponData.potongan_harga : 0} %</div>
                            </div>
                            <div className="d-flex justify-content-between mb-2 fw-bold">
                              <div>Total Pembayaran:</div>
                              <div>{perpanjangData.total_pembayaran}</div>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <div>Jumlah Pembayaran:</div>
                              <div>{perpanjangData.jumlah_pembayaran}</div>
                            </div>
                            { perpanjangData.jumlah_pembayaran > perpanjangData.total_pembayaran &&
                              <div className="d-flex justify-content-between">
                                <div>Kembalian:</div>
                                <div>{perpanjangData.jumlah_pembayaran - perpanjangData.total_pembayaran}</div>
                              </div>
                            }
                            
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-end gap-2 mt-3">
                        <button
                          className="btn btn-primary secondary-button-custom rounded-4 border border-0 px-4"
                          onClick={() => setBeriDiskonModal(true)}
                        >
                          {perpanjangData.kadaluarsa_kupon || perpanjangData.potongan_harga ? 
                            "Reset Diskon": "Berikan Diskon"}
                        </button>

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
                  )
                }
      
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="mt-4">
              <div className="card rounded-custom border border-0 custom-shadow">

                <div className="card-header primary-button-custom p-3 text-white fw-bold border border-0">
                  <p className="m-0 ms-2">Rincian Struk</p>
                </div>

                <div className="mx-4 mt-3">
                  { isLoading ? (
                    <PageLoading/>
                    ):(
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
                    )
                  }
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

            <Modal show={showReceiptModal} onHide={() => setShowReceiptModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Receipt Preview</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div id="receipt">
                  <h4>Receipt</h4>
                  <p><strong>No. Polisi:</strong> {perpanjangData.nomor_polisi}</p>
                  <p><strong>Nama Pemilik:</strong> {perpanjangData.nama_pemilik}</p>
                  <p><strong>Tanggal Masuk:</strong> {perpanjangData.tanggal_masuk}</p>
                  <p><strong>Tanggal Kadaluarsa:</strong> {perpanjangData.tanggal_kadaluarsa}</p>
                  <p><strong>Biaya Bulanan:</strong> {perpanjangData.tarif_bulanan}</p>
                  <p><strong>Tanggal Bayar:</strong> {perpanjangData.tanggal_bayar}</p>
                  <p><strong>Jangka Waktu:</strong> {perpanjangData.jangka_waktu} bulan</p>
                  <p><strong>Jumlah Pembayaran:</strong> {perpanjangData.jumlah_pembayaran}</p>
                  <p><strong>Keterangan:</strong> {perpanjangData.keterangan}</p>
                  <p><strong>Kadaluarsa Berikutnya:</strong> {perpanjangData.kadaluarsa_berikutnya}</p>
                  <p><strong>diskon:</strong> {perpanjangData.kode_kupon}</p>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button className="btn btn-secondary" onClick={() => {
                  setShowReceiptModal(false)
                  setPerpanjangData(initialData)
                  setIsPrinted(false)
                  setKuponData()
                  setKuponTocheck()
                }}>
                  Close
                </button>
                <button className="btn btn-primary" onClick={handlePrint}>
                  Print Receipt
                </button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </div>

      <Modal show={beriDiskonModal} centered onHide={() => setBeriDiskonModal(!beriDiskonModal)}>
        <Modal.Header closeButton>
          <Modal.Title>Berikan Diskon</Modal.Title>
        </Modal.Header>
        <Modal.Body className="row g-3">
          <div className="col-md-6 d-flex flex-column justify-content-between">
            <div className="mb-3">
              <label className="form-label fw-semibold primary-text-color">
                Jumlah Potongan:
              </label>
              <div className="input-group">
                <input 
                  type="text"
                  className="form-control" 
                  value={perpanjangData.potongan_harga}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d.-]/g, '');
                    const parsedValue = value ? parseInt(value, 10) : 0;
                    if(parsedValue <= 999999999) {
                      setPerpanjangData({
                        ...perpanjangData,
                        potongan_harga: parsedValue || 0
                      })
                    }
                  }}
                />
                <span className="input-group-text fw-bold">%</span>
              </div>
            </div>

            <div>
              <label className="form-label fw-semibold primary-text-color">
                Kadaluarsa Kupon:
              </label>
              <div className="input-group">
                <input 
                  type="text"
                  className="form-control" 
                  value={perpanjangData.kadaluarsa_kupon}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d.-]/g, '');
                    const parsedValue = value ? parseInt(value, 10) : 0;
                    if(parsedValue <= 999999999) {
                      setPerpanjangData({
                        ...perpanjangData,
                        kadaluarsa_kupon: parsedValue
                      })
                    }
                  }}
                />
                <span className="input-group-text fw-bold">Bulan</span>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-primary secondary-button-custom rounded-4 border border-0 px-4"
            onClick={() => {
              setPerpanjangData({
                ...perpanjangData,
                potongan_harga: 0,
                kadaluarsa_kupon: 0
              })
            }}
          >
            Reset
          </button>
          <button 
            className="btn btn-primary primary-button-custom rounded-4 border border-0 px-4"
            onClick={() => setBeriDiskonModal(false)}
          >
            Tutup
          </button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default Perpanjang;
