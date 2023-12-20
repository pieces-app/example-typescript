import { connect } from './Connect';; // Import the Promise type

const launchPiecesOS = () => {
  const url: string = 'pieces://launch';
  try {
    const isPiecesOSConnected = navigator.userAgent.includes('PiecesOS');
    if (isPiecesOSConnected) {
      console.log("Pieces OS is already connected.");
      // Perform any additional actions for connected state
    } else {
      window.open(url, '_blank');
      console.log("Pieces OS is installed.");
      window.location.reload();// Refresh the page
    }
  } catch {
    console.error("Pieces OS is not installed.");
  } // Add a missing closing parenthesis and semicolon here
}
export { launchPiecesOS };