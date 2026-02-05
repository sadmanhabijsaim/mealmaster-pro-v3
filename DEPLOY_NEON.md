# Deploying Netlify Function to connect Neon

1. In your Netlify project settings, add a new environment variable:

   - Key: `NEON_CONNECTION_STRING`
   - Value: the Neon connection string I fetched (or your own secret)

   Example:
   `postgresql://neondb_owner:REDACTED@ep-.../neondb?channel_binding=require&sslmode=require`

2. Ensure `pg` is installed. From project root run:

```powershell
npm install
```

3. Commit and push your changes; Netlify will pick up the `netlify/functions` folder and build a serverless function named `test-neon-connection`.

4. After deploy, test the function by visiting:

```
https://<your-netlify-site>.netlify.app/.netlify/functions/test-neon-connection
```

It should return a JSON payload with `success: true` and the Postgres version if the connection works.

Next steps I can do for you:
- Implement server-side endpoints for `fetchData`, `authenticate`, and `saveData` so your frontend talks to this function instead of the Google Script.
- Add CORS-safe proxy endpoints and update `services/syncService.ts` to call those.
