import { connect } from './Connect';; // Import the Promise type

const launchPiecesOS = async () => {
  const url: string = 'pieces://launch';
  try {
    const isPiecesOSConnected = navigator.userAgent.includes('PiecesOS');
    if (isPiecesOSConnected) {
      console.log("Pieces OS is already connected.");
      // Perform any additional actions for connected state
    } else {
      await window.open(url, '_blank');
      console.log("Pieces OS is installed.");
      window.location.reload();// Refresh the page
    }
  } catch {
    console.error("Pieces OS is not installed.");
  }
  finally {
    connect().then((data: JSON) => {
      // define the indicator now that it exists.
      const _indicator = document.getElementById("indicator");

      // conditional for the response back on application.
      //
      // (1) first @jordan-pieces came in here and added this turing statement here inside a new
      // if statement. this is an upgrade in comparison to the previous if statement that would not check to
      // see if the _indicator itself is added to the DOM yet.
      if (_indicator != null) {
        _indicator != undefined ? _indicator.style.backgroundColor = "green" : _indicator.style.backgroundColor = "red";
      }
      _indicator.firstElementChild.innerHTML = _indicator != undefined ? "You're Connected!" : "You're Not Connected";
    })
  } // Add a missing closing parenthesis and semicolon here
}
export { launchPiecesOS };