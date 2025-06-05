import { Fragment } from "react";
import Charts from "../Components/Charts";

const Home = () => {

  return (
    <Fragment>
      <div className="p-5 mb-4 jumbotron-bg">
        <div id="jumbo" className="container-fluid py-5">
          <h1 id="jumbo" className="fw-bold">
            Hello Admin!
          </h1>
        </div>
      </div>
      <div className="mt-5">
        <Charts/>
      </div>
    </Fragment>
  );
};

export default Home;
