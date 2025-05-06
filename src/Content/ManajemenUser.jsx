import { Fragment, useEffect, useState } from 'react'
import ContentHeader from '../Layout/ContentHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faEye, faEyeSlash, faRefresh, faTrash, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import UserService from '../Services/userService'
import { Modal } from 'react-bootstrap'
import PageLoading from "../Layout/PageLoading";
import Select from 'react-select'
import Swal from 'sweetalert2'
import { LogoutExp } from '../Services/expiredToken'

const ManajemenUser = () => {
  const initalData = {
    id: 0,
    user_name: '',
    password: '',
    confirm_password: '',
    new_password: '',
    role_id: 0
  };
  const requiredFields = [
    {key: 'user_name', label: 'Username'},
    {key: 'password', label: 'Password'},
    {key: 'confirm_password', label: 'Konfirmasi Password'},
    {key: 'new_password', label: 'Password Baru'},
    {key: 'role_id', label: 'Role'},
  ]
  const [userToCreate, setUserToCreate] = useState(initalData);
  const [isEdit, setIsEdit] = useState (false);
  const [userData, setUserData] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [isChangePass, setIsChangePass] = useState(false);
  const [isExpiredToken, setIsExpiredToken] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState({
    password: false, 
    confirmPassword: false,
    newPassword: false,
  });

  const fetchRoleOption = async () =>{
    try {
      const response = await UserService.fetchRoles();

      if(response.status === 200){
        const mappedOption = response.data.data.map( item => ({
          id: item.ID,
          value: item.ID,
          label: item.Name
        }));
  
        setRoleOptions(mappedOption);
      } else {
        throw response
      }
      
    } catch (error) {
      console.error("Error fetch roles",error);
      if(error.response.data.message === "Token is expired"){
        setIsExpiredToken(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ada yang salah nih!"
        })
      }
    }
  }

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await UserService.fecthUserView();
      
      if(response.status === 200){
        // eslint-disable-next-line no-unused-vars
        const formattedData = response.data.data.map(({ is_logged_in, password, ...rest}) => rest)
        setUserData(formattedData);
      } else {
        throw response
      }
    } catch (error) {
      console.error("Error fetching users",error);
      if(error.response.data.message === "Token is expired"){
        setIsExpiredToken(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ada yang salah nih!"
        })
      }
    } finally {
      setIsLoading(false)
    }
  };

  const headers = userData.length > 0 ? Object.keys(userData[0]).filter(header => header !== 'user_id') : [];

  useEffect(() => {
    fetchUser();
    fetchRoleOption();
  },[]);

  const openModal = (data) => {
    if(data){
      setIsShowModal(true);
      setIsEdit(true);
      autoFillUser(data)
    } else if(!data){
      setIsShowModal(true)
      setIsEdit(false);
    }
  }

  const autoFillUser = (data) => {
    console.log(data);
    setUserToCreate({
      id: data.user_id,
      user_name: data.user_name,
      role_id: roleOptions.find(item => item.label === data.role_name).id
    })
  }

  const closeModal = () => {
    if(isEdit === true){
      setUserToCreate(initalData)
      setIsEdit(false)
    }
    setIsShowModal(false);
  }

  const deleteUser = async (data) => {
    const confirm = await Swal.fire({
      title: "Yakin?",
      text: `User ${data.user_name} akan dihapus.`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Batal',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Hapus',
      reverseButtons: true
    });

    if(confirm.isConfirmed){
      try {
        setIsLoading(true);
        const response = await UserService.deleteUser(data.user_id);
        if(response.status === 200) {
          Swal.fire({
            title: "Yes, Berhasil!",
            text: `User ${data.user_name} berhasil dihapus.`,
            icon: 'success',
            confirmButtonText: "OK"
          }).then(() => {
            fetchUser();
          })
        } else {
         throw response;
        }
      } catch (error) {
        console.error("Error deleting user",error.response.data.message);
        
        if(error.response.data.message === "Token is expired"){
          LogoutExp()
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

  const userSender = async () => {
    if (
      !userToCreate.user_name ||
      !userToCreate.role_id ||
      !userToCreate.password ||
      (!userToCreate.confirm_password && !isEdit ) ||
      (!isEdit && userToCreate.password !== userToCreate.confirm_password) ||
      (isEdit && isChangePass && (userToCreate.new_password !== userToCreate.confirm_password || !userToCreate.new_password))
    ) {
      let alertText = "Semua field harus diisi.";
      let newErrors = {};
    
      requiredFields.forEach(field => {
        if (!userToCreate[field.key]) {
          newErrors[field.key] = `${field.label} harus diisi.`;
        }
      });
    
      if (
        userToCreate.password &&
        userToCreate.confirm_password &&
        userToCreate.password !== userToCreate.confirm_password
      ) {
        newErrors.confirm_password = "Password tidak cocok.";
        alertText = "Password tidak cocok.";
      }
    
      const req = await Swal.fire({
        title: "Peringatan!",
        text: alertText,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    
      if (req.isConfirmed) {
        setErrors(newErrors);
      }
    
      return;
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
      try {
        // eslint-disable-next-line no-unused-vars
        const {id, new_password, confirm_password, ...userToSend} = userToCreate;
        
        let response

        if(isEdit === true){
          // eslint-disable-next-line no-unused-vars
          const {confirm_password, ...userToEdit} = userToCreate
          response = await UserService.updateUser(userToEdit ,userToCreate.id, isChangePass)
        } 
        if(isEdit === false) {
          response = await UserService.registerUser(userToSend);
        }

        if(response.status === 201) {
          Swal.fire({
            title: "Yes, Berhasil!",
            text: "User baru berhasil ditambahkan.",
            icon: 'success',
            confirmButtonText: "OK"
          }).then(() => {
            setUserToCreate(initalData);
            closeModal();
            fetchUser()
          })
        } else if(response.status === 200){
          Swal.fire({
            title: "Yes, Berhasil!",
            text: "User berhasil di update.",
            icon: 'success',
            confirmButtonText: "OK"
          }).then(() => {
            setUserToCreate(initalData);
            closeModal();
            fetchUser()
          })
        } else {
          throw response
        }
      } catch (error) {
        console.error("Error",error);

        if(error.response.data.message === "Token is expired"){
          LogoutExp()
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

  useEffect(()=>{
    if(isExpiredToken){
      LogoutExp();
    }
    console.log("eredi",isExpiredToken)
  },[isExpiredToken])

  console.log(userToCreate)
  console.log("isceng",isChangePass)

  return (
    <Fragment>

      {
        isLoading && <PageLoading/>
      }

      <div className='m-4'>

        <section className='content-header'>
          <ContentHeader title="Manajemen User"/>
        </section>

        <section className="mt-4">
          <div className="card custom-shadow border border-0 rounded-custom">
            <div className="card-body my-3  mx-3">
              <div className="d-flex align-items-center justify-content-end">
                <div className="col-md-6 text-end justify-content-end d-flex gap-2">
                  <button 
                    className="btn primary-text-color"
                    onClick={() => fetchUser()}  
                  >
                    <FontAwesomeIcon icon={faRefresh}/>
                  </button>
                  <button 
                    className='btn btn-primary primary-button-custom rounded-4 px-4 my-auto'
                    onClick={(e) => {
                      e.preventDefault();
                      openModal()
                    }}
                  >
                    <FontAwesomeIcon icon={faUserPlus}/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="mt-4">
          <div className="card rounded-custom border border-0 custom-shadow">
            <div className="card-header primary-button-custom p-3 text-white fw-bold border border-0">   
              <div className="d-flex flex-row justify-content-between">
                <p className="m-0 ms-2">Data User</p>
              </div>
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
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.map((row, index) => (
                    <tr key={index}>
                      <td className="px-3">
                      {index + 1}
                      </td>
                      {headers.map((header) => (
                        <td key={header} className='px-3 py-2'>
                          {row[header] ?? "-"}
                        </td>
                      ))}
                      <td>
                        <div className="d-flex gap-2">

                          <button 
                            onClick={(e) => {
                              e.preventDefault()
                              openModal(row)
                            }}
                            className="btn btn-primary primary-button-custom"
                          >
                            <FontAwesomeIcon icon={faEdit}/>
                          </button>
                          
                          <button 
                            className="btn btn-danger danger-button-custom"
                            onClick={(e) => {
                              e.preventDefault();
                              deleteUser(row)
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash}/>
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
        </section>

      </div>

      {/* Modal */}

      <Modal show={isShowModal} size='lg' centered onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit": "Tambah"} User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>

            {isEdit ? 
            <>
              <div className='col-md-6 mb-3'>
                <label className='form-label fw-semibold primary-text-color'>Username</label>
                <input 
                  type="text" 
                  value={userToCreate.user_name}
                  onChange={(e) => {
                    setUserToCreate({
                      ...userToCreate,
                      user_name: e.target.value,
                    })
                  }}
                  name='user_name'
                  className='form-control'
                  disabled
                />
              </div>

              <div className='col-md-6'>
                <label className='form-label fw-semibold primary-text-color'>Role</label>
                  <Select
                    value={roleOptions.find(item => item.id === userToCreate.role_id)}
                    options={roleOptions}
                    onChange={(e) => {
                      setUserToCreate({
                        ...userToCreate,
                        role_id: e.id
                      })
                    }}
                  />
              </div>
              
              {
                isChangePass ?
                <>

                  <div className='col-md-6 mb-3'>
                    <label className='form-label fw-semibold primary-text-color'>Password Lama</label>
                    <div className='d-flex gap-2'>
                      <input 
                        type={isPasswordVisible.password ? "text" : "password"}
                        name='password'
                        className='form-control'
                        value={userToCreate.password}
                        onChange={(e) => {
                          setUserToCreate({
                            ...userToCreate,
                            password: e.target.value
                          })
                        }}
                      />
                      <button 
                        className='btn btn-primary primary-button-custom'
                        onClick={(e) => {
                          e.preventDefault();
                          setIsPasswordVisible({
                            ...isPasswordVisible,
                            password: !isPasswordVisible.password,
                          })
                        }}
                      >
                        { isPasswordVisible.password ?
                          <FontAwesomeIcon icon={faEye}/>
                          :
                          <FontAwesomeIcon icon={faEyeSlash}/>
                        }
                      </button>
                    </div>
                    {errors.password && <p className="text-danger mt-1 mb-0">{errors.password}</p>}
                  </div>

                  <div className='col-md-6 mb-3'>
                      <label className='form-label fw-semibold primary-text-color'>Password Baru</label>
                      <div className='d-flex gap-2'>
                        <input 
                          type={isPasswordVisible.newPassword ? "text" : "password"}
                          name='password'
                          className='form-control'
                          value={userToCreate.new_password}
                          onChange={(e) => {
                            setUserToCreate({
                              ...userToCreate,
                             new_password: e.target.value
                            })
                          }}
                        />
                        <button 
                          className='btn btn-primary primary-button-custom'
                          onClick={(e) => {
                            e.preventDefault();
                            setIsPasswordVisible({
                              ...isPasswordVisible,
                              newPassword: !isPasswordVisible.newPassword,
                            })
                          }}
                        >
                          { isPasswordVisible.newPassword ?
                            <FontAwesomeIcon icon={faEye}/>
                            :
                            <FontAwesomeIcon icon={faEyeSlash}/>
                          }
                        </button>
                      </div>
                      {errors.new_password && <p className="text-danger mt-1 mb-0">{errors.new_password}</p>}
                    </div>

                    <div className='col-md-6 mb-3'>
                      <label className='form-label fw-semibold primary-text-color'>Konfirmasi Password Baru</label>
                      <div className='d-flex gap-2'>
                        <input 
                          type={isPasswordVisible.confirmPassword ? "text" : "password"}
                          name='password'
                          className='form-control'
                          value={userToCreate.confirm_password}
                          onChange={(e) => {
                            setUserToCreate({
                              ...userToCreate,
                              confirm_password: e.target.value
                            })
                          }}
                        />
                        <button 
                          className='btn btn-primary primary-button-custom'
                          onClick={(e) => {
                            e.preventDefault();
                            setIsPasswordVisible({
                              ...isPasswordVisible,
                              confirmPassword: !isPasswordVisible.confirmPassword,
                            })
                          }}
                        >
                          { isPasswordVisible.confirmPassword ?
                            <FontAwesomeIcon icon={faEye}/>
                            :
                            <FontAwesomeIcon icon={faEyeSlash}/>
                          }
                        </button>
                      </div>
                      {errors.confirm_password && <p className="text-danger mt-1 mb-0">{errors.confirm_password}</p>}
                    </div>
                  </>
                  :
                  <div className='col-md-6 mb-3'>
                <label className='form-label fw-semibold primary-text-color'>Password</label>
                <div className='d-flex gap-2'>
                  <input 
                    type={isPasswordVisible.password ? "text" : "password"}
                    name='password'
                    className='form-control'
                    value={userToCreate.password}
                    onChange={(e) => {
                      setUserToCreate({
                        ...userToCreate,
                        password: e.target.value
                      })
                    }}
                  />
                  <button 
                    className='btn btn-primary primary-button-custom'
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPasswordVisible({
                        ...isPasswordVisible,
                        password: !isPasswordVisible.password,
                      })
                    }}
                  >
                    { isPasswordVisible.password ?
                      <FontAwesomeIcon icon={faEye}/>
                      :
                      <FontAwesomeIcon icon={faEyeSlash}/>
                    }
                  </button>
                </div>
                {errors.password && <p className="text-danger mt-1 mb-0">{errors.password}</p>}
              </div>
              }
            </>
            :
            <>
              <div className='col-md-6 mb-3'>
                <label className='form-label fw-semibold primary-text-color'>Username</label>
                <input 
                  type="text" 
                  value={userToCreate.user_name}
                  onChange={(e) => {
                    setUserToCreate({
                      ...userToCreate,
                      user_name: e.target.value,
                    })
                  }}
                  name='user_name'
                  className='form-control'
                />
                {errors.user_name && <p className="text-danger mt-1 mb-0">{errors.user_name}</p>}
              </div>

              <div className='col-md-6'>
                <label className='form-label fw-semibold primary-text-color'>Role</label>
                  <Select
                    value={roleOptions.find(item => item.id === userToCreate.role_id)}
                    options={roleOptions}
                    onChange={(e) => {
                      setUserToCreate({
                        ...userToCreate,
                        role_id: e.id
                      })
                    }}
                  />
                  {errors.role_id && <p className="text-danger mt-1 mb-0">{errors.role_id}</p>}
              </div>

              <div className='col-md-6 mb-3'>
                <label className='form-label fw-semibold primary-text-color'>Password</label>
                <div className='d-flex gap-2'>
                  <input 
                    type={isPasswordVisible.password ? "text" : "password"}
                    name='password'
                    className='form-control'
                    value={userToCreate.password}
                    onChange={(e) => {
                      setUserToCreate({
                        ...userToCreate,
                        password: e.target.value
                      })
                    }}
                  />
                  <button 
                    className='btn btn-primary primary-button-custom'
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPasswordVisible({
                        ...isPasswordVisible,
                        password: !isPasswordVisible.password,
                      })
                    }}
                  >
                    { isPasswordVisible.password ?
                      <FontAwesomeIcon icon={faEye}/>
                      :
                      <FontAwesomeIcon icon={faEyeSlash}/>
                    }
                  </button>
                </div>
                {errors.password && <p className="text-danger mt-1 mb-0">{errors.password}</p>}
              </div>

              <div className='col-md-6'>
                <label className='form-label fw-semibold primary-text-color'>Konfirmasi Password</label>
                <div className='d-flex gap-2'>
                  <input 
                    type={isPasswordVisible.confirmPassword ? "text" : "password"}
                    name='confirmPassword'
                    className='form-control'
                    value={userToCreate.confirm_password}
                    onChange={(e) => {
                      setUserToCreate({
                        ...userToCreate,
                        confirm_password: e.target.value
                      })
                    }}
                  />
                  <button 
                    className='btn btn-primary primary-button-custom'
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPasswordVisible({
                        ...isPasswordVisible,
                        confirmPassword: !isPasswordVisible.confirmPassword,
                      })
                    }}
                  >
                    { isPasswordVisible.confirmPassword ?
                      <FontAwesomeIcon icon={faEye}/>
                      :
                      <FontAwesomeIcon icon={faEyeSlash}/>
                    }
                  </button>
                </div>
                {errors.confirm_password && <p className="text-danger mt-1 mb-0">{errors.confirm_password}</p>}
              </div>
            </>
            
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          {isEdit ? 
            <>
              <button 
                className='btn btn-secondary secondary-button-custom rounded-4'
                onClick={() => {
                  setErrors({});
                  setUserToCreate({
                    ...userToCreate,
                    password: '',
                    confirm_password: '',
                    new_password: ''
                  })
                }}
              >
                Reset
              </button>
              <button 
                className='btn btn-secondary secondary-button-custom rounded-4'
                onClick={() => setIsChangePass(!isChangePass)}
              >
                {
                  isChangePass ?
                  "Kembali"
                  :
                  "Ganti Password"
                }
              </button>
            </>
            
          :
            <button 
              className='btn btn-secondary secondary-button-custom rounded-4'
              onClick={() => {
                setUserToCreate(initalData)
                setErrors({})
              }}
            >
              Reset
            </button>
          }
          <button 
            className='btn btn-primary primary-button-custom rounded-4'
            onClick={closeModal}
          >
            Close
          </button>
          <button
            className='btn btn-primary primary-button-custom rounded-4'
            onClick={userSender}
          >
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>

    </Fragment>  
  )
}

export default ManajemenUser