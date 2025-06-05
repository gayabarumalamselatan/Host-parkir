import { Fragment, useEffect, useState } from "react";
import ContentHeader from "../Layout/ContentHeader";
import Swal from "sweetalert2";
import MemberService from "../Services/memberService";
import PageLoading from "../Components/PageLoading";
import { LogoutExp } from "../Services/expiredToken";
import Select from "react-select";
import { useLocation } from "react-router-dom";

const TambahMember = () => {
  const location = useLocation();
  const initialMember = {
    nomor_polisi: location.state?.nomor_polisi || "",
    nama_pemilik: "",
    kendaraan_id: 0,
    warna_kendaraan: '',
    nomor_hp: "",
    tanggal_masuk: new Date().toISOString().split('T')[0],
    tanggal_kadaluarsa: new Date().toISOString().split('T')[0],
    tarif_bulanan: 0,
    jangka_waktu: 0,
    keterangan: "",
  }

  const [memberToCreate, setMemberToCreate] = useState(initialMember)
  const [errors, setErrors] = useState({});
  const [jenisKendaraanOption, setJenisKendaraanOption] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const requiredFields = [
    {key: 'nomor_polisi', label: 'Nomor Polisi'},
    {key: 'nama_pemilik', label: 'Nama Pemilik'},
    {key: 'nomor_hp', label: 'Nomor Hp'},
    {key: 'jangka_waktu', label: 'Jangka Waktu'},
    {key: 'tarif_bulanan', label: 'Tarif Bulanan'},
    {key: 'warna_kendaraan', label: 'Warna Kendaraan'},
    {key: 'kendaraan_id', label: 'Jenis kendaraan'},
  ]

  const fetchJenisKendaraanOption = async () => {
    try {
      const response = await MemberService.fetchJenisKendaraaanService();
      console.log(response)
      if(response.status === 200) {
        const mappedOption = response.data.data.map(item => ({
          id: item.ID,
          label: item.jenis_kendaraan,
          value: item.ID
        }))
        console.log(mappedOption)
        setJenisKendaraanOption(mappedOption);
      } else {
        throw response;
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ada yang salah nih!"
      })
    }
  }

  useEffect(() => {
    fetchJenisKendaraanOption();
  },[])

  const memberSubmit = async () => {
    const newErrors = {};
    
    if(
      !memberToCreate.nomor_polisi,
      !memberToCreate.nama_pemilik,
      !memberToCreate.nomor_hp,
      !memberToCreate.jangka_waktu,
      !memberToCreate.tarif_bulanan,
      !memberToCreate.warna_kendaraan,
      !memberToCreate.kendaraan_id
    ){
      const req = await Swal.fire({
        title: "Peringatan!",
        text: "Semua field harus diisi.",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      if(req.isConfirmed){
        requiredFields.forEach(field => {
          if (!memberToCreate[field.key]) {
            newErrors[field.key] = `${field.label} harus diisi.`;
          }
        });
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
        }
        return; 
      }
    }

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

      // eslint-disable-next-line no-unused-vars
      const {jangka_waktu, ...newMemberToCreate} = memberToCreate;

      try {
        const response = await MemberService.insertMemberService(newMemberToCreate)
        console.log(response)
        if(response.status === 201){
          Swal.fire({
            title: "Yes, Berhasil!",
            text: "Member baru berhasil ditambahkan.",
            icon: 'success',
            confirmButtonText: "OK"
          }).then(() => {
            setMemberToCreate(initialMember)
          })
        } else {
          throw response;
        } 
      } catch (error) {
        console.error("Error adding member", error);
        console.log("error", error)
        if (error.response.data.message === "Token is expired") {
         LogoutExp();
        } else {
          Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Ada yang salah nih!"
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  }

  console.log(memberToCreate)

  return (
    <Fragment>
      <div className="m-4">
        <section className="content-header">
          <ContentHeader title="Tambah Member" />
        </section>

        <section className="mt-4">
          <div className="card custom-shadow border border-0 rounded-custom">
            {
              isLoading ? (
                <PageLoading/>
              ) : (
                <div className="card-body p-4">
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3">
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
                      {errors.nomor_polisi && <p className="text-danger mt-1 mb-0">{errors.nomor_polisi}</p>}
                    </div>

                    <div className="col-md-6 mb-3">
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
                      {errors.nama_pemilik && <p className="text-danger mt-1 mb-0">{errors.nama_pemilik}</p>}
                    </div>

                    <div className="col-md-6 mb-3"> 
                      <label className="form-label fw-semibold primary-text-color">Jenis Kendaraan</label>
                      <Select
                        options={jenisKendaraanOption}
                        value={jenisKendaraanOption.find(option => option.id === memberToCreate.kendaraan_id)}
                        onChange={(e) => {
                          setMemberToCreate({
                            ...memberToCreate,
                            kendaraan_id: e.value
                          })
                        }}
                      />
                      {errors.kendaraan_id && <p className="text-danger mt-1 mb-0">{errors.kendaraan_id}</p>}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold primary-text-color">Warna Kendaraan</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Masukkan warna kendaraan"
                        value={memberToCreate.warna_kendaraan}
                        onChange={(e) => {
                          setMemberToCreate({
                            ...memberToCreate,
                            warna_kendaraan: e.target.value
                          })
                        }}
                      />
                      {errors.warna_kendaraan  && <p className="text-danger mt-1 mb-0">{errors.warna_kendaraan}</p>}
                    </div>

                    <div className="col-md-6 mb-3">
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
                      {errors.nomor_hp && <p className="text-danger mt-1 mb-0">{errors.nomor_hp}</p>}
                    </div>

                    <div className="col-md-6 mb-3">
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
                            tanggal_masuk: e.target.value,
                          })
                        }} 
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold primary-text-color">
                        Jangka Waktu
                      </label>
                      <div className="d-flex flex-row gap-3 w-50">
                        <p className="my-auto">Untuk: </p>
                        <input 
                          type="text" 
                          className="form-control"
                          value={memberToCreate.jangka_waktu}
                          onChange={(e) => {
                            const value = e.target.value;
                            const parsedValue = value ? parseInt(value, 10) : 0
                            const tanggalMasuk = new Date(memberToCreate.tanggal_masuk);
                            tanggalMasuk.setMonth(tanggalMasuk.getMonth() + parsedValue);
                            if(value === '' || !isNaN(parsedValue)){
                              setMemberToCreate({
                                ...memberToCreate,
                                jangka_waktu: parsedValue,
                                tanggal_kadaluarsa: tanggalMasuk.toISOString().split('T')[0] 
                              })
                            }
                          }}
                        />
                        <p className="my-auto">Bulan</p>
                      </div>
                      {errors.jangka_waktu && <p className="text-danger mt-1 mb-0">{errors.jangka_waktu}</p>}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold primary-text-color">
                        Tanggal Kadaluarsa
                      </label>
                      <input 
                        type="date" 
                        className="form-control"
                        value={memberToCreate.tanggal_kadaluarsa}
                        disabled
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold primary-text-color">
                        Biaya Bulanan
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Masukkan biaya bulanan"
                        value={memberToCreate.tarif_bulanan.toLocaleString('en-US')}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d.-]/g, '');
                          const parsedValue = value ? parseInt(value, 10) : 0;
                          if(parsedValue <= 999999999) {
                            setMemberToCreate({
                              ...memberToCreate,
                              tarif_bulanan: parsedValue
                            })
                          }
                        }}
                      />
                      {errors.tarif_bulanan && <p className="text-danger mt-1 mb-0">{errors.tarif_bulanan}</p>}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold primary-text-color">
                        Keterangan
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Tambahkan keterangan jika ada"
                        value={memberToCreate.keterangan}
                        onChange={(e) => {
                          setMemberToCreate({
                            ...memberToCreate,
                            keterangan: e.target.value
                          })
                        }}
                      ></textarea>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-">
                    <button
                      onClick={memberSubmit} 
                      className="btn btn-primary primary-button-custom rounded-4"
                    >
                      Tambah Member
                    </button>
                  </div>
                </div>
              )
            }
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export default TambahMember;
