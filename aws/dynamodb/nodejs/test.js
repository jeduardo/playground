#!/usr/bin/env node

"use strict";

const AWS = require("aws-sdk");
const _ = require("lodash");

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});


const url = "https://test.com/";
const tableName = "pagecache";
let docClient = new AWS.DynamoDB.DocumentClient();


async function fetch(url) {
    let params = {
        TableName: tableName,
        Key: {
            "url": url
        }
    };
    return await docClient.get(params).promise();
}

function sleep(amount) {
    return new Promise(resolve => setTimeout(resolve, amount));
}

function futureDate(seconds) {
    return Math.floor(Date.now() / 1000) + seconds;
}

(async () => {
    console.log("# Looking into existing item");
    // try to look for new item
    let val = fetch(url);
    if (_.isEmpty(val)) {
        console.log("Item not found, as expected");
    }
    // create new item
    let params = {
        TableName: tableName,
        Item: {
            "url": url,
            "content": "<html><!-- sample item here --></html>",
        }
    };
    await docClient.put(params).promise();
    console.log("Item added to table");


    // fetch new item
    console.log("# Looking into item just added into table");
    val = await fetch(url);
    if (!_.isEmpty(val)) {
        console.log("Item found in table, as expected");
        console.log(val);
    } else {
        console.error("Item not found in table");
    }

    // update new item
    console.log("# Updating existing item");
    params = {
        TableName: tableName,
        Key: {
            "url": url
        },
        UpdateExpression: "set content = :content",
        ExpressionAttributeValues: {
            ":content": "updated content"
        },
        ReturnValues: "UPDATED_NEW"
    }

    val = await docClient.update(params).promise();
    if (_.isEmpty(val)) {
        console.error("Value is empty");
    } else {
        console.log(val);
    }

    // fetch new item
    console.log("# Looking for updated item");
    val = await fetch(url);
    if (_.isEmpty(val)) {
        console.error("Value not found in table");
    } else {
        console.log(val);
    }

    // remove new item
    console.log("# Removing inserted item");
    params = {
        TableName: tableName,
        Key: {
            "url": url
        }
    };
    val = await docClient.delete(params).promise();
    console.log(val);

    // fetch new item
    console.log("# Looking up for delete item");
    console.log(await fetch(url));

    // create with TTL 5 seconds
    params = {
        TableName: tableName,
        Item: {
            "url": "http://time.com/",
            "content": "<html><!-- sample item here --></html>",
            "ttl": futureDate(5)
        }
    };
    await docClient.put(params).promise();
    console.log("Item added to table with a TTL of 5 seconds");

    await sleep(6 * 1000);

    // fetch new item
    console.log("# Looking into item added with 5 seconds TTL");
    val = await fetch(url);
    if (!_.isEmpty(val)) {
        console.log("Item found in table, that's wrong");
        console.log(val);
    } else {
        console.error("Item not found in table, it expired as expected");
    }

})();
