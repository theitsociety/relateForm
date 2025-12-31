/**
 * 
 * @file Utils library provides some useful Javascript helper methods to be used along with Google Forms App Scripts. 
 * Specifically it helps submit data to Discord Servers and Notion Databases. 
 * This library is already available publicly as a App Script Library. 
 * Please use 1q3MSXMcaQaxkuI6TNe02hfRf4HGjTCQGvxzNymwuMtoxsjlQkEfQnQaR to import as a library and select the latest version
 * For more info: 
 * https://script.google.com/macros/library/d/1q3MSXMcaQaxkuI6TNe02hfRf4HGjTCQGvxzNymwuMtoxsjlQkEfQnQaR/12 
 * 
 * @author Tyson Turkoz
 * @module Utils
 */

/**
 * Fetches Google Form Data and sender email
 * @return {object} latest response 
 * {
 *  respondentEmail
 *  response
 * }
 * 
 */
function getLatestFormResponse () {
  const form = FormApp.getActiveForm();
  const allResponses = form.getResponses();
  const latestResponse = allResponses[allResponses.length - 1];
  return {
    respondentEmail: latestResponse.getRespondentEmail(), 
    response: latestResponse.getItemResponses()
  };
}

/**
 * Can be used for one time migration if the form already has multiple submissions before script enablement 
 * @return {array} all responses 
 * {
 *  respondentEmail
 *  response
 * }
 * 
 */ 
function getAllResponses () {
  const form = FormApp.getActiveForm();
  const allResponses = form.getResponses();
  return allResponses.map(response => {
    const responseObject = Utils.formResponseToObject(response.getItemResponses());
    const respondentEmail = response.getRespondentEmail();
    return {
      respondentEmail, 
      response: responseObject
    }; 
  }); 
}

/**
 * Transforms Google Form data
 * 
 * @param {object} response data to be transformed
 * @return {object} transformed data
 */
function formResponseToObject(response) {
  const keyValues = {};
  for (var i = 0; i < response.length; i++) {
    const question = response[i].getItem().getTitle();
    let answers = response[i].getResponse();
    if (answers == "" || question == "") {
      continue;
    }
    if (answers.match) {
      answers = answers.match(/[\s\S]{1,1024}/g) || [];
    }
    keyValues[question] = answers;
  }
  return keyValues;
}

/**
 * Converts array to object by using separator
 * 
 * @param {array} rows separator separated key value pairs
 * @param {string} separator key to split data 
 * @return {object} parsed result
 */  
function arrayToObject(rows, separator) {
  const obj = {};
  rows.forEach(el => {
    const keyValue = el.split(separator);
    obj[keyValue[0]] = keyValue[1];
  });
  return obj; 
}

/**
 * Converts HTML to array by using separator
 * @param {string} data HTML formated input
 * @param {string} separator key to split data 
 * @return {array} parsed result
 */
function HTMLToArray (data, separator) {
  return data.split(separator).map( el => el.replace(/(<([^>]+)>)/ig, ''));
}

/**
 * Gets the user selection from the multi select field in the user interface
 * @param {string} response user selection 
 * @return {array} parsed response for multiSelect field for notion database
 */
function prepareMultiSelect(response){
  const preferences = []
  if(!response)
    return preferences
  response.forEach(preference => {
    preferences.push({'name': preference.slice(0, 100).replaceAll(",", "")});
  });
  return preferences;
}

