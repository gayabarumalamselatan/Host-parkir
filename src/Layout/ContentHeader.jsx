import PropTypes from "prop-types";
import { Fragment } from "react";

const ContentHeader = ({ title }) => {
  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1 className="fw-medium primary-text-color">{title}</h1>
          </div>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-end">
              <li className="breadcrumb-item">
                <a
                  className="primary-text-color"
                  style={{ textDecoration: "none" }}
                  href="/"
                >
                  Home
                </a>
              </li>
              <li className="breadcrumb-item active">{title}</li>
            </ol>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

ContentHeader.propTypes = {
  title: PropTypes.string,
};

export default ContentHeader;
