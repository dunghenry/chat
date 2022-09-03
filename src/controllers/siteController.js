class SiteController {
    static getHomePage(req, res) {
        res.render('index', { title: 'Home Page' });
    }
}
module.exports = SiteController;
