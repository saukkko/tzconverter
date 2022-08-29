import React, { useState } from "react";

function App() {
  const [time, setTime] = useState(new Date());

  const updateTime = () => setInterval(() => setTime(new Date()), 1000);

  updateTime();
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <pre>{(time.getTime() / 1000).toFixed(0)}</pre>
      </header>
    </div>
  );
}

export default App;
