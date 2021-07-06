
import Head from 'next/head'
import { useState } from 'react';
import styles from '../styles/Home.module.css'

import { PatienceTest } from '../public/components/patience_test';

export default function Home() {
	const [ state, setState ] = useState({
		holding: false,
		startTime: null,
		endTime: null
	});

	return (
		<div className={styles.divPage}>
			<h1>Hold The Button</h1>
			<PatienceTest parent={[state, setState]}/>
		</div>
	)
}
