// Netlify Functions placeholder
// Backend should be deployed separately on Heroku or Railway

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Backend API running on separate service' })
  };
};
