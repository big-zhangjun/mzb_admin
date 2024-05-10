import {
  LOGIN, GET_USER_LIST, ADD_USER_INFO, GET_DEPT_LIST, GET_ROLE_LIST, GET_USER_INFO, DEL_USER_INFO, UPDATE_USER_INFO, ADD_DEPT_INFO, DEL_DEPT_INFO,
  GET_DEPT_INFO,
  UPDATE_DEPT_INFO,
  GET_ROLE_INFO,
  ADD_ROLE_INFO,
  DEL_ROLE_INFO,
  UPDATE_ROLE_INFO,
  UPLOAD_USER_AVATAR,
  UPLOAD_USER_PASSWORD
} from '@/services/api'
import { request, METHOD, removeAuthorization } from '@/utils/request'

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */

// 登录
export async function login(name, password) {
  return request(LOGIN, METHOD.POST, {
    userName: name,
    Password: password
  })
}

// 获取用户列表
export async function getUserList(params) {
  return request(GET_USER_LIST, METHOD.POST, {
    ...params
  })
}

// 新增用户
export async function addUserInfo(params) {
  return request(ADD_USER_INFO, METHOD.POST, {
    ...params
  })
}

// 查询部门列表
export async function getDeptList(params) {
  return request(GET_DEPT_LIST, METHOD.POST, {
    ...params
  })
}

// 查询职位列表
export async function getRoleList(params) {
  return request(GET_ROLE_LIST, METHOD.POST, {
    ...params
  })
}

// 查询员工信息
export async function getUserInfo(params) {
  return request(GET_USER_INFO, METHOD.POST, {
    ...params
  })
}

// 删除员工信息
export async function deltUserInfo(params) {
  return request(DEL_USER_INFO, METHOD.POST, {
    ...params
  })
}

// 更新员工信息
export async function updateUserInfo(params) {
  return request(UPDATE_USER_INFO, METHOD.POST, {
    ...params
  })
}

// 新增部门信息
export async function addDeptInfo(params) {
  return request(ADD_DEPT_INFO, METHOD.POST, {
    ...params
  })
}

// 删除部门信息
export async function delDeptInfo(params) {
  return request(DEL_DEPT_INFO, METHOD.POST, {
    ...params
  })
}

// 修改部门信息
export async function updateDeptInfo(params) {
  return request(UPDATE_DEPT_INFO, METHOD.POST, {
    ...params
  })
}

// 查询部门信息
export async function getDeptInfo(params) {
  return request(GET_DEPT_INFO, METHOD.POST, {
    ...params
  })
}


// 新增职位信息
export async function addRoleInfo(params) {
  return request(ADD_ROLE_INFO, METHOD.POST, {
    ...params
  })
}

// 删除职位信息
export async function delRoleInfo(params) {
  return request(DEL_ROLE_INFO, METHOD.POST, {
    ...params
  })
}

// 修改职位信息
export async function updateRoleInfo(params) {
  return request(UPDATE_ROLE_INFO, METHOD.POST, {
    ...params
  })
}

// 查询职位信息
export async function getRoleInfo(params) {
  return request(GET_ROLE_INFO, METHOD.POST, {
    ...params
  })
}

// 换头像
export async function uploadUserAvatar(params) {
  return request(UPLOAD_USER_AVATAR, METHOD.POST, {
    ...params
  })
}
// 换头像
export async function uploadUserPassword(params) {
  return request(UPLOAD_USER_PASSWORD, METHOD.POST, {
    ...params
  })
}


export async function getRoutesConfig() {
  let result = {}
  result.code = 0
  result.data = []
  return result
}
/**
 * 退出登录
 */
export function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
}
export default {
  login,
  logout,
  getRoutesConfig
}
