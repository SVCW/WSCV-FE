import moment from "moment";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useRef, useState } from "react";

export default function ListFollowJoin(props) {
  const {
    handleClickFolowJoin,
    isFolowJoin,
    listFolowJoin,
    popupStyleFolowJoin,
    listJoinFollow
  } = props;
  const [products, setProducts] = useState([]);
  const [products1, setProducts1] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [selectedProducts1, setSelectedProducts1] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [globalFilter1, setGlobalFilter1] = useState(null);
  useEffect(() => {
    setProducts(listFolowJoin);
    setProducts1(listJoinFollow)
  }, [listFolowJoin,listJoinFollow]);


  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {/* <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} /> */}
        <h4>Danh sách theo dõi chiến dịch</h4>
      </div>
    );
  };
  const leftToolbarTemplate1 = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {/* <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} /> */}
        <h4>Danh sách tham gia chiến dịch</h4>
      </div>
    );
  };
  const dt = useRef(null);
  const dt1 = useRef(null);
  const exportCSV = () => {
    dt.current.exportCSV();
  };
  const exportCSV1 = () => {
    dt1.current.exportCSV();
  };
  const rightToolbarTemplate = () => {
    return (
      <Button
        label="Tải xuống"
        icon="pi pi-upload"
        style={{ marginRight: "50px" ,background:'#088dcd', border:'none'}}
        className="p-button-help"
        onClick={exportCSV}
      />
    );
  };
  const rightToolbarTemplate1 = () => {
    return (
      <Button
        label="Tải xuống"
        icon="pi pi-upload"
        style={{ marginRight: "50px" ,background:'#088dcd', border:'none'}}
        className="p-button-help"
        onClick={exportCSV1}
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
  const header1 = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      {/* <h4 className="m-0 mb-3">Quản lý huy hiệu</h4> */}
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter1(e.target.value)}
          placeholder="Tìm kiếm..."
        />
      </span>
    </div>
  );
  return (
    <div>
      {isFolowJoin === true ? (
        <div className="post-new-popup" style={popupStyleFolowJoin}>
          <div
            className="popupPost"
            style={{
              width: 1000,
              height: "80vh",
              overflowY: "scroll",
              margin: "1rem",
            }}
          >
            <span className="popup-closed" onClick={handleClickFolowJoin}>
              <i className="icofont-close" />
            </span>
            <div className="popup-meta">
              <div className="popup-head">
                <h5>Danh sách tham gia, theo dõi chiến dịch</h5>
              </div>
            </div>
            <ul className="nav nav-tabs about-btn" style={{ margin: "20px 0" }}>
              <li className="nav-item">
                <a className="active" href="#follow" data-toggle="tab">
                  Theo dõi
                </a>
              </li>
              <li className="nav-item">
                <a className href="#join" data-toggle="tab">
                  Tham gia
                </a>
              </li>
            </ul>
            <div className="row">
              <div className="col-lg-12">
                <div className="tab-content">
                  <div className="card tab-pane active fade show " id="follow">
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
                      currentPageReportTemplate="Đang hiển thị {first} đến {last} trong tổng số {totalRecords} người theo dõi"
                      globalFilter={globalFilter}
                      header={header}
                    >   
                      <Column
                        field="user.email"
                        header="Email"
                        sortable
                        style={{ minWidth: "11rem" }}
                      ></Column>
                    
                      <Column
                        field="user.username"
                        header="Họ tên"
                        sortable
                        style={{ minWidth: "12rem" }}
                        
                      ></Column>
                      
                      <Column
                        field={(datetime) =>
                          moment(datetime.datetime).format("DD/MM/YYYY hh:mm A")
                        }
                        header="Thời gian theo dõi"
                        sortable
                        style={{ minWidth: "12rem" }}
                      ></Column>
                      
                    </DataTable>
                  </div>
                  <div className="tab-pane fade" id="join">
                  <Toolbar
                      className="mb-4"
                      left={leftToolbarTemplate1}
                      right={rightToolbarTemplate1}
                    ></Toolbar>

                    <DataTable
                      ref={dt1}
                      value={products1}
                      selection={selectedProducts1}
                      onSelectionChange={(e) => setSelectedProducts1(e.value)}
                      dataKey="id"
                      paginator
                      rows={10}
                      rowsPerPageOptions={[5, 10, 25]}
                      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                      currentPageReportTemplate="Đang hiển thị {first} đến {last} trong tổng số {totalRecords} người tham gia"
                      globalFilter={globalFilter}
                      header={header}
                    >   
                      <Column
                        field="user.email"
                        header="Email"
                        sortable
                        style={{ minWidth: "11rem" }}
                      ></Column>
                    
                      <Column
                        field="user.username"
                        header="Họ tên"
                        sortable
                        style={{ minWidth: "12rem" }}
                        
                      ></Column>
                      
                      <Column
                        field={(datetime) =>
                          moment(datetime.datetime).format("DD/MM/YYYY hh:mm A")
                        }
                        header="Thời gian tham gia"
                        sortable
                        style={{ minWidth: "12rem" }}
                      ></Column>
                    </DataTable>
                  </div>
                </div>
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
