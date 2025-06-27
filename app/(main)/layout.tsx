import React from "react";

import { PropsWithChildren } from "react";

const MainLayout = ({ children }: PropsWithChildren<object>) => {
        return <div className="container mx-auto my-20">{children}</div>;
};

export default MainLayout;