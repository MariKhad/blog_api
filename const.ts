const USER_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhlbHAxMUB0ZXN0LmNvbSIsImlhdCI6MTcwODY5MTE0M30.Af5ZPILMeu84_5irBFw8_anK3ijMiNW-AbzyjMIwm2E';

const ADMIN_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwiaWF0IjoxNzA4NjkxMzc4fQ.e9pW0sJClbDopGHNjCEig7u9iVAW9hUuW__UJvsiW0s';

export const ERRORS = {
  WRONG_EMAIL: 'Incorrect email',
  RECORD_FAIL: 'Fail to record file',
  WRONG_ID: 'Incorrect id',
  WRONG_PASS_LENGTH: 'Not less than 4 and not more than 16 characters',
  WRONG_ARTICLE_LENGTH: 'Not less than 50 and not more than 2000 characters',
  WRONG_TITLE_LENGTH: 'Not less than 10 and not more than 150 characters',
  NOT_STRING: 'should be string',
  USER_EXISTS: 'User with this email is already exists',
  VALIDATION_FAIL: 'Incorrect email or password',
  USER_OR_ROLE_NOT_FOUND: 'User or role are not found',
  ROLE_NOT_FOUND: 'Role is not found',
  USER_NOT_FOUND: 'User is not found',
  AUTHORIZATION_FAIL: 'User is not authorized',
  NO_ACCESS: 'Access denied',
  TOKEN_EXPIRED: 'Token has expired',
};

export const DEFAULTS = {
  ROLE: 'admin',
  AVATAR: 'default_avatar.png',
  PLACEHOLDER: 'default_placeholder.avif',
  REPLACEMENT: '-',
  PAG_LIMIT: 10,
};

export const FIELDS = {
  TITLE: 'title',
  SLUG: 'slug',
  CONTENT: 'content',
  EMAIL: 'email',
  PASSWORD: 'password',
  USERNAME: 'username',
};
