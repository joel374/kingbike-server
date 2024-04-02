import {
  Avatar,
  Box,
  Button,
  FormControl,
  Image,
  Input,
  InputGroup,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useToast,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { createSearchParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { BiHeart, BiLogOutCircle } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { heroColor } from './reuseable/Logo';
import { logout } from '../redux/features/authSlice';
import { RiAdminLine } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { setTotalCart } from '../redux/features/cartSlice';
import { axiosInstance } from '../api';
import logo from '../assets/logo.png';

const Navbar = () => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const authSelector = useSelector((state) => state.auth);
  const cartSelector = useSelector((state) => state.cart);
  const wishlistSelector = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const fetchMyCart = async () => {
    try {
      const response = await axiosInstance.get('/cart');
      setCartItems(response.data.data);
      dispatch(setTotalCart(response.data.data.length));
    } catch (error) {
      console.log(error);
    }
  };

  const renderCart = () => {
    return cartItems.map((val) => {
      return (
        <Box
          display={'flex'}
          p='8px 0'
          fontSize={'14px'}
          fontWeight={'bold'}
          borderBottom={'1px solid #e6e6e6'}
          onClick={() => navigate('/cart')}
        >
          <Image
            src={
              process.env.REACT_APP_API_IMAGE_URL +
              val.Product.Image_Urls[0].image_url
            }
            w='40px'
            h='40px'
            mr='8px'
          />
          <Box w='100%'>
            <Box textOverflow={'ellipsis'} overflow={'hidden'} h='20px'>
              {val.Product.product_name}
            </Box>
            <Box fontWeight={'thin'} fontSize={'10px'} h='16px' mt='2px'>
              {val.quantity} barang
            </Box>
          </Box>
          <Box
            ml='8px'
            display={'flex'}
            alignItems={'center'}
            color={'#fa591d'}
          >
            Rp.{val.Product.price.toLocaleString('id-ID')}
          </Box>
        </Box>
      );
    });
  };

  const logoutBtnHandler = () => {
    localStorage.removeItem('auth_token');
    dispatch(logout());

    toast({
      status: 'info',
      title: 'Logout Sukses',
      description: 'Akun Logout',
      variant: 'top-accent',
    });
  };

  const changeBtnHandler = (e) => {
    setSearchValue(e.target.value);
    // onChange(e);
  };

  const keyDownBtnHandler = (e) => {
    if (e.key === 'Enter') {
      navigate({
        pathname: '/product',
        search: createSearchParams({
          name: searchValue,
        }).toString(),
      });
      // onKeyDown(e);
    }
  };

  useEffect(() => {
    fetchMyCart();
  }, []);

  return (
    // <Box
    //   boxShadow={'rgba(0, 0, 0, 0.24) 0px 3px 8px'}
    //   position={'fixed'}
    //   left='0'
    //   right={'0'}
    //   top='0'
    //   zIndex='9998'
    //   backgroundColor={heroColor}
    // >
    //   <Box>
    //     <HStack
    //       height={{ lg: '65px', md: '52px', base: '52px' }}
    //       width='96%'
    //       mx={{ lg: 'auto', md: '0', base: '0' }}
    //       p={{ lg: '0', md: '8px 10px 4px 16px', base: '8px 10px 4px 16px' }}
    //     >
    //       <Link to={'/'}>
    //         <Box display={{ lg: 'flex', md: 'none', base: 'none' }}>
    //           <Logo color={'white'} />
    //         </Box>
    //       </Link>

    //       <Box display={'flex'} alignItems='center' w='100%'>
    //         {/* Search Input */}
    //         <Box w='100%' ml={'16px'}>
    //           <form
    //           //   onSubmit={formikSearch.handleSubmit}
    //           >
    //             <FormControl>
    //               <InputGroup textAlign={'right'}>
    //                 <Input
    //                   type={'text'}
    //                   placeholder={'Cari di OusamaBike'}
    //                   _placeholder={{
    //                     fontSize: '14px',
    //                   }}
    //                   name='search'
    //                   h={'40px'}
    //                   pb={'0'}
    //                   //   w={width}
    //                   // onChange={searchHandler}
    //                   onChange={changeBtnHandler}
    //                   onKeyDown={keyDownBtnHandler}
    //                   value={searchValue}
    //                   borderRightRadius='0'
    //                   //   value={formikSearch.values.search}
    //                   bgColor={'white'}
    //                   _hover={false}
    //                 />

    //                 <Button
    //                   borderLeftRadius={'0'}
    //                   type='submit'
    //                   bgColor={'white'}
    //                   h={'40px'}
    //                   _hover={false}
    //                   border={`1px solid c`}
    //                   borderLeft={'0px'}
    //                 >
    //                   <TbSearch />
    //                 </Button>
    //               </InputGroup>
    //             </FormControl>
    //           </form>
    //         </Box>

    //         {/* Cart */}
    //         <Box ml='20px' mr='4px'>
    //           <Popover trigger={'hover'}>
    //             <PopoverTrigger>
    //               <Box
    //                 w='37px'
    //                 h='37px'
    //                 onClick={() => navigate('/cart')}
    //                 display={'flex'}
    //                 alignItems={'center'}
    //                 justifyContent={'center'}
    //                 color={'white'}
    //                 _hover={{
    //                   bgColor: 'var(--N50,#F3F4F5)',
    //                   color: heroColor,
    //                   borderRadius: '3px',
    //                 }}
    //                 p='5px 0'
    //               >
    //                 <BsCart3 />
    //                 {cartSelector.totalCart > 0 ? (
    //                   <Box
    //                     ml='20px'
    //                     mb='20px'
    //                     display={'inline'}
    //                     position={'absolute'}
    //                   >
    //                     <Box
    //                       display={'flex'}
    //                       color={'white'}
    //                       bgColor={'red'}
    //                       borderRadius={'50%'}
    //                       fontSize={'10px'}
    //                       p='8px'
    //                       fontWeight={'800'}
    //                       w={cartSelector.totalCart > 9 ? 'auto' : '12px'}
    //                       h='12px'
    //                       alignItems={'center'}
    //                       justifyContent={'center'}
    //                     >
    //                       {cartSelector.totalCart}
    //                     </Box>
    //                   </Box>
    //                 ) : null}
    //               </Box>
    //             </PopoverTrigger>
    //             <PopoverContent w={'350px'} bgColor={'white'}>
    //               <PopoverBody p='0' cursor={'pointer'}>
    //                 <Box m='0 16px' bgColor={'white'}>
    //                   <Box
    //                     p='16px 0 8px'
    //                     borderBottom={'1px solid #e6e6e6'}
    //                     display={'flex'}
    //                     justifyContent={'space-between'}
    //                     alignItems={'center'}
    //                   >
    //                     <Text fontWeight={'bold'} fontSize={'14px'}>
    //                       Keranjang ({cartSelector.totalCart})
    //                     </Text>
    //                     <Text
    //                       fontWeight={'bold'}
    //                       fontSize={'14px'}
    //                       color={heroColor}
    //                       onClick={() => navigate('/cart')}
    //                     >
    //                       Lihat Sekarang
    //                     </Text>
    //                   </Box>
    //                   {renderCart()}
    //                 </Box>
    //               </PopoverBody>
    //             </PopoverContent>
    //           </Popover>
    //           {/*  */}
    //         </Box>
    //       </Box>

    //       <Box
    //         display={{ lg: 'flex', md: 'none', base: 'none' }}
    //         gap='4'
    //         fontSize='14px'
    //         fontWeight={'semibold'}
    //         pl={'8px'}
    //       >
    //         {/* LoggedIn */}
    //         {authSelector.username ? (
    //           <Box display={'flex'} mr='2' ml='1' cursor={'pointer'}>
    //             <Popover trigger={'hover'}>
    //               <PopoverTrigger>
    //                 <Box
    //                   display={'flex'}
    //                   my='auto'
    //                   color={'white'}
    //                   minW={'113px'}
    //                   maxW='200px'
    //                   paddingLeft='5px'
    //                   paddingRight={'5px'}
    //                   _hover={{
    //                     bgColor: 'var(--N50,#F3F4F5)',
    //                     color: heroColor,
    //                     borderRadius: '3px',
    //                   }}
    //                 >
    //                   <Avatar
    //                     size='sm'
    //                     name={authSelector.username}
    //                     mr={2}
    //                     ml={2}
    //                     width={'25px'}
    //                     height='25px'
    //                     my='auto'
    //                   />
    //                   <Text my='auto' padding={'8px'}>
    //                     {authSelector.username.split(' ')[0]}
    //                   </Text>
    //                 </Box>
    //               </PopoverTrigger>
    //               <PopoverContent w={'300px'} mr='4' bgColor={'white'}>
    //                 <PopoverBody>
    //                   <Box p='2 4' bgColor={'white'}>
    //                     <Box
    //                       boxShadow={'rgba(0, 0, 0, 0.24) 0px 3px 8px'}
    //                       display={'flex'}
    //                       my='auto'
    //                       padding='6px 12px'
    //                       borderRadius={'5px'}
    //                       bgColor={'white'}
    //                       cursor={'pointer'}
    //                     >
    //                       <Avatar
    //                         name={authSelector.username}
    //                         mr={2}
    //                         width={'50px'}
    //                         height='50px'
    //                         my='auto'
    //                       />
    //                       <Text
    //                         my='auto'
    //                         padding={'8px'}
    //                         fontSize='16px'
    //                         fontWeight={'bold'}
    //                         textOverflow='ellipsis'
    //                       >
    //                         {authSelector.username}
    //                       </Text>
    //                     </Box>

    //                     <Box fontSize={'14px'} p='10px 0'>
    //                       <Link to={'/admin'}>
    //                         <Box
    //                           display={
    //                             authSelector.is_admin === true ? 'flex' : 'none'
    //                           }
    //                           _hover={{
    //                             bgColor: 'var(--N50,#F3F4F5)',
    //                             borderRadius: '7px',
    //                             color: heroColor,
    //                           }}
    //                           p={'5px 4px'}
    //                           b='0'
    //                         >
    //                           <Text>Admin</Text>
    //                           <Box my='auto' ml='1'>
    //                             <RiAdminLine />
    //                           </Box>
    //                         </Box>
    //                       </Link>
    //                       <Link to={'/wishlist'}>
    //                         <Box
    //                           display={'flex'}
    //                           _hover={{
    //                             bgColor: 'var(--N50,#F3F4F5)',
    //                             borderRadius: '7px',
    //                             color: heroColor,
    //                           }}
    //                           p={'5px 4px'}
    //                           b='0'
    //                         >
    //                           <Text>Wishlist</Text>
    //                           <Box my='auto' ml='1'>
    //                             <BiHeart />
    //                           </Box>
    //                         </Box>
    //                       </Link>
    //                       <Box
    //                         display={'flex'}
    //                         _hover={{
    //                           bgColor: 'var(--N50,#F3F4F5)',
    //                           borderRadius: '7px',
    //                           color: heroColor,
    //                         }}
    //                         p={'5px 4px'}
    //                         b='0'
    //                         onClick={logoutBtnHandler}
    //                       >
    //                         <Text>Logout</Text>
    //                         <Box my='auto' ml='1'>
    //                           <BiLogOutCircle />
    //                         </Box>
    //                       </Box>
    //                     </Box>
    //                   </Box>
    //                 </PopoverBody>
    //               </PopoverContent>
    //             </Popover>
    //           </Box>
    //         ) : (
    //           // Before login
    //           <Box gap='2' display={'flex'} pl={'15px'} mr={'0px'}>
    //             <Link to={'/login'}>
    //               <Box width={'73px'}>
    //                 <Button
    //                   _hover={false}
    //                   _active={false}
    //                   height='32px'
    //                   border={`1px solid ${heroColor}`}
    //                   bgColor={'white'}
    //                   color={heroColor}
    //                   fontSize='12px'
    //                   fontWeight={'bold'}
    //                   borderRadius={'8px'}
    //                 >
    //                   Masuk
    //                 </Button>
    //               </Box>
    //             </Link>
    //             <Link to='/register'>
    //               <Box width={'72px'}>
    //                 <Button
    //                   _hover={false}
    //                   _active={false}
    //                   height='32px'
    //                   borderRadius={'8px'}
    //                   bgColor={heroColor}
    //                   border={`1px solid ${heroColor}`}
    //                   color={'#fff'}
    //                   fontWeight={'bold'}
    //                   fontSize='12px'
    //                   textAlign='center'
    //                   mx={'auto'}
    //                   w={'65px'}
    //                 >
    //                   Daftar
    //                 </Button>
    //               </Box>
    //             </Link>
    //           </Box>
    //         )}
    //       </Box>
    //     </HStack>
    //   </Box>
    // </Box>

    <Grid templateColumns={"repeat(3,1fr)"} h='80px'
      bgColor={'#222222'}
      fontFamily={'Barlow'}
      fontStyle={'italic'}
      w='100%'
      position={'fixed'}
      left='0'
      right={'0'}
      top='0'
      zIndex={'99999'}
    >
      <GridItem display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <Image src={logo} h='80px' onClick={() => navigate('/')} />
      </GridItem>
      {/* {isSearch ?
        <GridItem display={'flex'} justifyContent={'center'} alignItems={'center'} gap='4'>
          <Button
            h='38px'
            cursor={'pointer'}
            p='10px 30px'
            _hover={'false'}
            borderRadius={'9px'}
            _active={false}
            border={'1px solid var(--Brand-kuning, #F3C03D);'} bgColor={'transparent'} color={'white'}>
            BERANDA
          </Button>
          <Button
            h='38px'
            cursor={'pointer'}
            p='10px 30px'
            _hover={'false'}
            borderRadius={'9px'}
            _active={false}
            bgColor={'var(--Brand-Krem, #E4BF8F);'}>
            <Box mr={'2'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.22 0.21934C10.3606 0.0788894 10.5512 0 10.75 0C10.9488 0 11.1394 0.0788894 11.28 0.21934L17.28 6.21934C17.4205 6.35997 17.4993 6.55059 17.4993 6.74934C17.4993 6.94809 17.4205 7.13871 17.28 7.27934L11.28 13.2793C11.2113 13.353 11.1285 13.4121 11.0365 13.4531C10.9445 13.4941 10.8452 13.5162 10.7445 13.5179C10.6438 13.5197 10.5438 13.5012 10.4504 13.4635C10.357 13.4257 10.2722 13.3696 10.201 13.2984C10.1297 13.2272 10.0736 13.1423 10.0359 13.0489C9.99816 12.9555 9.97963 12.8555 9.98141 12.7548C9.98318 12.6541 10.0052 12.5548 10.0462 12.4628C10.0872 12.3708 10.1463 12.288 10.22 12.2193L14.94 7.49934H0.75C0.551088 7.49934 0.360322 7.42032 0.21967 7.27967C0.0790175 7.13902 0 6.94825 0 6.74934C0 6.55043 0.0790175 6.35966 0.21967 6.21901C0.360322 6.07836 0.551088 5.99934 0.75 5.99934H14.94L10.22 1.27934C10.0795 1.13871 10.0007 0.948091 10.0007 0.74934C10.0007 0.550589 10.0795 0.359965 10.22 0.21934Z" fill="black" />
              </svg>
            </Box>
            BIKES
          </Button>
          <Button
            h='38px'
            cursor={'pointer'}
            p='10px 30px'
            _hover={'false'}
            borderRadius={'9px'}
            _active={false}
            bgColor={'var(--Brand-Krem, #E4BF8F);'}>
            <Box mr={'2'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.22 0.21934C10.3606 0.0788894 10.5512 0 10.75 0C10.9488 0 11.1394 0.0788894 11.28 0.21934L17.28 6.21934C17.4205 6.35997 17.4993 6.55059 17.4993 6.74934C17.4993 6.94809 17.4205 7.13871 17.28 7.27934L11.28 13.2793C11.2113 13.353 11.1285 13.4121 11.0365 13.4531C10.9445 13.4941 10.8452 13.5162 10.7445 13.5179C10.6438 13.5197 10.5438 13.5012 10.4504 13.4635C10.357 13.4257 10.2722 13.3696 10.201 13.2984C10.1297 13.2272 10.0736 13.1423 10.0359 13.0489C9.99816 12.9555 9.97963 12.8555 9.98141 12.7548C9.98318 12.6541 10.0052 12.5548 10.0462 12.4628C10.0872 12.3708 10.1463 12.288 10.22 12.2193L14.94 7.49934H0.75C0.551088 7.49934 0.360322 7.42032 0.21967 7.27967C0.0790175 7.13902 0 6.94825 0 6.74934C0 6.55043 0.0790175 6.35966 0.21967 6.21901C0.360322 6.07836 0.551088 5.99934 0.75 5.99934H14.94L10.22 1.27934C10.0795 1.13871 10.0007 0.948091 10.0007 0.74934C10.0007 0.550589 10.0795 0.359965 10.22 0.21934Z" fill="black" />
              </svg>
            </Box>
            SUPPORT
          </Button>
        </GridItem> : */}
      {location.pathname === "/checkout" ? null :
        <>
          <GridItem display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <form >
              <FormControl>
                <InputGroup gap='4'>
                  <Input
                    height={'45px'}
                    bgColor={'#B7B7B7'}
                    borderRadius={'50px'} placeholder='Search in King Bike'
                    w={'auto'}
                    border={'0px'}
                    type={'text'}
                    _placeholder={{
                      fontSize: '14px',
                    }}
                    name='search'
                    pb={'0'}
                    onChange={changeBtnHandler}
                    onKeyDown={keyDownBtnHandler}
                    value={searchValue}
                    // value={formikSearch.values.search}
                    _hover={false}
                  />
                  <Box w='45px' h='45px' type='submit' cursor='pointer' bgColor={'#B7B7B7'} borderRadius={'50%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30" fill="none">
                      <path d="M27.1875 25.8619L20.1075 18.7819C21.8088 16.7394 22.6572 14.1195 22.4762 11.4674C22.2952 8.81529 21.0986 6.33505 19.1355 4.54267C17.1724 2.75029 14.5938 1.78376 11.9362 1.84414C9.27856 1.90453 6.74654 2.98718 4.86684 4.86688C2.98714 6.74658 1.90448 9.2786 1.8441 11.9362C1.78371 14.5938 2.75024 17.1724 4.54263 19.1355C6.33501 21.0987 8.81524 22.2952 11.4674 22.4762C14.1195 22.6573 16.7393 21.8089 18.7818 20.1075L25.8618 27.1875L27.1875 25.8619ZM3.74996 12.1875C3.74996 10.5187 4.24481 8.88742 5.17193 7.49988C6.09906 6.11234 7.41681 5.03088 8.95856 4.39227C10.5003 3.75365 12.1968 3.58656 13.8335 3.91213C15.4702 4.23769 16.9737 5.04128 18.1537 6.22129C19.3337 7.40129 20.1373 8.90471 20.4628 10.5414C20.7884 12.1781 20.6213 13.8746 19.9827 15.4164C19.3441 16.9581 18.2626 18.2759 16.8751 19.203C15.4875 20.1302 13.8562 20.625 12.1875 20.625C9.95045 20.6225 7.80578 19.7328 6.22398 18.151C4.64218 16.5692 3.75244 14.4245 3.74996 12.1875Z" fill="black" />
                    </svg>
                  </Box>
                </InputGroup>
              </FormControl>
            </form>
          </GridItem>
          {/* } */}
          <GridItem display={'flex'} justifyContent={'center'} alignItems={'center'} gap='4'>
            {authSelector.username ?
              <>
                <Link to={'/wishlist'}>
                  <Box w='45px' h='45px' cursor='pointer' bgColor={'#D9D9D9'} borderRadius={'50%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30" fill="none">
                      <path d="M15 27.025C14.8159 27.0244 14.6371 26.9629 14.4917 26.85C9.85835 23.25 6.66668 20.15 4.43335 17.0917C1.58334 13.1833 0.933345 9.57499 2.50001 6.36666C3.61668 4.07499 6.82501 2.19999 10.575 3.29166C12.363 3.80811 13.9229 4.91565 15 6.43333C16.0771 4.91565 17.6371 3.80811 19.425 3.29166C23.1667 2.21666 26.3833 4.07499 27.5 6.36666C29.0667 9.57499 28.4167 13.1833 25.5667 17.0917C23.3333 20.15 20.1417 23.25 15.5083 26.85C15.3629 26.9629 15.1841 27.0244 15 27.025ZM8.44168 4.64999C7.54939 4.61526 6.66449 4.8242 5.88197 5.25437C5.09944 5.68453 4.44885 6.31969 4.00001 7.09166C2.70834 9.74166 3.29168 12.6917 5.78334 16.1C8.43132 19.5155 11.532 22.5545 15 25.1333C18.4674 22.5571 21.5681 19.5209 24.2167 16.1083C26.7167 12.6917 27.2917 9.74166 26 7.09999C25.1667 5.43333 22.6667 4.10833 19.8833 4.89166C18.9909 5.15541 18.1635 5.60309 17.4545 6.20589C16.7455 6.80869 16.1706 7.55325 15.7667 8.39166C15.7039 8.5445 15.5971 8.67523 15.4598 8.76723C15.3226 8.85923 15.1611 8.90835 14.9958 8.90835C14.8306 8.90835 14.6691 8.85923 14.5319 8.76723C14.3946 8.67523 14.2878 8.5445 14.225 8.39166C13.8242 7.55115 13.2502 6.80485 12.5408 6.20168C11.8313 5.5985 11.0024 5.15207 10.1083 4.89166C9.56666 4.73433 9.00574 4.65299 8.44168 4.64999Z" fill="black" />
                    </svg>
                  </Box>
                  {wishlistSelector.totalWishlist > 0 ? (
                    <Box
                      ml='30px'
                      top='2'
                      mt='10px'
                      // display={'inline'}
                      position={'absolute'}
                    >
                      <Box
                        display={'flex'}
                        color={'white'}
                        bgColor={'red'}
                        borderRadius={'50%'}
                        fontSize={'10px'}
                        p='8px'
                        fontWeight={'800'}
                        w={wishlistSelector.totalWishlist > 9 ? 'auto' : '12px'}
                        h='12px'
                        alignItems={'center'}
                        justifyContent={'center'}
                      >
                        {wishlistSelector.totalWishlist}
                      </Box>
                    </Box>
                  ) : null}
                </Link>
                <Link to={'/cart'}>
                  <Box w='45px' h='45px' cursor='pointer' bgColor={'#D9D9D9'} borderRadius={'50%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30" fill="none">
                      <path d="M0 2.8125C0 2.56386 0.0987721 2.3254 0.274587 2.14959C0.450403 1.97377 0.68886 1.875 0.9375 1.875H3.75C3.95912 1.87506 4.16222 1.94503 4.327 2.0738C4.49177 2.20256 4.60877 2.38272 4.65937 2.58562L5.41875 5.625H27.1875C27.3252 5.62513 27.4611 5.65557 27.5857 5.71416C27.7102 5.77275 27.8204 5.85805 27.9082 5.96401C27.9961 6.06996 28.0596 6.19397 28.0941 6.32722C28.1287 6.46047 28.1335 6.59969 28.1081 6.735L25.2956 21.735C25.2554 21.9498 25.1414 22.1439 24.9733 22.2836C24.8052 22.4232 24.5936 22.4998 24.375 22.5H7.5C7.28144 22.4998 7.06981 22.4232 6.90171 22.2836C6.7336 22.1439 6.61959 21.9498 6.57938 21.735L3.76875 6.76313L3.01875 3.75H0.9375C0.68886 3.75 0.450403 3.65123 0.274587 3.47541C0.0987721 3.2996 0 3.06114 0 2.8125ZM5.81625 7.5L8.27812 20.625H23.5969L26.0588 7.5H5.81625ZM9.375 22.5C8.38044 22.5 7.42661 22.8951 6.72335 23.5984C6.02009 24.3016 5.625 25.2554 5.625 26.25C5.625 27.2446 6.02009 28.1984 6.72335 28.9016C7.42661 29.6049 8.38044 30 9.375 30C10.3696 30 11.3234 29.6049 12.0267 28.9016C12.7299 28.1984 13.125 27.2446 13.125 26.25C13.125 25.2554 12.7299 24.3016 12.0267 23.5984C11.3234 22.8951 10.3696 22.5 9.375 22.5ZM22.5 22.5C21.5054 22.5 20.5516 22.8951 19.8484 23.5984C19.1451 24.3016 18.75 25.2554 18.75 26.25C18.75 27.2446 19.1451 28.1984 19.8484 28.9016C20.5516 29.6049 21.5054 30 22.5 30C23.4946 30 24.4484 29.6049 25.1516 28.9016C25.8549 28.1984 26.25 27.2446 26.25 26.25C26.25 25.2554 25.8549 24.3016 25.1516 23.5984C24.4484 22.8951 23.4946 22.5 22.5 22.5ZM9.375 24.375C9.87228 24.375 10.3492 24.5725 10.7008 24.9242C11.0525 25.2758 11.25 25.7527 11.25 26.25C11.25 26.7473 11.0525 27.2242 10.7008 27.5758C10.3492 27.9275 9.87228 28.125 9.375 28.125C8.87772 28.125 8.40081 27.9275 8.04918 27.5758C7.69754 27.2242 7.5 26.7473 7.5 26.25C7.5 25.7527 7.69754 25.2758 8.04918 24.9242C8.40081 24.5725 8.87772 24.375 9.375 24.375ZM22.5 24.375C22.9973 24.375 23.4742 24.5725 23.8258 24.9242C24.1775 25.2758 24.375 25.7527 24.375 26.25C24.375 26.7473 24.1775 27.2242 23.8258 27.5758C23.4742 27.9275 22.9973 28.125 22.5 28.125C22.0027 28.125 21.5258 27.9275 21.1742 27.5758C20.8225 27.2242 20.625 26.7473 20.625 26.25C20.625 25.7527 20.8225 25.2758 21.1742 24.9242C21.5258 24.5725 22.0027 24.375 22.5 24.375Z" fill="black" />
                    </svg>
                  </Box>
                  {cartSelector.totalCart > 0 ? (
                    <Box
                      ml='30px'
                      top='2'
                      mt='10px'
                      // display={'inline'}
                      position={'absolute'}
                    >
                      <Box
                        display={'flex'}
                        color={'white'}
                        bgColor={'red'}
                        borderRadius={'50%'}
                        fontSize={'10px'}
                        p='8px'
                        fontWeight={'800'}
                        w={cartSelector.totalCart > 9 ? 'auto' : '12px'}
                        h='12px'
                        alignItems={'center'}
                        justifyContent={'center'}
                      >
                        {cartSelector.totalCart}
                      </Box>
                    </Box>
                  ) : null}
                </Link>
                <Popover trigger={'hover'}>
                  <PopoverTrigger>
                    <Avatar name={authSelector.username} w='45px' h='45px' cursor='pointer' />
                  </PopoverTrigger>
                  <PopoverContent mr='4' mt='4' bgColor={'#222'}>
                    <PopoverBody>
                      <Grid
                        boxShadow={'rgba(0, 0, 0, 0.24) 0px 3px 8px'}
                        my='auto'
                        borderRadius={'5px'}
                        bgColor={'white'}
                        cursor={'pointer'}
                        templateColumns={"repeat(2,1fr)"}
                      >
                        <GridItem my='auto'>
                          <Text
                            padding={'8px'}
                            fontSize='16px'
                            fontWeight={'bold'}
                            textOverflow='ellipsis'
                            textAlign={'center'}
                          >
                            {authSelector.username}
                          </Text>
                        </GridItem>
                        <GridItem fontSize={'14px'} >
                          <Grid templateRows={"repeat(2,1fr)"} h='100%'>
                            <GridItem display={
                              authSelector.is_admin === true ? 'block' : 'none'
                            }>
                              <Link to={'/admin'}>
                                <Box

                                  _hover={{
                                    bgColor: 'var(--N50,#F3F4F5)',
                                    color: heroColor,
                                    borderTopEndRadius: '5px'
                                  }}
                                  p='6px 10px'
                                  b='0'
                                >
                                  <Box display={'flex'}
                                    justifyContent="center"
                                    alignItems="center" >
                                    <Text>Admin</Text>
                                    <Box my='auto' ml='1'>
                                      <RiAdminLine />
                                    </Box>
                                  </Box>
                                </Box>
                              </Link>
                            </GridItem>
                            <GridItem>
                              <Box
                                _hover={{
                                  bgColor: 'var(--N50,#F3F4F5)',
                                  color: heroColor,
                                  borderBottomEndRadius: '5px'
                                }}
                                b='0'
                                onClick={logoutBtnHandler}
                                p='6px 10px'
                              >
                                <Box display={'flex'}
                                  justifyContent="center"
                                  alignItems="center" >
                                  <Text>Logout</Text>
                                  <Box my='auto' ml='1'>
                                    <BiLogOutCircle />
                                  </Box>
                                </Box>
                              </Box>
                            </GridItem>
                          </Grid>
                        </GridItem>
                      </Grid>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </>
              :
              <Button h='48px'
                p='10px 30px'
                _hover={'false'}
                borderRadius={'9px'}
                _active={false}
                onClick={() => navigate('/login')}
                border={'1px solid var(--Brand-kuning, #F3C03D);'} bgColor={'transparent'} color={'white'}>
                MASUK
              </Button>
            }
          </GridItem >
        </>
      }
    </Grid >

  );
};

export default Navbar;
