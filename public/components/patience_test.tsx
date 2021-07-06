
import styles from '../../styles/Home.module.css'
import { createRef, useContext, useEffect, useState } from 'react'


const PatienceTest: React.FC<{ parent: [state: { holding: boolean, startTime: null | number, endTime: null | number }, setState: Function]}> = ({ parent }) => {
    const [ state, setState ] = parent;
    const [ date, setDate ] = useState(new Date().getTime());

    const [ completionDificulty, setCompletionDificulty ] = useState(null); 
    const [ completionTime, setCompletionTime ] = useState(null);

    const [ screenPhrases, setScreenPhrases ] = useState([]);

    const [ viewed, setViewed ] = useState("00:00:00");

    useEffect(() => {
        const refresh = () => {
            setDate(new Date().getTime());

            if(state.holding && ((Math.random() * 1000) <= 500)) {
                const index = Math.random() * 1000;
                setScreenPhrases([ ...screenPhrases, {
                    desc: 'WHAAA',
                    index: index,
                } ])

                setTimeout(() => {
                    screenPhrases.splice(screenPhrases.findIndex(e => e.index == index), 1);
                    setScreenPhrases(screenPhrases);
                }, 5000);
            }

            setTimeout(refresh, 50)
        }

        return refresh();
    }, []);

    useEffect(() => {
        console.log(state.holding, state.endTime)
        if(!state.holding && state.endTime) {
            const sec = (state.endTime) / 1000;
            setCompletionTime(sec);

            if(sec < 3) setCompletionDificulty('0')
            else if(sec < 15) setCompletionDificulty('1')
            else if(sec < 30) setCompletionDificulty('2')
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
            <div className={styles.button}>
                {/* <div className={styles.buttonBase}></div>
                <div className={styles.buttonBase}></div>

                <div className={styles.buttonTopper}></div>

                <div className={`${styles.buttonButton} ${state.holding ? styles.buttonHeld : styles.buttonReleased}`} >
                    <div className={styles.buttonBase}></div>
                    <div className={styles.buttonBase}></div>

                    <div className={styles.buttonTopper}></div>
                </div> */}

                <img src={`${state.holding ? '../../down.PNG' : '../../up.png'}`} alt="" 
                    onDragStart={(e) => e.preventDefault()}
                />
            </div>
            
            <div className={styles.anoyingPhrase}>
                {
                    screenPhrases.map(e => {
                        return <div>{e.desc}</div>
                    })
                }
            </div>

            <h3>
                {/* {
                    state.startTime ? 
                        date - state.startTime
                    :
                    "00:00:00"
                } */}

                {
                    state.startTime ?
                    (() => {
                        const t = new Date(0);
                        t.setSeconds(((date - state.startTime) / 1000) * 1) // 0.89
                        return (t.toISOString().substr(14, 5));
                    })()
                    :
                    "00:00"
                }
            </h3>

            {
                completionDificulty && (() => {
                    switch(completionDificulty) {
                        case '0':
                            return <p>{completionTime}s Wow, you have the patience of a goldfish!</p>
                        case '1':
                            return <p>{completionTime}s Wow, like... some patience I guess.</p>
                        case '2':
                            return <p>{completionTime}s Wow, have *some* patience!</p>
                        case '3':
                            return <p>{completionTime}s okayyyy! almost 1min!!</p>
                        case '4':
                            return <p>{completionTime}s Wow, you have some incredible patience!</p>
                    }
                })()
            }
        </div>
	)
}

export { PatienceTest }