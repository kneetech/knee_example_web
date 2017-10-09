const Knee = require('knee');
const express = require('express');

/**
 * Модуль веб-сервера
 */
class Server extends Knee {

  /**
   * Конструктор
   */
  initialize() {
    this.express = express();
    this.router = express.Router();

    // та или иная логика загрузки котроллеров
    this.loadCustomControllers();

    this.express.use(this.router);

    return new Promise((resolve, reject) => {
      this.express.listen(this.port, this.host, (error) => {
        if (error) {
          return reject(error);
        }

        console.log(`Server listening ${this.host}:${this.port}`);
        resolve();
      });
    });
  }

  /**
   * Загрузка контроллеров из модулей, имя которых начинается с `controller.`
   */
  loadCustomControllers() {
    for (let name in this) {
      if (this.hasOwnProperty(name) && name.substr(0, this.prefix.length) === this.prefix) {
        let controller = this[name];
        let controllerName = name.substr(this.prefix.length);

        if (typeof controller.constructor.router === 'function') {
          let routes = controller.constructor.router();

          for (let key in routes) {
            if (routes.hasOwnProperty(key)) {
              let handlerName = routes[key];

              if (controller.hasOwnProperty(handlerName)) {
                throw new Error(`Controller ${controller.constructor.name} has no handler ${handlerName}`);
              }

              if (typeof controller[handlerName] !== 'function') {
                throw new Error(`Value ${controller.constructor.name}.${handlerName} is not function`);
              }

              let [methods, path] = key.split(/\s+/);
              methods = methods.split(/\s*,\s*/);

              for (let i = 0; i < methods.length; i++) {
                let methodName = methods[i].toLowerCase();
                this.router[methodName](path, this.handlerWrapper(controller, controller[handlerName]));
              }

              console.log(`Used ${controllerName}.${handlerName} for ${methods.join().toUpperCase()} ${path}`);
            }
          }
        } else {
          throw new Error(`Controller ${controller.constructor.name} has no router`);
        }
      }
    }
  }

  handlerWrapper(controller, handler) {
    return (request, response) => {
      return controller.entryPoint(handler, request, response)
    };
  }
}

Server.defaults = {
  host: 'localhost',
  port: 8080,

  // логика этого модуля работает таким образом, что
  // все подмодули с имененм начинающимся с `controller.`
  // будут считаться контроллерами
  prefix: 'controller.'
};

module.exports = Server;