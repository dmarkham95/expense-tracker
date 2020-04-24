import MainLayout from "app/app-layouts/mainLayout/MainLayout";
import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { matchRoutes } from "react-router-config";
import _ from "lodash";
import AppContext from "app/AppContext";
import useStyles from './styles';
import { withStyles, Theme } from "@material-ui/core";


const styles = (theme: Theme)  => ({
	root: {
		backgroundColor: theme.palette.background.default,
		color: theme.palette.text.primary,
		'& code:not([class*="language-"])': {
			color: theme.palette.secondary.dark,
			backgroundColor: "#F5F5F5",
			padding: "2px 3px",
			borderRadius: 2,
			lineHeight: 1.7,
		},
		"& table.simple tbody tr td": {
			borderColor: theme.palette.divider,
		},
		"& table.simple thead tr th": {
			borderColor: theme.palette.divider,
		},
		"& a:not([role=button])": {
			color: theme.palette.secondary.main,
			textDecoration: "none",
			"&:hover": {
				textDecoration: "underline",
			},
		},
		'& [class^="border-"]': {
			borderColor: theme.palette.divider,
		},
		'& [class*="border-"]': {
			borderColor: theme.palette.divider,
		},
	},
});

type BaseProps = {
	className?: string;
	style?: React.CSSProperties;
	children?: React.ReactNode;
	classess?: any;
};


type Props = { settings?: any; classes?: any } & BaseProps & RouteComponentProps;
type State = {
	routes: any;
	awaitRender: boolean;
};
class AppLayout extends Component<Props, State> {
	constructor(props: Readonly<Props>, context: { routes: any; }) {
		super(props);
		const { routes } = context;

		this.state = {
			awaitRender: false,
			routes,
		};
	}

	static getDerivedStateFromProps(props: any, state: any) {
		const { pathname } = props.location;
		const matched = matchRoutes(state.routes, pathname)[0];
		let newSettings = props.settings;

		if (state.pathname !== pathname) {
			if (matched && matched.route.settings) {
				const routeSettings = matched.route.settings;

				if (!_.isEqual(props.settings, newSettings)) {
					props.setSettings(newSettings);
				}
			} else {
				if (!_.isEqual(props.settings, props.defaultSettings)) {
					newSettings = _.merge({}, props.defaultSettings);

					props.resetSettings();
				}
			}
		}

		return {
			awaitRender: !_.isEqual(props.settings, newSettings),
			pathname,
		};
	}

	render() {
		const { settings,classes } = this.props;
    //const classes = useStyles();

		return true ? (
			<MainLayout classes={{ root: classes.root }} {...this.props} />
		) : null;
	}
}


AppLayout.contextType = AppContext;

export default withStyles(styles, { withTheme: true })(
  withRouter(React.memo(AppLayout))
)