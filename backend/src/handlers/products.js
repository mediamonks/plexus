module.exports = async function generateCopy({ brandId }) {
	return Object.values(require(`../../data/options/products.json`))
		.filter(product => product.brandId === brandId);
};
