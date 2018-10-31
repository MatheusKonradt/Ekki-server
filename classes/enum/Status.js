const Enum = require('./Enum');

/**
 * @property {Status} DRAFTED
 * @property {Status} PUBLISHED
 * @property {Status} ARCHIVED
 * @property {Status} DELETED
 * @property {Status} CREATED
 * @property {Status} CANCELED
 * @property {Status} EXECUTED
 */
class Status extends Enum { }
Status.enum(
  'DRAFTED', 'PUBLISHED', 'ARCHIVED', 'DELETED',
  'CREATED', 'CANCELED', 'EXECUTED'
);

module.exports = Status;
