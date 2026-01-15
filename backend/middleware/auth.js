const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token, authorization denied'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

// Middleware to check if user has required role
const requireRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRole = req.user.role;

    // Convert single role to array for consistency
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
        requiredRoles: roles,
        userRole: userRole
      });
    }

    next();
  };
};

// Specific role middlewares
const requireAdmin = requireRole('administrateur');
const requireClient = requireRole('client');
const requireAdminOrClient = requireRole(['administrateur', 'client']);

// Middleware to check ownership (users can only access their own data)
const requireOwnership = (req, res, next) => {
  const userId = req.params.userId || req.params.id;
  const currentUserId = req.user.id;

  // Admins can access any data
  if (req.user.role === 'administrateur') {
    return next();
  }

  // Clients can only access their own data
  if (req.user.role === 'client' && userId === currentUserId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied. You can only access your own data.'
  });
};

module.exports = {
  auth,
  requireRole,
  requireAdmin,
  requireClient,
  requireAdminOrClient,
  requireOwnership
};