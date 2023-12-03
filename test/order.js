const clientOrders = require("../models/clientOrders");
const stockOrders = require("../models/stockOrders");


// Fulfill Client Order POST Route
function fulfillOrder(currentProduct, order) {
    console.log(currentProduct);

    try {
        // Step 1: Get product info
        const currentProductDetails = currentProduct;

        if (!currentProductDetails) {
            //return res.sendStatus(404);
            //throw new Error("Current product not found;")
            return false;
        }

        // Step 2: Project new quantity
        const projectedStockQuantity = currentProductDetails.quantity - order.corderquantity;

        if (projectedStockQuantity < 0){   // bad order
            console.log("ERROR: Attempting to order more than available.");
            return false;    // unsuccussful update
        }

        // Step 3: Fulfill order by saving a new fulfillment record
        const newclientOrder = new clientOrders({
            clientorderID: order.clientorderID,
            productID: order.productID,
            corderquantity: order.corderquantity,
            date: order.date,
            quantity: projectedStockQuantity, // Update the quantity field with projectedStockQuantity
        });

        newclientOrder.save();

        // Step 4: Update product document data with projected stock quantity
        currentProductDetails.projectedStockQuantity = projectedStockQuantity;
        currentProductDetails.save(); // Save the updated product document

        // Step 5: Create a new stockOrders object when necessary
        // This may need to be cleaned up for testing but for now it's not an issue 
        if (currentProductDetails.autorestock === 'enabled' && projectedStockQuantity <= currentProductDetails.minstock) {
            const newStockOrder = new stockOrders({
                stockorderID: uuid.v4(),
                date: new Date(),
                productID: req.body.productID,
                sorderquantity: currentProductDetails.maxstock - projectedStockQuantity,
            });
            newStockOrder.save();
        }
        console.log("SUCCESS: Order successfully processed!")    // successful update
        return true
    } 
    catch (error) {    // catchall
        console.log(error);
        return false;    
    }
};

module.exports = fulfillOrder;