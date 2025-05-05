import Swal from "sweetalert2";

export const LogoutExp = async () => {

  const conf = await Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Sesi anda telah expired, Mohon login ulang."
  });

  if(conf.isConfirmed){
    sessionStorage.clear();
    window.location.href="/login";
  }
  return;
}