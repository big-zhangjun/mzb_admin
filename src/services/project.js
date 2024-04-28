
import {
    GET_PROJECT_LIST,
    DEL_PROJECT_INFO,
    ADD_PROJECT_INFO,
    GET_PROJECT_INFO,
    EXPORTPROJECTLIST,
    UPDATE_PROJECT_INFO,
    IMPORTPROJECTLIST
} from '@/services/api'
import { request, METHOD } from '@/utils/request'


// 查询项目列表
export async function getProjectList(params) {
    return request(GET_PROJECT_LIST, METHOD.POST, params)
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
