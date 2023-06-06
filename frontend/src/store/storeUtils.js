// === DATA NORMALIZER ===
export const normalizeData = data => {
	const normalized = {};
	for (const obj of data) {
		normalized[obj.id] = obj;
	}
	return normalized;
};
