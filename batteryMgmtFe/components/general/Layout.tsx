import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
import KeyboardDoubleArrowUpRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, Toolbar, Typography } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import LogoutButton from './withLogout';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import withLogin, { DecodedToken } from '@/components/general/withLogin';

type Props = { children: ReactNode }

const drawerItems = [
  { name: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { name: 'Power Equipment', path: '/power-equipment', icon: <BatteryChargingFullIcon /> },
  { name: 'Zones', path: '/zones', icon: <LocationOnIcon /> },
  { name: 'Check-out Equipment', path: '/checkout', icon: <KeyboardDoubleArrowUpRoundedIcon /> },
  { name: 'Check-in Equipment', path: '/checkin', icon: <KeyboardDoubleArrowDownRoundedIcon /> },
  { name: 'Check Status', path: '/checkstatus', icon: <ManageSearchIcon /> },
  { name: 'Generate QR Code', path: '/generate-qr', icon: <QrCodeIcon /> },
  { name: 'Dropdown Master', path: '/dropdownmaster', icon: <ArrowDropDownCircleOutlinedIcon /> },
  { name: 'Users', path: '/user', icon: <PeopleIcon /> },
]

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

  const toggleDrawer = () => setOpen((open) => !open);
  const handleDrawerClose = () => setOpen(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar style={{ backgroundColor: "#1565C0", fontSize: "13px" }}>
          <IconButton color="inherit" aria-label="open drawer" onClick={toggleDrawer} edge="start" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" style={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
            Battery Inventory Management
            <div><LogoutButton /></div>
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
            <Typography variant="h6" color="primary" fontWeight={700}>
              Battery IMS
            </Typography>
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List sx={{ pb: 2, flex: 1, overflowY: 'auto' }}>
          {drawerItems.map((item) => (
            <ListItem key={item.name} disablePadding onClick={() => router.push(item.path)}>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open} sx={{ backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}

export default withLogin(Layout);
