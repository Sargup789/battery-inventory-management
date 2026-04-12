import { UserData } from '@/pages/user';
import { HighlightOff } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Field, Form } from 'react-final-form';
import { useTranslation } from 'next-i18next';

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
  const { t } = useTranslation('common');

  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {t('user.addUser')}
        </Box>
        <IconButton
          children={<HighlightOff />}
          color="inherit"
          onClick={handleClose}
          sx={{ transform: 'translate(8px, -8px)' }}
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
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
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
                        placeholder={t('login.username')}
                      />
                    </Box>
                  )}
                </Field>
                <Field name="password">
                  {({ input }) => (
                    <Box>
                      <Typography className="label">{t('user.password')}</Typography>
                      <TextField
                        {...input}
                        fullWidth
                        size="small"
                        placeholder={t('login.password')}
                      />
                    </Box>
                  )}
                </Field>
                <Field name="role">
                  {({ input }) => (
                    <Box>
                      <Typography className="label">{t('user.role')}</Typography>
                      <Select {...input} fullWidth>
                        <MenuItem value="administrator">{t('user.administrator')}</MenuItem>
                        <MenuItem value="editor">{t('user.manager')}</MenuItem>
                        <MenuItem value="viewer">{t('user.operator')}</MenuItem>
                      </Select>
                    </Box>
                  )}
                </Field>
              </Box>
              <DialogActions>
                <Button
                  style={{ borderRadius: 15, backgroundColor: '#9B2735', fontSize: '13px' }}
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
  );
};

export default AddUserDialog;
