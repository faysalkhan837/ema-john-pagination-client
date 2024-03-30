import { getShoppingCart } from "../utilities/fakedb";
   
const storedCart = getShoppingCart();
const storedCartIds = Object.keys(storedCart);
console.log(storedCartIds)
const cartProductsLoader = async () => {
    const loadedProducts = await fetch('http://localhost:5000/productsByIds',{
        method:'POST',
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify(storedCartIds)
    });
    const products = await loadedProducts.json()


    const savedCart = [];
    for (const id in storedCart) {
        // console.log(id)
        const addedProduct = products.find(pd => pd._id === id);
        if (addedProduct) {
            const quantity = storedCart[id];
            console.log(quantity);
            addedProduct.quantity = quantity;
            savedCart.push(addedProduct);
        }
    }

    // if you need to send two things
    // return [products, savedCart]
    // another options
    // return { products, cart: savedCart }

    return savedCart;
}

export default cartProductsLoader;