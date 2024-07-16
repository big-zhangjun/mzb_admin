//跨域代理前缀
const API_PROXY_PREFIX='/api'
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  LOGIN: `${BASE_URL}/user/login`, // 登录
  ROUTES: `${BASE_URL}/routes`,
  GET_USER_LIST: `${BASE_URL}/user/get_user_list`, // 获取员工列表
  GET_USER_LIST_S: `${BASE_URL}/user/get_user_list2`, // 获取员工列表
  ADD_USER_INFO: `${BASE_URL}/user/add_user_info`, // 新增员工
  GET_DEPT_LIST: `${BASE_URL}/dept/get_dept_list`, // 查询部门列表
  GET_DEPT_LIST_S: `${BASE_URL}/dept/get_dept_list2`, // 查询部门列表
  GET_ROLE_LIST: `${BASE_URL}/role/get_role_list`, // 查询职位列表
  GET_ROLE_LIST_S: `${BASE_URL}/role/get_role_list2`, // 查询职位列表
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
  DEL_LOG_INFO: `${BASE_URL}/log/del_log_info`, // 删除操作日志列表
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
  GET_PROJECT_LIST: `${BASE_URL}/project/get_project_list`, // 新增模块信息
  DEL_PROJECT_INFO: `${BASE_URL}/project/del_project_info`, // 删除项目信息
  ADD_PROJECT_INFO: `${BASE_URL}/project/add_project_info`, // 新增项目信息
  GET_PROJECT_INFO: `${BASE_URL}/project/get_project_info`, //查询项目信息
  UPDATE_PROJECT_INFO: `${BASE_URL}/project/update_project_info`, //查询项目信息
  GET_BLOG_CONTENT_LIST: `${BASE_URL}/blog/get_blog_content_list`, //查询工作日志内容列表
  ADD_BLOG_CONTENT_LIST: `${BASE_URL}/blog/add_blog_content`, //新增工作日志内容
  DEL_BLOG_CONTENT_LIST: `${BASE_URL}/blog/del_blog_content`, //删除工作日志内容
  UPDATE_BLOG_CONTENT_LIST: `${BASE_URL}/blog/update_blog_content`, //修改工作日志内容
  GET_FLOW_LIST: `${BASE_URL}/flow/get_flow_list`, //查询项目流程列表
  ADD_FLOW_LIST: `${BASE_URL}/flow/add_flow_info`, //新增项目流程列表
  GET_FLOW_INFO: `${BASE_URL}/flow/get_flow_info`, //查询项目流程信息
  DEL_FLOW_INFO: `${BASE_URL}/flow/del_flow_info`, //删除项目流程信息 
  UPDATE_FLOW_INFO: `${BASE_URL}/flow/update_flow_info`, //更新项目流程信息 
  GET_BLOG_LIST: `${BASE_URL}/blog/get_blog_list`, //查询工作日志列表
  ADD_BLOG_INFO: `${BASE_URL}/blog/add_blog_info`, //新增工作日志列表
  GET_BLOG_INFO: `${BASE_URL}/blog/get_blog_info`, //查询工作日志信息
  DEL_BLOG_INFO: `${BASE_URL}/blog/del_blog_info`, //删除工作日志信息 
  UPDATE_BLOG_INFO: `${BASE_URL}/blog/update_blog_info`, //修改工作日志信息
  ADDECREP: `${BASE_URL}/project/add_ec_rep`, //新增电柜负责人
  DELECREP: `${BASE_URL}/project/del_ec_rep`, //删除电柜负责人
  UPDATEECINFO: `${BASE_URL}/project/update_ec_info`, //修改电柜信息  
  ADDSIREP: `${BASE_URL}/project/add_si_rep`, //新增安装信息  
  DELSIREP: `${BASE_URL}/project/del_si_rep`, //删除安装信息  
  UPDATESIINFO: `${BASE_URL}/project/update_si_info`, //修改安装信息  
  ADDASREP: `${BASE_URL}/project/add_as_rep`, //新增售后信息  
  DELASREP: `${BASE_URL}/project/del_as_rep`, //删除售后信息  
  UPDATEASINFO: `${BASE_URL}/project/update_as_info`, //修改售后信息  
  EXPORTPROJECTLIST: `${BASE_URL}/project/export_project_list`, //导出项目列表
  IMPORTPROJECTLIST: `${BASE_URL}/project/import_project_list`, //导入项目列表
  GETPROJECTTIPS: `${BASE_URL}/project/get_project_tips`, //查询项目提示
  GET_PROJECT_EP_LIST: `${BASE_URL}/project/get_ep_list`, //查询项目提示
  GET_PROJECT_EP_INFO: `${BASE_URL}/project/get_ep_info`, //查询项目提示
  UPDATE_EP_LIST_INFO: `${BASE_URL}/project/update_ep_list_info`, //修改清单信息
  EXPORT_EP_LIST: `${BASE_URL}/project/export_ep_list`, //导出电气计划
  ADD_NOTICE_INFO: `${BASE_URL}/notice/add_notice_info`, //新增公告信息
  GET_NOTICE_LIST: `${BASE_URL}/notice/get_notice_list`, //查询公告列表
  DEL_NOTICE_INFO: `${BASE_URL}/notice/del_notice_info`, //删除公告信息
  GET_NOTICE_INFO: `${BASE_URL}/notice/get_notice_info`, //查询公告信息
  UPDATE_NOTICE_INFO: `${BASE_URL}/notice/update_notice_info`, //修改公告信息
  UPLOAD_FILE: `${BASE_URL}/disk/upload_file`, //上传附件
  UPLOAD_USER_AVATAR: `${BASE_URL}/user/upload_user_avatar`, //更换头像
  UPLOAD_USER_PASSWORD: `${BASE_URL}/user/update_user_password`, //修改密码
  GETUSERLOCATION: `${BASE_URL}/statistics/user_location`, //外出地区分布
  GET_PROJECT_COUNT: `${BASE_URL}/statistics/project_count`, //项目数统计
  GET_PROJECT_YEAR: `${BASE_URL}/statistics/project_year`, //查询项目年份
  GET_PROJECT_BLOG_COUNT: `${BASE_URL}/statistics/blog_count`, //日志统计
  GET_EP_ANALYSE: `${BASE_URL}/statistics/ep_analyse`, //电气分析
  UPDATE_ROLE_AUTH: `${BASE_URL}/role/update_role_auth`, //修改职位权限
  UPDATE_MODULE_INFO: `${BASE_URL}/module/update_module_info`, //修改职位权限
  GET_MESSAGE_LIST: `${BASE_URL}/message/get_message_list`, //消息列表
  UPDATE_MESSAGE_INFO: `${BASE_URL}/message/update_message_info`, //消息列表
  GET_PROJECT_FILE: `${BASE_URL}/project/get_project_file`, //消息列表
  UPLOAD_PROJECT_FILE: `${BASE_URL}/project/upload_project_file`, //消息列表
  DEL_PROJECT_FILE: `${BASE_URL}/project/del_project_file`, //消息列表
  UPDATE_USER_CONFIG: `${BASE_URL}/user/update_user_config`, //消息列表
  UPDATE_CONFIG_INFO: `${BASE_URL}/config/update_config_info`, //消息列表
  GET_CONFIG_INFO: `${BASE_URL}/config/get_config_info`, //消息列表
  GET_BLOG_LIST2: `${BASE_URL}/blog/get_blog_list2`, //消息列表
  UPDDATE_EP_INFO: `${BASE_URL}/project/update_ep_info`, //消息列表
  GET_MATERIAL_GROUP_LIST: `${BASE_URL}/shotage/get_material_group_list`, //查询物料组列表
  GET_SHOTAGE_LIST: `${BASE_URL}/shotage/get_shotage_list`, //查询缺料报备列表
  GET_SHOTAGE_INFO: `${BASE_URL}/shotage/get_shotage_info`, //查询缺料报备信息
  DEL_SHOTAGE_INFO: `${BASE_URL}/shotage/delete_shotage_info`, //删除缺料报备信息
  GET_MATERIAL_LIST: `${BASE_URL}/shotage/get_material_list`, //查询缺料报备信息
  GET_MATERIAL_SHOT_LIST: `${BASE_URL}/shotage/get_material_shot_list`, //删除缺料报备信息
  ADD_MATERIAL_SHOT_INFO: `${BASE_URL}/shotage/add_material_shot_info`, //新增缺料报备信息
  DEL_MATERIAL_SHOT_INFO: `${BASE_URL}/shotage/delete_material_shot_info`, //新增缺料报备信息
}