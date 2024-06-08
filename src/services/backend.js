import {
    GET_CLIENT_LIST,
    GET_LOG_LIST,
    DEL_LOG_INFO,
    GET_OPERATE_LIST,
    GET_MODULE_LIST,
    GET_AUTHORITY_OPERATE,
    GET_AUTHORITY_LIST,
    ADD_AUTHORITY_INFO,
    ADD_AUTHORITY_OPERATE,
    DEL_AUTHORITY_INFO,
    DEL_AUTHORITY_OPERATE,
    DEL_MODUEL_INFO,
    ADD_MODUEL_INFO,
    ADD_NOTICE_INFO,
    GET_NOTICE_LIST,
    UPDATE_MESSAGE_INFO,
    DEL_NOTICE_INFO,
    GET_NOTICE_INFO,
    UPDATE_NOTICE_INFO,
    GET_MESSAGE_LIST,
    UPDATE_MODULE_INFO
} from '@/services/api'
import { request, METHOD } from '@/utils/request'


// 查询客户端列表
export async function getClientList(params) {
    return request(GET_CLIENT_LIST, METHOD.POST, params)
}
// 查询操作日志列表
export async function getLogList(params) {
    return request(GET_LOG_LIST, METHOD.POST, params)
}
// 删除操作日志列表
export async function delLogInfo(params) {
    return request(DEL_LOG_INFO, METHOD.POST, params)
}
// 查询操作列表
export async function getOperaList(params) {
    return request(GET_OPERATE_LIST, METHOD.POST, params)
}
// 查询模块列表
export async function getModuleList(params) {
    return request(GET_MODULE_LIST, METHOD.POST, params)
}
// 查询操作授权列表
export async function getAuthorityOperate(params) {
    return request(GET_AUTHORITY_OPERATE, METHOD.POST, params)
}
// 查询授权模块列表
export async function getAuthorityList(params) {
    return request(GET_AUTHORITY_LIST, METHOD.POST, params)
}
// 新增模块授权
export async function addAuthorityInfo(params) {
    return request(ADD_AUTHORITY_INFO, METHOD.POST, params)
}
// 新增操作授权
export async function addAuthorityOperate(params) {
    return request(ADD_AUTHORITY_OPERATE, METHOD.POST, params)
}
// 删除模块授权
export async function delAuthorityInfo(params) {
    return request(DEL_AUTHORITY_INFO, METHOD.POST, params)
}
// 删除操作授权
export async function delAuthorityOperate(params) {
    return request(DEL_AUTHORITY_OPERATE, METHOD.POST, params)
}
// 删除模块信息
export async function delModuleInfo(params) {
    return request(DEL_MODUEL_INFO, METHOD.POST, params)
}
// 新增模块信息
export async function addModuleInfo(params) {
    return request(ADD_MODUEL_INFO, METHOD.POST, params)
}
// 新增公告信息
export async function addNoticeInfo(params) {
    return request(ADD_NOTICE_INFO, METHOD.POST, params)
}

// 查询公告列表
export async function getNoticeList(params) {
    return request(GET_NOTICE_LIST, METHOD.POST, params)
}

// 删除公告信息
export async function delNoticeInfo(params) {
    return request(DEL_NOTICE_INFO, METHOD.POST, params)
}
// 删除公告信息
export async function getNoticeInfo(params) {
    return request(GET_NOTICE_INFO, METHOD.POST, params)
}

// 修改公告信息
export async function updateNoticeInfo(params) {
    return request(UPDATE_NOTICE_INFO, METHOD.POST, params)
}

// 修改模块信息
export async function updateModuleInfo(params) {
    return request(UPDATE_MODULE_INFO, METHOD.POST, params)
}
// 修改模块信息
export async function getMessageList(params) {
    return request(GET_MESSAGE_LIST, METHOD.POST, params)
}
// 修改模块信息
export async function updateMessageInfo(params) {
    return request(UPDATE_MESSAGE_INFO, METHOD.POST, params)
}