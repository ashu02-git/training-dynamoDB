const AWS = require('aws-sdk');

AWS.config.update({
  endpoint: 'http://localhost:8000',
  region: 'us-west-2',
  accessKeyId: 'fakeMyKeyId',
  secretAccessKey: 'fakeSecretAccessKey',
});
const docClient = new AWS.DynamoDB.DocumentClient();

const params = {
  TableName: 'Users',
  Key: {
    id: 3,
  },
};

docClient.delete(params, function (err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
});
