import {
  Box,
  Button,
  Checkbox,
  Divider,
  Text,
  useToast,
  Grid,
  GridItem
} from '@chakra-ui/react';
import CartItems from '../components/CartItems';
import { axiosInstance } from '../api';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTotalCart } from '../redux/features/cartSlice';
import { heroColor } from '../components/reuseable/Logo';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [displayDelete, setDisplayDelete] = useState('none');
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantityChecked, setTotalQuantityCheked] = useState(0);
  const toast = useToast();
  const dispatch = useDispatch();
  const cartSelector = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const fetchMyCart = async () => {
    try {
      const response = await axiosInstance.get('/cart');
      const totalPrice = await axiosInstance.get('/cart/totalPrice');
      const checkedCart = response.data.data.map((val) => val.is_checked);

      setCart(response.data.data);
      setTotalPrice(totalPrice.data.data.totalPrice);
      setTotalQuantityCheked(totalPrice.data.data.totalQuantity);
      setCheckedAll(!checkedCart.includes(false) ? true : false);
      setDisplayDelete(!checkedCart.includes(false) ? 'block' : 'none');
    } catch (error) {
      console.log(error);
    }
  };

  const renderCart = () => {
    return cart.map((val) => {
      return (
        <CartItems
          id={val.id}
          ProductId={val.Product.id}
          image_url={val.Product.Image_Urls[0]?.image_url}
          price={val.Product.price}
          product_name={val.Product.product_name}
          quantity={val.quantity}
          is_checked={val.is_checked}
          onDelete={() => deleteProductFromCart(val.id)}
          fetchCart={() => fetchMyCart()}
        />
      );
    });
  };

  const deleteProductFromCart = async (id) => {
    try {
      const response = await axiosInstance.delete(`/cart/deleteFromCart/${id}`);
      fetchMyCart();
      dispatch(setTotalCart(cartSelector.totalCart - 1));
      toast({
        title: 'Product dihapus dari keranjang',
        status: 'success',
        variant: 'top-accent',
        description: response.data.message,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const checkBtnHandler = async () => {
    try {
      await axiosInstance.patch(`/cart/checkAllCart`);
      fetchMyCart();
    } catch (error) {
      console.log(error);
    }
  };

  console.log('lengthnya', cart.length === 0);

  useEffect(() => {
    fetchMyCart();
  }, []);
  return (
    <Box
      alignItems={'center'}
      mt='60px'
      h={cart.length === 0 ? '' : '100vh'}
    >
      <Helmet>
        <meta charSet='utf-8' />
        <title>Keranjang | OusamaBike</title>
      </Helmet>
      <Grid
        maxWidth={"1200px"}
        margin={"auto"}
        templateColumns={!cart.length ? "1fr" : "3.8fr 1.7fr"}
        gap={!cart.length ? 0 : 1}
        p='0 20px'
        pt='40px'
        mx={'auto'}
        fontSize='20px'
        fontWeight={'bold'}
      >
        {/* Cart */}
        {!cart.length ? (
          <Box
            h='272px'
            display='flex'
            justifyContent={'center'}
            width='100%'
            alignItems={'center'}
          >
            <Box>
              <Text>Wah, keranjang belanjamu kosong</Text>
              <Text
                fontWeight={'medium'}
                fontSize={'14px'}
                textAlign={'center'}
              >
                Yuk, isi dengan barang-barang impianmu!
              </Text>
              <Box display='flex' justifyContent={'center'}>
                <Button
                  bgColor={heroColor}
                  color={'white'}
                  mt='2'
                  _hover={false}
                  onClick={() => navigate('/product')}
                >
                  Mulai Belanja
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
            <>
            <GridItem mr='45px'>
              <Box>Keranjang</Box>
              <Box>
                <Box
                  p='16px 0'
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  fontSize={'14px'}
                >
                  <Checkbox
                    onChange={() => checkBtnHandler()}
                    isChecked={checkedAll}
                  >
                    <Text fontWeight={'normal'} fontSize={'14px'}>
                      Pilih Semua
                    </Text>
                  </Checkbox>
                  <Text
                    display={displayDelete}
                    cursor={'pointer'}
                    color={heroColor}
                  >
                    Hapus
                  </Text>
                </Box>
                <Box h='5px' bgColor={'var(--N50,#F3F4F5)'} />
                {/* Cart Items */}
                {renderCart()}
              </Box>
            </GridItem>
            {/* Total Price */}
            <GridItem>
              <Box
                w={'350px'}
                top='140px'
                position={'fixed'}
                boxShadow={
                  '0 1px 6px 0 var(--color-shadow,rgba(49,53,59,0.12))'
                }
                p='16px'
                m='16px'
                borderRadius={'8px'}
                fontSize={'16px'}
              >
                <Text mb='16px'>Ringkasan belanja</Text>
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Text fontSize={'14px'} fontWeight={'light'}>
                    Total Harga(
                    {totalQuantityChecked} barang)
                  </Text>
                  <Text fontSize={'14px'} fontWeight={'light'}>
                    Rp. {totalPrice.toLocaleString('id-ID')}
                  </Text>
                </Box>
                <Divider m='16px 0' />
                <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                  fontWeight={'bold'}
                  fontSize={'16px'}
                >
                  <Text>Total Harga</Text>
                  <Text>Rp. {totalPrice.toLocaleString('id-ID')}</Text>
                </Box>
                <Button
                  w='100%'
                  mt='20px'
                  h='48px'
                  color={'white'}
                  bgColor={heroColor}
                  _hover={false}
                  disabled={totalQuantityChecked > 0 ? false : true}
                  onClick={() => navigate('/checkout', { state: { parameter: cart } })}
                >
                  Beli
                </Button>
              </Box>
            </GridItem>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default Cart;
