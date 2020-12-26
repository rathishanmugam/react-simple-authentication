import {useEffect, useState} from 'react';

export const useFetch = (url) => {
    const [state, setState] = useState({data: {}, loading: true});
    useEffect(() => {
        setState(state => ({data: state.data, loading: true}));
        fetch(url)
            .then(x => {
                if (!x.ok) {
                    throw new Error('FFailed to fetch')
                }
                return x.text()
            })
            .then(y =>
                setState({data: y, loading: false}))
            .catch(err => {
                console.log(err);
            });
    }, [url, setState])
    return state;
}

