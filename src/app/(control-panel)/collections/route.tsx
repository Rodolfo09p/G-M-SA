import { lazy } from "react";
import { FuseRouteItemType } from "@fuse/utils/FuseUtils";

const CollectionsView = lazy(() => import("./CollectionsView"));

const route: FuseRouteItemType = {
  path: "collections",
  element: <CollectionsView />,
};

export default route;
