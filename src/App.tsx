import React from 'react';
import { SnowplowWrapper } from './tracking';

function initialize(anonymous: boolean) {
  let trackerWrapper = new SnowplowWrapper("t1", false, {
    areSnowplowCookiesEnabled: () => anonymous,
  });
  trackerWrapper.initTracker();
  trackerWrapper.track();
  trackerWrapper.sendPageViewEvent();
}

function App() {
  return (
    <div className="App">
      <h1>Hello</h1>

      <h2>Click the buttons below to initialize the tracker and track an event</h2>

      <button onClick={() => initialize(false)}>Anonymous tracking</button>
      <br />
      <br />
      <button onClick={() => initialize(true)}>Non-anonymous tracking</button>
    </div>
  );
}

export default App;
