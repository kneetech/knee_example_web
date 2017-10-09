const Knee = require('knee');
const mongodb = require('mongodb');

/**
 * Модуль для работы с БД
 */
class Db extends Knee {

  /**
   * Конструктор модуля
   * @returns {Promise}
   */
  initialize() {
    let client = mongodb.MongoClient();

    // можно вернуть Promise и это будет учтено
    return new Promise((resolve, reject) => {
      client.connect(this.getConnectUrl(true))
        .then((db) => this.db = db)
        .then(() => console.log(`mondogdb: connect to ${this.getConnectUrl()}`))
        .then(resolve)
        .catch(reject);
    });
  }

  getConnectUrl(withCredentials = false) {
    return `mongodb://${(withCredentials ? [this.username, this.password] : []).join(':')}@${this.host}:${this.port}/${this.database}`;
  }
}

/**
 * Конфигурация модулья по-умолчанию
 * Все эти опции можно переопределить в config/default.js в блоке с подключением этого модуля
 */
Db.defaults = {

  // как этот модуль будет опубликован в родительском модуле
  __basename: {
    collection(instance) {
      return instance.db.collection(instance.collection);
    }
  },

  host: 'localhost',
  port: 27017
};

// экспорт модуля
module.exports = Db;