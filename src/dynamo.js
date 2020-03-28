'use strict';

const AWS = require("aws-sdk");

const IS_OFFLINE = process.env.IS_OFFLINE;
const CONFIG_DYNAMODB_ENDPOINT = process.env.CONFIG_DYNAMODB_ENDPOINT

let dynamo;

if (IS_OFFLINE === 'true') {
  dynamo = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: CONFIG_DYNAMODB_ENDPOINT,
  });
} else {
  dynamo = new AWS.DynamoDB.DocumentClient();
};

/**
 * Dynamo Save
 *
 * @param {Object} data - The data to save
 * @return {Promise} A Promise with the save results
 */
exports.save = function(data) {
  data.id = data.id || data.team_id || data.team.id;
  return this.query('put', { Item: data }).then( () => data);
};


/**
 * Dynamo Get
 *
 * @param {String} id - The record's key
 * @return {Promise} A Promise with the get result
 */
exports.get = function(id) {
  return this.query('get', { Key: { id: id } }).then(d => {
    return Promise.resolve(d.Item);
  });
};


/**
 * Dynamo Query
 *
 * @param method
 * @param {Object} params - The query parameters
 * @return {Promise} A Promise with the get result
 */
exports.query = function(method, params) {
  params.TableName = process.env.TABLE_NAME;

  return new Promise((resolve, reject) => {
    dynamo[method](params, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};
