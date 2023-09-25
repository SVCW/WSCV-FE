import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  GetProfileByIdAction,
  UpdateProfileById,
} from '../../redux/actions/ProfileAction';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { storage_bucket } from '../../firebase';
import { http } from '../../utils/reponse';
import moment from 'moment';
import Swal from 'sweetalert2';

const PersonalDetail = ({ setReloadPage, reloadPage, arrActivity }) => {
  const [fullNameError, setFullNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [reloadData, setReloadData] = useState(false);
  const [avatarImage, setAvatarImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const { getUserId } = useSelector((root) => root.ProfileReducer);


  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(true);
  const [info, setInfo] = useState(arrActivity);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      info.fullName === '' ||
      info.fullName === null ||
      info.fullName?.trim() === ''
    ) {
      setFullNameError('Vui lòng không để trống họ và tên');
      return;
    } else {
      setFullNameError('');
    }

    if (phoneError) {
      return;
    }

    if (info.phone === '' || info.phone === null || info.phone?.trim() === '') {
      setPhoneError('Vui lòng không để trống số điện thoại');
      return;
    } else {
      setPhoneError('');
    }

    const payload = info;

    if (avatarImage) {
      try {
        const fileRef = ref(storage_bucket, avatarImage.name);
        const uploadTask = uploadBytesResumable(fileRef, avatarImage);

        uploadTask.on('state_changed', (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // setUploadProgress(progress);
        });

        const snapshot = await uploadTask;

        if (snapshot.state === 'success') {
          const downloadURL = await getDownloadURL(snapshot.ref);
          payload.image = downloadURL;
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (coverImage) {
      try {
        const fileRef = ref(storage_bucket, coverImage.name);
        const uploadTask = uploadBytesResumable(fileRef, coverImage);

        uploadTask.on('state_changed', (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // setUploadProgress(progress);
        });

        const snapshot = await uploadTask;

        if (snapshot.state === 'success') {
          const downloadURL = await getDownloadURL(snapshot.ref);
          payload.coverImage = downloadURL;
        }
      } catch (error) {
        console.log(error);
      }
    }

    const action1 = UpdateProfileById(payload);
    await dispatch(action1);
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'success',
      title: `Chỉnh sửa thông tin thành công`,
    });

    setIsEditing(false);
    setReloadData(!reloadData);
    setReloadPage(!reloadPage);
  };

  // if (!userDetails) return <p>Loading...</p>;

  return (
    <div className="main-wraper">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h5 className="main-title">
          {isEditing ? 'Chỉnh sửa thông tin' : 'Thông tin cá nhân'}
        </h5>
        <div style={{ width: '15%', alignSelf: 'baseline', cursor: 'pointer' }}>
          {!isEditing && (
            <a className="ask-qst" onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </a>
          )}
        </div>
      </div>
      <div className="info-block-list">
        {!isEditing ? (
          <form class="row g-3">
            <div class="col-md-6">
              <label for="validationDefault01" class="form-label">
                Tài khoản
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault01"
                value={info?.username}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault02" class="form-label">
                Họ và tên
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault02"
                value={info?.fullName}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault02" class="form-label">
                Giới tính
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault02"
                value={info?.gender ? 'Nam' : 'Nữ'}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault02" class="form-label">
                Email
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault02"
                value={info?.email}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault02" class="form-label">
                Số điện thoại
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault02"
                value={info?.phone}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault02" class="form-label">
                Sinh nhật
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault02"
                value={moment(info?.dateOfBirth).format('DD/MM/YYYY')}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault02" class="form-label">
                Chiến dịch đã tham gia
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault02"
                value={info?.numberActivityJoin}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault02" class="form-label">
                Chiến dịch hoàn thành
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault02"
                value={info?.numberActivitySuccess}
                readOnly
              />
            </div>
          </form>
        ) : (
          <form class="row g-3" onSubmit={handleSubmit}>
            <div class="col-md-6">
              <label for="validationDefault01" class="form-label">
                Tài khoản
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault01"
                value={info?.username}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault02" class="form-label">
                Họ và tên
              </label>
              <input
                type="text"
                class="form-control"
                id="validationDefault02"
                value={info?.fullName}
                required
                onChange={(e) => {
                  setInfo({
                    ...info,
                    fullName: e.target.value,
                  });
                }}
              />
              {fullNameError && (
                <div style={{ color: 'red' }}>{fullNameError}</div>
              )}
            </div>
            <div class="col-md-6">
              <label for="validationDefault03" class="form-label">
                Giới tính
              </label>
              <select
                class="form-select"
                aria-label="Default select example"
                value={info?.gender ? 'Nam' : 'Nu'}
                onChange={(e) => {
                  setInfo({
                    ...info,
                    gender: e.target.value,
                  });
                }}
              >
                <option value="Nam">Nam</option>
                <option value="Nu">Nữ</option>
              </select>
            </div>
            <div class="col-md-6">
              <label for="validationDefault04" class="form-label">
                Email
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault04"
                value={info?.email}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault05" class="form-label">
                Số điện thoại
              </label>
              <input
                type="text"
                class="form-control"
                id="validationDefault05"
                value={info?.phone}
                onChange={(e) => {
                  const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

                  const phone = e.target.value;
                  // eslint-disable-next-line no-unused-expressions
                  phone.match(regexPhoneNumber)
                    ? setPhoneError('')
                    : setPhoneError('Số điện thoại không đúng định dạng');
                  setInfo({ ...info, phone });
                }}
                required
              />
              {phoneError && <div style={{ color: 'red' }}>{phoneError}</div>}
            </div>
            <div class="col-md-6">
              <label for="validationDefault06" class="form-label">
                Ngày sinh nhật
              </label>
              <input
                type="date"
                class="form-control-plaintext"
                id="validationDefault06"
                value={moment(info?.dateOfBirth).format('YYYY-MM-DD')}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => {


                  const dateOfBirth = e.target.value;

                  setInfo({ ...info, dateOfBirth });
                }}

              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault07" class="form-label">
                Chiến dịch đã tham gia
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault07"
                value={info?.numberActivityJoin}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="validationDefault08" class="form-label">
                Chiến dịch hoàn thành
              </label>
              <input
                type="text"
                class="form-control-plaintext"
                id="validationDefault08"
                value={info?.numberActivitySuccess}
                readOnly
              />
            </div>
            <div class="col-md-6">
              <label for="formFile1" class="form-label">
                Ảnh đại diện
              </label>
              <input
                class="form-control"
                type="file"
                id="formFile1"
                onChange={(e) => {
                  setAvatarImage(e.target.files[0]);
                }}
              />
            </div>
            <div class="col-md-6">
              <label for="formFile2" class="form-label">
                Ảnh bìa
              </label>
              <input
                class="form-control"
                type="file"
                id="formFile2"
                onChange={(e) => {
                  setCoverImage(e.target.files[0]);
                }}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <button className="btn btn-primary" type="submit">
                Chỉnh sửa
              </button>
              <button
                style={{ marginLeft: 10 }}
                className="ask-qst btn btn-danger"
                onClick={() => setIsEditing(false)}
              >
                Huỷ
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PersonalDetail;
