// const baseURL = 'http://10.100.10.57:8000'
const baseURL = 'http://10.100.40.89:30001'
const dataURL = baseURL + '/equipment/overControl/getListByDevIdPointName'
const devURL = baseURL + '/equipment/equipment/getEquipmentByCustomerId'
const x_token = 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJ1aWQiOjEyNTIxMjkxOTkzNzI3MDk4ODksImNpZCI6MTAwMDAwMDAsInBpZCI6InN0cmluZyIsImlhdCI6MTU4ODIxMjI3MSwiZXhwIjoxNjI0NTAwMjcxfQ.J7Cp6N0rqdycbF2oUx8HAR3nTXe0xZurrmq8dq0C8tLiWLhsRoog1K5Xyn_HGMm1'

export {
    dataURL, devURL, x_token
}