// convert data array to normal obj array
const toJSONArray = data => data.map(obj => obj.toJSON());

// === SEND 404 - ENTITY NOT FOUND ===
const entityNotFound = (res, entity) => {
	res.status(404);
	res.json({ message: `${entity} couldn't be found` });
};

module.exports = { toJSONArray, entityNotFound };
