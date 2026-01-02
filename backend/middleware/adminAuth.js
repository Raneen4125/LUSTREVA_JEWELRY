// Backend middleware for admin routes
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'jewelry_super_secret_key_2025', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    // Check if user is admin
    const q = "SELECT role FROM users WHERE id = ?";
    db.query(q, [user.id], (err, data) => {
      if (err || data.length === 0) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
      
      if (data[0].role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      
      req.user = user;
      next();
    });
  });
};

module.exports = adminAuth;