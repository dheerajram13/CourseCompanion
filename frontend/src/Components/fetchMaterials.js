export const fetchMaterials = async (uid, course, visibility) => {
    try {
        const response = await fetch('http://localhost:81/study-material/materials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ })
        });

        if (response.ok) {
            const materialsData = await response.json();
            return materialsData;
        } else {
            console.error('Failed to fetch study materials');
            return [];
        }
    } catch (error) {
        console.error('Error fetching study materials:', error);
        return [];
    }
};
