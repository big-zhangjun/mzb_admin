
import {
    GET_PROJECT_LIST,
    DEL_PROJECT_INFO,
    ADD_PROJECT_INFO,
    GET_PROJECT_INFO,
    EXPORTPROJECTLIST,
    UPDATE_PROJECT_INFO,
    IMPORTPROJECTLIST,
    DEL_PROJECT_FILE,
    GETPROJECTTIPS,
    GET_PROJECT_EP_LIST,
    GET_PROJECT_EP_INFO,
    UPDATE_EP_LIST_INFO,
    EXPORT_EP_LIST,
    UPLOAD_FILE,
    GET_PROJECT_YEAR,
    GET_PROJECT_COUNT,
    GET_PROJECT_BLOG_COUNT,
    GET_EP_ANALYSE,
    UPLOAD_PROJECT_FILE,
    GET_PROJECT_FILE
} from '@/services/api'
import { request, METHOD } from '@/utils/request'


// 查询项目列表
export async function getProjectList(params) {
    return request(GET_PROJECT_LIST, METHOD.POST, params)
}
// 查询项目列表
export async function getProjectEpList(params) {
    return request(GET_PROJECT_EP_LIST, METHOD.POST, params)
}
// 查询项目列表
export async function getProjectEpInfo(params) {
    return request(GET_PROJECT_EP_INFO, METHOD.POST, params)
}

// 删除项目信息
export async function delProjectInfo(params) {
    return request(DEL_PROJECT_INFO, METHOD.POST, params)
}

// 新增项目信息
export async function addProjectInfo(params) {
    return request(ADD_PROJECT_INFO, METHOD.POST, params)
}

// 查询项目信息
export async function getProjectInfo(params) {
    return request(GET_PROJECT_INFO, METHOD.POST, params)
}

// 修改项目信息
export async function updateProjectInfo(params) {
    return request(UPDATE_PROJECT_INFO, METHOD.POST, params)
}
// 导出项目列表
export async function exportProjectList(params) {
    return request(EXPORTPROJECTLIST, METHOD.POST, params)
}
// 导入项目列表
export async function importProjectList(params) {
    return request(IMPORTPROJECTLIST, METHOD.POST, params)
}

// 上传文件
export async function upLoadFile(params) {
    return request(UPLOAD_FILE, METHOD.POST, params)
}
// 查询项目提示
export async function getProjectTips(params) {
    return request(GETPROJECTTIPS, METHOD.POST, params)
}
// 修改清单信息
export async function updateEcListInfo(params) {
    return request(UPDATE_EP_LIST_INFO, METHOD.POST, params)
}
// 导出电气计划
export async function exportEpList(params) {
    return request(EXPORT_EP_LIST, METHOD.POST, params)
}

// 项目数统计
export async function getProjectCount(params) {
    return request(GET_PROJECT_COUNT, METHOD.POST, params)
}

// 查询项目年份
export async function getProjectYear(params) {
    return request(GET_PROJECT_YEAR, METHOD.POST, params)
}

// 日志统计
export async function getProjectBlogCount(params) {
    return request(GET_PROJECT_BLOG_COUNT, METHOD.POST, params)
}

// 电气分析
export async function getEpAnalyse(params) {
    return request(GET_EP_ANALYSE, METHOD.POST, params)
}

// 电气分析
export async function getProjectFile(params) {
    return request(GET_PROJECT_FILE, METHOD.POST, params)
}

// 电气分析
export async function uploadProjectFile(params) {
    return request(UPLOAD_PROJECT_FILE, METHOD.POST, params)
}

// 电气分析
export async function delProjectFile(params) {
    return request(DEL_PROJECT_FILE, METHOD.POST, params)
}
