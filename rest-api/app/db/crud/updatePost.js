const AWS = require('aws-sdk');

AWS.config.update({
  endpoint: 'http://localhost:8000',
  region: 'us-west-2',
  accessKeyId: 'fakeMyKeyId',
  secretAccessKey: 'fakeSecretAccessKey',
});
const docClient = new AWS.DynamoDB.DocumentClient();

let params = {
  TableName: 'Users',
  Key: {
    id: 3,
  },
  UpdateExpression: 'set userName = :u, profile = :p',
  ExpressionAttributeValues: {
    ':u': '金太郎',
    ':p': 'update profile',
  },
  ReturnValues: 'UPDATED_NEW',
};

docClient.update(params, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
});
