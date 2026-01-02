/**
 * Transforms Google Form response to Notion payload by using mappings
 * 
 * @param {object} responseObject response data to be transformed
 * @param {object} FIELD_MAPPINGS response attribute to Notion attribute / type mapping. 
 * Sample mapping: 
 *  {
 *   "Your Full Name": {
 *     "mapping": "Full Name",
 *     "type": "title" 
 *  }
 * 
 * Supported mapping types: 
 *  - title
 *  - email
 *  - select
 *  - number
 *  - url
 *  - multi_select
 *  - rich_text
 * 
 * @return {object} Notion document payload 
 */
function prepareNotionPayload(responseObject, FIELD_MAPPINGS){
  const properties = {}

  for (const [key, aMapping] of Object.entries(FIELD_MAPPINGS)) {
    if (aMapping.type == 'title') {
      properties[aMapping.mapping] = {
        'title': [{
          'text': {
            'content': (responseObject[key]||'').toString()
          }
        }]
      }
    } else if (aMapping.type == 'email') {
      properties[aMapping.mapping] = {
        'email': (responseObject[key]||'').toString()      
      }
    } else if (aMapping.type == 'rich_text') {
      properties[aMapping.mapping] = {
        'rich_text': [{
          'text': {
            'content': (responseObject[key]||'').toString()
          }
        }]
      }
    }  else if (aMapping.type == 'select') {
      properties[aMapping.mapping] = {
        'select': {
          'name': (responseObject[key]||'').toString()
        }
      }
    }  else if (aMapping.type == 'number') {
      properties[aMapping.mapping] = {
        'number': Number(responseObject[key]||-1)      
      }
    }  else if (aMapping.type == 'url') {
      properties[aMapping.mapping] = {
        'url': (responseObject[key]||'').toString()      
      }
    }  else if (aMapping.type == 'multi_select') {
      properties[aMapping.mapping] = {
        "multi_select": prepareMultiSelect(responseObject[key])
      };
    }  else if (aMapping.type == 'relation' && responseObject[key]) {
      properties[aMapping.mapping] = { 
        "relation": [{
          "id": responseObject[key] 
        }] 
      };
    }
  }

  return properties;
}

/**
 * Creates a new Notion Document in selected Database
 * 
 * @param {object} properties data prepared by prepareNotionPayload method
 * @param {string} database_id Notion database id available in Notion page URL
 * @param {string} bearer Connection auth generated on Notion Internal Integration Secret 
 * Notion Space -> ... -> Connnections -> Add Connection -> Develop Integration -> New Integration -> Internal Integration Secret
 * 
 * @return {object} Notion document payload 
 */
function createNotionPageV2 (properties, database_id, bearer) {
  const url = "https://api.notion.com/v1/pages";
  const payload = {
    "parent": {
      "type": "database_id",
      database_id
    },
    properties
  }
  var options = {
    muteHttpExceptions: true,
    method : "post",
    headers: {
      "Authorization": `Bearer ${bearer}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    payload: JSON.stringify(payload)
  };
  const response = UrlFetchApp.fetch(url, options);
  Logger.log(response);
}

/**
 * Updates a Notion Document
 * 
 * @param {string} page_id Notion Document Id available in Notion page URL
 * @param {object} payload To be updated data in JSON format
 * Sample
 *  * {
 *    "properties": {
 *      "Groups": {
 *         "multi_select": [
 *           {
 *               "name": "leetcode-medium"
 *           },
 *           {
 *               "name": "bookclub"
 *           }
 *         ]
 *       }
 *    }
 * }
 * 
 * @param {string} bearer Connection auth generated on Notion Internal Integration Secret 
 * Notion Space -> ... -> Connnections -> Add Connection -> Develop Integration -> New Integration -> Internal Integration Secret
 * 
 * @return {object} API Response 
 */
function updateNotionPage (page_id, payload, bearer) {
  const url = `https://api.notion.com/v1/pages/${page_id}`;
    var options = {
      'muteHttpExceptions': true,
      "method" : "patch",
      "headers":{
        "Authorization": `Bearer ${bearer}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      "payload": JSON.stringify(payload)

    };
    const response = UrlFetchApp.fetch(url, options);
    Logger.log(response);
}

/**
 * Queries Notion Documents in a Database
 * 
 * @param {string} database_id Notion database id available in Notion page URL
 * @param {object} filter filter in object format
 * Sample: 
 * {
 *   "filter": {
 *       "property": "Email Address",
 *       "rich_text": {
 *           "contains": "ealparslan@gmail.com"
 *       }
 *   }
 * }
 * 
 * @param {string} bearer Connection auth generated on Notion Internal Integration Secret 
 * Notion Space -> ... -> Connnections -> Add Connection -> Develop Integration -> New Integration -> Internal Integration Secret
 * 
 * @return {object} API Response 
 */
function filterNotionDatabase (database_id, filter, bearer) {
  const url = `https://api.notion.com/v1/databases/${database_id}/query`;
    var options = {
      'muteHttpExceptions': true,
      "method" : "post",
      "headers":{
        "Authorization": `Bearer ${bearer}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      "payload": JSON.stringify(filter)

    };
    const response = UrlFetchApp.fetch(url, options);
    return JSON.parse(response)['results'];
}