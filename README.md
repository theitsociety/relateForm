# Relateform

It is a Google Apps Script project containing utility clients for Notion and Discord, plus sample code. Use this repository as a basis for automations that interact with Notion and Discord from Google Apps Script.

**Repository summary**
- **Purpose**: Utilities and sample code to integrate Google Apps Script with Notion and Discord.
- **Language**: Google Apps Script (ECMAScript for Apps Script, `.gs` files).

**Quick Links**

- **Source files**: `lib/` (contains `NotionClient.gs`, `DiscordClient.gs`, `Utils.gs`)
- **Samples**: `sampleCode-1.gs`, `sampleCode-2.gs` (see descriptions below)
- **Documentation**: `docs/*`


**Requirements**

- A Google account with access to create and deploy Apps Script projects.
- Notion integration token(s) and IDs (if using `NotionClient`).
- Discord webhook URL (if using `DiscordClient`).

**Usage**

1. Include publicly available library in your Apps Script Project by using id: `1q3MSXMcaQaxkuI6TNe02hfRf4HGjTCQGvxzNymwuMtoxsjlQkEfQnQaR`
2. Write your own script by using the sample code available in `sampleCode-1.gs` and `sampleCode-2.gs`
3. Don't forget to enable `Triggers` through https://script.google.com/home/projects/${SCRIPT_ID}/triggers. Event `On form submit` should execute OnSubmit function. 

Recent changes (last commits)
- **PropertiesService for credentials**: Sample code now demonstrates storing and retrieving credentials via `PropertiesService.getScriptProperties()` and the `setProperties()` helper. This keeps tokens/IDs out of the code and restricts access for users with read-only access to the script project.
- **Relation & upsert sample**: `sampleCode-2.gs` demonstrates using a `relation` mapping type and an upsert flow: the script queries Notion with `filterNotionDatabase` and either updates an existing page (`updateNotionPage`) or creates a new one (`createNotionPageV2`). See `sampleCode-2.gs` for examples using `NOTION_SKILLS_DATABASE_ID` and `NOTION_REGISTRATION_DATABASE_ID`.

Configuration updates
- Use `setProperties()` in the sample files to populate the following script properties once in your project (then remove literal secrets from the code):
	- `NOTION_BEARER`
	- `NOTION_DATABASE_ID` (or `NOTION_REGISTRATION_DATABASE_ID` / `NOTION_SKILLS_DATABASE_ID` depending on sample)
	- `DISCORD_URL` (optional)

Notes about sample files
- `sampleCode-1.gs`: sample demonstrating basic registration flow and `studentIndex` stored in `ScriptProperties`.
- `sampleCode-2.gs`: sample demonstrating relation mapping and upsert logic against two Notion databases.

**File structure**

- `sampleCode-1.gs` — Example usage with `PropertiesService` and registration flow
- `sampleCode-2.gs` — Example usage showing relation mapping and upsert logic
- `lib/DiscordClient.gs` — Discord integration helper (webhooks, posting)
- `lib/NotionClient.gs` — Notion integration helper (requests against Notion API)
- `lib/Utils.gs` — Utilities used by the clients

**Related repositories**
- There is a sibling repository `relatebot` in the workspace that contains a Node.js service and templates (see parent workspace if available).
