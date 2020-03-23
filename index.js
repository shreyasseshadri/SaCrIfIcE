const Snoowrap = require('snoowrap');
const { CommentStream } = require('snoostorm');
const some_cool_catch_phrase = 'sacrifice-me-o-mighty-one'; 


const BOT_START = Date.now() / 1000;
if (!process.env.CLIENT_SECRET || !process.env.CLIENT_ID || !process.env.REDDIT_USER || !process.env.REDDIT_PASS) {
    console.log('Set the env variables!')
    process.exit()
}

const whomst_has_summoned_almighty_one = (comment) => {
    return comment.includes(some_cool_catch_phrase);
}

const purify_sacrifice = (comment) => {
    var start_ind = comment.indexOf(some_cool_catch_phrase)
    return comment.slice(start_ind+some_cool_catch_phrase.length).trim()
}

const sacrifice = (comment) => {
    var purified_sacrifice = purify_sacrifice(comment)
    var wish = ''
    var lowerCase = false
    for(i=0;i<purified_sacrifice.length;i++){
        if(purified_sacrifice[i] === ' '){
            wish+=' '
            continue
        };
        wish+= (lowerCase)? purified_sacrifice[i].toLowerCase() : purified_sacrifice[i].toUpperCase()
        lowerCase = !lowerCase
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
    console.log()
    if (!whomst_has_summoned_almighty_one(item.body)) return;

    item.reply(sacrifice(item.body));
});
