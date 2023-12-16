import { Button, useEditable } from "@chakra-ui/react";
import Image from "next/image";
import GoogleIcon from "../../styles/Icons/BsGoogle.svg";
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { useCallback, useEffect, useState } from "react";
import { googleLogout } from "@react-oauth/google";
import { customFetch, getServerUrl } from "@/app/util/functions";

function getBtn(login: () => void, logout: () => void, isLoading: boolean) {
	let btn;
	if (document && document.cookie.includes("server_token")) {
		btn = (
			<Button
				size={{ md: "md", sm: "xs" }}
				fontFamily={"arial"}
				borderRadius={16}
				margin={"auto"}
				paddingX={4}
				paddingY={2}
				onClick={logout}
				variant={"outline"}
				isLoading={isLoading}
			>
				Logout
			</Button>
		);
	} else {
		btn = (
			<Button
				size={{ md: "md", sm: "xs" }}
				fontFamily={"arial"}
				borderRadius={16}
				margin={"auto"}
				paddingX={4}
				paddingY={2}
				rightIcon={<Image alt="to" src={GoogleIcon} width={16} />}
				onClick={login}
				isLoading={isLoading}
			>
				Login
			</Button>
		);
	}

	return btn;
}
export default function LoginBtn() {
	const [isLoading, setIsLoading] = useState(false);
	const [oneTapDisabled, setOneTapDisabled] = useState(true);

	const login = useCallback(async () => {
		setOneTapDisabled(false);
	}, []);

	const logout = useCallback(() => {
		setOneTapDisabled(true);

		googleLogout();
		document.cookie =
			"google_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		setBtn(getBtn(login, logout, isLoading));
		document.cookie =
			"server_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		setBtn(getBtn(login, logout, isLoading));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let [btn, setBtn] = useState(getBtn(login, logout, isLoading));

	useGoogleOneTapLogin({
		onSuccess: async (credentialResponse) => {
			setIsLoading(true);

			document.cookie = `google_token=${credentialResponse.credential}`;
			// console.log("Login Success");
			const res = await customFetch("login");
			if (res.status !== 200) {
				console.error("Login Failed ");
			} else {
				// console.log("Login Success 2");
				const serverToken = await res.text();
				document.cookie = `server_token=${serverToken}`;
			}
			setBtn(getBtn(login, logout, isLoading));

			setIsLoading(false);
		},
		onError: () => {
			console.log("Login Failed");
		},
		disabled: oneTapDisabled,
	});
	useEffect(() => {
		setBtn(getBtn(login, logout, isLoading));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading]);
	return <div>{btn}</div>;
}
