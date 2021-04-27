import React from "react";
import ReactDOM from "react-dom";

class ErrorCatcher extends React.Component {
  state = { error: null };

  componentDidCatch(error, info) {
    console.log("[componentDidCatch]", error);
    this.setState({ error: info.componentStack });
  }

  render() {
    if (this.state.error) {
      return <div>An error occured: {this.state.error}</div>;
    }
    return this.props.children;
  }
}

class LifecycleDemo extends React.Component {
  state = { counter: 0 };

  constructor(props) {
    super(props);
    console.log("[constructor]");
    console.log(" State already set:", this.state);
  }

  componentDidMount() {
    console.log("[componentDidMount]", "Mounted.");
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("[getDerivedStateFromProps]");
    console.log(" Next props:", nextProps);
    console.log(" Prev state:", prevState);
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("[shouldComponentUpdate]", "Deciding to update");
    return true;
  }

  getSnapshotBeforeUpdate(nextProps, nextState) {
    console.log("[getSnapshotBeforeUpdate]", "About to update...");
    return `Time is ${Date.now()}`;
  }
  // Called after render() and after updating the DOM. The whole
  // render/commit/update cycle is done.
  //
  // This is a good time to check if a prop has changed,
  // by checking prevProps.whatever === this.props.whatever.
  // Useful for re-fetching data when a record ID changes.
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("[componentDidUpdate]", "Updated.");
    console.log(" snapshot:", snapshot);
  }
  // Called right before the component is unmounted
  // Time to clean up! Remove any event listeners, cancel
  // timers, etc.
  componentWillUnmount() {
    console.log("[componentWillUnmount]", "Goodbye cruel world.");
  }
  handleClick = () => {
    this.setState({
      counter: this.state.counter + 1,
    });
  };
  causeErrorNextRender = () => {
    // Set a flag to cause an error on the next render
    // This will cause componentDidCatch to run in the parent
    this.setState({
      causeError: true,
    });
  };
  render() {
    console.log("[render]");
    if (this.state.causeError) {
      throw new Error("oh no!!");
    }
    return (
      <div>
        <span>Counter: {this.state.counter}</span>
        <button onClick={this.handleClick}>Click to increment</button>
        <button onClick={this.causeErrorNextRender}>Throw an error</button>
      </div>
    );
  }
}
ReactDOM.render(
  <ErrorCatcher>
    <LifecycleDemo />
  </ErrorCatcher>,
  document.querySelector("#root")
);
