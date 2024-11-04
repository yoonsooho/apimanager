"use client";
import React, { useEffect, useState } from "react";
import Table from "../Table/Table";
import { cookies } from "next/headers";
import { getTokenInfo } from "@/lib/getClientAccessTokenUserInfo";
import { useSearchParams } from "next/navigation";

type props = { projectId: Number };

const RowList = ({ projectId }: props) => {
    return <div>{<Table />}</div>;
};

export default RowList;
