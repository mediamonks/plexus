module.exports = async (_, { namespace }) => require('../services/tasks').delegate('ingest.ingestAll', [namespace]);
