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
  Item: {
    id: 3,
    userName: 'gold',
    mail: 'gold@e-mail',
    profile: '趣味は相撲です',
    date_of_birth: '9/27',
    created_date: '2021-06-01',
    updated_date: '2021-06-01',
  },
};


