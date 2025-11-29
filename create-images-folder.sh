#!/bin/bash
# Script untuk membuat folder images di public

mkdir -p public/images

echo "✅ Folder public/images/ sudah dibuat"
echo ""
echo "📁 Struktur folder:"
echo "public/"
echo "  └── images/"
echo ""
echo "📝 Langkah berikutnya:"
echo "1. Copy gambar armada (cdd.jpg, fuso.jpg, avanza.jpg, etc) ke folder public/images/"
echo "2. Jalankan: php artisan migrate"
echo "3. Jalankan: php artisan db:seed --class=ArmadaSeeder"
echo "4. Buka http://localhost:8000/beranda"
