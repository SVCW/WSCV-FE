import React, { useEffect, useState } from "react";
import moment from "moment";

// import DetailActivity from '../../component/DetailActivity';

const Albums = (props) => {
  const { arrActivity } = props;
  const [albums, setAlbums] = useState(arrActivity);
  const [detail, setDetail] = useState({});

  const handleRenderAlbums = () => {
    return albums?.map((album) => {
      return (
        <div
          className="col-lg-3 col-md-4 col-sm-6"
          style={{ margin: "40px 0" }}
        >
          <div className="uzr-pictures">
            <a
              data-target="#img-comt"
              data-toggle="modal"
              onClick={() => {
                setDetail(album);
              }}
            >
              <img
                alt={album.media[0]?.mediaId}
                src={album.media[0]?.linkMedia}
                style={{
                  height: "200px",
                  maxHeight: "200px",
                  width:
                    "100%" /* Allow the width to adjust according to aspect ratio */,
                  objectFit:
                    "fill" /* Resize and crop images to cover the container */,
                }}
              />
            </a>
            <ul className="hover-action">
              <li>
                <a title>
                  {album.media.length > 0 ? (
                    <>
                      <i className="icofont-plus" /> {album.media.length - 1}{" "}
                    </>
                  ) : null}
                </a>
              </li>
            </ul>
          </div>
        </div>
      );
    });
  };
  return (
    <div className="tab-pane fade show" id="pictures">
      <div className="row merged20">
        <div className="col-lg-12">
          <div>
            <h5 className="tab-title">Hình ảnh</h5>
            <div className="row merged-20" >
              {handleRenderAlbums()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Albums;
