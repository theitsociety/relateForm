# Relateform

It is a Google Apps Script project containing utility clients for Notion and Discord, plus sample code. Use this repository as a basis for automations that interact with Notion and Discord from Google Apps Script.

**Repository summary**
- **Purpose**: Utilities and sample code to integrate Google Apps Script with Notion and Discord.
- **Language**: Google Apps Script (ECMAScript for Apps Script, `.gs` files).

**Quick Links**

- **Source files**: `lib/` (contains `NotionClient.gs`, `DiscordClient.gs`, `Utils.gs`)
- **Sample**: `sampleCode.gs`
- **Documentation**: `docs/*`


**Requirements**

- A Google account with access to create and deploy Apps Script projects.
- Notion integration token(s) and IDs (if using `NotionClient`).
- Discord webhook URL (if using `DiscordClient`).

**Usage**

1. Include publicly available library in your Apps Script Project by using id: `1q3MSXMcaQaxkuI6TNe02hfRf4HGjTCQGvxzNymwuMtoxsjlQkEfQnQaR`
2. Write your own script by using the sample code available in `sampleCode.gs`
3. Don't forget to enable `Triggers` through https://script.google.com/home/projects/${SCRIPT_ID}/triggers. Event `On form submit` should execute OnSubmit function. 

**File structure**

- `sampleCode.gs` — Example usage and entry points for the project
- `lib/DiscordClient.gs` — Discord integration helper (webhooks, posting)
- `lib/NotionClient.gs` — Notion integration helper (requests against Notion API)
- `lib/Utils.gs` — Utilities used by the clients

**Related repositories**
- There is a sibling repository `relatebot` in the workspace that contains a Node.js service and templates (see parent workspace if available).
