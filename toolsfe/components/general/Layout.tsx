import HandymanIcon from '@mui/icons-material/Handyman';
import CabinIcon from '@mui/icons-material/Cabin';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
import KeyboardDoubleArrowUpRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import LanguageIcon from '@mui/icons-material/Language';
import { Box, Button, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, Toolbar, Typography } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import LogoutButton from './withLogout';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React, { ReactNode } from 'react';
import withLogin, { DecodedToken } from '@/components/general/withLogin';

type Props = { children: ReactNode }

const drawerItems = [
  { nameKey: 'nav.dashboard', path: '/', icon: <DashboardIcon /> },
  { nameKey: 'nav.tools', path: '/tools', icon: <HandymanIcon /> },
  { nameKey: 'nav.locations', path: '/location', icon: <CabinIcon /> },
  { nameKey: 'nav.persons', path: '/persons', icon: <PersonAddIcon /> },
  { nameKey: 'nav.assignTools', path: '/assign', icon: <AssignmentIndIcon /> },
  { nameKey: 'nav.checkoutTool', path: '/checkout', icon: <KeyboardDoubleArrowUpRoundedIcon /> },
  { nameKey: 'nav.checkinTool', path: '/checkin', icon: <KeyboardDoubleArrowDownRoundedIcon /> },
  { nameKey: 'nav.checkToolStatus', path: '/checkstatus', icon: <ManageSearchIcon /> },
  { nameKey: 'nav.dropdownMaster', path: '/dropdownmaster', icon: <ArrowDropDownCircleOutlinedIcon /> },
  { nameKey: 'nav.users', path: '/user', icon: <PeopleIcon /> },
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

const Layout = ({ children }: Props & DecodedToken) => {
  const [open, setOpen] = React.useState(true);
  const router = useRouter()
  const { t } = useTranslation('common');

  const togggleDrawer = () => {
    setOpen((open) => !open)
  }

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const toggleLanguage = () => {
    const newLocale = router.locale === 'es' ? 'en' : 'es';
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };

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
            aria-label={t('nav.openDrawer')}
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
            {t('nav.home')}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Button
                onClick={toggleLanguage}
                variant="outlined"
                size="small"
                startIcon={<LanguageIcon />}
                sx={{
                  color: '#fff',
                  borderColor: '#fff',
                  textTransform: 'none',
                  fontSize: '13px',
                  '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                {router.locale === 'es' ? 'EN' : 'ES'}
              </Button>
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
          {drawerItems.map((item) => (
            <ListItem key={item.nameKey} disablePadding onClick={() => router.push(item.path)}>
              <ListItemButton>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={t(item.nameKey)} />
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
