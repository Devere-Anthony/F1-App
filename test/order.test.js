// Test fulfillOrder
const fulfillOrder = require("./order");
const clientOrders = require("../models/clientOrders");
const stockOrders = require("../models/stockOrders");
const products = require("../models/products")

// create "mocks" of a client order and a stock order 
const currentProduct = new products({
    productID: "dfb0ebbc-6144-4be4-85d4-94f217c185f5",
    productName: "Ethiopian Washed",
    barcode: "88888",
    category: "Light Roast",
    retail: "20.00",
    wholesale: "18.00",
    quantity: 20,
    autorestock: "True",
    maxstock: 100,
    minstock: 0,
});

const newclientOrder1 = new clientOrders({
    clientorderID: "dfb0ebbc-6144-4be4-85d4-94f217c185f1",
    productID: "dfb0ebbc-6144-4be4-85d4-94f217c185f5",
    corderquantity: 40,
    date: Date.now(),
    quantity: 20, // Update the quantity field with projectedStockQuantity
});

const newclientOrder2 = new clientOrders({
    clientorderID: "dfb0ebbc-6144-4be4-85d4-94f217c185f2",
    productID: "dfb0ebbc-6144-4be4-85d4-94f217c185f5",
    corderquantity: 15,
    date: Date.now(),
    quantity: 20, // Update the quantity field with projectedStockQuantity
});


/* TEST SUITE FOR fulfillOrder() */
describe("fulfillOrder", () => {
    /* Test case 1: Don't allow orders greater than current quantity */
    test("returns false if order is greater than quantity", () => {
        expect(fulfillOrder(currentProduct, newclientOrder1)).toBe(false);
    });

    /* Test case 2: Allow orders less than current quanity */
    test("returns true if order is greater than quantity", () => {
        expect(fulfillOrder(currentProduct, newclientOrder2)).toBe(true);
    });
})