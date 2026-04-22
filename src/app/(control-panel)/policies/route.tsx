import { lazy } from "react";
import { FuseRouteItemType } from "@fuse/utils/FuseUtils";

const PoliciesView = lazy(() => import("./PoliciesView"));

const route: FuseRouteItemType = {
  path: "policies",
  element: <PoliciesView />,
};

export default route;
