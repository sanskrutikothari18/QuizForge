const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const Module = require('module');

function loadServerModule() {
  const modulePath = path.join(__dirname, '..', 'server.js');
  delete require.cache[require.resolve(modulePath)];

  let listenCalled = false;
  let listenArgs = null;

  const fakeApp = {
    use() {},
    get() {},
    set() {},
    listen(port, host, cb) {
      listenCalled = true;
      listenArgs = { port, host, cb };
      if (typeof cb === 'function') cb();
      return fakeApp;
    }
  };

  const expressFactory = () => fakeApp;
  expressFactory.json = () => (req, res, next) => next();

  const originalLoad = Module._load;
  Module._load = function(request, parent, isMain) {
    if (request === 'mongoose') {
      return {
        connect: () => Promise.reject(new Error('MONGO_URI is undefined'))
      };
    }
    if (request === 'express') return expressFactory;
    if (request === 'dotenv') return { config() {} };
    if (request === 'cors') return () => (req, res, next) => next();
    if (request === './routes/authRoutes') return {};
    if (request === './routes/gameRoutes') return {};
    if (request === './routes/quizRoutes') return {};
    if (request === './routes/resultRoutes') return {};
    if (request === './socket/index') return () => {};
    return originalLoad.apply(this, arguments);
  };

  try {
    require(modulePath);
    return { listenCalled, listenArgs };
  } finally {
    Module._load = originalLoad;
  }
}

test('server still starts listening when MongoDB connection fails', () => {
  const { listenCalled } = loadServerModule();
  assert.equal(listenCalled, true);
});
