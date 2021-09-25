const psl = require('psl');

/**
 *
 */
const parseDomain = (data = []) => {
  try {
    return data[1];
  } catch (e) {
    return null;
  }
}

const handleErrorParent = (res = {}, message = '', code = 401) => {
  res.status(code).json({
    errors: {
      msg: message
    }
  })
}

exports.checkDomain = async (req, res, next) => {
  try {
    // console.log('Usuario desde el chek domain: ', requ.user)
    const origin = req.get('origin');
    const habolt_origin = req.user.tenantId
    const re = /^(?:https?:)?(?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/ig;
    const result = re.exec(origin);
    const rawDomain = parseDomain(result);
    const clean = psl.parse(rawDomain);
    // req.clientAccount = clean.subdomain;
    req.clientAccount = habolt_origin;
    console.log('Tenant desde la peticion cambiada nuevo: ', req.clientAccount)

    next();
  } catch (e) {
    req.clientAccount = null;
    next();
  }
}


exports.checkTenant = async (req, res, next) => {
  try {

    // Redis cache enabled by env variable
    if (process.env.USE_REDIS === 'true') {
      const getExpeditiousCache = require('express-expeditious')
      const cache = getExpeditiousCache({
        namespace: req.clientAccount,
        defaultTtl: '5 minute',
        sessionAware: false,
        engine: require('expeditious-engine-redis')({
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT
        })
      })
      cache
        .withNamespace(req.clientAccount)
        .withTtlForStatus('1 minute', 404);
    }
    next();
  } catch (e) {
    next();
  }
}