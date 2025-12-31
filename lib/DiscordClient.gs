/**
 * Posts provided data to the destination endpoint
 * 
 * @param {URL} postURL Destined end point to post data
 * @param {string} title Title of the request
 * @param {array} fields transformed array of JSON objects which represents each data in the form. Here is a sample object
 *  {
 *   "name": "Donor Name",
 *   "value": "John Doe",
 *   "inline": false 
 */
function postDataToDiscord (postURL, email, fields, title="New Registration") {

  if (typeof fields !== "object") {
    throw "fields is not a valid input";
  }
  if (email) {
    fields.email = email
  }
  if (!Array.isArray(fields)) {
    fields = this.prepareItems(fields);
  }
  const options = {
      "method": "post",
      "headers": {
          "Content-Type": "application/json",
      },
      "payload": JSON.stringify({
          "content": "‌",
          "embeds": [{
              title,
              "color": 33023, // This is optional, you can look for decimal colour codes at https://www.webtoolkitonline.com/hexadecimal-decimal-color-converter.html
              fields,
              "footer": {
                  "text": "System Message"
              }
          }]
      })
  };
  options.muteHttpExceptions = true
  console.log(options.payload);
  UrlFetchApp.fetch(postURL, options);
}

/**
 * Prepares fields to be posted to Discord Server via API call
 * 
 * @param {object} keyValues Data object to be converted to 
 * 
 * @return {array} array of items
 */
function prepareItems (keyValues) {
  const items = [];
  Object.keys(keyValues).forEach(name => {
    const key = name.substring(0,150);
    if (Array.isArray(keyValues[name])) {
      for (let j = 0; j < keyValues[name].length; j++) {
        items.push({
          name: j == 0 ? key: key.concat(" (cont.)"),
          value: keyValues[name][j],
          inline: false
        });
      }        
    } else {
      items.push({
        name: key,
        value: keyValues[name],
        inline: false
      });
    }
  });
  return items;
}