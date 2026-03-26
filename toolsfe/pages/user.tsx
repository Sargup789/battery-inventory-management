import Layout from "@/components/general/Layout"
import withLogin, { DecodedToken } from "@/components/general/withLogin"
import UserIndex from "@/components/UserComponents"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import axios from "axios";
import React, { useEffect } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { toast } from "react-toastify";

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

const getEntityId = (item: any): string => {
    const candidate = item?.id ?? item?._id;
    if (typeof candidate === "string") return candidate;
    if (candidate && typeof candidate?.toHexString === "function") return candidate.toHexString();
    if (candidate && typeof candidate?.toString === "function") return candidate.toString();
    if (candidate && typeof candidate?.$oid === "string") return candidate.$oid;
    return "";
};

const normalizeUser = (rawUser: any): UserData => {
    return {
        id: getEntityId(rawUser),
        username: rawUser?.username || "",
        password: "********",
        role: rawUser?.role || "viewer",
        allowedApplication: rawUser?.allowedApplication || "tools",
    };
};

const fetchUsers = async (page = 1, size = 10): Promise<UserApiResponse> => {
    const response = await axios.get(`/api/router?path=api/auth/users`, {
        params: { page, size },
    });

    const raw = response.data;
    const rows = Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw)
            ? raw
            : [];

    return {
        totalCount: Number(raw?.totalCount ?? rows.length),
        page: Number(raw?.page ?? page),
        currentPage: Number(raw?.currentPage ?? page),
        data: rows.map(normalizeUser),
    };
};

const Users = ({ roles }: DecodedToken) => {
    const { t } = useTranslation('common');
    useEffect(() => {
        if (roles && roles !== "administrator") {
            // window.open('/', '_self')
        }
    }, [roles])
    const [page, setPage] = React.useState(1);
    const [size, setSize] = React.useState(10);

    const {
        data: users,
        isLoading,
        refetch,
    }: UseQueryResult<UserApiResponse, unknown> = useQuery(
        ["users", page, size],
        () => fetchUsers(page, size),
        {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            keepPreviousData: true,
        }
    );

    const deleteUser = async (id: string) => {
        try {
            await axios.delete(`/api/router?path=api/auth/${id}`);
            toast.success(t('user.deleteSuccess'));
            refetch();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t('user.deleteFailed'));
        }
    };

    return (
        <Layout>
            {isLoading || !users ? (
                t('common.loading')
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

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default withLogin(Users)
