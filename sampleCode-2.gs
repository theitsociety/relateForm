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
// const DISCORD_URL = scriptProperties.getProperty("DISCORD_URL");
const NOTION_SKILLS_DATABASE_ID = scriptProperties.getProperty("NOTION_SKILLS_DATABASE_ID");;
const NOTION_REGISTRATION_DATABASE_ID = scriptProperties.getProperty("NOTION_REGISTRATION_DATABASE_ID");;
// Dev
// const DISCORD_URL = scriptProperties.getProperty("DISCORD_URL_DEV");
// const NOTION_SKILLS_DATABASE_ID = scriptProperties.getProperty("NOTION_SKILLS_DATABASE_ID_DEV");;
// const NOTION_REGISTRATION_DATABASE_ID = scriptProperties.getProperty("NOTION_REGISTRATION_DATABASE_ID_DEV");;
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
  // scriptProperties.setProperty("DISCORD_URL", "https://discord.com/api/webhooks/...");
  // scriptProperties.setProperty("DISCORD_URL_DEV", "https://discord.com/api/webhooks/...");
  scriptProperties.setProperty("NOTION_SKILLS_DATABASE_ID", "${NOTION_SKILLS_DATABASE_ID}");
  scriptProperties.setProperty("NOTION_REGISTRATION_DATABASE_ID", "${NOTION_REGISTRATION_DATABASE_ID}");
  scriptProperties.setProperty("NOTION_SKILLS_DATABASE_ID_DEV", "${NOTION_SKILLS_DATABASE_ID_DEV}");
  scriptProperties.setProperty("NOTION_REGISTRATION_DATABASE_ID_DEV", "${NOTION_REGISTRATION_DATABASE_ID_DEV}");
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
  "Your preferred full name": {
    "mapping": "Your preferred name",
    "type": "title" 
  },
  "Email Address": {
    "mapping": "Email Address",
    "type": "email" 
  },
  "Registered Name": {
    "mapping": "Registered Name",
    "type": "relation" 
  },
  "Which COMPANY you work at ?": {
    "mapping": "Company",
    "type": "rich_text"       
  },
  "What is your current ROLE ? ": {
    "mapping": "Job Title",
    "type": "multi_select"       
  },
  "Which PROGRAMMING LANGUAGES are you comfortable with? (2 years or more experience)": {
    "mapping": "Programming Languages",
    "type": "multi_select"       
  },
  "Which SOFTWARE FRAMEWORKS are you comfortable with? (2 years or more experience)": {
    "mapping": "Software Frameworks",
    "type": "multi_select"       
  },
  "Which CLOUD TECHNOLOGIES are you comfortable with?": {
    "mapping": "Cloud Technologies",
    "type": "multi_select"       
  },
  "Which DATA TECHNOLOGIES are you comfortable with?": {
    "mapping": "Data Technologies",
    "type": "multi_select"       
  },
  "What ADDITIONAL TOOLING are you comfortable with? ": {
    "mapping": "Additional Tooling",
    "type": "multi_select"       
  }

} 

/**
 * This method called Utils.prepareNotionPayload with user's response and mappings 
 * but before that provides the add some field & values or map existing answers to 
 * expected values.  
 */
function prepareNotionPayload(respondentEmail, responseObject){

  responseObject['Email Address'] = respondentEmail;
  // Append relation if a relevant registration found
  if (respondentEmail) {
    const filter = {"filter": {"property": "Email Address","rich_text": {"equals" : respondentEmail}}};
    const existing_registrations = Utils.filterNotionDatabase(NOTION_REGISTRATION_DATABASE_ID, filter, NOTION_BEARER);
    if(existing_registrations.length > 0){
      responseObject['Registered Name'] = existing_registrations[0]['id'];
    }
  }
  return Utils.prepareNotionPayload(responseObject, FIELD_MAPPINGS)

}


function onSubmit(e) {
  
  try {
    // Extract 
    var {respondentEmail, response } = Utils.getLatestFormResponse();
    // Transform form content
    const responseObject = Utils.formResponseToObject(response);
    const payload = prepareNotionPayload(respondentEmail, responseObject);
    // Load
    let existing_profile;
    if (respondentEmail) {    
      const filter = {"filter": {"property": "Email Address","rich_text": {"equals" : respondentEmail}}};
      existing_profile = (Utils.filterNotionDatabase(NOTION_SKILLS_DATABASE_ID, filter, NOTION_BEARER) || [])[0];
    }
    if (existing_profile) {
      Utils.updateNotionPage(existing_profile['id'], payload, NOTION_BEARER);
    } else {
      // Discord message is only for new registrations
      Utils.postDataToDiscord(DISCORD_URL, respondentEmail, responseObject, DISCORD_FORM_TITLE);
      // Notion document requires respondentEmail
      if (respondentEmail) {
        Utils.createNotionPageV2(payload, NOTION_SKILLS_DATABASE_ID, NOTION_BEARER);
      }
    } 
  } catch (err) {
    Logger.log('Failed with error %s', err.toString());
  }
};
