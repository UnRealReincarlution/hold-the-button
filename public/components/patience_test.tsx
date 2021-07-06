
import styles from '../../styles/Home.module.css'
import { createRef, useContext, useEffect, useState } from 'react'
import Image from 'next/image'

import down_button from '../down.png'
import up_button from '../up.png'

import { Clock } from './clock'
import { addAbortSignal } from 'stream'

const PatienceTest: React.FC<{ parent: [state: { holding: boolean, startTime: null | number, endTime: null | number }, setState: Function]}> = ({ parent }) => {
    const [ state, setState ] = parent;
    const [ date, setDate ] = useState(new Date().getTime());

    const [ completionDificulty, setCompletionDificulty ] = useState(null); 
    const [ completionTime, setCompletionTime ] = useState(null);

    const [ alt, setAlt ] = useState(false);

    const [ screenPhrases, setScreenPhrases ] = useState([]);

    // {
    //     desc: 'You’re literally clicking a button on a website',
    //     id: '132',
    //     top: 152,
    //     left: 250
    // }

    const [ viewed, setViewed ] = useState("00:00:00");

    // if(state.startTime)
    // console.log(`${60 - (new Date().getTime() - state.startTime)}s to go!`);

    const addElement = () => {
        const index = Math.random() * 1000;

        setScreenPhrases([ ...screenPhrases, {
            desc: index < 300 ? "Why are you still here?" : index > 800 ? "You’re literally clicking a button on a website" : "Life is filled with many wonders and you have the potential to see it all… Yet you continue to click a button.",
            id: index,
            top: Math.random() * window.innerHeight,
            left: Math.random() * window.innerWidth,
        } ])

        setTimeout(() => {
            screenPhrases.splice(screenPhrases.findIndex(e => e.id == index), 1);
            setScreenPhrases(screenPhrases);

            setAlt(!alt);
        }, 6000);
    }

    useEffect(() => {
        if(state.holding) {
            const rand = (Math.random() * 1000) <= 500;

            console.log(rand ? "YES" : "NO, TRYING AGAIN IN 2500")

            if(rand) addElement();
            else setTimeout(() => setAlt(!alt), 3500)
        }else {
            setScreenPhrases([]);
        }
    }, [state.holding, alt])
    

    useEffect(() => {
        if(!state.holding && state.endTime) {
            const sec = (state.endTime) / 1000;
            setCompletionTime(sec);

            if(sec < 1) setCompletionDificulty('adv')
            else if(sec < 3) setCompletionDificulty('0')
            else if(sec < 15) setCompletionDificulty('1')
            else if(sec < 30) setCompletionDificulty('1.5')
            else if(sec < 45) setCompletionDificulty('2')
            else if(sec < 60) setCompletionDificulty('3')
            else if(sec >= 60)  setCompletionDificulty('4')
        }else {
            setCompletionDificulty(null);
            setCompletionTime(0)
        }
    }, [state])

	return (
        <div
            onMouseDown={() => {
                if(!state.holding) setState({ ...state, holding: true, startTime: new Date().getTime() });
            }}
            onMouseUp={() => {
                if(state.holding) setState({ ...state, holding: false, startTime: null, endTime: new Date().getTime() - state.startTime });
            }}
            onMouseLeave={() => {
                if(state.holding) setState({ ...state, holding: false, startTime: null, endTime: new Date().getTime() - state.startTime });
            }}
            className={`${styles.clockTimer} ${state.holding ? styles.buttonBeingHeld : styles.buttonNotBeingHeld}`}
        >
            {
                completionDificulty !== '4' && 
                <div className={styles.button}>
                {/* <div className={styles.buttonBase}></div>
                <div className={styles.buttonBase}></div>

                <div className={styles.buttonTopper}></div>

                <div className={`${styles.buttonButton} ${state.holding ? styles.buttonHeld : styles.buttonReleased}`} >
                    <div className={styles.buttonBase}></div>
                    <div className={styles.buttonBase}></div>

                    <div className={styles.buttonTopper}></div>
                </div> */}

                {
                    (!state.startTime && !state.holding && !state.endTime) && <p>Hold Me!</p>
                }

                <Image src={state.holding ? down_button : up_button} quality={100} alt="button" unoptimized={true}
                    onDragStart={(e) => e.preventDefault()}
                />
            </div>
            }
            
            
            <div className={styles.anoyingPhrase}>
                {
                    screenPhrases.map((e, i) => {
                        return <div key={`K${i}`} style={{ top: e.top, left: e.left }}>{e.desc}</div>
                    })
                }
            </div>

            <Clock parent={parent} clock={[ date, setDate ]}/>

            {
                completionDificulty && (() => {
                    switch(completionDificulty) {
                        case 'adv':
                            return <p>Try... holding the button</p>
                        case '0':
                            return <p>{Math.round(completionTime)} seconds cmon you can do better!</p>
                        case '1':
                            return <p>{Math.round(completionTime)} seconds... hang in there, i know you can do it!</p>
                        case '1':
                            return <p>{Math.round(completionTime)} seconds... getting there, almost half way!</p>
                        case '2':
                            return <p>{Math.round(completionTime)} seconds Wow, you have *some* patience!</p>
                        case '3':
                            return <p>{Math.round(completionTime)} seconds there we go, closer now!</p>
                        case '4':
                            return <div>
                                <h1>Congratulations!</h1>
                                
                                <h6>
                                    If you are reading this you have the virtue of patience. 
                                    <br/> 
                                    Patience is a very important skill that will serve you well and allow you to achieve your goals.
                                </h6>
                                
                            </div>
                    }
                })()
            }
        </div>
	)
}

export { PatienceTest }