import { useState, useEffect } from "react";
import deliveryClient from "./KontentDeliveryClient";

function Home({ itemCodename }) {
  const [item, setItem] = useState(null);

  async function fetchKontentItem(itemCodename) {
    const response = await deliveryClient.item(itemCodename)
      .toPromise();
    setItem(response.item);
  }

  useEffect(() => {
    fetchKontentItem(itemCodename);
  }, [itemCodename]);

  if (!item) {
    return "loading...";
  }


  return (
    <>
      <code><pre>
        {JSON.stringify(item, undefined, 2)}
      </pre></code>
    </>
  )
}

export default Home
