const { CloudTasksClient } = require('@google-cloud/tasks').v2;
const config = require('../utils/config');

// const { projectId, location } = config.get();
const { projectId, location } = config.get('tasks');

const client = new CloudTasksClient();

async function create(queue, endpoint, payload) {
	const parent = client.queuePath(projectId, location, queue);
	const url = `https://${location}-${projectId}.cloudfunctions.net/api/${endpoint}`;
  
  return client.createTask({
    parent,
    task: {
      httpRequest: {
        headers: {
          'Content-Type': 'application/json',
        },
        httpMethod: 'POST',
        url,
        body: Buffer.from(JSON.stringify(payload)).toString('base64'),
      }
    }
  });
}

async function delegate(fn, args) {
	await create('delegated-functions', 'delegate', { fn, args });
}

module.exports = {
  create,
	delegate,
};
