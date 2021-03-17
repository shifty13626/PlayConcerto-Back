const expressLoader = require('./express');

module.exports = async (app, config) => {
  
    await expressLoader(app, config);
    console.log('✌️ Express loaded');
  };