"use strict";

// Config overrides
process.env.AWS_ACCESS_KEY_ID = "dummyid";
process.env.AWS_SECRET_ACCESS_KEY = "dummyaccesskey";
process.env.AWS_REGION = "us-west-1";

const _ = require("lodash");
const axios = require("axios");
const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB({endpoint: "http://localhost:8000"});
const doc = new AWS.DynamoDB.DocumentClient({endpoint: "http://localhost:8000"});

const url = "http://worldtimeapi.org/api/ip";

const params = {
  AttributeDefinitions: [
    {
      AttributeName: "key",
      AttributeType: "S"
    }
  ],
  KeySchema: [
    {
      AttributeName: "key",
      KeyType: "HASH"
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  TableName: "cache"
};

function calculateTTL(seconds) {
    // TODO: validate empty seconds
    return Math.floor(Date.now() / 1000) + seconds;
}

class DynamoMap {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
  constructor(doc) {
    this.doc = doc;
  }

  async delete(key) {
    let params = {
      TableName: "cache",
      Key: {
        key: key
      }
    }
    let res = await doc.delete(params).promise();
    return res.Item;
  }

  async get(key) {
    let params = {
      TableName: "cache",
      Key: {
        key: key
      }
    };
    let res = await doc.get(params).promise();
    return res.Item;
  }

  async has(key) {
    return !_.isEmpty(await this.get(key));
  }

  async set(key, value) {
    let params = {
      TableName: "cache",
      Item: {
        key: key,
        value: value
        // ttl: calculateTTL(60)
      }
    }
    await doc.put(params).promise();
    return this;
  }
}

async function initialize() {
  console.log("Initialized start");
  let tables = await ddb.listTables().promise();
  if (!tables.TableNames.includes("cache")) {
    await ddb.createTable(params).promise();
  } else {
    console.log("Cache table already in place");
  }
  console.log("Initialized end");
}

async function getRemoteTime() {
  let res = await axios.get(url);
  return res.data;
}

let fetchTime = _.memoize(getRemoteTime);
fetchTime.cache = new DynamoMap(doc);

(async () => {
  await initialize();
  let time = await fetchTime();
  console.log(time);
  // let cache = new DynamoMap(doc);
  // console.log(await cache.has("nothere"));
  // await cache.set("test", "testval");
  // console.log(await cache.has("test"));
  // console.log(await cache.get("test"));
  // console.log(await cache.delete("test"));
  // console.log(await cache.has("test"));
  // console.log(await cache.get("test"));
})();
