export function handlePermission() {
  return navigator.permissions
    .query({ name: "notifications" })
    .then(permissionQuery)
    .catch(permissionError);
}

function permissionQuery(result) {
  console.debug({ result });
  var newPrompt;

  if (result.state == "granted") {
    // notifications allowed, go wild
  } else if (result.state == "prompt") {
    // we can ask the user
    newPrompt = Notification.requestPermission();
  } else if (result.state == "denied") {
    // notifications were disabled
  }

  result.onchange = () => console.debug({ updatedPermission: result });

  return newPrompt || result;
}

function permissionError(error) {
  console.error(error);
}
