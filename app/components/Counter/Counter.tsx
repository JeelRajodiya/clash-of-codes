import classNames from "classnames";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useRef } from "react";
import styles from "./Counter.module.css";

Counter.propTypes = {
	startNumber: PropTypes.number.isRequired,
};

function Counter({ startNumber }: { startNumber: number }) {
	const flipCardRef1 = useRef<HTMLDivElement>(null);
	const flipCardRef2 = useRef<HTMLDivElement>(null);
	const topRef1 = useRef<HTMLDivElement>(null);
	const bottomRef1 = useRef<HTMLDivElement>(null);
	const topRef2 = useRef<HTMLDivElement>(null);
	const bottomRef2 = useRef<HTMLDivElement>(null);

	const updateFlipCard = useCallback(
		(refs: any, currentValue: number, nextValue: number) => {
			const flipCard = refs.flipCardRef.current;
			const topHalf1 = refs.topRef.current;
			const bottomHalf1 = refs.bottomRef.current;

			const topFlip = document.createElement("div");
			const bottomFlip = document.createElement("div");

			if (topHalf1 && bottomHalf1 && topFlip && bottomFlip) {
				topFlip.classList.add(styles.topFlip);
				bottomFlip.classList.add(styles.bottomFlip);

				bottomHalf1.textContent = String(currentValue);

				topFlip.textContent = String(currentValue);
				bottomFlip.textContent = String(nextValue);

				topFlip.addEventListener("animationstart", () => {
					topHalf1.textContent = String(nextValue);
				});

				topFlip.addEventListener("animationend", () => {
					topFlip.remove();
				});

				bottomFlip.addEventListener("animationend", () => {
					bottomHalf1.textContent = String(nextValue);

					bottomFlip.remove();
				});

				flipCard.append(topFlip, bottomFlip);
			}
		},
		[]
	);

	const number = useMemo(() => startNumber % 10, [startNumber]);

	useEffect(() => {
		if (flipCardRef2.current) {
			updateFlipCard(
				{
					flipCardRef: flipCardRef1,
					topRef: topRef1,
					bottomRef: bottomRef1,
				},
				number !== 0 ? number - 1 : 9,
				number == 10 ? 0 : number % 10
			);

			if (Math.floor(startNumber / 9) === 0 || startNumber <= 0) {
				flipCardRef2.current.style.display = "none";
			}

			flipCardRef2.current.style.display = "inline-flex";
			updateFlipCard(
				{
					flipCardRef: flipCardRef2,
					topRef: topRef2,
					bottomRef: bottomRef2,
				},
				Math.floor((startNumber - 1) / 10),
				Math.floor(startNumber / 10)
			);
		}
	}, [startNumber, updateFlipCard, number]);

	return (
		<div className={styles.main}>
			{/* tens digit */}
			<div
				className={classNames(styles.flipCard, styles.shiny)}
				ref={flipCardRef2}
			>
				<div className={styles.top} ref={topRef2}></div>
				<div className={styles.bottom} ref={bottomRef2}></div>
			</div>
			{/* unit digit */}
			<div
				className={classNames(styles.flipCard, styles.shiny)}
				ref={flipCardRef1}
			>
				<div className={styles.top} ref={topRef1}></div>
				<div className={styles.bottom} ref={bottomRef1}></div>
			</div>
		</div>
	);
}

export default Counter;
