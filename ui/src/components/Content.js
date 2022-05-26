import React from "react";

import { AuthContext } from "./Auth.js";
import Account from "./Account.js";
import Admin from "./Admin.js";

let Content = () => {
	const admins = process.env.REACT_APP_ADMINS.split(",");
	const user = React.useContext(AuthContext);
	if (user === null || user === undefined) {
		return (
			<div>Please login using the button at the top right of this page.</div>
		);
	} else if (admins.includes(user.sub)) {
		return <Admin />;
	} else {
		return <Account />;
	}
};

export default Content;
