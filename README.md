# sls-tracker-sync
Serverless Pivotal + Jira sync API

## Development

Install packages

```bash
npm install
```

Run local dev (sls-offline)

```bash
npm start
```

Local sync API should be running at localhost:3000
  - *(port can be changed in serverless.yml)*

Open local API to connect as webhook ([using ngrok](https://ngrok.com/))

```bash
ngrok http 3000
```

Setup webhook to trigger sync:

- Example: `POST https://abc123.ngrok.io/dev/api/v1/sync


## Deployment

Deploy serverless sync webhook

```bash
npm run deploy
```

## More options

Show current deployment info (list existing webhook url)

```bash
npm run info
```

Remove the serverless webhook (delete CF stack)

```bash
npm run remove
```
