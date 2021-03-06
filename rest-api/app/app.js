const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { send } = require('process');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({
  endpoint: 'http://localhost:8000',
  region: 'us-west-2',
  accessKeyId: 'fakeMyKeyId',
  secretAccessKey: 'fakeSecretAccessKey',
});

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

// リクエストのbodyをパースする設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// publicディレクトリを静的ファイル群のルートディレクトリとして設定
app.use(express.static(path.join(__dirname, 'public')));

// Get all users
app.get('/api/v1/users', (req, res) => {
  const params = {
    TableName: 'Users',
  };

  // Check if table exists
  dynamodb.describeTable(params, (err, data) => {
    if (err) {
      // Create Users table
      const params = {
        TableName: 'Users',
        AttributeDefinitions: [
          {
            AttributeName: 'id',
            AttributeType: 'S',
          },
        ],
        KeySchema: [
          {
            AttributeName: 'id',
            KeyType: 'HASH',
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      };
      dynamodb.createTable(params, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      });
    } else {
      // Get all users
      docClient.scan(params, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.json(data.Items);
        }
      });
    }
  });
});

// Get a user
app.get('/api/v1/users/:id', (req, res) => {
  const id = req.params.id;
  const params = {
    TableName: 'Users',
    Key: { id },
  };

  docClient.get(params, (err, data) => {
    if (!data.Item) {
      res.status(404).send({ error: 'Not Found!' });
    } else {
      res.status(200).json(data.Item);
    }
  });
});

// Search users matching keyword
app.get('/api/v1/search', (req, res) => {
  if (req.query.name) {
    const query = req.query.name;
    const params = {
      TableName: 'Users',
      ScanFilter: {
        userName: {
          ComparisonOperator: 'CONTAINS',
          AttributeValueList: [`${query}`],
        },
      },
    };
    docClient.scan(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data.Items);
      }
    });
  } else {
    const query = req.query.mail;
    const params = {
      TableName: 'Users',
      ScanFilter: {
        mail: {
          ComparisonOperator: 'CONTAINS',
          AttributeValueList: [`${query}`],
        },
      },
    };
    docClient.scan(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data.Items);
      }
    });
  }
});

// Create a new user
app.post('/api/v1/users', async (req, res) => {
  if (!req.body.userName || req.body.userName === '') {
    res.status(400).send({ error: 'ユーザ名が指定されていません。' });
  } else if (!req.body.mail || req.body.mail === '') {
    res.status(400).send({ error: 'メールアドレスが指定されていません。' });
  } else {
    const userName = req.body.userName;
    const mail = req.body.mail;
    const profile = req.body.profile ? req.body.profile : '';
    const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : '';

    const params = {
      TableName: 'Users',
      Item: {
        id: uuidv4(),
        userName,
        mail,
        profile,
        date_of_birth: dateOfBirth,
        created_date: new Date().toLocaleString('ja', {
          timeZone: 'Asia/Tokyo',
        }),
        updated_date: new Date().toLocaleString('ja', {
          timeZone: 'Asia/Tokyo',
        }),
      },
    };

    docClient.put(params, (err, data) => {
      if (err) {
        res.status(500).send({ message: 'error' });
      } else {
        res.status(201).send({ message: 'ユーザー情報を登録しました' });
      }
    });
  }
});

// Update user data
app.put('/api/v1/users/:id', async (req, res) => {
  if (!req.body.userName || req.body.userName === '') {
    res.status(400).send({ error: 'ユーザ名が指定されていません。' });
  } else if (!req.body.mail || req.body.mail === '') {
    res.status(400).send({ error: 'メールアドレスが指定されていません。' });
  } else {
    const id = req.params.id;
    const params = {
      TableName: 'Users',
      Key: { id },
    };
    // Get current user data
    docClient.get(params, (err, data) => {
      if (!data.Item) {
        res.status(404).send({ err: '指定されたユーザーが見つかりません。' });
      } else {
        // Define params
        const userName = req.body.userName
          ? req.body.userName
          : data.Item.userName;
        const mail = req.body.mail ? req.body.mail : data.Item.mail;
        const profile = req.body.profile ? req.body.profile : data.Item.profile;
        const dateOfBirth = req.body.date_of_birth
          ? req.body.date_of_birth
          : data.Item.date_of_birth;
        const params = {
          TableName: 'Users',
          Key: { id },
          UpdateExpression:
            'set  userName = :u, mail = :m, profile = :p, date_of_birth = :d, updated_date = :up',
          ExpressionAttributeValues: {
            ':u': userName,
            ':m': mail,
            ':p': profile,
            ':d': dateOfBirth,
            ':up': new Date().toLocaleString('ja', { timeZone: 'Asia/Tokyo' }),
          },
        };
        // Update data
        docClient.update(params, (err, data) => {
          if (err) {
            res.status(500).send({ error: 'error' });
          } else {
            res.status(200).send({ message: 'ユーザー情報を更新しました' });
          }
        });
      }
    });
  }
});

// Delete user data
app.delete('/api/v1/users/:id', async (req, res) => {
  // Get current user
  const id = req.params.id;
  const params = {
    TableName: 'Users',
    Key: { id },
  };

  docClient.get(params, (err, data) => {
    if (!data.Item) {
      res.status(404).send({ err: '指定されたユーザーが見つかりません。' });
    } else {
      docClient.delete(params, (err, data) => {
        if (err) {
          res.status(500).send({ error: 'error' });
        } else {
          res.status(200).send({ message: 'ユーザー情報を削除しました' });
        }
      });
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log('Listen on port:' + port);
