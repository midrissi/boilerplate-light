/**
 * Guest role
 * @type {Array}
 */
const guest = [
  'core:checks:ok',
];

/**
 * User role
 * @type {Array}
 */
const user = [
  'core:checks:ok',
];

/**
 * Admin role
 * @type {Array}
 */
const admin = [
  ...user,
];

/**
 * All roles
 */
module.exports = [
  {
    name: 'guest',
    protected: true,
    title: 'Guest role',
    description: 'Role given for any unauthenticated user, or users who don\'t have any role.',
    iams: guest,
  },
  {
    name: 'user',
    protected: true,
    iams: user,
    title: 'User role',
    description: 'The default role.',
  },
  {
    name: 'admin',
    protected: true,
    iams: admin,
    title: 'Admin role',
    description: 'Given to advanced users.',
  },
];
