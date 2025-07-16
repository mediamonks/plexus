module.exports = async (_, { field }) => Object.values(require(`../../config/input-fields.json`)[field]);
