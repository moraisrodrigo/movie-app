import { TMDB_API_KEY } from '../settings';

const addParam = (previousParams: string, paramName: string, value: string): string => {
    const newParam = value.trim() === '' ? paramName : `${paramName}=${encodeURIComponent(value)}`
    
    return previousParams === '' ? newParam : `${previousParams}&${newParam}`;
}

const objectToParams = (request: Record<string, unknown>): string => {
    let params = '';

    Object.keys(request).forEach((paramName: string) => {
        const value = request[paramName];

        if (value === undefined || value === null) return;

        params = addParam(params, paramName, String(value));
    })

    return `?api_key=${TMDB_API_KEY}&${params}`;
}

export { objectToParams };
