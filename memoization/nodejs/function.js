"use strict";

// Config overrides
process.env.AWS_ACCESS_KEY_ID = "dummyid";
process.env.AWS_SECRET_ACCESS_KEY = "dummyaccesskey";
process.env.AWS_REGION = "us-west-1";

const axios = require("axios");
const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB({endpoint: "http://localhost:8000"});
const doc = new AWS.DynamoDB.DocumentClient({endpoint: "http://localhost:8000"});

const url = "http://worldclockapi.com/api/json/est/now";

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
    console.log(`delete ${key}`);
    let params = {
      TableName: "cache",
      Key: {
        key: key
      }
    }
    try {
      let res = await doc.delete(params).promise();
      return res.Item;
    } catch (error) {
      console.log(`Error deleting ${key}: ${error}`);
    }
  }

  async get(key) {
    console.log(`get ${key}`);
    let params = {
      TableName: "cache",
      Key: {
        key: key
      }
    };
    try {
      let res = await doc.get(params).promise();
      if (res.Item != undefined) {
        return res.Item.value;
      } else {
        console.log("Item is undefined");
      }
    } catch (error) {
      console.log(`Error getting ${key}: ${error}`);
    }
    return null;
  }

  async has(key) {
    console.log(`has ${key}`);
    return await this.get(key) == null;
  }

  async set(key, value) {
    console.log(`set ${key} to ${value}`);
    let params = {
      TableName: "cache",
      Item: {
        key: key,
        value: value,
        ttl: calculateTTL(15)
      }
    }
    try {
      await doc.put(params).promise();
    } catch (error) {
      console.log(`Error setting ${key}: ${error}`)
    }
    return this;
  }
}

async function initialize() {
  console.log("Initialized start");
  let tables = await ddb.listTables().promise();
  if (!tables.TableNames.includes("cache")) {
    await ddb.createTable(params).promise();
    await ddb.updateTimeToLive({
      TableName: "cache",
      TimeToLiveSpecification: {
        AttributeName: "ttl",
        Enabled: true
      }
    }).promise();
  } else {
    console.log("Cache table already in place");
  }
  console.log("Initialized end");
}

async function getRemoteTime() {
  console.log("Fetching remote time");
  let res = await axios.get(url);
  return res.data;
}

function memoize(method) {
  let map = new DynamoMap(doc);
  return async function () {
    let args = `${JSON.stringify(arguments)}`;
    console.log(`Checking cache for ${args}`);
    let ret = await map.get(args);
    if (!ret) {
      console.log(`No cache found for ${args}`);
      ret = await method.apply(this, arguments);
      await map.set(args, ret);
    }
    console.log(`Returning ${ret}`);
    return ret;
  };
}

let fetchTime = memoize(getRemoteTime);

(async () => {
  await initialize();
  console.log(await fetchTime());
  console.log(await fetchTime());
  console.log(await fetchTime());
})();
