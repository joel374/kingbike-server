import { Box, Grid, Text, useToast, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import CardWishlist from "../components/CardWishlist";
import {
  deleteWishlist,
  fetchBrandCategory,
  fetchCategory,
  fetchWishlist,
} from "../components/reuseable/fetch";
import { heroColor } from "../components/reuseable/Logo";
import { doubleOnclick } from "./admin/ManageProduct";
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { setTotalWishlist } from '../redux/features/wishlistSlice';


export const tripleOnclick = (a, b, c) => { };

const Wishlist = () => {
  const [seeMore, setSeeMore] = useState(false);
  const [seeMore2, setSeeMore2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistSelector = useSelector((state) => state.wishlist);


  const toast = useToast();

  const seeMoreBtnHandler = () => {
    seeMore ? setSeeMore(false) : setSeeMore(true);
  };

  const seeMoreBtnHandler2 = () => {
    seeMore2 ? setSeeMore2(false) : setSeeMore2(true);
  };

  useEffect(() => {
    fetchBrandCategory().then((res) => setBrand(res));
    fetchCategory().then((res) => setCategory(res));
    fetchWishlist().then((res) =>
      doubleOnclick(setWishlist(res), setIsLoading(true))
    );
  }, []);
  return (
    <Box
      mt="60px"
      pt='40px'
      alignItems={'center'}
      h={!wishlist.length ? '' : '100vh'}>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Wishlist | OusamaBike</title>
      </Helmet>
      {wishlist.length ?
        <>
          <Box fontSize={"24px"} fontWeight="bold">
            Wishlist
          </Box>
          <Box display={"flex"}>
            <Box w="214px" fontSize={"14px"} fontWeight="bold">
              <Text m="16px 0">Filter</Text>
              <Box
                boxShadow={"rgb(49 53 59 / 12%) 0px 1px 6px 0px"}
                borderRadius="12px"
              >
                <Box
                  p="10px 8px 9px 12px"
                  onClick={() => seeMoreBtnHandler()}
                  cursor="pointer"
                  display={"flex"}
                  justifyContent="space-between"
                  alignItems={"center"}
                >
                  Kategori
                  {seeMore ? (
                    <BiChevronUp fontSize={"24px"} />
                  ) : (
                    <BiChevronDown fontSize={"24px"} />
                  )}
                </Box>
                <Box display={seeMore ? "block" : "none"}>
                  {category?.map((val) => (
                    <Box
                      m="6px 0"
                      fontSize={"11.9px"}
                      fontWeight="normal"
                      display={"flex"}
                      alignItems="center"
                      ml="16px"
                      // onClick={() =>
                      //   fetchProduct("", "", val.id).then((res) =>
                      //     setProduct(res)
                      //   )
                      // }
                      cursor="pointer"
                    >
                      {val?.category_name}
                    </Box>
                  ))}
                </Box>
                <Box
                  p="10px 8px 9px 12px"
                  onClick={() => seeMoreBtnHandler2()}
                  cursor="pointer"
                  display={"flex"}
                  justifyContent="space-between"
                  alignItems={"center"}
                  borderTop="1px solid #edf2f7"
                >
                  Merek
                  {seeMore2 ? (
                    <BiChevronUp fontSize={"24px"} />
                  ) : (
                    <BiChevronDown fontSize={"24px"} />
                  )}
                </Box>
                <Box display={seeMore2 ? "block" : "none"} pb="9px">
                  {brand?.map((val) => (
                    <Box
                      m="6px 0"
                      fontSize={"11.9px"}
                      fontWeight="normal"
                      display={"flex"}
                      alignItems="center"
                      ml="16px"
                      // onClick={() =>
                      //   fetchProduct("", "", val.id).then((res) =>
                      //     setProduct(res)
                      //   )
                      // }
                      cursor="pointer"
                    >
                      {val?.brand_name}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box p="0px 4px 0px 30px">
              <Box mb="16px" />
              {/* Card */}
              <Grid templateColumns={"repeat(5,1fr)"}>
                {wishlist && isLoading
                  ? Array.from(wishlist).map((val) => (
                    <CardWishlist
                      image_url={val.Product.Image_Urls[0]?.image_url}
                      price={val.Product.price}
                      product_name={val.Product.product_name}
                      id={val.Product.id}
                      key={val.id}
                      deleteHandler={() =>
                        doubleOnclick(
                          deleteWishlist(val.ProductId).then((res) => {
                            dispatch(setTotalWishlist(wishlistSelector.totalWishlist - 1))
                            tripleOnclick(
                              res.error
                                ? toast({
                                  title: "Produk gagal dihapus dari wishlist",
                                  description: res,
                                  status: "error",
                                  variant: "top-accent",
                                })
                                : toast({
                                  title: "Produk dihapus dari wishlist",
                                  description: res,
                                  status: "success",
                                  variant: "top-accent",
                                }),
                              setIsLoading(false),
                              fetchWishlist().then((res) =>
                                doubleOnclick(
                                  setWishlist(res),
                                  setIsLoading(true)
                                )
                              )
                            )}
                          )
                        )
                      }
                    />
                  ))
                  : "Loading Broo"}
              </Grid>
            </Box>
          </Box>
        </>
        :
        <Box
          h='272px'
          display='flex'
          justifyContent={'center'}
          width='100%'
          alignItems={'center'}
          fontSize='20px'
          fontWeight={'bold'}
        >
          <Box>
            <Text textAlign={'center'}>Wah, wishlistmu kosong</Text>
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
      }
    </Box>
  );
};

export default Wishlist;
