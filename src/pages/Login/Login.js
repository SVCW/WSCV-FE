import React, { useEffect } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../../firebase';
import { history } from '../../App';
import { useState } from 'react';
import { useFormik } from 'formik'
import { ConfigActivityAction } from '../../redux/actions/ConfigActivityAction';
import { useDispatch, useSelector } from 'react-redux';
import { GetActivityLoginAction, GetListActivityAction } from '../../redux/actions/ActivityAction';
import { LoginModeratorAction, LoginUserAction } from '../../redux/actions/LoginAction';
import { GetListFanpageAction } from '../../redux/actions/FanpageAction';
import Swal from 'sweetalert2';
import Slider from 'react-slick';

export default function Login (props) {
    localStorage.setItem('title', '')
    const dispatch = useDispatch()
    const { msg, msgModerator } = useSelector(root => root.LoginReducer)
    const { arrActivityLogin } = useSelector(root => root.ActivityReducer)

    const [isMatch, setIsMatch] = useState(false);

    useEffect(() => {
        const action9 = {
            type: "CHECK_MODERATOR",
            msgModerator: "",
          };
          dispatch(action9);
        const action = GetListActivityAction();
        dispatch(action)
        const action1 = GetListFanpageAction();
        dispatch(action1)

        const action2 = GetActivityLoginAction();
        dispatch(action2)
        const stringToCompare = 'host';

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
            username: '',
            password: ''
        },
        onSubmit: async (value) => {

            if (value.username === 'admin' && value.password === '1234') {


                const action1 = {
                    type: 'LOGOUT_ADMIN',
                    admin: localStorage.setItem('admin', 'admin')
                }
                await dispatch(action1)
                props.history.push('/adminstatistical')
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.addEventListener("mouseenter", Swal.stopTimer);
                      toast.addEventListener("mouseleave", Swal.resumeTimer);
                    },
                  });
          
                  Toast.fire({
                    icon: "success",
                    title: `Đăng nhập thành công`,
                  });
            }
            else {
                const action = LoginModeratorAction(value, props);
                dispatch(action)
            }
        }
    })
    const signInWithGoogle = async () => {
        signInWithPopup(auth, provider).then((result) => {
            const email = {
                "email": result.user?.email
            }


            localStorage.setItem('username', result.user?.displayName)
            localStorage.setItem('emailuser', result.user?.email)
            const action1 = LoginUserAction(email, props);
            dispatch(action1)

        })
            .catch((error) => {
                console.log(error);
            })



    }
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
            <div className="authtication bluesh high-opacity">
                <div className="bg-image" style={{ backgroundImage: 'url(images/avatar/20.jpg)' }} />

                <ul className='welcome-caro' style={{ zIndex: '99!important', opacity: 1 }}>
                    <Slider {...settings} >
                        {arrActivityLogin.map((slide, index) => (
                            <div key={index} className='welcome-box' style={{ zIndex: '99!important', opacity: 1 }}>
                                <img src={slide.media[0]?.linkMedia} style={{ width: 600, height: 400, borderRadius: '10px', objectFit: 'cover' }} alt={`Slide ${index + 1}`} />
                                <h4 className='text-center pb-3 ' style={{ color: 'black' }}>{slide.title}</h4>
                                <p className='text-center' style={{ color: 'black' }}>{(slide.description).slice(0, 200) + '...'}</p>
                            </div>
                        ))}
                    </Slider>
                </ul>

            </div>
            <div className="auth-login">
                <div className="logo"><img src="images/logo.png" alt /><span>SVCW</span></div>
                <div className="mockup left-bottom"><img src="images/mockup.png" alt /></div>
                <div className="verticle-center">
                    <div className="login-form">
                        <h4><i className="icofont-key-hole" /> Đăng nhập</h4>
                        <form method="post" className="c-form" onSubmit={formik.handleSubmit}>
                            <input type="text" placeholder="Tài khoản" name='username' onChange={formik.handleChange} />
                            <input type="password" placeholder="Mật khẩu" name='password' onChange={formik.handleChange} />
                            {/* <div className="checkbox">
                                <input type="checkbox" id="checkbox" defaultChecked />
                                <label htmlFor="checkbox"><span>Nhớ tài khoản</span></label>
                            </div> */}
                           
                            <button className="main-btn" type="submit" ><i className="icofont-key" /> Đăng nhập</button>
                            
                            <p className="google-icon-p-2"
                                onClick={signInWithGoogle}
                            >
                               <div><svg style={{width:20, padding:'4px 0'}} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="w-6 h-6" viewBox="0 0 48 48"><defs><path id="a" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" /></defs><clipPath id="b"><use xlinkHref="#a" overflow="visible" /></clipPath><path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" /><path clipPath="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" /><path clipPath="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" /><path clipPath="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" /></svg></div>
                               <span style={{paddingLeft:'20px'}}> Đăng nhập với Google</span>
                            </p>
                            {/* <button className=" bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 ">
          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="w-6 h-6" viewBox="0 0 48 48"><defs><path id="a" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" /></defs><clipPath id="b"><use xlinkHref="#a" overflow="visible" /></clipPath><path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" /><path clipPath="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" /><path clipPath="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" /><path clipPath="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" /></svg>
          <span className="ml-4">Login with Google</span>
        </button> */}
                        </form>
                        {msgModerator !== '' ? <div style={{ color: 'red' }}>{msgModerator}</div> : <div></div>}
                        {msg !== '' ? <div style={{ color: 'red' }}>{localStorage.getItem('setError')}</div> : <div></div>}
                    </div>
                </div>
                <div className="mockup right"><img src="images/star-shape.png" alt /></div>
            </div>

        </div>

    )
}
