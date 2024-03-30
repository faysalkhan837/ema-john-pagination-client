import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const carts = useLoaderData()
    const [cart, setCart] = useState(carts)
    // console.log(cart)
    // const  {count}  = useLoaderData(); 
    const [count, setCount] = useState(0)
    const [curentPage, setCurentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const numberOfPages = Math.ceil(count / itemsPerPage);
    //    const pages = [];
    //    for( let i = 0; i < numberOfPages; i++){
    //     pages.push(i);
    //    }

    // you can use this method einsted of for loop

    const pages = [...Array(numberOfPages).keys()];
    console.log(pages)

    useEffect( () =>{
        fetch("http://localhost:5000/productsCount")
        .then(res => res.json())
        .then(data => setCount(data.count))
    },[])

    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${curentPage}&size=${itemsPerPage}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [curentPage, itemsPerPage]);

    // useEffect(() => {
    //     const storedCart = getShoppingCart();
    //     // console.log(storedCart)
    //     const savedCart = [];
    //     // step 1: get id of the addedProduct
    //     for (const id in storedCart) {
    //         // step 2: get product from products state by using id
    //         const addedProduct = products.find(product => product._id === id)
    //         if (addedProduct) {
    //             // step 3: add quantity
    //             const quantity = storedCart[id];
    //             addedProduct.quantity = quantity;
    //             // step 4: add the added product to the saved cart
    //             savedCart.push(addedProduct);
    //         }
    //         // console.log('added Product', addedProduct)
    //     }
    //     // step 5: set the cart
    //     setCart(savedCart);
    // }, [products])

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    const handleItemPerpage = e => {
        console.log(e.target.value)
        const val = parseInt(e.target.value)
        setItemsPerPage(val);
        setCurentPage(0);
    }

    const handlePrevPage = () => {
        if(curentPage > 0){
            setCurentPage(curentPage - 1)
        }
    }
    const handleNextPage = () =>{
        if(curentPage < pages.length - 1){
            setCurentPage(curentPage + 1)
        }
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
            <div className='pagination'>
                <p>curant page : {curentPage}</p>
                <button onClick={handlePrevPage}>Prev</button>
                {
                    pages.map(page => <button key={page}
                        className={curentPage === page ? "selected" : undefined}
                        onClick={() => setCurentPage(page)}
                    >{page}</button>)
                }
                <button onClick={handleNextPage}>Next</button>
                <select value={itemsPerPage} onChange={handleItemPerpage} name="" id="">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>
        </div>
    );
};

export default Shop;