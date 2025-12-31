# DiscordClient (lib/DiscordClient.gs)

Summary
- Helpers to prepare and post messages to Discord (via webhook/API) from Google Apps Script.

Functions

- `postDataToDiscord(postURL, email, fields, title="New Registration")`
  - Description: Post an embed to a Discord webhook URL using `UrlFetchApp.fetch`.
  - Parameters:
    - `postURL` (string) — Discord webhook URL or endpoint to post to.
    - `email` (string | optional) — an email address to include in the fields payload.
    - `fields` (array | object) — Either an array of embed `fields` objects or a plain object of key → value pairs which will be converted by `prepareItems`.
    - `title` (string | optional) — Embed title. Defaults to `"New Registration"`.
  - Behavior:
    - Validates `fields` is an object; if it's not an array it converts it using `prepareItems`.
    - Adds `email` into the fields if provided.
    - Posts a JSON payload with an `embeds` array (one embed) and `fields` to the `postURL`.
    - Logs and silently returns; HTTP errors are not thrown by the wrapper (muteHttpExceptions is used).
  - Example:

```js
function notifyDiscordExample() {
  const webhook = PropertiesService.getScriptProperties().getProperty('DISCORD_WEBHOOK_URL');
  const data = {
    'Donor Name': 'Jane Doe',
    'Amount': '$25',
    'Notes': 'Happy to support!'
  };
  postDataToDiscord(webhook, 'jane@example.com', data, 'New Donation');
}
```

- `prepareItems(keyValues)`
  - Description: Convert a plain object (key → value or key → array) into an array of Discord embed `fields` objects.
  - Parameters:
    - `keyValues` (object) — keys are field names, values are strings or arrays of strings.
  - Returns: `Array` of objects shaped like `{ name, value, inline }` suitable for Discord embed `fields`.
  - Notes:
    - If a value is an array, each element becomes its own field; subsequent items for the same key append " (cont.)" to the `name`.
  - Example:

```js
const fields = prepareItems({ "Name": "Alice", "Interests": ["reading", "hiking"] });
// fields => [ {name: 'Name', value: 'Alice', inline: false}, {name: 'Interests', value: 'reading', inline: false}, {name: 'Interests (cont.)', value: 'hiking', inline: false} ]
```

Notes
- The function uses `UrlFetchApp.fetch` and `Logger.log`/`console.log` for debugging.
- Keep webhook URLs secret (do not commit to source control).
