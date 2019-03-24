import { diff } from "atlas-relax";
import { t } from "atlas-relax-jsx-pragmas";
import DOMRenderer from "atlas-mini-dom";

const minInterval = 0, maxInterval = 5e3;
// force the number to be in [minInterval, maxInterval]
const sanitize = v => Math.min(Math.max(Number(v), minInterval), maxInterval);
const doPeriodicPollJob = () => console.log("we're polling something!");

const PollingApp = (temp, node) => {
  // initialize polling interval and count state on first render
  if (node.count == null) node.count = 0;
  if (node.period == null) node.period = 1e3;
  // queue up next render after period has elapsed (hence periodic job)
  node.diff(node.period)
  // increment the job count number
  node.count++;
  // do some job
  doPeriodicPollJob();
  // event handler
  const updateInterval = event => {
    // update the polling interval
    node.period = sanitize(event.target.value);
    // immediately queue up another poll job 
    node.diff(0);
  }
  // return dom (could use fragments like <>...</>!)
  return [
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
