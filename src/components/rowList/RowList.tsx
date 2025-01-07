"use client";
import { Suspense } from "react";
import Table from "../Table/Table";

const RowList = () => {
    return (
        <Suspense>
            <Table />
        </Suspense>
    );
};

export default RowList;
