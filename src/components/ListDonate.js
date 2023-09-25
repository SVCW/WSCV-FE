import moment from "moment";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useRef, useState } from "react";

export default function ListDonate(props) {
  const { handleClickDonate, isDonate, listDonate, popupStyleDonate } = props;
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  useEffect(() => {
    setProducts(listDonate);
  }, [listDonate]);
  
  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
       
        {/* <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} /> */}
      </div>
    );
  };
  const dt = useRef(null);
  const exportCSV = () => {
    dt.current.exportCSV();
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
  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      {/* <h4 className="m-0 mb-3">Quản lý huy hiệu</h4> */}
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
  return (
    <div>
       {isDonate === true ? (
        <div className="post-new-popup" style={popupStyleDonate}>
          <div
            className="popupPost"
            style={{
              width: 1000,
              height: "80vh",
              overflowY: "scroll",
              margin: "1rem",
            }}
          >
            <span className="popup-closed" onClick={handleClickDonate}>
              <i className="icofont-close" />
            </span>
            <div className="popup-meta">
              <div className="popup-head">
                <h5>
                  
                  Danh sách ủng hộdob cho chiến dịch
                </h5>
              </div>
            </div>

            <div className="">
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
            currentPageReportTemplate="Đang hiển thị {first} đến {last} trong tổng số {totalRecords} danh sách ủng hộ"
            globalFilter={globalFilter}
            header={header}
          >
            {/* <Column selectionMode="multiple" exportable={false}></Column> */}
            <Column
              field="email"
              header="Email"
              sortable
              style={{ minWidth: "11rem" }}
            ></Column>
            {/* <Column
              field="achivementLogo"
              header="Hình ảnh"
              body={imageBodyTemplate}
            ></Column> */}
            <Column
              field="amount"
              header="Số tiền"
              sortable
              style={{ minWidth: "12rem" }}
              body={(rowData) => {
                const maxLength = 20;
                const amount = rowData.amount;
                if (amount >0 ) {
                  return (
                    <span title={amount}>
                      {amount.toLocaleString()}
                    </span>
                  );
                }
                return amount;
              }}
            ></Column>
            <Column
              field="phone"
              header="Số điện thoại"
              sortable
              style={{ minWidth: "11rem" }}
            ></Column>
            <Column
              field={(payDate) =>
                moment(payDate.payDate).format("DD/MM/YYYY hh:mm A")
              }
              header="Ngày ủng hộ"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            {/* <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                        <Column field="category" header="Category" sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
            {/* <Column
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: "12rem", marginRight: "100px" }}
            ></Column> */}
          </DataTable>
        </div>
             
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
