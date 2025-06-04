export default function inIframe() {
  if ( window.location !== window.parent.location ) {
    return true;
  }

  return false;
}
