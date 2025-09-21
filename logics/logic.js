document.addEventListener('DOMContentLoaded', function() {
    // Jalankan setup untuk setiap kalkulator jika formnya ada di halaman
    if (document.getElementById('kalkulator-kesehatan')) {
        setupKalkulatorKesehatan()
    }
    if (document.getElementById('kalkulator-mobil')) {
        setupKalkulatorMobil()
    }
    if (document.getElementById('kalkulator-jiwa')) {
        setupKalkulatorJiwa()
    }
})

// kalkulasi asuransi kesehatan 
function setupKalkulatorKesehatan() {
    const form = document.getElementById('kalkulator-kesehatan')
    form.addEventListener('submit', function(e) {
        e.preventDefault()
        
        const tanggalLahir = document.getElementById('tanggal-lahir').value
        const merokok = document.querySelector('input[name="merokok"]:checked')
        const hipertensi = document.querySelector('input[name="hipertensi"]:checked')
        const diabetes = document.querySelector('input[name="diabetes"]:checked')

        if (!tanggalLahir || !merokok || !hipertensi || !diabetes) {
            alert('Harap isi semua kolom!')
            return
        }

        const today = new Date()
        const birthDate = new Date(tanggalLahir)
        let usia = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            usia--
        }

        const P = 2000000
        let m_faktor = 0
        if (usia <= 20) m_faktor = 0.1
        else if (usia <= 35) m_faktor = 0.2
        else if (usia <= 50) m_faktor = 0.25
        else m_faktor = 0.4

        const k1 = parseInt(merokok.value)
        const k2 = parseInt(hipertensi.value)
        const k3 = parseInt(diabetes.value)
        
        const premiTahunan = P + (m_faktor * P) + (k1 * 0.5 * P) + (k2 * 0.4 * P) + (k3 * 0.5 * P)

        tampilkanHasil(premiTahunan, 'kesehatan', 'Asuransi Kesehatan', 'Tahun')
    })
}

// kalkulasi asuransi mobil
function setupKalkulatorMobil() {
    const form = document.getElementById('kalkulator-mobil')
    form.addEventListener('submit', function(e) {
        e.preventDefault()

        const hargaMobil = parseInt(document.getElementById('harga-mobil').value)
        const tahunMobil = parseInt(document.getElementById('tahun-mobil').value)
        
        if (isNaN(hargaMobil) || isNaN(tahunMobil) || hargaMobil <= 0 || tahunMobil <= 0) {
            alert('Harap isi semua kolom dengan angka yang valid!')
            return
        }

        const tahunSekarang = new Date().getFullYear()
        const umurMobil = tahunSekarang - tahunMobil

        let premiTahunan = 0
        const x = hargaMobil

        if (umurMobil >= 0 && umurMobil <= 3) {
            premiTahunan = 0.025 * x
        } else if (umurMobil > 3 && umurMobil <= 5) {
            if (x < 200000000) {
                premiTahunan = 0.04 * x
            } else {
                premiTahunan = 0.03 * x
            }
        } else if (umurMobil > 5) {
            premiTahunan = 0.05 * x
        } else {
            alert('Tahun pembuatan mobil tidak valid.')
            return
        }
        tampilkanHasil(premiTahunan, 'mobil', 'Asuransi Mobil', 'Tahun')
    })
}

// kalkulasi asuransi jiwa 
function setupKalkulatorJiwa() {
    const form = document.getElementById('kalkulator-jiwa')
    form.addEventListener('submit', function(e) {
        e.preventDefault()

        const tanggalLahir = document.getElementById('tanggal-lahir-jiwa').value
        const uangPertanggungan = parseInt(document.getElementById('uang-pertanggungan').value)

        if (!tanggalLahir || isNaN(uangPertanggungan)) {
            alert('Harap isi semua kolom!')
            return
        }

        const today = new Date()
        const birthDate = new Date(tanggalLahir)
        let usia = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            usia--
        }

        let m_tarif = 0
        if (usia <= 30) m_tarif = 0.002 // 0.2%
        else if (usia <= 50) m_tarif = 0.004 // 0.4%
        else m_tarif = 0.01 // 1%
        
        const premiBulanan = m_tarif * uangPertanggungan
        
        tampilkanHasil(premiBulanan, 'jiwa', 'Asuransi Jiwa', 'Bulan')
    })
}

// kolom pembelian 
function tampilkanHasil(harga, tipeProduk, namaProduk, periode) {
    const hasilContainer = document.getElementById('hasil-premi')
    const hargaElement = document.getElementById('harga-premi')
    const tombolBeli = document.getElementById('tombol-beli')

    const teksPremi = `Rp ${harga.toLocaleString('id-ID')} / ${periode}`
    hargaElement.innerHTML = teksPremi
    hasilContainer.style.display = 'block'

    if (tombolBeli) {
        tombolBeli.onclick = function() {
            if (localStorage.getItem('isLoggedIn') !== 'true') { // quick validation
                alert('Anda harus login terlebih dahulu untuk melakukan pembelian')
                window.location.href = 'login.html'
                return
            }

            const tanggalPembelian = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
            const transaksiBaru = {
                namaProduk: namaProduk,
                jenis: tipeProduk.charAt(0).toUpperCase() + tipeProduk.slice(1),
                tanggal: tanggalPembelian,
                harga: harga,
                status: 'Lunas'
            }

            let riwayat = JSON.parse(localStorage.getItem('riwayat_transaksi')) || []
            riwayat.push(transaksiBaru)

            localStorage.setItem('riwayat_transaksi', JSON.stringify(riwayat))

            // redirect ke profile page untuk melihat riwayat pembelian 
            alert('Pembelian berhasil! Anda akan diarahkan ke halaman profil untuk melihat riwayat transaksi.')
            window.location.href = 'profile.html'
        }
    }
}

