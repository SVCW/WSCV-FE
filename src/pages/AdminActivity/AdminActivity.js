import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import {
  CreateAchivementAction,
  DeleteAchivementAction,
  GetListAchivementAction,
  UpdateAchivementAction,
} from "./../../redux/actions/AchivementAction";
import { useDispatch, useSelector } from "react-redux";
import { storage_bucket } from "./../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  ActiveActivityAction,
  DeleteActivityAction,
  GetListActivityAction,
  RefunActivityAction,
  RejectActivityAction,
} from "../../redux/actions/ActivityAction";
import Swal from "sweetalert2";
import { SendEmail } from "../../utils/emailService";
import Slider from "react-slick";
import { useFormik } from "formik";

export default function AdminActivity() {
  const dispatch = useDispatch();
  const { arrActivity } = useSelector((root) => root.ActivityReducer);
  const [showInput, setShowInput] = useState(true);
  const [id, setID] = useState("abc");
  let counter = 0;
  let emptyProduct = {
    achivementId: counter.toString(),
    achivementLogo: "",
    description: "",
    createAt: moment().format("YYYY-MM-DD"),
    status: true,
  };
  const [isOpenReject, setIsOpenReject] = useState(false);
  const popupStyleCreate = {
    opacity: isOpenReject ? 1 : 0,
    visibility: isOpenReject ? "visible" : "hidden",
    overflow: isOpenReject ? "auto" : "hidden",
  };
  const handleClickCreate = () => {
    setIsOpenReject((prevIsOpen) => !prevIsOpen);
  };
  const formik = useFormik({
    initialValues: {
      activityId: "",
      reasonReject: "",
      username: "",
      email: "",
      title: "",
    },
    onSubmit: async (value) => {
      console.log(value);
      const action = await RejectActivityAction(value);
      dispatch(action);
      setDeleteProductDialog(false);
      setIsOpen(false);
      handleClickCreate();
    },
  });

  const uploadFile = (e) => {
    let file = e.target.files[0];
    let fileRef = ref(storage_bucket, file.name);

    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setShowInput(false);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          const updatedProduct = { ...product, achivementLogo: url }; // Update achivementLogo property in product object
          setProduct(updatedProduct);
        });
      }
    );
  };

  const [text, setText] = useState("Gửi cảnh báo");
  const [products, setProducts] = useState([]);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductDialog1, setDeleteProductDialog1] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [product1, setProduct1] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    const action = GetListActivityAction();
    dispatch(action);
  }, []);

  const [op, setOp] = useState("Active");
  const onInputDropdown = (e, field) => {
    setOp(e.target.value);
    // setProduct(updatedProduct);
  };

  const arrReportType = [
    { value: "Active", label: "Hoạt động" },
    { value: "InActive", label: "Cấm hoạt động" },
    { value: "Pending", label: "Chờ duyệt" },
    { value: "Reject", label: "Từ chối duyệt" },
    { value: "Quit", label: "Ngừng chiến dịch" },
  ];
  useEffect(() => {
    const arr = arrActivity.filter((item) => item.status === op);
    setProducts(arr);
  }, [arrActivity, op]);

  // const formatCurrency = (value) => {
  //     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  // };

  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };
  const hideDeleteProductDialog1 = () => {
    setDeleteProductDialog1(false);
  };
  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const saveProduct = async () => {
    let productItem = { ...product };
    setSubmitted(true);

    SendEmail(
      productItem.user?.email,
      "Cảnh báo bài viết",
      `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Thư cảnh báo</title><style>body{font-family:Arial,sans-serif}.container{max-width:600px;margin:0 auto;padding:20px;border:1px solid #ccc;border-radius:5px}.header{background-color:#ff1827;color:#fff;text-align:center;padding:10px}.content{padding:20px}</style></head><body><div class="container"><div class="header"><h1>Thư cảnh báo từ SVCW</h1></div><div class="content"><p>Xin chào ${productItem.user?.fullName},</p><p>Chúng tôi thấy bài viết <span style="font-weight:bold;">${productItem?.title}</span> bạn có nội dung không phù hợp với cộng đồng trên SVCW!</p><p>Bạn nên chỉnh sửa lại nội dung bài viết cho phù hợp, nếu không bài viết của bạn sẽ bị xóa.</p><p>Chúc bạn có những trải nghiệm của mình trên SVCW!</p><p>Trân trọng,<br>SVCW</p></div></div></body></html>`
    );
    setProductDialog(false);
  };

  const editProduct = (product) => {
    setText("Gửi cảnh báo");
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };
  const confirmDeleteProduct1 = (product) => {
    setProduct1(product);
    setDeleteProductDialog1(true);
  };
  const deleteProduct = async () => {
    console.log(product);
    const email = product.user.email;
    const title = product.title;
    const username = product.user.username;
    const action = await DeleteActivityAction(
      product.activityId,
      email,
      title,
      username
    );
    await dispatch(action);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: `Duyệt chiến dịch ${product.title} thành công`,
      life: 3000,
      options: {
        style: {
          zIndex: 999,
          marginTop: "50px",
        },
      },
    });
  };
  const deleteProduct1 = async () => {
    console.log(product1);
    const action = await RefunActivityAction(product1.activityId);
    await dispatch(action);
    setDeleteProductDialog1(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: `Hoàn tiền cho chiến dịch ${product1.title} thành công`,
      life: 3000,
      options: {
        style: {
          zIndex: 999,
          marginTop: "50px",
        },
      },
    });
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return id;
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = () => {
    let _products = products.filter((val) => !selectedProducts.includes(val));

    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: "Xóa Thành công huy hiệu",
      life: 3000,
    });
  };

  const onCategoryChange = (e) => {
    let _product = { ...product };

    _product["category"] = e.value;
    setProduct(_product);
  };

  const onInputChange = (e, name) => {
    if (name === "achivementLogo") {
      uploadFile(e); // Call uploadFile function when achivementLogo value changes
    }

    const val = (e.target && e.target.value) || "";
    let _product = { ...product };

    _product[`${name}`] = val;

    setProduct(_product);
  };
  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    if (val < 0) {
      // Giá trị nhập vào nhỏ hơn 0
      return; // Hoặc bạn có thể xử lý theo ý muốn khác ở đây
    }
    let _product = { ...product };

    _product[`${name}`] = val;

    setProduct(_product);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Dropdown
          options={arrReportType}
          id="reportType"
          onChange={(e) => onInputDropdown(e, "reportType")}
          value={op}
          placeholder="Chọn trạng thái"
        />
        {/* <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} /> */}
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="Tải xuống"
        icon="pi pi-upload"
        style={{ marginRight: "50px" }}
        className="p-button-help"
        onClick={exportCSV}
      />
    );
  };

  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={`${rowData.achivementLogo}`}
        alt={rowData.image}
        className="shadow-2 border-round"
        style={{ width: "64px" }}
      />
    );
  };

  const priceBodyTemplate = (rowData) => {
    return;
    // return formatCurrency(rowData.price);
  };

  const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.inventoryStatus}
        severity={getSeverity(rowData)}
      ></Tag>
    );
  };
  const [isOpen, setIsOpen] = useState(false);
  const popupStyle9 = {
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? "visible" : "hidden",
    overflow: isOpen ? "auto" : "hidden",
    height: "1000px",
  };
  const handleClick = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };
  const [activity, setActivity] = useState({});
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {op === "Quit" ? (
          <div></div>
        ) : (
          <Button
            icon="pi pi-eye"
            rounded
            outlined
            className="mr-2"
            onClick={() => {
              setIsOpen(true);
              setActivity(rowData);
            }}
          />
        )}
        {/* <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => {
            editProduct(rowData);
          }}
        /> */}
        {op === "InActive" || op === "Quit" || op ==="Pending"? (
          <div></div>
        ) : (
          <Button
            icon="pi pi-trash"
            rounded
            outlined
            severity="danger"
            onClick={() => confirmDeleteProduct(rowData)}
          />
        )}
        {op === "Quit" ? (
          <Button
            icon="pi pi-money-bill"
            rounded
            outlined
            severity="danger"
            onClick={() => confirmDeleteProduct1(rowData)}
          />
        ) : (
          <div></div>
        )}
      </React.Fragment>
    );
  };

  const getSeverity = (product) => {
    switch (product.inventoryStatus) {
      case "INSTOCK":
        return "success";

      case "LOWSTOCK":
        return "warning";

      case "OUTOFSTOCK":
        return "danger";

      default:
        return null;
    }
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0 mb-3">Quản lý chiến dịch</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Tìm kiếm..."
        />
      </span>
    </div>
  );
  const productDialogFooter = (
    <React.Fragment>
      <Button label="Hủy bỏ" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Gửi" icon="pi pi-check" onClick={saveProduct} />
    </React.Fragment>
  );
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="Hủy bỏ"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Đồng ý"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteProduct}
      />
    </React.Fragment>
  );
  const deleteProductDialogFooter1 = (
    <React.Fragment>
      <Button
        label="Hủy bỏ"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductDialog1}
      />
      <Button
        label="Đồng ý"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteProduct1}
      />
    </React.Fragment>
  );
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedProducts}
      />
    </React.Fragment>
  );
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className="app-main__outer" style={{ margin: "20px 30px" }}>
      <div>
        <Toast ref={toast} />
        <div className="card">
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            ref={dt}
            value={products}
            selection={selectedProducts}
            onSelectionChange={(e) => setSelectedProducts(e.value)}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Đang hiển thị {first} đến {last} trong tổng số {totalRecords} chiến dịch"
            globalFilter={globalFilter}
            header={header}
          >
            {/* <Column selectionMode="multiple" exportable={false}></Column> */}
            <Column
              field="activityId"
              header="Mã"
              sortable
              style={{ minWidth: "11rem" }}
            ></Column>
            {/* <Column field="title" header="Tên chiến dịch" sortable style={{ minWidth: '11rem' }}
                        ></Column> */}
            <Column
              field="title"
              header="Tên chiến dịch"
              sortable
              style={{ minWidth: "12rem" }}
              body={(rowData) => {
                const maxLength = 20;
                const title = rowData.title;

                if (title.length > maxLength) {
                  return (
                    <span title={title}>
                      {title.substring(0, maxLength)}...
                    </span>
                  );
                }

                return title;
              }}
            ></Column>
            {/* <Column field="description" header="Chi tiết" sortable style={{ minWidth: '12rem' }}></Column> */}
            <Column
              field="description"
              header="Mô tả"
              sortable
              style={{ minWidth: "12rem" }}
              body={(rowData) => {
                const maxLength = 150;
                const description = rowData.description;

                if (description.length > maxLength) {
                  return (
                    <span title={description}>
                      {description.substring(0, maxLength)}...
                    </span>
                  );
                }

                return description;
              }}
            ></Column>
            <Column
              field={(createAt) =>
                moment(createAt.createAt).format("DD/MM/YYYY")
              }
              header="Bắt đầu"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field={(createAt) =>
                moment(createAt.endDate).format("DD/MM/YYYY")
              }
              header="Kết thúc"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            {/* <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                        <Column field="category" header="Category" sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
            <Column
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: "12rem", marginRight: "100px" }}
            ></Column>
          </DataTable>
        </div>

        <Dialog
          visible={productDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          onClick={() => {
            setText("Gửi cảnh báo");
          }}
          header={text}
          modal
          className="p-fluid"
          footer={productDialogFooter}
          onHide={hideDialog}
        >
          <span>
            Bạn có muốn gửi cảnh báo đến người tạo bài viết{" "}
            <b>{product.title}</b>?
          </span>
        </Dialog>

        <Dialog
          visible={deleteProductDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Thông Báo"
          modal
          footer={deleteProductDialogFooter}
          onHide={hideDeleteProductDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {product && (
              <span>
                Bạn có muốn xóa chiến dịch <b>{product.title}</b>?
              </span>
            )}
          </div>
        </Dialog>
        <Dialog
          visible={deleteProductDialog1}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Thông Báo"
          modal
          footer={deleteProductDialogFooter1}
          onHide={hideDeleteProductDialog1}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {product1 && (
              <span>
                Bạn muốn hoàn tiền cho chiến dịch <b>{product1.title}</b>?
              </span>
            )}
          </div>
        </Dialog>
        <Dialog
          visible={deleteProductsDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Confirm"
          modal
          footer={deleteProductsDialogFooter}
          onHide={hideDeleteProductsDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {product && (
              <span>
                Are you sure you want to delete the selected products?
              </span>
            )}
          </div>
        </Dialog>
      </div>
      {isOpen === true ? (
        <div className="post-new-popup" style={popupStyle9}>
          <div
            className="popupPost"
            style={{
              width: 1300,
              zIndex: 80,
              height: "750px",
              position: "absolute",
              top: "417px",
              left: "880px",
              overflowY: "scroll",
              margin: "1rem",
            }}
          >
            <span className="popup-closed" onClick={handleClick}>
              <i className="icofont-close" />
            </span>
            <div className="popup-meta">
              <div className="popup-head">
                <h5>
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-plus"
                    >
                      <line x1={12} y1={5} x2={12} y2={19} />
                      <line x1={5} y1={12} x2={19} y2={12} />
                    </svg>
                  </i>
                  Chi tiết chiến dịch
                </h5>
              </div>
            </div>

            <div className="">
              <br />
              <form id="survey-form" method="post">
                {/* <div className="row">
                  <div className="col-md-6">
                    <button
                      type="submit"
                      id="submit"
                      className="btn btn-primary btn-block"
                    >
                      Hoàn thành
                    </button>
                  </div>

                </div> */}
                <div style={{ paddingLeft: "30px", position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      right: "20px",
                      marginBottom: "20px",
                      display: "flex",
                    }}
                  >
                    <div style={{ marginRight: "20px" }}>
                      {op === "Active" || op === "InActive" ? (
                        <div></div>
                      ) : (
                        <div
                          style={{
                            cursor: "pointer",
                            border: "none",
                            padding: "8px 20px",
                            background: "#3f6ad8",
                            color: "white",
                            borderRadius: "5px",
                          }}
                          onClick={async () => {
                            const action = await ActiveActivityAction(
                              activity?.activityId,
                              activity?.user?.email,
                              activity?.user?.username,
                              activity?.title
                            );
                            dispatch(action);

                            setIsOpen(false);
                          }}
                        >
                          Duyệt
                        </div>
                      )}
                      {op === "InActive" ? (
                        <div
                          style={{
                            cursor: "pointer",
                            border: "none",
                            padding: "8px 20px",
                            background: "#3f6ad8",
                            color: "white",
                            borderRadius: "5px",
                          }}
                          onClick={async () => {
                            const action = await ActiveActivityAction(
                              activity?.activityId,
                              activity?.user?.email,
                              activity?.user?.username,
                              activity?.title
                            );
                            dispatch(action);

                            setIsOpen(false);
                          }}
                        >
                          Hoạt động
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                    <div>
                      {op === "Active" ||
                      op === "Reject" ||
                      op === "InActive" ? (
                        <div></div>
                      ) : (
                        <div
                          style={{
                            cursor: "pointer",
                            border: "none",
                            padding: "8px 20px",
                            background: "red",
                            color: "white",
                            borderRadius: "5px",
                          }}
                          onClick={async () => {
                            formik.setFieldValue(
                              "activityId",
                              activity?.activityId
                            );
                            formik.setFieldValue(
                              "email",
                              activity?.user?.email
                            );
                            formik.setFieldValue(
                              "username",
                              activity?.user?.username
                            );
                            formik.setFieldValue("title", activity?.title);
                            handleClickCreate();
                          }}
                        >
                          Từ chối
                        </div>
                      )}
                    </div>
                  </div>
                  <h2
                    style={{
                      color: "#3f6ad8",
                      textAlign: "center",
                      padding: "50px 0",
                    }}
                  >
                    {activity?.title}
                  </h2>
                  <p
                    style={{
                      fontSize: "18px",
                      marginBottom: "30px",
                      marginLeft: "200px",
                      width: "800px",
                    }}
                  >
                    {activity?.description}
                  </p>
                  <div
                    style={{
                      textAlign: "center",
                      width: "800px",
                      marginLeft: "200px",
                    }}
                  >
                    <Slider {...settings} style={{ height: "500px" }}>
                      {activity.media?.map((item, index) => {
                        return (
                          <div style={{ textAlign: "center" }}>
                            <img
                              src={item.linkMedia}
                              width={800}
                              height={500}
                            />
                          </div>
                        );
                      })}
                    </Slider>
                  </div>
                  <div
                    style={{
                      paddingLeft: "200px",
                      marginTop: "40px",
                      paddingBottom: "100px",
                    }}
                  >
                    <p style={{ fontWeight: 800 }}>
                      Bắt đầu :{" "}
                      {moment(activity?.startDate).format("DD/MM/YYYY")}
                    </p>
                    <p style={{ fontWeight: 800 }}>
                      Kết thúc :{" "}
                      {moment(activity?.endDate).format("DD/MM/YYYY")}
                    </p>
                    {/* <p style={{ fontWeight: 800 }}>Hoạt động :</p> */}
                    <div style={{ width: "800px" }}>
                      <Slider {...settings}>
                        {activity.process?.map((item, index) => {
                          return (
                            <div style={{ textAlign: "center" }} key={index}>
                              <p style={{ fontWeight: 800 }}>
                                Hoạt động : {item.processNo}
                              </p>
                              <p style={{ fontSize: "20px", color: "#3f6ad8" }}>
                                {item.processTitle}
                              </p>
                              <p>- {item.description}</p>
                              <div style={{ width: "800px", height: "400px" }}>
                                <Slider {...settings}>
                                  {item.media?.map((item1, index) => {
                                    return (
                                      <img
                                        src={item1.linkMedia}
                                        width={800}
                                        height={400}
                                      />
                                    );
                                  })}
                                </Slider>
                              </div>
                              {item.isParticipant ? (
                                <div
                                  style={{
                                    fontSize: "20px",
                                    color: "black",
                                    fontWeight: 400,
                                    display: "flex",
                                    paddingBottom: "20px",
                                  }}
                                >
                                  <div>
                                    {item.isParticipant ? (
                                      <div> - Kêu gọi người tham gia :</div>
                                    ) : (
                                      <div></div>
                                    )}
                                  </div>
                                  <div style={{ marginLeft: "5px" }}>
                                    {item.targetParticipant !== 0 ? (
                                      <div style={{ fontWeight: 600 }}>
                                        {" "}
                                        {item.targetParticipant.toLocaleString()}{" "}
                                        người
                                      </div>
                                    ) : (
                                      <div></div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div></div>
                              )}
                              {item.isDonateProcess ? (
                                <div
                                  style={{
                                    fontSize: "20px",
                                    color: "black",
                                    fontWeight: 400,
                                    display: "flex",
                                    paddingBottom: "20px",
                                  }}
                                >
                                  <div>
                                    {item.isDonateProcess ? (
                                      <div> - Kêu gọi quyên góp :</div>
                                    ) : (
                                      <div></div>
                                    )}
                                  </div>
                                  <div style={{ marginLeft: "5px" }}>
                                    {item.targetDonation !== 0 ? (
                                      <div style={{ fontWeight: 600 }}>
                                        {" "}
                                        {item.targetDonation.toLocaleString()}{" "}
                                        vnđ
                                      </div>
                                    ) : (
                                      <div></div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div></div>
                              )}
                              <div
                                style={{
                                  fontSize: "20px",
                                  color: "black",
                                  fontWeight: 400,
                                }}
                              >
                                - Địa điểm :{" "}
                                <span style={{ fontWeight: 600 }}>
                                  {item.location}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </Slider>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {isOpenReject === true ? (
        <div className="post-new-popup" style={popupStyleCreate}>
          <div
            className="popup"
            style={{ width: 800, zIndex: 80, marginTop: "-50px" }}
          >
            <span className="popup-closed" onClick={handleClickCreate}>
              <i className="icofont-close" />
            </span>
            <div className="popup-meta">
              <div className="popup-head">
                <h5>
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-plus"
                    >
                      <line x1={12} y1={5} x2={12} y2={19} />
                      <line x1={5} y1={12} x2={19} y2={12} />
                    </svg>
                  </i>
                  Từ chối chiến dịch
                </h5>
              </div>
            </div>

            <div style={{ padding: "40px 0" }}>
              <form onSubmit={formik.handleSubmit}>
                <div className="form row mt-3">
                  <div className="form-group">
                    <label>Lý do</label>
                    <textarea
                      id="message"
                      className="form-control"
                      rows="2"
                      cols="50"
                      name="reasonReject"
                      onChange={formik.handleChange}
                    ></textarea>
                  </div>

                  <div className="row" style={{}}>
                    <div className="col-md-4">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                      >
                        Gửi lý do
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
