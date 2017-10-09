const Knee = require('knee');
const ejs = require('ejs');

/**
 * Формально это тоже модуль, но в данном случае он работает как библиотека,
 * по этому и находится в директории libs
 */
class Controller extends Knee {

  /**
   * Сюда будут приходить все запросы
   *
   * @param {function} handler
   * @param {express.Request} request
   * @param {express.Response} response
   */
  entryPoint(handler, request, response) {
    this.request = request;
    this.response = response;

    let result = handler.call(this);

    if (result instanceof Promise === false) {
      result = Promise.resolve(result);
    }

    result
      .then((data) => {
        response.send(data);
      })
      .catch((error) => {
        console.log(error);
        response.status(500);
      })
      .then(() => {
        response.end();
      });
  }

  render(template, model) {
    return new Promise((resolve, reject) => {
      ejs.renderFile(`views/${template.replace(/\.ejs$/, '')}.ejs`, model, (error, html) => {
        if (error) {
          return reject(error);
        }

        resolve(html);
      });
    });
  }
}

module.exports = Controller;