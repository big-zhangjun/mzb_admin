//跨域代理前缀
const API_PROXY_PREFIX='/api'
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  LOGIN: `${BASE_URL}/user/login`, // 登录
  ROUTES: `${BASE_URL}/routes`,
  GET_USER_LIST: `${BASE_URL}/user/get_user_list`, // 获取员工列表
  ADD_USER_INFO: `${BASE_URL}/user/add_user_info`, // 新增员工
  GET_DEPT_LIST: `${BASE_URL}/dept/get_dept_list`, // 查询部门列表
  GET_ROLE_LIST: `${BASE_URL}/role/get_role_list`, // 查询职位列表
  GET_USER_INFO: `${BASE_URL}/user/get_user_info`, // 查询员工信息
  DEL_USER_INFO: `${BASE_URL}/user/del_user_info`, // 删除员工信息
  UPDATE_USER_INFO: `${BASE_URL}/user/update_user_info`, // 更新员工信息
  ADD_DEPT_INFO: `${BASE_URL}/dept/add_dept_info`, // 新增部门信息
  DEL_DEPT_INFO: `${BASE_URL}/dept/del_dept_info`, // 新增部门信息
  GET_DEPT_INFO: `${BASE_URL}/dept/get_dept_info`, // 查询部门信息
  UPDATE_DEPT_INFO: `${BASE_URL}/dept/update_dept_info`, // 修改部门信息
  ADD_ROLE_INFO: `${BASE_URL}/role/add_role_info`, // 新增职位信息
  GET_ROLE_INFO: `${BASE_URL}/role/get_role_info`, // 查询职位信息
  DEL_ROLE_INFO: `${BASE_URL}/role/del_role_info`, // 删除职位信息
  UPDATE_ROLE_INFO: `${BASE_URL}/role/update_role_info`, // 修改职位信息
  GET_CLIENT_LIST: `${BASE_URL}/log/get_client_list`, // 查询客户端列表
  GET_LOG_LIST: `${BASE_URL}/log/get_log_list`, // 查询操作日志列表
  GET_OPERATE_LIST: `${BASE_URL}/auth/get_operate_list`, // 查询操作列表
  GET_MODULE_LIST: `${BASE_URL}/module/get_module_list`, // 查询模块列表
  GET_AUTHORITY_OPERATE: `${BASE_URL}/auth/get_authority_operate`, // 查询操作授权列表
  GET_AUTHORITY_LIST: `${BASE_URL}/auth/get_authority_list`, // 查询授权模块列表
  ADD_AUTHORITY_INFO: `${BASE_URL}/auth/add_authority_info`, // 新增模块授权
  ADD_AUTHORITY_OPERATE: `${BASE_URL}/auth/add_authority_operate`, // 新增操作授权
  DEL_AUTHORITY_INFO: `${BASE_URL}/auth/del_authority_info`, // 删除模块授权
  DEL_AUTHORITY_OPERATE: `${BASE_URL}/auth/del_authority_operate`, // 删除操作授权
  DEL_MODUEL_INFO: `${BASE_URL}/module/del_module_info`, // 删除模块信息
  ADD_MODUEL_INFO: `${BASE_URL}/module/add_module_info`, // 新增模块信息
}

