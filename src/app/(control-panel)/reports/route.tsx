import { lazy } from "react";
import { FuseRouteItemType } from "@fuse/utils/FuseUtils";

const ReportsView = lazy(() => import("./ReportsView"));

const route: FuseRouteItemType = {
  path: "reports",
  element: <ReportsView />,
};

export default route;
