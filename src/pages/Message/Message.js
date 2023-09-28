import React, { useEffect, useRef, useState } from 'react'
import { Timestamp, addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, updateDoc, serverTimestamp, where, getDocs } from 'firebase/firestore';
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
    const [userPm, setUserPm] = useState();
    const [currentRoom, setCurrentRoom] = useState();
    const [showIcon, setShowIcon] = useState(false);
    const [noRoom, setNoRoom] = useState(false);
    const [iconToSend, setIconToSend] = useState('');
    const [userRooms, setUserRooms] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [userFriends, setUserFriends] = useState([]);
    const [userRoomIds, setUserRoomIds] = useState([]);
    const [currentRoomId, setCurrentRoomId] = useState();
    const [userMsgs, setUserMsgs] = useState([]);

    const [formData, setFormData] = useState({
        message: ''
    })
    const messagesRef = collection(firestore, "messages");
    const chatRoomsRef = collection(firestore, "chatRooms");
    const allUserRoomsRef = query(chatRoomsRef,
        where('memberIds', 'array-contains', getUserId?.userId),
        orderBy('lastSeen', 'asc'));

    // play noti sound
    const notificationSound = document.getElementById('newMessageSound');
    function playNotificationSound() {
        // const notificationSound = document.getElementById('newMessageSound');
        if (notificationSound) {
            notificationSound.play();
        }
    }
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

    function formatLastSeen(timestamp, lastMess) {
        const str = lastMess ? 'Message' : 'Seen';
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
                return `Last ${str} On Today At ${hours}:${minutes}`;
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
                return `Last ${str} On ${day} ${month} ${year} At ${hours}:${minutes}`;
            }
        }


        // Check if the timestamp is from today

    }
    async function newPmRoom(pmId, type) {
        const currentUsr = await getDoc(doc(firestore, "users", getUserId?.userId))
        const userPm = await getDoc(doc(firestore, "users", pmId));
        if (userPm.exists()) {
            const room = await addDoc(chatRoomsRef, {
                type: type,
                memberIds: [userPm.data().userId, currentUsr.data().userId],
                members: [userPm.data(), currentUsr.data()],
                pmUserId: type === 'pm' ? pmId : '',
                pmUser: userPm.data(),
                createdAt: serverTimestamp(),
                // lastSeen: serverTimestamp(),
                roomName: userPm.data().fullName ? userPm.data().fullName : 'New Chat Room',
                image: userPm.data().image ? userPm.data().image : 'none',
                dateOfBirth: userPm.data().dateOfBirth,
                email: userPm.data().email,
            })
            setUserPm(userPm.data());
            return room.id;
        }
        return undefined;
    }
    useEffect(() => {
        async function getChatter(userId) {
            const userRef = doc(firestore, "users", userId);
            const user = await getDoc(userRef);
            if (user.exists()) {
                if (userId === getUserId?.userId) {
                    console.log('User before update: ', user.data())
                    console.log('User to update: ', getUserId)
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
            //get all room first
            const allUserRooms = await getDocs(allUserRoomsRef);
            let currentRoom = undefined;
            //if have room
            if (!allUserRooms.empty) {
                const listData = allUserRooms.docs.map(room => ({
                    ...room.data(),
                    id: room.id
                }));
                //set usr rooms
                setUserRooms(listData);
                // get grs and frs and get current Room case 
                const groups = [];
                const friends = [];
                if (id) {
                    listData.forEach(room => {
                        //case id is roomId
                        if (room.id === id) {
                            currentRoom = room;
                            if (room.type && room.type === 'pm') {
                                const members = room.members;
                                if (members instanceof Array) {
                                    members.map(mem => {
                                        if (mem.userId !== getUserId.userId) {
                                            setUserPm(mem);
                                        }
                                    })

                                }
                            }
                        }
                        //case id is userId of a exiting pm room
                        if (room.type && room.type === 'pm') {
                            const members = room.memberIds;
                            if (members instanceof Array && members.includes(getUserId?.userId) && members.includes(id)) {
                                currentRoom = room;
                                setUserPm(room.pmUser);
                            }
                        }
                        if (room.isGroup) {
                            groups.push(room);
                        } else {
                            friends.push(room);
                        }
                    })

                    if (id === 'default') {
                        currentRoom = listData[0];
                        setUserPm(currentRoom.pmUser);
                    }

                    // case id is a 'new userId'
                    if (!currentRoom) {
                        // chk if id is a userId
                        const existUser = await getDoc(doc(firestore, 'users', id));
                        if (existUser.exists()) {
                            // create new PM Room ID for this user to the url userId
                            const createdRoomId = await newPmRoom(id, 'pm')
                            if (createdRoomId) {
                                const newRoom = await getDoc(doc(firestore, 'chatRooms', createdRoomId))
                                if (newRoom.exists()) {
                                    console.log('urlId is new userId - New PM room created: ', newRoom.data());
                                    currentRoom = { ...newRoom.data(), id: newRoom.id };
                                    setUserPm(existUser.data());
                                }
                            }
                        } else {
                            // case id is not userId or roomId or wtf anything
                            // => set default room (latest room)
                            currentRoom = listData[0];
                        }

                    } else {
                        // get userPm
                        const userRef = doc(firestore, "users", id);
                        const user = await getDoc(userRef);
                        if (user.exists()) {
                            setUserPm(user.data());
                        }
                    }
                }
                setUserFriends(friends);
                setUserGroups(groups);
                console.log(' ====> Current room ', currentRoom)

            } else {
                //no any chat room
                // check if url id is a userId
                const existUser = await getDoc(doc(firestore, 'users', id));
                if (existUser.exists()) {
                    // create new PM Room ID for this user to the url userId
                    const createdRoomId = await newPmRoom(id, 'pm')

                    if (createdRoomId) {
                        const newRoomRef = await doc(firestore, 'chatRooms', createdRoomId)
                        const newRoom = await getDoc(newRoomRef)
                        if (newRoom.exists()) {
                            console.log('urlId is new userId - New PM room created: ', newRoom.data());
                            setUserRooms({ ...newRoom.data(), id: newRoom.id })
                            currentRoom = { ...newRoom.data(), id: newRoom.id };
                            setUserPm(existUser.data());
                            // return [{ ...newRoom.data(), id: newRoom.id }];
                        }
                    }
                }
                //no any room
                setNoRoom(true);
            }
            setCurrentRoom(currentRoom);
            // Track messages
            const unTrackRoom = onSnapshot(query(messagesRef,
                // where('roomId', 'in', currentRoom.id),
                orderBy('timestamp', 'asc')), (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            playNotificationSound();
                            // console.log("New message: ", change.doc.data());
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
        }

        // === Flow here
        console.log('getUserId: ', getUserId);

        const ct = getChatter(getUserId?.userId)
        setChatter(ct);

        getUserRooms();
        const unSubUserRooms = onSnapshot(allUserRoomsRef, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setUserRooms(data);
        });


    }, [])

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            playNotificationSound();
            handleSend(e);
        }
    };

    async function sendIcon(iconId) {
        if (iconId !== '') {
            try {
                const message = await addDoc(messagesRef, {
                    type: "pmi",
                    content: iconId,
                    roomId: currentRoom?.id,
                    username: chatter?.username,
                    userId: getUserId?.userId,
                    timestamp: Timestamp.fromDate(new Date()),
                });
                playNotificationSound();
                setFormData({ message: '' })
                console.log("Document Icon written with ID: ", message.id);
            } catch (e) {
                alert('It seem like you have no any chat room.\nLet add new friend and staring a chat!')
                console.error("Error adding document: ", e);
            }
        }
    }

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
                user: chatter,
                timestamp: serverTimestamp(),
            });
            // playNotificationSound();
            setFormData({ message: '' })
            console.log("Document written with ID: ", message.id);

            await updateDoc(doc(firestore, 'chatRooms', currentRoom?.id), {
                lastSeen: serverTimestamp()
            })
        } catch (e) {
            alert('It seem like you have no any chat room.\nLet add new friend and staring a chat!')
            console.error("Error adding document: ", e);
        }
    }
    function getIconSource(id) {
        switch (id) {
            case '1':
                return "../images/smiles/angry-1.png";
            case '2':
                return "../images/smiles/angry.png";
            case '3':
                return "../images/smiles/bored-1.png";
            case '4':
                return "../images/smiles/bored-2.png";
            case '5':
                return "../images/smiles/bored.png";
            case '6':
                return "../images/smiles/confused-1.png";
            case '7':
                return "../images/smiles/confused.png";
            case '8':
                return "../images/smiles/crying-1.png";
            case '9':
                return "../images/smiles/crying.png";
            case '10':
                return "../images/smiles/tongue-out.png";
            case '11':
                return "../images/smiles/wink.png";
            case '12':
                return "../images/smiles/suspicious.png";
            default:
                return ""; // Return an empty string if the ID is not found
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
                                                            return (
                                                                <div className="useravatar" onClick={() => setCurrentRoom(fr)}>
                                                                    {/* <a href={'/message/' + fr?.pmUserId}> */}
                                                                    <img
                                                                        style={{ backgroundColor: 'white', width: 35, height: 35, objectFit: 'hidden', borderRadius: '100%' }}
                                                                        src={fr?.image === 'none' ? "../images/default-avt.png" : fr.image} alt />
                                                                    {/* </a> */}
                                                                    <span>{fr?.roomName}</span>

                                                                    <div className={isActive(fr?.lastSeen) ? 'status online' : 'status offline'} />
                                                                    {/* away */}
                                                                </div>
                                                            )
                                                        }))
                                                    }
                                                </div>

                                                <div className="message-content">
                                                    <div className="chat-header">
                                                        <div className="status online" />
                                                        <h6>{formatLastSeen(userPm?.lastSeen)}</h6>
                                                        <div className="corss">
                                                            <span className="report"><i className="icofont-flag" /></span>
                                                            <span className="options"><i className="icofont-brand-flikr" /></span>
                                                        </div>
                                                    </div>
                                                    {/* message */}
                                                    <div className="chat-content">
                                                        <div className="date">{formatLastSeen(currentRoom?.lastSeen, true)}</div>
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
                                                                            className={getUserId?.userId === msg?.user?.userId ? 'me' : 'you'}>
                                                                            {/* Message avatar */}
                                                                            {
                                                                                getUserId?.userId === msg?.userId ? (
                                                                                    <figure style={{ display: 'flex', flexDirection: 'column-reverse' }}><img
                                                                                        style={{ backgroundColor: 'white', width: 30, height: 30, objectFit: 'hidden', borderRadius: '100%' }}
                                                                                        alt={'Avatar'} src={chatter?.image === 'none' ? "../images/default-avt.png" : chatter?.image} /></figure>

                                                                                ) : (
                                                                                    <figure style={{ display: 'flex', flexDirection: 'column-reverse' }}><img
                                                                                        style={{ backgroundColor: 'white', width: 30, height: 30, objectFit: 'hidden', borderRadius: '100%' }}
                                                                                        alt={'Avatar'} src={userPm?.image === 'none' ? "../images/default-avt.png" : userPm?.image} /></figure>
                                                                                )
                                                                            }
                                                                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: getUserId?.userId === msg?.userId ? 'flex-end' : 'flex-start' }}>
                                                                                <h5 style={{ fontSize: 11, marginBottom: '1px', marginLeft: '19px', marginRight: '19px' }} href='#' alt=''>{getUserId?.userId === msg?.userId ? '' : msg?.username}</h5>
                                                                                {msg.type === 'pmi' ? (
                                                                                    <p style={{ display: 'inline-flex', marginBottom: '1', wordWrap: 'break-word', overflow: 'hidden' }}>
                                                                                        <img src={getIconSource(msg.content)}></img>
                                                                                    </p>
                                                                                ) : (
                                                                                    <p style={{ display: 'inline-flex', marginBottom: '1', wordWrap: 'break-word', overflow: 'hidden' }}>{msg.content}</p>
                                                                                )}
                                                                            </div>
                                                                        </li>
                                                                    )
                                                                }))
                                                            }
                                                        </ul>
                                                        <div className="message-text-container">
                                                            {/* <div className="more-attachments">
                                                                <i className="icofont-plus" />
                                                            </div> */}
                                                            {/* <div className="attach-options">
                                                                <a href="#" title><i className="icofont-camera" /> Open Camera</a>
                                                                <a href="#" title><i className="icofont-video-cam" /> Photo &amp; video Library</a>
                                                                <a href="#" title><i className="icofont-paper-clip" /> Attach Document</a>
                                                                <a href="#" title><i className="icofont-location-pin" /> Share Location</a>
                                                                <a href="#" title><i className="icofont-contact-add" /> Share Contact</a>
                                                            </div> */}
                                                            <form onSubmit={handleSend} >
                                                                <span className="emojie" onClick={() => setShowIcon(!showIcon)} ><img src="../images/smiles/happy.png" alt /></span>
                                                                <textarea
                                                                    rows={1}
                                                                    placeholder="Nhắn tin"
                                                                    name="message"
                                                                    style={{ width: '91%' }}
                                                                    // style={{ width: '91%' }}
                                                                    value={formData.message}
                                                                    onChange={handleChange}
                                                                    onKeyPress={handleKeyPress}
                                                                />
                                                                {userMsgs.length === 0 ? (
                                                                    <div style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center' }}>
                                                                        <button type='submit' className="button primary circle" style={{ backgroundColor: '#8ab332', width: 120, right: '-28px' }} href="#" title>Say hi! 🖐️</button>
                                                                    </div>
                                                                ) : (
                                                                    <button style={{ right: '-28px' }} title="send" type='submit'><i className="icofont-paper-plane" /></button>
                                                                )}
                                                                <div className={showIcon ? "smiles-bunch active" : "smiles-bunch"}>
                                                                    <i><img onClick={() => sendIcon('1')} src="../images/smiles/angry-1.png" alt /></i>
                                                                    <i><img onClick={() => sendIcon('2')} src="../images/smiles/angry.png" alt /></i>
                                                                    <i><img onClick={() => sendIcon('3')} src="../images/smiles/bored-1.png" alt /></i>
                                                                    <i><img onClick={() => sendIcon('4')} src="../images/smiles/bored-2.png" alt /></i>
                                                                    <i><img onClick={() => sendIcon('5')} src="../images/smiles/bored.png" alt /></i>
                                                                    <i><img onClick={() => sendIcon('6')} src="../images/smiles/confused-1.png" alt /></i>
                                                                    <i><img onClick={() => sendIcon('7')} src="../images/smiles/confused.png" alt /></i>
                                                                    <i><img onClick={() => sendIcon('8')} src="../images/smiles/crying-1.png" alt /></i>
                                                                    <i><img onClick={() => sendIcon('9')} src="../images/smiles/crying.png" alt /></i>
                                                                    <i><img onClick={() => sendIcon('10')} src="../images/smiles/tongue-out.png" alt /></i>
                                                                    <i><img onClick={() => sendIcon('11')} src="../images/smiles/wink.png" alt /></i>
                                                                    <i><img onClick={() => sendIcon('12')} src="../images/smiles/suspicious.png" alt /></i>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {currentRoom ? (<div className="col-lg-4">
                                        <div className="profile-short">
                                            <div className="chating-head" style={{ backgroundColor: '#ddebf3', marginBottom: 10 }}>
                                                <div className="s-left">
                                                    <h5>{currentRoom?.isGroup ? currentRoom?.roomName : userPm?.fullName}</h5>
                                                    <p>Bạn bè</p>
                                                </div>
                                            </div>
                                            <div className="short-intro">
                                                {
                                                    currentRoom?.isGroup ? (
                                                        <figure><img style={{ backgroundColor: 'white', width: 300, height: 300, objectFit: 'hidden', borderRadius: '100%' }} src={(!currentRoom || currentRoom?.image === 'none') ? "../images/default-avt.png" : currentRoom?.image} alt='' sizes='' /></figure>
                                                    ) : (
                                                        <figure><img style={{ backgroundColor: 'white', width: 300, height: 300, objectFit: 'hidden', borderRadius: '100%' }} src={(!userPm || userPm?.image === 'none') ? "../images/default-avt.png" : userPm?.image} alt='' sizes='' /></figure>

                                                    )
                                                }

                                                {currentRoom?.isGroup ? (
                                                    <ul>
                                                        <li>
                                                            <span>Tên nhóm</span>
                                                            <p>{currentRoom?.roomName === 'none' ? '- - -' : currentRoom?.roomName}</p>
                                                        </li>
                                                    </ul>
                                                ) : (
                                                    <ul>
                                                        <li>
                                                            <span>Tên</span>
                                                            <p>{userPm?.fullName === 'none' ? '- - -' : userPm?.fullName}</p>
                                                        </li>
                                                        <li>
                                                            <span>Ngày sinh</span>
                                                            <p>{userPm?.dateOfBirth === 'none' ? '- - -' : userPm?.dateOfBirth}</p>
                                                        </li>
                                                        <li>
                                                            <span>Email</span>
                                                            <p>{userPm?.email === 'none' ? '- - -' : userPm?.email}</p>
                                                        </li>
                                                    </ul>
                                                )}

                                                {/* <button className="button primary circle" style={{ margin: 10, backgroundColor: '#8ab332', width: 120 }} href="#" title>Add friend</button> */}
                                            </div>
                                        </div>
                                    </div>) : (
                                        <p></p>
                                    )}
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
