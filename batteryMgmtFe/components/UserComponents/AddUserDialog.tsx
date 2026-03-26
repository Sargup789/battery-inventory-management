import { UserData } from "@/pages/user";
import { HighlightOff } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Field, Form } from "react-final-form";

interface UserDialogProps {
    open: boolean;
    handleClose: () => void;
    userDialogData: UserData | {};
    onSubmit: (values: UserData) => void;
}

const AddUserDialog: React.FC<UserDialogProps> = ({
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
                    }}
                >
                    Add User
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
                    render={({ handleSubmit }) => (
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
                                <Field name="password">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">Password</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                placeholder="Enter password"
                                            />
                                        </Box>
                                    )}
                                </Field>
                                <Field name="role">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">Role</Typography>
                                            <Select {...input} fullWidth>
                                                <MenuItem value="administrator">Administrator</MenuItem>
                                                <MenuItem value="editor">Manager</MenuItem>
                                                <MenuItem value="viewer">Operator</MenuItem>
                                            </Select>
                                        </Box>
                                    )}
                                </Field>
                            </Box>
                            <DialogActions>
                                <Button
                                    style={{
                                        borderRadius: 15,
                                        backgroundColor: "#9B2735",
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
    );
};

export default AddUserDialog;
