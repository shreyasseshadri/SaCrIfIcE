const Snoowrap = require('snoowrap');
const { CommentStream } = require('snoostorm');


const BOT_START = Date.now() / 1000;
if (!process.env.CLIENT_SECRET || !process.env.CLIENT_ID || !process.env.REDDIT_USER 
    || !process.env.REDDIT_PASS || !process.env.CATCH_PHRASE) {
    console.log('Set the env variables!')
    process.exit()
}

const trigger_phrases = process.env.TRIGGER_PHRASES.split(',')

const whomst_has_summoned_almighty_one = (comment) => {
    var ind
    trigger_phrases.forEach((phrase,i) => {
        if(comment.includes(phrase)){
            ind = i
            return
        }
    })
    return ind
}

const purify_sacrifice = (comment,phrase_ind) => {
    var trigger_phrase = trigger_phrases[phrase_ind]
    var start_ind = comment.indexOf(trigger_phrase)
    return comment.slice(start_ind+trigger_phrase.length).trim()
}

const sacrifice = (comment,phrase_ind) => {
    var purified_sacrifice = purify_sacrifice(comment,phrase_ind)
    var wish = ''
    var lowerCase = false
    for (i = 0; i < purified_sacrifice.length; i++) {
		if (purified_sacrifice[i].match(/[a-z]/i)) {
			wish += (lowerCase) ? purified_sacrifice[i].toLowerCase() : purified_sacrifice[i].toUpperCase()
			lowerCase = !lowerCase
		}
		else {
			wish += purified_sacrifice[i]
		}
	}
    return wish;
}
const client = new Snoowrap({
    userAgent: 'sacrifice-bot',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
});

const comments = new CommentStream(client, { 
    subreddit: 'test_something_ramdom', 
    limit: 10, 
    pollTime: 1000
});

comments.on('item', (item) => {
    if(item.created_utc < BOT_START) return;
    if(!item.body) return;

    console.log(item.body)
    const phrase_ind = whomst_has_summoned_almighty_one(item.body) 
    if (!phrase_ind) return;
    if(!item.parent_id){
        item.reply(sacrifice(item.body,phrase_ind));
        return;  
    }
    client.getComment(item.parent_id).fetch().then((parentComment) => {
        parentComment.reply(sacrifice(item.body,phrase_ind));
    })
});
