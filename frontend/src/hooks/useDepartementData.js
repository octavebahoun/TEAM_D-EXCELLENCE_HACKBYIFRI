import { useState, useEffect } from 'react';
import { departementService } from '../services/departementService';

export default function useDepartementData(deptId) {
    const [data, setData] = useState({ filieres: [], stats: {}, loading: true, error: null });

    useEffect(() => {
        let mounted = true;
        setData(d => ({ ...d, loading: true, error: null }));
        departementService.getDashboard()
            .then(res => {
                if (mounted) setData({ ...res, loading: false, error: null });
            })
            .catch(err => {
                if (mounted) setData(d => ({ ...d, loading: false, error: err.message || 'Erreur inconnue' }));
            });
        return () => { mounted = false; };
    }, [deptId]);

    return data;
}
