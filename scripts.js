/*  lógica de programação

[x] Pegar os dados do input, quando o botao for clicado.
[x] Ir até o servidor e trazer os produtos.
[x] Colocar os produtos na tela.
[x] Criar o gráfico de preços
*/

const searchForm = document.querySelector('.search-form')
const productList = document.querySelector('.product-list')
const priceChart = document.querySelector('.price-chart')

let myChart = ''

searchForm.addEventListener('submit', async function (event) {
    event.preventDefault()
    const inputValue = event.target[0].value

    const data = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${inputValue}`)
    const products = (await data.json()).results.slice(0, 10)
    console.log(products)

    displayItems(products)
    updatePriceChart(products)

})

function displayItems(products) {
    console.log(products)
    productList.innerHTML = products.map(product => `
    <div class="product-card">
    <img src="${product.thumbnail.replace(/\w\.jpg/gi, 'W.jpg')}" alt"${product.title}">
    <h3>${product.title}</h3>
    <p class="product-price">${product.price.toLocaleString('pt-br', { style: "currency", currency: "BRL" })}</p>
    <p class="product-store">loja: ${product.seller.nickname}</p>
    
    </div>
    
    
    `).join('')

}

function updatePriceChart(products) {

    const ctx = priceChart.getContext('2d')

    if (myChart) {
        myChart.destroy()
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: products.map(product => product.title.substring(0, 20) + '...'),
            datasets: [{
                label: 'preço (R$)',
                data: products.map(product => product.price),
                backgroundcolor: 'rgba(46, 204, 113, 0.6)',
                bordercolor: ' rgba(46, 204, 113, 1)',
                borderWidth: 1


            }]

        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return (
                                'R$ ' +
                                value.toLocaleString('pt-br', {
                                    style: 'currency', currency: 'BRL',

                                })
                            )
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tilte: {
                            display: true,
                            text: 'Comparador de preços',
                            font: {
                                size: 18
                            }
                        }
                    }
                },

            },
        },
    })

}



