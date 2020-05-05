/**
 * Main controller file with some example routes.
 */
export const getHomePage = function (req, res) {
  res.render('index', { title: 'My awesome page' });
};

export const getSampleJSON = function (req, res) {
  res.status(200).json({ foo: 'bar' });
};
