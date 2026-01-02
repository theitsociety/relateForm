# NotionClient (lib/NotionClient.gs)

Summary
- Helpers to convert Google Form responses into Notion page payloads and call Notion API endpoints from Google Apps Script.

Functions

- `prepareNotionPayload(responseObject, FIELD_MAPPINGS)`
  - Description: Map a plain response object (question → answer) into Notion `properties` format according to `FIELD_MAPPINGS`.
  - Parameters:
    - `responseObject` (object) — typically returned by `Utils.formResponseToObject` or equivalent.
    - `FIELD_MAPPINGS` (object) — describes how form fields map to Notion properties. Example mapping:

```js
{
  "Your Full Name": { "mapping": "Full Name", "type": "title" },
  "Email": { "mapping": "Email Address", "type": "email" },
  "Interests": { "mapping": "Groups", "type": "multi_select" }
}
```

  - Supported mapping `type` values: `title`, `email`, `select`, `number`, `url`, `multi_select`, `rich_text`. `relation`
  - Returns: An object usable as the `properties` attribute when creating or updating Notion pages.
  - Example:

```js
const props = prepareNotionPayload(formObj, FIELD_MAPPINGS);
// then pass `props` to createNotionPageV2
```

- `createNotionPageV2(properties, database_id, bearer)`
  - Description: Create a new Notion page (v1 pages endpoint) in a database using the prepared `properties`.
  - Parameters:
    - `properties` (object) — Notion properties object (from `prepareNotionPayload`).
    - `database_id` (string) — target Notion database id.
    - `bearer` (string) — Internal Integration Secret (Bearer token) for Notion.
  - Notes: Uses `UrlFetchApp.fetch` to POST to `https://api.notion.com/v1/pages`. The integration must have access to the target database.
  - Example:

```js
const bearer = PropertiesService.getScriptProperties().getProperty('NOTION_TOKEN');
createNotionPageV2(props, DATABASE_ID, bearer);
```

- `updateNotionPage(page_id, payload, bearer)`
  - Description: Update a Notion page with a given payload. Payload typically contains a `properties` object.
  - Parameters:
    - `page_id` (string) — Notion page id.
    - `payload` (object) — JSON payload to PATCH (example: update `multi_select` values).
    - `bearer` (string) — Notion bearer token.
  - Example payload to add multi_select values:

```js
const payload = {
  properties: {
    Groups: {
      multi_select: [{ name: 'bookclub' }, { name: 'leetcode-medium' }]
    }
  }
};
updateNotionPage(PAGE_ID, payload, bearer);
```

- `filterNotionDatabase(database_id, filter, bearer)`
  - Description: Query a Notion database using the `/databases/{id}/query` endpoint and return `results` array.
  - Parameters:
    - `database_id` (string) — Notion database id.
    - `filter` (object) — Query body (can include `filter`, `sorts`, `page_size` etc.).
    - `bearer` (string) — Notion bearer token.
  - Returns: Array of page objects (`results`) from Notion.
  - Example:

```js
const filter = {
  filter: {
    property: 'Email Address',
    rich_text: { contains: 'alice@example.com' }
  }
};
const results = filterNotionDatabase(DATABASE_ID, filter, bearer);
// results is an array of matching page objects
```

Notes
- All Notion API requests include header `Notion-Version: 2022-06-28` and use `Content-Type: application/json`.
- Keep the Notion token private and give the integration access to the target database.
