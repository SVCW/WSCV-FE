import React, { useEffect, useRef, useState } from 'react'
import { Timestamp, addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, updateDoc, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useSelector } from 'react-redux';
import { getListOfUsers } from '../../redux/actions/UserAction';
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
    // const [iconToSend, setIconToSend] = useState('');
    const [userRooms, setUserRooms] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [userFriends, setUserFriends] = useState([]);
    // const [userRoomIds, setUserRoomIds] = useState([]);
    // const [currentRoomId, setCurrentRoomId] = useState();
    const [userMsgs, setUserMsgs] = useState([]);

    const [formData, setFormData] = useState({
        message: ''
    })
    const messagesRef = collection(firestore, "messages");
    const chatRoomsRef = collection(firestore, "chatRooms");
    // const allUserRoomsRef = query(chatRoomsRef,
    //     where('memberIds', 'array-contains', getUserId?.userId),
    //     orderBy('lastSeen', 'asc'));

    // play noti sound
    const notificationSound = document.getElementById('newMessageSound');
    function playNotificationSound() {
        if (notificationSound) {
            notificationSound.play();
        }
    }
    // const scrollToBottom = () => {
    //     if (lastChatRef.current) {
    //         lastChatRef.current.scrollIntoView({ behavior: 'smooth' });
    //     }
    // };

    const scrollToBottom = () => {
        const chatArea = document.querySelector(".chatting-area");
        if (chatArea) {
            chatArea.scrollTop = chatArea.scrollHeight;
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
            // console.log(timestampToCheck.toMillis(), '    ', currentTimestamp)
            return currentTimestamp - timestampToCheck.toMillis() <= fifteenMinutesInSeconds;
        }
    }

    function formatName(inputString) {
        if (!inputString) {
            return;
        }
        const words = inputString?.split(' '); // Split the input string into an array of words
        if (words.length >= 2) {
            // Check if there are at least two words
            const lastTwoWords = words.slice(-2); // Get the last two words
            return lastTwoWords.join(' '); // Join them back into a string
        } else if (words.length === 1) {
            // If there's only one word, return it
            return words[0];
        } else {
            // If the input is empty or has no words, return an empty string
            return '';
        }
    }

    // function formatLastSeen(timestamp, lastMess) {
    //     const str = lastMess ? 'Message' : 'Seen';
    //     // Get the current date and time
    //     const currentDate = new Date();
    //     // Get the Firestore Timestamp as a Date object
    //     if (timestamp instanceof Timestamp) {
    //         const timestampDate = timestamp.toDate()
    //         if (
    //             currentDate.getDate() === timestampDate.getDate() &&
    //             currentDate.getMonth() === timestampDate.getMonth() &&
    //             currentDate.getFullYear() === timestampDate.getFullYear()
    //         ) {
    //             // Format as "Last Seen On Today At HH:mm"
    //             const hours = timestampDate.getHours().toString().padStart(2, '0');
    //             const minutes = timestampDate.getMinutes().toString().padStart(2, '0');
    //             return `Last ${str} On Today At ${hours}:${minutes}`;
    //         } else {
    //             // Format as "Last Seen On DD Month YYYY At HH:mm"
    //             const day = timestampDate.getDate().toString().padStart(2, '0');
    //             const monthNames = [
    //                 'January', 'February', 'March', 'April',
    //                 'May', 'June', 'July', 'August',
    //                 'September', 'October', 'November', 'December'
    //             ];
    //             const month = monthNames[timestampDate.getMonth()];
    //             const year = timestampDate.getFullYear();
    //             const hours = timestampDate.getHours().toString().padStart(2, '0');
    //             const minutes = timestampDate.getMinutes().toString().padStart(2, '0');
    //             return `Last ${str} On ${day} ${month} ${year} At ${hours}:${minutes}`;
    //         }
    //     }


    //     // Check if the timestamp is from today

    // }

    function formatLastSeen(timestamp, lastMess) {
        // Get the Firestore Timestamp as a Date object
        if (timestamp instanceof Timestamp) {
            const timestampDate = timestamp.toDate();
            const currentDate = new Date();

            const dayOfWeek = ["CN", "TH 2", "TH 3", "TH 4", "TH 5", "TH 6", "TH 7"];
            const day = dayOfWeek[timestampDate.getDay()];
            const hours = timestampDate.getHours().toString().padStart(2, '0');
            const minutes = timestampDate.getMinutes().toString().padStart(2, '0');

            if (
                currentDate.getDate() === timestampDate.getDate() &&
                currentDate.getMonth() === timestampDate.getMonth() &&
                currentDate.getFullYear() === timestampDate.getFullYear()
            ) {
                // Nếu là cùng ngày
                return `${hours}:${minutes}`;
            } else {
                // Nếu không phải cùng ngày
                const day = timestampDate.getDate().toString().padStart(2, '0');
                const monthNames = [
                    'THG 1', 'THG 2', 'THG 3', 'THG 4',
                    'THG 5', 'THG 6', 'THG 7', 'THG 8',
                    'THG 9', 'THG 10', 'THG 11', 'THG 12'
                ];
                const month = monthNames[timestampDate.getMonth()];
                const year = timestampDate.getFullYear();
                return `${day} ${month} ${year} LÚC ${hours}:${minutes}`;
            }
        }
        // Nếu không phải Firestore Timestamp
        return ''; // Trả về chuỗi rỗng hoặc thông báo lỗi tùy theo trường hợp
    }


    async function newPmRoom(pmUsr, type) {
        const currentUsr = await getUserInfo(getUserId?.userId);
        const room = await addDoc(chatRoomsRef, {
            type: type,
            memberIds: [pmUsr.userId, currentUsr?.userId],
            members: [pmUsr, currentUsr],
            createdAt: serverTimestamp(),
            lastSeen: serverTimestamp(),
        })
        // setUserPm(userPm.data());
        return room.id;
    }

    async function setUpCurrentRoom(room) {
        // if ((currentRoom?.id === room?.id) || !currentRoom || !room) {
        //     return;
        // }
        if (room.type === 'pm') {
            const members = room.members;
            if (members instanceof Array) {
                members.map((mem) => {
                    if (mem.userId !== getUserId.userId) {
                        setUserPm(mem);
                    }
                })

            }
        }
        if (room.type === 'gr') {
            const listMemIds = room.memberIds;

            if (listMemIds instanceof Array && listMemIds.length > 0) {
                const listMems = await getListOfUsers(listMemIds);
                if (listMems instanceof Array) room.members = listMems
            }
        }
        setNoRoom(false);
        setCurrentRoom(room);
    }

    // classify rooms
    useEffect(() => {
        if (userRooms instanceof Array && userRooms.length < 1) {
            setNoRoom(true);
            return;
        }
        const groups = [];
        const friends = [];
        userRooms.forEach(room => {
            if (room.isGroup) {
                groups.push(room);
            } else {
                friends.push(room);
            }
        })
        setUserGroups(groups);
        setUserFriends(friends);
    }, [userRooms])

    function theOtherChatter(members, chatterId) {
        if (members instanceof Array && members.length === 2) {
            return members.find(mem => mem.userId !== chatterId);
        }
        return undefined
    }
    async function getUserInfo(userId) {
        if (userId) {
            const users = await getListOfUsers([userId]);
            if (users instanceof Array && users.length > 0) {
                const user = users[0];
                if (user === null) {
                    return undefined
                }
                return {
                    dateOfBirth: user.dateOfBirth,
                    email: user.email,
                    fullName: user.fullName,
                    gender: user.gender,
                    image: user.image,
                    phone: user.phone,
                    roleId: user.roleId,
                    userId: user.userId,
                    username: user.username,
                };
            }
        }
        return undefined;
    }
    useEffect(() => {


        async function loadUserRooms(userId) {
            if (!userId) {
                return;
            }

            const ct = await getUserInfo(getUserId?.userId)
            setChatter(ct);
            console.log('ct:', ct);

            //get all room first
            const allRoomsRef = query(chatRoomsRef,
                where('memberIds', 'array-contains', userId),
                orderBy('lastSeen', 'desc'));
            const allUserRooms = await getDocs(allRoomsRef);
            //if have room
            if (allUserRooms.empty) {
                if (id) {
                    // const existUser = await getDoc(doc(firestore, 'users', id));
                    const existUser = await getUserInfo(id);
                    if (existUser) {
                        // create new PM Room ID for this user to the url userId
                        const createdRoomId = await newPmRoom(existUser, 'pm')
                        if (createdRoomId) {
                            const newRoom = await getDoc(doc(firestore, 'chatRooms', createdRoomId))
                            if (newRoom.exists()) {
                                const cookedRoom = {
                                    ...newRoom.data(),
                                    id: newRoom.id,
                                    pmUserId: existUser.userId,
                                    image: existUser.image,
                                    roomName: existUser.fullName,
                                    dateOfBirth: existUser.dateOfBirth,
                                    email: existUser.email,
                                }
                                setUserRooms([cookedRoom]);
                                setUpCurrentRoom(cookedRoom);
                                return;
                            }
                        }
                    } else {
                        setNoRoom(true);
                        return;
                    }
                }

            }


            // cook listData cho phu hop voi user dang login
            const listData = allUserRooms.docs.map(room => {
                if (room.data().type === 'pm') {
                    const theOther = theOtherChatter(room.data().members, getUserId?.userId);
                    if (theOther) {
                        const roomName = theOther?.fullName;
                        const dateOfBirth = theOther?.dateOfBirth;
                        const email = theOther?.email;

                        return {
                            ...room.data(),
                            id: room.id,
                            pmUserId: theOther.userId,
                            image: theOther.image,
                            roomName: roomName,
                            dateOfBirth: dateOfBirth,
                            email: email,
                        }
                    }
                }
                if (room.data().type === 'gr') {
                    return {
                        ...room.data(),
                        isGroup: true,
                        id: room.id
                    }
                }
                if (room.data().type === 'self') {
                    return {
                        ...room.data(),
                        id: room.id,
                        roomName: getUserId?.fullName,
                        dateOfBirth: getUserId?.dateOfBirth,
                        email: getUserId?.email,
                    }
                }
                return {
                    ...room.data(),
                    id: room.id
                }
            });

            const inboxUser = await getUserInfo(id);
            if (inboxUser && !listData.find(room => room.pmUserId === inboxUser.userId)) {
                const newIbRoomId = await newPmRoom(inboxUser, 'pm');
                if (newIbRoomId) {
                    const newIbRoom = await getDoc(doc(firestore, 'chatRooms', newIbRoomId))
                    if (newIbRoom.exists()) {
                        listData.push({
                            ...newIbRoom.data(),
                            id: newIbRoom.id,
                            pmUserId: inboxUser.userId,
                            image: inboxUser.image,
                            roomName: inboxUser.fullName,
                            dateOfBirth: inboxUser.dateOfBirth,
                            email: inboxUser.email,
                        })
                        setUserRooms(listData);
                        setUpCurrentRoom({
                            ...newIbRoom.data(),
                            id: newIbRoom.id,
                            pmUserId: inboxUser.userId,
                            image: inboxUser.image,
                            roomName: inboxUser.fullName,
                            dateOfBirth: inboxUser.dateOfBirth,
                            email: inboxUser.email,
                        });
                        return;
                    }
                }
            }


            setUserRooms(listData);

            // load default room
            if (id && id !== 'default') {
                const roomById = listData.find(room => room.id === id);
                if (roomById) {
                    setUpCurrentRoom(roomById);
                }
                const roomByPmUserId = listData.find(room => room.pmUserId === id)
                if (roomByPmUserId) {
                    setUpCurrentRoom(roomByPmUserId);
                }
            }
            setUpCurrentRoom(listData[0]);
        }

        // === Flow here
        console.log('getUserId: ', getUserId);
        loadUserRooms(getUserId?.userId);

        const allUserRoomsRef = query(chatRoomsRef,
            where('memberIds', 'array-contains', getUserId?.userId),
            orderBy('lastSeen', 'desc'));
        const unSubUserRooms = onSnapshot(allUserRoomsRef, (snapshot) => {
            const data = snapshot.docs.map(room => {
                if (room.data().type === 'pm') {
                    const theOther = theOtherChatter(room.data().members, getUserId?.userId);
                    if (theOther) {
                        const roomName = theOther?.fullName;
                        const dateOfBirth = theOther?.dateOfBirth;
                        const email = theOther?.email;

                        return {
                            ...room.data(),
                            id: room.id,
                            pmUserId: theOther.userId,
                            image: theOther.image,
                            roomName: roomName,
                            dateOfBirth: dateOfBirth,
                            email: email,
                        }
                    }
                }
                if (room.data().type === 'gr') {
                    return {
                        ...room.data(),
                        isGroup: true,
                        id: room.id
                    }
                }
                if (room.data().type === 'self') {
                    return {
                        ...room.data(),
                        id: room.id,
                        roomName: getUserId?.fullName,
                        dateOfBirth: getUserId?.dateOfBirth,
                        email: getUserId?.email,
                    }
                }
                return {
                    ...room.data(),
                    id: room.id
                }
            });
            setUserRooms(data);
        });
    }, [])

    useEffect(() => {
        if (!currentRoom) return;
        console.log('Current chat Room: ', currentRoom);
        // setUserPm();
        const unTrackRoom = onSnapshot(query(messagesRef,
            // where('roomId', 'in', currentRoom.id),
            orderBy('timestamp', 'asc')), (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        // playNotificationSound();
                        // console.log("New message: ", change.doc.data());
                    }
                    if (change.type === "modified") {
                        console.log("Modified massage: ", change.doc.data());
                    }
                    if (change.type === "removed") {
                        console.log("Removed message: ", change.doc.data());
                    }

                    const data = snapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    })).filter(message => message.roomId === currentRoom?.id);
                    // message image process
                    // if (currentRoom.type === 'gr') {
                    const members = currentRoom.members;
                    if (members instanceof Array && members.length > 0) {
                        data.map(message => {
                            message.user = members.find(mem => mem.userId === message.userId);
                        })
                    }
                    // }


                    if (data.length !== userMsgs.length) {
                        // console.log('Chat room message:', data);
                        setUserMsgs(data);
                    }
                })

            });
    }, [currentRoom])

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
                    fullName: chatter?.fullName,
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
                content: (userMsgs.length === 0 && (!formData.message || formData.message === '')) ? 'Xin chào! 🖐️' : formData.message,
                roomId: currentRoom?.id,
                username: getUserId?.username,
                userId: getUserId?.userId,
                user: getUserId,
                timestamp: serverTimestamp(),
            });
            playNotificationSound();
            setFormData({ message: '' })
            console.log("Document written with ID: ", message.id);

            await updateDoc(doc(firestore, 'chatRooms', currentRoom?.id), {
                lastSeen: serverTimestamp()
            })
        } catch (e) {
            alert('It look like you have no any chat room.\nLet find a Volunteer and staring a chat!')
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

                                                {/* <h3 className="main-title">Groups</h3>
                                                <div className="message-header">
                                                    {
                                                        userGroups.length === 0 ? (
                                                            <p style={{ textAlign: 'center' }}>No groups</p>
                                                        ) : (userGroups.map((gr, index) => {
                                                            // const isLastMessage = index === userMsgs.length - 1;
                                                            return (
                                                                <div className={gr?.id === currentRoom?.id ? 'useravatar active' : 'useravatar'} onClick={() => setUpCurrentRoom(gr)}>
                                                                    <img
                                                                        style={{ backgroundColor: 'white', width: 35, height: 35, objectFit: 'hidden', borderRadius: '100%' }}
                                                                        src={gr?.image === 'none' ? "../images/default-avt.png" : gr.image} alt />
                                                                    <span>{formatName(gr.roomName)}</span>
                                                                    <div className={"status " + isActive(gr?.lastSeen) ? 'online' : 'offline'} />
                                                                </div>
                                                            )
                                                        }))
                                                    }
                                                </div> */}

                                                <h3 className="main-title">Đoạn Chat</h3>
                                                <div className="message-header">
                                                    {
                                                        userFriends.length === 0 ? (
                                                            <p style={{ textAlign: 'center' }}>Bạn chưa có cuộc hội thoại nào</p>
                                                        ) : (userFriends.map((fr, index) => {
                                                            return (
                                                                <div className={fr?.id === currentRoom?.id ? 'useravatar active' : 'useravatar'} onClick={() => setUpCurrentRoom(fr)}>
                                                                    <img
                                                                        style={{ backgroundColor: 'white', width: 35, height: 35, objectFit: 'hidden', borderRadius: '100%' }}
                                                                        src={fr?.image === 'none' ? "../images/default-avt.png" : fr.image} alt />
                                                                    <span>{formatName(fr.roomName)}</span>

                                                                    <div className={isActive(fr?.lastSeen) ? 'status online' : 'status offline'} />
                                                                </div>
                                                            )
                                                        }))
                                                    }
                                                </div>

                                                <div className="message-content">
                                                    <div className="chat-header">
                                                        {/* <div className="status online" /> */}
                                                        {userMsgs.length > 0 ? (<h6>{formatLastSeen(userPm?.lastSeen)}</h6>) : (<></>)}
                                                        {/* <div className="corss">
                                                            <span className="report"><i className="icofont-flag" /></span>
                                                            <span className="options"><i className="icofont-brand-flikr" /></span>
                                                        </div> */}
                                                    </div>
                                                    {/* message */}
                                                    <div className="chat-content">
                                                        {userMsgs.length > 0 ? (<div className="date">{formatLastSeen(currentRoom?.lastSeen, true)}</div>) : (<></>)}
                                                        <div className="chatting-container">
                                                            <ul className="chatting-area ">
                                                                {
                                                                    userMsgs.length === 0 ? noRoom ? (
                                                                        <p style={{ textAlign: 'center' }}>Tips! Vào trang cá nhân và chọn "Gửi tin nhắn" để bắt đầu trò chuyện</p>
                                                                    ) : (
                                                                        <p style={{ textAlign: 'center' }}>Hãy gửi lời chào đến bạn mới!</p>
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
                                                                                            alt={'Avatar'} src={currentRoom?.image === 'none' ? "../images/default-avt.png" : currentRoom?.image} /></figure>
                                                                                    )
                                                                                }
                                                                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: getUserId?.userId === msg?.userId ? 'flex-end' : 'flex-start' }}>
                                                                                    <h5 style={{ fontSize: 11, marginBottom: '1px', marginLeft: '19px', marginRight: '19px' }} href='#' alt=''>{getUserId?.userId === msg?.userId ? '' : msg?.fullName ? msg?.fullName : msg?.username}</h5>
                                                                                    {
                                                                                        msg.type === 'pmi' ? (
                                                                                            //Icon
                                                                                            <p style={{ display: 'inline-flex', marginBottom: '1', wordWrap: 'break-word', overflow: 'hidden' }}>
                                                                                                <img src={getIconSource(msg.content)}></img>
                                                                                            </p>
                                                                                        ) : (
                                                                                            //Text
                                                                                            <p style={{ display: 'inline-flex', marginBottom: '1', wordWrap: 'break-word', overflow: 'hidden' }}>{msg.content}</p>
                                                                                        )
                                                                                    }
                                                                                </div>
                                                                            </li>
                                                                        )
                                                                    }))
                                                                }
                                                            </ul>
                                                        </div>

                                                        {noRoom ? (<></>) :
                                                            (
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
                                                                            style={{
                                                                                width: '91%',
                                                                                lineHeight: 'normal',
                                                                                borderRadius: '0.5rem',
                                                                                paddingTop: '25px',
                                                                                paddingBottom: '5px',
                                                                                overflow: 'inherit',
                                                                                height: '40px'
                                                                            }}
                                                                            // style={{ width: '91%' }}
                                                                            value={formData.message}
                                                                            onChange={handleChange}
                                                                            onKeyPress={handleKeyPress}
                                                                        />
                                                                        {userMsgs.length === 0 ? (
                                                                            <div style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center' }}>
                                                                                <button type='submit' className="button primary circle" style={{ backgroundColor: '#8ab332', width: 140, right: '-28px' }} href="#" title>Xin Chào! 🖐️</button>
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
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {currentRoom ? (<div className="col-lg-4">
                                        <div className="profile-short">
                                            <div className="chating-head" style={{ backgroundColor: '#ddebf3', marginBottom: 10 }}>
                                                <div className="s-left">
                                                    <h5>{currentRoom?.roomName}</h5>
                                                    <p>{currentRoom?.type === 'gr' ? 'Nhóm' : 'Người tình nguyện'}</p>
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
                                                            <p>{currentRoom?.roomName === 'none' ? '- - -' : currentRoom?.roomName}</p>
                                                        </li>
                                                        <li>
                                                            <span>Ngày sinh</span>
                                                            <p>{currentRoom?.dateOfBirth === 'none' ? '- - -' : currentRoom?.dateOfBirth}</p>
                                                        </li>
                                                        <li>
                                                            <span>Email</span>
                                                            <p>{currentRoom?.email === 'none' ? '- - -' : currentRoom?.email}</p>
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
