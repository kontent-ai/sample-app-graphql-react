export default function GraphQLLoader(props) {
  if (props.error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`Error while fetching data: ${props.error}`);
      return (
        <div>
          <h2>Error</h2>
          <pre>{JSON.stringify(props.error, undefined, 2)}</pre>
        </div>
      );
    }
    return <h2>Error while fetching data</h2>;
  }

  if (props.loading) {
    return "loading...";
  } else {
    return null;
  }
}
