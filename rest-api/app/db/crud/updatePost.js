const AWS = require('aws-sdk');

AWS.config.update({
  endpoint: 'http://localhost:8000',
  region: 'us-west-2',
  accessKeyId: 'fakeMyKeyId',
  secretAccessKey: 'fakeSecretAccessKey',
});
const docClient = new AWS.DynamoDB.DocumentClient();

const params = {
  TableName: 'Post',
  Key: {
    id: '63e722ba-6d08-4a4c-a03d-d47ce026f3bd',
  },
  UpdateExpression: 'set title = :t, body = :b',
  ExpressionAttributeValues: {
    ':t': 'update title',
    ':b': 'update body',
  },
};

docClient.update(params, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
});
