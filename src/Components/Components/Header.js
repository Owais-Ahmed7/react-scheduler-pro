import React, { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Row,
  Col,
} from "reactstrap";
import moment from "moment";

const Header = (props) => {
  const handleNext = () => {
    if (props.layout === "month") {
      // props.getMonthDates(
      //   moment(props.monthDates[props.monthDates?.length - 1])
      //     .clone()
      //     .add(1, 'days'),
      //   'next'
      // );
      props.setTrackMonth(moment(props.trackMonth).add(1, "month"));
      props.getMonthDates(
        // moment(props.monthDates[0]).subtract(1, 'days'),
        "next"
      );
    }
    if (props.layout === "week") {
      props.getWeekDates(
        moment(props.weekDates[props.weekDates?.length - 1])
          .clone()
          .add(1, "days"),
        "next"
      );
    }
    if (props.layout === "day") {
      props.getDay(props.day, "next");
    }
  };

  const handlePrevios = () => {
    if (props.layout === "month") {
      props.setTrackMonth(moment(props.trackMonth).subtract(1, "month"));
      props.getMonthDates(
        // moment(props.monthDates[0]).subtract(1, 'days'),
        "prev"
      );
    }
    if (props.layout === "week") {
      props.getWeekDates(
        moment(props.weekDates[0]).subtract(1, "days"),
        "prev"
      );
    }
    if (props.layout === "day") {
      props.getDay(props.day, "prev");
    }
  };

  const handleTodayDate = () => {
    props.setDay(moment());
  };

  const currentMonth = () => {
    if (props.layout === "month")
      return moment(props.trackMonth).format("D MMMM YYYY");
    if (props.layout === "week")
      return moment(props.weekDates[0]).format("MMMM YYYY");
    if (props.layout === "day") return moment(props.day).format("D MMMM YYYY");
  };

  /* settings dropdown */
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  /* filter appointments by doctor */
  const [filterDropdown, setFilterDropdown] = useState(false);
  const toggleFilterDropdown = () => setFilterDropdown(!filterDropdown);

  return (
    <React.Fragment>
      <div>
        <Row className="align-items-center">
          {/* <div>{props.title || "Brand Title"}</div> */}
          <Col className="mb-3" xs={12} md={6}>
            <Dropdown
              isOpen={filterDropdown}
              toggle={toggleFilterDropdown}
              direction={"down"}
            >
              <DropdownToggle size="sm" outline color="primary" caret>
                Filter Appointments
              </DropdownToggle>
              <DropdownMenu>hello</DropdownMenu>
            </Dropdown>
          </Col>
          <Col xs={12} md={6}>
            <Row>
              <Col xs={12} md={12} lg={4} className="mb-3 align-items-center">
                <div className="d-flex align-items-center justify-content-center">
                  <button
                    className="btn btn-sm btn-light pe-auto"
                    onClick={handlePrevios}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-caret-left"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z" />
                    </svg>
                  </button>
                  <span className="ms-3 me-3 text-nowrap font-size-14 text-center">
                    {currentMonth()}
                  </span>
                  <button
                    className="btn btn-sm btn-light pe-auto"
                    onClick={handleNext}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-caret-right"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
                    </svg>
                  </button>
                </div>
              </Col>
              <Col xs={12} md={12} lg={4} className="mb-3">
                <div className="d-flex justify-content-center">
                  <div className="ms-3">
                    <button
                      onClick={() => {
                        props.setLayout("day");
                        handleTodayDate();
                      }}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Today
                    </button>
                  </div>
                  <div className="ms-3">
                    <div className="btn-group" role="group">
                      <button
                        onClick={() => props.setLayout("day")}
                        style={{
                          backgroundColor:
                            props.layout === "day" ? "#1e90ff" : null,
                          color: props.layout === "day" ? "#FFF" : null,
                        }}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Day
                      </button>
                      <button
                        onClick={() => props.setLayout("week")}
                        style={{
                          backgroundColor:
                            props.layout === "week" ? "#1e90ff" : null,
                          color: props.layout === "week" ? "#FFF" : null,
                        }}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Week
                      </button>
                      <button
                        onClick={() => props.setLayout("month")}
                        style={{
                          backgroundColor:
                            props.layout === "month" ? "#1e90ff" : null,
                          color: props.layout === "month" ? "#FFF" : null,
                        }}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Month
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
              <Col className="mb-3 text-center" xs={12} md={12} lg={4}></Col>
            </Row>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Header;
