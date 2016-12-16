var router = require('koa-router')();
var db = require('../database/db');

router.get('/', async function (ctx, next) {
  if (ctx.session.isNew)
    await ctx.render('signin');
  else {
    await ctx.redirect('index')
  }
});
router.post('/', async (ctx, next) => {
  let form = ctx.request.body;
  form.password = require('md5')(form.password);
  if ((await db.signin(form)).length) {
    ctx.session.username = form.username;
    console.log('signin successful!');
    await ctx.redirect('index')
  }
  else {
    console.log('password or username incorrect!');
    await ctx.render('error', form);
  }
});

router.get('signup', async (ctx, next) => {
    await ctx.render('signup');
});
router.post('signup', async (ctx, next) => {
    var form = ctx.request.body;
    form.password = require('md5')(form.password);
    await db.signup(form);
    ctx.session.username = form.username;
    console.log('signup successful!');
    ctx.redirect('index');
});

router.get('index', async function (ctx, next) {
  if (ctx.session.isNew) {
    await ctx.redirect('/');
  }
  ctx.cookies.set('page', 0);
  await ctx.render('index');
});
router.post('index', async function (ctx, next) {
  let content = ctx.request.body;
  content.time = Date.now();
  content.user = ctx.session.username;
  content.title = await db.saveabstract(content);
  await db.savepost(content);
  ctx.redirect('index');
});

router.get('signout', async function (ctx, next) {
  ctx.session = null;
  ctx.redirect('/');
});

// APIs
router.all('ajax/username', async function (ctx, next) {
  ctx.response.body = ctx.session.username;
});

router.get('ajax/getabstract', async (ctx, next) => {
  if (ctx.session.isNew) {
    ctx.response.body = [];
    return;
  }
  ctx.response.body = await db.getabstract(ctx.query.page);
});

router.get('ajax/maxpage', async (ctx, next) => {
  if (ctx.session.isNew) {
    ctx.response.body = 0;
    return;
  }
  ctx.response.body = await db.getabstractcount();
});

router.get('ajax/maxposts', async (ctx, next) => {
  if (ctx.session.isNew) {
    ctx.response.body = 0;
    return;
  }
  ctx.response.body = await db.getpostcount(ctx.session.postid);
});

router.get('reply', async (ctx, next) => {
  if (ctx.session.isNew) {
    ctx.response.body = 0;
    return;
  }
  // ctx.response.body = ctx.query.id;
  ctx.session.postid = ctx.query.id || ctx.session.postid;
  await ctx.render('reply');
});
router.post('reply', async function (ctx, next) {
  let content = ctx.request.body;
  content.time = Date.now();
  content.user = ctx.session.username;
  content.postid = ctx.session.postid;
  await db.savepost(content);
  await db.updateabstract(content);
  ctx.redirect('reply');
});

router.all('ajax/title', async function (ctx, next) {
  ctx.response.body = (await db.gettitle(ctx.session.postid)).title;
  // console.log(ctx.response.body);
});

router.all('ajax/getpost', async function (ctx, next) {
  let query = {
    page: ctx.query.page
  };
  query.postid = ctx.session.postid;
  ctx.response.body = await db.getpost(query);
});

module.exports = router;
