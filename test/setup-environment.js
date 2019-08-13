'use strict';

module.exports = () => {
    process.env.PORT = 9090;
    process.env.VCAP_SERVICES = '{"postgresql":[{"credentials":{"uri":"postgres://postgres@localhost:6543/postgres"}}]}';
};
