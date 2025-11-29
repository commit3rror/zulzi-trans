import api from './api';

/**
 * Fetch semua armada dari database
 */
export const getAllArmada = async () => {
    try {
        const response = await api.get('/admin/armada');
        return response.data;
    } catch (error) {
        console.error('❌ Gagal fetch armada:', error);
        throw error;
    }
};

/**
 * Fetch armada berdasarkan layanan/kategori
 * @param {string} layanan - Nama layanan: 'Rental', 'Angkutan', 'Sampah', dll
 */
export const getArmadaByLayanan = async (layanan) => {
    try {
        const response = await api.get('/admin/armada', {
            params: { search: layanan }
        });
        // Filter hasil berdasarkan layanan
        const filtered = Array.isArray(response.data) 
            ? response.data.filter(armada => 
                armada.layanan?.toLowerCase() === layanan.toLowerCase()
              )
            : [];
        return filtered;
    } catch (error) {
        console.error(`❌ Gagal fetch armada untuk layanan ${layanan}:`, error);
        throw error;
    }
};

/**
 * Fetch armada dengan kategori yang sudah dikelompokkan (PUBLIC)
 * Menggunakan endpoint public /armada-list
 */
export const getArmadaByCategory = async () => {
    try {
        const response = await api.get('/armada-list');
        // Response structure: { success: true, data: [...] }
        const armada = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        
        // Group berdasarkan layanan
        const grouped = {
            'Angkutan': armada.filter(a => a.layanan?.toLowerCase() === 'angkutan'),
            'Rental': armada.filter(a => a.layanan?.toLowerCase() === 'rental'),
            'Sampah': armada.filter(a => a.layanan?.toLowerCase() === 'sampah'),
        };
        
        console.log('✅ Fetched armada by category:', grouped);
        return grouped;
    } catch (error) {
        console.error('❌ Gagal fetch armada by category:', error);
        // Return empty object jika error, jangan throw
        return {
            'Angkutan': [],
            'Rental': [],
            'Sampah': [],
        };
    }
};
