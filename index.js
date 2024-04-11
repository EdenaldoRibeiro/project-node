const express = require('express')
const uuid =  require('uuid')

const port = 3010
const app = express()
app.use(express.json())
const orders = []

const logRequisiçao = (request, response , next) => {

    console.log(`Method:${request.method} , URL: ${request.url}`)

    next()
}

app.use(logRequisiçao)



const checkOrder = (request, response, next) => {

    const {id} = request.params

    const index = orders.findIndex(order =>order.id === id)

    if (index < 0) {
        return response.status(404).json({message: 'User Not Found'})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

 // Rota que lista todos os pedidos já feitos.
app.get('/orders', (request, response) => {

    return response.json(orders) 
})

app.get('/orders/:id',checkOrder, (request, response) => {

    const id = request.orderId 
    const index = request.orderIndex


    return response.json(orders[index]) 
})


// A rota deve receber o pedido do cliente, o nome do cliente e o valor do pedido, essas informações devem ser passadas dentro do corpo(body) da requisição, e com essas informações você deve registrar o novo pedido dentro de um array
app.post('/orders', (request, response) => {

    const {order, clientName, price, status } = request.body
 
    const newOrder = {id:uuid.v4(), order, clientName, price, status}

    orders.push(newOrder)

   return response.status(201).json(newOrder)

})


// Essa rota deve alterar um pedido já feito. Pode alterar,um ou todos os dados do pedido
app.put('/orders/:id',checkOrder , (request, response) => {

    const {order, clientName, price, status} = request.body
    
    const id = request.orderId
    const index = request.orderIndex

    const updatedOrder = {id, order, clientName, price, status}

    orders[index] = updatedOrder

    return response.json(updatedOrder)
     
})

// Essa rota deve deletar um pedido já feito com o id enviado nos parâmetros da rota.
app.delete('/orders/:id',checkOrder , (request, response) => {

        const id = request.orderId
        const index = request.orderIndex

        orders.splice(index,1)

        return response.status(204).json()

})

app.patch('/orders/:id', checkOrder, (request, response)=> {

    const index = request.orderIndex 
    const id =request.orderId 

    const {order, clientName, price, status} = request.body

    const orderReady = {
        id,
        order: orders[index].order,
         clientName: orders[index].clientName, 
         price: orders[index].price,
        status: orders[index].status = "Pronto"
    }

    return response.json(orderReady)
})




app.listen(port,()=> console.log(`Server started on port,${port}`))