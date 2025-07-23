const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

router.get('/', async function (req, res, next) {
  const isAuth = req.isAuthenticated();
  if (!isAuth) {
    return res.render('index', {
      title: 'ToDo App',
      isAuth: isAuth,
    });
  }

  const userId = req.user.id;
  const q = req.query.q; // キーワード
  const deadline = req.query.deadline; // 日付

  // 全体タスク
  let allTasks = await knex("tasks")
    .select("*")
    .where({user_id: userId})
    .orderBy([
      { column: 'is_done', order: 'asc' },
      { column: 'deadline', order: 'asc' }, 
      { column: 'deadline_time', order: 'asc' }
    ]);

  // 検索条件がある場合のみ検索結果を取得
  let searchResults = null;
  if (q || deadline) {
    let searchQuery = knex("tasks")
      .select("*")
      .where({user_id: userId});
    if (q) {
      searchQuery = searchQuery.andWhere('content', 'like', `%${q}%`);
    }
    if (deadline) {
      searchQuery = searchQuery.andWhere('deadline', deadline);
    }
    searchResults = await searchQuery
      .orderBy([
        { column: 'is_done', order: 'asc' },
        { column: 'deadline', order: 'asc' }, 
        { column: 'deadline_time', order: 'asc' }
      ]);
  }

  res.render('index', {
    title: 'ToDo App',
    todos: allTasks,
    searchResults: searchResults,
    isAuth: isAuth,
    q: q,
    searchDeadline: deadline,
  });
});

router.post('/', function (req, res, next) {
  const isAuth = req.isAuthenticated();
  const userId = req.user.id;
  const todo = req.body.add;
  const deadline = req.body.deadline;
  const deadline_time = req.body.deadline_time;
  knex("tasks")
    .insert({user_id: userId, content: todo, deadline: deadline, deadline_time: deadline_time})
    .then(function () {
      res.redirect('/')
    })
    .catch(function (err) {
      console.error(err);
      res.render('index', {
        title: 'ToDo App',
        isAuth: isAuth,
        errorMessage: [err.sqlMessage],
      });
    });
});

//タスク完了状態の切り替え用ルート（必要に応じて追加してください）
router.post('/toggle/:id', async function(req, res, next) {
  const todoId = req.params.id;
  const isDone = req.body.is_done ? 1 : 0;
  await knex("tasks").where({ id: todoId }).update({ is_done: isDone });
  res.redirect('/');
});

router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
router.use('/logout', require('./logout'));

module.exports = router;