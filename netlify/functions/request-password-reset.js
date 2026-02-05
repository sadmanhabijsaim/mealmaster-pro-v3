exports.handler = async function() {
  return {
    statusCode: 410,
    body: JSON.stringify({ success: false, message: 'Password reset endpoint removed. Admin manages passwords directly.' })
  };
};
