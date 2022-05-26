import React from "react";

import { GoogleLogin } from '@react-oauth/google';

const AuthContext = React.createContext(null);

const Auth = ({ onUserUpdate }) => {
	let [user, setUser] = React.useState(null);

	let failure = (e) => {
		// TODO message user?
		console.log(e);
	};

	let b64DecodeUnicode = str =>
		decodeURIComponent(
			Array.prototype.map.call(atob(str), c =>
				'%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
			).join(''))

	let parseJwt = token =>
		JSON.parse(
			b64DecodeUnicode(
				token.split('.')[1].replace('-', '+').replace('_', '/')
			)
		)

	let login = (googleUser) => {
		let jwtData = parseJwt(googleUser.credential);
		jwtData.id_token = googleUser.credential;
		console.log(jwtData);
		setUser(jwtData);
		onUserUpdate(jwtData);
	};

	let logout = () => {
		setUser(null);
		onUserUpdate(null);
	};

	if (user !== null) {
		return (
			<div><img alt="logout" src={user.picture} style={{ borderRadius: '50%', height: '2rem', cursor: 'pointer' }} onClick={logout} /></div>
		);
	} else {
		return (
			<div>
				<GoogleLogin
					onSuccess={login}
					onError={failure}
				/>
			</div>
		);
	}
};

export { Auth, AuthContext };
