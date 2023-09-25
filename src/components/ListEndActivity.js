import React from 'react'
import { useSelector } from 'react-redux';
import ItemEndActivity from './ItemEndActivity';
import moment from 'moment';

export default function ListEndActivity (props) {
    let { arrActivity } = props
    const { userID } = useSelector((root) => root.LoginReducer);
    return (
        <div>
            {arrActivity?.length ===0 ? <div style={{textAlign:'center', fontSize:'20px', fontWeight:600}}>Không tìm thấy bài viết</div>:
           <div>
             {arrActivity?.filter(item => item.status === 'Active')?.map((item, index) => {
                const detailItem = item;
                let isAlreadyLiked = false;
                let isAlreadyJoined = false;
                let isAlreadyFollowed = false;
                item?.like?.map((user) => {
                    if (user.userId === userID) {
                        //item?.like?
                        isAlreadyLiked = true;
                    }
                });


                item?.followJoinAvtivity?.map((user) => {
                    if (user.userId === userID) {
                        isAlreadyFollowed = user.isFollow;
                        isAlreadyJoined = user.isJoin;
                    }
                });
                return <ItemEndActivity ItemActivity={item} index={index} isAlreadyFollowed={isAlreadyFollowed} isAlreadyJoined={isAlreadyJoined} isAlreadyLiked={isAlreadyLiked} detailItem={detailItem} />
            })}
           </div>
        }
        </div>
    )
}
