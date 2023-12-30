"use client";
import React, { useEffect, useMemo, useState } from "react";
import Leaderboard from "../components/Leaderboard/Leaderboard";
import TabsComponent from "../components/TabsComponent";
import Live from "../styles/Icons/Live";
import { fullForm } from "../util/functions";
import { LiveLeaderboard, TabsType } from "../util/types";
import styles from "./Live.module.css";
function useWindowSizeMobile() {
	// Initialize state with undefined width/height so server and client renders match
	// Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
	const [windowSize, setWindowSize] = useState<{
		width: number | undefined;
		height: number | undefined;
	}>({
		width: undefined,
		height: undefined,
	});
	useEffect(() => {
		// Handler to call on window resize
		function handleResize() {
			// Set window width/height to state
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}
		// Add event listener
		window.addEventListener("resize", handleResize);
		// Call handler right away so state gets updated with initial window size
		handleResize();
		// Remove event listener on cleanup
		return () => window.removeEventListener("resize", handleResize);
	}, []); // Empty array ensures that effect is only run on mount
	return windowSize.width ? windowSize.width < 768 : true;
}
const WebSocketComponent = () => {
	const [leaderboardArr, setLeaderboardArr] = useState<LiveLeaderboard>([]);
	const [leaderboardArrOld, setLeaderboardArrOld] = useState<LiveLeaderboard>(
		[]
	);

	const [tabIndex, setTabIndex] = useState(0);
	let [tabs, setTabs] = useState([
		{
			value: "Loading...",
			label: "Loading... Vs Loading... ",
			index: 0,
		},
		{
			value: "Loading...1",
			label: "Loading... Vs Loading... ",
			index: 0,
		},
		{
			value: "Loading...2",
			label: "Loading... Vs Loading... ",
			index: 0,
		},
	]);

	const [tab, setTab] = useState<string>("");
	const isSmall = useWindowSizeMobile();

	useEffect(() => {
		tabs.forEach((t) => {
			if (t.value === tab) {
				setTabIndex(t.index);
			}
		});
	}, [tab, tabs]);
	useEffect(() => {
		const newTabs = leaderboardArr.map((item, idx) => {
			const teams = Object.keys(item);
			const team1 = teams[0];
			const team2 = teams[1];
			const team1Full = fullForm(team1).split(" ")[1];
			const team2Full = fullForm(team2).split(" ")[1];
			const joint = `${team1Full} vs ${team2Full}`;
			return { label: joint, value: joint, index: idx };
		});
		setTabs(newTabs);
	}, [leaderboardArr]);

	useEffect(() => {
		// Establish WebSocket connection
		const ws = new WebSocket("ws://localhost:3001");

		// Set up event listeners
		ws.addEventListener("open", () => {
			console.log("WebSocket connection opened");
		});
		ws.addEventListener("message", (event) => {
			try {
				const receivedMessage = JSON.parse(event.data);

				setLeaderboardArr((prev) => {
					setLeaderboardArrOld(prev);

					return prev;
				});
				setLeaderboardArr(receivedMessage);
			} catch (err) {
				console.error(err);
			}
		});

		ws.addEventListener("close", () => {
			console.log("WebSocket connection closed");
		});

		// Save the WebSocket instance in state

		// console.log(ws);
		// Clean up the WebSocket on component unmount
		return () => {
			ws.close();
		};
	}, []); // Empty dependency array means this effect runs once on mount\

	return (
		<div className={styles.main}>
			<div className={styles.heading}>
				<Live />
				Live Score Board
			</div>
			{!isSmall && (
				<TabsComponent
					tab={tab} // Pass the 'tab' state variable
					setTab={setTab}
					allTabs={tabs}
				/>
			)}
			{isSmall ? (
				leaderboardArr.map((item, idx) => (
					<Leaderboard fetchedData={item} key={idx} oldData={item} />
				))
			) : (
				<Leaderboard
					fetchedData={leaderboardArr[tabIndex]}
					oldData={leaderboardArrOld[tabIndex]}
				/>
			)}
		</div>
	);
};

export default WebSocketComponent;
