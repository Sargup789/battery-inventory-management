import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
import KeyboardDoubleArrowUpRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { Box, Button, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, Toolbar, Typography } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import LogoutButton from './withLogout';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import withLogin, { DecodedToken } from '@/components/general/withLogin';
import { useTranslation } from 'next-i18next';

type Props = { children: ReactNode }

const drawerWidth = 275;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{ open?: boolean }>(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

interface AppBarProps extends MuiAppBarProps { open?: boolean; }

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })<AppBarProps>(
  ({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
  flexShrink: 0,
}));

const Layout = ({ children }: Props & DecodedToken) => {
  const [open, setOpen] = React.useState(true);
  const router = useRouter();
  const { t } = useTranslation('common');

  const drawerItems = [
    { name: t('layout.dashboard'), path: '/', icon: <DashboardIcon /> },
    { name: t('layout.powerEquipment'), path: '/power-equipment', icon: <BatteryChargingFullIcon /> },
    { name: t('layout.zones'), path: '/zones', icon: <LocationOnIcon /> },
    { name: t('layout.checkoutEquipment'), path: '/checkout', icon: <KeyboardDoubleArrowUpRoundedIcon /> },
    { name: t('layout.checkinEquipment'), path: '/checkin', icon: <KeyboardDoubleArrowDownRoundedIcon /> },
    { name: t('layout.checkStatus'), path: '/checkstatus', icon: <ManageSearchIcon /> },
    { name: t('layout.dropdownMaster'), path: '/dropdownmaster', icon: <ArrowDropDownCircleOutlinedIcon /> },
    { name: t('layout.users'), path: '/user', icon: <PeopleIcon /> },
  ];

  const toggleDrawer = () => setOpen((prev) => !prev);
  const handleDrawerClose = () => setOpen(false);

  const handleLanguageToggle = () => {
    const newLocale = router.locale === 'es' ? 'en' : 'es';
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar style={{ backgroundColor: '#9B2735', fontSize: '13px' }}>
          <IconButton color="inherit" aria-label="open drawer" onClick={toggleDrawer} edge="start" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            {t('layout.title')}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button color="inherit" variant="outlined" size="small" onClick={handleLanguageToggle} sx={{ minWidth: '56px', borderColor: 'rgba(255,255,255,0.6)', color: 'white' }}>
                {router.locale === 'es' ? 'EN' : 'ES'}
              </Button>
              <LogoutButton />
            </Box>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            height: '100dvh',
            maxHeight: '100dvh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton sx={{ width: '100%' }} onClick={handleDrawerClose}>
            <img src="/images/ttcm.jpeg" alt="Logo" style={{ width: '80%', height: '40px', marginRight: '10px' }} />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List sx={{ pb: 2, flex: 1, overflowY: 'auto' }}>
          {drawerItems.map((item) => (
            <ListItem key={item.path} disablePadding onClick={() => router.push(item.path)}>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open} sx={{ backgroundColor: '#a9a8a9', minHeight: '100vh' }}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}

export default withLogin(Layout);
