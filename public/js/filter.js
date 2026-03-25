document.addEventListener('DOMContentLoaded', function () {
    var filterBtns = document.querySelectorAll('.filter-btn')
    var productGrid = document.getElementById('productGrid')

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {

            filterBtns.forEach(function (b) {
                b.classList.remove('bg-primary')
                b.classList.remove('text-white')
                b.classList.add('bg-surface-container-low')
                b.classList.add('text-secondary')
            })
            btn.classList.add('bg-primary')
            btn.classList.add('text-white')
            btn.classList.remove('bg-surface-container-low')
            btn.classList.remove('text-secondary')

            var category = btn.dataset.category
            console.log('category clicked:', category) // ← kiểm tra

            productGrid.innerHTML = '<div class="text-center py-5 w-100">Đang tải...</div>'

            var url = '/?category=' + category
            console.log('fetch url:', url) // ← kiểm tra

            fetch(url, {
                headers: { 'Accept': 'application/json' }
            })
                .then(function (res) {
                    console.log('response status:', res.status) // ← kiểm tra
                    return res.json()
                })
                .then(function (data) {
                    console.log('data:', data) // ← kiểm tra
                    if (!data.success || !data.products.length) {
                        productGrid.innerHTML = '<p class="text-secondary text-center py-5 w-100">Không có sản phẩm nào</p>'
                        return
                    }
                    var html = ''
                    data.products.forEach(function (p) {
                        html += '<div class="col product-card" data-category="' + p.category + '">'
                        html += '  <div class="card h-100 border-0 bg-surface-container-low rounded-4xl overflow-hidden shadow-sm hover-scale">'
                        html += '    <div class="ratio ratio-1x1 bg-white">'
                        html += '      <img class="w-100 h-100 object-fit-cover" src="' + p.image + '" alt="' + p.name + '">'
                        html += '    </div>'
                        html += '    <div class="card-body p-4 d-flex flex-column">'
                        html += '      <p class="fs-9 fw-bold text-primary text-uppercase mb-2">' + p.category + '</p>'
                        html += '      <h3 class="h6 fw-bold mb-2" style="min-height:48px;">' + p.name + '</h3>'
                        html += '      <div class="mb-3 text-warning fs-7">'
                        html += '        <span>★★★★☆</span>'
                        html += '        <span class="text-muted ms-2">(4.0)</span>'
                        html += '      </div>'
                        html += '      <div class="mt-auto d-flex justify-content-between align-items-center">'
                        html += '        <span class="fw-bold fs-6 text-dark">' + p.price.toLocaleString('vi-VN') + 'đ</span>'
                        html += '        <a class="text-primary text-decoration-none fw-semibold" href="/product/' + p._id + '">Xem chi tiết</a>'
                        html += '      </div>'
                        html += '    </div>'
                        html += '  </div>'
                        html += '</div>'
                    })
                    productGrid.innerHTML = html
                })
                .catch(function (err) {
                    console.log('fetch error:', err) // ← kiểm tra
                    productGrid.innerHTML = '<p class="text-danger text-center py-5 w-100">Lỗi tải sản phẩm</p>'
                })
        })
    })
})