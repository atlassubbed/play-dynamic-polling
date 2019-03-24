import { diff } from "atlas-relax";
import { t } from "atlas-relax-jsx-pragmas";
import DOMRenderer from "atlas-mini-dom";

// this line is needed for codesandbox
// (they do not support custom pragmas; see .babelrc's "pragma")
window.React = { createElement: t }

const minInterval = 0, maxInterval = 5e3;
// force the number to be in [minInterval, maxInterval]
const sanitize = v => Math.min(Math.max(Number(v), minInterval), maxInterval);
const doPeriodicPollJob = () => console.log("we're polling something!");

const PollingApp = (temp, node) => {
  if (node.count == null) node.count = 0; // init count
  if (node.period == null) node.period = 1e3; // init period
  node.diff(node.period) // queue next poll job (i.e. render)
  node.count++; // we're rendering, increment the poll job count
  doPeriodicPollJob(); // do actual job
  const updateInterval = event => {
    node.period = sanitize(event.target.value); // update poll interval
    node.diff(0); // queue up next poll job immediately
  }
  return [ // return DOM (could use fragments <>...</> if desired)
    <p>
      Polled {node.count} times
    </p>,
    <label for="poll">Polling interval: </label>,
    <input 
      type="number" min={minInterval} max={maxInterval} value={node.period} 
      onInput={updateInterval}/>
  ]
}
const container = document.getElementById("root");
diff(<PollingApp/>, null, new DOMRenderer(container));
