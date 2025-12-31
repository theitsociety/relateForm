# Utils (lib/Utils.gs)

Summary
- Collection of small helpers to read Google Form responses, transform form data into plain objects, and prepare values for Notion multi_select or Discord fields.

Functions

- `getLatestFormResponse()`
  - Description: Returns the most recent response of the active Google Form.
  - Returns: `{ respondentEmail, response }` where `response` is an array of `ItemResponse` objects.
  - Example:

```js
const latest = getLatestFormResponse();
Logger.log(latest.respondentEmail);
const obj = formResponseToObject(latest.response);
```

- `getAllResponses()`
  - Description: Returns all responses from the active Google Form, converted to objects using `formResponseToObject`.
  - Returns: `Array` of `{ respondentEmail, response }` objects.
  - Example:

```js
const all = getAllResponses();
all.forEach(r => Logger.log(r.respondentEmail));
```

- `formResponseToObject(response)`
  - Description: Convert a Google Forms `ItemResponse[]` into a plain object mapping question title → answer(s).
  - Parameters:
    - `response` — array of `ItemResponse` objects (the result of `FormResponse.getItemResponses()`).
  - Returns: Object where keys are question titles and values are the response (string or array of strings for long text split into 1024-char chunks).
  - Example:

```js
const plain = formResponseToObject(itemResponses);
// plain['Your Full Name'] => 'Alice Smith'
```

- `arrayToObject(rows, separator)`
  - Description: Convert an array of separator-delimited `key:value` strings into an object.
  - Parameters: `rows` (Array of strings), `separator` (string)
  - Returns: Object mapping keys to values.
  - Example:

```js
arrayToObject(['a:1', 'b:2'], ':'); // => { a: '1', b: '2' }
```

- `HTMLToArray(data, separator)`
  - Description: Split an HTML-formatted string by `separator` and strip HTML tags from each part.
  - Parameters: `data` (string), `separator` (string)
  - Returns: Array of plain strings.

- `prepareMultiSelect(response)`
  - Description: Convert an array of selection strings into Notion `multi_select` option objects: `{ name: '...' }`.
  - Parameters: `response` (array) — selected values.
  - Returns: Array of `{ name }` objects with values trimmed and commas removed; truncated to 100 chars.
  - Example:

```js
prepareMultiSelect(['bookclub', 'leetcode-medium']); // => [{name:'bookclub'},{name:'leetcode-medium'}]
```

Notes
- `formResponseToObject` will split long answers into 1024-character chunks when a `.match` is available on the answer (string-like), to keep results manageable.
