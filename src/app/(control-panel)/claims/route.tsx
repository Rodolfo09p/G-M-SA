import { lazy } from "react";
import { FuseRouteItemType } from "@fuse/utils/FuseUtils";

const ClaimsView = lazy(() => import("./ClaimsView"));

const route: FuseRouteItemType = {
  path: "claims",
  element: <ClaimsView />,
};

export default route;