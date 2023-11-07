const clientOrders = require("../models/clientOrders");
const stockOrders = require("../models/stockOrders");


// Fulfill Client Order POST Route
function fulfillOrder(currentProduct, order) {
    //console.log(req.body);

    try {
        // Step 1: Get product info
        //const currentProductDetails = await products.findOne({ productID: req.body.productID });
        const currentProductDetails = currentProduct;

        if (!currentProductDetails) {
            //return res.sendStatus(404);
            //throw new Error("Current product not found;")
            return false;
        }

        // Step 2: Project new quantity
        //const projectedStockQuantity = currentProductDetails.quantity - req.body.corderquantity;
        const projectedStockQuantity = currentProductDetails.quantity - order.corderquantity;

        /* Here is where we shouldn't allow for invalid orders, 
           so if the customer order quantity is greater than the current quantity,
           then the order can't be fulfilled and we need to handle this issue
           before allowing garbage data to populate the data store
        */
        if (projectedStockQuantity < 0){
            //res.redirect('/');
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
        //res.redirect('/');
        console.log("SUCCESS: Order successfully processed!")    // successful update
        return true
    } 
    catch (error) {
        console.log(error);
        //return res.sendStatus(500);
        //throw new Error("Homepage not found")
        return false;
    }
};

module.exports = fulfillOrder;