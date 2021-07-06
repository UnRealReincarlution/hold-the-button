
import styles from '../../styles/Home.module.css'
import { createRef, useContext, useEffect, useState } from 'react'
import Image from 'next/image'

import down_button from '../down.png'
import up_button from '../up.png'

const Clock: React.FC<{ parent: [state: { holding: boolean, startTime: null | number, endTime: null | number }, setState: Function], clock}> = ({ parent, clock }) => {
    const [ state, setState ] = parent;
    const [ clockR, setClock ] = clock;
    
    useEffect(() => {
        const refresh = () => {
            setClock(new Date().getTime());

            setTimeout(refresh, 50)
        }

        return refresh();
    }, []);

	return (
        <h3>
            {
                state.startTime ?
                (() => {
                    const t = new Date(0);
                    t.setSeconds(((clockR - state.startTime) / 1000) * 1) // 0.89
                    return (t.toISOString().substr(14, 5));
                })()
                :
                "00:00"
            }
        </h3>
	)
}

export { Clock }