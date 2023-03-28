import React from "react";
import styled from "styled-components";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaWallet } from "react-icons/fa";
import { IoMdLock } from "react-icons/io";
import axios from "axios";
import { useAppSelector } from "../../../Global/Store";
import { MdCancel } from "react-icons/md";
import * as yup from "yup";
import Swal from "sweetalert2";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const DetailCard = () => {
  const [pay, setPay] = React.useState(false);
  const [singleData, setSingleData] = React.useState<any>();
  const business: any = useAppSelector((state) => state.bizClient);
  const user: any = useAppSelector((state) => state.userData);

  const { id } = useParams();
  const URl = "https://giftcard-api.onrender.com";

  const getDetails = async () => {
    await axios
      .get(`${URl}/api/getonegiftcard/${id}`)
      .then((res) => {
        setSingleData(res.data.data);
        // console.log("detail:", singleData._id);
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const payIn = async ({
    name,
    number,
    cvv,
    expiry_month,
    expiry_year,
    pin,
    amount,
  }: any) => {
    // e.preventDefault();
    await axios
      .post(`${URl}/api/buyagiftcard/${user?._id}/${business?._id}/${id}`, {
        number,
        cvv,
        name,
        expiry_month,
        expiry_year,
        pin,
        amount,
      })
      .then((res) => {
        console.log("pay", business);
      })
      .catch((error) => {
        console.log("pay", business);
      });
  };

  const userSchema = yup
    .object({
      name: yup.string().required("please enter an name"),
      number: yup.string().required("please enter a number"),
      cvv: yup.string().required("please enter a cvv"),
      expiry_month: yup.string().required("please enter an expiry month"),
      expiry_year: yup.string().required("please enter an expiry year"),
      pin: yup.string().required("please enter a pin"),
      amount: yup.number().required("please enter an amount"),
    })
    .required();
  type formData = yup.InferType<typeof userSchema>;

  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm<formData>({
    resolver: yupResolver(userSchema),
  });

  const posting = useMutation({
    mutationKey: ["payNow"],
    mutationFn: payIn,

    onSuccess: (myData) => {
      // console.log("this is the user", myData);

      Swal.fire({
        title: "Payment succesful",
        timer: 1000,
        timerProgressBar: true,

        didOpen: () => {
          Swal.showLoading();
        },
      });
    },
    onError: (error: any) => {
      Swal.fire({
        title: "Payment failed",
        icon: "error",
      });
    },
  });

  const Submit = handleSubmit(async (data) => {
    posting.mutate(data);
  });

  React.useEffect(() => {
    getDetails();
  }, []);

  return (
    <>
      <Container dis={pay ? "none" : "block"}>
        <div style={{ marginTop: "40px" }}>
          <Name>
            <img src={singleData?.BrandLogo} />
          </Name>
          <Inputs>
            This gift card is made for {singleData?.name} products only
          </Inputs>
          <Valuation>
            <div
              style={{
                fontSize: "13px",
                color: "#9e9d9df8",
                fontWeight: 600,
              }}>
              Cash Value
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                fontSize: "40px",
                fontWeight: 600,
                color: "#1f34ee7d",
              }}>
              ${singleData?.moneyWorth}
            </div>
          </Valuation>
          <Inputs2
            onClick={() => {
              setPay(true);
            }}>
            {" "}
            Purchase this card
          </Inputs2>
        </div>
      </Container>
      {pay ? (
        <div>
          <ContainerPay>
            <WrapAllPay>
              <TopPay>
                <div>
                  <IoMdLock />
                </div>
                <div>Secured by Korapay</div>
              </TopPay>
              <CardContainerPay>
                <CancelPay
                  onClick={() => {
                    setPay(false);
                  }}>
                  <MdCancel />
                </CancelPay>
                <UpPay>TEST MODE</UpPay>
                <MainCardPay>
                  <WrapperPay>
                    <TitlesPay>
                      <IconPay>
                        <FaWallet />
                      </IconPay>
                      <TitleTextPay>
                        Pay NGN {singleData?.moneyWorth}{" "}
                      </TitleTextPay>
                    </TitlesPay>
                    <SubTitlesPay>
                      Enter your card information to complete this payment
                    </SubTitlesPay>
                    <form onSubmit={Submit}>
                      <WrapInputsPay>
                        <FirstLinePay>
                          <LabelPay>Card name</LabelPay>
                          <InputPay {...register("name")} />
                          <LabelPay>Card number</LabelPay>
                          <InputPay {...register("number")} />
                          <LabelPay>cvv</LabelPay>
                          <InputPay {...register("cvv")} />
                          <LabelPay>Pin</LabelPay>
                          <InputPay {...register("pin")} />
                          <LabelPay>amount</LabelPay>
                          <InputPay {...register("amount")} />
                        </FirstLinePay>
                        <SecondLinePay>
                          <LeftPay>
                            <LabelPay>Expiry Month</LabelPay>
                            <Input1Pay {...register("expiry_month")} />
                          </LeftPay>
                          <RightPay>
                            <LabelPay>Expiry Year</LabelPay>
                            <Input2Pay {...register("expiry_year")} />
                          </RightPay>
                        </SecondLinePay>
                      </WrapInputsPay>
                      <WrapButtonPay type="submit">
                        <div style={{ fontSize: "17px" }}>
                          <IoMdLock />
                        </div>
                        <div>Pay NGN {singleData?.moneyWorth} </div>
                      </WrapButtonPay>
                    </form>
                  </WrapperPay>
                </MainCardPay>
              </CardContainerPay>
              <BottomPay></BottomPay>
            </WrapAllPay>
          </ContainerPay>
        </div>
      ) : null}
    </>
  );
};

export default DetailCard;

const HoldPay = styled.div<{ dis: string }>`
  display: ${(props) => props.dis};
`;

const Container = styled.div<{ dis: string }>`
  width: 70%;
  padding-left: 40px;
  display: ${(props) => props.dis};
  div {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
`;
const Name = styled.div`
  border: 1px solid grey;
  border-radius: 50%;
  padding: 5px;
  height: 80px;
  width: 80px;
  overflow: hidden;
  img {
    height: 100%;
    width: 100%;
    margin: auto;
    object-fit: cover;
  }
`;
const Inputs = styled.div`
  border: none;
  outline: none;
  width: calc(100% - 20px);
  padding-left: 20px;
  height: 50px;
  border-radius: 10px;
  font-size: 16px;
  background-color: #ececec92;
  display: flex;
  /* align-items: center; */
  justify-content: center;
`;
const Inputs2 = styled.button`
  border: none;
  outline: none;
  width: 100%;
  height: 50px;
  border-radius: 10px;
  font-size: 16px;
  background-color: blueviolet;
  color: whitesmoke;
  font-weight: 600;
`;
const Valuation = styled.div`
  height: 200px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ContainerPay = styled.div`
  width: 100vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f4fd;
  position: absolute;
  left: 0;
`;
const CancelPay = styled.div`
  position: absolute;
  right: -24px;
  top: -24px;
  color: lightgray;
  font-size: 30px;
`;
const TopPay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
  font-size: 12px;
`;
const BottomPay = styled.div``;
const WrapAllPay = styled.div``;
const UpPay = styled.div`
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5%;
`;
const CardContainerPay = styled.div`
  width: 330px;
  border-radius: 10px;
  background-color: #e76b18;
  color: white;
  font-size: 10px;
  padding-top: 4px;
  letter-spacing: 2px;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
    rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
`;
const MainCardPay = styled.div`
  width: 100%;
  padding-bottom: 8px;
  padding-top: 8px;
  margin-top: 4px;
  border-radius: 10px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
`;
const WrapperPay = styled.div`
  width: 80%;
  margin: auto;
  letter-spacing: normal;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const TitlesPay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const IconPay = styled.div`
  color: silver;
  font-size: 27px;
`;
const TitleTextPay = styled.div`
  color: #1d1d1d;
  font-size: 15px;
`;
const SubTitlesPay = styled.div`
  font-size: 10px;
  margin-top: 20px;
  margin-bottom: 10px;
  color: #1d1d1d;
  text-align: center;
`;
const WrapButtonPay = styled.button`
  width: 105%;
  height: 40px;
  border-radius: 10px;
  margin-top: 12px;
  background-color: #4bcca1;
  font-size: 12px;
  font-weight: 600;
  color: white;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const FirstLinePay = styled.div``;
const SecondLinePay = styled.div`
  display: flex;
`;
const LabelPay = styled.label`
  color: lightgray;
  font-size: 12px;
  margin-bottom: 5px;
`;
const InputPay = styled.input`
  width: 97%;
  height: 30px;
  border-radius: 9px;
  border: 1px solid #969696c6;
  outline: none;
  margin-top: 2px;
  margin-bottom: 2px;
`;
const WrapInputsPay = styled.div`
  width: calc(100% - 13px);
  border-radius: 10px;
  padding: 13px;
  background-color: #e2ebff6a;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding-top: 20px;
  padding-bottom: 20px;
`;
const LeftPay = styled.div`
  width: 50%;
  height: 100%;
`;
const RightPay = styled.div`
  width: 50%;
  height: 100%;
`;
const Input1Pay = styled.input`
  width: 95%;
  height: 30px;
  border-top-left-radius: 9px;
  border-bottom-left-radius: 9px;
  border: 1px solid #969696c6;
  outline: none;
`;
const Input2Pay = styled.input`
  width: 95%;
  height: 30px;
  border-top-right-radius: 9px;
  border-bottom-right-radius: 9px;
  border: 1px solid #969696c6;
  outline: none;
`;
