import React, { useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import { history } from "../../App";
import { useState } from "react";
import { useFormik } from "formik";
import { ConfigActivityAction } from "../../redux/actions/ConfigActivityAction";
import { useDispatch, useSelector } from "react-redux";
import {
  GetActivityLoginAction,
  GetListActivityAction,
} from "../../redux/actions/ActivityAction";
import {
  LoginModeratorAction,
  LoginUserAction,
  LoginUserMobileAction,
} from "../../redux/actions/LoginAction";
import { GetListFanpageAction } from "../../redux/actions/FanpageAction";
import Swal from "sweetalert2";
import Slider from "react-slick";

export default function LoginMobile(props) {
  localStorage.setItem("title", "");
  const dispatch = useDispatch();
  const { msg, msgModerator } = useSelector((root) => root.LoginReducer);
  const { arrActivityLogin } = useSelector((root) => root.ActivityReducer);
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    const action = GetListActivityAction();
    dispatch(action);
    const action1 = GetListFanpageAction();
    dispatch(action1);

    const action2 = GetActivityLoginAction();
    dispatch(action2);
    const stringToCompare = "host";

    // Get the current URL
    const currentUrl = window.location.href;

    // Check if the current URL contains the given string
    const match = currentUrl.includes(stringToCompare);

    // Set the state based on the result
    setIsMatch(match);
    // if (match) {
    //     Swal.fire({
    //         title: 'Good job!',
    //         text: 'You matched the string!',
    //         icon: 'success',
    //     }).then((result) => {
    //         props.history.push('/home')

    //         // Reset isMatch to false
    //         setIsMatch(false);
    //     });
    // }
  }, []);


  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (value) => {

      if (value.username === "admin" && value.password === "1234") {
        const action1 = {
          type: "LOGOUT_ADMIN",
          admin: localStorage.setItem("admin", "admin"),
        };
        await dispatch(action1);
        props.history.push("/achivement");
      } else {
        const action = LoginModeratorAction(value, props);
        dispatch(action);
      }
    },
  });
  const signInWithGoogle = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const email = {
          email: result.user?.email,
        };


        localStorage.setItem("username", result.user?.displayName);
        localStorage.setItem("emailuser", result.user?.email);
        const action1 = LoginUserMobileAction(email, props);
        dispatch(action1);

      })
      .catch((error) => {
        console.log(error);
      });
  };
  const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return <div className="custom-arrow prev-arrow" onClick={onClick} />;
  };

  const CustomNextArrow = (props) => {
    const { onClick } = props;
    return <div className="custom-arrow next-arrow" onClick={onClick} />;
  };
  const [currentSlide, setCurrentSlide] = useState(0);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    beforeChange: (current, next) => {
      setCurrentSlide(next);
    },
  };

  return (
    <div className="theme-layout">
      <div className="auth-login">
        <ul
          className="welcome-caro"
          style={{ zIndex: "99!important", opacity: 1, marginTop: "50px"  ,marginLeft:'-30px'}}
        >
          <Slider {...settings}>
            {arrActivityLogin.map((slide, index) => (
              <div
                key={index}
                className="welcome-box"
                style={{ zIndex: "999!important", opacity: 1 }}
              >
                <img
                  src={slide.media[0]?.linkMedia}
                  style={{
                    width: 600,
                    height: 200,
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                  alt={`Slide ${index + 1}`}
                />
                <h4 className="text-center pb-3 " style={{ color: "black" }}>
                  {slide.title.slice(0, 200) + "..."}
                </h4>
                {/* <p className='text-center' style={{ color: 'black' }}>{(slide.description).slice(0, 200) + '...'}</p> */}
              </div>
            ))}
          </Slider>
        </ul>
        <div className="logo">
          <img src="images/logo.png" alt />
          <span>SVCW</span>
        </div>
        <div className="mockup left-bottom">
          <img src="images/mockup.png" alt />
        </div>
        <div className="verticle-center" style={{marginTop:'10px'}}>
          <div
            className="login-form"
            style={{ display: "block", width: "100%!important" }}
          >
            {/* <h4>
              <i className="icofont-key-hole" /> Đăng nhập
            </h4> */}
            <p
              className="google-icon-p-1"
              onClick={signInWithGoogle}
              style={{ width: "100%important", padding: "3px 10px!important" }}
            >
              <i class="fa-brands fa-google google-icon-g" />
              Đăng nhập với Google
            </p>
          </div>
        </div>
        <div className="authtication bluesh high-opacity">
          <div
            className="bg-image"
            style={{ backgroundImage: "url(images/avatar/20.jpg)" }}
          />
        </div>
        <div className="mockup right">
          <img src="images/star-shape.png" alt />
        </div>
      </div>
    </div>
  );
}
