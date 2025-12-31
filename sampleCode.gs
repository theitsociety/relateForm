/** 
 * @file This is a sample relate-script file that works with / call Utils library for 
 * the bare minimum tasks. After creating a Google Apps Script please import Utils 
 * Library by using its id (1q3MSXMcaQaxkuI6TNe02hfRf4HGjTCQGvxzNymwuMtoxsjlQkEfQnQaR) 
 * and select the latest version 
 * 
 * For more details about the Utils: 
 *  https://script.google.com/macros/library/d/1q3MSXMcaQaxkuI6TNe02hfRf4HGjTCQGvxzNymwuMtoxsjlQkEfQnQaR/12
 * 
 * @author Tyson Turkoz
 * @requires library:utils
 */

/**
 * Credentials to connect external endpoints like Discord and Notion.
 * DISCORD_URL: Discord Server -> Edit Channel -> Integrations -> Webhooks -> New Webhook -> Copy Webhook URL
 * NOTION_BEARER: Notion Space -> ... -> Connnections -> Add Connection -> Develop Integration -> New Integration -> Internal Integration Secret
 * NOTION_DATABASE_ID: Copy ID from the URL providing a database view.
 */
var DISCORD_URL = "https://discord.com/api/webhooks/${DISCORD_WEBHOOK_ID}/${DISCORD_WEBHOOK_TOKEN}";
var NOTION_DATABASE_ID = "${NOTION_DATABASE_ID}";
var NOTION_BEARER = "${NOTION_BEARER}";

/** 
 * Mappings from Google Forms questions to respective Notion columns
 * Supported Types: 
 *  - title
 *  - email
 *  - select
 *  - number
 *  - url
 *  - multi_select
 *  - rich_text
 */
const FIELD_MAPPINGS = {
  "Your Full Name": {
    "mapping": "Full Name",
    "type": "title" 
  },
  "Respondent Email": {
    "mapping": "Email Address",
    "type": "email" 
  },
  "Status": {
    "mapping": "Status",
    "type": "select" 
  },
  "Onboarding Status": {
    "mapping": "Onboarding Status",
    "type": "select" 
  },
  "Your gender": {
    "mapping": "Gender",
    "type": "select" 
  },
  "Your age": {
    "mapping": "Age",
    "type": "number" 
  },
  "Your Social Media Link (ex. LinkedIn..)": {
    "mapping": "Social Account",
    "type": "url"       
  },
  "Your City and Country": {
    "mapping": "Your City and Country",
    "type": "rich_text"       
  },
  "Where did you hear about us": {
    "mapping": "Where did you hear about us?",
    "type": "rich_text"       
  },
  "Your university and field of study": {
    "mapping": "Your university and field of study",
    "type": "rich_text"       
  },
  "What are your main interests": {
    "mapping": "What are your main interests?",
    "type": "multi_select"       
  },
  "Would you like to volunteer in NYP": {
    "mapping": "Would you like to volunteer?",
    "type": "select" 
  },
  "Communication Preferences": {
    "mapping": "Communication Preferences",
    "type": "multi_select"       
  }
}  

/**
 * This method called Utils.prepareNotionPayload with user's response and mappings 
 * but before that provides the add some field & values or map existing answers to 
 * expected values.  
 */
function prepareNotionPayload(respondentEmail, responseObject){
  responseObject['Respondent Email'] = respondentEmail;
  responseObject['Status'] = 'Registered';
  responseObject['Onboarding Status'] = 'Pending';
  responseObject['Communication Preferences'] = [(responseObject['By submitting this form, you consent to the collection and use of your information for purposes related to this program or event. Your data will be stored securely, used only by our team, and will not be shared with any third parties unless required by law or with your explicit permission.']||'').toString() === 'Yes, I agree'? 'Do you want to be informed about event schedules?': 'No'];
  return Utils.prepareNotionPayload(responseObject, FIELD_MAPPINGS)
}
/**
 * Every time a form is submitted a call is triggered to this method
 * It is the entry point of the following actions
 *  - (E)xtract
 *  - (T)ransform
 *  - (L)oad
 */
function onSubmit(e) {
  try {
    // Extract 
    const {respondentEmail, response } = Utils.getLatestFormResponse();
    // Transform form content
    const responseObject = Utils.formResponseToObject(response);
    const payload = prepareNotionPayload(respondentEmail, responseObject);
    console.log(JSON.stringify(payload));
    // Load
    Utils.postDataToDiscord(DISCORD_URL, respondentEmail, responseObject, "New Registration");
    // Same connection can be used with different Notion Databases
    Utils.createNotionPageV2(payload, NOTION_DATABASE_ID, NOTION_BEARER);
  } catch (err) {
    Logger.log('Failed with error %s', err.toString());
  }
};

/**
 * Can be used for one time migration if the form already has multiple submissions before script enablement 
 * Select method name in Apps Script editor and Run
 */ 
function postAllResponses () {
  try {
    Utils.getAllResponses().forEach(aresponse => {
      const responseObject = aresponse.response;
      const respondentEmail = aresponse.respondentEmail;
      const payload = prepareNotionPayload(respondentEmail, responseObject);
      Utils.createNotionPageV2(payload, NOTION_DATABASE_ID, NOTION_BEARER);
    });
  } catch (err) {
    Logger.log('Failed with error %s', err.toString());
  }  
}
