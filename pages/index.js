import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

//const Animation = dynamic(() => import('../component/animation'))
const Animation = dynamic(
	() => import('../component/animation'),
	{ ssr: false }
)

export default function Home() {

	const [show, setShow] = useState(false);
	const [time, setTime] = useState(10000);
	useEffect(() => {
		const timer = () => setTimeout(() => {setShow(true);setTime(30000)}, time);
		const timerId = timer();
		return () => {
			clearTimeout(timerId);
		};
	})

	return (
		<div className="bg-black">
			<Head>
				<title>FlightPlan</title>
				<link rel="icon" href="/favicon.ico" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className="relative bg-black overflow-hidden h-screen overflow-hidden z-10 border-b-0 border-white">
				<img src="/bg.png" className="absolute top-0 left-0 min-w-full min-h-full w-auto h-auto"></img>
			</div>
			{show && (
				<Animation close={() => setShow(false)} />
			)}
		</div>
	)
}
