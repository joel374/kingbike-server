import { Box, Button, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { heroColor } from "./reuseable/Logo";

const CardWishlist = ({
  image_url,
  product_name,
  price,
  id,
  deleteHandler,
}) => {
  return (
    // <Link to={`/${product_name.replace(/\s+/g, "-").toLowerCase()}/${id}`}>
    <Box p="0px 8px 16px">
      <Box
        w="175.5px"
        boxShadow={"rgb(0 0 0 / 12%) 0px 1px 6px 0px"}
        borderRadius="9px"
      > <Link to={`/product/${product_name.replace(/\s+/g, "-").toLowerCase()}/${id}`}>
          <Image
            src={`${process.env.REACT_APP_API_IMAGE_URL}${image_url}`}
            h="175.55px"
            objectFit={"cover"}
            objectPosition={"center center"}
            borderTopRadius="9px"
          />
          <Box p="8px">
            <Box mb="4px" fontSize={"12.04px"}>
              <Text textOverflow="ellipsis" overflow={"hidden"} h="36.1px">
                {product_name}
              </Text>
            </Box>
            <Box mb="4px" fontSize={"14px"} fontWeight="bold">
              Rp{price?.toLocaleString("id-ID")}
            </Box>
          </Box>
          <Box p="0 8px 8px">
            <Button
              borderRadius="8px"
              border={`1px solid ${heroColor}`}
              bgColor="white"
              mb="2px"
              w="100%"
              h="32px"
              fontSize={"11.9px"}
              color={heroColor}
              _hover={false}
              _active={false}
              onClick={deleteHandler}
            >
              <Text>Hapus</Text>
            </Button>
          </Box>
        </Link>
      </Box>
    </Box>
    // </Link>
  );
};

export default CardWishlist;
