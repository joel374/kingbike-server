import { Box, Grid, Text, GridItem, Button, Divider, Image, useToast } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import { axiosInstance } from '../api';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { heroColor } from '../components/reuseable/Logo';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLocationDot } from "react-icons/fa6";


const Checkout = () => {
  const location = useLocation();
  const props = location.state && location.state.parameter;
  const [cart, setCart] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [displayDelete, setDisplayDelete] = useState('none');
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantityChecked, setTotalQuantityCheked] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();
  return (
    <Box
      alignItems={'center'}
      mt='60px'
      h={'100vh'}
      boxSizing='border-box'
    >
      <Helmet>
        <meta charSet='utf-8' />
        <title>Pengiriman | OusamaBike</title>
      </Helmet>
      <Box fontSize='20px'
        fontWeight={'bold'} p='0 20px'
        pt='40px'
        maxWidth={"1200px"}
        margin={"auto"}
        mx={'auto'}>
        <Text mb='10px'>
          Pengiriman
        </Text>
        <Grid
          templateColumns={"3.8fr 1.7fr"}
          gap={'7'}
        >
          <GridItem>
            <Box
              boxShadow={'0 1px 6px 0 var(--color-shadow,rgba(49,53,59,0.12))'}
              p='24px'
              borderRadius={'8px'}
              fontSize='14px'
              display={'flex'}
              flexDirection={'column'}
              gap={'16px'}
              mb='16px'
            >
              <Text>ALAMAT PENGIRIMAN</Text>
              <Box>
                <Box display={'flex'} gap={'4px'}><Box mt='3px'><FaLocationDot color={heroColor} /></Box> <Text>
                  Jl. Raya Bumi No 0 : Rsell Siahahaha</Text> </Box>
                <Text fontWeight={'normal'}>Jl. Raya Bumi Indah Selatan, Langkat, Tangerang, Jawa Barat</Text>
              </Box>
            </Box>

            {/* Item list */}
            <Box
              boxShadow={'0 1px 6px 0 var(--color-shadow,rgba(49,53,59,0.12))'}
              p='24px'
              borderRadius={'8px'}
              fontSize='14px'
              mb='16px'
            >
              <Text mb='24px'>PESANAN</Text>
              <Box display={'flex'} flexDirection={'column'} gap={'24px'}>
              {props.map((v, i) => {
                console.log(v);
                return (
                  <Box display={'flex'} gap={'16px'}>
                    <Image border={'1px solid rgb(var(--NN50,240,243,247))'} borderRadius='8px' w='78px' h='78px' src={`${process.env.REACT_APP_API_IMAGE_URL}${v.Product?.Image_Urls?.[0]?.image_url}`} />
                    <Box>
                      <Box display={'flex'} justifyContent={'space-between'} gap={'8px'}>
                        <Text fontWeight={'normal'} display={'-webkit-flex'}>{v.Product?.product_name}</Text>
                        <Text>{v.quantity} x {v.Product.price}</Text>
                      </Box>
                    </Box>
                  </Box>)
              })}
              </Box>
            </Box>
          </GridItem>

          {/* Total Price */}
          <GridItem>
            <Box
              w={'350px'}
              boxShadow={
                '0 1px 6px 0 var(--color-shadow,rgba(49,53,59,0.12))'
              }
              p='16px'
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
              <Box display={'flex'} justifyContent={'space-between'}>
                <Text fontSize={'14px'} fontWeight={'light'}>
                  Total Ongkos Kirim
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
                onClick={() => navigate('/checkout')}
              >
                Beli
              </Button>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  )
}

export default Checkout;
