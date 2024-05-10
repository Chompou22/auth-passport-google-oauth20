const dashboard = (req, res) => {
  if (req.session.user && req.session.user.username && req.session.user.email) {
    return res.json({ valid: true, user: req.session.user });
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default dashboard;
