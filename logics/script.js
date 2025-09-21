document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus()

    if (document.getElementById('profile-name')) {
        setupProfilePage()
    }
})

function checkLoginStatus() {
    const navMenu = document.getElementById('nav-menu')
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

    if (isLoggedIn) {
        const userInfo = JSON.parse(localStorage.getItem('user_info'))
        const userName = userInfo ? userInfo.fullName : 'Pengguna'
        const userInitial = userName.charAt(0).toUpperCase()

        navMenu.innerHTML = `
            <a href="../pages/profile.html" class="profile-avatar" title="Lihat Profil">
                ${userInitial}
            </a>
        `
    } else {
        navMenu.innerHTML = `
            <a href="../pages/login.html">Login</a>
            <a href="../pages/signup.html" class="btn btn-primary">Daftar</a>
        `
    }
}

function setupProfilePage() {
    const profileName = document.getElementById('profile-name')
    const profileEmail = document.getElementById('profile-email')
    const logoutButton = document.getElementById('logout-btn-profile')

    const userInfo = JSON.parse(localStorage.getItem('user_info'))
    if (userInfo) {
        profileName.textContent = userInfo.fullName
        profileEmail.textContent = userInfo.email
    }

    const historyTableBody = document.getElementById('history-table-body')
    const noHistoryMessage = document.getElementById('no-history-message')
    const historyTable = document.getElementById('history-table')
    const riwayat = JSON.parse(localStorage.getItem('riwayat_transaksi')) || []

    if (riwayat.length > 0) {
        historyTable.style.display = 'table'
        noHistoryMessage.style.display = 'none'
        
        historyTableBody.innerHTML = ''

        riwayat.forEach(trx => {
            const row = document.createElement('tr')
            row.innerHTML = `
                <td>${trx.namaProduk}</td>
                <td>${trx.jenis}</td>
                <td>${trx.tanggal}</td>
                <td>Rp ${trx.harga.toLocaleString('id-ID')}</td>
                <td><span class="status-lunas">${trx.status}</span></td>
            `
            historyTableBody.appendChild(row)
        })

    } else {
        historyTable.style.display = 'none'
        noHistoryMessage.style.display = 'block'
    }


    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('isLoggedIn')
            localStorage.removeItem('user_info')
            
            window.location.href = 'login.html'
        })
    }
}

