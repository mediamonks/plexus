module.exports = async (_, { namespace }) => require('../services/tasks').delegate('ingest', [namespace]);
