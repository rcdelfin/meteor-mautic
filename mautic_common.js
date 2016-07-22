if (typeof Mautic === 'undefined') {
  Mautic = {};
}

isJSON = function(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};
