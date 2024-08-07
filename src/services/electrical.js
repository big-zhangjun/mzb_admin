
import {
    GET_BLOG_CONTENT_LIST,
    ADD_BLOG_CONTENT_LIST,
    UPDATE_BLOG_CONTENT_LIST,
    UPDATE_SHOT_INFO,
    ADD_MATERIAL_SHOT_INFO,
    DEL_BLOG_CONTENT_LIST,
    GET_FLOW_LIST,
    GET_SHOTAGE_LIST,
    ADD_FLOW_LIST,
    GET_FLOW_INFO,
    DEL_FLOW_INFO,
    UPDATE_FLOW_INFO,
    GET_BLOG_LIST,
    GET_FILE_INFO,
    LOCK_SHOTAGE_INFO,
    ADD_BLOG_INFO,
    GET_MEMO_LIST,
    GET_BLOG_INFO,
    DEL_BLOG_INFO,
    UPDATE_BLOG_INFO,
    UPDATEECINFO,
    ADDECREP,
    DELECREP,
    UPDATESIINFO,
    ADDSIREP,
    DELSIREP,
    ADDASREP,
    DELASREP,
    UPDATEASINFO,
    GET_BLOG_LIST2,
    UPDDATE_EP_INFO,
    GET_MATERIAL_LIST,
    GET_MATERIAL_GROUP_LIST,
    GET_MATERIAL_SHOT_INFO,
    UPDATE_MATERIAL_SHOT_INFO,
    GET_MATERIAL_SHOT_LIST,
    DEL_SHOTAGE_INFO,
    DEL_MATERIAL_SHOT_INFO,
    GET_SHOTAGE_INFO,
    ADD_SHOT_INFO,
    GET_UNLIMITED_QRCODE,

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

// 新增电柜负责人
export async function addEcRep(params) {
    return request(ADDECREP, METHOD.POST, params)
}

// 删除电柜负责人
export async function delEcRep(params) {
    return request(DELECREP, METHOD.POST, params)
}

// 修改电柜信息
export async function updateEcInfo(params) {
    return request(UPDATEECINFO, METHOD.POST, params)
}

// 新增安装负责人
export async function addSiRep(params) {
    return request(ADDSIREP, METHOD.POST, params)
}

// 删除安装负责人
export async function delSiRep(params) {
    return request(DELSIREP, METHOD.POST, params)
}

// 修改安装信息
export async function updateSiInfo(params) {
    return request(UPDATESIINFO, METHOD.POST, params)
}

// 新增售后负责人
export async function addAsRep(params) {
    return request(ADDASREP, METHOD.POST, params)
}

// 删除售后负责人
export async function delAsRep(params) {
    return request(DELASREP, METHOD.POST, params)
}

// 修改售后信息
export async function updateAsInfo(params) {
    return request(UPDATEASINFO, METHOD.POST, params)
}

// 修改售后信息
export async function getBlogList2(params) {
    return request(GET_BLOG_LIST2, METHOD.POST, params)
}

export async function updateEpInfo(params) {
    return request(UPDDATE_EP_INFO, METHOD.POST, params)
}

// 查询物料组列表
export async function getMaterialGroupList(params) {
    return request(GET_MATERIAL_GROUP_LIST, METHOD.POST, params)
}

// 查询物料组列表
export async function getShotageList(params) {
    return request(GET_SHOTAGE_LIST, METHOD.POST, params)
}

export async function getShotageInfo(params) {
    return request(GET_SHOTAGE_INFO, METHOD.POST, params)
}

export async function delShotageInfo(params) {
    return request(DEL_SHOTAGE_INFO, METHOD.POST, params)
}
export async function getMaterialList(params) {
    return request(GET_MATERIAL_LIST, METHOD.POST, params)
}
export async function getMaterialShotList(params) {
    return request(GET_MATERIAL_SHOT_LIST, METHOD.POST, params)
}
export async function addMaterialShotInfo(params) {
    return request(ADD_MATERIAL_SHOT_INFO, METHOD.POST, params)
}
export async function delMaterialShotInfo(params) {
    return request(DEL_MATERIAL_SHOT_INFO, METHOD.POST, params)
}
export async function updateMaterialShotInfo(params) {
    return request(UPDATE_MATERIAL_SHOT_INFO, METHOD.POST, params)
}
export async function getMaterialShotInfo(params) {
    return request(GET_MATERIAL_SHOT_INFO, METHOD.POST, params)
}
export async function updateShotInfo(params) {
    return request(UPDATE_SHOT_INFO, METHOD.POST, params)
}
export async function addShotInfo(params) {
    return request(ADD_SHOT_INFO, METHOD.POST, params)
}
export async function getFileInfo(params) {
    return request(GET_FILE_INFO, METHOD.POST, params)
}
export async function getUnlimitedQRCode(params) {
    return request(GET_UNLIMITED_QRCODE, METHOD.POST, params)
}
export async function lockShotageInfo(params) {
    return request(LOCK_SHOTAGE_INFO, METHOD.POST, params)
}
export async function getMemoList(params) {
    return request(GET_MEMO_LIST, METHOD.POST, params)
}


