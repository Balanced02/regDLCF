import React from "react";
import Loadable from "react-loadable";
import ReactLoading from "react-loading";

import DefaultLayout from "./containers/DefaultLayout";

function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        marginTop: "-50px"
      }}
    >
      <ReactLoading type="spokes" color="#20a8d8" className="centerLoading" />
    </div>
  );
}

const ParticipantList = Loadable({
  loader: () => import("./views/Base/ParticipantList"),
  loading: Loading
});

const Dashboard = Loadable({
  loader: () => import("./views/Dashboard"),
  loading: Loading
});

const NewParticipant = Loadable({
  loader: () => import("./views/Base/NewParticipant/index.jsx"),
  loading: Loading
});

const routes = [
  { path: "/", exact: true, name: "Home", component: DefaultLayout },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  {
    path: "/participantList",
    name: "Product List",
    component: ParticipantList
  },
  {
    path: "/addParticipant",
    name: "Register Participant",
    component: NewParticipant
  }
];

export default routes;
