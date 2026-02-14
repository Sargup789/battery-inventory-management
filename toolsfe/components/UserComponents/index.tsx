import { Button } from "@mui/material"
import { useState } from "react";
import AddUserDialog from "./AddUserDialog";
import UserTable from "./Usertable"
import { UserApiResponse, UserData } from "@/pages/user";
import { QueryClient, QueryClientProvider } from "react-query";
import axios from "axios";

type Props = {
  userApiData: UserApiResponse;
  deleteUser: (id: string) => void;
  refetch: () => void;
  setPage: (page: number) => void
  setSize: (size: number) => void
  page: number
  size: number
}

const queryClient = new QueryClient();

const UserIndex = ({ userApiData, deleteUser, refetch, setPage, setSize, page, size }: Props) => {
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [userDialogData, setUserDialogData] = useState<UserData | {}>({});

  const handleClose = () => {
    setAddUserDialogOpen(false);
    setUserDialogData({});
  };

  const onSubmit = async (data: UserData) => {
    if (Object.keys(userDialogData).length > 0) {
      const { id, ...rest } = data;
      try {
        await axios.put(
          `/api/router?path=api/auth/users/${id}`,
          rest
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await axios.post(`/api/router?path=api/auth/register`, data);
      } catch (error) {
        console.error(error);
      }
    }
    handleClose();
    refetch();
  };
  return (
    <QueryClientProvider client={queryClient}>
      <div className="m-6">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <Button
            style={{
              borderRadius: 15,
              backgroundColor: "#9B2735",
              fontSize: "13px"
            }}
            variant="contained"
            onClick={() => setAddUserDialogOpen(true)}
          >
            Add User
          </Button>
        </div>
        <UserTable
          userApiData={userApiData}
          deleteUser={deleteUser}
          page={page}
          size={size}
          setPage={setPage}
          setSize={setSize}
        />
        <AddUserDialog
          open={addUserDialogOpen}
          userDialogData={userDialogData}
          handleClose={handleClose}
          onSubmit={onSubmit}
        />
      </div>
    </QueryClientProvider>
  )
}

export default UserIndex
