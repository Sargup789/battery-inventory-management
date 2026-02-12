import Layout from "@/components/general/Layout"
import withLogin, { DecodedToken } from "@/components/general/withLogin"
import UserIndex from "@/components/UserComponents"
import axios from "axios";
import React, { useEffect } from "react";
import { useQuery, UseQueryResult } from "react-query";

export interface UserData {
    id: string;
    username: string;
    password: string;
    role: string;
    allowedApplication: string;
}

export interface UserApiResponse {
    totalCount: number;
    page: number;
    currentPage: number;
    data: UserData[];
}


// Mock data for testing UI
const mockUsersData: UserApiResponse = {
    totalCount: 3,
    page: 1,
    currentPage: 1,
    data: [
        {
            id: "1",
            username: "admin",
            password: "********",
            role: "administrator",
            allowedApplication: "all",
        },
        {
            id: "2",
            username: "manager",
            password: "********",
            role: "editor",
            allowedApplication: "tools",
        },
        {
            id: "3",
            username: "operator",
            password: "********",
            role: "viewer",
            allowedApplication: "tools",
        },
    ],
};

const Users = ({ roles }: DecodedToken) => {

    useEffect(() => {
        if (roles && roles !== "administrator") {
            // window.open('/', '_self')
        }
    }, [roles])
    const [page, setPage] = React.useState(1);
    const [size, setSize] = React.useState(10);

    // Using mock data instead of API call
    const [users, setUsers] = React.useState<UserApiResponse>(mockUsersData);
    const [isLoading] = React.useState(false);

    const refetch = () => {
        console.log("Refetch called");
    };

    const deleteUser = async (id: string) => {
        // Mock delete - filter out from state
        setUsers((prev) => ({
            ...prev,
            data: prev.data.filter((u) => u.id !== id),
            totalCount: prev.totalCount - 1,
        }));
        console.log("Deleted user:", id);
    };

    return (
        <Layout>
            {isLoading || !users ? (
                "Loading..."
            ) : (
                <UserIndex
                    userApiData={users}
                    deleteUser={deleteUser}
                    refetch={refetch}
                    page={page}
                    size={size}
                    setPage={setPage}
                    setSize={setSize} />
            )}
        </Layout>
    )
}

export default withLogin(Users)