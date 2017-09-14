
function square(num) {
  return Math.pow(num, 2);
}

onmessage = function (event) {
  var n = parseInt(event.data);

  postMessage(square(n));
};