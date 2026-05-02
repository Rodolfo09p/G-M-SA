import { lazy } from "react";
import { FuseRouteItemType } from "@fuse/utils/FuseUtils";

const CustomerProfileView = lazy(() => import("./CustomerProfileView"));

const route: FuseRouteItemType = {
  path: "customer-profile",
  element: <CustomerProfileView />,
  auth: ["admin"],
};

export default route;
