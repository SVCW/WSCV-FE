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
import * as Yup from "yup";
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
  DeleteFanpageAction,
  GetListFanpageAction,
  UpdateStatusFanpageAction,
} from "../../redux/actions/FanpageAction";
import { useFormik } from "formik";
import { SendEmail } from "../../utils/emailService";
import { BanUserAction, GetListUserAction, UnBanUserAction } from "../../redux/actions/UserAction";
export default function Volunteer() {
  const dispatch = useDispatch();
  const { arrListUser } = useSelector((root) => root.UserReducer);
  console.log(arrListUser);
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

  const [text, setText] = useState("Thêm mới huy hiệu");
  const [products, setProducts] = useState([]);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductDialog1, setDeleteProductDialog1] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [product1, setProduct1] = useState(emptyProduct);
  const [selectedProducts1, setSelectedProducts1] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    const action = GetListUserAction();
    dispatch(action);
  }, []);

  const [op, setOp] = useState("Active");
  const onInputDropdown = (e, field) => {
    setOp(e.target.value);
    // setProduct(updatedProduct);
  };

  const arrReportType = [
    { value: "Active", label: "Hoạt động" },
    { value: "Banned", label: "Cấm hoạt động" },
  ];
  useEffect(() => {
    const arr = arrListUser?.filter((item) => item.status === op);
    setProducts(arr);
  }, [arrListUser, op]);

  // const formatCurrency = (value) => {

  const formik = useFormik({
    initialValues: {
      description: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });



  const SignupSchema = Yup.object().shape({
    reasonBan: Yup.string().required("Vui lòng điền lý do báo cáo"),
  });
  const fromik1 = useFormik({
    initialValues: {
      userId: "string",
      reasonBan: "",
    },
    enableReinitialize:true,
    validationSchema:SignupSchema,
    onSubmit: (value) => {
      console.log(value);
    },
  });
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
    setSubmitted(true);

    setProductDialog(false);
  };

  const editProduct = (product) => {
    setText("Chỉnh sửa huy hiệu");
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
    const action = await UnBanUserAction(product.userId);
    await dispatch(action);
    // let productItem = { ...product };

    // SendEmail(
    //   productItem.email,
    //   "Tạo mới tổ chức thành công",
    //   `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Chúc Mừng! Tạo Tổ Chức Mới Thành Công trên SVCW</title><style>body{font-family:Arial,sans-serif}.container{max-width:600px;margin:0 auto;padding:20px;border:1px solid #ccc;border-radius:5px}.header{background-color:#18dcff;color:#fff;text-align:center;padding:10px}.content{padding:20px}</style></head><body><div class="container"><div class="header"><h1>Chúc Mừng! Tạo tổ chức mới thành công trên SVCW</h1></div><div class="content"><p>Xin chào,</p><p>Chúc mừng bạn đã tạo thành công Fanpage <span style="font-weight: bold;">${productItem.fanpageName}</span> trên SVCW!</p><p>Chúng tôi rất vui mừng vì bạn đã tham gia vào cộng đồng của chúng tôi. Fanpage của bạn sẽ là nơi bạn có thể chia sẻ thông tin, tương tác với cộng đồng và tạo những trải nghiệm thú vị cho người dùng.</p><p>Đừng ngần ngại bắt đầu đăng bài, chia sẻ thông tin và tạo nội dung thú vị trên tổ chức của bạn. Bạn có thể truy cập vào tài khoản của mình để quản lý và tùy chỉnh Fanpage theo ý muốn.</p> viết phần còn lại ở đây <p>Nếu bạn gặp bất kỳ khó khăn hoặc có câu hỏi, đừng ngần ngại liên hệ với chúng tôi qua địa chỉ hỗ trợ. Chúng tôi sẽ sẵn sàng giúp đỡ bạn.</p><p>Chúc bạn có những trải nghiệm thú vị và thành công trong việc quản lý tổ chức của mình trên SVCW!</p><p>Trân trọng,<br>SVCW</p></div></div></body></html>`
    // );
    setDeleteProductDialog(false);
    // setProduct(emptyProduct);
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: `Tình nguyên viên ${product.username}có thể truy cập hệ thống thành công`,
      life: 3000,
      options: {
        style: {
          zIndex: 100,
        },
      },
    });
  };
  const deleteProduct1 = async () => {
    if(fromik1.values.reasonBan ===""){
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: `Vui lòng điền lý do báo cáo`,
        life: 3000,
        options: {
          style: {
            zIndex: 100,
          },
        },
      });
    }
   else{
    const action = {
      userId: fromik1.values.userId,
      reasonBan: fromik1.values.reasonBan
    }
    const action1 = BanUserAction(action);
    dispatch(action1)
    setDeleteProductDialog1(false);
    
    // console.log(product1.fanpageId);
    // const action = await DeleteFanpageAction(product1.fanpageId);
    // await dispatch(action);
    // let productItem = { ...product1 };

    // SendEmail(
    //   productItem.email,
    //   "Nhóm của bạn đã bị xóa",
    //   `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Chúc Mừng! Tạo Tổ Chức Mới Thành Công trên SVCW</title><style>body{font-family:Arial,sans-serif}.container{max-width:600px;margin:0 auto;padding:20px;border:1px solid #ccc;border-radius:5px}.header{background-color:#18dcff;color:#fff;text-align:center;padding:10px}.content{padding:20px}</style></head><body><div class="container"><div class="header"><h1>Chúc Mừng! Tạo tổ chức mới thành công trên SVCW</h1></div><div class="content"><p>Xin chào,</p><p>Chúc mừng bạn đã tạo thành công Fanpage <span style="font-weight: bold;">${productItem.fanpageName}</span> trên SVCW!</p><p>Chúng tôi rất vui mừng vì bạn đã tham gia vào cộng đồng của chúng tôi. Fanpage của bạn sẽ là nơi bạn có thể chia sẻ thông tin, tương tác với cộng đồng và tạo những trải nghiệm thú vị cho người dùng.</p><p>Đừng ngần ngại bắt đầu đăng bài, chia sẻ thông tin và tạo nội dung thú vị trên tổ chức của bạn. Bạn có thể truy cập vào tài khoản của mình để quản lý và tùy chỉnh Fanpage theo ý muốn.</p> viết phần còn lại ở đây <p>Nếu bạn gặp bất kỳ khó khăn hoặc có câu hỏi, đừng ngần ngại liên hệ với chúng tôi qua địa chỉ hỗ trợ. Chúng tôi sẽ sẵn sàng giúp đỡ bạn.</p><p>Chúc bạn có những trải nghiệm thú vị và thành công trong việc quản lý tổ chức của mình trên SVCW!</p><p>Trân trọng,<br>SVCW</p></div></div></body></html>`
    // );

    // setProduct(emptyProduct);
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: `Xóa tình nguyện viên thành công`,
      life: 3000,
      options: {
        style: {
          zIndex: 100,
        },
      },
    });
   }
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
        src={`${rowData.image}`}
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

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {op !== "Active" ? (
          <Button
            className="mr-2"
            icon="pi pi-pencil"
            rounded
            outlined
            onClick={() => confirmDeleteProduct(rowData)}
          />
        ) : (
          <div></div>
        )}
         {op !== "Banned" ? (
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => {
            confirmDeleteProduct1(rowData)
            fromik1.setFieldValue('userId', rowData.userId)
          } }
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
      <h4 className="m-0 mb-3">Quản lý tình nguyện viên</h4>
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
      <Button label="Hoàn thành" icon="pi pi-check" onClick={saveProduct} />
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
            currentPageReportTemplate="Đang hiển thị {first} đến {last} trong tổng số {totalRecords} tình nguyện viên"
            globalFilter={globalFilter}
            header={header}
          >
            {/* <Column selectionMode="multiple" exportable={false}></Column> */}
            {/* <Column
              field="fanpageId"
              header="Mã"
              sortable
              style={{ minWidth: "11rem" }}
            ></Column> */}
            {/* <Column
              field="fanpageName"
              header="Fanpage"
              sortable
              style={{ minWidth: "12rem" }}
              body={(rowData) => {
                const maxLength = 35;
                const fanpageName = rowData.fanpageName;
                if (fanpageName.length > maxLength) {
                  return (
                    <span title={fanpageName}>
                      {fanpageName.substring(0, maxLength)}...
                    </span>
                  );
                }

                return fanpageName;
              }}
            ></Column> */}
            {/* <Column
              field="image"
              header="Hình ảnh"
              body={imageBodyTemplate}
            ></Column> */}
            {/* <Column field="fanpageName" header="Fanpage" sortable style={{ minWidth: '12rem' }}></Column> */}

            <Column
              field="username"
              header="Tên"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="email"
              header="Email"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field={(createAt) =>
                moment(createAt.createAt).format("DD/MM/YYYY")
              }
              header="Ngày tạo"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
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
            setText("Thêm Mới huy hiệu");
          }}
          header={text}
          modal
          className="p-fluid"
          footer={productDialogFooter}
          onHide={hideDialog}
        >
          <div className="field">
            <label
              htmlFor="name"
              className="font-bold"
              style={{ fontWeight: "bold" }}
            >
              Hình ảnh
            </label>
            <br />
            <div>
              <label htmlFor="img" className="input-preview">
                {/* <input name="img" id="img" className="input-preview__src" style={{ opacity: 0 }} type="file" onChange={(e) => onInputChange(e, 'achivementLogo')} /> */}
                {product?.achivementLogo === "" ? (
                  <div></div>
                ) : (
                  <img
                    src={product.achivementLogo}
                    style={{
                      width: "900px",
                      height: "195px",
                      borderRadius: "5px",
                    }}
                  />
                )}
              </label>
              {submitted && !product.achivementLogo && (
                <small className="p-error">
                  Hình ảnh huy hiệu không được để trống.
                </small>
              )}
            </div>

            <br />
            {/* <input type='file' id="achivementLogo" onChange={(e) => onInputChange(e, 'achivementLogo')} /> */}
          </div>
          <div className="field">
            <label
              htmlFor="description"
              className="font-bold"
              style={{ fontWeight: "bold" }}
            >
              Miêu tả
            </label>
            <InputTextarea
              id="description"
              value={formik.values.description}
              onChange={(e) => onInputChange(e, "description")}
              required
              rows={3}
              cols={20}
            />
            {submitted && !product.description && (
              <small className="p-error">
                Miêu tả huy hiệu không được để trống.
              </small>
            )}
          </div>
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
              <span style={{ fontSize: "18px" }}>
                Bạn muốn tình nguyện viên <b>{product.username}</b> truy cập lại hệ thống?
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
            
            {product1 && (
              <form onSubmit={fromik1.handleSubmit}>
               <div>
               <i
              className="pi pi-exclamation-triangle mr-3 pt-2"
              style={{ fontSize: "2rem" }}
            />
                <span style={{ fontSize: "18px" }}>
                  Bạn muốn xóa tình nguyện viên
                  <b style={{paddingLeft:'5px'}}>{product1.username}</b>?
                </span>
               </div>
                <div style={{ fontSize: "18px" , paddingTop:'10px', fontWeight:700 }}>
                  Lý do
                </div>
                <textarea
                  id="message"
                  className="form-control"
                  rows="2"
                  cols="50"
                  name="reasonBan"
                  onChange={fromik1.handleChange}
                  required
                ></textarea>
                <div className="error" >{formik.errors.reasonBan}</div>
              </form>
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
    </div>
  );
}
