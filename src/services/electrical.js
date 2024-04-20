
import {
    GET_BLOG_CONTENT_LIST,
    ADD_BLOG_CONTENT_LIST,
    UPDATE_BLOG_CONTENT_LIST,
    DEL_BLOG_CONTENT_LIST,
    GET_FLOW_LIST,
    ADD_FLOW_LIST,
    GET_FLOW_INFO,
    DEL_FLOW_INFO,
    UPDATE_FLOW_INFO,
    GET_BLOG_LIST,
    ADD_BLOG_INFO,
    GET_BLOG_INFO,
    DEL_BLOG_INFO,
    UPDATE_BLOG_INFO,
} from '@/services/api'
import { request, METHOD } from '@/utils/request'


// 查询工作日志内容列表
export async function getBlogContentList(params) {
    return request(GET_BLOG_CONTENT_LIST, METHOD.POST, params)
}

// 新增工作日志内容
export async function addBlogContentList(params) {
    return request(ADD_BLOG_CONTENT_LIST, METHOD.POST, params)
}
// 修改工作日志内容
export async function updateBlogContentList(params) {
    return request(UPDATE_BLOG_CONTENT_LIST, METHOD.POST, params)
}
// 删除工作日志内容
export async function delBlogContentList(params) {
    return request(DEL_BLOG_CONTENT_LIST, METHOD.POST, params)
}

// 查询项目流程列表
export async function getFlowList(params) {
    return request(GET_FLOW_LIST, METHOD.POST, params)
}

// 新增项目流程列表
export async function addFlowList(params) {
    return request(ADD_FLOW_LIST, METHOD.POST, params)
}

// 查询项目流程信息
export async function getFlowInfo(params) {
    return request(GET_FLOW_INFO, METHOD.POST, params)
}

// 删除项目流程信息
export async function delFlowInfo(params) {
    return request(DEL_FLOW_INFO, METHOD.POST, params)
}

// 更新项目流程信息
export async function updateFlowInfo(params) {
    return request(UPDATE_FLOW_INFO, METHOD.POST, params)
}

// 查询工作日志列表
export async function getBlogList(params) {
    return request(GET_BLOG_LIST, METHOD.POST, params)
}

// 新增工作日志列表
export async function addBlogList(params) {
    return request(ADD_BLOG_INFO, METHOD.POST, params)
}

// 查询工作日志信息
export async function getBlogInfo(params) {
    return request(GET_BLOG_INFO, METHOD.POST, params)
}

// 删除工作日志信息
export async function delBlogInfo(params) {
    return request(DEL_BLOG_INFO, METHOD.POST, params)
}

// 修改工作日志信息
export async function updateBlogInfo(params) {
    return request(UPDATE_BLOG_INFO, METHOD.POST, params)
}


