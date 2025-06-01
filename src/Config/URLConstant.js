export const SERVICE_BASE = import.meta.env.VITE_SERVICE_BASE

  export const AUTH_LOGIN_SERVICE = `${SERVICE_BASE}/auth-service/login`;
  export const AUTH_REGISTER_SERVICE = `${SERVICE_BASE}/auth-service/regist-user`
  export const USER_SERVICE_BASE = `${SERVICE_BASE}/auth-service/user`;
  export const GET_USER_VIEW = `${SERVICE_BASE}/auth-service/user-view`;

  export const ROLE_SERVICE_BASE = `${SERVICE_BASE}/role-service/role`;

  export const MEMBER_SERVICE_BASE = `${SERVICE_BASE}/member-service/member`;
  export const PAGINATED_MEMBER_SERVICE = `${SERVICE_BASE}/member-service/paginated-member`;
  export const DISABLE_MEMBER_SERVICE = `${SERVICE_BASE}/member-service/delete-member`;

  export const STRUK_SERVICE_BASE = `${SERVICE_BASE}/struk-service`;

  export const JENIS_KENDARAAN_SERVICE = `${SERVICE_BASE}/jenis-kendaraan-service/jenis-kendaraan`

  export const NOTIFICATION_SERVICE = `${SERVICE_BASE}/notification`