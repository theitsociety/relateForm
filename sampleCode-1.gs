/** 
 * This is a sample relate-script file that works with / call Utils library for 
 * the bare minimum tasks. After creating a Google Apps Script please import Utils 
 * Library by using its id (1q3MSXMcaQaxkuI6TNe02hfRf4HGjTCQGvxzNymwuMtoxsjlQkEfQnQaR) 
 * and select the latest version 
 * 
 * For more details about the Utils: 
 *  https://script.google.com/macros/library/d/1q3MSXMcaQaxkuI6TNe02hfRf4HGjTCQGvxzNymwuMtoxsjlQkEfQnQaR/13
 * 
 */

/**
 * Credentials to connect external endpoints like Discord and Notion.
 * See setProperties function documentation for more details 
 */
const scriptProperties = PropertiesService.getScriptProperties();
// PROD
const DISCORD_URL = scriptProperties.getProperty("DISCORD_URL");
const NOTION_DATABASE_ID = scriptProperties.getProperty("NOTION_DATABASE_ID");;
// Dev
// const DISCORD_URL = scriptProperties.getProperty("DISCORD_URL_DEV");
// const NOTION_DATABASE_ID = scriptProperties.getProperty("NOTION_DATABASE_ID_DEV");;
const NOTION_BEARER = scriptProperties.getProperty("NOTION_BEARER");;
const DISCORD_FORM_TITLE = "New Registration";

/**
 * Utilize Properties Service to store credentials once and get them every time
 * from there. It restricts credential access for users with read-only access to this script file. 
 * Steps: 
 *  - Update the values below in setProperties function with the expected
 *  - Select setProperties method above in the toolbar and click on Run
 *  - Once it is successfully executed, revert value assignments below and Save
 *  - Every time this script is executed, it will be fetched from Property Service
 * 
 * Google Apps Scripts do not share the same script properties; properties are scoped to a single script project. 
 * Isolation: The PropertiesService stores key-value pairs that are specific to the script project in which they 
 * are set and are never shared between separate script projects.
 * Project Scope: All code files (.gs files) within a single script project share the same set of "Script Properties," 
 * as they are considered part of one unified script.
 * 
 * Credentials to connect external endpoints like Discord and Notion.
 * DISCORD_URL: Discord Server -> Edit Channel -> Integrations -> Webhooks -> New Webhook -> Copy Webhook URL
 * DISCORD_URL_DEV: if you have a Discord Server for testing
 * NOTION_BEARER: Notion Space -> ... -> Connnections -> Add Connection -> Develop Integration -> New Integration -> Internal Integration Secret
 * NOTION_DATABASE_ID: Copy ID from the URL providing a database view.
 * NOTION_DATABASE_ID_DEV: if you have a Notion Database for testing
 * 
 */
function setProperties() {
  scriptProperties.setProperty("DISCORD_URL", "https://discord.com/api/webhooks/...");
  scriptProperties.setProperty("DISCORD_URL_DEV", "https://discord.com/api/webhooks/...");
  scriptProperties.setProperty("NOTION_DATABASE_ID", "${NOTION_DATABASE_ID}");
  scriptProperties.setProperty("NOTION_DATABASE_ID_DEV", "${NOTION_DATABASE_ID_DEV}");
  scriptProperties.setProperty("NOTION_BEARER", "${NOTION_BEARER}");
}

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
 *  - relation
 */
const FIELD_MAPPINGS = {
  "Full Name": {
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
  "Registered": {
    "mapping": "Registered",
    "type": "select" 
  },
  "LinkedIn Account": {
    "mapping": "LinkedIn Account",
    "type": "url"       
  },
  "City, State, Country": {
    "mapping": "Country",
    "type": "rich_text"       
  },
  "I am a": {
    "mapping": "I am a",
    "type": "select" 
  },
  "Company": {
    "mapping": "Company",
    "type": "rich_text"       
  },
  "Job Title": {
    "mapping": "Job Title",
    "type": "rich_text"       
  },
  "studentId": {
    "mapping": "studentId",
    "type": "number" 
  },
  "College/University": {
    "mapping": "College",
    "type": "rich_text"       
  },
  "Major": {
    "mapping": "Major",
    "type": "rich_text"       
  },  
  "Grade": {
    "mapping": "Grade",
    "type": "rich_text"       
  },
  "Hobbies": {
    "mapping": "Hobbies",
    "type": "rich_text"       
  },
  "You heard us from your personal network. Do you want to share your friend's name for us to send our appreciations?": {
    "mapping": "Referral",
    "type": "rich_text"       
  },
  "Please let us know about your communication preferences. ": {
    "mapping": "Communication Preferences",
    "type": "multi_select"       
  },
  "Do you want to contribute to our activities?": {
    "mapping": "Contribution Preference",
    "type": "multi_select"       
  },
  "Where did you hear us": {
    "mapping": "Where did you hear us?",
    "type": "multi_select"       
  },
  "Groups": {
    "mapping": "Groups",
    "type": "multi_select"       
  }
} 

const groupMappings = {
    "AI & ML": "ai-ml",
    "AI Engineering": "ai-engineering",
    "Book Club": "book-club",
    "C++ Deep Dive": "cplusplus-deep-dive",
    "Cyber Security": "cyber-sec",
    "Data Engineering": "data-engineer",
    "Engineering Management": "eng-management",
    "Hands-on Sessions": "hands-on",
    "IOS Thrive":"ios-thrive",
    "Leetcode Medium & Hard": "leetcode-medium-hard",
    "Practice Programming (Beginner)": "practice-programming-beginner",
    "QA & SDET": "qa-sdet",
    "Staff Engineers' Path": "staff-engineers-path",
    "System Design": "system-design",
    "Tech Talks": "tech-talks",
    "Women in Tech": "women-in-tech"
};

/**
 * This method called Utils.prepareNotionPayload with user's response and mappings 
 * but before that provides the add some field & values or map existing answers to 
 * expected values.  
 */
function prepareNotionPayload(respondentEmail, responseObject){

  responseObject['Respondent Email'] = respondentEmail;
  responseObject['Status'] = 'Registered';
  responseObject['Onboarding Status'] = 'Pending';
  responseObject['Registered'] = 'Yes';
  responseObject['Groups'] = (responseObject['Which areas you are interested in?'] || []).map(group => groupMappings[group] || group);
  if (responseObject['I am a'] == 'student') {
    var nextStudentIndex = parseInt(PropertiesService.getScriptProperties().getProperty('studentIndex')) + 1;
    responseObject['studentId'] = nextStudentIndex;
    PropertiesService.getScriptProperties().setProperty('studentIndex', nextStudentIndex);
  }

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
    // Load
    Utils.postDataToDiscord(DISCORD_URL, respondentEmail, responseObject, DISCORD_FORM_TITLE);
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
