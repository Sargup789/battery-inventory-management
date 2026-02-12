import HandymanIcon from '@mui/icons-material/Handyman';
import CabinIcon from '@mui/icons-material/Cabin';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
import KeyboardDoubleArrowUpRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, Toolbar, Typography } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import LogoutButton from './withLogout';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import withLogin, { DecodedToken } from '@/components/general/withLogin';

type Props = { children: ReactNode }

const drawerItems = [
  { name: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { name: 'Tools', path: '/tools', icon: <HandymanIcon /> },
  { name: 'Locations', path: '/location', icon: <CabinIcon /> },
  { name: 'Persons', path: '/persons', icon: <PersonAddIcon /> },
  { name: 'Check-in Tools', path: '/checkin', icon: <KeyboardDoubleArrowDownRoundedIcon /> },
  { name: 'Check-out Tools', path: '/checkout', icon: <KeyboardDoubleArrowUpRoundedIcon /> },
  { name: 'Dropdown Master', path: '/dropdownmaster', icon: <ArrowDropDownCircleOutlinedIcon /> },
  { name: 'Users', path: '/user', icon: <PeopleIcon /> },
]

const drawerWidth = 275;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
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
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
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
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
  flexShrink: 0,
}));

const Layout = ({ children, roles }: Props & DecodedToken) => {
  const [open, setOpen] = React.useState(true);
  const router = useRouter()

  const togggleDrawer = () => {
    setOpen((open) => !open)
  }

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const drawerItemsToShowBasedOnRole = drawerItems

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>

        <Toolbar
          style={{
            backgroundColor: "#9B2735",
            fontSize: "13px"
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={togggleDrawer}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            style={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
            Home
            <div>
              <LogoutButton />
            </div>
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
            <img
              src={"/images/ttcm.jpeg"}
              alt="Logo"
              style={{ width: '80%', height: '40px', marginRight: '10px' }}
            />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List
          sx={{
            pb: 2,
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {drawerItemsToShowBasedOnRole.map((item) => (
            <ListItem key={item.name} disablePadding onClick={() => router.push(item.path)}>
              <ListItemButton>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))
          }
        </List>
      </Drawer>
      <Main open={open} sx={{ backgroundColor: '#a9a8a9', minHeight: '100vh' }}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  )
}

export default withLogin(Layout)
