import { useStoreState, useStoreActions } from 'app/store/hooks';
import React, { useState } from 'react';
import {
	Button,
	Avatar,
	Typography,
	Icon,
	Popover,
	MenuItem,
	ListItemIcon,
	ListItemText,
    IconButton,
} from '@material-ui/core';
import { Link } from "react-router-dom";
import {AccountCircle, Lock, PersonAdd} from '@material-ui/icons';

const UserMenu: React.FC = () => {
    const user = useStoreState(state => state.auth.currentUser);
    const logoutUser = useStoreActions(actions => actions.auth.logoutUser);
	const [userMenu, setUserMenu] = useState(null);

	const userMenuClick = (event: any) => {
		setUserMenu(event.currentTarget);
	};

	const userMenuClose = () => {
		setUserMenu(null);
    };
    
	return (
		<div>
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={userMenuClick}
                color="inherit"
              >
                <AccountCircle />

                {/* {user.photoURL ? (
					<Avatar className="" alt="user photo" src={user.photoURL} />
				) : (
					<Avatar className="">{user.displayName[0]}</Avatar>
				)} */}
				{user.displayName && (
					<div className="hidden md:flex flex-col items-start">
						<Typography component="span" className="normal-case font-600 flex">
							{user.displayName}
						</Typography>
					</div>
				)}

              </IconButton>

			<Popover
				open={Boolean(userMenu)}
				anchorEl={userMenu}
				onClose={userMenuClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				classes={{
					paper: 'py-8',
				}}
			>
				{!user.roles || user.roles.length === 0 ? (
					<React.Fragment>
						<MenuItem component={Link} to="/login">
							<ListItemIcon className="min-w-40">
								{/* <Icon>lock</Icon> */}
                                <Lock/>
							</ListItemIcon>
							<ListItemText className="pl-0" primary="Login" />
						</MenuItem>
						<MenuItem component={Link} to="/register">
							<ListItemIcon className="min-w-40">
								{/* <Icon>person_add</Icon> */}
                                <PersonAdd />
							</ListItemIcon>
							<ListItemText className="pl-0" primary="Register" />
						</MenuItem>
					</React.Fragment>
				) : (
					<React.Fragment>
						{/* <MenuItem component={Link} to="/pages/profile" onClick={userMenuClose}>
							<ListItemIcon className="min-w-40">
								<Icon>account_circle</Icon>
							</ListItemIcon>
							<ListItemText className="pl-0" primary="My Profile" />
						</MenuItem>
						<MenuItem component={Link} to="/apps/mail" onClick={userMenuClose}>
							<ListItemIcon className="min-w-40">
								<Icon>mail</Icon>
							</ListItemIcon>
							<ListItemText className="pl-0" primary="Inbox" />
						</MenuItem> */}
						<MenuItem
							onClick={() => {
								logoutUser();
								userMenuClose();
							}}
						>
							<ListItemIcon className="min-w-40">
								<Icon>exit_to_app</Icon>
							</ListItemIcon>
							<ListItemText className="pl-0" primary="Logout" />
						</MenuItem>
					</React.Fragment>
				)}
			</Popover>
		</div>
	);
};

export default UserMenu;
