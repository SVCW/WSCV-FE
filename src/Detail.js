
  import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetActivityIDAction } from "./redux/actions/ActivityAction";
import Slider from "react-slick";
import moment from "moment";
  export default function Detail(props) {
    const {id} = props.match.params
    const dispatch = useDispatch()
    const { activityById } = useSelector((root) => root.ActivityReducer);
    useEffect(() => {
        const action = GetActivityIDAction(id);
        dispatch(action);
      }, []);
      console.log(activityById)
      const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        customStyle: {
          backgroundColor: 'red',
          color: 'white',
          nextButton: {
            display: 'none'
          }
        }
      };
      settings.nextArrow = <style>{`
      .slick-next {
        position: absolute;
        right: -20px;
    }
      }
      .slick-prev{
        // display: none!important;
      }
    `}</style>;
      const settings1 = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
       
      };
    const slides = activityById?.media?.map((item, index) => {
    
    return (
      <div  style={settings.customStyle} key={index}>
        <img src={item?.linkMedia} alt="Slide 1" style={{width:'900px', height:'500px', marginLeft:'60px'}} />
      </div>
    );
  });
  console.log(slides)
  return (
  <div>
    <div className="container my-5">
        <div style={{fontSize:'20px', color:'blue' , padding:'30px 0' , cursor:'pointer' , width:'150px', textDecoration:'underline'}} onClick={()=>{
            props.history.goBack()
        }}>Trang trước</div>
      <div className="row">
        <div className="col-md-6">
          <div className="main-img">
             <Slider {...settings} className={"slick-slider"}>
                      {slides}
                    </Slider>
            {/* <img className="img-fluid" src="https://cdn.pixabay.com/photo/2015/07/24/18/40/model-858753_960_720.jpg" alt="ProductS"  style={{height:'400px'}}/> */}
           
          </div>
        </div>
        <div className="col-md-6">
          <div className="main-description px-2">
            {/* <div className="category text-bold">
              Category: Women
            </div> */}
            <div className="product-title text-bold my-3">
             {activityById.title}
            </div>
                        <p className="description">{activityById.description} </p>
            <div className="price-area my-4">
              <p className="old-price mb-1"> Bắt đầu: <span className="old-price-discount ">{moment(activityById.startDate).format("DD/MM/YYYY")}</span></p>
              <p className="old-price mb-1"> Kết thúc: <span className="old-price-discount ">{moment(activityById.endDate).format("DD/MM/YYYY")}</span></p>
              
            </div>
           
          </div>
          <div className="product-details my-4">
            <p className="details-title text-color mb-1">Bài viết của</p>
            <p className="description">{activityById.user?.username} </p>
            <p className="description">{activityById.user?.email} </p>
          </div>
          {/* <div className="row questions bg-light p-3">
            <div className="col-md-1 icon">
              <i className="fa-brands fa-rocketchat questions-icon" />
            </div>
            <div className="col-md-11 text">
              Have a question about our products at E-Store? Feel free to contact our representatives via live chat or email.
            </div>
          </div>
          <div className="delivery my-4">
            <p className="font-weight-bold mb-0"><span><i className="fa-solid fa-truck" /></span> <b>Delivery done in 3 days from date of purchase</b> </p>
            <p className="text-secondary">Order now to get this product delivery</p>
          </div>
          <div className="delivery-options my-4">
            <p className="font-weight-bold mb-0"><span><i className="fa-solid fa-filter" /></span> <b>Delivery options</b> </p>
            <p className="text-secondary">View delivery options here</p>
          </div> */}
        </div>
      </div>
    </div>
   {activityById.process?.length === 0 ? 
   <div></div>
:
<div className="container similar-products my-4">

<p style={{fontSize:'22px'}}>Các hoạt động trong chiến dịch</p>
<div className="row">
  {activityById.process?.map((item,index)=>{
      return <div className="col-md-12">
        <hr />
          <div style={{fontSize:'20px', paddingBottom:'20px'}}>Hoạt động {index+1} </div>
      <div className="similar-product">
      <Slider {...settings1} >
             {item?.media?.map((media,index)=>{
              return <img className="w-100" src={media.linkMedia} alt="Preview" />
             })}
              </Slider>
       
        <p className="title" style={{fontSize:'20px'}}>Hoạt động: {item.processTitle}</p>
        <p className="price">Chi tiết: {item.description}</p>
        <p className="price">Bắt đầu: {moment(item.startDate).format('DD/MM/YYYY hh:mm A')}</p>
        <p className="price">Kết thúc: {moment(item.enddate).format('DD/MM/YYYY hh:mm A')}</p>
        <p className="price">Địa điểm: {item.location}</p>
      </div>
    </div>
  })}
 
</div>
</div>}
  </div>
  );
}

