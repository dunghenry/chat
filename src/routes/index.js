const site = require('./site.route');
const routes = (app) => {
    app.use('/', site);
};

module.exports = routes;
