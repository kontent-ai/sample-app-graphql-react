import { Layout } from ".";
function UnknownComponent(props) {
  if (props.useLayout) {
    return (
      <Layout {...props}>
        <div>
          <h2>UNKNOWN COMPONENT</h2>
          {props.children}
        </div>
      </Layout>
    );
  }

  return (
    <div>
      <h2>UNKNOWN COMPONENT</h2>
      {props.children}
    </div>
  );
}

export default UnknownComponent;