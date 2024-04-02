import { Box, Button, Grid, Image, Text, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiOutlineRight } from 'react-icons/ai';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  addToWishlistHandler,
  fetchProduct,
} from '../components/reuseable/fetch';
import { heroColor } from '../components/reuseable/Logo';
import { doubleOnclick } from './admin/ManageProduct';
import { BiHeart } from 'react-icons/bi';
import { BsChatLeftText } from 'react-icons/bs';
import { axiosInstance } from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { setTotalCart } from '../redux/features/cartSlice';
import { setTotalWishlist } from '../redux/features/wishlistSlice';

const Product = () => {
  const [product, setProduct] = useState({});
  const [isOver, setIsOver] = useState(false);
  const [image, setImage] = useState({});
  const navigate = useNavigate();
  const params = useParams();
  const toast = useToast();
  const dispatch = useDispatch();
  const cartSelector = useSelector((state) => state.cart);
  const wishlistSelector = useSelector((state) => state.wishlist);

  const addToCart = async (id) => {
    try {
      const response = await axiosInstance.post(`/cart/addToCart/${id}`, {
        quantity: 1,
      });

      dispatch(setTotalCart(cartSelector.totalCart + 1));

      toast({
        title: 'Product ditambahkan ke keranjang',
        status: 'success',
        variant: 'top-accent',
        description: response.data.message,
      });
    } catch (error) {
      console.log(error.response);
      toast({
        title: 'Product sudah ada di keranjang',
        status: 'info',
        variant: 'top-accent',
        description: error.response.data.message,
      });
    }
  };
  console.log(cartSelector.totalCart);

  useEffect(() => {
    fetchProduct(params.id).then((res) =>
      doubleOnclick(setProduct(res), setImage(res.Image_Urls[0].image_url))
    );
  }, []);
  return (
    <Box p='19px 0 0 ' mx='auto' w='1188px' mt='80px'>
      <Box mb='19px'>
        <Text fontSize={'12px'} display='flex' color={heroColor}>
          <Link to='/'>Home </Link>
          <Text
            mr='2'
            ml='2'
            display={'inline'}
            color={'#6d7588'}
            fontSize='12px'
            mt='3px'
          >
            <AiOutlineRight />
          </Text>
          {product?.Category?.category_name}
          <Text
            mr='2'
            ml='2'
            display={'inline'}
            color={'#6d7588'}
            fontSize='12px'
            mt='3px'
          >
            <AiOutlineRight />
          </Text>
          {product?.Brand_Category?.brand_name}
          <Text
            mr='2'
            ml='2'
            display={'inline'}
            color={'#6d7588'}
            fontSize='12px'
            mt='3px'
          >
            <AiOutlineRight />
          </Text>
          <Text color={'black'}>{product?.product_name}</Text>
        </Text>
      </Box>
      <Grid templateColumns={'348px 468px auto'} gap='52px'>
        <Box w='348px'>
          <Box overflow={'hidden'} h='348px'>
            <Image
              w={isOver}
              h={isOver}
              src={`${process.env.REACT_APP_API_IMAGE_URL}${image}`}
              onMouseOver={() => setIsOver('600px')}
              onMouseOut={() => setIsOver('348px')}
              objectFit='cover'
              cursor={'pointer'}
            />
          </Box>
          <Box h='64px' display={'flex'} mt='8px'>
            {product?.Image_Urls?.map((val) => (
              <Box
                pr='7px'
                onClick={() => setImage(val.image_url)}
                cursor={'pointer'}
              >
                <Image
                  key={val.id}
                  src={`${process.env.REACT_APP_API_IMAGE_URL}${val.image_url}`}
                  border='2px solid white'
                  borderRadius={'8px'}
                  w='60px'
                  h='60px'
                  _hover={{ border: `2px solid ${heroColor}` }}
                />
              </Box>
            ))}
          </Box>
        </Box>
        <Box mb='4px'>
          <Text fontSize={'18px'} fontWeight='bold' mb='16px'>
            {product?.product_name}
          </Text>
          <Text fontSize={'28px'} fontWeight='extrabold'>
            Rp{product?.price?.toLocaleString('id-ID')}
          </Text>
          <Box h='1px' backgroundColor={'var(--NN50,#F0F3F7)'} m='16px 0'></Box>
          <Box fontSize={'14px'} color='var(--NN600,#6D7588)'>
            <Text mb='4px'>
              Kategori:{' '}
              <Text display={'inline'} color='black' fontWeight={'bold'}>
                {product?.Category?.category_name}
              </Text>
            </Text>
            <Text mb='4px'>
              Merek:{' '}
              <Text display={'inline'} color='black' fontWeight={'bold'}>
                {product?.Brand_Category?.brand_name}
              </Text>
            </Text>
          </Box>
          <Box mt='12px' fontSize={'14px'} whiteSpace='pre-line'>
            {product?.description}
          </Box>
        </Box>
        <Box>
          <Box
            p='0 12px'
            border={'1px solid var(--NN300,#BFC9D9)'}
            borderRadius='8px'
            fontSize={'14px'}
          >
            <Text m='12px 0'>
              Stok:{' '}
              <Text fontWeight={'bold'} display='inline'>
                {product?.stock}
              </Text>
            </Text>
            <Box mt='12px' mb='16px'>
              <Button
                w='100%'
                mb='8px'
                _hover={false}
                _active={false}
                bgColor={heroColor}
                color='white'
                fontSize={'14px'}
                onClick={() => addToCart(product.id)}
              >
                + Keranjang
              </Button>
              {/* <Link to="/chat">
                <Button
                  w="100%"
                  mb="12px"
                  border={`1px solid ${heroColor}`}
                  bgColor="white"
                  color={heroColor}
                  _hover={false}
                  _active={false}
                  fontSize={"14px"}
                >
                  Chat
                </Button>
              </Link> */}
              <Box mt='16px' display={'flex'} alignItems={'center'}>
                <Button
                  w='50%'
                  _hover={false}
                  _active={false}
                  bgColor={'transparent'}
                  onClick={() =>
                    addToWishlistHandler(params.id).then((res) =>{
                    dispatch(setTotalWishlist(wishlistSelector.totalWishlist + 1))
                      res.error
                        ? toast({
                          title: 'Produk gagal ditambahkan ke wishlist',
                          description: res,
                          status: 'error',
                          variant: 'top-accent',
                        })

                        : toast({
                          title: 'Produk ditambahkan ke wishlist',
                          description: res,
                          status: 'success',
                          variant: 'top-accent',
                        })}
                    )
                  }
                  p='0 12px'
                  h='auto'
                  fontSize={'12px'}
                  borderRight={'1px solid grey'}
                  borderRadius={0}
                >
                  <Box display={'inline'} mr='6px'>
                    <BiHeart />
                  </Box>
                  Wishlist
                </Button>

                <Button
                  w='50%'
                  bgColor='transparent'
                  _hover={false}
                  _active={false}
                  fontSize={'12px'}
                  p='0 12px'
                  h='auto'
                  onClick={() => navigate('/chat')}
                >
                  <Box display={'inline'} mr='6px'>
                    <BsChatLeftText />
                  </Box>
                  Chat
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default Product;
