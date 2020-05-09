const baseURL = 'https://api.kunyue2019.com'   // 正式
// const baseURL = 'http://10.100.40.89:30001'  // 测试api
const dataURL = baseURL + '/equipment/overControl/getListByDevIdPointName'
const devURL = baseURL + '/equipment/equipment/getEquipmentByCustomerId'

export {
    dataURL, devURL
}