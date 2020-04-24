import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'app/store/hooks';
import useStyles from './styles';
import clsx from "clsx";
import { Snackbar, SnackbarContent, Icon, IconButton } from '@material-ui/core';

const variantIcon = {
	success: "check_circle",
	warning: "warning",
	error: "error_outline",
	info: "info",
};

const AppMessage: React.FC = () => {

    const messageOptions = useStoreState((state) => state.global.message);
    const messageActions = useStoreActions((state) => state.global.message);
    const classes = useStyles({});

	return (
		<Snackbar
			{...messageOptions.options}
			open={messageOptions.isOpen}
			onClose={() => messageActions.hideMessage()}
			classes={{
				root: classes.root,
			}}
		>
			<SnackbarContent
				className={clsx(classes[messageOptions.options.variant])}
				message={
					<div className="flex items-center">
						{variantIcon[messageOptions.options.variant] && (
							<Icon className="mr-8" color="inherit">
								{variantIcon[messageOptions.options.variant]}
							</Icon>
						)}
						{messageOptions.options.message}
					</div>
				}
				action={[
					<IconButton
						key="close"
						aria-label="Close"
						color="inherit"
						onClick={() => messageActions.hideMessage()}
					>
						<Icon>close</Icon>
					</IconButton>,
				]}
			/>
		</Snackbar>
	);

}


export default AppMessage;