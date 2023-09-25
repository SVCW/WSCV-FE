import React, { useEffect, useRef, useState } from 'react'
import { Timestamp, addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, updateDoc, toDate, serverTimestamp, where, getDocs, limit } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useSelector } from 'react-redux';

export default function Message(props) {
    const { id } = props.match.params;
    console.log('test Is get: ', id);
    const { getUserId } = useSelector(
        (root) => root.ProfileReducer
    );
    const lastChatRef = useRef(null);
    const [chatter, setChatter] = useState();
    const [chatToUser, setChatToUser] = useState();
    const [currentRoom, setCurrentRoom] = useState();
    // const [chatRoomId, setChatRoomId] = useState();
    const [chatRooms, setChatRooms] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [userFriends, setUserFriends] = useState([]);
    const [userRoomIds, setUserRoomIds] = useState([]);
    const [currentRoomId, setCurrentRoomId] = useState();
    const [userMsgs, setUserMsgs] = useState([]);

    const [formData, setFormData] = useState({
        // message: userMsgs.length === 0 ? 'Hi! ✌️' : ''
        message: ''
    })


    const messagesRef = collection(firestore, "messages");
    // const chatRoomRef = doc(firestore, "chatRooms", where(id = ));
    const chatRoomsRef = collection(firestore, "chatRooms");
    const allUserRoomsRef = query(chatRoomsRef,
        where('memberIds', 'array-contains', getUserId?.userId),
        orderBy('lastSeen', 'asc'));

    const scrollToBottom = () => {
        if (lastChatRef.current) {
            lastChatRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [userMsgs]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    function isActive(timestampToCheck) {
        if (timestampToCheck instanceof Timestamp) {
            const currentTimestamp = Date.now();

            const fifteenMinutesInSeconds = 15 * 60 * 1000;
            console.log(timestampToCheck.toMillis(), '    ', currentTimestamp)
            return currentTimestamp - timestampToCheck.toMillis() <= fifteenMinutesInSeconds;
        }
    }

    function formatLastSeen(timestamp) {
        // Get the current date and time
        const currentDate = new Date();
        // Get the Firestore Timestamp as a Date object
        if (timestamp instanceof Timestamp) {
            const timestampDate = timestamp.toDate()
            if (
                currentDate.getDate() === timestampDate.getDate() &&
                currentDate.getMonth() === timestampDate.getMonth() &&
                currentDate.getFullYear() === timestampDate.getFullYear()
            ) {
                // Format as "Last Seen On Today At HH:mm"
                const hours = timestampDate.getHours().toString().padStart(2, '0');
                const minutes = timestampDate.getMinutes().toString().padStart(2, '0');
                return `Last Seen On Today At ${hours}:${minutes}`;
            } else {
                // Format as "Last Seen On DD Month YYYY At HH:mm"
                const day = timestampDate.getDate().toString().padStart(2, '0');
                const monthNames = [
                    'January', 'February', 'March', 'April',
                    'May', 'June', 'July', 'August',
                    'September', 'October', 'November', 'December'
                ];
                const month = monthNames[timestampDate.getMonth()];
                const year = timestampDate.getFullYear();
                const hours = timestampDate.getHours().toString().padStart(2, '0');
                const minutes = timestampDate.getMinutes().toString().padStart(2, '0');
                return `Last Seen On ${day} ${month} ${year} At ${hours}:${minutes}`;
            }
        }


        // Check if the timestamp is from today

    }
    //Hàm này là chỉ để lấy user (chatter - me) 

    async function newPmRoom(pmId, type) {
        const userRef = doc(firestore, "users", pmId);
        const user = await getDoc(userRef);
        if (user.exists()) {
            const room = await addDoc(chatRoomsRef, {
                type: type,
                memberIds: [pmId, getUserId.userId],
                pmUserId: type === 'pm' ? pmId : '',
                createdAt: serverTimestamp(),
                lastSeen: serverTimestamp(),
                roomName: user.data().fullName ? user.data().fullName : 'New Chat Room',
                image: user.data().image ? user.data().image : 'none',
                dateOfBirth: user.data().dateOfBirth,
                email: user.data().email,
            })
            setChatToUser(user.data());
            return room.id;
        }
        return undefined;
    }
    // Hàm get Chat Room (tạo mới nếu chưa có @@)
    // const getChatRoom = async () => {
    //     //url/:id - undefined (when click the icon message on header - url/message)
    //     if (!id) {
    //         const latest = query(chatRoomsRef,
    //             where('memberIds', 'array-contains', user))

    //         const latestRoom = query(messagesRef,
    //             where('userId', '==', getUserId?.userId),
    //             orderBy('timestamp', 'asc'),
    //             limit(1)
    //         );
    //         const latestMsgs = await getDocs(latestRoom);

    //         if (!latestMsgs.empty) {
    //             latestMsgs.forEach((r) => {
    //                 console.log('Get Latest chat Room: ', r.data());
    //                 setCurrentRoomId(r.id);
    //                 return r.data();
    //             })
    //             return undefined;
    //         }
    //     }

    //     //url/:id - have data
    //     const chatRoomRef = doc(firestore, 'chatRooms', id);
    //     const room = await getDoc(chatRoomRef);

    //     if (room.exists()) {
    //         console.log('ChatRoom Info: ', room.data());
    //         setCurrentRoomId(room.id);
    //         return room.data();
    //     }
    //     // Room not found 
    //     const existUser = await getChatter(id);

    //     //check if  url/:id - is a userId 
    //     if (existUser) {
    //         // access room by userId (instead roomId)
    //         const pmRoomRef = query(chatRoomsRef,
    //             where('type', '==', 'pm'),
    //             where('memberIds', 'array-contains-any', [getUserId?.userId, id]),
    //             // where('memberIds', 'array-contains', ),
    //             limit(1)
    //         );
    //         const pmRooms = await getDocs(pmRoomRef);

    //         if (!pmRooms.empty) {
    //             pmRooms.forEach((r) => {
    //                 console.log('New room created: ', r.data());
    //                 setCurrentRoomId(r.id);
    //                 return r.data();
    //             })
    //             return undefined;
    //         }

    //         // create and return new PM Room ID
    //         // const memberIds = [getUserId?.userId, id]
    //         const createdRoomId = await newPmRoom(id, 'pm')
    //         //get created Room with Id
    //         const newRoomRef = await doc(firestore, 'chatRooms', createdRoomId)
    //         const newRoom = await getDoc(newRoomRef)
    //         if (newRoom.exists()) {
    //             console.log('New PM room created: ', newRoom.data());
    //             setCurrentRoomId(newRoom.id);
    //             return newRoom.data();
    //         }
    //         return undefined;
    //     }
    //     // id is either userId or roomId -> ?
    //     return undefined;
    // }

    // Các hàm sideEffect??
    useEffect(() => {
        async function getChatter(userId) {
            const userRef = doc(firestore, "users", userId);
            const user = await getDoc(userRef);
            if (user.exists()) {
                if (userId === getUserId?.userId) {
                    console.log('User before update: ', user.data())
                    // update newest data for user
                    await updateDoc(userRef, {
                        image: getUserId.image,
                        email: getUserId.email,
                        dateOfBirth: getUserId.dateOfBirth,
                        chatRoomIds: [],
                        phone: (getUserId.phone || getUserId.phone === null) ? getUserId.phone : user.data().phone,
                        username: getUserId.username,
                        lastSeen: serverTimestamp(),
                        fullName: getUserId.fullName,
                        roleId: (getUserId.roleId || getUserId.roleId === null) ? getUserId.roleId : user.data().roleId,
                    })
                }
                // re-fetch user after upd
                const usr = await getDoc(userRef)
                if (usr.exists()) {
                    console.log("Existed user:--", usr.data());
                    setChatter(usr.data());
                    return usr.data();
                }
                return undefined;
            }
            // User not found -> create new user with mapped id to SQL DB
            await setDoc(doc(firestore, "users", getUserId.userId), {
                image: getUserId.image,
                email: getUserId.email,
                userId: getUserId?.userId,
                gender: getUserId.gender,
                dateOfBirth: getUserId.dateOfBirth,
                phone: getUserId.phone,
                roleId: getUserId.roleId,
                friendIds: [],
                chatRoomIds: [],
                username: getUserId.username,
                fullName: getUserId.fullName,
                createOnFirebaseAt: serverTimestamp(),
            });
            const newUser = await getDoc(userRef)
            if (newUser.exists()) {
                console.log("data:--" + newUser.data());
                setChatter(newUser.data());
                return newUser.data();
            }
            return undefined;
        }

        async function getUserRooms() {
            const allUserRooms = await getDocs(allUserRoomsRef);
            let currentRoom = undefined;
            if (!allUserRooms.empty) {
                const listData = allUserRooms.docs.map(room => ({
                    ...room.data(),
                    id: room.id
                }));
                setChatRooms(listData);
                const groups = [];
                const friends = [];
                listData.forEach(room => {
                    if (room.id === id) {
                        currentRoom = room;
                    }
                    const pmRoom = room.memberIds;
                    if (pmRoom instanceof Array && pmRoom.includes(id)) {
                        currentRoom = room;
                        //get Chat to user
                    }
                    if (room.isGroup) {
                        groups.push(room);
                    } else {
                        friends.push(room);
                    }
                })
                setUserFriends(friends);
                setUserGroups(groups);
                if (!currentRoom) {
                    const existUser = await getChatter(id);
                    if (existUser) {
                        // create new PM Room ID for this user to the url userId
                        const createdRoomId = await newPmRoom(id, 'pm')
                        if (createdRoomId) {
                            const newRoomRef = await doc(firestore, 'chatRooms', createdRoomId)
                            const newRoom = await getDoc(newRoomRef)
                            if (newRoom.exists()) {
                                console.log('urlId is new userId - New PM room created: ', newRoom.data());
                                currentRoom = { ...newRoom.data(), id: newRoom.id };
                                // return [{ ...newRoom.data(), id: newRoom.id }];
                            }
                        }
                    }
                } else {
                    // get chat to user
                    const userRef = doc(firestore, "users", id);
                    const user = await getDoc(userRef);
                    if (user.exists()) {
                        setChatToUser(user.data());
                    }
                }
            } else {
                //no any chat room
                // check if url id is a userId
                const existUser = await getChatter(id);
                if (existUser) {
                    // create new PM Room ID for this user to the url userId
                    const createdRoomId = await newPmRoom(id, 'pm')

                    if (createdRoomId) {
                        const newRoomRef = await doc(firestore, 'chatRooms', createdRoomId)
                        const newRoom = await getDoc(newRoomRef)
                        if (newRoom.exists()) {
                            console.log('urlId is new userId - New PM room created: ', newRoom.data());
                            setChatRooms({ ...newRoom.data(), id: newRoom.id })
                            currentRoom = { ...newRoom.data(), id: newRoom.id };
                            // return [{ ...newRoom.data(), id: newRoom.id }];
                        }
                    }
                }
            }
            setCurrentRoom(currentRoom);
            const unTrackRoom = onSnapshot(query(messagesRef,
                // where('roomId', 'in', currentRoom.id),
                orderBy('timestamp', 'asc')), (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            // playNotificationSound();
                            console.log("New message: ", change.doc.data());
                        }
                        if (change.type === "modified") {
                            console.log("Modified massage: ", change.doc.data());
                        }
                        if (change.type === "removed") {
                            console.log("Removed message: ", change.doc.data());
                        }
                    })
                    const data = snapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    })).filter(message => message.roomId === currentRoom?.id);
                    console.log('Chat room message:', data);
                    setUserMsgs(data);
                });
            //no chat room url not a userId or gr Id
        }

        if (id) {
            getUserRooms();

            const unSubUserRooms = onSnapshot(allUserRoomsRef, (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                const listRoomIds = data.map(data => data.id);
                console.log('User room Ids:', listRoomIds);
                console.log('User rooms:', data);
                setUserRoomIds(listRoomIds);
            });

            const ct = getChatter(getUserId?.userId)
            setChatter(ct);
        } else {
            // getUserRooms();

            // // const unSubUserRooms = onSnapshot(allUserRoomsRef, (snapshot) => {
            // //     const data = snapshot.docs.map(doc => ({
            // //         ...doc.data(),
            // //         id: doc.id
            // //     }));
            // //     const listRoomIds = data.map(data => data.id);
            // //     console.log('User room Ids:', listRoomIds);
            // //     console.log('User rooms:', data);
            // //     setUserRoomIds(listRoomIds);
            // // });

            // const ct = getChatter(getUserId?.userId)
            // setChatter(ct);
        }
    }, [])

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            playNotificationSound();
            handleSend(e);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault()
        if ((!formData.message || formData.message === '') && userMsgs.length !== 0) {
            return;
        }
        try {
            const message = await addDoc(messagesRef, {
                type: "pm",
                content: (userMsgs.length === 0 && (!formData.message || formData.message === '')) ? 'Hi! ✌️' : formData.message,
                roomId: currentRoom?.id,
                username: chatter?.username,
                userId: getUserId?.userId,
                timestamp: Timestamp.fromDate(new Date()),
            });
            playNotificationSound();
            setFormData({ message: '' })
            console.log("Document written with ID: ", message.id);
        } catch (e) {
            alert('It seem like you have no any chat room.\nLet add new friend and staring a chat!')
            console.error("Error adding document: ", e);
        }
    }
    // play noti sound
    function playNotificationSound() {
        const notificationSound = document.getElementById('newMessageSound');
        if (notificationSound) {
            notificationSound.play();
        }
    }
    return (

        <div className="theme-layout" >
            <audio src='../images/new-message.mp3' type="audio/mpeg" id="newMessageSound" preload="auto" autoplay="false" />
            <section>
                <div className="gap" style={{ height: '90vh' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div id="page-contents" className="row merged20">
                                    <div className="col-lg-8">
                                        <div className="main-wraper">
                                            {/* Message Box */}
                                            <div className="message-box">

                                                <h3 className="main-title">Groups</h3>
                                                <div className="message-header">
                                                    {
                                                        userGroups.length === 0 ? (
                                                            <p style={{ textAlign: 'center' }}>No groups</p>
                                                        ) : (userGroups.map((gr, index) => {
                                                            // const isLastMessage = index === userMsgs.length - 1;
                                                            return (
                                                                <div className="useravatar">
                                                                    <img
                                                                        style={{ backgroundColor: 'white', width: 35, height: 35, objectFit: 'hidden', borderRadius: '100%' }}
                                                                        src={gr?.image === 'none' ? "../images/default-avt.png" : gr.image} alt />
                                                                    <span>{gr?.roomName}</span>
                                                                    <div className={"status " + isActive(gr?.lastSeen) ? 'online' : 'offline'} />
                                                                </div>
                                                            )
                                                        }))
                                                    }

                                                    {/* <div className="useravatar">
                                                        <img src="../images/default-avt.png" alt />
                                                        <span>Noah</span>
                                                        <div className="status offline" />
                                                    </div>
                                                    <div className="useravatar">
                                                        <img src="../images/default-avt.png" alt />
                                                        <span>Maria</span>
                                                        <div className="status offline" />
                                                    </div>
                                                    <div className="useravatar">
                                                        <img src="../images/default-avt.png" alt />
                                                        <span>Ellie</span>
                                                        <div className="status offline" />
                                                    </div> */}
                                                </div>

                                                <h3 className="main-title">Friends</h3>
                                                <div className="message-header">
                                                    {
                                                        userFriends.length === 0 ? (
                                                            <p style={{ textAlign: 'center' }}>No firends</p>
                                                        ) : (userFriends.map((fr, index) => {
                                                            // const isLastMessage = index === userMsgs.length - 1;
                                                            return (
                                                                <div className="useravatar">
                                                                    {/* <a href={'/message/' + fr?.pmUserId}> */}
                                                                    <img
                                                                        style={{ backgroundColor: 'white', width: 35, height: 35, objectFit: 'hidden', borderRadius: '100%' }}
                                                                        src={fr?.image === 'none' ? "../images/default-avt.png" : fr.image} alt />
                                                                    {/* </a> */}
                                                                    <span>{fr?.roomName}</span>
                                                                    <div className={isActive(fr?.lastSeen) ? 'status online' : 'status offline'} />
                                                                </div>
                                                            )
                                                        }))
                                                    }
                                                    {/* <div className="useravatar active">
                                                        <img src="../images/default-avt.png" alt />
                                                        <span>Oliver</span>
                                                        <div className="status away" />
                                                    </div>
                                                    <div className="useravatar">
                                                        <img src="../images/default-avt.png" alt />
                                                        <span>Sarah</span>
                                                        <div className="status online" />
                                                    </div>
                                                    <div className="useravatar">
                                                        <img src="../images/default-avt.png" alt />
                                                        <span>Andrew</span>
                                                        <div className="status offline" />
                                                    </div>
                                                    <div className="useravatar">
                                                        <img src="../images/default-avt.png" alt />
                                                        <span>Mikaly</span>
                                                        <div className="status online" />
                                                    </div>
                                                    <div className="useravatar">
                                                        <img src="../images/default-avt.png" alt />
                                                        <span>Bumsy</span>
                                                        <div className="status away" />
                                                    </div>
                                                    <div className="useravatar active">
                                                        <img src="../images/default-avt.png" alt />
                                                        <span>Oliver</span>
                                                        <div className="status away" />
                                                    </div>
                                                    <div className="useravatar">
                                                        <img src="../images/default-avt.png" alt />
                                                        <span>Sarah</span>
                                                        <div className="status online" />
                                                    </div>
                                                    <div className="useravatar">
                                                        <img src="../images/default-avt.png" alt />
                                                        <span>Andrew</span>
                                                        <div className="status offline" />
                                                    </div>
                                                    <div className="useravatar">
                                                        <img src="../images/default-avt.png" alt />
                                                        <span>Mikaly</span>
                                                        <div className="status online" />
                                                    </div>
                                                    <div className="useravatar">
                                                        <img src="../images/default-avt.png" alt />
                                                        <span>Bumsy</span>
                                                        <div className="status away" />
                                                    </div> */}
                                                </div>

                                                <div className="message-content">
                                                    <div className="chat-header">
                                                        <div className="status online" />
                                                        <h6>{formatLastSeen(chatToUser?.lastSeen)}</h6>
                                                        <div className="corss">
                                                            <span className="report"><i className="icofont-flag" /></span>
                                                            <span className="options"><i className="icofont-brand-flikr" /></span>
                                                        </div>
                                                    </div>
                                                    {/* message */}
                                                    <div className="chat-content">
                                                        <div className="date">Wednesday 25, March</div>
                                                        <ul className="chatting-area ">
                                                            {
                                                                userMsgs.length === 0 ? (
                                                                    <p style={{ textAlign: 'center' }}>Let's say Hi!</p>
                                                                ) : (userMsgs.map((msg, index) => {
                                                                    const isLastMessage = index === userMsgs.length - 1;
                                                                    return (
                                                                        <li
                                                                            key={index}
                                                                            ref={isLastMessage ? lastChatRef : null}
                                                                            style={{
                                                                                display: 'inline-flex',
                                                                                flexDirection: getUserId?.userId === msg?.userId ? 'row-reverse' : '',
                                                                                marginBottom: 5
                                                                            }}
                                                                            className={getUserId?.userId === msg?.userId ? 'me' : 'you'}>
                                                                            {/* Message avatar */}
                                                                            {
                                                                                getUserId?.userId === msg?.userId ? (
                                                                                    <figure style={{ display: 'flex', flexDirection: 'column-reverse' }}><img
                                                                                        style={{ backgroundColor: 'white', width: 30, height: 30, objectFit: 'hidden', borderRadius: '100%' }}
                                                                                        alt={'Avatar'} src={chatter?.image === 'none' ? "../images/default-avt.png" : chatter?.image} /></figure>

                                                                                ) : (
                                                                                    <figure style={{ display: 'flex', flexDirection: 'column-reverse' }}><img
                                                                                        style={{ backgroundColor: 'white', width: 30, height: 30, objectFit: 'hidden', borderRadius: '100%' }}
                                                                                        alt={'Avatar'} src={chatToUser?.image === 'none' ? "../images/default-avt.png" : chatToUser?.image} /></figure>
                                                                                )
                                                                            }
                                                                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: getUserId?.userId === msg?.userId ? 'flex-end' : 'flex-start' }}>
                                                                                <h5 style={{ fontSize: 11, marginBottom: '1px', marginLeft: '19px', marginRight: '19px' }} href='#' alt=''>{getUserId?.userId === msg?.userId ? '' : msg?.username}</h5>
                                                                                <p style={{ display: 'inline-flex', marginBottom: '1', wordWrap: 'break-word', overflow: 'hidden' }}>{msg.content}</p>
                                                                            </div>
                                                                        </li>
                                                                    )
                                                                }))
                                                            }
                                                        </ul>
                                                        <div className="message-text-container">
                                                            <div className="more-attachments">
                                                                <i className="icofont-plus" />
                                                            </div>
                                                            <div className="attach-options">
                                                                <a href="#" title><i className="icofont-camera" /> Open Camera</a>
                                                                <a href="#" title><i className="icofont-video-cam" /> Photo &amp; video Library</a>
                                                                <a href="#" title><i className="icofont-paper-clip" /> Attach Document</a>
                                                                <a href="#" title><i className="icofont-location-pin" /> Share Location</a>
                                                                <a href="#" title><i className="icofont-contact-add" /> Share Contact</a>
                                                            </div>
                                                            <form onSubmit={handleSend} >
                                                                <span className="emojie"><img src="../images/smiles/happy.png" alt /></span>
                                                                <textarea
                                                                    rows={1}
                                                                    placeholder="Nhắn tin"
                                                                    name="message"
                                                                    value={formData.message}
                                                                    onChange={handleChange}
                                                                    onKeyPress={handleKeyPress}
                                                                />
                                                                {userMsgs.length === 0 ? (
                                                                    <div style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center' }}>
                                                                        <button type='submit' className="button primary circle" style={{ backgroundColor: '#8ab332', width: 120 }} href="#" title>Say hi! 🖐️</button>
                                                                    </div>
                                                                ) : (
                                                                    <button title="send" type='submit'><i className="icofont-paper-plane" /></button>
                                                                )}

                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="profile-short">
                                            <div className="chating-head" style={{ backgroundColor: '#ddebf3', marginBottom: 10 }}>
                                                <div className="s-left">
                                                    <h5>{currentRoom?.isGroup ? currentRoom?.roomName : chatToUser?.fullName}</h5>
                                                    <p>Bạn bè</p>
                                                </div>
                                            </div>
                                            <div className="short-intro">
                                                {
                                                    currentRoom?.isGroup ? (
                                                        <figure><img style={{ backgroundColor: 'white', width: 300, height: 300, objectFit: 'hidden', borderRadius: '100%' }} src={(!currentRoom || currentRoom?.image === 'none') ? "../images/default-avt.png" : currentRoom?.image} alt='' sizes='' /></figure>
                                                    ) : (
                                                        <figure><img style={{ backgroundColor: 'white', width: 300, height: 300, objectFit: 'hidden', borderRadius: '100%' }} src={(!chatToUser || chatToUser?.image === 'none') ? "../images/default-avt.png" : chatToUser?.image} alt='' sizes='' /></figure>

                                                    )
                                                }

                                                {currentRoom?.isGroup ? (
                                                    <ul>
                                                        <li>
                                                            <span>Tên nhóm</span>
                                                            <p>{currentRoom?.roomName === 'none' ? '- - -' : chatter?.fullName}</p>
                                                        </li>
                                                        {/* <li>
                                                            <span>Ngày sinh</span>
                                                            <p>{getUserId?.fullName === 'none' ? '- - -' : chatter?.dateOfBirth}</p>
                                                        </li>
                                                        <li>
                                                            <span>Email</span>
                                                            <p>{getUserId?.fullName === 'none' ? '- - -' : chatter?.email}</p>
                                                        </li> */}
                                                    </ul>
                                                ) : (
                                                    <ul>
                                                        <li>
                                                            <span>Tên</span>
                                                            <p>{chatToUser?.fullName === 'none' ? '- - -' : chatToUser?.fullName}</p>
                                                        </li>
                                                        <li>
                                                            <span>Ngày sinh</span>
                                                            <p>{chatToUser?.dateOfBirth === 'none' ? '- - -' : chatToUser?.dateOfBirth}</p>
                                                        </li>
                                                        <li>
                                                            <span>Email</span>
                                                            <p>{chatToUser?.email === 'none' ? '- - -' : chatToUser?.email}</p>
                                                        </li>
                                                    </ul>
                                                )}

                                                <a style={{ margin: 10 }} className="button primary circle" href="#" title>view Profile</a>
                                                <button className="button primary circle" style={{ margin: 10, backgroundColor: '#8ab332', width: 120 }} href="#" title>Add friend</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </section >
            <figure className="bottom-mockup"><img src="../images/footer.png" alt /></figure>

            <div className="bottombar">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <span className>© copyright All rights reserved by SVCW 2023</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* footer */}
        </div >
    )
}
