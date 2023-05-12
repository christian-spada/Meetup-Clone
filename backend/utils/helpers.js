// convert data array to normal obj array
const toJSONArray = data => data.map(obj => obj.toJSON());

module.exports = { toJSONArray };
