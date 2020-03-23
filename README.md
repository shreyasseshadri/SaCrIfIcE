# SaCrIfIcE

A reddot bot that turns a string into a sarcastic one.

## Running the server

You would require an .env file like the following

```
export CLIENT_ID=**
export CLIENT_SECRET=**
export REDDIT_USER=**
export REDDIT_PASS=**
```
Export the variables using
```
source .env
```
Run the server
```
npm start
```
## Instructions for the bot

The bot is triggered by a comment of the form
> <some_cool_catch_phrase> some string

It replies with the sarcasified string

> SoMe StRiNg


### [Reference](https://dev.to/seiyria/making-a-reddit-reply-bot-f55)