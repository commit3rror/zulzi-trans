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
 * Fetch armada dengan kategori yang sudah dikelompokkan
 */
export const getArmadaByCategory = async () => {
    try {
        const response = await api.get('/admin/armada');
        const armada = Array.isArray(response.data) ? response.data : [];
        
        // Group berdasarkan layanan
        const grouped = {
            'Angkutan': armada.filter(a => a.layanan?.toLowerCase() === 'angkutan'),
            'Rental': armada.filter(a => a.layanan?.toLowerCase() === 'rental'),
            'Sampah': armada.filter(a => a.layanan?.toLowerCase() === 'sampah'),
        };
        
        return grouped;
    } catch (error) {
        console.error('❌ Gagal fetch armada by category:', error);
        throw error;
    }
};
