// const baseURL = 'http://10.100.10.57:8000'
const baseURL = 'http://10.100.40.89:30001'
const dataURL = baseURL + '/equipment/overControl/getListByDevIdPointName'
const devURL = baseURL + '/equipment/equipment/getEquipmentByCustomerId'
// token: this.$route.query.token
const token = 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJ1aWQiOjEyNTIxMjkxOTkzNzI3MDk4ODksImNpZCI6MTAwMDAwMDAsInBpZCI6InN0cmluZyIsImlhdCI6MTU4ODE2MTA1NSwiZXhwIjoxNjI0NDQ5MDU1fQ.JJy2Wj9xY-DGcFORuSrqX0h34jqhRmsIsrU-cfghLx7X2-Vi2ClLifs0wsscwTkJ'

export {
    dataURL, devURL, token
}