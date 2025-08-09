import { useEffect, useState } from 'react';
import { ApiService } from '../api-service';

export const useViewModel = () => {
    const [rules, setRules] = useState([]);

    const getRules = async () => {
        try {
            const response = await ApiService.getRuleManagementApi();
            // setRules(response.rules || []);
        } catch (error) {
            console.error('Error fetching rules:', error);
        }
    };

    useEffect(() => {
        getRules();
    }, []);

    return {
        selectors: {},
    };
};
