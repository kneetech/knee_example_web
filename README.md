# knee_example_web

Пример веб-приложения написанный с использованием knee

## Запуск

Демонстрационное веб-приложение можно запустить сдледующей командой

```
npm install
NODE_PATH=/path/to/project node node_modules/.bin/knee config/default
```

Так же для работы потребуется рабочий сервер MongoDB. 

Если имя базы и коллекции можно поменять в `config/default.js`

## Описание приложения

Приложение представляет из себя простой веб-сервер на express, который по умолчанию будет слушать `localhost:8080`.

Описание директорий проекта
```
./config                Директория с конфигурациями
./libs                  Библиотеки
./modules               Модули
./view                  HTML-Шаблоны
```
На единственной странице сайта расположен счётчик и ссылка для его инкрементации. При переходе по ссылке, будет вызван
метод контроллера который инкрементирует счётчик.

## Как устроено приложение

Точкой входа в приложение является сам пакет `knee`, которому в качестве параметра передаётся путь к файлу-конфигурации
приложения.

```
NODE_PATH=$(pwd) node ./node_modules/.bin/knee config/default 
```

Структура модулей описанная в файле `config/default.js`

```
#0 Корневой модуль (он всегда есть и он всегда один)
 |- #1 Модуль базы данных ./modules/db.js
 |- #2 Веб-сервер ./modules/server.js
     |- #3 Контроллер controller.main ./modules/controllers/main.js
         |- #4 Модуль базы данных
```

Сначала инициализируется корневой модуль, затем его подмодули. В итоге порядок инициализации будет таким

```
#1 Модуль базы данных ./modules/db.js
#4 Модуль базы данных
#3 Контроллер controller.main ./modules/controllers/main.js
#2 Веб-сервер ./modules/server.js
#0 Корневой модуль (он всегда есть и он всегда один)
```
