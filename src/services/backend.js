import {
    GET_CLIENT_LIST,
    GET_LOG_LIST,
    GET_OPERATE_LIST,
    GET_MODULE_LIST,
    GET_AUTHORITY_OPERATE,
    GET_AUTHORITY_LIST,
    ADD_AUTHORITY_INFO,
    ADD_AUTHORITY_OPERATE,
    DEL_AUTHORITY_INFO,
    DEL_AUTHORITY_OPERATE,
    DEL_MODUEL_INFO,
    ADD_MODUEL_INFO
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

