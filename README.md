# React Voting Application
<b>SQL is required. Didn't provide MongoDB setup.</b>

<b>First, install packages:</b>
``` bash
npm install
npm install -D
```

## Development
You'll need to create a .env file in the root directory.
<pre>
<b>.env:</b>

TWITTER_CONSUMER_KEY='INSERT_KEY_HERE'

CONSUMER_SECRET='INSERT_SECRET_HERE'

COOKIE_KEY='custom_cookie_key'

NODE_ENV='development'
</pre>

For the authentication to function, you'll need to look into <a href="https://developer.twitter.com/en/docs">Twitter Developer's documentation</a> 
and go through the process to generate the key and secret for your application which you'll also need to 
provide a callback url when configuring your app on Twitter's Developer Portal page.

The application is using this callback URL: http://localhost:8080/auth/twitter/redirect

<b>Start Development:</b>
``` bash
npm run dev
```
