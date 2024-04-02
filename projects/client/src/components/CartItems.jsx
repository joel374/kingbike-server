import { Box, Checkbox, Image, Text } from "@chakra-ui/react";
import { BiMinusCircle, BiPlusCircle, BiTrash } from "react-icons/bi";
import { axiosInstance } from "../api";
import { heroColor } from "./reuseable/Logo";
import { useNavigate } from "react-router-dom";

const CartItems = ({
  product_name,
  price,
  image_url,
  quantity,
  onDelete,
  is_checked,
  id,
  ProductId,
  fetchCart,
}) => {
  const navigate = useNavigate();
  const checkBtnHandler = async (id) => {
    try {
      await axiosInstance.patch(`/cart/checkCart/${id}`);
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box fontSize={"14px"}>
      <Box p="16px 0">
        <Box display={"flex"}>
          <Checkbox
            _hover={{ borderColor: `${heroColor}` }}
            mr="14px"
            isChecked={is_checked}
            onChange={() => checkBtnHandler(id)}
          ></Checkbox>
          <Image
            onClick={() =>
              navigate(
                `/product/${product_name
                  .replace(/\s+/g, "-")
                  .toLowerCase()}/${ProductId}`
              )
            }
            cursor={'pointer'}
            h="69px"
            w="69px"
            objectFit={"cover"}
            src={`${process.env.REACT_APP_API_IMAGE_URL}${image_url}`}
          />
          <Box pl="12px">
            <Text
              cursor={'pointer'}
              fontWeight={"normal"}
              onClick={() =>
                navigate(
                  `/product/${product_name
                    .replace(/\s+/g, "-")
                    .toLowerCase()}/${ProductId}`
                )
              }
            >
              {product_name}
            </Text>
            <Text mt="8px">Rp. {price.toLocaleString("id-ID")}</Text>
          </Box>
        </Box>
        <Box mt="16px" display={"flex"} justifyContent={"end"}>
          <Box
            mr="52px"
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            w="24px"
            h="24px"
          >
            <BiTrash fontSize={"20px"} cursor={"pointer"} onClick={onDelete} />
          </Box>
          <Box display={"flex"} alignItems={"center"}>
            <BiMinusCircle fontSize={"20px"} />
            <Box
              w="55px"
              borderBottom={"1px solid black"}
              fontWeight={"normal"}
              textAlign={"center"}
            >
              {quantity}
            </Box>
            <BiPlusCircle fontSize={"20px"} />
          </Box>
        </Box>
      </Box>
      <Box h="5px" bgColor={"var(--N50,#F3F4F5)"} />
    </Box>
  );
};

export default CartItems;
