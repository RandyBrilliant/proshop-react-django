import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';

import { listProductDetails, updateProduct } from '../actions/productActions';

import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';


function ProductEditScreen({ match, history }) {

  const productId = match.params.id;

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const productDetails = useSelector(state => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector(state => state.productUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate;

  useEffect(() => {

    if (successUpdate) {
      dispatch({type: PRODUCT_UPDATE_RESET})
      history.push('/admin/productlist')
    } else {
      if (!product.name || product._id !== Number(productId)) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }

    
  }, [dispatch, productId, product, history, successUpdate])

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateProduct({
      _id: productId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description
    }))
  }

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();

    formData.append('image', file);
    formData.append('product_id', productId);

    setUploading(true);
    
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }

      const {data} = await axios.post(`/api/products/upload/`, formData, config)
      setImage(data)
      setUploading(false);

    } catch(error) {
      setUploading(false);
    }
  }

  return (
    <div>
      <Link to="/admin/productlist">Go Back</Link>

      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter Product Name"
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={e => setName(e.target.value)}
              >
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Product Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Product Price"
                value={price}
                onChange={e => setPrice(e.target.value)}
                onBlur={e => setPrice(e.target.value)}
              >
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Set Product Image"
                value={image}
                onChange={e => setImage(e.target.value)}
                onBlur={e => setImage(e.target.value)}
              >
              </Form.Control>
              <Form.File
                id="image-file"
                label="Choose File"
                custom
                onChange={uploadFileHandler}
              >
              </Form.File>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="brand">
              <Form.Label>Product Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Set Product Brand"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                onBlur={e => setBrand(e.target.value)}
              >
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>Product Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Set Product Stock"
                value={countInStock}
                onChange={e => setCountInStock(e.target.value)}
                onBlur={e => setCountInStock(e.target.value)}
              >
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Product Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Set Product Category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                onBlur={e => setCategory(e.target.value)}
              >
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Set Product Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                onBlur={e => setDescription(e.target.value)}
              >
              </Form.Control>
            </Form.Group>


            <Button type="submit" variant="primary" className="mt-3">Update</Button>
          </Form>
        )}

      </FormContainer>
    </div>

  )
}

export default ProductEditScreen
