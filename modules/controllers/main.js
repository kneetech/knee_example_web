const Controller = require('libs/controller');

/**
 * Контроллер
 */
class MainController extends Controller {

  /**
   * Мапинг url на методы
   */
  static router() {
    return {
      'GET /': 'index',
      'GET /inc': 'inc'
    };
  }

  index() {
    /**
     * Откда здесь коллекция базы?
     *
     * 1. В конфигурации приложения `config/default.js` описано что, данный модуль имеет подмодуль `db`
     * 2. У модуля `db` в стандарных опциях описано как он будет включён в родительский модуль (в данном случае контроллер)
     *
     * То есть `this.collection` здесь из-за того, что к этому контроллеру был подключен соответствующий модуль
     */
    return this.collection
      .findOne({})
      .then((record) => {
        if (!record) {
          return 1;
        }

        return record.value;
      })
      .then((count) => {
        return this.render('main', { count });
      });
  }

  inc() {

    return this.collection
      .findOne({})
      .then((record) => {

        if (!record) {
          return this.collection.insert({ value: 1 });
        }

        return this.collection.update({}, { $inc: { value: 1 } });
      })
      .then(() => {
        this.response.redirect('/');
      });

  }
}

module.exports = MainController;
