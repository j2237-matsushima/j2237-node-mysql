// Update with your config settings.

module.exports = {

  development: {
    client: "mysql",
    connection: {
      database: "todo_app",
      user: "root",
      password: "password", // 事前準備で設定したrootユーザのパスワードを入力してください
    },
    pool: {
      min: 2,
      max: 10
    },
  },

  staging: {
    client: "mysql",
    connection: {
      database: "todo_app",
      user: "root",
      password: "password", // 事前準備で設定したrootユーザのパスワードを入力してください
    },
    pool: {
      min: 2,
      max: 10
    },
  },

  production: {
    client: "mysql",
    connection: {
      database: "todo_app",
      user: "root",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10
    },
  }

};