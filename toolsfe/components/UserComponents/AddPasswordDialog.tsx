import { PasswordData } from "@/pages/login";
import { UserData } from "@/pages/user";
import { HighlightOff } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import { Field, Form } from "react-final-form";
import { useTranslation } from 'next-i18next';

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
    const { t } = useTranslation('common');
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
                    {t('user.resetPassword')}
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
                                            <Typography className="label">{t('user.username')}</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                placeholder={t('user.enterUsername')}
                                            />
                                        </Box>
                                    )}
                                </Field>
                                <Field name="oldPassword">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">{t('user.oldPassword')}</Typography>
                                            <TextField
                                                {...input}
                                                type="password"
                                                fullWidth
                                                size="small"
                                                placeholder={t('user.enterOldPassword')}
                                            />
                                        </Box>
                                    )}
                                </Field>
                                <Field name="newPassword">
                                    {({ input }) => (
                                        <Box>
                                            <Typography className="label">{t('user.newPassword')}</Typography>
                                            <TextField
                                                {...input}
                                                type="password"
                                                fullWidth
                                                size="small"
                                                placeholder={t('user.enterNewPassword')}
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
                                    {t('common.save')}
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