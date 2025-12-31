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
var DISCORD_URL = "https://discord.com/api/webhooks/1449996755239436318/O9vziWgAf_GU42e0p-L7KKL26YiqglV99aBP2ImC2AUOpNu4WEtaZeDRN3Ptbkp_kDra";


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

    // Load
    Utils.postDataToDiscord(DISCORD_URL, respondentEmail, responseObject);
  } catch (err) {
    Logger.log('Failed with error %s', err.toString());
  }

};