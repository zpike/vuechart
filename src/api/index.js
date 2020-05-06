// const baseURL = 'http://10.100.10.57:8000'
const baseURL = 'http://10.100.40.89:30001'
const dataURL = baseURL + '/equipment/overControl/getListByDevIdPointName'
const devURL = baseURL + '/equipment/equipment/getEquipmentByCustomerId'
const x_token = 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJ1aWQiOjEyNTIxMjkxOTkzNzI3MDk4ODksImNpZCI6MTAwMDAwMDAsInBpZCI6InN0cmluZyIsImlhdCI6MTU4ODcyOTI4OSwiZXhwIjoxNjI1MDE3Mjg5fQ.jik4qY5vDyClCtdMYW4WdnJdL2XF64f0LBaTVfsYN2tv0PG9367b5Ex7Cl0PfSWW'

export {
    dataURL, devURL, x_token
}