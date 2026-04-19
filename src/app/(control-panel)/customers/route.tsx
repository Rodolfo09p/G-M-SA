import { lazy } from "react";
import { FuseRouteItemType } from "@fuse/utils/FuseUtils";

const CustomersView = lazy(() => import("./components/views/CustomersView"));

const route: FuseRouteItemType = {
  path: "customers",
  element: <CustomersView />,
};

export default route;
