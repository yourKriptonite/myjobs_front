const pathsWithId = [
  '/profile',
  '/vacancy',
  '/resume'
];

export class Router {
  constructor (root) {
    this.root = root;
    this.routes = new Map();

    this.currentRoute = null;

    window.onpopstate = _ => {
      if (window.location.pathname) {
        this.route(window.location.pathname, false);
      }
    };

  }

  /**
   * Переход на страницу path с нужными даннами data для неё
   * @param {String} path
   * @param {Object} data
   */
  redirect (path, data = {}) {
    this.route(path, data, true);
  }
  
  /**
   * Добавление на path нужный controller
   * @param {String} path
   * @param {Controller} controller
   */
  add (path, controller) {
    this.routes.set(path, controller);
  }

  route (path, addToHistory = true, data = {}) {
    const currentController = this.routes.get(this.currentRoute);
    if (currentController) {
      currentController.close();
    }

    if (addToHistory) {
      window.history.pushState(null, null, path);
    }

    const pathWithoutParameters = path.split('?')[0];
    console.log(pathWithoutParameters);
    const routePath = '/' + pathWithoutParameters.split('/')[1];

    //TODO костыль, переделать под нормальный роутинг для /vacancy/{id}
    if (this.routes.has(routePath)) {
      const controller = this.routes.get(routePath);

      if (pathsWithId.find(el => el === routePath)) {
        let id = this._extractIdFromPath(path);
        data = { id, ...data };
      }
      console.log('router-> render(data)', data);
      this.currentRoute = path;
      controller.openWithData(data);

    } else {
      if (this.routes.has(pathWithoutParameters)) {
        const controller = this.routes.get(pathWithoutParameters);
        console.log('router-> render(data)', data);
        this.currentRoute = path;
        controller.openWithData(data);
      }
      //Error 404
    }
  }

  static _normalizePath (path) {
    return path.charAt(path.length - 1) === '/' && path !== '/' ? path.slice(0, path.length - 1) : path;
  }

  start () {
    window.addEventListener('click', (ev) => {
      if (ev.target.tagName === 'A') {
        ev.preventDefault();
        this.route(Router._normalizePath(ev.target.pathname), true);
      }
    }, true);

    // window.addEventListener('popstate', (event) => {
    //   if (!history.state.url) return;
    //   this.route(history.state.url);
    // }, false);

    this.route(Router._normalizePath(window.location.pathname), false);
  }

  _extractIdFromPath (path) {
    return path.split('/').pop();
  }
}
