# CE Field Updater

A Node.js application to clear specified fields from contacts in the data-crypt API.

## Usage

Run the application from your terminal and provide field names as command-line arguments:

### Single Field
```bash
node process.js zxt2mvb6y7
```

### Multiple Fields (comma-separated)
```bash
node process.js "zxt2mvb6y7,anotherField,thirdField"
```

### Multiple Fields (separate arguments)
```bash
node process.js zxt2mvb6y7 anotherField thirdField
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
- `key` - API client ID
- `secret` - API client secret
- `baseUrl` - API base URL (should be `https://api.data-crypt.com/api/v1.3`)
- `tokenUrl` - OAuth token URL
- `flow` - OAuth flow (client_credentials)
- `scope` - OAuth scope

3. Add contact IDs to `inputData.txt` (one ID per line)

## Process Flow

1. **Authentication**: Gets OAuth token from the API
2. **JSON Creation**: Creates batches of 100 contacts each with specified fields set to `null`
3. **API Requests**: Sends batches to `/contacts/update` endpoint
4. **Results**: Saves API responses to `results/` folder

## Output Files

- `jsonToPost.json` - Batched request data
- `results/batch_{number}_response.json` - Successful API responses
- `results/batch_{number}_error.json` - Failed requests with error details

## Error Handling

- Validates field names are provided
- Handles API errors with detailed logging
- Continues processing even if individual batches fail
- Exits with error code on critical failures

## Rate Limiting

- 100ms delay between batch requests to avoid API rate limits
- Batches are limited to 100 contacts each
