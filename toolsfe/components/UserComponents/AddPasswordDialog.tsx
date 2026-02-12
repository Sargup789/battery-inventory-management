import { PasswordData } from "@/pages/login";
import { UserData } from "@/pages/user";
import { HighlightOff } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import { Field, Form } from "react-final-form";

interface UserDialogProps {
    open: boolean;
    handleClose: () => void;
    userDialogData: UserData | {};
    onSubmit: (values: PasswordData) => void;
}
const AddPasswordDialog: React.FC<UserDialogProps> = ({
    open,
    handleClose,
    userDialogData,
    onSubmit,
}) => {
    return (
        <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose}>
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        "&:hover": {
                            color: "primary.main",
                        },
                    }}
                >
                    Reset Password
                </Box>
                <IconButton
                    children={<HighlightOff />}
                    color="inherit"
                    onClick={handleClose}
                    sx={{ transform: "translate(8px, -8px)" }}
                />
            </DialogTitle>
            <DialogContent>
                <Form
                    initialValues={userDialogData}
                    onSubmit={onSubmit}
                    render={({ handleSubmit, values }) => (
                        <form onSubmit={handleSubmit}>
                            <Box
                                sx={{
                                    my: 3,
                                    mx: 1,
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                    gap: 3,
                                }}
                            >
                                <Field name="username">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">Username</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                placeholder="Enter username"
                                            />
                                        </Box>
                                    )}
                                </Field>
                                <Field name="oldPassword">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">Old-Password</Typography>
                                            <TextField
                                                {...input}
                                                type="password"
                                                fullWidth
                                                size="small"
                                                placeholder="Enter old-password"
                                            />
                                        </Box>
                                    )}
                                </Field>
                                <Field name="newPassword">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">New-Password</Typography>
                                            <TextField
                                                {...input}
                                                type="password"
                                                fullWidth
                                                size="small"
                                                placeholder="Enter new-password"
                                            />
                                        </Box>
                                    )}
                                </Field>
                            </Box>
                            <DialogActions>
                                <Button
                                    style={{
                                        borderRadius: 15,
                                        backgroundColor: "#E96820",
                                        fontSize: "13px"
                                    }}
                                    variant="contained"
                                    type="submit"
                                >
                                    Save
                                </Button>
                            </DialogActions>
                        </form>
                    )}
                />
            </DialogContent>
        </Dialog>
    )
}

export default AddPasswordDialog