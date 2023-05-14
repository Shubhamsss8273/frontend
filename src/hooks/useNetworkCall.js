// Custom Hook to use fetch API

const useNetworkCall = () => {
    const fetchData = async (url, signal = null, method = 'GET', body = null) => {
        const completeUrl = 'http://localhost:5000/' + url;
        // Can't send body in type GET request
        if (method === 'GET' || method === 'DELETE') {
            const response = await fetch(completeUrl, {
                method: method,
                mode: 'cors',
                signal: signal,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json();
            return json;
        } else {
            const response = await fetch(completeUrl, {
                method: method,
                mode: 'cors',
                signal: signal,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            const json = await response.json();
            return json;
        }
    }
    return fetchData
}

export default useNetworkCall;