const isValidUpdate = (body, allowedUpdates) => {
  const updateKeys = Object.keys(body);
  return updateKeys.every((updateKey) => allowedUpdates.includes(updateKey));
};

module.exports = isValidUpdate;
