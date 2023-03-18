const Server= require('socket.io')

class ChatBot {
    
    orderItems = {
        2: "Rice",
        3: "Beans",
        4: "item3"
    }

    msg = `
        Select 1 to place order\n 
        Select 99 to checkout order\n 
        Select 98 to see order history\n 
        Select 97 to see current order\n
        Select 0 to cancel order\n
    `
    current_order = [];
    order_history = []

    async start(server) {
        const io = Server(server)   

        io.on('connection',  async (socket) => {
            console.log(this.msg)
            
            await socket.emit("welcome", this.msg);

            let serverMessage = async(message) => {
                console.log("Sending message to client:", message)
                await socket.emit('message', message)
            }

            let placeOrder = async(arr) => {
                console.log(arr)
                // arr.map(function(key) {
                //     if (parseInt(key) in Object.keys(this.orderItems))
                //     return this.orderItems[key]
                // })
                arr.forEach(async element => {
                    console.log(`${arr}: arr + elem: ${element}`)
                    let elem = parseInt(element)
                    if (this.orderItems.hasOwnProperty(elem)) {

                        // return the selected items values
                        let selected = this.orderItems[elem] //error here this will alwaysovewrite on each loop
                        this.current_order = []
                        this.current_order.push(selected)

                        await serverMessage(`Type 99 to checkout ${selected}\n Type 0 to cancel Order`)
                    }
                    else{
                        await serverMessage(`Invalid key ${elem}`)
                        await serverMessage(this.orderItems)
                    }
                });
            }

            let validateResponse = async(input, expectedInput) => {
                input === expectedInput ? await serverMessage(input) : await serverMessage(`Invalid Input`)
            }

            let userInput = async (message) => {
                switch (message){
                    case "1":
                        await serverMessage(this.orderItems)
                        socket.on('place-order', async function(arr){
                            await placeOrder(arr)
                            // await validateResponse(message, 99 || 0)
                        })
                        break;
                        // use socket.on to get input from client or.. type in the cases
                    case "99":
                        if (this.current_order.length !== 0) {
                            await serverMessage("order placed")
                            this.order_history.push(this.current_order) 
                        } else {
                            await serverMessage(`No order to place. Type in 1 to place an order`)
                        }
                        break;
                    case "98":
                        if (this.order_history.length !== 0){
                            await serverMessage(this.order_history)
                        } else {
                            await serverMessage("You haven't placed any orders yet")
                        }
                        break;
                    case "97":
                        if(this.current_order.length !== 0){
                            await serverMessage(this.current_order)
                        } else {
                            await serverMessage("You haven't placed any orders")
                        }
                        break;
                    case "0":
                        console.log(this.current_order.length)
                        if (this.current_order.length !== 0) {
                            this.current_order = []
                            await serverMessage("Order cancelled")
                        } else{
                            await serverMessage("You have no current orders")
                            await serverMessage(this.msg)
                        }
                        break;
                    default:
                        await serverMessage(`Invalid Input\n${this.msg}`)
                }
            }
            socket.on("user-input", userInput)
        })
    }
}

module.exports = ChatBot
