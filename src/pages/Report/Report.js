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
import {NavLink} from 'react-router-dom'
import {
  CreateAchivementAction,
  DeleteAchivementAction,
  GetListAchivementAction,
  UpdateAchivementAction,
} from "./../../redux/actions/AchivementAction";
import { useDispatch, useSelector } from "react-redux";
import { storage_bucket } from "./../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { GetListReportTypeAction } from "../../redux/actions/ReportTypeAction";
import {
  GetListReportAction,
  GetListReportByTypeAction,
} from "../../redux/actions/ReportAction";
import { SendEmail } from "../../utils/emailService";

export default function Report () {
  const dispatch = useDispatch();
  const { arrReport, arrReportByID } = useSelector(
    (root) => root.ReportReducer
  );

  const { reportType } = useSelector((root) => root.ReportType);

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

  const [op, setOp] = useState("rong");
  const [repo, setRepo] = useState("Chọn loại báo cáo");
  const onInputDropdown = (e) => {
    const selectedValue = e.value; // Corrected access to value
    const selectedLabel = e.label; // Corrected access to label

    // Find information based on the selected value
    const selectedItem = arrReportType.find((item) => item.value === selectedValue);
    if (selectedItem) {
      const selectedId = selectedItem.id; // Corrected access to id

      setRepo(selectedId);
      if (selectedId === 'Lấy tất cả danh sách') {

        setProducts(arrReport);
      } else {

        setOp(e.target.value);
        // setProduct(updatedProduct);
        const action = GetListReportByTypeAction(e.target.value);
        dispatch(action);

      }
    }


  };

  const arrReportType = reportType?.map((item, index) => {
    return {
      label: item.reportTypeName,
      value: item.reportTypeId,
      id: item.reportTypeName
    };
  });
  arrReportType.push({ label: 'Lấy tất cả danh sách', value: 'getall', id: 'Lấy tất cả danh sách' })
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

  const [text, setText] = useState("Gửi báo cáo");
  const [products, setProducts] = useState([]);
  const [text1, setText1] = useState("Chi tiết báo cáo");
  const [products1, setProduct1] = useState([]);
  const [text2, setText2] = useState("Gửi báo cáo");
  const [products2, setProduct2] = useState([]);
  const [productDialog, setProductDialog] = useState(false);
  const [productDialog1, setProductDialog1] = useState(false);
  const [productDialog2, setProductDialog2] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitted1, setSubmitted1] = useState(false);
  const [submitted2, setSubmitted2] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    const action = GetListReportAction();
    dispatch(action);
    const action1 = GetListReportTypeAction();
    dispatch(action1);
  }, []);
  useEffect(() => {
    if (op === "rong") {
      setProducts(arrReport);
    } else {
      setProducts(arrReportByID);
    }
  }, [arrReport, op, arrReportByID]);

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
  const hideDialog1 = () => {
    setSubmitted1(false);
    setProductDialog1(false);
  };
  const hideDialog2 = () => {
    setSubmitted2(false);
    setProductDialog2(false);
  };
  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const saveProduct = async () => {

    setSubmitted(true);
    let _product = { ...product };
    let productItem = { ...product };
    console.log(productItem)
    SendEmail(productItem?.activity?.user?.email, 'Cảnh báo bài viết', `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Thư cảnh báo</title><style>body{font-family:Arial,sans-serif}.container{max-width:600px;margin:0 auto;padding:20px;border:1px solid #ccc;border-radius:5px}.header{background-color:#ff1827;color:#fff;text-align:center;padding:10px}.content{padding:20px}</style></head><body><div class="container"><div class="header"><h1>Thư cảnh báo từ SVCW</h1></div><div class="content"><p>Xin chào ${productItem.user?.fullName},</p><p>Chúng tôi thấy bài viết <span style="font-weight:bold;">${productItem?.activity?.title}</span> bạn có nội dung không phù hợp với cộng đồng trên SVCW!</p><p>Bạn nên chỉnh sửa lại nội dung bài viết cho phù hợp, nếu không bài viết của bạn sẽ bị xóa.</p><p>Chúc bạn có những trải nghiệm của mình trên SVCW!</p><p>Trân trọng,<br>SVCW</p></div></div></body></html>`)
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: `Gửi cảnh báo đến bài viết ${productItem?.activity?.title} thành công`,
      life: 3000,
      options: {
        style: {
          zIndex: 100,
        },
      },
    });
    setProductDialog(false);
  };
  const saveProduct1 = async () => {
    setSubmitted(true);
    let _product = { ...product };
    let productItem = { ...product };
    // SendEmail(productItem?.activity?.user?.email, 'Cảnh báo người dùng', `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Thư cảnh báo</title><style>body{font-family:Arial,sans-serif}.container{max-width:600px;margin:0 auto;padding:20px;border:1px solid #ccc;border-radius:5px}.header{background-color:#ff1827;color:#fff;text-align:center;padding:10px}.content{padding:20px}</style></head><body><div class="container"><div class="header"><h1>Thư cảnh báo từ SVCW</h1></div><div class="content"><p>Xin chào ${productItem.user?.fullName},</p><p>Chúng tôi thấy bài viết <span style="font-weight:bold;">${productItem?.title}</span> bạn có nội dung không phù hợp với cộng đồng trên SVCW!</p><p>Bạn nên chỉnh sửa lại nội dung bài viết cho phù hợp, nếu không bài viết của bạn sẽ bị xóa.</p><p>Chúc bạn có những trải nghiệm của mình trên SVCW!</p><p>Trân trọng,<br>SVCW</p></div></div></body></html>`)
    setProductDialog2(false);
  };
  const editProduct = (product) => {
    setText("Gửi báo cáo");
    setProduct({ ...product });
    setProductDialog(true);
  };
  const editProduct2 = (product) => {
    setText2("Gửi báo cáo");
    setProduct2({ ...product });
    setProductDialog2(true);
  };
  const editProduct1 = (product) => {
    setText1("Chi tiết báo cáo");
    console.log(product)
    setProduct1({ ...product });
    setProductDialog1(true);
  };
  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = async () => {
    const action = await DeleteAchivementAction(product.achivementId);
    await dispatch(action);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: "error",
      summary: "Thành công",
      detail: `Xóa huy hiệu ${product.achivementId} Thành công`,
      life: 3000,
      options: {
        style: {
          zIndex: 100,
        },
      },
    });
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0;i < products.length;i++) {
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

    for (let i = 0;i < 5;i++) {
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
      <form className="flex flex-wrap gap-2">
        <Dropdown
          options={arrReportType}
          id="reportType"
          onChange={(e) => onInputDropdown(e)}
          placeholder={repo}
        />

      </form>
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

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
         <Button
          icon="pi pi-eye"
          rounded
          outlined
          className="mr-2"
          onClick={() => {

            editProduct1(rowData)
          }}
        />
       {op === 'rt006' ?<Button
          icon="pi pi-flag-fill"
          rounded
          outlined
          className="mr-2"
          onClick={() => editProduct2(rowData)}
        /> :  <Button
          icon="pi pi-flag-fill"
          rounded
          outlined
          className="mr-2"
          onClick={() => editProduct(rowData)}
        />}
        {/* <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} /> */}
        {/* <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteProduct(rowData)} /> */}
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
      <h4 className="m-0 mb-3">Quản lý báo cáo</h4>
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
  const productDialogFooter2 = (
    <React.Fragment>
      <Button label="Hủy bỏ" icon="pi pi-times" outlined onClick={hideDialog2} />
      <Button label="Gửi" icon="pi pi-check" onClick={saveProduct1} />
    </React.Fragment>
  );
  const productDialogFooter1 = (
    <React.Fragment>
      <Button label="Đóng" icon="pi pi-times" outlined onClick={hideDialog1} />
    </React.Fragment>
  );
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="Đồng ý"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteProduct}
      />
      <Button
        label="Hủy bỏ"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductDialog}
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
            currentPageReportTemplate="Đang hiển thị {first} đến {last} trong tổng số {totalRecords} báo cáo"
            globalFilter={globalFilter}
            header={header}
          >
            {/* <Column selectionMode="multiple" exportable={false}></Column> */}
            <Column
              field="reportId"
              header="Mã"
              sortable
              style={{ minWidth: "11rem" }}
            ></Column>
            {/* <Column field="reason" header="Lý do" sortable style={{ minWidth: '11rem' }}></Column> */}
            <Column
              field="reason"
              header="Lý do"
              sortable
              style={{ minWidth: "12rem" }}
              body={(rowData) => {
                const maxLength = 50;
                const reason = rowData.reason;
                if (reason.length > maxLength) {
                  return (
                    <span title={reason}>
                      {reason.substring(0, maxLength)}...
                    </span>
                  );
                }

                return reason;
              }}
            ></Column>
            <Column
              field="activity.title"
              header="Bài viết bị báo cáo"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="user.username"
              header="Người báo cáo"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field={(datetime) =>
                moment(datetime.datetime).format("DD/MM/YYYY HH:mm")
              }
              header="Ngày báo cáo"
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
            setText("Gửi báo cáo");
          }}
          header={text}
          modal
          className="p-fluid"
          footer={productDialogFooter}
          onHide={hideDialog}
        >
          <div>Gửi cảnh báo đến bài viết <span style={{ fontWeight: 800 }}>{product?.activity?.title}</span> do vi phạm lỗi <span style={{ fontWeight: 800 }}>{product?.reportType?.reportTypeName}</span></div>
        </Dialog>
        <Dialog
          visible={productDialog1}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          onClick={() => {
            setText1("Chi tiết báo cáo");
          }}
          header={text1}
          modal
          className="p-fluid"
          footer={productDialogFooter1}
          onHide={hideDialog1}
        >
         {op === 'rt006' ? <div><span style={{fontWeight:800}}>Người bị báo cáo :</span>{products1?.activity?.title}</div> :<div><span style={{fontWeight:800}}>Chiến dịch :</span> <NavLink to={`/detail/${products1?.activity?.activityId}`}> {products1?.activity?.title}</NavLink></div>}
         <div><span style={{fontWeight:800}}>Loại báo cáo :</span> {products1?.reportType?.reportTypeName}</div>
         <div><span style={{fontWeight:800}}>Lý do báo cáo :</span> {products1?.reason}</div>
         <div><span style={{fontWeight:800}}>Thời gian :</span> {moment(products1?.datetime).format('DD/MM/YYYY hh:mm A')}</div>
         <div><span style={{fontWeight:800}}>Người báo cáo :</span> {products1?.user?.username}</div>
        </Dialog>
        <Dialog
          visible={productDialog2}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          onClick={() => {
            setText("Gửi báo cáo");
          }}
          header={text}
          modal
          className="p-fluid"
          footer={productDialogFooter2}
          onHide={hideDialog2}
        >
          <div>Gửi cảnh báo đến người dùng <span style={{ fontWeight: 800 }}>dsadsa</span> do vi phạm lỗi <span style={{ fontWeight: 800 }}>dasd</span></div>
        </Dialog>
        <Dialog
          visible={deleteProductDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Thông báo"
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
                Bạn có chắc chắn muốn xóa huy hiệu <b>{product.achivementId}</b>{" "}
                không?
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
    </div>
  );
}
