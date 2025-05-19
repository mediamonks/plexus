module.exports = async function generateCopy({ option }) {
	return Object.values(require(`../../data/options/${option}.json`));
};
